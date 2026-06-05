import Link from 'next/link';
import { getLeadStats } from '@/lib/actions/leads';
import ExportLeadsButton from '@/components/admin/ExportLeadsButton';
import { 
  Settings, 
  Users, 
  Facebook, 
  Globe, 
  Info, 
} from 'lucide-react';

export default async function CampaignsPage() {
  const statsRes = await getLeadStats();
  
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    total: 0,
    bySource: { landing_page: 0, meta_ads: 0, landing_form: 0, other: 0 },
    byStatus: { new: 0, contacted: 0, qualified: 0, lost: 0 },
    thisMonth: 0
  };

  const total = stats.total;

  // Horizontal bar calculations mapping
  const sourcesList = [
    { key: 'meta_ads', label: 'Meta Ads (Facebook Co-lead)', count: stats.bySource.meta_ads || 0, color: 'bg-[#1877F2]' },
    { key: 'landing_page', label: 'Landing Page (Visite)', count: stats.bySource.landing_page || 0, color: 'bg-emerald-600' },
    { key: 'landing_form', label: 'Landing Form (Contatti)', count: stats.bySource.landing_form || 0, color: 'bg-teal-600' },
    { key: 'other', label: 'Sorgente Altro', count: stats.bySource.other || 0, color: 'bg-neutral-500' }
  ];

  const statusList = [
    { key: 'new', label: 'Nuovo (New)', count: stats.byStatus.new || 0, color: 'bg-blue-600' },
    { key: 'contacted', label: 'Contattato (Contacted)', count: stats.byStatus.contacted || 0, color: 'bg-amber-500' },
    { key: 'qualified', label: 'Qualificato (Qualified)', count: stats.byStatus.qualified || 0, color: 'bg-emerald-600' },
    { key: 'lost', label: 'Perso (Lost)', count: stats.byStatus.lost || 0, color: 'bg-rose-500' }
  ];

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto" id="admin-analytics-container">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8 mt-2">
        <div>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-1">Performance & Analytics</p>
          <h2 className="font-h1 text-h1 text-primary">Report Acquisizione</h2>
        </div>
        <ExportLeadsButton />
      </div>

      {/* KPI 3-card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="analytics-kpi-grid">
        {/* KPI 1: Lead Totali */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="card-total-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Lead Totali</p>
            <h3 className="text-3xl font-black text-primary mt-2">{stats.total}</h3>
            <p className="text-[11px] text-on-surface-variant mt-1">Acquisiti nel database del CRM</p>
          </div>
          <div className="p-2.5 bg-primary/5 text-primary rounded-lg border border-primary/10">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Da Meta Ads */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="card-meta-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Da Meta Ads</p>
            <h3 className="text-3xl font-black text-primary mt-2">{stats.bySource.meta_ads || 0}</h3>
            <p className="text-[11px] text-on-surface-variant mt-1">Sincronizzazione webhook Meta</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-lg border border-blue-500/10">
            <Facebook className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Da Landing Page */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-start justify-between" id="card-landing-leads">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Da Landing Page</p>
            <h3 className="text-3xl font-black text-primary mt-2">
              {(stats.bySource.landing_page || 0) + (stats.bySource.landing_form || 0)}
            </h3>
            <p className="text-[11px] text-on-surface-variant mt-1">Form di contatto su Landing Page</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-lg border border-emerald-500/10">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Meta Ad Spend / Cost Banner */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-sm" id="spend-cpl-banner">
        <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 bg-transparent">
          <p className="font-bold text-primary text-sm">Integrazione Ads non collegata per Spesa / CPL</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Le statistiche sul budget, sulla spesa e sul CPL (Cost per Lead) saranno disponibili dopo aver collegato il tuo account Meta Ads nelle impostazioni generali dell&apos;agenzia.
          </p>
          <div className="pt-2 bg-transparent">
            <Link 
              href="/admin/settings" 
              className="text-xs font-bold text-primary hover:text-surface-tint inline-flex items-center gap-1 group transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Configura Meta Ads nelle Impostazioni &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column charts using pure CSS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="source-status-visualizer-grid">
        {/* Source Analysis */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-6" id="card-sources-distribution">
          <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-primary">Leads per Sorgente</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-mono">Provenienza</span>
          </div>

          <div className="space-y-5 bg-transparent">
            {sourcesList.map((src) => {
              const pct = total > 0 ? (src.count / total) * 100 : 0;
              return (
                <div key={src.key} className="space-y-2 bg-transparent">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-primary font-bold">{src.label}</span>
                    <span className="font-mono text-on-surface-variant font-semibold">
                      {src.count} lead ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-outline-variant/20 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`${src.color} h-full rounded-full transition-all duration-500`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-6" id="card-status-distribution">
          <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-primary">Distribuzione per Stato</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-mono">Fase Pipeline</span>
          </div>

          <div className="space-y-5 bg-transparent">
            {statusList.map((status) => {
              const pct = total > 0 ? (status.count / total) * 100 : 0;
              return (
                <div key={status.key} className="space-y-2 bg-transparent">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-primary font-bold">{status.label}</span>
                    <span className="font-mono text-on-surface-variant font-semibold">
                      {status.count} lead ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-outline-variant/20 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`${status.color} h-full rounded-full transition-all duration-500`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
