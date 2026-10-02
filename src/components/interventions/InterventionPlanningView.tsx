import React, { useState } from 'react';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  InterventionType,
  ActiveTab
} from '../../types';
import { GisMap } from '../map/GisMap';
import {
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Droplets,
  Layers,
  Sparkles,
  ClipboardCheck,
  Check
} from 'lucide-react';

interface InterventionPlanningViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onUpdateSiteStatus: (siteId: string, newStatus: InterventionSiteData['status']) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectSiteForValidation?: (site: InterventionSiteData) => void;
}

export const InterventionPlanningView: React.FC<InterventionPlanningViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onUpdateSiteStatus,
  onNavigateTab,
  onSelectSiteForValidation,
}) => {
  // Default to INT-07
  const defaultSite = interventionSites.find(s => s.id === 'int-07') || interventionSites[0];
  const [selectedSite, setSelectedSite] = useState<InterventionSiteData>(defaultSite);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredSites = interventionSites.filter(site => {
    const matchesType = typeFilter === 'ALL' || site.recommendedIntervention === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || site.priority === priorityFilter;
    return matchesType && matchesPriority;
  });

  const handleMarkForVerification = (site: InterventionSiteData) => {
    onUpdateSiteStatus(site.id, 'Pending Verification');
    setActionNotice(`Site ${site.code} successfully marked and queued for field verification.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const interventionTypes: InterventionType[] = [
    'Contour Trench',
    'Recharge Pit',
    'Check Dam',
    'Percolation Structure',
    'Loose Boulder Structure',
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-50 text-sky-700">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Intervention Planning
            </h3>
            <span className="text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded">
              Engineering Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimal artificial recharge structures based on slope, soil depth, runoff volume and geology
          </p>
        </div>

        {/* Possible Intervention Types Pill List */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Intervention Types:</span>
          {interventionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? 'ALL' : type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                typeFilter === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
          {typeFilter !== 'ALL' && (
            <button
              onClick={() => setTypeFilter('ALL')}
              className="text-[10px] text-red-600 hover:underline px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => onNavigateTab('validation')}
            className="text-[11px] text-emerald-900 underline font-bold"
          >
            Go to Field Validation →
          </button>
        </div>
      )}

      {/* Main Grid: GIS Map & Site Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-800">
              Intervention Site Distribution ({filteredSites.length} Recommended Locations)
            </span>
            <span className="text-[11px] text-slate-500">
              Pins show P1 (High) &amp; P2 (Medium) priorities
            </span>
          </div>

          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={filteredSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            selectedIntervention={selectedSite}
            onSelectIntervention={(s) => setSelectedSite(s)}
            heightClass="h-[580px]"
            activeLayerConfig={{
              springs: true,
              rechargeZones: true,
              drainage: true,
              faults: true,
              interventionSites: true,
              riskZones: false,
            }}
          />

          {/* Quick Site Selector Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {interventionSites.map((site) => {
              const isSelected = selectedSite.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-800 text-white border-sky-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{site.code}</span>
                  <span className="text-[10px] opacity-80 font-normal">({site.recommendedIntervention})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Location Details (Matching Prompt Exactly) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Recommended Site
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedSite.code}</h3>
                <p className="text-xs text-slate-500">{selectedSite.name}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {selectedSite.zoneCode}
              </span>
            </div>

            {/* Priority: HIGH */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Priority:
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white shadow-2xs ${
                    selectedSite.priority === 'HIGH'
                      ? 'bg-emerald-600'
                      : selectedSite.priority === 'MEDIUM'
                      ? 'bg-sky-600'
                      : 'bg-slate-600'
                  }`}
                >
                  {selectedSite.priority}
                </span>
              </div>

              {/* Recommended Intervention: Contour Trench */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide font-bold block mb-1">
                  Recommended Intervention:
                </span>
                <div className="text-base font-bold text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <span>{selectedSite.recommendedIntervention}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    ₹{(selectedSite.estCostInr / 1000).toFixed(0)}k est.
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Validation Status:</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    selectedSite.status === 'Verified Valid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedSite.status === 'Pending Verification'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedSite.status}
                </span>
              </div>
            </div>

            {/* Reason: bullet points */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Reason for Selection
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200">
                {selectedSite.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Site Physical Parameters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Terrain Slope</span>
                <span className="font-bold text-slate-800">{selectedSite.slopeDeg}°</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Storage Potential</span>
                <span className="font-bold text-slate-800">{selectedSite.estimatedStorageM3.toLocaleString()} m³/yr</span>
              </div>
            </div>

            {/* Action Buttons: View Site & Mark for Field Verification */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleMarkForVerification(selectedSite)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Mark for Field Verification</span>
              </button>

              <button
                onClick={() => {
                  if (onSelectSiteForValidation) onSelectSiteForValidation(selectedSite);
                  onNavigateTab('validation');
                }}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open in Field Validation Form</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
