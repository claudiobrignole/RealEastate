import { getTenantSettings } from '@/lib/actions/tenants';
import MetaIntegrationCard from './MetaIntegrationCard';
import Link from 'next/link';

export default async function SettingsPage() {
  const result = await getTenantSettings();
  const settings = result.success ? result.data : null;
  const metaConnected = settings?.metaConnected || false;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-data-point text-on-surface mb-2">Impostazioni</h1>
        <p className="text-on-surface-variant font-data-point">
          Gestisci le impostazioni del tuo account e le integrazioni di terze parti.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-data-point text-on-surface border-b border-outline-variant pb-2">Gestione Utenti</h2>
        
        <div className="grid gap-4 mt-4">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-data-point text-on-surface mb-1">Membri del Team</h3>
              <p className="text-sm text-on-surface-variant max-w-md">
                Aggiungi o rimuovi utenti dal tuo account e gestisci i loro permessi.
              </p>
            </div>
            <Link href="/admin/settings/users" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center shrink-0">
              Gestisci Membri
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-data-point text-on-surface border-b border-outline-variant pb-2">Integrazioni Marketing</h2>
        
        <div className="grid gap-4 mt-4">
          <MetaIntegrationCard initialStatus={metaConnected} />
        </div>
      </section>
    </div>
  );
}
