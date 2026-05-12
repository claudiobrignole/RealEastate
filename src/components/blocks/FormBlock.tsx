"use client";

import { useState } from 'react';
import { submitLead } from '@/lib/actions/leads';
import { Loader2, CheckCircle } from 'lucide-react';

export default function FormBlock({ data }: { data: any }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');
    try {
      const res = await submitLead({
        projectId: data?.projectId || 'unknown',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      if (res.success) {
        setStatus('success');
      } else {
        setErrorMsg(res.error || 'Errore durante l\'invio.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Errore di rete. Riprova più tardi.');
      setStatus('error');
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-DEFAULT px-md py-sm text-on-primary placeholder:text-on-primary/50 focus:outline-none focus:ring-1 focus:ring-white/60 transition-all font-body-md text-body-md backdrop-blur-sm";

  if (status === 'success') {
    return (
      <section className="px-margin py-xl bg-inverse-surface">
        <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-md">
          <CheckCircle className="w-12 h-12 text-secondary" />
          <h2 className="font-h2 text-h2 text-on-inverse-surface">
            Richiesta inviata
          </h2>
          <p className="font-body-lg text-body-lg text-on-inverse-surface/70">
            Ti contatteremo al più presto.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-margin py-xl bg-inverse-surface">
      <div className="max-w-lg mx-auto">
        <h2 className="font-h2 text-h2 text-on-inverse-surface mb-sm text-center">
          {data?.title || 'Richiedi Informazioni'}
        </h2>
        {data?.accentColor === 'gold' && (
          <div className="w-12 h-[2px] bg-secondary mx-auto mb-lg" />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md mt-lg">
          <input
            name="name" type="text" required
            placeholder="Nome e Cognome *"
            value={form.name} onChange={handleChange}
            className={inputClass}
          />
          <input
            name="email" type="email" required
            placeholder="Email *"
            value={form.email} onChange={handleChange}
            className={inputClass}
          />
          <input
            name="phone" type="tel"
            placeholder="Telefono (opzionale)"
            value={form.phone} onChange={handleChange}
            className={inputClass}
          />
          <textarea
            name="message"
            placeholder="Messaggio (opzionale)"
            value={form.message} onChange={handleChange}
            rows={4}
            className={`${inputClass} resize-none`}
          />

          {status === 'error' && (
            <p className="font-body-sm text-body-sm text-error bg-error/10 px-md py-sm rounded-DEFAULT">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-secondary text-on-secondary py-md rounded-DEFAULT font-data-point text-data-point uppercase tracking-wider hover:bg-secondary-fixed transition-colors disabled:opacity-60 flex items-center justify-center gap-sm"
          >
            {status === 'loading' 
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso...</>
              : (data?.ctaLabel || 'Invia Richiesta')
            }
          </button>
        </form>
      </div>
    </section>
  );
}
