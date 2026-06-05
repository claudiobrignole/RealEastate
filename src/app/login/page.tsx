'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { allowDevAuthBypass } from '@/lib/env-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const completeSession = async (idToken: string) => {
    const sessionRes = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const sessionData = await sessionRes.json();
    if (!sessionRes.ok || !sessionData.success) {
      const detail = sessionData.error || 'Impossibile creare la sessione';
      if (sessionRes.status === 503) {
        throw new Error(`${detail} — controlla FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.`);
      }
      if (sessionRes.status === 403) {
        throw new Error(`${detail} Crea il documento users/{uid} in Firestore o riprova dopo il fix Admin.`);
      }
      throw new Error(detail);
    }
    document.cookie = '__explicit_logout=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    window.location.href = '/admin/campaigns';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const idToken = await credential.user.getIdToken();
      await completeSession(idToken);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Credenziali non valide. Verifica email e password Firebase Auth.');
      } else {
        setError(err instanceof Error ? err.message : 'Errore durante il login');
      }
      setLoading(false);
    }
  };

  const handleDevBypass = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/dev-bypass', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Dev bypass non disponibile');
      window.location.href = '/admin/campaigns';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore dev bypass');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-lg max-w-md w-full border border-outline-variant flex flex-col justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary text-center mb-2">ZeroAgenzia</h1>
          <p className="text-sm text-on-surface-variant text-center mb-8">Accedi al CRM immobiliare</p>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm border border-error/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@agenzia.it"
                className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password Firebase Auth"
                className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-secondary outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-inverse-surface transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accedi'}
            </button>
          </form>
        </div>

        {allowDevAuthBypass() && (
          <button
            type="button"
            onClick={handleDevBypass}
            disabled={loading}
            className="mt-6 w-full py-2 text-xs text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Dev: accesso rapido (solo locale)
          </button>
        )}
      </div>
    </div>
  );
}
