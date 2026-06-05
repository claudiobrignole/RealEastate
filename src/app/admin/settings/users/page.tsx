import { getCurrentUser } from '@/lib/actions/auth';
import UsersSettingsClient from './UsersSettingsClient';

export default async function UsersSettingsPage() {
  const currentUser = await getCurrentUser();

  const initialUser = currentUser
    ? {
        uid: currentUser.uid,
        email: currentUser.email,
        role: currentUser.role,
        tenantId: currentUser.tenantId,
        name: currentUser.name,
        activeTenantId: currentUser.activeTenantId,
      }
    : null;

  return <UsersSettingsClient initialUser={initialUser} />;
}
