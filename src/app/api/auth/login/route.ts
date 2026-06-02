import { serverDb } from '@/lib/firebase-server';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = [
  'claudio.brignole@exmachina.ch',
  'sebastiano.cobianco@exmachina.ch',
  'admin@exmachina.ch'
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email richiesta.' }, { status: 400 });
    }

    const emailNormal = email.trim().toLowerCase();
    const typedPassword = password ? password.trim() : '';

    // Step 1: Detect admin automatic registration/seed
    const isAdminEmail = ADMIN_EMAILS.includes(emailNormal);

    if (isAdminEmail) {
      // Check if user exists
      const usersQuery = query(collection(serverDb, 'users'), where('email', '==', emailNormal));
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        // Automatically create this superadmin user!
        const userUid = 'super_admin_live_' + Math.random().toString(36).substring(2, 11);
        const seedPassword = typedPassword || 'admin';
        
        await setDoc(doc(serverDb, 'users', userUid), {
          uid: userUid,
          email: emailNormal,
          name: emailNormal.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          role: 'super_admin' as UserRole,
          tenantId: 'dev-super-admin-uid',
          password: seedPassword,
          createdAt: new Date().toISOString(),
        });

        // Ensure default tenant exists
        const tenantRef = doc(serverDb, 'tenants', 'dev-super-admin-uid');
        const tenantDoc = await getDoc(tenantRef);
        if (!tenantDoc.exists()) {
          await setDoc(tenantRef, {
            id: 'dev-super-admin-uid',
            name: 'ZeroAgenzia Casa HQ',
            plan: 'pro',
            maxUsers: 99,
            currentUserCount: 1,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // User exists, check if they have no password set in Firestore
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        if (!userData.password && typedPassword) {
          // Sync/save the typed password so they configure it instantly on their first attempt
          await setDoc(doc(serverDb, 'users', userDoc.id), {
            password: typedPassword
          }, { merge: true });
        }
      }
    }

    // Find user in Firestore
    const usersQuery = query(collection(serverDb, 'users'), where('email', '==', emailNormal));
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return NextResponse.json({ success: false, error: 'Credenziali non valide o utente non registrato.' }, { status: 401 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify password if provided/set
    if (userData.password && userData.password !== typedPassword) {
      return NextResponse.json({ success: false, error: 'Password non corretta.' }, { status: 401 });
    }

    // Set cookie session using fallback mock jwt
    const bypassToken = `bypass-jwt-${userDoc.id}`;
    const cookieStore = await cookies();
    cookieStore.delete('__explicit_logout');
    cookieStore.set('__session', bypassToken, {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      secure: false
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API login error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Errore interno del server' }, { status: 500 });
  }
}
