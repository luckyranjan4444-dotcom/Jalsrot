import React from 'react';
import { ActiveTab } from '../../types';
import {
  Menu,
  Shield,
  HelpCircle,
  Database,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onToggleMobileMenu?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
}) => {
  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'JalSrot Dashboard', subtitle: 'Identify probable recharge zones and plan suitable spring-revival interventions.' };
      case 'springs':
        return { title: 'Spring Explorer', subtitle: 'Spatial inventory of 128 mountain springs, discharge profiles, and hydrogeological tags.' };
      case 'recharge':
        return { title: 'Recharge Zone Analysis', subtitle: 'Multi-criteria GIS and AI modeling of probable surface and sub-surface recharge zones.' };
      case 'interventions':
        return { title: 'Intervention Planning', subtitle: 'Evidence-based engineering interventions prioritized for optimal springshed conservation.' };
      case 'risk':
        return { title: 'Risk Assessment & Screening', subtitle: 'Geotechnical, landslide, steep slope, and data uncertainty screening.' };
      case 'validation':
        return { title: 'Field Validation', subtitle: 'Ground-truthing portal for barefoot hydrogeologists, field engineers, and block officials.' };
      case 'community':
        return { title: 'Community Observations', subtitle: 'Participatory indigenous knowledge, seasonal memory, and local water records.' };
      case 'reports':
        return { title: 'JalSrot Recharge Planning Report', subtitle: 'Downloadable DPR summaries, village action plans, and spatial GIS sheets.' };
      case 'data':
        return { title: 'Data Management & Model Lineage', subtitle: 'Spatial layers, DEM resolutions, model explainability weights, and datasets.' };
    }
  };

  const currentInfo = getTabTitle(activeTab);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Title & Subtitle */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                {currentInfo.title}
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                Govt. GIS Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search + Data Quality & Confidence Pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative w-44 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search spring / site..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Data Quality & Confidence Standard Indicator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <span className="text-[11px] text-slate-500">Pred. Confidence:</span>
              <span className="font-bold text-slate-900 font-mono">82%</span>
            </div>
            <span className="h-3 w-px bg-slate-200"></span>
            <div className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px]">Data: Good</span>
            </div>
          </div>

          {/* Demo Badge */}
          <span className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded uppercase">
            Demo Data
          </span>
        </div>
      </div>
    </header>
  );
};
