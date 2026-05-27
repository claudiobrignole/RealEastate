import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { adminAuth } from '@/lib/firebase-admin';
import { isAiStudio } from '@/lib/is-ai-studio';
import { getCurrentUser, verifyIdTokenSafe } from '@/lib/actions/auth';
import { getSuperAdminAllTenants } from '@/lib/actions/users';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = await isAiStudio();
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session && !isDev) {
    redirect('/login');
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  // If super admin, fetch all tenants
  let tenants: any[] = [];
  if (currentUser?.role === 'super_admin') {
    try {
      const fetchWithTimeout = Promise.race([
        getSuperAdminAllTenants(),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      const tenantsRes = await fetchWithTimeout;
      if (tenantsRes && tenantsRes.success && tenantsRes.data) {
        tenants = tenantsRes.data;
      }
    } catch (err) {
      console.warn('getSuperAdminAllTenants failed or timed out, using fallback empty array:', err);
      tenants = [];
    }
  }

  const activeTenantId = (currentUser?.role === 'super_admin' ? currentUser.activeTenantId : null) || cookieStore.get('__active_tenant')?.value || currentUser?.tenantId || 'dev-super-admin-uid';
  const activeTenantName = tenants.find(t => t.id === activeTenantId)?.name || (activeTenantId === 'dev-super-admin-uid' ? 'ZeroAgenzia Casa HQ' : 'Spazio Principale');

  const userData = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email,
    name: currentUser.name || (currentUser as any).displayName || currentUser.email?.split('@')[0] || 'Utente',
    role: currentUser.role,
    tenantId: currentUser.tenantId,
  } : {
    uid: 'dev-super-admin-uid',
    email: 'claudio.brignole@exmachina.ch',
    name: 'Claudio Brignole',
    role: 'super_admin' as const,
    tenantId: 'dev-super-admin-uid',
  };

  return (
    <DashboardLayout 
      user={userData} 
      tenants={tenants} 
      activeTenantId={activeTenantId} 
      activeTenantName={activeTenantName}
    >
      {children}
    </DashboardLayout>
  );
}
