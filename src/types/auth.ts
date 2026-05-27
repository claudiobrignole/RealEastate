export type UserRole = 'super_admin' | 'tenant_admin' | 'tenant_user';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  createdAt: string;
}

export interface TenantData {
  id: string;
  name: string;
  plan: 'starter' | 'pro' | 'enterprise';
  maxUsers: number;
  currentUserCount: number;
  createdAt: string;
  metaPageId?: string;
  metaAccessToken?: string;
  metaConnected?: boolean;
}
