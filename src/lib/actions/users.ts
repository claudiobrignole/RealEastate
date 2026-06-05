'use server';

import { adminAuth } from '@/lib/firebase-admin';
import {
  deleteDocData,
  getDocData,
  incrementField,
  queryCollection,
  setDocData,
} from '@/lib/server-db';
import { getCurrentUser, getTenantId } from './auth';
import { UserRole } from '@/types/auth';
import {
  ensureMasterTenant,
  isMasterTenantId,
  MASTER_TENANT_ID,
  MASTER_TENANT_NAME,
} from '@/lib/master-tenant';

export async function verifyIsSuperAdmin() {
  const user = await getCurrentUser();
  return user && user.role === 'super_admin';
}

export async function verifyIsTenantAdmin() {
  const user = await getCurrentUser();
  return user && (user.role === 'tenant_admin' || user.role === 'super_admin');
}

export async function createTenantUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  tenantId?: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Non autorizzato' };
    if (currentUser.role !== 'tenant_admin' && currentUser.role !== 'super_admin') {
      return { success: false, error: 'Privilegi insufficienti per creare utenti' };
    }

    let tenantId =
      currentUser.role === 'super_admin' && data.tenantId
        ? data.tenantId
        : await getTenantId();
    if (!tenantId) return { success: false, error: 'Nessuno spazio di lavoro attivo' };

    if (isMasterTenantId(tenantId)) {
      await ensureMasterTenant();
    }

    let tenant = await getDocData('tenants', tenantId);
    if (!tenant && isMasterTenantId(tenantId)) {
      tenant = await ensureMasterTenant();
    }
    if (!tenant) {
      return {
        success: false,
        error: `Spazio di lavoro non trovato. Seleziona uno spazio valido dal menu in alto (Spazio: …).`,
      };
    }

    const currentUserCount = (tenant.currentUserCount as number) || 0;
    const maxUsers = (tenant.maxUsers as number) || 10;
    if (currentUserCount >= maxUsers) {
      return { success: false, error: `Limite utenti raggiunto (${maxUsers})` };
    }

    const record = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    await setDocData('users', record.uid, {
      uid: record.uid,
      email: data.email,
      name: data.name,
      role: data.role || 'tenant_user',
      tenantId,
      createdAt: new Date().toISOString(),
    });

    await incrementField('tenants', tenantId, 'currentUserCount', 1);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function deleteTenantUser(uid: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Non autorizzato' };

    const target = await getDocData('users', uid);
    if (!target) return { success: false, error: 'Utente non trovato' };

    if (currentUser.role !== 'super_admin') {
      if (currentUser.role !== 'tenant_admin') {
        return { success: false, error: 'Privilegi insufficienti' };
      }
      if (target.tenantId !== currentUser.tenantId) {
        return { success: false, error: 'Non puoi eliminare utenti di un altro cliente' };
      }
      if (currentUser.uid === uid) {
        return { success: false, error: 'Non puoi eliminare te stesso' };
      }
    }

    try {
      await adminAuth.deleteUser(uid);
    } catch {
      // already deleted in Auth
    }

    await deleteDocData('users', uid);

    if (target.tenantId) {
      await incrementField('tenants', target.tenantId as string, 'currentUserCount', -1);
    }

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function getTenantUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Non autorizzato' };

    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Nessuno spazio associato' };

    if (isMasterTenantId(tenantId)) {
      await ensureMasterTenant();
    }

    const users = await queryCollection('users', [['tenantId', '==', tenantId]]);
    if (users.length === 0) {
      return {
        success: true,
        data: [{
          uid: currentUser.uid,
          name: currentUser.name || currentUser.email?.split('@')[0],
          email: currentUser.email,
          role: currentUser.role,
          tenantId,
        }],
      };
    }

    return {
      success: true,
      data: users.map((u) => ({ uid: u.id, ...u })),
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

let cachedTenants: Array<Record<string, unknown>> | null = null;
let cachedTenantsTime = 0;
const TENANT_CACHE_TTL = 120000;

export async function getSuperAdminAllUsers() {
  try {
    if (!(await verifyIsSuperAdmin())) return { success: false, error: 'Accesso vietato' };
    const users = await queryCollection('users');
    return { success: true, data: users.map((u) => ({ uid: u.id, ...u })) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function getSuperAdminAllTenants() {
  try {
    if (!(await verifyIsSuperAdmin())) return { success: false, error: 'Accesso vietato' };

    const now = Date.now();
    if (cachedTenants && now - cachedTenantsTime < TENANT_CACHE_TTL) {
      return { success: true, data: cachedTenants };
    }

    await ensureMasterTenant();

    const tenants = await queryCollection('tenants');
    tenants.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    if (!tenants.some((t) => t.id === MASTER_TENANT_ID)) {
      tenants.unshift({
        id: MASTER_TENANT_ID,
        name: MASTER_TENANT_NAME,
        plan: 'pro',
        maxUsers: 99,
        isMaster: true,
      });
    }

    cachedTenants = tenants;
    cachedTenantsTime = now;

    return { success: true, data: cachedTenants };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function createClientTenantAndAdmin(data: {
  tenantName: string;
  plan: 'starter' | 'pro' | 'enterprise';
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
}) {
  try {
    if (!(await verifyIsSuperAdmin())) return { success: false, error: 'Accesso vietato' };

    const tenantId = `tenant_${Math.random().toString(36).slice(2, 11)}`;
    let maxUsers = 1;
    if (data.plan === 'starter') maxUsers = 2;
    if (data.plan === 'pro') maxUsers = 5;
    if (data.plan === 'enterprise') maxUsers = 20;

    const adminPassword = data.adminPassword || 'ZeroPass123!';

    await setDocData('tenants', tenantId, {
      id: tenantId,
      name: data.tenantName,
      plan: data.plan,
      maxUsers,
      currentUserCount: 1,
      createdAt: new Date().toISOString(),
    });

    const record = await adminAuth.createUser({
      email: data.adminEmail,
      password: adminPassword,
      displayName: data.adminName,
    });

    await setDocData('users', record.uid, {
      uid: record.uid,
      email: data.adminEmail,
      name: data.adminName,
      role: 'tenant_admin' as UserRole,
      tenantId,
      createdAt: new Date().toISOString(),
    });

    cachedTenants = null;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function deleteClientTenant(tenantId: string) {
  try {
    if (!(await verifyIsSuperAdmin())) return { success: false, error: 'Accesso vietato' };
    if (tenantId === 'dev-super-admin-uid') {
      return { success: false, error: 'Impossibile eliminare lo spazio Core Master.' };
    }

    const users = await queryCollection('users', [['tenantId', '==', tenantId]]);
    for (const user of users) {
      try {
        await adminAuth.deleteUser(user.id);
      } catch {
        // ignore
      }
      await deleteDocData('users', user.id);
    }

    await deleteDocData('tenants', tenantId);
    cachedTenants = null;
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}
