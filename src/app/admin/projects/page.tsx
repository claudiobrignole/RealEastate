import { getProjects } from '@/lib/actions/projects';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectsPage() {
  const result = await getProjects();
  const projects = result.success ? result.data : [];

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg space-y-md md:space-y-0">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Progetti & Landing</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">Gestisci lo sviluppo immobiliare di pregio. Monitora le performance delle landing page e lo stato dei progetti attivi.</p>
        </div>
        <Link href="/admin/projects/new" className="bg-primary text-on-primary font-data-point text-data-point px-lg py-sm rounded-DEFAULT hover:bg-inverse-surface transition-colors flex items-center space-x-xs">
          <span>Nuovo Progetto</span>
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-sm mb-lg flex flex-col md:flex-row items-center justify-between gap-sm">
        <div className="relative w-full md:w-96">
          <input className="w-full pl-4 pr-sm py-sm bg-surface border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm text-on-surface focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all outline-none placeholder:text-on-surface-variant" placeholder="Cerca progetto o località..." type="text" />
        </div>
        <div className="flex items-center space-x-sm w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button className="px-sm py-xs border border-tertiary text-tertiary font-label-caps text-label-caps rounded-DEFAULT whitespace-nowrap bg-tertiary/5">Tutti i Progetti</button>
          <button className="px-sm py-xs border border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary font-label-caps text-label-caps rounded-DEFAULT transition-colors whitespace-nowrap">Attivi</button>
          <button className="px-sm py-xs border border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary font-label-caps text-label-caps rounded-DEFAULT transition-colors whitespace-nowrap">In Bozza</button>
          <button className="px-sm py-xs border border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary font-label-caps text-label-caps rounded-DEFAULT transition-colors whitespace-nowrap flex items-center space-x-xs">
            <span>Filtri Avanzati</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {projects && projects.length > 0 ? (
          projects.map((project: any) => {
            const defaultContent = project.content?.['it'] || { title: 'Nuovo Progetto' };
            const availableLangs = Object.keys(project.content || {}).filter(k => project.content[k]?.title || project.content[k]?.content);
            const publicUrl = `/${project.slug || project.id}`;
            
            // Generate a random-looking but deterministic leads number for the UI mockup
            const mockLeads = project.id ? (project.id.charCodeAt(0) * project.id.charCodeAt(1)) % 150 : 0;
            
            return (
              <Link href={publicUrl} target="_blank" key={project.id} className="group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:border-tertiary transition-all duration-300 relative flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <div className="h-64 relative overflow-hidden flex-shrink-0">
                  <img alt={defaultContent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ" />
                  <div className="absolute top-sm right-sm flex space-x-xs">
                    <span className="bg-surface/90 text-tertiary font-label-caps text-label-caps px-2 py-1 rounded-sm backdrop-blur-sm border border-outline-variant/50 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      <span>Active</span>
                    </span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-xs">
                    <h3 className="font-h3 text-h3 text-primary">{defaultContent.title}</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center mb-md line-clamp-1">
                    {defaultContent.subtitle || 'Nessun sottotitolo'}
                  </p>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-sm mt-auto">
                    <div className="flex items-center space-x-xs text-on-surface-variant">
                      {availableLangs.map((langCode) => (
                        <span key={langCode} className="font-label-caps text-[10px] border border-outline-variant px-1 rounded-sm uppercase">{langCode}</span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-sm">
                      <span className="flex items-center text-body-sm font-body-sm text-on-surface-variant" title="Leads">
                        {mockLeads} Leads
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="col-span-full text-center py-xl bg-surface-container-low rounded-lg border border-outline-variant border-dashed">
            <h3 className="font-h3 text-h3 text-primary mb-sm">Nessun progetto trovato</h3>
            <p className="text-on-surface-variant mb-md">Non hai ancora creato alcuna landing page.</p>
            <Link href="/admin/projects/new" className="inline-block px-lg py-sm bg-primary text-on-primary rounded font-label-caps uppercase hover:bg-tertiary transition-colors border border-transparent">
              Crea il tuo primo progetto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
