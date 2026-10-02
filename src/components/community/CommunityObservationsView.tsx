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
  MessageSquareQuote,
  Users,
  Calendar,
  MapPin,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Droplets,
  HelpCircle,
  Building,
  Info
} from 'lucide-react';

interface CommunityObservationsViewProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  onAddObservation: (obs: CommunityObservationData) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const CommunityObservationsView: React.FC<CommunityObservationsViewProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  onAddObservation,
  onNavigateTab,
}) => {
  const [selectedObs, setSelectedObs] = useState<CommunityObservationData>(communityObservations[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Observation Form State
  const [village, setVillage] = useState('Demo Village');
  const [observerName, setObserverName] = useState('');
  const [role, setRole] = useState<CommunityObservationData['role']>('Villager');
  const [springCondition, setSpringCondition] = useState<CommunityObservationData['springCondition']>('Drying up earlier');
  const [waterAvailabilityMonths, setWaterAvailabilityMonths] = useState(8);
  const [localObservations, setLocalObservations] = useState('');
  const [existingStructures, setExistingStructures] = useState('');
  const [problemsObserved, setProblemsObserved] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitNewObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observerName || !localObservations) return;

    const newObs: CommunityObservationData = {
      id: `comm-${Date.now()}`,
      springCode: 'Spring S-104',
      village: village,
      observerName: observerName,
      role: role,
      date: new Date().toISOString().split('T')[0],
      lat: 19.1680 + (Math.random() - 0.5) * 0.01,
      lng: 83.4110 + (Math.random() - 0.5) * 0.01,
      springCondition: springCondition,
      waterAvailabilityMonths: Number(waterAvailabilityMonths),
      localObservations: localObservations,
      existingStructures: existingStructures || 'None observed',
      problemsObserved: problemsObserved || 'None reported',
      isCommunityVerified: true,
    };

    onAddObservation(newObs);
    setSelectedObs(newObs);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowAddModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 text-amber-700">
              <MessageSquareQuote className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Community Observations
            </h3>
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              Participatory Knowledge
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Oral hydrogeological history, generational water changes, and ground realities documented by tribal villagers
          </p>
        </div>

        {/* Record Observation Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Community Observation</span>
        </button>
      </div>

      {/* Prominent Separation Notice (Strict Requirement) */}
      <div className="p-3 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Protocol Guardrail:</span> All records on this page are clearly labeled as <strong className="underline">Community Observation</strong>. <em>Do not mix community observations with AI predictions.</em> Community inputs serve as participatory ground context alongside spatial models.
        </div>
      </div>

      {/* Main Grid: GIS Map & Observation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-800">
              Community Observation Geo-Locations (Showing {communityObservations.length} Records)
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              💬 Amber pins indicate community voice
            </span>
          </div>

          <GisMap
            springs={springs}
            rechargeZones={rechargeZones}
            interventionSites={interventionSites}
            riskZones={riskZones}
            communityObservations={communityObservations}
            onSelectObservation={(obs) => setSelectedObs(obs)}
            heightClass="h-[560px]"
            activeLayerConfig={{
              springs: true,
              rechargeZones: true,
              drainage: true,
              faults: false,
              interventionSites: false,
              riskZones: false,
            }}
          />
        </div>

        {/* Selected Observation Details & Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Selected Observation Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Community Observation
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{selectedObs.village}</h4>
                <p className="text-xs text-slate-500">Recorded by: {selectedObs.observerName} ({selectedObs.role})</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {selectedObs.date}
              </span>
            </div>

            {/* Spring Condition & Availability */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Spring Condition</span>
                <span className="font-bold text-amber-900">{selectedObs.springCondition}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Water Availability</span>
                <span className="font-bold text-slate-800">{selectedObs.waterAvailabilityMonths} Months / Year</span>
              </div>
            </div>

            {/* Local Observations & Indigenous Memory */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Local Observations:
              </span>
              <p className="text-xs text-slate-800 bg-amber-50/50 p-3 rounded-lg border border-amber-200/80 leading-relaxed italic">
                “{selectedObs.localObservations}”
              </p>
            </div>

            {/* Existing Water Structures */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Existing Water Structures:
              </span>
              <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedObs.existingStructures}
              </div>
            </div>

            {/* Problems Observed */}
            <div>
              <span className="text-xs font-bold text-red-800 uppercase tracking-wide block mb-1">
                Problems Observed:
              </span>
              <div className="text-xs text-red-900 bg-red-50/60 p-2.5 rounded-lg border border-red-200">
                {selectedObs.problemsObserved}
              </div>
            </div>
          </div>

          {/* List of other observations */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              All Community Records ({communityObservations.length})
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {communityObservations.map((obs) => {
                const isSelected = selectedObs.id === obs.id;
                return (
                  <div
                    key={obs.id}
                    onClick={() => setSelectedObs(obs)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{obs.village}</span>
                      <span className="text-[10px] text-slate-400">{obs.date}</span>
                    </div>
                    <div className="text-slate-600 truncate mt-0.5">{obs.localObservations}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to record observation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Community Observation</h3>
                <p className="text-xs text-slate-500">Document local spring health from village elders &amp; field workers</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold">
                ✓ Observation successfully saved and mapped!
              </div>
            ) : (
              <form onSubmit={handleSubmitNewObservation} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Village Name</label>
                    <input
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Observer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manglu Jani"
                      value={observerName}
                      onChange={(e) => setObserverName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Role / Affiliation</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                    >
                      <option value="Villager">Villager / Tribal Elder</option>
                      <option value="Field Mobilizer">Field Mobilizer / Animator</option>
                      <option value="ASHA Worker">ASHA / Anganwadi Worker</option>
                      <option value="Panchayat Member">Panchayat Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Water Availability</label>
                    <select
                      value={waterAvailabilityMonths}
                      onChange={(e) => setWaterAvailabilityMonths(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                    >
                      <option value={12}>12 Months (Perennial)</option>
                      <option value={9}>9 Months (Dries by April)</option>
                      <option value={6}>6 Months (Dries by Feb)</option>
                      <option value={4}>4 Months (Only Monsoon)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Spring Condition</label>
                  <select
                    value={springCondition}
                    onChange={(e) => setSpringCondition(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                  >
                    <option value="Drying up earlier">Drying up earlier than before</option>
                    <option value="Steady yield">Steady yield throughout</option>
                    <option value="Muddy during monsoon">Muddy / turbid during monsoon</option>
                    <option value="Severely decreased flow">Severely decreased flow</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Local Observations / History</label>
                  <textarea
                    rows={2}
                    required
                    value={localObservations}
                    onChange={(e) => setLocalObservations(e.target.value)}
                    placeholder="Describe seasonal changes, sacred groves, tree plantations or clearing upstream..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Existing Water Structures</label>
                  <input
                    type="text"
                    value={existingStructures}
                    onChange={(e) => setExistingStructures(e.target.value)}
                    placeholder="e.g. Masonry cistern built 2018, cracked weir"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Problems Observed</label>
                  <input
                    type="text"
                    value={problemsObserved}
                    onChange={(e) => setProblemsObserved(e.target.value)}
                    placeholder="e.g. Heavy silting, water scarcity during festivals, cattle contamination"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                  >
                    Save Observation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
