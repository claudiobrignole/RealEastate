'use client';

import { useState, useEffect } from 'react';
import { createTenantUser, getTenantUsers } from '@/lib/actions/users';
import { Loader2, Plus, Users } from 'lucide-react';
import { UserRole } from '@/types/auth';

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('tenant_user');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getTenantUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);

    try {
      const res = await createTenantUser({ name, email, password, role });
      if (res.success) {
        setSuccess('Utente creato con successo!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('tenant_user');
        fetchUsers();
      } else {
        setError(res.error || 'Errore durante la creazione.');
      }
    } catch (err: any) {
      setError(err.message || 'Errore di rete');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-data-point text-on-surface mb-2 flex items-center gap-2">
          <Users className="w-6 h-6" /> Gestione Membri Team
        </h1>
        <p className="text-on-surface-variant font-data-point">
          Aggiungi nuovi dipendenti al tuo account. Il numero massimo di utenti dipende dal tuo abbonamento.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm h-min">
          <h2 className="text-lg font-data-point text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5" /> Aggiungi nuovo membro
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Ruolo</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2 bg-surface text-on-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="tenant_user">Membro (Tenant User)</option>
                <option value="tenant_admin">Amministratore (Tenant Admin)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary text-on-primary py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Crea Utente
            </button>
          </form>
        </section>
        
        <section className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-lg font-data-point text-on-surface border-b border-outline-variant pb-2 mb-4">
            Utenti Attuali
          </h2>
          
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-on-surface-variant flex h-32 items-center justify-center">
                Nessun utente trovato.
              </p>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {users.map((user) => (
                  <li key={user.uid} className="py-3 items-center justify-between">
                    <div>
                      <p className="font-medium text-on-surface">{user.name || 'Senza Nome'}</p>
                      <p className="text-sm text-on-surface-variant">{user.email}</p>
                    </div>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-container text-on-secondary-container">
                      {user.role === 'super_admin' ? 'Super Admin' : user.role === 'tenant_admin' ? 'Amministratore' : 'Membro'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
