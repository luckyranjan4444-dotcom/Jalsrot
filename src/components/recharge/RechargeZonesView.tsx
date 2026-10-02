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
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  MapPin,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface RechargeZonesViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  selectedZoneId?: string;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectInterventionSite?: (site: InterventionSiteData) => void;
}

export const RechargeZonesView: React.FC<RechargeZonesViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  selectedZoneId,
  onNavigateTab,
}) => {
  // Default to selectedZoneId or Zone RZ-21
  const initialZone = rechargeZones.find(z => z.id === selectedZoneId) || rechargeZones[0];
  const [selectedZone, setSelectedZone] = useState<RechargeZoneData>(initialZone);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner / Guidance */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-700">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Recharge Zone Analysis
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              AHP &amp; RF Machine Learning Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Delineation of potential infiltration and intake beds feeding mountain springshed aquifers
          </p>
        </div>

        {/* Scientific Disclaimer Warning Badge */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px] leading-tight">
            <strong>Standard Protocol:</strong> Predicted recharge boundaries are <em>probable &amp; estimated</em>. Hydrogeological ground-truthing is required prior to civil construction.
          </span>
        </div>
      </div>

      {/* Main Grid: Large GIS Map (8 cols) & Zone Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Large GIS Map */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-800">
              Interactive Recharge Polygons (Showing {rechargeZones.length} Zones)
            </span>
            <span className="text-[11px] text-slate-500">
              Click any colored polygon to inspect multi-criteria factors
            </span>
          </div>

          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={interventionSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            selectedZone={selectedZone}
            onSelectRechargeZone={(zone) => setSelectedZone(zone)}
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

          {/* Zone Quick Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {rechargeZones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      zone.suitability === 'HIGH' ? 'bg-emerald-400' :
                      zone.suitability === 'MODERATE' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                  />
                  <span>{zone.code}</span>
                  <span className="text-[10px] opacity-80 font-normal">({zone.suitability})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Inspector (Matching Prompt Exactly) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
            {/* Zone Title & Badge */}
            <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Selected Recharge Zone
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedZone.code}</h3>
                <p className="text-xs text-slate-500">{selectedZone.name}</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold">
                {selectedZone.areaHectares} ha
              </span>
            </div>

            {/* Recharge Suitability: 🟢 HIGH */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Recharge Suitability:
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-white shadow-2xs ${
                    selectedZone.suitability === 'HIGH'
                      ? 'bg-emerald-600'
                      : selectedZone.suitability === 'MODERATE'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                >
                  <span>{selectedZone.suitability === 'HIGH' ? '🟢' : selectedZone.suitability === 'MODERATE' ? '🟡' : '🔴'}</span>
                  <span>{selectedZone.suitability}</span>
                </span>
              </div>

              {/* Confidence: 84% */}
              <div className="mt-3">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-medium">Confidence:</span>
                  <span className="text-base font-bold text-emerald-900 font-mono">
                    {selectedZone.confidenceScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedZone.confidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <span>Data Quality: <strong>🟢 {selectedZone.dataQuality}</strong></span>
                <span>Verification: <strong>{selectedZone.verified ? 'Verified' : 'Pending Verification'}</strong></span>
              </div>
            </div>

            {/* Factors breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Multi-Criteria Spatial Factors
              </h4>
              <div className="space-y-1.5 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">• Rainfall:</span>
                  <span className="font-semibold text-emerald-800">{selectedZone.factors.rainfall}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">• Slope:</span>
                  <span className="font-semibold text-emerald-800">{selectedZone.factors.slope}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">• Geology:</span>
                  <span className="font-semibold text-emerald-800">{selectedZone.factors.geology}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">• Drainage:</span>
                  <span className="font-semibold text-emerald-800">{selectedZone.factors.drainage}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-600">• Land Cover:</span>
                  <span className="font-semibold text-emerald-800">{selectedZone.factors.landCover}</span>
                </div>
              </div>
            </div>

            {/* Why is this area suitable? Section */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>Why is this area suitable?</span>
              </h4>
              <p className="text-xs text-emerald-900 italic font-medium leading-relaxed">
                “{selectedZone.explanation}”
              </p>
              
              <div className="mt-2.5 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                <span className="font-semibold">Lithology: </span>
                <span>{selectedZone.rockFormation}</span>
              </div>
            </div>

            {/* Field Verification Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">Field verification recommended</span>
              </div>
              <button
                onClick={() => onNavigateTab('validation')}
                className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold rounded shadow-2xs"
              >
                Verify in Field
              </button>
            </div>

            {/* Action Button: Plan Interventions */}
            <button
              onClick={() => onNavigateTab('interventions')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plan Interventions for {selectedZone.code}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
