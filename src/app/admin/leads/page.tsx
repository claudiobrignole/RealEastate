import Link from 'next/link';
import { getLeads, getLeadStats } from '@/lib/actions/leads';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  Users, 
  Calendar, 
  Facebook, 
  Globe, 
  Inbox, 
  ArrowLeftRight, 
  FileText
} from 'lucide-react';
import LeadStatusSelect from './LeadStatusSelect';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  // Fetch Leads and Stats in Parallel
  const [leadsRes, statsRes] = await Promise.all([
    getLeads(),
    getLeadStats()
  ]);

  const leads = leadsRes.success && leadsRes.data ? leadsRes.data : [];
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    total: 0,
    bySource: { landing_page: 0, meta_ads: 0, landing_form: 0, other: 0 },
    byStatus: { new: 0, contacted: 0, qualified: 0, lost: 0 },
    thisMonth: 0
  };

  // Resolve Next.js 15 searchParams promise
  const resolvedParams = await searchParams;
  const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';

  // Apply server-side filters on leads array
  const filteredLeads = leads.filter((lead: any) => {
    const leadStatus = lead.status || 'new';
    if (statusFilter === 'all') return true;
    return leadStatus === statusFilter;
  });

  const renderSourceBadge = (source: string) => {
    if (source === 'meta_ads') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
          <Facebook className="w-3 h-3 text-blue-600 shrink-0" />
          Meta Ads
        </span>
      );
    }
    if (source === 'landing_page' || source === 'landing_form') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
          <Globe className="w-3 h-3 text-emerald-600 shrink-0" />
          Landing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200">
        Altro
      </span>
    );
  };

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto" id="admin-crm-container">
      {/* Title Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-h1 text-h1 text-primary mb-1">CRM & Leads</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Gestisci, qualifica e traccia i contatti di alto valore acquisiti.
          </p>
        </div>
        <button className="bg-primary hover:bg-surface-tint text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]" id="leads-export-button">
          <FileText className="w-4 h-4" />
          Esporta Report
        </button>
      </div>

      {/* KPI 4-card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="crm-kpi-grid">
        {/* KPI 1: Lead Totali */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="kpi-total-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Lead Totali</p>
            <h3 className="text-3xl font-black text-primary mt-2">{stats.total}</h3>
          </div>
          <div className="p-2.5 bg-primary/5 text-primary rounded-lg border border-primary/10">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Questo Mese */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="kpi-this-month">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Questo Mese</p>
            <h3 className="text-3xl font-black text-primary mt-2">{stats.thisMonth}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-lg border border-amber-500/10">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Da Meta Ads */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="kpi-meta-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Da Meta Ads</p>
            <h3 className="text-3xl font-black text-primary mt-2">{stats.bySource.meta_ads || 0}</h3>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-lg border border-blue-500/10">
            <Facebook className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Da Landing Page */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="kpi-landing-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Da Landing</p>
            <h3 className="text-3xl font-black text-primary mt-2">
              {(stats.bySource.landing_page || 0) + (stats.bySource.landing_form || 0)}
            </h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-lg border border-emerald-500/10">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Horizontal Filter Tabs bar */}
      <div className="flex border-b border-outline-variant mb-6 overflow-x-auto gap-1" id="crm-status-tabs-container">
        {[
          { label: 'Tutti', value: 'all', href: '/admin/leads' },
          { label: 'Nuovo', value: 'new', href: '/admin/leads?status=new' },
          { label: 'Contattato', value: 'contacted', href: '/admin/leads?status=contacted' },
          { label: 'Qualificato', value: 'qualified', href: '/admin/leads?status=qualified' },
          { label: 'Perso', value: 'lost', href: '/admin/leads?status=lost' },
        ].map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-on-surface-variant hover:text-primary hover:border-outline-variant'
              }`}
              id={`tab-status-${tab.value}`}
            >
              {tab.label}
              <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                isActive ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                {tab.value === 'all' 
                  ? stats.total 
                  : (stats.byStatus as any)[tab.value] || 0
                }
              </span>
            </Link>
          );
        })}
      </div>

      {/* Leads Table Card or Empty State */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm" id="crm-table-container">
        {filteredLeads.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]" id="crm-leads-table">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="py-3.5 px-6 font-semibold text-xs text-on-surface-variant uppercase tracking-wider w-[240px]">Lead</th>
                    <th className="py-3.5 px-6 font-semibold text-xs text-on-surface-variant uppercase tracking-wider w-[180px]">Progetto</th>
                    <th className="py-3.5 px-6 font-semibold text-xs text-on-surface-variant uppercase tracking-wider w-[140px]">Sorgente</th>
                    <th className="py-3.5 px-6 font-semibold text-xs text-on-surface-variant uppercase tracking-wider w-[160px]">Ricevuto e Contattato</th>
                    <th className="py-3.5 px-6 font-semibold text-xs text-on-surface-variant uppercase tracking-wider w-[180px]">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {filteredLeads.map((lead: any) => {
                    const displayName = lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Utente';
                    const initials = displayName.substring(0, 2).toUpperCase();
                    const formattedDate = lead.createdAt 
                      ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: it }) 
                      : 'N/D';

                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-surface-container-lowest/70 transition-colors group"
                        id={`lead-row-${lead.id}`}
                      >
                        {/* Lead Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-primary leading-tight">{displayName}</p>
                              <p className="text-xs text-on-surface-variant font-medium">{lead.email}</p>
                              {lead.phone && <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{lead.phone}</p>}
                            </div>
                          </div>
                        </td>

                        {/* Project Info */}
                        <td className="py-4 px-6 text-sm text-on-surface font-medium">
                          {lead.projectId || '—'}
                        </td>

                        {/* Source Tag */}
                        <td className="py-4 px-6">
                          {renderSourceBadge(lead.source)}
                        </td>

                        {/* Received Time */}
                        <td className="py-4 px-6 text-xs text-on-surface-variant leading-relaxed">
                          <p className="font-medium text-on-surface">{formattedDate}</p>
                          {lead.message && (
                            <p className="italic text-[11px] text-on-surface-variant max-w-xs truncate mt-0.5" title={lead.message}>
                              &ldquo;{lead.message}&rdquo;
                            </p>
                          )}
                        </td>

                        {/* Interactive Status Select Component */}
                        <td className="py-4 px-6">
                          <LeadStatusSelect leadId={lead.id} currentStatus={lead.status || 'new'} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Custom Footer */}
            <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-low/50">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Mostrati {filteredLeads.length} di {leads.length} leads
              </p>
            </div>
          </>
        ) : (
          /* Center Centered Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-6" id="leads-empty-state">
            <div className="w-16 h-16 bg-outline-variant/15 text-on-surface-variant rounded-full flex items-center justify-center mb-5 border border-outline-variant/30">
              <Inbox className="w-7 h-7 text-primary/70" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Nessun lead trovato</h3>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Collega Meta Ads o pubblica una landing page per ricevere i primi contatti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
