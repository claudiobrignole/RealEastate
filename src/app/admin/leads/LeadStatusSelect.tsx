'use client';

import { useState } from 'react';
import { updateLeadStatus } from '@/lib/actions/leads';
import { Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LeadStatusSelectProps {
  leadId: string;
  currentStatus: string;
}

export default function LeadStatusSelect({ leadId, currentStatus }: LeadStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || 'new');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    setSaved(false);

    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } else {
        alert('Errore nell\'aggiornamento dello stato: ' + res.error);
        setStatus(currentStatus); // revert
      }
    } catch (err: any) {
      alert('Errore di rete: ' + err.message);
      setStatus(currentStatus); // revert
    } finally {
      setStatus(newStatus);
      setLoading(false);
    }
  };

  const getBadgeStyle = (s: string) => {
    switch (s) {
      case 'new':
        return 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'contacted':
        return 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100';
      case 'qualified':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
      case 'lost':
        return 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5" id={`lead-select-wrapper-${leadId}`}>
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none cursor-pointer pl-2.5 pr-8 py-1 rounded-md border text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all ${getBadgeStyle(status)} ${
          saved ? 'ring-2 ring-emerald-400' : ''
        }`}
        id={`lead-status-select-${leadId}`}
      >
        <option value="new">Nuovo</option>
        <option value="contacted">Contattato</option>
        <option value="qualified">Qualificato</option>
        <option value="lost">Perso</option>
      </select>
      
      <div className="absolute right-7 pointer-events-none flex items-center justify-center text-current/70">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="w-4 h-4 flex items-center justify-center">
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
        {!loading && saved && <Check className="w-3.5 h-3.5 text-emerald-600 animate-fade-in" />}
      </div>
    </div>
  );
}
