import React, { useState, useMemo } from 'react';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  Seasonality,
  ActiveTab
} from '../../types';
import { GisMap } from '../map/GisMap';
import { SpringDetailPanel } from './SpringDetailPanel';
import {
  Search,
  Filter,
  Droplets,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Info,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface SpringExplorerViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectRechargeZoneById: (zoneId: string) => void;
}

export const SpringExplorerView: React.FC<SpringExplorerViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onNavigateTab,
  onSelectRechargeZoneById,
}) => {
  const [selectedSpring, setSelectedSpring] = useState<SpringData | null>(springs[0]);
  const [search, setSearch] = useState('');
  const [seasonalityFilter, setSeasonalityFilter] = useState<string>('ALL');
  const [suitabilityFilter, setSuitabilityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'code' | 'discharge' | 'elevation' | 'confidence'>('code');

  const filteredSprings = useMemo(() => {
    return springs
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.village.toLowerCase().includes(search.toLowerCase());
        const matchesSeason = seasonalityFilter === 'ALL' || s.seasonality === seasonalityFilter;
        const matchesSuitability = suitabilityFilter === 'ALL' || s.rechargeSuitability === suitabilityFilter;
        return matchesSearch && matchesSeason && matchesSuitability;
      })
      .sort((a, b) => {
        if (sortBy === 'discharge') return b.dischargeLpm - a.dischargeLpm;
        if (sortBy === 'elevation') return b.elevationM - a.elevationM;
        if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
        return a.code.localeCompare(b.code);
      });
  }, [springs, search, seasonalityFilter, suitabilityFilter, sortBy]);

  return (
    <div className="space-y-4 pb-12">
      {/* Header bar with controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <span>Spring Inventory &amp; Delineation</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredSprings.length} of {springs.length} hydro-census demo records for Kashipur Watershed
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search spring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Seasonality filter */}
            <select
              value={seasonalityFilter}
              onChange={(e) => setSeasonalityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Seasonalities</option>
              <option value="Perennial">Perennial (Year-round)</option>
              <option value="Seasonal">Seasonal (Dries pre-monsoon)</option>
            </select>

            {/* Suitability filter */}
            <select
              value={suitabilityFilter}
              onChange={(e) => setSuitabilityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Suitability</option>
              <option value="HIGH">High Suitability</option>
              <option value="MODERATE">Moderate Suitability</option>
              <option value="LOW">Low Suitability</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="code">Sort by Code</option>
              <option value="discharge">Sort by Discharge</option>
              <option value="elevation">Sort by Elevation</option>
              <option value="confidence">Sort by Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Map & List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Spring List Table (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col h-[680px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-600">
            <span>Spring List ({filteredSprings.length})</span>
            <span className="text-[10px] text-slate-400">Click to focus on map</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredSprings.map((spring) => {
              const isSelected = selectedSpring?.id === spring.id;
              return (
                <div
                  key={spring.id}
                  onClick={() => setSelectedSpring(spring)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{spring.code}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            spring.seasonality === 'Perennial'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {spring.seasonality}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{spring.name}</p>
                      <p className="text-[11px] text-slate-400">{spring.village} • {spring.panchayat}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-sky-700 block">
                        {spring.dischargeLpm} L/m
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {spring.elevationM}m MSL
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Suitability: <strong className="text-emerald-700">{spring.rechargeSuitability}</strong>
                    </span>
                    <span className="text-slate-500 font-mono">
                      Conf: {spring.confidenceScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive GIS Map (5 cols) */}
        <div className="lg:col-span-5 h-[680px]">
          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={interventionSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            selectedSpring={selectedSpring}
            onSelectSpring={(s) => setSelectedSpring(s)}
            heightClass="h-full"
            activeLayerConfig={{
              springs: true,
              rechargeZones: true,
              drainage: true,
              faults: true,
              interventionSites: false,
              riskZones: false,
            }}
          />
        </div>

        {/* Right: Detailed Spring Card (3 cols) */}
        <div className="lg:col-span-3">
          {selectedSpring ? (
            <SpringDetailPanel
              spring={selectedSpring}
              onClose={() => setSelectedSpring(null)}
              onViewRechargeZone={(zoneId) => {
                onSelectRechargeZoneById(zoneId);
                onNavigateTab('recharge');
              }}
              onPlanIntervention={() => onNavigateTab('interventions')}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Select any spring from the list or map to view hydrogeological assessment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
