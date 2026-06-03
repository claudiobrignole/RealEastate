'use client';

import { useState, useEffect } from 'react';
import { 
  createTenantUser, 
  getTenantUsers, 
  deleteTenantUser,
  getSuperAdminAllTenants,
  createClientTenantAndAdmin,
  deleteClientTenant
} from '@/lib/actions/users';
import { getCurrentUser, switchActiveTenant } from '@/lib/actions/auth';
import { 
  Loader2, 
  Plus, 
  Users, 
  Building2, 
  Shield, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { UserRole } from '@/types/auth';

export default function UsersSettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'spaces'>('users');
  
  // States for Local Workers Management
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('tenant_user');
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // States for Client Spaces Management (Super-Admin)
  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpacePlan, setNewSpacePlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [newSpaceAdminName, setNewSpaceAdminName] = useState('');
  const [newSpaceAdminEmail, setNewSpaceAdminEmail] = useState('');
  const [newSpaceAdminPassword, setNewSpaceAdminPassword] = useState('');
  const [spaceFormLoading, setSpaceFormLoading] = useState(false);
  const [spaceError, setSpaceError] = useState('');
  const [spaceSuccess, setSpaceSuccess] = useState('');

  // General App Setup on Mount
  useEffect(() => {
    let active = true;
    const fetchProfileAndData = async () => {
      try {
        let user: any = null;
        try {
          user = await getCurrentUser();
        } catch (serverActionErr) {
          console.warn('getCurrentUser Server Action not found, falling back to REST API endpoint:', serverActionErr);
          const apiRes = await fetch('/api/auth/session');
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.success) {
              user = data.user;
            }
          }
        }

        if (!active) return;
        setCurrentUser(user);
        
        // Load active workspace users and tenants in parallel to decrease load times!
        const promises: Promise<any>[] = [fetchUsers()];
        if (user && user.role === 'super_admin') {
          promises.push(fetchClientTenants());
        }
        await Promise.all(promises);
      } catch (err) {
        console.error("fetchProfileAndData error:", err);
      } finally {
        if (active) {
          setUsersLoading(false);
          setTenantsLoading(false);
        }
      }
    };
    fetchProfileAndData();
    return () => {
      active = false;
    };
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      let res: any = null;
      try {
        res = await getTenantUsers();
      } catch (serverActionErr) {
        console.warn('getTenantUsers Server Action not found, falling back to REST API:', serverActionErr);
        const apiRes = await fetch('/api/users/list');
        if (apiRes.ok) {
          res = await apiRes.json();
        }
      }

      if (res && res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchClientTenants = async () => {
    setTenantsLoading(true);
    try {
      let res: any = null;
      try {
        res = await getSuperAdminAllTenants();
      } catch (serverActionErr) {
        console.warn('getSuperAdminAllTenants Server Action not found, falling back to REST API:', serverActionErr);
        const apiRes = await fetch('/api/tenants/list');
        if (apiRes.ok) {
          res = await apiRes.json();
        }
      }

      if (res && res.success && res.data) {
        setTenants(res.data);
      }
    } catch (err) {
      console.error("fetchClientTenants error:", err);
    } finally {
      setTenantsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');
    setUserFormLoading(true);

    try {
      const res = await createTenantUser({ name, email, password, role });
      if (res.success) {
        setUserSuccess('Membro del team creato con successo!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('tenant_user');
        await fetchUsers();
      } else {
        setUserError(res.error || 'Errore durante la creazione.');
      }
    } catch (err: any) {
      setUserError(err.message || 'Errore di rete');
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo utente? Questa operazione è irreversibile.')) {
      return;
    }

    try {
      const res = await deleteTenantUser(uid);
      if (res.success) {
        await fetchUsers();
      } else {
        alert(res.error || 'Impossibile eliminare l\'utente.');
      }
    } catch (err: any) {
      alert(err.message || 'Errore di connessione');
    }
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpaceError('');
    setSpaceSuccess('');
    setSpaceFormLoading(true);

    try {
      const res = await createClientTenantAndAdmin({
        tenantName: newSpaceName,
        plan: newSpacePlan,
        adminName: newSpaceAdminName,
        adminEmail: newSpaceAdminEmail,
        adminPassword: newSpaceAdminPassword || undefined
      });

      if (res.success) {
        setSpaceSuccess('Nuovo spazio cliente e account amministratore creati con successo!');
        setNewSpaceName('');
        setNewSpaceAdminName('');
        setNewSpaceAdminEmail('');
        setNewSpaceAdminPassword('');
        await fetchClientTenants();
      } else {
        setSpaceError(res.error || 'Errore durante la creazione dello spazio.');
      }
    } catch (err: any) {
      setSpaceError(err.message || 'Errore di rete');
    } finally {
      setSpaceFormLoading(false);
    }
  };

  const handleDeleteSpace = async (tenantId: string, tenantName: string) => {
    if (!window.confirm(`ATTENZIONE ESTREMA: Sei sicuro di voler eliminare lo spazio di "${tenantName}"?\nL'eliminazione cancellerà definitivamente tutti gli utenti dell'azienda, landing, dati e accessi. Questa operazione non può essere annullata.`)) {
      return;
    }

    try {
      const res = await deleteClientTenant(tenantId);
      if (res.success) {
        await fetchClientTenants();
      } else {
        alert(res.error || 'Impossibile eliminare lo spazio cliente.');
      }
    } catch (err: any) {
      alert(err.message || 'Errore di connessione');
    }
  };

  const handleSwitchTenant = async (tenantId: string | null) => {
    const res = await switchActiveTenant(tenantId);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || 'Errore cambio area di lavoro');
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-data-point text-on-surface mb-2 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-primary" /> Multi-Tenant & Utenti
        </h1>
        <p className="text-on-surface-variant font-data-point text-sm">
          Gestisci gli abbonamenti dei tuoi clienti, gli spazi di lavoro e gli utenti interni.
        </p>
      </div>

      {/* Tabs Menu for Super Admins */}
      {isSuperAdmin && (
        <div className="flex border-b border-outline-variant gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Users className="w-4 h-4" /> Gestione Membri Team
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'spaces'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Building2 className="w-4 h-4" /> Spazi Clienti (Multi-Tenant)
          </button>
        </div>
      )}

      {/* TAB 1: USERS MANAGEMENT (ACTIVE TENANT) */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-surface/50 p-4 border border-outline-variant rounded-xl flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-secondary-dim" />
            <p className="text-xs text-on-surface-variant">
              Stai gestendo i membri del team per lo spazio attivo corrente. Per aggiungere o visualizzare membri di un altro cliente, seleziona lo spazio corrispondente nell&apos;intestazione in alto o nella scheda &quot;Spazi Clienti&quot;.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Form */}
            <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm h-min">
              <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-primary" /> Crea Nuovo Utente
              </h2>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                {userError && <div className="p-3 bg-error-container text-on-error-container rounded-lg text-xs">{userError}</div>}
                {userSuccess && <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs">{userSuccess}</div>}

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Claudio Brignole"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Email di Login</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g. claudio.brignole@exmachina.ch"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Password Iniziale (min. 6 car.)</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    placeholder="Scegli password sicura"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Ruolo Operativo</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 text-sm bg-surface-container text-on-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="tenant_user">Membro Team (Può modificare landing e CRM)</option>
                    <option value="tenant_admin">Admin Spazio Cliente (Può creare/cancellare membri + collegare Meta)</option>
                    {isSuperAdmin && <option value="super_admin">Super Admin Master (Modifica tutto)</option>}
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {userFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crea Utente
                </button>
              </form>
            </section>
            
            {/* User List */}
            <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col h-full min-h-[400px]">
              <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">
                Utenti Attivi nello Spazio
              </h2>
              
              <div className="flex-grow">
                {usersLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-on-surface-variant flex h-48 items-center justify-center">
                    Nessun utente configurato in questa area.
                  </p>
                ) : (
                  <ul className="divide-y divide-outline-variant">
                    {users.map((u) => {
                      const isMe = currentUser?.uid === u.uid || (u.uid === 'dev-super-admin-uid' && !currentUser?.uid);
                      
                      return (
                        <li key={u.uid} className="py-3.5 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-on-surface truncate">{u.name || 'Senza Nome'}</p>
                              {isMe && <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">Tu</span>}
                            </div>
                            <p className="text-xs text-on-surface-variant truncate">{u.email}</p>
                          </div>
                          
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase ${
                              u.role === 'super_admin' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : u.role === 'tenant_admin'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role === 'super_admin' ? 'Super Admin' : u.role === 'tenant_admin' ? 'Amministratore' : 'Membro'}
                            </span>

                            {(!isMe && (currentUser?.role === 'super_admin' || currentUser?.role === 'tenant_admin')) && (
                              <button
                                onClick={() => handleDeleteUser(u.uid)}
                                className="p-1 px-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="Elimina questo utente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT WORKSPACES / MULTI-TENANT (SUPER-ADMIN ONLY) */}
      {activeTab === 'spaces' && isSuperAdmin && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Tenant Form */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm h-min">
            <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-primary" /> Crea Nuovo Spazio Cliente
            </h2>
            
            <form onSubmit={handleCreateSpace} className="space-y-4">
              {spaceError && <div className="p-3 bg-error-container text-on-error-container rounded-lg text-xs">{spaceError}</div>}
              {spaceSuccess && <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs">{spaceSuccess}</div>}

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Nome Spazio Cliente</label>
                <input
                  type="text"
                  required
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="E.g. Immobiliare Rossi S.p.A."
                  className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Piano Abbonamento (Limiti Utenti)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSpacePlan('starter')}
                    className={`p-2 border rounded-lg text-center transition-all ${
                      newSpacePlan === 'starter'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <p className="text-xs uppercase">Starter</p>
                    <p className="text-[10px] text-on-surface-variant font-normal">Max 2 Utenti</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSpacePlan('pro')}
                    className={`p-2 border rounded-lg text-center transition-all ${
                      newSpacePlan === 'pro'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <p className="text-xs uppercase">Pro</p>
                    <p className="text-[10px] text-on-surface-variant font-normal">Max 5 Utenti</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSpacePlan('enterprise')}
                    className={`p-2 border rounded-lg text-center transition-all ${
                      newSpacePlan === 'enterprise'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <p className="text-xs uppercase font-bold">Ent.</p>
                    <p className="text-[10px] text-on-surface-variant font-normal">Max 20 Utenti</p>
                  </button>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-3 space-y-3">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Account Manager Primario</p>
                
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">Nome Admin</label>
                  <input
                    type="text"
                    required
                    value={newSpaceAdminName}
                    onChange={(e) => setNewSpaceAdminName(e.target.value)}
                    placeholder="Mario Rossi"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">Email di Login</label>
                  <input
                    type="email"
                    required
                    value={newSpaceAdminEmail}
                    onChange={(e) => setNewSpaceAdminEmail(e.target.value)}
                    placeholder="mario@rossi.it"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">Password d&apos;Accesso (vuoto per &quot;ZeroPass123!&quot;)</label>
                  <input
                    type="password"
                    value={newSpaceAdminPassword}
                    onChange={(e) => setNewSpaceAdminPassword(e.target.value)}
                    placeholder="Lascia vuoto per password di default"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={spaceFormLoading}
                className="w-full bg-secondary-dim text-on-secondary-container py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {spaceFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Crea Spazio & Admin
              </button>
            </form>
          </section>

          {/* Tenants List */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">
              Spazi Clienti Attivi ({tenants.length})
            </h2>

            <div className="flex-grow">
              {tenantsLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : tenants.length === 0 ? (
                <div className="p-8 text-center italic text-sm text-on-surface-variant h-48 flex items-center justify-center">
                  Nessun cliente registrato oltre il Core Master.
                </div>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {/* Default / Core Space and Registered Tenants list joined cleanly with unique keys */}
                  {[
                    <div key="core-master" className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-on-surface">ZeroAgenzia Casa HQ (Master)</p>
                        <p className="text-xs text-on-surface-variant">Spazio Core Amministrativo • Senza limite utenti</p>
                      </div>
                      <button
                        onClick={() => handleSwitchTenant(null)}
                        className="px-2.5 py-1 text-xs bg-surface border border-outline-variant hover:bg-surface-container-high rounded flex items-center gap-1 transition-colors cursor-pointer text-primary"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Accedi
                      </button>
                    </div>,
                    ...tenants.map((t) => (
                      <div key={t.id} className="py-4 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-on-surface truncate">{t.name}</p>
                            <span className="text-[9px] uppercase font-extrabold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded-full shrink-0">
                              {t.plan || 'pro'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant">
                            Utenti: {t.currentUserCount || 1} / {t.maxUsers || 5} max
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleSwitchTenant(t.id)}
                            className="px-2.5 py-1 text-xs bg-surface border border-outline-variant hover:bg-surface-container-high rounded flex items-center gap-1 transition-colors cursor-pointer text-secondary-dim font-medium"
                            title="Accedi a questa area cliente"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Accedi
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSpace(t.id, t.name)}
                            className="p-1 px-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded transition-colors cursor-pointer flex items-center text-xs"
                            title="Elimina Spazio Cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ]}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
