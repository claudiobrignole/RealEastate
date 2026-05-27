'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAppointment } from '@/lib/actions/appointments';
import { Loader2, X } from 'lucide-react';

interface NewAppointmentModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function NewAppointmentModal({ onClose, onCreated }: NewAppointmentModalProps) {
  const router = useRouter();

  // Initialize with reasonable defaults
  const today = new Date().toISOString().split('T')[0];
  
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(today);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [type, setType] = useState('Visita Immobile');
  const [leadName, setLeadName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Inserisci un titolo per l\'appuntamento');
      return;
    }
    if (!dateStr) {
      setError('Seleziona una data');
      return;
    }
    if (!startTime || !endTime) {
      setError('Inserisci l\'orario di inizio e fine');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createAppointment({
        title,
        dateStr,
        startTime,
        endTime,
        type,
        leadName: leadName.trim() || undefined,
        description: description.trim() || undefined
      });

      if (res.success) {
        onCreated();
        router.refresh();
        onClose();
      } else {
        setError(res.error || 'Errore durante il salvataggio dell\'appuntamento');
      }
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="new-appointment-overlay">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-fade-in flex flex-col" id="new-appointment-modal-card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <h3 className="text-lg font-bold text-primary">Nuovo Appuntamento</h3>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh] flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-lg font-semibold">
              {error}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Titolo Appuntamento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Visita Attico Brera, Chiamata di Allineamento"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type selection */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Tipo *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
              >
                <option value="Visita Immobile">Visita Immobile</option>
                <option value="Video Call">Video Call</option>
                <option value="Chiamata">Chiamata</option>
                <option value="Incontro in Ufficio">Incontro in Ufficio</option>
              </select>
            </div>

            {/* Lead relation name input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nome Cliente / Lead</label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Es. Marco Rossi"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Date input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Data *</label>
            <input
              type="date"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Ora Inizio *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            {/* End Time input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Ora Fine *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Note / Descrizione</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Aggiungi ulteriori dettagli sull'appuntamento..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold border border-outline-variant text-primary rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Salva Appuntamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
