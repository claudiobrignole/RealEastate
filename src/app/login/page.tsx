'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSetSession = async (token: string) => {
    // Set a simple cookie for server actions
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
    router.push('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await handleSetSession(token);
    } catch (err: any) {
      setError(err.message || 'Errore durante il login');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      await handleSetSession(token);
    } catch (err: any) {
      setError(err.message || 'Errore durante il login con Google');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-lg shadow-lg max-w-md w-full border border-outline-variant">
        <h1 className="text-h2 font-h1 text-primary text-center mb-2">UnitLeads</h1>
        <p className="text-body-md text-on-surface-variant text-center mb-8">Accedi al tuo account CRM</p>
        
        {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded text-body-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-label-md font-label-caps text-on-surface mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface"
              required
            />
          </div>
          <div>
            <label className="block text-label-md font-label-caps text-on-surface mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-2 rounded-DEFAULT font-data-point flex items-center justify-center hover:bg-inverse-surface transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accedi'}
          </button>
        </form>

        <div className="mt-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-surface-container-high text-on-surface py-2 rounded-DEFAULT font-data-point flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Accedi con Google
          </button>
        </div>
      </div>
    </div>
  );
}
