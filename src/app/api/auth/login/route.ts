import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getAdminSeedEmails } from '@/lib/env';
import { getDocData, setDocData, queryCollection } from '@/lib/server-db';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_TENANT_ID = 'dev-super-admin-uid';

async function ensureDefaultTenant() {
  const tenant = await getDocData('tenants', DEFAULT_TENANT_ID);
  if (!tenant) {
    await setDocData('tenants', DEFAULT_TENANT_ID, {
      id: DEFAULT_TENANT_ID,
      name: 'ZeroAgenzia Casa HQ',
      plan: 'pro',
      maxUsers: 99,
      currentUserCount: 1,
      createdAt: new Date().toISOString(),
    });
  }
}

async function migrateFirestoreUserToAuth(
  email: string,
  password: string,
  firestoreUser: Record<string, unknown> & { id: string }
) {
  try {
    const record = await adminAuth.getUserByEmail(email);
    return record.uid;
  } catch {
    // create new Firebase Auth user
  }

  const record = await adminAuth.createUser({
    email,
    password,
    displayName: (firestoreUser.name as string) || email,
  });

  await setDocData('users', record.uid, {
    uid: record.uid,
    email,
    name: firestoreUser.name,
    role: firestoreUser.role,
    tenantId: firestoreUser.tenantId,
    createdAt: firestoreUser.createdAt || new Date().toISOString(),
  }, true);

  if (firestoreUser.id !== record.uid) {
    // keep legacy doc; admin can clean up duplicates later
  }

  return record.uid;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, idToken } = await req.json();

    if (idToken && typeof idToken === 'string') {
      const decoded = await adminAuth.verifyIdToken(idToken);
      const user = await getDocData('users', decoded.uid);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Profilo utente non configurato nel CRM.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, uid: decoded.uid });
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e password richieste.' },
        { status: 400 }
      );
    }

    const emailNormal = email.trim().toLowerCase();
    const typedPassword = password.trim();
    const seedEmails = getAdminSeedEmails();

    if (seedEmails.includes(emailNormal)) {
      const existing = await queryCollection('users', [['email', '==', emailNormal]]);
      if (existing.length === 0) {
        await ensureDefaultTenant();
        const record = await adminAuth.createUser({
          email: emailNormal,
          password: typedPassword,
          displayName: emailNormal.split('@')[0],
        });
        await setDocData('users', record.uid, {
          uid: record.uid,
          email: emailNormal,
          name: emailNormal.split('@')[0],
          role: 'super_admin' as UserRole,
          tenantId: DEFAULT_TENANT_ID,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const users = await queryCollection('users', [['email', '==', emailNormal]]);
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Credenziali non valide o utente non registrato.' },
        { status: 401 }
      );
    }

    const firestoreUser = users[0] as Record<string, unknown> & { id: string };

    if (firestoreUser.password && firestoreUser.password !== typedPassword) {
      return NextResponse.json({ success: false, error: 'Password non corretta.' }, { status: 401 });
    }

    try {
      await adminAuth.getUserByEmail(emailNormal);
    } catch {
      await migrateFirestoreUserToAuth(emailNormal, typedPassword, firestoreUser);
    }

    return NextResponse.json({
      success: true,
      useClientSignIn: true,
      message: 'Usa Firebase Auth dal client per completare il login.',
    });
  } catch (error: unknown) {
    console.error('API login error:', error);
    const message = error instanceof Error ? error.message : 'Errore interno del server';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
