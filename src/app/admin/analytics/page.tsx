import { TrendingUp, TrendingDown, Minus, Download, MoreHorizontal } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <main className="p-margin flex-grow w-full max-w-[1600px] mx-auto pt-20">
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Analytics Avanzate</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Deep-dive reporting and performance metrics across your high-value luxury asset campaigns.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border border-outline-variant rounded-DEFAULT bg-surface-container-lowest overflow-hidden">
            <button className="px-4 py-2 font-data-point text-data-point text-primary bg-surface-container-low border-r border-outline-variant hover:bg-surface-variant transition-colors">Last 30 Days</button>
            <button className="px-4 py-2 font-data-point text-data-point text-on-surface-variant border-r border-outline-variant hover:bg-surface-variant transition-colors">90 Days</button>
            <button className="px-4 py-2 font-data-point text-data-point text-on-surface-variant hover:bg-surface-variant transition-colors">Year</button>
          </div>
          <button className="h-10 px-4 bg-primary text-on-primary font-data-point text-data-point rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-2">
            <Download className="w-5 h-5"/> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Portfolio Value</p>
            <h3 className="font-h2 text-h2 text-primary mt-2">€42.5M</h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-secondary"/>
            <span className="font-data-point text-data-point text-secondary">+12.4% vs last period</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-surface-tint"></div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Active Leads</p>
            <h3 className="font-h2 text-h2 text-primary mt-2">843</h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-secondary"/>
            <span className="font-data-point text-data-point text-secondary">+5.2% vs last period</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Conversion Rate</p>
            <h3 className="font-h2 text-h2 text-primary mt-2">4.8%</h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
             <Minus className="w-4 h-4 text-outline"/>
            <span className="font-data-point text-data-point text-on-surface-variant">0.0% vs last period</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-tertiary-container"></div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Avg. Time to Close</p>
            <h3 className="font-h2 text-h2 text-primary mt-2">45 Days</h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingDown className="w-4 h-4 text-error"/>
            <span className="font-data-point text-data-point text-error">-2 days vs last period</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-h3 text-primary">Conversion Funnel</h3>
            <button className="text-on-surface-variant hover:text-primary"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <FunnelStep label="Landing Visit" count="12,500" value={100} color="bg-primary" text="text-on-primary" />
            <FunnelStep label="Lead Captured" count="5,625" value={45} color="bg-surface-tint" text="text-on-primary" subtitle="45% conversion" />
            <FunnelStep label="Qualified" count="2,500" value={20} color="bg-secondary" text="text-on-primary" subtitle="44% conversion" />
            <FunnelStep label="Viewing Booked" count="1,250" value={10} color="bg-tertiary" text="text-on-primary" subtitle="50% conversion" />
            <FunnelStep label="Sale Closed" count="600" value={4} color="bg-tertiary-container" text="text-on-primary-container" subtitle="4.8% overall" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-h3 text-primary">Demographics</h3>
            <button className="text-on-surface-variant hover:text-primary"><MoreHorizontal className="w-5 h-5"/></button>
          </div>
          <div className="flex-grow flex flex-col justify-center gap-6">
            <div className="w-48 h-48 rounded-full border-8 border-surface-container-low mx-auto relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-primary" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)'}}></div>
              <div className="absolute inset-0 rounded-full border-8 border-secondary" style={{clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)'}}></div>
              <div className="absolute inset-0 rounded-full border-8 border-tertiary" style={{clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)'}}></div>
              <div className="text-center">
                <span className="block font-h2 text-h2 text-primary">843</span>
                <span className="block font-label-caps text-label-caps text-on-surface-variant">Total Profiles</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <DemographicItem label="HNWI Investors" color="bg-primary" value="45%" />
              <DemographicItem label="Corporate Buyers" color="bg-secondary" value="30%" />
              <DemographicItem label="Private Families" color="bg-tertiary" value="25%" />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function FunnelStep({ label, count, value, color, text, subtitle }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 font-data-point text-data-point text-on-surface-variant text-right">{label}</div>
      <div className="flex-grow h-10 rounded-r-DEFAULT relative overflow-hidden bg-surface-container-low border-y border-r border-outline-variant">
        <div className={`absolute top-0 left-0 h-full ${color}`} style={{ width: `${value}%` }}></div>
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-data-point text-data-point ${value === 100 ? 'mix-blend-difference text-white' : text} z-10`}>
          {count}
        </span>
        {subtitle && (
          <span className="absolute left-[calc(var(--value-width)+2%)] top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-on-surface-variant z-10" style={{ '--value-width': `${value}%` } as any}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

function DemographicItem({ label, color, value }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
      </div>
      <span className="font-data-point text-data-point text-primary">{value}</span>
    </div>
  );
}
