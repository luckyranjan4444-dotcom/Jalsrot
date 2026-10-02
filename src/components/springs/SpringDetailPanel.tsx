import React from 'react';
import { SpringData } from '../../types';
import {
  X,
  Droplet,
  Mountain,
  Gauge,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MapPin,
  ClipboardCheck
} from 'lucide-react';

interface SpringDetailPanelProps {
  spring: SpringData;
  onClose: () => void;
  onViewRechargeZone: (zoneId: string) => void;
  onPlanIntervention?: (spring: SpringData) => void;
  onStartValidation?: (spring: SpringData) => void;
}

export const SpringDetailPanel: React.FC<SpringDetailPanelProps> = ({
  spring,
  onClose,
  onViewRechargeZone,
  onPlanIntervention,
  onStartValidation,
}) => {
  const isS104 = spring.id === 's-104' || spring.code.includes('S-104');

  return (
    <div className={`border rounded-xl shadow-md p-4 text-slate-800 flex flex-col max-h-[85vh] overflow-y-auto transition-all ${
      isS104
        ? 'bg-gradient-to-b from-sky-50/90 via-white to-emerald-50/50 border-sky-300 shadow-sky-100'
        : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${isS104 ? 'bg-sky-500 text-white shadow-xs' : 'bg-sky-50 text-sky-700'}`}>
              <Droplet className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">{spring.code}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              spring.seasonality === 'Perennial'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              {spring.seasonality}
            </span>
            {isS104 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                Demo Focus
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">{spring.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spring S-104 Colored Area Banner */}
      {isS104 && (
        <div className="my-2.5 p-2.5 rounded-lg bg-sky-100/70 border border-sky-300 text-xs text-sky-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="font-bold text-[11px]">S-104 Springshed Basin (2.4 km²)</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-sky-300 text-sky-800 font-bold">
            Gunjigaon Micro-Basin
          </span>
        </div>
      )}

      {/* Basic Metrics Grid with Soft Pastel Tints */}
      <div className="grid grid-cols-2 gap-2 my-2.5">
        {/* Village */}
        <div className="bg-amber-50/80 rounded-lg p-2.5 border border-amber-200/80">
          <span className="text-[10px] uppercase font-bold text-amber-700 block mb-0.5">Village</span>
          <span className="text-xs font-bold text-amber-950">{spring.village}</span>
          <span className="text-[10px] text-amber-700 block truncate">{spring.panchayat}</span>
        </div>

        {/* Elevation */}
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Elevation</span>
          <span className="text-xs font-bold text-slate-900">{spring.elevationM.toLocaleString()} m</span>
          <span className="text-[10px] text-slate-500 block">Above MSL</span>
        </div>

        {/* Discharge */}
        <div className="bg-sky-50/80 rounded-lg p-2.5 border border-sky-200/90">
          <span className="text-[10px] uppercase font-bold text-sky-700 block mb-0.5">Discharge</span>
          <span className="text-xs font-bold text-sky-900 font-mono">{spring.dischargeLpm} L/min</span>
          <span className="text-[10px] text-sky-700 block">Measured flow</span>
        </div>

        {/* Springshed Area - Highlighted in soft emerald */}
        <div className="bg-emerald-50/90 rounded-lg p-2.5 border border-emerald-300 ring-1 ring-emerald-400/20">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">Springshed Area</span>
          <span className="text-xs font-bold text-emerald-950 font-mono">{spring.springshedAreaKm2} km²</span>
          <span className="text-[10px] text-emerald-700 block font-medium">Delineated Catchment</span>
        </div>
      </div>

      {/* Recharge Assessment Card */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 my-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
            Recharge Assessment
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
            Suitability: {spring.rechargeSuitability}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600 font-medium">Confidence:</span>
            <span className="font-bold text-emerald-900 font-mono">{spring.confidenceScore}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${spring.confidenceScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60">
          <span>Data Quality: <strong className="text-emerald-800">🟢 {spring.dataQuality}</strong></span>
          <span className="text-[10px] text-slate-500">Beneficiaries: {spring.beneficiaryHouseholds} HH</span>
        </div>
      </div>

      {/* Why this area? (Explainable AI / GIS) */}
      <div className="my-2.5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Why this area?</span>
        </h4>

        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
            <span className="text-slate-600">Rainfall</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              {spring.factors.rainfall}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
            <span className="text-slate-600">Slope</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              {spring.factors.slope}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
            <span className="text-slate-600">Geology</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              {spring.factors.geology}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
            <span className="text-slate-600">Drainage</span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
              {spring.factors.drainage}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-600">Land Cover</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              {spring.factors.landCover}
            </span>
          </div>
        </div>
      </div>

      {/* Probable Disclaimer */}
      <div className="text-[10px] text-slate-500 bg-amber-50/70 border border-amber-200/80 rounded p-2 mb-3">
        ⚠️ <strong>Note:</strong> Recharge areas are <em>probable</em> &amp; <em>estimated</em> based on DEM, lineament, and multi-criteria GIS analysis. Requires ground hydrogeological field verification.
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mt-auto pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewRechargeZone(spring.associatedRechargeZoneId)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View Recharge Zone</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>

        {onPlanIntervention && (
          <button
            onClick={() => onPlanIntervention(spring)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Plan Interventions for this Springshed</span>
          </button>
        )}
      </div>
    </div>
  );
};
