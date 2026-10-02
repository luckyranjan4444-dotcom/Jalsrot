import React from 'react';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Layers,
  MapPin,
  AlertTriangle,
  ClipboardCheck,
  MessageSquareQuote,
  FileBarChart2,
  Database,
  Mountain,
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingValidationCount?: number;
  highRiskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingValidationCount = 9,
  highRiskCount = 6,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'springs',
      label: 'Spring Explorer',
      icon: <Compass className="w-4 h-4" />,
      badge: '128',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'recharge',
      label: 'Recharge Zones',
      icon: <Layers className="w-4 h-4" />,
      badge: '42',
      badgeColor: 'bg-emerald-50 text-emerald-700 font-semibold',
    },
    {
      id: 'interventions',
      label: 'Intervention Planning',
      icon: <MapPin className="w-4 h-4" />,
      badge: '18 Sites',
      badgeColor: 'bg-sky-50 text-sky-700 font-semibold',
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: `${highRiskCount}`,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'validation',
      label: 'Field Validation',
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: `${pendingValidationCount} pending`,
      badgeColor: 'bg-orange-100 text-orange-700 font-medium',
    },
    {
      id: 'community',
      label: 'Community Observations',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileBarChart2 className="w-4 h-4" />,
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            {/* Water and Mountain Logo Symbol */}
            <div className="relative flex items-center justify-center">
              <Mountain className="w-5 h-5 text-emerald-100" />
              <span className="absolute -bottom-1 -right-1 text-sky-300 font-bold text-xs">💧</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">JalSrot</h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase tracking-wider">
                DEMO PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              Spring Revival & Recharge
            </p>
          </div>
        </div>
        
        <p className="text-[11px] text-slate-500 mt-2.5 italic border-l-2 border-emerald-600 pl-2 leading-tight">
          “Evidence-based planning for sustainable springs.”
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
          GIS Decision Support
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs border-l-3 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200/50 ${
                    item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Region Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Demo Region</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-xs font-bold text-slate-900">
            Tribal Hills – Demo Area
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Coordinates</span>
            <span className="font-mono text-slate-700">19.17° N, 83.41° E</span>
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="inline-block text-[10px] text-amber-700 font-medium bg-amber-50 border border-amber-200/60 rounded px-2 py-0.5">
            ⚠️ DEMO DATA • Prototype Mode
          </span>
        </div>
      </div>
    </aside>
  );
};
