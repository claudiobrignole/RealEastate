import { ChevronLeft, ChevronRight, Plus, RefreshCw, Clock } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="pt-12 p-lg flex-1 flex flex-col md:flex-row gap-gutter max-w-[1600px] mx-auto w-full min-h-screen">
      <div className="flex-[3] flex flex-col gap-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest p-md border border-outline-variant rounded gap-4">
          <div className="flex items-center gap-sm">
            <button className="p-xs hover:bg-surface-container rounded transition-colors"><ChevronLeft className="w-5 h-5"/></button>
            <h3 className="font-h3 text-h3 text-primary w-48 text-center">Novembre 2023</h3>
            <button className="p-xs hover:bg-surface-container rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
          </div>
          <div className="flex bg-surface-container rounded p-xs">
            <button className="px-md py-xs rounded bg-surface-container-lowest shadow-sm font-data-point text-data-point text-primary">Mese</button>
            <button className="px-md py-xs rounded text-on-surface-variant font-data-point text-data-point hover:bg-surface-container-lowest/50 transition-colors">Settimana</button>
            <button className="px-md py-xs rounded text-on-surface-variant font-data-point text-data-point hover:bg-surface-container-lowest/50 transition-colors">Giorno</button>
          </div>
          <button className="bg-primary text-on-primary px-md py-sm rounded font-data-point text-data-point hover:bg-primary/90 transition-colors flex items-center gap-xs">
            <Plus className="w-4 h-4"/>
            Nuovo Appuntamento
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded flex-1 flex flex-col overflow-hidden min-h-[600px]">
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low hidden md:grid">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="p-sm text-center font-label-caps text-label-caps text-on-surface-variant uppercase">{day}</div>
            ))}
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-7 auto-rows-fr">
            {/* Just a representative grid. In a real app we'd map over days */}
            <div className="border-r border-b border-outline-variant/50 p-sm bg-surface-container-lowest/50 opacity-50 hidden md:block"><span className="font-data-point text-data-point text-on-surface-variant">30</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm bg-surface-container-lowest/50 opacity-50 hidden md:block"><span className="font-data-point text-data-point text-on-surface-variant">31</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">1</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">2</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">3</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">4</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">5</span></div>

            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">6</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm">
              <span className="font-data-point text-data-point text-on-surface-variant">7</span>
              <div className="mt-xs bg-surface-container px-xs py-[2px] rounded text-xs truncate border-l-2 border-outline-variant font-body-sm text-body-sm text-on-surface">10:00 - Visita</div>
            </div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">8</span></div>
            
            <div className="border-r border-b border-tertiary p-sm bg-tertiary/5 relative">
              <span className="font-data-point text-data-point text-tertiary bg-tertiary/20 w-6 h-6 flex items-center justify-center rounded-full mb-xs">9</span>
              <div className="bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded mb-xs shadow-sm cursor-pointer hover:border-tertiary transition-colors">
                <div className="flex justify-between items-center mb-[2px]">
                  <span className="font-data-point text-[11px] text-tertiary">14:30</span>
                </div>
                <div className="font-body-sm text-[12px] text-primary truncate font-semibold">Attico Brera</div>
                <div className="font-body-sm text-[11px] text-on-surface-variant truncate">M. Rossi</div>
              </div>
              <div className="bg-surface-container px-sm py-xs rounded border-l-2 border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="font-data-point text-[11px] text-on-surface-variant">16:00</div>
                <div className="font-body-sm text-[12px] text-primary truncate">Call Conoscitiva</div>
              </div>
            </div>
            
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">10</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">11</span></div>
            <div className="border-r border-b border-outline-variant/50 p-sm"><span className="font-data-point text-data-point text-on-surface-variant">12</span></div>
          </div>
        </div>
      </div>

      <aside className="flex-[1.2] flex flex-col gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md">
          <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
             <h3 className="font-h3 text-[20px] text-primary">Oggi, 9 Novembre</h3>
             <button className="px-sm py-xs border border-outline-variant text-on-surface rounded font-data-point text-[12px] hover:bg-surface-container transition-colors flex items-center gap-xs">
              <RefreshCw className="w-3 h-3"/> Sync
            </button>
          </div>
          <div className="flex flex-col gap-sm">
            <div className="border border-tertiary bg-tertiary/5 rounded p-sm relative cursor-pointer group">
              <div className="absolute top-0 left-0 w-1 h-full bg-tertiary rounded-l"></div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <span className="font-data-point text-data-point text-tertiary block">14:30 - 15:30</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mt-xs block">Visita Immobile</span>
                </div>
                <span className="bg-tertiary/20 text-tertiary font-label-caps text-[10px] px-2 py-1 rounded">Confermato</span>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-primary mb-xs group-hover:text-tertiary transition-colors">Attico Brera, Via Fiori Chiari</h4>
              <div className="flex items-center gap-sm mt-sm pt-sm border-t border-outline-variant/50">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-data-point text-xs">MR</div>
                <div>
                  <div className="font-body-sm text-[13px] text-primary font-medium">Marco Rossi</div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant">Lead Qualificato</div>
                </div>
              </div>
            </div>

            <div className="border border-outline-variant bg-surface rounded p-sm relative cursor-pointer hover:bg-surface-container-lowest transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-outline-variant rounded-l"></div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <span className="font-data-point text-data-point text-on-surface-variant block">16:00 - 16:30</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mt-xs block">Video Call</span>
                </div>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-primary mb-xs">Presentazione Portfolio</h4>
              <div className="flex items-center gap-sm mt-sm pt-sm border-t border-outline-variant/50">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-data-point text-[12px] text-on-surface-variant">EB</div>
                <div>
                  <div className="font-body-sm text-[13px] text-primary font-medium">Elena Bianchi</div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant">Nuovo Contatto</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md">
          <h3 className="font-body-md text-[16px] font-semibold text-primary mb-md flex items-center justify-between">
            Da Confermare
            <span className="bg-surface-container-high text-on-surface-variant font-data-point text-[12px] px-2 py-1 rounded-full">1</span>
          </h3>
          <div className="flex flex-col gap-sm">
            <div className="flex items-start gap-sm p-sm border-b border-outline-variant/50 last:border-0">
              <Clock className="text-outline w-5 h-5 mt-[2px]"/>
              <div className="flex-1">
                <div className="font-body-sm text-[14px] text-primary font-medium">Dom 12 Nov, 10:00</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Richiesta visita da G. Verdi</div>
                <div className="flex gap-xs mt-sm">
                  <button className="flex-1 bg-primary text-on-primary font-data-point text-[12px] py-1 rounded hover:bg-primary/90 transition-colors">Accetta</button>
                  <button className="flex-1 border border-outline-variant text-on-surface font-data-point text-[12px] py-1 rounded hover:bg-surface-container transition-colors">Riproponi</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
