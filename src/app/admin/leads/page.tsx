import { MoreHorizontal } from 'lucide-react';
import { getLeads } from '@/lib/actions/leads';
import { formatDistanceToNow } from 'date-fns';

export default async function LeadsPage() {
  const result = await getLeads();
  const leads = result.success ? result.data : [];

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-h1 text-h1 text-primary mb-xs">CRM & Leads</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Manage and track your high-value client pipeline.</p>
        </div>
        <button className="bg-primary text-on-primary px-md py-sm rounded-DEFAULT font-data-point text-data-point uppercase tracking-wider flex items-center gap-xs hover:bg-surface-tint transition-colors">
          Export Leads
        </button>
      </div>

      <div className="flex gap-gutter flex-col md:flex-row">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT md:sticky top-32">
            <h3 className="font-h3 text-h3 text-primary mb-md border-b border-outline-variant pb-xs">Filters</h3>
            <div className="mb-md">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-sm">Lead Source</h4>
              <div className="flex flex-col gap-xs">
                <label className="flex items-center gap-sm cursor-pointer group">
                  <input type="checkbox" defaultChecked className="rounded-DEFAULT border-outline-variant text-tertiary focus:ring-tertiary bg-transparent" />
                  <span className="font-body-md text-body-md text-primary group-hover:text-tertiary transition-colors">All Sources</span>
                </label>
                <label className="flex items-center gap-sm cursor-pointer group">
                  <input type="checkbox" className="rounded-DEFAULT border-outline-variant text-tertiary focus:ring-tertiary bg-transparent" />
                  <span className="font-body-md text-body-md text-primary group-hover:text-tertiary transition-colors">Landing Page</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Lead Name</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Project</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Last Contacted</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads && leads.length > 0 ? leads.map((lead: any) => {
                const displayName = lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Sconosciuto';
                const initials = displayName.substring(0, 2).toUpperCase();
                const createdAt = lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }) : 'Unknown';
                
                return (
                  <tr key={lead.id} className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer">
                    <td className="py-md px-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-h3 text-h3 text-tertiary">
                          {initials}
                        </div>
                        <div>
                          <p className="font-data-point text-data-point text-primary">{displayName}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant">
                       {lead.projectId || 'Generico'}
                    </td>
                    <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant">{createdAt}</td>
                    <td className="py-md px-md">
                      <span className="inline-flex items-center px-sm py-xs rounded-DEFAULT border border-tertiary text-tertiary font-label-caps text-label-caps uppercase bg-tertiary/10">Nuovo</span>
                    </td>
                    <td className="py-md px-md text-right">
                      <button className="text-on-surface-variant hover:text-tertiary transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                 <tr>
                    <td colSpan={5} className="py-xl px-md text-center text-on-surface-variant font-body-md">
                      Nessun lead trovato
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
          <div className="border-t border-outline-variant p-sm flex items-center justify-between bg-surface">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Showing {leads?.length || 0} leads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
