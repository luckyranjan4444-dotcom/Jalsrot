import React, { useState } from 'react';
import {
  InterventionSiteData,
  SpringData,
  ActiveTab
} from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Camera,
  MapPin,
  Crosshair,
  Gauge,
  Upload,
  ArrowRight,
  FileCheck,
  Smartphone,
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface FieldValidationViewProps {
  interventionSites: InterventionSiteData[];
  springs: SpringData[];
  selectedSiteId?: string;
  onUpdateSiteStatus: (siteId: string, status: InterventionSiteData['status'], notes?: string, discharge?: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const FieldValidationView: React.FC<FieldValidationViewProps> = ({
  interventionSites,
  springs,
  selectedSiteId,
  onUpdateSiteStatus,
  onNavigateTab,
}) => {
  // Default to INT-07 as requested
  const defaultSite = interventionSites.find(s => s.id === 'int-07') || interventionSites[0];
  const [activeSite, setActiveSite] = useState<InterventionSiteData>(defaultSite);

  // Form State
  const [capturedGps, setCapturedGps] = useState<{ lat: number; lng: number; accuracyM: number } | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [observationText, setObservationText] = useState(
    'Quartzite jointing visible on surface. Slope measured at 11°. Good loose gravel overburden, suitable for manual contour bunding without blasting.'
  );
  const [dischargeInput, setDischargeInput] = useState<string>('3.9');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [feedbackLogged, setFeedbackLogged] = useState(false);
  const [mobileSimulatorMode, setMobileSimulatorMode] = useState(false);

  // Capture GPS
  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    setTimeout(() => {
      setCapturedGps({
        lat: Number((activeSite.lat + 0.00015).toFixed(6)),
        lng: Number((activeSite.lng - 0.00012).toFixed(6)),
        accuracyM: 3.2,
      });
      setIsCapturingGps(false);
    }, 600);
  };

  // Verify Location
  const handleVerifyLocation = () => {
    setLocationVerified(true);
  };

  // Add observation shortcut
  const handleAppendObservation = (tag: string) => {
    setObservationText(prev => prev ? `${prev} | ${tag}` : tag);
  };

  // Upload photo simulation
  const handleUploadPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80'
    ];
    const nextPhoto = samplePhotos[uploadedPhotos.length % samplePhotos.length];
    setUploadedPhotos([...uploadedPhotos, nextPhoto]);
  };

  // Submit Verification
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setFeedbackLogged(true);
      onUpdateSiteStatus(activeSite.id, 'Verified Valid', observationText, Number(dischargeInput) || undefined);
    }, 700);
  };

  return (
    <div className="space-y-4 pb-12 max-w-5xl mx-auto">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-orange-50 text-orange-700">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Field Validation
            </h3>
            <span className="text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded">
              Ground-Truthing Module
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mobile-optimized data collection interface for barefoot hydrologists, field engineers &amp; block animators
          </p>
        </div>

        {/* View Mode Toggle (Desktop vs Mobile Preview) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSimulatorMode(!mobileSimulatorMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              mobileSimulatorMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{mobileSimulatorMode ? 'Field Mobile Frame' : 'Standard View'}</span>
          </button>
        </div>
      </div>

      {/* PROCESS STEP BAR (As requested in prompt: AI Prediction → Field Verification → Actual Observation → Model Feedback) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center justify-between">
          <span>Continuous Learning Protocol</span>
          <span className="text-[10px] text-emerald-700 font-medium">Auto-calibrating springshed weights</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 relative">
          {/* Step 1 */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 w-full">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
              ✓
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 1</div>
              <div className="text-xs font-bold text-slate-900">AI Prediction</div>
              <div className="text-[10px] text-slate-500">GIS lineaments &amp; slope model</div>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300 font-bold">→</div>

          {/* Step 2 */}
          <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-2.5 flex items-center gap-2.5 w-full">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
              2
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-600 uppercase">Step 2 (Active)</div>
              <div className="text-xs font-bold text-orange-950">Field Verification</div>
              <div className="text-[10px] text-orange-700">GPS &amp; physical ground check</div>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300 font-bold">→</div>

          {/* Step 3 */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 w-full">
            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold shrink-0">
              3
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 3</div>
              <div className="text-xs font-bold text-slate-900">Actual Observation</div>
              <div className="text-[10px] text-slate-500">Discharge, rock joints, soil</div>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300 font-bold">→</div>

          {/* Step 4 */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 w-full">
            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
              4
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 4</div>
              <div className="text-xs font-bold text-slate-900">Model Feedback</div>
              <div className="text-[10px] text-slate-500">Bayesian accuracy update</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Validation Form Card (Styled to look mobile-friendly) */}
      <div className={`transition-all ${mobileSimulatorMode ? 'max-w-md mx-auto border-4 border-slate-800 rounded-3xl p-3 bg-slate-100 shadow-2xl' : ''}`}>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
          {/* Site Selector Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Location</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeSite.code}</h2>
              <p className="text-xs text-slate-500">{activeSite.name}</p>
            </div>

            {/* Status: 🟠 Pending Verification */}
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Status:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs ${
                  activeSite.status === 'Verified Valid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-orange-100 text-orange-800 border border-orange-300'
                }`}
              >
                <span>{activeSite.status === 'Verified Valid' ? '🟢' : '🟠'}</span>
                <span>{activeSite.status}</span>
              </span>
            </div>
          </div>

          {/* Quick Site Switcher */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {interventionSites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  setActiveSite(site);
                  setSubmissionSuccess(false);
                  setLocationVerified(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border shrink-0 transition-colors ${
                  activeSite.id === site.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {site.code} ({site.status === 'Verified Valid' ? '✓' : 'Pending'})
              </button>
            ))}
          </div>

          {/* Site Info Pill */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Recommended</span>
              <span className="font-bold text-slate-800">{activeSite.recommendedIntervention}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Target Priority</span>
              <span className="font-bold text-emerald-700">{activeSite.priority}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Recharge Zone</span>
              <span className="font-bold text-slate-800">{activeSite.zoneCode}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Target Slope</span>
              <span className="font-bold text-slate-800">{activeSite.slopeDeg}° (DEM)</span>
            </div>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. GPS & Location Verification Buttons */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-sky-600" />
                  <span>Ground Positioning</span>
                </span>
                {capturedGps && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Accuracy: ±{capturedGps.accuracyM}m (RTK Lock)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Button: Capture GPS */}
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isCapturingGps}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>{isCapturingGps ? 'Locking Satellites...' : capturedGps ? 'Recapture GPS' : 'Capture GPS'}</span>
                </button>

                {/* Button: Verify Location */}
                <button
                  type="button"
                  onClick={handleVerifyLocation}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    locationVerified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${locationVerified ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{locationVerified ? 'Location Verified (Delta 12m)' : 'Verify Location'}</span>
                </button>
              </div>

              {capturedGps && (
                <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 flex justify-between">
                  <span>Lat: {capturedGps.lat}° N</span>
                  <span>Lng: {capturedGps.lng}° E</span>
                  <span className="text-emerald-700 font-semibold">Matched to Ridge</span>
                </div>
              )}
            </div>

            {/* 2. Enter Discharge & Hydraulic Flow */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enter Discharge (Measured at nearby Spring)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Bucket &amp; Stopwatch Method</span>
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={dischargeInput}
                  onChange={(e) => setDischargeInput(e.target.value)}
                  placeholder="e.g. 3.8"
                  className="w-40 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-600">Liters / minute</span>
              </div>
            </div>

            {/* 3. Add Observation & Soil / Rock Notes */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Add Observation
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleAppendObservation('Fractured bed rock present')}
                    className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-100 text-slate-600"
                  >
                    + Fractured Rock
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendObservation('No erosion signs')}
                    className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-100 text-slate-600"
                  >
                    + Stable Soil
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Enter field lithology, topsoil thickness, joint spacing, tree root density..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 4. Upload Photo */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span>Upload Photo &amp; Site Geotag</span>
                </span>
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  className="text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {uploadedPhotos.map((url, i) => (
                  <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 shadow-2xs">
                    <img src={url} alt={`Site geotag ${i}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[8px] text-center font-mono py-0.5">
                      Geotagged #{i+1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Banner */}
            {submissionSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ground Verification Submitted &amp; Recorded!</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Site <strong>{activeSite.code}</strong> updated to <strong>Verified Valid</strong>. Observation and GPS coords pushed to watershed hydrological repository.
                </p>
                {feedbackLogged && (
                  <div className="text-[10px] text-purple-700 font-semibold pt-1 border-t border-emerald-200/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Model Feedback Loop Triggered: Prior weights reinforced for 11° slope contouring.</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Verification Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Verification...' : 'Submit Verification'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
