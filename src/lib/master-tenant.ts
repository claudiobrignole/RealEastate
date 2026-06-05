import { getDocData, setDocData } from '@/lib/server-db';
import { MASTER_TENANT_ID, MASTER_TENANT_NAME } from '@/lib/tenant-constants';

export { MASTER_TENANT_ID, MASTER_TENANT_NAME };

export async function ensureMasterTenant(): Promise<Record<string, unknown>> {
  const existing = await getDocData('tenants', MASTER_TENANT_ID);
  if (existing) return existing;

  const tenant = {
    id: MASTER_TENANT_ID,
    name: MASTER_TENANT_NAME,
    plan: 'pro',
    maxUsers: 99,
    currentUserCount: 1,
    isMaster: true,
    createdAt: new Date().toISOString(),
  };

  await setDocData('tenants', MASTER_TENANT_ID, tenant, true);
  return tenant;
}

export function isMasterTenantId(tenantId: string | null | undefined): boolean {
  return tenantId === MASTER_TENANT_ID;
}
