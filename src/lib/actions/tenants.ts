'use server';

import { serverDb } from '@/lib/firebase-server';
import { doc, setDoc } from 'firebase/firestore/lite';
import { getTenantId, getCurrentUser } from './auth';

export async function createTenant(tenantData: any) {
  try {
    const tenantId = await getTenantId(); 
    if (!tenantId) throw new Error('Unauthorized');
    
    const docRef = doc(serverDb, 'tenants', tenantId);
    await setDoc(docRef, {
      ...tenantData,
      plan: 'starter',
      maxUsers: 1,
      currentUserCount: 1,
      createdAt: new Date().toISOString()
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTenantSettings() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };

    const { getDoc } = await import('firebase/firestore/lite');
    const docRef = doc(serverDb, 'tenants', tenantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: true, data: null };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantMetaStatus(metaConnected: boolean) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');

    const docRef = doc(serverDb, 'tenants', tenantId);
    await setDoc(docRef, { metaConnected }, { merge: true });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantMetaConfig(data: {
  metaConnected: boolean;
  metaAccessToken?: string | null;
  metaPageId?: string | null;
  metaPageName?: string | null;
  metaFormId?: string | null;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');

    const docRef = doc(serverDb, 'tenants', tenantId);
    await setDoc(docRef, {
      metaConnected: data.metaConnected,
      metaAccessToken: data.metaAccessToken ?? null,
      metaPageId: data.metaPageId ?? null,
      metaPageName: data.metaPageName ?? null,
      metaFormId: data.metaFormId ?? null,
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantMetaConnection(
  tenantId: string,
  data: { metaPageId: string; metaAccessToken: string }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const isSuperAdmin = user.role === 'super_admin';
    const isTenantAdminOfTarget = user.role === 'tenant_admin' && user.tenantId === tenantId;

    if (!isSuperAdmin && !isTenantAdminOfTarget) {
      return { success: false, error: 'Non autorizzato' };
    }

    const docRef = doc(serverDb, 'tenants', tenantId);
    await setDoc(docRef, {
      metaPageId: data.metaPageId,
      metaAccessToken: data.metaAccessToken,
      metaConnected: true,
      metaConnectedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

