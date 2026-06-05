'use server';

import { getDocData, setDocData } from '@/lib/server-db';
import { getTenantId, getCurrentUser } from './auth';

export async function createTenant(tenantData: Record<string, unknown>) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');

    await setDocData('tenants', tenantId, {
      ...tenantData,
      plan: 'starter',
      maxUsers: 1,
      currentUserCount: 1,
      createdAt: new Date().toISOString(),
    }, true);

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function getTenantSettings() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };

    const data = await getDocData('tenants', tenantId);
    return { success: true, data: data as Record<string, unknown> | null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function updateTenantMetaStatus(metaConnected: boolean) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');
    await setDocData('tenants', tenantId, { metaConnected }, true);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
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

    await setDocData('tenants', tenantId, {
      metaConnected: data.metaConnected,
      metaAccessToken: data.metaAccessToken ?? null,
      metaPageId: data.metaPageId ?? null,
      metaPageName: data.metaPageName ?? null,
      metaFormId: data.metaFormId ?? null,
    }, true);

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function updateTenantMetaConnection(
  tenantId: string,
  data: { metaPageId: string; metaAccessToken: string }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const isSuperAdmin = user.role === 'super_admin';
    const isTenantAdminOfTarget = user.role === 'tenant_admin' && user.tenantId === tenantId;

    if (!isSuperAdmin && !isTenantAdminOfTarget) {
      return { success: false, error: 'Non autorizzato' };
    }

    await setDocData('tenants', tenantId, {
      metaPageId: data.metaPageId,
      metaAccessToken: data.metaAccessToken,
      metaConnected: true,
      metaConnectedAt: new Date().toISOString(),
    }, true);

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Errore' };
  }
}

export async function getMetaOAuthUrl(): Promise<string> {
  const tenantId = await getTenantId();
  if (!tenantId) throw new Error('Unauthorized');

  const appId = process.env.META_APP_ID || '';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const callbackUrl = `${baseUrl}/api/meta/callback`;

  return `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=pages_show_list,leads_retrieval,pages_read_engagement&response_type=code&state=${tenantId}`;
}
