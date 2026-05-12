import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AdminPage() {
  return (
    <main className="p-lg max-w-[1400px] mx-auto flex flex-col gap-lg">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-sm shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:border-secondary transition-colors">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Lead Totali
          </span>
          <div className="flex items-end justify-between">
            <span className="font-h2 text-h2 text-primary">1,284</span>
            <div className="flex items-center gap-xs text-secondary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-data-point text-data-point">+12%</span>
            </div>
          </div>
          <div className="h-10 w-full mt-2 relative">
            <svg className="w-full h-full preserve-aspect-ratio-none stroke-secondary fill-none" strokeWidth="2" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 25 L10 20 L20 22 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8 L90 2 L100 0"></path>
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-sm shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:border-secondary transition-colors">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Costo per Lead (CPL)
          </span>
          <div className="flex items-end justify-between">
            <span className="font-h2 text-h2 text-primary">€4.50</span>
            <div className="flex items-center gap-xs text-secondary mb-1">
               <TrendingDown className="w-4 h-4" />
              <span className="font-data-point text-data-point">-5%</span>
            </div>
          </div>
          <div className="h-10 w-full mt-2 relative">
            <svg className="w-full h-full preserve-aspect-ratio-none stroke-secondary fill-none" strokeWidth="2" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 5 L10 8 L20 4 L30 10 L40 7 L50 15 L60 12 L70 20 L80 18 L90 25 L100 22"></path>
            </svg>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-sm shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:border-secondary transition-colors">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Costo per Visita
          </span>
          <div className="flex items-end justify-between">
            <span className="font-h2 text-h2 text-primary">€0.85</span>
            <div className="flex items-center gap-xs text-outline mb-1">
               <Minus className="w-4 h-4" />
              <span className="font-data-point text-data-point text-on-surface-variant">Stable</span>
            </div>
          </div>
          <div className="h-10 w-full mt-2 relative">
            <svg className="w-full h-full preserve-aspect-ratio-none stroke-outline fill-none" strokeWidth="2" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 15 L10 14 L20 16 L30 15 L40 15 L50 14 L60 16 L70 15 L80 14 L90 15 L100 15"></path>
            </svg>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-sm shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:border-secondary transition-colors">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Conversion Rate
          </span>
          <div className="flex items-end justify-between">
            <span className="font-h2 text-h2 text-primary">3.8%</span>
            <div className="flex items-center gap-xs text-secondary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-data-point text-data-point">+0.2%</span>
            </div>
          </div>
          <div className="h-10 w-full mt-2 relative">
            <svg className="w-full h-full preserve-aspect-ratio-none stroke-secondary fill-none" strokeWidth="2" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 20 L10 22 L20 18 L30 15 L40 19 L50 12 L60 14 L70 8 L80 10 L90 5 L100 2"></path>
            </svg>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section className="lg:col-span-2 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-md shadow-[0_4px_24px_rgba(26,28,31,0.03)]">
            <div className="flex justify-between items-center">
              <h2 className="font-h3 text-h3 text-primary">Traffico vs Lead Generati</h2>
              <span className="font-body-sm text-body-sm text-on-surface-variant">30 Giorni</span>
            </div>
            <div className="h-64 w-full relative mt-sm border-b border-l border-outline-variant flex items-end pt-4 pr-4">
              <div className="absolute inset-0 pl-[1px] pb-[1px] flex items-end overflow-hidden" 
                   style={{ backgroundImage: 'linear-gradient(180deg, rgba(232, 232, 231, 0.5) 0%, rgba(249, 249, 248, 0) 100%)' }}>
                <svg className="w-full h-full preserve-aspect-ratio-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path fill="rgba(117, 90, 38, 0.1)" d="M0 100 L0 80 L10 75 L20 60 L30 65 L40 40 L50 50 L60 30 L70 35 L80 15 L90 20 L100 5 L100 100 Z"></path>
                  <path fill="none" stroke="#755a26" strokeWidth="2" d="M0 80 L10 75 L20 60 L30 65 L40 40 L50 50 L60 30 L70 35 L80 15 L90 20 L100 5"></path>
                  <path fill="rgba(69, 71, 74, 0.05)" d="M0 100 L0 90 L10 88 L20 80 L30 82 L40 70 L50 75 L60 60 L70 65 L80 50 L90 55 L100 40 L100 100 Z"></path>
                  <path fill="none" stroke="#45474a" strokeDasharray="4" strokeWidth="1.5" d="M0 90 L10 88 L20 80 L30 82 L40 70 L50 75 L60 60 L70 65 L80 50 L90 55 L100 40"></path>
                </svg>
              </div>
            </div>
            <div className="flex gap-md mt-sm justify-center">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Traffico</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full border border-on-surface-variant border-dashed"></div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Lead</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-md shadow-[0_4px_24px_rgba(26,28,31,0.03)] h-[340px]">
            <h2 className="font-h3 text-h3 text-primary">Sorgenti di Traffico</h2>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-40 h-40 rounded-full border-[16px] border-surface-container-high border-transparent relative flex items-center justify-center"
                   style={{
                     background: 'conic-gradient(from 0deg, #755a26 0% 45%, #45474a 45% 80%, #c6c6ca 80% 100%)',
                     WebkitMask: 'radial-gradient(transparent 55%, black 56%)',
                     mask: 'radial-gradient(transparent 55%, black 56%)'
                   }}>
                <div className="text-center z-10 flex flex-col items-center">
                  <span className="font-h2 text-h2 text-primary leading-none">100%</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Totale</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-xs mt-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Meta Ads</span>
                </div>
                <span className="font-data-point text-data-point text-primary">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-on-surface-variant"></div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Google Ads</span>
                </div>
                <span className="font-data-point text-data-point text-primary">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Organico</span>
                </div>
                <span className="font-data-point text-data-point text-primary">20%</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-md shadow-[0_4px_24px_rgba(26,28,31,0.03)]">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="font-h3 text-h3 text-primary">Recent Leads</h2>
            <button className="font-data-point text-data-point text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-xs">
              Vedi Tutti
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-sm px-sm font-label-caps text-label-caps text-on-surface-variant font-normal">Nome Contatto</th>
                  <th className="py-sm px-sm font-label-caps text-label-caps text-on-surface-variant font-normal">Unità/Progetto</th>
                  <th className="py-sm px-sm font-label-caps text-label-caps text-on-surface-variant font-normal">Sorgente</th>
                  <th className="py-sm px-sm font-label-caps text-label-caps text-on-surface-variant font-normal">Stato Trattativa</th>
                  <th className="py-sm px-sm font-label-caps text-label-caps text-on-surface-variant font-normal text-right">Azione</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-variant hover:bg-surface-container-low transition-colors group">
                  <td className="py-sm px-sm">
                    <div className="flex items-center gap-sm">
                      <div className="h-8 w-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-data-point text-[12px]">MR</div>
                      <span className="font-body-md text-body-md text-primary font-medium">Marco Rossi</span>
                    </div>
                  </td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">Attico Domus 46</td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">Meta</td>
                  <td className="py-sm px-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-[10px]">Sopralluogo Fissato</span>
                  </td>
                  <td className="py-sm px-sm text-right">
                    <button className="font-data-point text-data-point text-primary border border-outline-variant py-1 px-3 rounded hover:border-secondary transition-colors">Dettagli</button>
                  </td>
                </tr>
                <tr className="border-b border-surface-variant hover:bg-surface-container-low transition-colors group">
                  <td className="py-sm px-sm">
                    <div className="flex items-center gap-sm">
                      <div className="h-8 w-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-data-point text-[12px]">EB</div>
                      <span className="font-body-md text-body-md text-primary font-medium">Elena Bianchi</span>
                    </div>
                  </td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">Villa Vista Lago</td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">Google</td>
                  <td className="py-sm px-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-surface-variant text-on-surface-variant font-label-caps text-[10px]">Nuovo</span>
                  </td>
                  <td className="py-sm px-sm text-right">
                    <button className="font-data-point text-data-point text-primary border border-outline-variant py-1 px-3 rounded hover:border-secondary transition-colors">Dettagli</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-sm px-sm">
                    <div className="flex items-center gap-sm">
                      <div className="h-8 w-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-data-point text-[12px]">LV</div>
                      <span className="font-body-md text-body-md text-primary font-medium">Luca Verdi</span>
                    </div>
                  </td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">4.5 Locali Giardino</td>
                  <td className="py-sm px-sm font-body-sm text-body-sm text-on-surface-variant">Landing Form</td>
                  <td className="py-sm px-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-sm bg-secondary text-on-secondary font-label-caps text-[10px]">Offerta</span>
                  </td>
                  <td className="py-sm px-sm text-right">
                    <button className="font-data-point text-data-point text-primary border border-outline-variant py-1 px-3 rounded hover:border-secondary transition-colors">Dettagli</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-md">
          <h2 className="font-h3 text-h3 text-primary mb-xs">Active Properties</h2>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded flex overflow-hidden shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:shadow-[0_8px_32px_rgba(26,28,31,0.06)] transition-all h-32">
            <div className="w-24 h-full bg-surface-variant flex-shrink-0 relative">
               <img 
                 className="absolute inset-0 w-full h-full object-cover"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPZucRsASue8z9XCtH_iYiHJkyX3RqhtPhyTbu5I49sNQjKuT7Wd-mYoBJ-FE6wnZfErptXcuHCnF6cVTZUrkv8XkrF2_wXFadTVMySpZRk7CAmlTZ4J9NxbWKvEzUlUxuBjAnZds6yKzAnqfolz1qPReL_VdS3Ov8bHBMJLi7r0XdkTZpYeF3gs2EBEHSRDL9EvNJZtdPXrkNZh8pAPSpZ-gicmfTZJVx9j5p_m0LTSfoKDAhYMA9IDdXQ9Cw5RKeCLKwugpAfcA"
                 alt="Property 1"
               />
            </div>
            <div className="p-sm flex flex-col justify-center flex-1">
              <h3 className="font-data-point text-data-point text-primary">4.5 Locali + Giardino</h3>
              <div className="flex items-center gap-xs mt-1 text-on-surface-variant">
                <span className="font-body-sm text-body-sm">2,450 visits</span>
              </div>
              <button className="mt-sm self-start font-label-caps text-label-caps text-secondary border-b border-transparent hover:border-secondary transition-colors">MODIFICA LANDING</button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded flex overflow-hidden shadow-[0_4px_24px_rgba(26,28,31,0.03)] hover:shadow-[0_8px_32px_rgba(26,28,31,0.06)] transition-all h-32">
            <div className="w-24 h-full bg-surface-variant flex-shrink-0 relative">
               <img 
                 className="absolute inset-0 w-full h-full object-cover"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZS0Y0FFn1q3e057FdVzBxP2R57DcIInZ1-qQc3bL3OsEOgj_7PgYKT2ARhnO5M1mrBykTU1XBsWlWwYbfDBXCCUzyjOHw3QaDpGBwIDxQkCDed7uIjZRLmkMPI3snMigCfE-uhk_726kbChGBwlwVni4RzjQntrJMp9CR5MzW2qlGma-itkegGTMPQEDVaNhdN_jtfx4ajmktCTiZ7Vxax_6wclDkh0Qqrqc7ixJZd0ofmvCuk7H1j9p-aJNWW7xmNmLNfOKctO4"
                 alt="Property 2"
               />
            </div>
            <div className="p-sm flex flex-col justify-center flex-1">
              <h3 className="font-data-point text-data-point text-primary">3.5 Locali + Loggia</h3>
              <div className="flex items-center gap-xs mt-1 text-on-surface-variant">
                <span className="font-body-sm text-body-sm">1,120 visits</span>
              </div>
              <button className="mt-sm self-start font-label-caps text-label-caps text-secondary border-b border-transparent hover:border-secondary transition-colors">MODIFICA LANDING</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
