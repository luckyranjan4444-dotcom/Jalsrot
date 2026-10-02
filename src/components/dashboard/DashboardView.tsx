import React, { useState } from 'react';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  ActiveTab
} from '../../types';
import { GisMap } from '../map/GisMap';
import { SpringDetailPanel } from '../springs/SpringDetailPanel';
import {
  Droplets,
  Layers,
  MapPin,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectRechargeZoneById: (zoneId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onNavigateTab,
  onSelectRechargeZoneById,
}) => {
  const [selectedSpring, setSelectedSpring] = useState<SpringData | null>(springs[0]); // default S-104
  const [selectedZone, setSelectedZone] = useState<RechargeZoneData | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionSiteData | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskZoneData | null>(null);

  // Summary Metrics
  const totalSpringsCount = 128;
  const rechargeZonesCount = 42;
  const prioritySitesCount = 18;
  const pendingVerificationCount = 9;
  const highRiskSitesCount = 6;

  const handleSelectSpring = (spring: SpringData) => {
    setSelectedSpring(spring);
    setSelectedZone(null);
    setSelectedIntervention(null);
    setSelectedRisk(null);
  };

  const handleSelectZone = (zone: RechargeZoneData) => {
    setSelectedZone(zone);
    setSelectedSpring(null);
    setSelectedIntervention(null);
    setSelectedRisk(null);
  };

  const handleSelectIntervention = (site: InterventionSiteData) => {
    setSelectedIntervention(site);
    setSelectedSpring(null);
    setSelectedZone(null);
    setSelectedRisk(null);
  };

  const handleSelectRisk = (risk: RiskZoneData) => {
    setSelectedRisk(risk);
    setSelectedSpring(null);
    setSelectedZone(null);
    setSelectedIntervention(null);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 5 Compact Summary Cards with Light Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Springs - Light Sky Blue */}
        <div
          onClick={() => onNavigateTab('springs')}
          className="bg-sky-50/80 rounded-xl p-3.5 border border-sky-200/90 shadow-2xs hover:bg-sky-100/70 hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">Total Springs</span>
            <div className="p-1.5 rounded-lg bg-sky-200/70 text-sky-800 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-950 font-mono">{totalSpringsCount}</span>
            <span className="text-[10px] text-sky-700 font-medium">Mapped</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-sky-700 font-semibold">
            <span>Explore Springshed →</span>
          </div>
        </div>

        {/* Recharge Zones - Light Emerald Green */}
        <div
          onClick={() => onNavigateTab('recharge')}
          className="bg-emerald-50/80 rounded-xl p-3.5 border border-emerald-200/90 shadow-2xs hover:bg-emerald-100/70 hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Recharge Zones</span>
            <div className="p-1.5 rounded-lg bg-emerald-200/70 text-emerald-800 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-950 font-mono">{rechargeZonesCount}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Probable</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-700 font-semibold">
            <span>Zone Analysis →</span>
          </div>
        </div>

        {/* Priority Sites - Light Royal Blue */}
        <div
          onClick={() => onNavigateTab('interventions')}
          className="bg-blue-50/80 rounded-xl p-3.5 border border-blue-200/90 shadow-2xs hover:bg-blue-100/70 hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Priority Sites</span>
            <div className="p-1.5 rounded-lg bg-blue-200/70 text-blue-800 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-950 font-mono">{prioritySitesCount}</span>
            <span className="text-[10px] text-blue-700 font-medium">Actionable</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-blue-700 font-semibold">
            <span>Intervention Plan →</span>
          </div>
        </div>

        {/* Pending Verification - Light Amber / Orange */}
        <div
          onClick={() => onNavigateTab('validation')}
          className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/90 shadow-2xs hover:bg-amber-100/70 hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">Pending Verification</span>
            <div className="p-1.5 rounded-lg bg-amber-200/70 text-amber-800 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900 font-mono">{pendingVerificationCount}</span>
            <span className="text-[10px] text-amber-700 font-medium">Field Queue</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-amber-800 font-semibold">
            <span>Ground Truthing →</span>
          </div>
        </div>

        {/* High-Risk Sites - Light Rose / Red */}
        <div
          onClick={() => onNavigateTab('risk')}
          className="bg-rose-50/80 rounded-xl p-3.5 border border-rose-200/90 shadow-2xs hover:bg-rose-100/70 hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">High-Risk Sites</span>
            <div className="p-1.5 rounded-lg bg-rose-200/70 text-rose-800 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-950 font-mono">{highRiskSitesCount}</span>
            <span className="text-[10px] text-rose-700 font-medium">Screened</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-rose-700 font-semibold">
            <span>View Risk Zones →</span>
          </div>
        </div>
      </div>

      {/* Main Section: Interactive GIS Map & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Map (8 cols on large screens) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="text-sm font-bold text-slate-800">
                Springshed GIS Decision Map
              </h3>
              <span className="text-xs text-slate-500 hidden sm:inline">
                (Kashipur Tribal Watershed Block)
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Click any spring marker or zone for AI factors
              </span>
            </div>
          </div>

          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={interventionSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            selectedSpring={selectedSpring}
            selectedZone={selectedZone}
            selectedIntervention={selectedIntervention}
            selectedRisk={selectedRisk}
            onSelectSpring={handleSelectSpring}
            onSelectRechargeZone={handleSelectZone}
            onSelectIntervention={handleSelectIntervention}
            onSelectRisk={handleSelectRisk}
            heightClass="h-[520px]"
          />

          {/* Quick Map Tips */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="text-sky-600">💧 Blue:</span> Springs • 
              <span className="text-emerald-700">🟢 Green:</span> Probable Recharge • 
              <span className="text-emerald-600">📍 Pin:</span> Recommended Interventions • 
              <span className="text-red-600">⚠️ Red:</span> Risk Zones
            </span>
            <span className="text-slate-400">Projection: WGS84 • EPSG:4326</span>
          </div>
        </div>

        {/* Side Panel (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Spring Details Panel */}
          {selectedSpring && (
            <SpringDetailPanel
              spring={selectedSpring}
              onClose={() => setSelectedSpring(null)}
              onViewRechargeZone={(zoneId) => {
                onSelectRechargeZoneById(zoneId);
                onNavigateTab('recharge');
              }}
              onPlanIntervention={() => onNavigateTab('interventions')}
            />
          )}

          {/* Zone Details Panel if selected */}
          {selectedZone && !selectedSpring && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Recharge Zone Selected
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{selectedZone.code}</h4>
                  <p className="text-xs text-slate-500">{selectedZone.name}</p>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Suitability: <strong className="text-emerald-700">{selectedZone.suitability}</strong></span>
                <span>Confidence: <strong className="font-mono">{selectedZone.confidenceScore}%</strong></span>
                <span>Area: <strong>{selectedZone.areaHectares} ha</strong></span>
              </div>

              <div className="text-xs text-slate-700">
                <span className="font-semibold block mb-1">Geological Substrate:</span>
                <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
                  {selectedZone.rockFormation} (Soil Depth: ~{selectedZone.soilDepthCm} cm)
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('recharge')}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Recharge Zone Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Intervention Details Panel if selected */}
          {selectedIntervention && !selectedSpring && !selectedZone && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wide bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Intervention Site Selected
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{selectedIntervention.code}</h4>
                  <p className="text-xs text-slate-500">{selectedIntervention.name}</p>
                </div>
                <button
                  onClick={() => setSelectedIntervention(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-200 text-xs">
                <div className="text-[11px] text-emerald-800 font-semibold">Recommended Structure</div>
                <div className="text-sm font-bold text-emerald-950 mt-0.5">
                  {selectedIntervention.recommendedIntervention}
                </div>
                <div className="text-[10px] text-slate-600 mt-1">
                  Est. Storage: ~{selectedIntervention.estimatedStorageM3.toLocaleString()} m³/yr
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('interventions')}
                className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open in Intervention Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Risk Zone Panel if selected */}
          {selectedRisk && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start pb-2 border-b border-red-100">
                <div>
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    ⚠️ Risk Warning
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{selectedRisk.code}</h4>
                  <p className="text-xs text-slate-600">{selectedRisk.name}</p>
                </div>
                <button
                  onClick={() => setSelectedRisk(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="bg-red-50/70 border border-red-200 rounded-lg p-2.5 text-xs text-red-900 font-medium">
                {selectedRisk.warningNote}
              </div>

              <button
                onClick={() => onNavigateTab('risk')}
                className="w-full py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Risk Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Springshed Overview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5 flex items-center justify-between">
              <span>Springshed Health Status</span>
              <span className="text-[10px] font-normal text-slate-500">Kashipur Block</span>
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Perennial Springs</span>
                <span className="font-semibold text-emerald-700">42 (32.8%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Seasonal / Drying Springs</span>
                <span className="font-semibold text-amber-700">86 (67.2%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Dependent Tribal HHs</span>
                <span className="font-semibold text-slate-800">4,820 families</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Average Monsoon Rainfall</span>
                <span className="font-semibold text-slate-800">1,340 mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEY USP SECTION: "From Data to Action" */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Core Framework
            </span>
            <h3 className="text-base font-bold text-slate-900">
              From Data to Action
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Three sequential questions that guide every spring revival decision in JalSrot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hydrogeological Sourcing
              </h4>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Where could the spring be recharged from?
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Result Output:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                <span>→ Probable Recharge Zone</span>
              </span>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Engineering Feasibility
              </h4>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Where should intervention be considered?
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Result Output:</span>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded border border-sky-200 flex items-center gap-1">
                <span>→ Priority Site + Suitability</span>
              </span>
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ground Reality & Safety
              </h4>
              <p className="text-sm font-bold text-slate-800 mt-1">
                Can the site actually be used?
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Result Output:</span>
              <span className="font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                <span>→ Risk Assessment + Field Verification</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD WORKFLOW SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                End-to-End Decision Workflow
              </h3>
              <p className="text-xs text-slate-500">
                From multi-source GIS &amp; hydrological ingestion to ground verification and continuous learning
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ISO-aligned Hydrogeological Protocol
            </span>
          </div>
        </div>

        {/* Workflow Steps Horizontal Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold mb-1.5">
              1
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">DATA INPUT</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Rainfall + DEM + Geology + Spring Data + Land Use
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold mb-1.5">
              2
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">AI + GIS ANALYSIS</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Spatial multi-criteria weighting &amp; lineament scoring
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold mb-1.5">
              3
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">PROBABLE RECHARGE ZONE</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Delineated recharge polygons
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold mb-1.5">
              4
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">SUITABILITY & CONFIDENCE</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Score 0-100% with factor breakdown
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold mb-1.5">
              5
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">RISK ASSESSMENT</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Landslide, slope &amp; structural safety check
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold mb-1.5">
              6
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">INTERVENTION PLANNING</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Site selection &amp; structure sizing
            </div>
          </div>

          {/* Step 7 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-bold mb-1.5">
              7
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">FIELD VALIDATION</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Ground-truthing with mobile GPS &amp; discharge
            </div>
          </div>

          {/* Step 8 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold mb-1.5">
              8
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-tight">MODEL FEEDBACK</div>
            <div className="text-[9px] text-slate-500 mt-1 leading-tight">
              Iterative weight update based on ground observations
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Framing Notice */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Hydrogeological Precautionary Principle:</span> The JalSrot system delineates <em>probable</em> and <em>estimated</em> surface recharge areas through remote multi-layer spatial modeling. Subsurface fissure networks in fractured hard rocks (Khondalite, Charnockite, Basalt) exhibit complex anisotropy. Every intervention site must undergo physical field verification and geological screening prior to work sanction.
        </div>
      </div>
    </div>
  );
};
