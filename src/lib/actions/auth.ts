'use server';

import { adminAuth } from '@/lib/firebase-admin';
import { ensureUserProfile } from '@/lib/ensure-user-profile';
import { getDocData, setDocData, queryCollection } from '@/lib/server-db';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/auth';
import { allowDevAuthBypass } from '@/lib/env';
import { cache } from 'react';
import { ensureMasterTenant, MASTER_TENANT_ID } from '@/lib/master-tenant';

const DEV_UID = MASTER_TENANT_ID;
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

function getDevBypassUser(): Record<string, unknown> {
  return {
    uid: DEV_UID,
    email: process.env.DEV_SUPER_ADMIN_EMAIL || 'admin@localhost',
    name: 'Dev Super Admin',
    role: 'super_admin' as UserRole,
    tenantId: DEV_UID,
    createdAt: new Date().toISOString(),
  };
}

const globalUserCache = new Map<string, { data: Record<string, unknown>; timestamp: number }>();
const CACHE_TTL_MS = 20000;

async function verifySession(
  session: string
): Promise<{ uid: string; email?: string; name?: string } | null> {
  if (allowDevAuthBypass() && session === 'dev-bypass-token') {
    return { uid: DEV_UID };
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: (decoded as { name?: string }).name,
    };
  } catch {
    return null;
  }
}

function profileFromToken(verified: {
  uid: string;
  email?: string;
  name?: string;
}): Record<string, unknown> {
  const email = (verified.email || '').toLowerCase();
  const seedEmails = (process.env.ADMIN_SEED_EMAILS || process.env.DEV_SUPER_ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const role: UserRole = seedEmails.includes(email) ? 'super_admin' : 'tenant_admin';

  return {
    uid: verified.uid,
    email: email || `${verified.uid}@firebase.local`,
    name: verified.name || email.split('@')[0] || 'Utente',
    role,
    tenantId: DEV_UID,
  };
}

async function fetchUserByUid(uid: string): Promise<Record<string, unknown> | null> {
  if (allowDevAuthBypass() && uid === DEV_UID) {
    try {
      const data = await getDocData('users', uid);
      if (data) return data;
      const devUser = getDevBypassUser();
      await setDocData('users', DEV_UID, devUser, true);
      return devUser;
    } catch (error) {
      console.warn('Dev bypass: Firestore unavailable, using in-memory user:', error);
      return getDevBypassUser();
    }
  }

  try {
    const data = await getDocData('users', uid);
    if (data) return data;
    return await ensureUserProfile(uid);
  } catch (error) {
    console.error('fetchUserByUid error:', error);
    return null;
  }
}

const getCachedUser = cache(async (session: string | undefined) => {
  if (!session) return null;

  const now = Date.now();
  const cached = globalUserCache.get(session);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as {
      uid: string;
      email: string;
      role: UserRole;
      tenantId?: string;
      name?: string;
      activeTenantId?: string;
    };
  }

  const verified = await verifySession(session);
  if (!verified) return null;

  let res = await fetchUserByUid(verified.uid);
  if (!res && verified.email) {
    console.warn('Firestore profile missing/unavailable; using token fallback for', verified.uid);
    res = profileFromToken(verified);
  }
  if (!res) return null;

  const user = {
    uid: res.uid as string,
    email: res.email as string,
    role: res.role as UserRole,
    tenantId: res.tenantId as string | undefined,
    name: res.name as string | undefined,
    activeTenantId: res.activeTenantId as string | undefined,
  };

  globalUserCache.set(session, { data: user, timestamp: now });
  return user;
});

