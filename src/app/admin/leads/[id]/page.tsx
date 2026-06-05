import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/actions/leads';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import LeadStatusSelect from '../LeadStatusSelect';
import { ArrowLeft } from 'lucide-react';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getLeadById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const lead = res.data;
  const createdLabel = lead.createdAt
    ? formatDistanceToNow(new Date(lead.createdAt as string), { addSuffix: true, locale: it })
    : '—';

  return (
    <div className="pt-12 px-margin pb-margin max-w-3xl mx-auto">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna ai lead
      </Link>

      <h1 className="font-h1 text-h1 text-primary mb-2">
        {(lead.name as string) || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Lead senza nome'}
      </h1>
      <p className="text-on-surface-variant mb-8">Creato {createdLabel}</p>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" value={lead.email as string} />
          <Field label="Telefono" value={(lead.phone as string) || '—'} />
          <Field label="Sorgente" value={(lead.source as string) || '—'} />
          <Field label="Progetto" value={(lead.projectId as string) || '—'} />
          <Field label="Campagna" value={(lead.campaignName as string) || '—'} />
          <Field label="Annuncio" value={(lead.adName as string) || '—'} />
        </div>

        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Stato</p>
          <LeadStatusSelect leadId={lead.id as string} currentStatus={(lead.status as string) || 'new'} />
        </div>

        {(lead.message as string) && (
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Messaggio</p>
            <p className="text-primary whitespace-pre-wrap">{lead.message as string}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs mb-1">{label}</p>
      <p className="text-primary font-medium">{value || '—'}</p>
    </div>
  );
}
