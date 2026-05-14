'use server';

import { adminAuth } from '@/lib/firebase-admin';
import { serverDb } from '@/lib/firebase-server';
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/auth';

export async function setupDevBypassUser() {
  const uid = 'dev-super-admin-uid';
  const email = 'claudio@brignole.ch';

  try {
    // Create super_admin user if not exists
    const userRef = doc(serverDb, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        role: 'super_admin' as UserRole,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn("Dev bypass DB setup failed, but continuing log in:", e);
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set('__session', 'dev-bypass-token', {
    path: '/',
    maxAge: 3600,
    sameSite: 'lax',
    secure: false
  });

  return { success: true };
}

export async function getTenantId() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('__session')?.value;
    if (!session) {
      // Mock tenant ID to bypass login in development
      return 'dev-super-admin-uid';
    }
    
    if (session === 'dev-bypass-token') {
      return 'dev-super-admin-uid';
    }
    
    const decodedToken = await adminAuth.verifyIdToken(session);
    return decodedToken.uid;
  } catch (e) {
    return 'dev-super-admin-uid';
  }
}

