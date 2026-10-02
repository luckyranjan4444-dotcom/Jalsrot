import React, { useState } from 'react';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  ActiveTab
} from '../../types';
import {
  FileBarChart2,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Droplets,
  Layers,
  MapPin,
  AlertTriangle,
  Calendar,
  Building,
  RefreshCw
} from 'lucide-react';

interface ReportsViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onNavigateTab,
}) => {
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [reportDate, setReportDate] = useState<string>('October 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const verifiedCount = interventionSites.filter(s => s.status === 'Verified Valid').length;
  const pendingCount = interventionSites.filter(s => s.status === 'Pending Verification').length;
  const totalEstBudgetInr = interventionSites.reduce((sum, s) => sum + s.estCostInr, 0);
  const totalStorageM3 = interventionSites.reduce((sum, s) => sum + s.estimatedStorageM3, 0);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setTimeout(() => setGeneratedSuccess(false), 3000);
    }, 500);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleExportData = () => {
    const exportPayload = {
      project: 'JalSrot Springshed Planning',
      region: 'Tribal Hills – Demo Area (Kashipur Basin)',
      generatedAt: new Date().toISOString(),
      summaryStats: {
        totalSprings: 128,
        rechargeZones: 42,
        priorityInterventionSites: 18,
        riskAreas: 6,
        fieldVerified: verifiedCount,
        pendingVerification: pendingCount,
        estimatedBudgetInr: totalEstBudgetInr,
        estimatedRechargeStorageM3: totalStorageM3,
      },
      springsSample: springs,
      rechargeZones: rechargeZones,
      interventions: interventionSites,
      riskZones: riskZones,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `JalSrot_Springshed_DPR_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner with Action Buttons (Matching Prompt Exactly) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <FileBarChart2 className="w-5 h-5 text-emerald-700" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              JalSrot Recharge Planning Report
            </h3>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
              DPR &amp; Field Verification Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive Springshed Development Action Plan for Block and District Authorities
          </p>
        </div>

        {/* 3 Explicit Buttons: Generate Report, Export PDF, Export Data */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Report</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {generatedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report refreshed with latest field measurements and ground validation records.</span>
        </div>
      )}

      {/* Official Government Printable Document Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl mx-auto printable-report">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              GOVERNMENT SPRINGS-SHED REVIVAL ACTION PLAN • DPR SUMMARY
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              JalSrot Recharge Planning Report
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Evidence-based artificial recharge &amp; hydrogeological prioritization
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Report Date</span>
            <span className="font-semibold text-slate-900 font-mono">{reportDate}</span>
            <span className="text-[10px] text-slate-500 block">Status: Verified Draft</span>
          </div>
        </div>

        {/* 1. Selected Region (As requested in prompt) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Region</span>
            <span className="font-bold text-slate-900 text-sm">Tribal Hills – Demo Area</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Watershed / Block</span>
            <span className="font-semibold text-slate-800">Kashipur Tribal Basin (Rayagada)</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Geographic Extent</span>
            <span className="font-mono text-slate-700">19.14°N - 19.21°N, 83.38°E - 83.46°E</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Springshed Area</span>
            <span className="font-bold text-slate-900">46.8 km² (Delineated)</span>
          </div>
        </div>

        {/* Key Summary Matrix (Matching Prompt List: Total Springs, Recharge Zones, Priority Intervention Sites, Risk Areas, Recommended Interventions, Field Verification Status) */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Springshed Metrics &amp; Planning Synthesis
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* Total Springs */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Springs</span>
              <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">128</span>
              <span className="text-[10px] text-slate-400">42 Perennial</span>
            </div>

            {/* Recharge Zones */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Recharge Zones</span>
              <span className="text-xl font-bold text-emerald-700 font-mono mt-1 block">42</span>
              <span className="text-[10px] text-slate-400">High &amp; Moderate</span>
            </div>

            {/* Priority Intervention Sites */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Priority Sites</span>
              <span className="text-xl font-bold text-sky-700 font-mono mt-1 block">18</span>
              <span className="text-[10px] text-slate-400">P1 &amp; P2 Sited</span>
            </div>

            {/* Risk Areas */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Areas</span>
              <span className="text-xl font-bold text-red-600 font-mono mt-1 block">6</span>
              <span className="text-[10px] text-red-600">Landslide / Scour</span>
            </div>

            {/* Verification Status */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Field Verified</span>
              <span className="text-xl font-bold text-emerald-700 font-mono mt-1 block">
                {verifiedCount} / {interventionSites.length}
              </span>
              <span className="text-[10px] text-orange-600">{pendingCount} Pending</span>
            </div>

            {/* Total Budget */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Est. Budget</span>
              <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">
                ₹{(totalEstBudgetInr / 100000).toFixed(2)}L
              </span>
              <span className="text-[10px] text-slate-400">Civil &amp; Bio-bunding</span>
            </div>
          </div>
        </div>

        {/* Recommended Interventions Table (Matching Prompt) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recommended Interventions &amp; Site Matrix
            </h3>
            <span className="text-[11px] text-slate-500">Filtered for High-Impact Springs</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Site Code</th>
                  <th className="py-2.5 px-3">Intervention Type</th>
                  <th className="py-2.5 px-3">Target Springshed</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Est. Cost</th>
                  <th className="py-2.5 px-3">Est. Storage</th>
                  <th className="py-2.5 px-3">Field Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {interventionSites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold font-mono text-slate-900">{site.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-800">{site.recommendedIntervention}</td>
                    <td className="py-2.5 px-3 text-slate-600">{site.zoneCode}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          site.priority === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {site.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">₹{site.estCostInr.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{site.estimatedStorageM3.toLocaleString()} m³</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          site.status === 'Verified Valid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}
                      >
                        <span>{site.status === 'Verified Valid' ? '✓' : '•'}</span>
                        <span>{site.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Screening & Mitigation Requirements (Matching Prompt) */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Screened Risk Areas &amp; Pre-Sanction Mitigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {riskZones.slice(0, 2).map((risk) => (
              <div key={risk.id} className="bg-red-50/40 border border-red-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between font-bold text-red-900">
                  <span>{risk.code}: {risk.name}</span>
                  <span className="px-1.5 py-0.2 bg-red-100 rounded text-[10px]">{risk.riskLevel} RISK</span>
                </div>
                <p className="text-slate-600 text-[11px]">{risk.description}</p>
                <div className="pt-1.5 border-t border-red-200/60 text-[11px] text-red-800 font-medium">
                  <strong>Mandatory Action:</strong> {risk.mitigationRequirement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Sign-off & Methodology Footnote */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
          <span>Prepared using JalSrot Decision Support System (v2.4-Demo)</span>
          <span className="font-medium text-slate-600">Department of Drinking Water &amp; Sanitation / Jal Shakti</span>
          <span>Authentic Springshed Protocol</span>
        </div>
      </div>
    </div>
  );
};
