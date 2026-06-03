'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateCurrentUserProfile } from '@/lib/actions/auth';
import { Loader2, User, Mail, ShieldAlert, Check } from 'lucide-react';

export default function PersonalProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      try {
        let user: any = null;
        try {
          user = await getCurrentUser();
        } catch (serverActionErr) {
          console.warn('getCurrentUser Server Action not found or failed, falling back to REST API endpoint:', serverActionErr);
          const apiRes = await fetch('/api/auth/session');
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.success) {
              user = data.user;
            }
          }
        }

        if (active && user) {
          setCurrentUser(user);
          setName(user.name || '');
          setEmail(user.email || '');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name.trim() || !email.trim()) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    setSaving(true);
    try {
      const res = await updateCurrentUserProfile({ name, email });
      if (res.success) {
        setSuccess('Profilo aggiornato con successo!');
        
        // Update local state and trigger layout refresh
        setCurrentUser((prev: any) => ({ ...prev, name, email }));
        
        // Refresh page so layout updates immediately
        window.location.reload();
      } else {
        setError(res.error || 'Impossibile salvare le modifiche.');
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    const parts = fullName.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Amministratore';
      case 'tenant_admin':
        return 'Amministratore di Spazio';
      default:
        return 'Membro del Team';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-on-surface">Non autorizzato</h2>
        <p className="text-sm text-on-surface-variant">
          Devi accedere per visualizzare e modificare il tuo profilo.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Profilo Personale</h1>
        <p className="text-sm text-on-surface-variant">
          Visualizza e aggiorna le tue informazioni di profilo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Profile Card Summary */}
        <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm md:col-span-1">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-bold text-xl flex items-center justify-center shadow-inner">
            {getInitials(name || currentUser.name || '')}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-on-surface truncate max-w-[200px]" title={name}>
              {name || currentUser.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-secondary">
              {getRoleLabel(currentUser.role)}
            </p>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">
            Dati del Profilo
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <User className="w-4 h-4 text-on-surface-variant" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Claudio Brignole"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container text-on-surface font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <Mail className="w-4 h-4 text-on-surface-variant" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g. claudio.brignole@exmachina.ch"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container text-on-surface font-medium transition-colors"
                />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1.5">
                Utilizzata per accedere al portale CRM.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Salva Modifiche
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
