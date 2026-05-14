'use client';

import { useState } from 'react';
import { updateTenantMetaStatus } from '@/lib/actions/tenants';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MetaIntegrationCard({ initialStatus }: { initialStatus: boolean }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await updateTenantMetaStatus(true);
      if (res.success) {
        setStatus(true);
        router.refresh();
      } else {
        alert('Errore: ' + res.error);
      }
    } catch (err: any) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-data-point text-on-surface mb-1">Meta Business & Lead Ads</h3>
          <p className="text-sm text-on-surface-variant max-w-md">
            Collega il tuo account Meta per importare automaticamente i lead generati dalle tue campagne Facebook e Instagram.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {status ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">Collegato</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Non collegato</span>
              </>
            )}
          </div>
          
          <button
            onClick={handleConnect}
            disabled={status || loading}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {status ? 'Account Collegato' : 'Collega Account Meta'}
          </button>
        </div>
      </div>
    </div>
  );
}