function invalidateSessionCache(session?: string) {
  if (session) globalUserCache.delete(session);
  globalUserCache.delete('dev-bypass-token');
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    let session = cookieStore.get('__session')?.value;
    const explicitLogout = cookieStore.get('__explicit_logout')?.value === 'true';

    if (!session && allowDevAuthBypass() && !explicitLogout) {
      session = 'dev-bypass-token';
    }

    if (!session) return null;
    return await getCachedUser(session);
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

export async function establishDevBypassSession() {
  if (!allowDevAuthBypass()) {
    return { success: false, error: 'Dev bypass disabilitato' };
  }

  try {
    const devUser = getDevBypassUser();
    await setDocData('users', DEV_UID, devUser, true);

    await ensureMasterTenant();
  } catch (error) {
    console.warn('Dev bypass: skipping Firestore seed (credentials missing?):', error);
  }

  const cookieStore = await cookies();
  cookieStore.delete('__explicit_logout');
  cookieStore.set('__session', 'dev-bypass-token', {
    path: '/',
    maxAge: 3600,
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  invalidateSessionCache();
  return { success: true };
}

export async function switchActiveTenant(tenantId: string | null) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'super_admin') {
      return { success: false, error: 'Unauthorized: Only Super Admins can switch spaces' };
    }

    const resolvedTenantId = tenantId || MASTER_TENANT_ID;
    await setDocData(
      'users',
      currentUser.uid,
      { activeTenantId: resolvedTenantId },
      true
    );

    const cookieStore = await cookies();
    const session = cookieStore.get('__session')?.value;
    invalidateSessionCache(session);

    if (resolvedTenantId === MASTER_TENANT_ID) {
      cookieStore.delete('__active_tenant');
    } else {
      cookieStore.set('__active_tenant', resolvedTenantId, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore';
    return { success: false, error: message };
  }
}

export async function getTenantId() {
  try {
    const cookieStore = await cookies();
    const activeTenant = cookieStore.get('__active_tenant')?.value;
    const currentUser = await getCurrentUser();

    if (currentUser) {
      if (currentUser.role === 'super_admin') {
        return (
          currentUser.activeTenantId ||
          activeTenant ||
          currentUser.tenantId ||
          DEV_UID
        );
      }
      return currentUser.tenantId || currentUser.uid;
    }

    return allowDevAuthBypass() ? DEV_UID : null;
  } catch {
    return allowDevAuthBypass() ? DEV_UID : null;
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('__session')?.value;
    invalidateSessionCache(session);

    if (session && session !== 'dev-bypass-token') {
      try {
        const decoded = await adminAuth.verifySessionCookie(session, true);
        await adminAuth.revokeRefreshTokens(decoded.sub);
      } catch {
        // ignore
      }
    }

    cookieStore.delete('__session');
    cookieStore.delete('__active_tenant');
    cookieStore.set('__explicit_logout', 'true', {
      path: '/',
      maxAge: 86400,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore';
    return { success: false, error: message };
  }
}

export async function updateCurrentUserProfile(data: { name: string; email: string }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Non autorizzato' };
    }

    const emailNormal = data.email.trim().toLowerCase();
    const existing = await queryCollection('users', [['email', '==', emailNormal]]);

    for (const row of existing) {
      if (row.id !== currentUser.uid) {
        return { success: false, error: 'Questa email è già utilizzata da un altro utente.' };
      }
    }

    await setDocData('users', currentUser.uid, {
      name: data.name.trim(),
      email: emailNormal,
    }, true);

    try {
      await adminAuth.updateUser(currentUser.uid, {
        email: emailNormal,
        displayName: data.name.trim(),
      });
    } catch (e) {
      console.warn('Firebase Auth profile sync skipped:', e);
    }

    const cookieStore = await cookies();
    invalidateSessionCache(cookieStore.get('__session')?.value);

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore';
    return { success: false, error: message };
  }
}

export async function getAvailableTestUsers() {
  if (!allowDevAuthBypass()) {
    return { success: true, data: [] };
  }
  try {
    const users = await queryCollection('users');
    return {
      success: true,
      data: users.map((u) => ({
        uid: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
      })),
    };
  } catch {
    return { success: true, data: [] };
  }
}
