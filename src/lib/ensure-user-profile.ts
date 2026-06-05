import { adminAuth } from '@/lib/firebase-admin';
import { getDocData, setDocData } from '@/lib/server-db';
import { UserRole } from '@/types/auth';
import { ensureMasterTenant, MASTER_TENANT_ID } from '@/lib/master-tenant';

export async function ensureUserProfile(uid: string): Promise<Record<string, unknown> | null> {
  const existing = await getDocData('users', uid);
  if (existing) return existing;

  try {
    const authUser = await adminAuth.getUser(uid);
    const email = authUser.email?.toLowerCase() || '';
    const seedEmails = (process.env.ADMIN_SEED_EMAILS || process.env.DEV_SUPER_ADMIN_EMAIL || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const role: UserRole =
      seedEmails.includes(email) ? 'super_admin' : 'tenant_admin';

    const profile = {
      uid,
      email,
      name: authUser.displayName || email.split('@')[0] || 'Utente',
      role,
      tenantId: MASTER_TENANT_ID,
      createdAt: new Date().toISOString(),
    };

    await setDocData('users', uid, profile, true);
    await ensureMasterTenant();

    return profile;
  } catch (error) {
    console.error('ensureUserProfile failed:', error);
    return null;
  }
}
