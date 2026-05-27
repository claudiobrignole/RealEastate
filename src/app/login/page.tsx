'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { loginWithCredentials } from '@/lib/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginWithCredentials({ email, password });
      if (res.success) {
        // Clear explicitly logged out cookie so the layout is authorized to parse session
        document.cookie = '__explicit_logout=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        // Force direct reload so dashboard layout loads with full Fresh data
        window.location.href = '/admin';
      } else {
        setError(res.error || 'Credenziali non valide o utente non configurato');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Errore di connessione durante il login');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-lg max-w-md w-full border border-outline-variant flex flex-col justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary text-center mb-2">ZeroAgenzia</h1>
          <p className="text-sm text-on-surface-variant text-center mb-8">Accedi al tuo account CRM</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E.g. claudio.brignole@exmachina.ch"
                className="w-full bg-surface-container border border-outline rounded-lg p-3 text-on-surface outline-none focus:border-primary transition-all text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Inserisci la tua password"
                className="w-full bg-surface-container border border-outline rounded-lg p-3 text-on-surface outline-none focus:border-primary transition-all text-sm font-medium"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center hover:bg-inverse-surface transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accedi'}
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant pt-4 text-center">
            <p className="text-[10px] text-on-surface-variant">
              In caso di difficoltà di accesso, contatta il Super Amministratore dello spazio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
