'use client';

import { useState, useEffect } from 'react';
import { updateTenantMetaConfig, getMetaOAuthUrl } from '@/lib/actions/tenants';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lock, 
  Info, 
  Settings, 
  Trash2, 
  Facebook, 
  Edit3, 
  FileText, 
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface MetaIntegrationCardProps {
  initialStatus: boolean;
  initialAccessToken?: string;
  initialPageId?: string;
  initialPageName?: string;
  initialFormId?: string;
}

export default function MetaIntegrationCard({ 
  initialStatus,
  initialAccessToken = '',
  initialPageId = '',
  initialPageName = '',
  initialFormId = ''
}: MetaIntegrationCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Setup States
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupMethod, setSetupMethod] = useState<'oauth' | 'manual'>('oauth');

  // Custom non-blocking modal & inline warning states
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);

  // Success and Error Banners from URL redirection params
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  
  // Form Fields
  const [accessToken, setAccessToken] = useState(initialAccessToken);
  const [pageId, setPageId] = useState(initialPageId);
  const [pageName, setPageName] = useState(initialPageName);
  const [formId, setFormId] = useState(initialFormId);

  // Webhook Simulator States
  const [showSimulator, setShowSimulator] = useState(false);
  const [simName, setSimName] = useState('Luigi Verdi (Test Webhook)');
  const [simEmail, setSimEmail] = useState('luigi.verdi.test@gmail.com');
  const [simPhone, setSimPhone] = useState('+39 321 9876543');
  const [simCampaign, setSimCampaign] = useState('Campagna Appartamento Duomo');
  const [simAd, setSimAd] = useState('Ad 1 - Vista Guglie Terrazza');
  const [simulating, setSimulating] = useState(false);
  const [simSuccess, setSimSuccess] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  const handleTriggerSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimSuccess(null);
    setSimError(null);

    const mockPayload = {
      object: 'page',
      entry: [
        {
          id: pageId || '10948928421839',
          time: Math.floor(Date.now() / 1000),
          changes: [
            {
              value: {
                form_id: formId || '4928104829103',
                leadgen_id: `mock_lead_${Math.floor(Math.random() * 1000000)}`,
                created_time: Math.floor(Date.now() / 1000),
                page_id: pageId || '10948928421839',
                ad_id: '492019482',
                adgroup_id: '492019483',
                mock_data: {
                  name: simName.trim(),
                  email: simEmail.trim(),
                  phone: simPhone.trim(),
                  campaignName: simCampaign.trim(),
                  adName: simAd.trim()
                }
              },
              field: 'leadgen'
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch('/api/webhooks/meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockPayload)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          setSimSuccess('MOCK LEAD SPECIALE INVIATO CON SUCCESSO! Il lead è stato intercettato dal webhook di sincronizzazione ed inserito nel CRM. Visita la scheda "CRM & Leads" o i Report per vederlo!');
          setSimName('Nuovo Test_Lead ' + Math.floor(Math.random() * 100)); // Reset naming/random to show changes
          router.refresh();
        } else {
          setSimError('Fattore interno non riuscito nel webhook.');
        }
      } else {
        setSimError('Errore di connessione con l’endpoint del Webhook.');
      }
    } catch (err: any) {
      setSimError('Eccezione durante la chiamata: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  // Parse search params in useEffect to show connection banner and listen to popup messages
  useEffect(() => {
    const successParam = searchParams.get('meta_success');
    const errorParam = searchParams.get('meta_error');

    if (successParam === 'true') {
      setSuccessBanner('Integrazione con Facebook completata con successo!');
      const timer = setTimeout(() => {
        setSuccessBanner(null);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (errorParam) {
      let message = 'Si è verificato un errore durante la configurazione con Meta.';
      if (errorParam === 'auth_cancelled') {
        message = 'Autorizzazione Facebook annullata dall’utente.';
      } else if (errorParam === 'token_exchange_failed') {
        message = 'Scambio del codice di autorizzazione non riuscito.';
      } else if (errorParam === 'accounts_fetch_failed') {
        message = 'Impossibile recuperare le pagine gestite dal tuo account Facebook.';
      } else if (errorParam === 'no_pages_found') {
        message = 'Nessuna pagina Facebook aziendale trovata per questo account.';
      } else if (errorParam === 'tenant_not_found') {
        message = 'Tenant ID non configurato o sessione non valida.';
      } else if (errorParam === 'db_update_failed') {
        message = 'Errore nel salvataggio della configurazione nel database.';
      }
      setErrorBanner(message);
      const timer = setTimeout(() => {
        setErrorBanner(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Listen to postMessage from the popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'META_AUTH_SUCCESS') {
        setStatus(true);
        setIsSettingUp(false);
        setSuccessBanner('Integrazione con Facebook completata con successo!');
        router.refresh();
        const timer = setTimeout(() => {
          setSuccessBanner(null);
        }, 4000);
      } else if (event.data?.type === 'META_AUTH_ERROR') {
        const errorParam = event.data.error;
        let message = 'Si è verificato un errore durante la configurazione con Meta.';
        if (errorParam === 'auth_cancelled') {
          message = 'Autorizzazione Facebook annullata dall’utente.';
        } else if (errorParam === 'token_exchange_failed') {
          message = 'Scambio del codice di autorizzazione non riuscito.';
        } else if (errorParam === 'accounts_fetch_failed') {
          message = 'Impossibile recuperare le pagine gestite dal tuo account Facebook.';
        } else if (errorParam === 'no_pages_found') {
          message = 'Nessuna pagina Facebook aziendale trovata per questo account.';
        } else if (errorParam === 'tenant_not_found') {
          message = 'Tenant ID non configurato o sessione non valida.';
        } else if (errorParam === 'db_update_failed') {
          message = 'Errore nel salvataggio della configurazione nel database.';
        }
        setErrorBanner(message);
        const timer = setTimeout(() => {
          setErrorBanner(null);
        }, 4000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  // Open / Close Setup UI
  const handleStartSetup = () => {
    setIsSettingUp(true);
    setInlineError(null);
    setInlineSuccess(null);
    // If we already have values, populate them for changes
    if (status) {
      setAccessToken(initialAccessToken);
      setPageId(initialPageId);
      setPageName(initialPageName);
      setFormId(initialFormId);
    }
  };

  const handleCancelSetup = () => {
    setIsSettingUp(false);
    setInlineError(null);
  };

  // Real Facebook OAuth redirection handler using popup
  const handleMetaOAuthLogin = async () => {
    setLoading(true);
    setInlineError(null);
    try {
      const url = await getMetaOAuthUrl();
      if (url) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          url,
          'meta_oauth_popup',
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );
        
        if (!popup) {
          setInlineError("Il blocco pop-up del browser ha impedito l'apertura della finestra. Abilita i pop-up per questo sito.");
        }
      } else {
        setInlineError("Impossibile generare l'URL del collegamento OAuth.");
      }
    } catch (err: any) {
      setInlineError('Errore durante l’inizializzazione del login Meta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect the Meta accounts completely
  const handleDisconnect = async () => {
    setLoading(true);
    setInlineError(null);
    setInlineSuccess(null);
    try {
      const res = await updateTenantMetaConfig({
        metaConnected: false,
        metaAccessToken: '',
        metaPageId: '',
        metaPageName: '',
        metaFormId: ''
      });
      
      if (res.success) {
        setStatus(false);
        setAccessToken('');
        setPageId('');
        setPageName('');
        setFormId('');
        setIsSettingUp(false);
        setShowConfirmDisconnect(false);
        setInlineSuccess('Collegamento scollegato correttamente.');
        router.refresh();
      } else {
        setInlineError('Errore durante lo scollegamento: ' + res.error);
        setShowConfirmDisconnect(false);
      }
    } catch (err: any) {
      setInlineError('Impossibile scollegare: Errore di connessione.');
      setShowConfirmDisconnect(false);
    } finally {
      setLoading(false);
    }
  };

  // Submit and save configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setInlineSuccess(null);
    
    let finalPageName = pageName.trim();
    let finalPageId = pageId.trim();
    let finalToken = accessToken.trim();
    let finalFormId = formId.trim();

    if (!finalToken) {
      setInlineError('Inserisci un Access Token valido prima di salvare.');
      return;
    }
    if (!finalPageName || !finalPageId) {
      setInlineError('Specifica il nome e l’ID della pagina Facebook connessa.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateTenantMetaConfig({
        metaConnected: true,
        metaAccessToken: finalToken,
        metaPageId: finalPageId,
        metaPageName: finalPageName,
        metaFormId: finalFormId || null
      });

      if (res.success) {
        setStatus(true);
        setPageName(finalPageName);
        setPageId(finalPageId);
        setAccessToken(finalToken);
        setFormId(finalFormId);
        setIsSettingUp(false);
        setInlineSuccess('Collegamento Meta impostato e attivato con successo!');
        router.refresh();
      } else {
        setInlineError('Errore durante il salvataggio: ' + res.error);
      }
    } catch (err: any) {
      setInlineError('Errore di comunicazione col server.');
    } finally {
      setLoading(false);
    }
  };

  // Prefill helper for manual credential configuration testing
  const handlePrefillManualDev = () => {
    setAccessToken('EAAx9482_SYSTEM_USER_PERMANENT_TOKEN_MOCK_XYZ1234');
    setPageId('10948928421839');
    setPageName('Agenzia Casa Immobiliare Milano');
    setFormId('4928104829103');
    setInlineError(null);
  };


  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm transition-all overflow-hidden" id="meta-integration-widget">
      
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Meta Business & Lead Ads</h3>
          </div>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Sincronizza in tempo reale i contatti e le richieste commerciali generati dalle campagne pubblicitarie attive su Facebook Lead Ads e Instagram, per inserirli subito su HomeLeads.
          </p>
        </div>
        
        {/* Connection status tag */}
        <div className="shrink-0 flex items-center gap-2">
          {status ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attivo e Connesso</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-neutral-100 text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-semibold">
              <XCircle className="w-4 h-4 text-neutral-500" />
              <span>Configurazione Richiesta</span>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED INTERACTIVE PANEL BODY */}
      <div className="p-6">
        
        {/* INLINE STATUS NOTIFICATIONS */}
        {inlineSuccess && (
          <div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl relative flex items-center justify-between gap-3 animate-fade-in" id="meta-inline-success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">{inlineSuccess}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setInlineSuccess(null)}
              className="text-emerald-500 hover:text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
            >
              Ok
            </button>
          </div>
        )}

        {inlineError && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl relative flex items-center justify-between gap-3 animate-fade-in" id="meta-inline-error">
            <div className="flex items-center gap-2 flex-1">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-sm font-semibold">{inlineError}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setInlineError(null)}
              className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-0.5 rounded border border-red-200 hover:bg-red-100 cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        )}
        
        {/* CASE A: USER VIEWING PREEXISTING ESTABLISHED CONNECTION */}
        {status && !isSettingUp && (
          <div className="space-y-6 animate-fade-in" id="meta-active-connection-panel">
            {successBanner && (
              <div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl relative flex items-center gap-3 animate-fade-in" id="meta-success-oauth-banner">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold">{successBanner}</span>
              </div>
            )}
            {errorBanner && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl relative flex items-center gap-3 animate-fade-in" id="meta-error-oauth-banner">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-sm font-semibold">{errorBanner}</span>
              </div>
            )}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-800">
                <p className="font-semibold mb-0.5">Sincronizzazione webhook attiva!</p>
                <p className="text-xs text-emerald-700">
                  I nuovi moduli compilati dai clienti su Facebook e Instagram vengono catturati ed inseriti immediatamente come nuovi lead nel sistema.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-1.5">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Pagina Facebook Connessa</p>
                <p className="font-semibold text-on-surface text-base">{pageName || 'Nessuna pagina selezionata'}</p>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="font-mono bg-surface border px-1 rounded">ID: {pageId || '---'}</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-1.5">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Stato Integrazione API & Sicurezza</p>
                <p className="font-semibold text-on-surface text-sm flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Meta Access Token Salvato
                </p>
                <p className="text-xs font-mono text-on-surface-variant truncate">
                  {accessToken ? `${accessToken.substring(0, 10)}••••••••••••••••••••••••` : 'Non inserito'}
                </p>
              </div>

              {formId && (
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-1.5 md:col-span-2">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">ID Modulo Lead Filtro (Esclusivo)</p>
                  <p className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Modulo Selezionato: <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded text-primary">{formId}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant">Solo i lead derivanti da questo specifico modulo verranno caricati nel pannello.</p>
                </div>
              )}
            </div>

            {/* COLLAPSIBLE WEBHOOK SIMULATOR PANEL */}
            <div className="border border-dashed border-outline-variant rounded-xl p-4 bg-surface-container-low/50 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowSimulator(!showSimulator);
                  setSimSuccess(null);
                  setSimError(null);
                }}
                className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase tracking-wide cursor-pointer focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1877F2] animate-pulse" />
                  Strumento di Collaudo Webhook (Meta Simulator)
                </span>
                <span className="text-[11px] underline text-primary/80 hover:text-primary">
                  {showSimulator ? 'Nascondi Pannello' : 'Mostra Pannello di Test'}
                </span>
              </button>

              {showSimulator && (
                <div className="pt-2 border-t border-outline-variant/60 space-y-4 animate-fade-in" id="meta-simulator-panel">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Usa questo modulo per testare l&apos;integrazione in tempo reale. Verrà simulata una chiamata webhook Meta con i dati sottostanti, indirizzata al tuo ID Pagina Facebook (<code className="font-mono bg-surface px-1 py-0.5 rounded text-primary font-bold">{pageId || 'ID_MOCK'}</code>).
                  </p>

                  {simSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{simSuccess}</span>
                    </div>
                  )}

                  {simError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{simError}</span>
                    </div>
                  )}

                  <form onSubmit={handleTriggerSimulation} className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Nome Candidato Lead</label>
                      <input
                        type="text"
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        className="w-full p-2 bg-surface text-xs text-on-surface border border-outline-variant rounded focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Email Contatto</label>
                      <input
                        type="email"
                        value={simEmail}
                        onChange={(e) => setSimEmail(e.target.value)}
                        className="w-full p-2 bg-surface text-xs text-on-surface border border-outline-variant rounded focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Telefono / WhatsApp</label>
                      <input
                        type="text"
                        value={simPhone}
                        onChange={(e) => setSimPhone(e.target.value)}
                        className="w-full p-2 bg-surface text-xs text-on-surface border border-outline-variant rounded focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Nome Campagna Meta Ads</label>
                      <input
                        type="text"
                        value={simCampaign}
                        onChange={(e) => setSimCampaign(e.target.value)}
                        className="w-full p-2 bg-surface text-xs text-on-surface border border-outline-variant rounded focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">Nome Annuncio Pubblicitario (Ad Name)</label>
                      <input
                        type="text"
                        value={simAd}
                        onChange={(e) => setSimAd(e.target.value)}
                        className="w-full p-2 bg-surface text-xs text-on-surface border border-outline-variant rounded focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 pt-1 flex justify-end">
                      <button
                        type="submit"
                        disabled={simulating}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs rounded shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {simulating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Invia Lead Simulato al Webhook
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ACTION FOOTER BAR */}
            <div className="pt-4 border-t border-outline-variant space-y-4">
              {showConfirmDisconnect ? (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl space-y-3 animate-fade-in" id="meta-disconnect-confirm-box">
                  <div className="flex gap-2.5 text-red-800">
                    <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <h4 className="font-bold text-sm">Sei sicuro di voler scollegare l&apos;account Meta?</h4>
                      <p className="text-xs text-red-700 mt-1">
                        Non riceverai più lead contatti dalle tue campagne Facebook &amp; Instagram in tempo reale. Verranno eliminati permanentemente l&apos;Access Token ed eventuali filtri impostati.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowConfirmDisconnect(false)}
                      className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                    >
                      Annulla
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      disabled={loading}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Sì, Scollega Ora
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <button
                    onClick={handleStartSetup}
                    type="button"
                    className="px-4 py-2 border border-outline-variant hover:bg-surface-container-high rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer text-on-surface"
                  >
                    <Edit3 className="w-4 h-4 text-on-surface-variant" /> Modifica Configurazione
                  </button>

                  <button
                    onClick={() => {
                      setInlineError(null);
                      setInlineSuccess(null);
                      setShowConfirmDisconnect(true);
                    }}
                    type="button"
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Scollega Account Meta
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASE B: DISCONNECTED OR USER IS SETTING UP CONNECTION */}
        {(!status || isSettingUp) && (
          <div className="space-y-6" id="meta-setup-panel">
            
            {/* SETUP PROGRESS BAR (IF CURRENTLY SETTING UP) */}
            {isSettingUp ? (
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-outline-variant">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Procedura di Collegamento</span>
                  
                  {/* Mode switcher tabs */}
                  <div className="flex bg-surface rounded-lg p-0.5 border border-outline-variant">
                    <button
                      type="button"
                      onClick={() => { setSetupMethod('oauth'); }}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${setupMethod === 'oauth' ? 'bg-[#1877F2] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      OAuth Facebook (Facile)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSetupMethod('manual'); }}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${setupMethod === 'manual' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Config. Manuale (Token API)
                    </button>
                  </div>
                </div>

                {/* INFO NOTES */}
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {setupMethod === 'oauth' 
                    ? "Permetti l'accesso rapido autenticandoti con il profilo Facebook che amministra la pagina aziendale."
                    : "Inserisci l’Access Token permanente generato dal tuo pannello Meta for Developers (System User Token) e gli ID richiesti."
                  }
                </p>
              </div>
            ) : (
              // Empty visual state helper prior to clicking configure
              <div className="text-center py-6 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <Settings className="w-8 h-8 animate-pulse text-[#1877F2]" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-base text-on-surface">Collega Meta Lead Ads in 2 passaggi</p>
                  <p className="text-sm text-on-surface-variant">
                    Ricevi istantaneamente i lead contatti delle campagne con notifiche push e gestione flussi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartSetup}
                  className="px-5 py-2.5 bg-[#1877F2] hover:bg-[#1565C0] text-white rounded-xl font-semibold shadow-sm text-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  Configura Integrazione Meta <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* IF SETTING UP -> CHOSEN METHA FLUID VIEWS */}
            {isSettingUp && (
              <form onSubmit={handleSaveConfig} className="space-y-6">
                
                {/* METHOD 1: REAL FACEBOOK OAUTH FORM */}
                {setupMethod === 'oauth' && (
                  <div className="space-y-5">
                    <div className="p-6 bg-[#1877F2]/5 border border-[#1877F2]/20 rounded-xl space-y-4 text-center">
                      <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center mx-auto shadow">
                        <Facebook className="w-6 h-6 fill-current" />
                      </div>
                      <div className="max-w-md mx-auto space-y-2">
                        <p className="font-bold text-on-surface text-base">Accedi con il tuo Profilo Facebook</p>
                        <p className="text-xs text-on-surface-variant">
                          Concederai l&apos;autorizzazione all&apos;app <strong className="text-[#1877F2]">HomeLeads Integration</strong> di ricevere i lead pubblicati dalle tue pagine.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleMetaOAuthLogin}
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#1877F2] hover:bg-[#1565C0] text-white rounded-lg flex items-center justify-center gap-2.5 font-bold text-sm shadow cursor-pointer mx-auto transition-all transition-duration-200 disabled:opacity-60 text-center"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Facebook className="w-4 h-4 fill-current" />
                        )}
                        Accedi con Facebook
                      </button>
                      <p className="text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Meta OAuth Secure Connection
                      </p>
                    </div>
                  </div>
                )}

                {/* METHOD 2: MANUAL DEVELOPER API INPUT FORM */}
                {setupMethod === 'manual' && (
                  <div className="space-y-4 animate-fade-in" id="manual-form-inputs">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
                      <p className="text-xs font-bold text-primary flex items-center gap-1">
                        <Settings className="w-3.5 h-3.5" /> Credenziali API Meta Developers
                      </p>
                      <button
                        type="button"
                        onClick={handlePrefillManualDev}
                        className="text-[11px] text-primary/80 hover:text-primary underline cursor-pointer font-medium"
                      >
                        Autocompila valori di test
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                          Meta Page or User Access Token (Lunga Scadenza)
                        </label>
                        <textarea
                          rows={2}
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                          placeholder="Inserisci l'Access Token o System User Token di Meta Graph API (EAAmz...)"
                          className="w-full p-2.5 bg-surface font-mono text-xs text-on-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                          required
                        />
                        <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          Puoi generarlo tramite lo strumento Graph API Explorer o la Console Meta for Developers. Must have permissions: pages_show_list, leads_retrieval, pages_read_engagement.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                            Nome Pagina Facebook
                          </label>
                          <input
                            type="text"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            placeholder="Es. Agenzia Casa Milano"
                            className="w-full p-2.5 bg-surface text-sm text-on-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                            ID Pagina Facebook Aziendale
                          </label>
                          <input
                            type="text"
                            value={pageId}
                            onChange={(e) => setPageId(e.target.value)}
                            placeholder="Es: 104928374928"
                            className="w-full p-2.5 bg-surface font-mono text-sm text-on-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                          ID Modulo Lead Ads specifico (Opzionale)
                        </label>
                        <input
                          type="text"
                          value={formId}
                          onChange={(e) => setFormId(e.target.value)}
                          placeholder="Filtra sincronizzazione solo per l'ID di questo modulo (es. 49281048)"
                          className="w-full p-2.5 bg-surface font-mono text-sm text-on-surface border border-outline-variant rounded-lg focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM SUBMISSION AND SETUP TRIGGERS BAR */}
                <div className="pt-4 border-t border-outline-variant flex items-center justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCancelSetup}
                    className="px-4 py-2 bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-high rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Annulla
                  </button>

                  <div className="flex items-center gap-2">
                    {setupMethod === 'oauth' ? (
                      <span className="text-xs text-on-surface-variant">Usa il pulsante &quot;Accedi con Facebook&quot; per connettere</span>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary/95 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Salva e Sincronizza
                      </button>
                    )}
                  </div>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
      
      {/* EXPLAINER ON GRAPH API WEBHOOKS */}
      <div className="bg-surface-container-lowest p-5 border-t border-outline-variant text-xs text-on-surface-variant flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="p-1 px-1.5 bg-primary/10 text-primary font-extrabold rounded uppercase text-[9px] shrink-0">
          Webhook Realtime
        </div>
        <p className="leading-relaxed">
          L&apos;integrazione connette un endpoint Webhook sicuro proprietario della piattaforma HomeLeads a Meta Graph API. Una volta salvata la configurazione, i lead verranno caricati in tempo reale senza richiedere alcun polling.
        </p>
      </div>

    </div>
  );
}
