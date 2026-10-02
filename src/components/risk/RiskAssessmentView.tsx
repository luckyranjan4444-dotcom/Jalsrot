import React, { useState } from 'react';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  RiskLevel,
  ActiveTab
} from '../../types';
import { GisMap } from '../map/GisMap';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Info,
  Sliders,
  Mountain,
  Compass,
  FileWarning,
  ArrowRight
} from 'lucide-react';

interface RiskAssessmentViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const RiskAssessmentView: React.FC<RiskAssessmentViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onNavigateTab,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskZoneData>(riskZones[0]);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  // Interactive Risk Screening Simulator State
  const [simSlope, setSimSlope] = useState<number>(28);
  const [simLithology, setSimLithology] = useState<'Fractured' | 'Weathered Regolith' | 'Steep Colluvium' | 'Massive'>('Steep Colluvium');
  const [simRainfallIntensity, setSimRainfallIntensity] = useState<'Normal' | 'Intense (>120mm/day)'>('Intense (>120mm/day)');

  const calculateSimulatedRisk = () => {
    let score = 0;
    if (simSlope > 30) score += 40;
    else if (simSlope > 18) score += 20;

    if (simLithology === 'Steep Colluvium') score += 35;
    else if (simLithology === 'Fractured') score += 15;

    if (simRainfallIntensity === 'Intense (>120mm/day)') score += 25;

    if (score >= 60) return { level: 'HIGH' as RiskLevel, color: 'text-red-700 bg-red-50 border-red-200', desc: 'Critical Landslide & Structural Scour Hazard. No heavy water impoundment permitted.' };
    if (score >= 35) return { level: 'MODERATE' as RiskLevel, color: 'text-yellow-800 bg-yellow-50 border-yellow-200', desc: 'Moderate slope stability risk. Requires stepped check dams and drainage relief.' };
    return { level: 'LOW' as RiskLevel, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Safe for contour trenching and recharge pits.' };
  };

  const simResult = calculateSimulatedRisk();

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-50 text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Risk Assessment &amp; Geotechnical Screening
            </h3>
            <span className="text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded">
              Hazard Guardrail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Screening recharge proposals against slope instability, flash floods, fault diversions, and data uncertainty
          </p>
        </div>

        {/* Risk Level Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
            <span>🟢</span> Low Risk
          </span>
          <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 font-semibold flex items-center gap-1">
            <span>🟡</span> Moderate Risk
          </span>
          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 font-semibold flex items-center gap-1">
            <span>🔴</span> High Risk
          </span>
        </div>
      </div>

      {/* Prominent Core Warning Callout (As specified in prompt) */}
      <div className="bg-amber-50 border-l-4 border-amber-600 rounded-r-xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>⚠️ Critical Safety Screening Rule</span>
            </h4>
            <p className="text-sm font-bold text-amber-950">
              “High recharge suitability but elevated landslide risk — Field verification is required before selecting an intervention.”
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              This core guardrail ensures the JalSrot AI does not recommend or approve a structure purely because of an attractive recharge score. If the terrain is landslide-susceptible or geologically fault-divergent, safety overrides suitability.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Risk Map & Risk Zone Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-800">
              Hazard &amp; Constraint GIS Overlays ({riskZones.length} Identified Sectors)
            </span>
            <span className="text-[11px] text-red-600 font-medium">
              Red hatched zones indicate active constraints
            </span>
          </div>

          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={interventionSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            selectedRisk={selectedRisk}
            onSelectRisk={(r) => setSelectedRisk(r)}
            heightClass="h-[520px]"
            activeLayerConfig={{
              springs: true,
              rechargeZones: true,
              drainage: true,
              faults: true,
              interventionSites: true,
              riskZones: true,
            }}
          />

          {/* Quick Risk Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {riskZones.map((risk) => {
              const isSelected = selectedRisk.id === risk.id;
              return (
                <button
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-800 text-white border-red-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{risk.riskLevel === 'HIGH' ? '🔴' : '🟡'}</span>
                  <span>{risk.code}</span>
                  <span className="text-[10px] opacity-80 font-normal">({risk.primaryRisk})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risk Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3.5">
            {/* Header */}
            <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Risk Zone Record
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedRisk.code}</h3>
                <p className="text-xs text-slate-500">{selectedRisk.name}</p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                  selectedRisk.riskLevel === 'HIGH' ? 'bg-red-600' : 'bg-yellow-600'
                }`}
              >
                {selectedRisk.riskLevel} RISK
              </span>
            </div>

            {/* Analyzed Factor */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Primary Hazard Evaluated:
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {selectedRisk.primaryRisk}
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedRisk.description}
              </p>
            </div>

            {/* Suitability vs Risk Comparison */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Recharge Score</span>
                <span className="text-sm font-bold text-emerald-950">
                  {selectedRisk.rechargeSuitability} Suitability
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-800 font-semibold uppercase block">Geotechnical Risk</span>
                <span className="text-sm font-bold text-red-950">
                  {selectedRisk.riskLevel} Risk Alert
                </span>
              </div>
            </div>

            {/* Warning Callout Box */}
            <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg text-xs space-y-1">
              <div className="font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Automated Hazard Advisory:</span>
              </div>
              <p className="text-red-800 text-[11px] leading-relaxed italic">
                “{selectedRisk.warningNote}”
              </p>
            </div>

            {/* Mandatory Mitigation */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1">
                Mandatory Pre-Sanction Mitigation:
              </span>
              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedRisk.mitigationRequirement}
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('validation')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Schedule Engineering Site Inspection</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>

          {/* Interactive Risk Screening Calculator */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Interactive Site Risk Calculator</span>
              <span className="text-[10px] text-slate-400 font-normal">Pre-screening utility</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Slope Angle:</span>
                  <span className="font-bold text-slate-800">{simSlope}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={simSlope}
                  onChange={(e) => setSimSlope(Number(e.target.value))}
                  className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <span className="text-slate-600 block mb-1">Lithology / Overburden:</span>
                <select
                  value={simLithology}
                  onChange={(e) => setSimLithology(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs text-slate-700"
                >
                  <option value="Massive">Massive Unfractured Bedrock</option>
                  <option value="Fractured">Jointed &amp; Fractured Rock</option>
                  <option value="Weathered Regolith">Weathered Loamy Regolith</option>
                  <option value="Steep Colluvium">Steep Loose Colluvium / Talus</option>
                </select>
              </div>

              <div>
                <span className="text-slate-600 block mb-1">Rainfall Regime:</span>
                <select
                  value={simRainfallIntensity}
                  onChange={(e) => setSimRainfallIntensity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs text-slate-700"
                >
                  <option value="Normal">Normal Seasonal Distribution</option>
                  <option value="Intense (>120mm/day)">Extreme High Intensity Precipitation</option>
                </select>
              </div>

              <div className={`p-2.5 rounded-lg border mt-2 ${simResult.color}`}>
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>Calculated Risk:</span>
                  <span>{simResult.level} RISK</span>
                </div>
                <p className="text-[11px] mt-1 leading-tight">{simResult.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
