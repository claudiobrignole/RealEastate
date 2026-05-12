import { Download, Plus, MoreVertical, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function CampaignsPage() {
  return (
    <div className="pt-12 p-margin min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-lg mt-sm">
        <div>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xs">Performance Summary</p>
          <h2 className="font-h2 text-h2 text-primary">Q3 2023 Campaigns</h2>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm border border-outline-variant text-primary font-data-point text-data-point rounded-DEFAULT hover:bg-surface-container-low transition-colors flex items-center gap-xs">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="px-md py-sm bg-primary text-on-primary font-data-point text-data-point rounded-DEFAULT hover:bg-surface-tint transition-colors flex items-center gap-xs shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md relative overflow-hidden group">
          <div className="flex justify-between items-start mb-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Spend</p>
          </div>
          <h3 className="font-h1 text-h1 text-primary mb-xs">€124.5k</h3>
          <div className="flex items-center gap-xs text-body-sm font-body-sm">
            <span className="text-tertiary flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +12.4%</span>
            <span className="text-outline">vs last month</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-variant">
            <div className="h-full bg-primary w-3/4"></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md relative overflow-hidden group">
          <div className="flex justify-between items-start mb-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Cost per Lead (CPL)</p>
          </div>
          <h3 className="font-h1 text-h1 text-primary mb-xs">€42.10</h3>
          <div className="flex items-center gap-xs text-body-sm font-body-sm">
            <span className="text-[#4a6b5d] flex items-center"><TrendingDown className="w-4 h-4 mr-1" /> -5.2%</span>
            <span className="text-outline">vs last month</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md mb-lg">
        <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
          <h3 className="font-h3 text-h3 text-primary">Platform Comparison: Meta vs Google</h3>
          <div className="flex gap-sm">
            <div className="flex items-center gap-xs">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="font-label-caps text-label-caps text-on-surface-variant">Google Ads</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="w-3 h-3 bg-tertiary rounded-full"></div>
              <span className="font-label-caps text-label-caps text-on-surface-variant">Meta Ads</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full relative flex items-end justify-between px-md pt-md">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-label-caps text-outline pb-6">
            <span>100k</span>
            <span>75k</span>
            <span>50k</span>
            <span>25k</span>
            <span>0</span>
          </div>
          
          <div className="absolute left-10 right-0 top-0 h-full flex flex-col justify-between pb-6 z-0">
            <div className="w-full border-t border-surface-variant"></div>
            <div className="w-full border-t border-surface-variant"></div>
            <div className="w-full border-t border-surface-variant"></div>
            <div className="w-full border-t border-surface-variant"></div>
            <div className="w-full border-t border-surface-variant"></div>
          </div>
          
          <div className="relative z-10 w-full flex justify-around pl-10 items-end h-[calc(100%-24px)]">
            <div className="flex gap-xs items-end h-full">
              <div className="w-8 bg-primary h-[60%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
              <div className="w-8 bg-tertiary h-[45%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
            </div>
            <div className="flex gap-xs items-end h-full">
              <div className="w-8 bg-primary h-[75%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
              <div className="w-8 bg-tertiary h-[55%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
            </div>
            <div className="flex gap-xs items-end h-full">
              <div className="w-8 bg-primary h-[65%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
              <div className="w-8 bg-tertiary h-[80%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
            </div>
            <div className="flex gap-xs items-end h-full">
              <div className="w-8 bg-primary h-[90%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
              <div className="w-8 bg-tertiary h-[70%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-10 right-0 flex justify-around text-label-caps text-outline">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>

      <div className="mb-lg">
        <h3 className="font-h3 text-h3 text-primary mb-md">Active Campaigns Overview</h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Campaign Name</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Platform</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Spend</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Leads</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">CPL</th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                <td className="py-md px-md">
                  <p className="font-data-point text-primary">Luxury Villas - Milan Center</p>
                  <p className="text-outline text-xs mt-1">ID: CAM-9921-MIL</p>
                </td>
                <td className="py-md px-md">
                  <span className="inline-flex items-center gap-xs px-2 py-1 rounded border border-outline-variant text-[12px] text-on-surface-variant">
                    Google Search
                  </span>
                </td>
                <td className="py-md px-md text-right font-data-point text-primary">€45,210</td>
                <td className="py-md px-md text-right">312</td>
                <td className="py-md px-md text-right text-tertiary font-medium">€144.90</td>
                <td className="py-md px-md text-center">
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                <td className="py-md px-md">
                  <p className="font-data-point text-primary">Lake Como Penthouses Retargeting</p>
                  <p className="text-outline text-xs mt-1">ID: CAM-8834-LCO</p>
                </td>
                <td className="py-md px-md">
                  <span className="inline-flex items-center gap-xs px-2 py-1 rounded border border-outline-variant text-[12px] text-on-surface-variant">
                    Meta Display
                  </span>
                </td>
                <td className="py-md px-md text-right font-data-point text-primary">€28,450</td>
                <td className="py-md px-md text-right">485</td>
                <td className="py-md px-md text-right text-[#4a6b5d] font-medium">€58.65</td>
                <td className="py-md px-md text-center">
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
