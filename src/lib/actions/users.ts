'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/auth';
import { FieldValue } from 'firebase-admin/firestore';

async function getCurrentUserDoc() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(session);
    const userSnapshot = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userSnapshot.exists) return null;
    return userSnapshot.data() as { uid: string, email: string, role: UserRole, tenantId?: string, name?: string };
  } catch (error) {
    return null;
  }
}

export async function createTenantUser(data: { name: string, email: string, password: string, role?: UserRole }) {
  try {
    const currentUser = await getCurrentUserDoc();
    if (!currentUser) return { success: false, error: 'Non autorizzato' };
    
    // Check role
    if (currentUser.role !== 'tenant_admin' && currentUser.role !== 'super_admin') {
      return { success: false, error: 'Privilegi insufficienti per creare utenti' };
    }

    const tenantId = currentUser.role === 'super_admin' ? currentUser.tenantId || currentUser.uid : currentUser.tenantId;

    if (!tenantId) {
      return { success: false, error: 'Nessun tenant associato' };
    }

    const tenantRef = adminDb.collection('tenants').doc(tenantId);
    const tenantDoc = await tenantRef.get();
    
    if (!tenantDoc.exists) {
      return { success: false, error: 'Tenant non trovato' };
    }

    const tenantData = tenantDoc.data();
    const currentUserCount = tenantData?.currentUserCount || 0;
    const maxUsers = tenantData?.maxUsers || 0;

    if (currentUserCount >= maxUsers) {
      return { success: false, error: 'Limite utenti raggiunto per questo abbonamento' };
    }

    // Create user via Admin Auth
    const newUserRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    // Create user doc
    const newRole = data.role || 'tenant_user';
    await adminDb.collection('users').doc(newUserRecord.uid).set({
      uid: newUserRecord.uid,
      email: data.email,
      name: data.name,
      role: newRole,
      tenantId: tenantId,
      createdAt: new Date().toISOString(),
    });

    // Increment tenant user count
    await tenantRef.update({
      currentUserCount: FieldValue.increment(1)
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error creating tenant user:', error);
    return { success: false, error: error.message };
  }
}

export async function getTenantUsers() {
  try {
    const currentUser = await getCurrentUserDoc();
    if (!currentUser) return { success: false, error: 'Non autorizzato' };

    const tenantId = currentUser.role === 'super_admin' ? currentUser.tenantId || currentUser.uid : currentUser.tenantId;
    if (!tenantId) {
      return { success: false, error: 'Nessun tenant associato' };
    }

    const usersSnapshot = await adminDb.collection('users').where('tenantId', '==', tenantId).get();
    const users = usersSnapshot.docs.map(doc => doc.data() as any);

    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
