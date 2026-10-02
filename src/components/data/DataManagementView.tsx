import React, { useState } from 'react';
import { ActiveTab, DataQualityRating } from '../../types';
import {
  Database,
  Upload,
  HardDrive,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Info,
  Sliders,
  Check
} from 'lucide-react';

interface DataManagementViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'datasets' | 'model' | 'upload'>('datasets');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const datasets = [
    {
      name: 'Hydrogeological Spring Census (Field GPS)',
      source: 'State Jal Jeevan Mission & District Watershed Cell',
      resolution: 'Point Shapefile (128 records)',
      lastUpdated: 'August 2024',
      quality: 'Good' as DataQualityRating,
      format: 'GeoJSON / CSV',
      status: 'Active',
    },
    {
      name: 'Digital Elevation Model (DEM) & Slope Contours',
      source: 'ISRO CartoDEM (30-meter posting)',
      resolution: '30m Gridded Raster',
      lastUpdated: 'May 2024',
      quality: 'Good' as DataQualityRating,
      format: 'GeoTIFF / Cloud-Optimized GeoTIFF',
      status: 'Active',
    },
    {
      name: 'Geological Bedrock & Lineament Fracture Network',
      source: 'Geological Survey of India (GSI 1:50,000 Quadrangle)',
      resolution: 'Vector Lineaments & Lithology Polygons',
      lastUpdated: '2023',
      quality: 'Moderate' as DataQualityRating,
      format: 'ESRI Shapefile',
      status: 'Active',
    },
    {
      name: 'High-Resolution Gridded Monsoon Rainfall',
      source: 'India Meteorological Department (IMD) 0.25° Daily Interpolated',
      resolution: '0.25° Downscaled with AWS ground stations',
      lastUpdated: 'September 2024',
      quality: 'Good' as DataQualityRating,
      format: 'NetCDF / Raster',
      status: 'Active',
    },
    {
      name: 'Land Use & Land Cover (LULC)',
      source: 'Bhuvan / NRSC Sentinel-2 10m Classification',
      resolution: '10m Multi-spectral',
      lastUpdated: 'January 2024',
      quality: 'Good' as DataQualityRating,
      format: 'Raster',
      status: 'Active',
    },
    {
      name: 'Sub-surface Soil Moisture & Infiltration Capacity',
      source: 'Soil & Land Use Survey of India (SLUSI)',
      resolution: '1:50,000 Soil Series Map',
      lastUpdated: '2021',
      quality: 'Limited' as DataQualityRating,
      format: 'Vector Polygon',
      status: 'Interpolated',
    },
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadStatus(`Validating and parsing "${file.name}" (GeoJSON format)...`);
      setTimeout(() => {
        setUploadStatus(`Successfully ingested 14 new spatial boundary points into Kashipur Hilly Basin!`);
      }, 1200);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <Database className="w-5 h-5 text-emerald-700" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Data Management &amp; Model Lineage
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              Spatial Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial metadata, accuracy ratings, DEM resolutions, and multi-criteria AHP model weighting
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'datasets' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Spatial Datasets
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'model' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Weights &amp; Lineage
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ingest Data
          </button>
        </div>
      </div>

      {/* Standard Quality Notice (As per prompt) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Prediction Confidence:</span>
              <span className="text-base font-bold text-slate-900 font-mono">82%</span>
            </div>
            <span className="h-4 w-px bg-slate-200"></span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Overall Data Quality:</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <span>🟢</span> Good
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Quality Ratings:</span>
            <span className="text-emerald-700 font-semibold">🟢 Good</span>
            <span className="text-yellow-700 font-semibold">🟡 Moderate</span>
            <span className="text-red-700 font-semibold">🔴 Limited</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 italic">
          “Confidence depends on the availability and quality of spatial and field data.”
        </p>
      </div>

      {/* Tab 1: Datasets Table */}
      {activeTab === 'datasets' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Registered Spatial Feature Layers
            </h4>
            <span className="text-[11px] text-slate-400">6 Layers Active in Geo-Server</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2 px-3">Dataset Name</th>
                  <th className="py-2 px-3">Primary Source</th>
                  <th className="py-2 px-3">Resolution / Scale</th>
                  <th className="py-2 px-3">Quality Rating</th>
                  <th className="py-2 px-3">Format</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {datasets.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{d.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{d.source}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{d.resolution}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.quality === 'Good'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : d.quality === 'Moderate'
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        <span>{d.quality === 'Good' ? '🟢' : d.quality === 'Moderate' ? '🟡' : '🔴'}</span>
                        <span>{d.quality}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{d.format}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Model Weights & Explainability */}
      {activeTab === 'model' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Hydrogeological Model Weights (AHP &amp; Random Forest)
            </h4>
            <p className="text-xs text-slate-500">
              Analytical Hierarchy Process calibrated with empirical springshed studies in Eastern Ghats &amp; Central Tribal Highlands
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Precipitation &amp; Rainfall Regime</span>
                <span className="font-bold text-slate-900 font-mono">30% Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-sky-600 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
              <span className="text-[10px] text-slate-400">Captures intake volume and precipitation frequency</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Lithology &amp; Bedrock Geology</span>
                <span className="font-bold text-slate-900 font-mono">25% Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
              <span className="text-[10px] text-slate-400">Jointed quartzite &amp; charnockite secondary porosity</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Slope Steepness &amp; Geomorphology</span>
                <span className="font-bold text-slate-900 font-mono">20% Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-700 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
              <span className="text-[10px] text-slate-400">Gentle ridges (5°-15°) promote infiltration rather than erosive surface runoff</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Lineament &amp; Fault Fracture Density</span>
                <span className="font-bold text-slate-900 font-mono">15% Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
              <span className="text-[10px] text-slate-400">Structural fissures that funnel surface water into confined aquifers</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Land Use / Land Cover (LULC)</span>
                <span className="font-bold text-slate-900 font-mono">10% Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
              <span className="text-[10px] text-slate-400">Canopy interception, soil organic matter, root macro-pores</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Upload Ingestion */}
      {activeTab === 'upload' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Ingest New Spatial Dataset
            </h4>
            <p className="text-xs text-slate-500">
              Upload GeoJSON, KML, CSV or Shapefile (.zip) containing spring inventory coordinates or DEM tiles
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Drag and drop spatial file here, or click to browse</p>
            <p className="text-[10px] text-slate-400 mt-1">Supports .geojson, .csv, .kml, .zip (shapefile) up to 50MB</p>

            <input
              type="file"
              onChange={handleSimulateUpload}
              className="mt-4 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
            />
          </div>

          {uploadStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
