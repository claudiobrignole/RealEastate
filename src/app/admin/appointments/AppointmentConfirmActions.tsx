'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAppointmentStatus } from '@/lib/actions/appointments';
import { Loader2 } from 'lucide-react';

interface AppointmentConfirmActionsProps {
  appointmentId: string;
}

export default function AppointmentConfirmActions({ appointmentId }: AppointmentConfirmActionsProps) {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<'accept' | 'decline' | null>(null);

  const handleAction = async (newStatus: 'confirmed' | 'cancelled') => {
    setLoadingType(newStatus === 'confirmed' ? 'accept' : 'decline');
    try {
      const res = await updateAppointmentStatus(appointmentId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert('Errore nell\'aggiornamento dell\'appuntamento: ' + res.error);
      }
    } catch (err: any) {
      alert('Errore di rete: ' + err.message);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex gap-2 mt-3" id={`confirm-actions-${appointmentId}`}>
      <button
        onClick={() => handleAction('confirmed')}
        disabled={loadingType !== null}
        className="flex-1 bg-primary hover:bg-primary/95 text-on-primary font-semibold text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
      >
        {loadingType === 'accept' && <Loader2 className="w-3 h-3 animate-spin" />}
        Accetta
      </button>
      <button
        onClick={() => handleAction('cancelled')}
        disabled={loadingType !== null}
        className="flex-1 border border-outline-variant text-on-surface font-semibold text-xs py-1.5 px-2 rounded-md hover:bg-surface-container transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
      >
        {loadingType === 'decline' && <Loader2 className="w-3 h-3 animate-spin animate-fade-in" />}
        Riproponi
      </button>
    </div>
  );
}
