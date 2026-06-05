import { getTenantSettings } from '@/lib/actions/tenants';
import MetaIntegrationCard from './MetaIntegrationCard';
import Link from 'next/link';

export default async function SettingsPage() {
  const result = await getTenantSettings();
  const settings = result.success ? result.data : null;
  const metaConnected = Boolean(settings?.metaConnected);
  const metaAccessToken = String(settings?.metaAccessToken || '');
  const metaPageId = String(settings?.metaPageId || '');
  const metaPageName = String(settings?.metaPageName || '');
  const metaFormId = String(settings?.metaFormId || '');

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-data-point text-on-surface mb-2">Integrazioni</h1>
        <p className="text-on-surface-variant font-data-point">
          Gestisci le tue connessioni esterne e le integrazioni di terze parti per le tue campagne.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-data-point text-on-surface border-b border-outline-variant pb-2">Integrazioni Marketing</h2>
        
        <div className="grid gap-4 mt-4">
          <MetaIntegrationCard
            initialStatus={metaConnected}
            initialAccessToken={metaAccessToken}
            initialPageId={metaPageId}
            initialPageName={metaPageName}
            initialFormId={metaFormId}
          />
        </div>
      </section>
    </div>
  );
}
