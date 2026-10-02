import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData,
  MapLayerConfig,
  BasemapType
} from '../../types';
import {
  DEMO_DRAINAGE_STREAMS,
  DEMO_GEOLOGICAL_FAULTS,
  DEMO_WATERSHED_DIVIDE,
  DEMO_S104_SPRINGSHED_AREA
} from '../../data/mockData';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Info,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Globe,
  Mountain,
  Ruler,
  TrendingDown,
  X,
  Compass
} from 'lucide-react';

interface GisMapProps {
  springs: SpringData[];
  rechargeZones: RechargeZoneData[];
  interventionSites: InterventionSiteData[];
  riskZones: RiskZoneData[];
  communityObservations: CommunityObservationData[];
  selectedSpring?: SpringData | null;
  selectedZone?: RechargeZoneData | null;
  selectedIntervention?: InterventionSiteData | null;
  selectedRisk?: RiskZoneData | null;
  onSelectSpring?: (spring: SpringData) => void;
  onSelectRechargeZone?: (zone: RechargeZoneData) => void;
  onSelectIntervention?: (site: InterventionSiteData) => void;
  onSelectRisk?: (risk: RiskZoneData) => void;
  onSelectObservation?: (obs: CommunityObservationData) => void;
  activeLayerConfig?: Partial<MapLayerConfig>;
  highlightItemId?: string | null;
  heightClass?: string;
  showLayerToggle?: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({
  springs,
  rechargeZones,
  interventionSites,
  riskZones,
  communityObservations,
  selectedSpring,
  selectedZone,
  selectedIntervention,
  selectedRisk,
  onSelectSpring,
  onSelectRechargeZone,
  onSelectIntervention,
  onSelectRisk,
  onSelectObservation,
  activeLayerConfig,
  highlightItemId,
  heightClass = 'h-[520px]',
  showLayerToggle = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<{ [key: string]: L.LayerGroup }>({});

  // Basemap State: 'light' (Standard), 'satellite' (Esri Imagery), 'topo' (Topographic Contour Map)
  const [basemap, setBasemap] = useState<BasemapType>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);
  const [showElevationProfile, setShowElevationProfile] = useState(false);

  // Measurement Tool State
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measuredDistanceM, setMeasuredDistanceM] = useState<number | null>(null);
  const measureLineRef = useRef<L.Polyline | null>(null);
  const measureMarkersRef = useRef<L.Marker[]>([]);

  // Mouse Cursor Coordinates
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number; elevM: number } | null>(null);

  const [layers, setLayers] = useState<MapLayerConfig>({
    springs: true,
    rechargeZones: true,
    elevation: false,
    slope: false,
    drainage: true,
    geology: false,
    landUse: false,
    faults: true,
    existingStructures: true,
    interventionSites: true,
    riskZones: true,
    contours: false,
    watershedBoundary: true,
    ...activeLayerConfig,
  });

  // Keep layers in sync if parent passed activeLayerConfig
  useEffect(() => {
    if (activeLayerConfig) {
      setLayers(prev => ({ ...prev, ...activeLayerConfig }));
    }
  }, [activeLayerConfig]);

  // Center coordinate of Demo Springshed (Kashipur / Tribal Hills)
  const defaultCenter: [number, number] = [19.172, 83.415];
  const defaultZoom = 13;
  const indiaCenter: [number, number] = [22.8, 80.5];
  const indiaZoom = 5;
  const [currentZoom, setCurrentZoom] = useState<number>(defaultZoom);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 4, // Allows zooming out to view the entire map of India
      maxZoom: 18, // High-detail local zoom without losing tiles
      zoomControl: false,
      attributionControl: false,
    });

    // Highly reliable OpenStreetMap standard base with India-wide coverage
    const initialTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxNativeZoom: 18,
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    tileLayerRef.current = initialTile;

    // Track current zoom level
    map.on('zoomend', () => {
      try {
        setCurrentZoom(map.getZoom());
      } catch (e) {
        // ignore
      }
    });

    // Force size invalidation so map renders immediately without grey blank areas
    const invalidate = () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      } catch (e) {
        // ignore
      }
    };

    setTimeout(invalidate, 50);
    setTimeout(invalidate, 200);
    setTimeout(invalidate, 500);

    // ResizeObserver to handle tab changes and window resize
    const resizeObserver = new ResizeObserver(() => {
      invalidate();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Cursor coordinates tracking
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = Number(e.latlng.lat.toFixed(5));
      const lng = Number(e.latlng.lng.toFixed(5));
      const distFromRidge = Math.sqrt(Math.pow((lat - 19.175), 2) + Math.pow((lng - 83.405), 2));
      const estimatedElev = Math.round(1580 - distFromRidge * 4200 + (lat % 0.005) * 6000);
      const clampedElev = Math.min(1620, Math.max(1260, estimatedElev));
      setCursorPos({ lat, lng, elevM: clampedElev });
    });

    // Measurement click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      setMeasurePoints(prev => {
        if (prev.length >= 2) {
          return [[e.latlng.lat, e.latlng.lng]];
        }
        return [...prev, [e.latlng.lat, e.latlng.lng]];
      });
    });

    mapInstanceRef.current = map;

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      tileLayerRef.current = null;
    };
  }, []);

  // Update Basemap Tiles (Standard / Satellite / Topo with Contours)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }

    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options: L.TileLayerOptions = {
      minZoom: 3,
      maxNativeZoom: 18,
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    };

    if (basemap === 'satellite') {
      // High-resolution satellite imagery covering all India
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      options = {
        minZoom: 3,
        maxNativeZoom: 17,
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      };
    } else if (basemap === 'topo') {
      // Official Topographic Map with Real Contours & Shaded Relief
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      options = {
        minZoom: 3,
        maxNativeZoom: 17,
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri, USGS, DeLorme',
      };
    }

    const newTile = L.tileLayer(tileUrl, options).addTo(map);
    tileLayerRef.current = newTile;

    // Trigger size update
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  }, [basemap]);

  // Handle Measurement Line Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (measureLineRef.current) {
      measureLineRef.current.remove();
      measureLineRef.current = null;
    }
    measureMarkersRef.current.forEach(m => m.remove());
    measureMarkersRef.current = [];

    if (measurePoints.length === 1) {
      const pt = measurePoints[0];
      const marker = L.circleMarker(pt, { radius: 6, color: '#EA580C', fillColor: '#EA580C', fillOpacity: 0.9 }).addTo(map);
      measureMarkersRef.current.push(marker as any);
      setMeasuredDistanceM(null);
    } else if (measurePoints.length === 2) {
      const pt1 = L.latLng(measurePoints[0][0], measurePoints[0][1]);
      const pt2 = L.latLng(measurePoints[1][0], measurePoints[1][1]);
      const dist = Math.round(pt1.distanceTo(pt2));
      setMeasuredDistanceM(dist);

      const poly = L.polyline(measurePoints, { color: '#EA580C', weight: 3.5, dashArray: '5, 5' }).addTo(map);
      measureLineRef.current = poly;

      const m1 = L.circleMarker(measurePoints[0], { radius: 6, color: '#EA580C', fillColor: '#EA580C', fillOpacity: 0.9 }).addTo(map);
      const m2 = L.circleMarker(measurePoints[1], { radius: 6, color: '#EA580C', fillColor: '#EA580C', fillOpacity: 0.9 }).addTo(map);
      measureMarkersRef.current.push(m1 as any, m2 as any);
    }
  }, [measurePoints]);

  // Update Features & Overlays (Springs, Recharge Zones, Interventions, Risks, Streams)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing overlay groups
    Object.values(layersGroupRef.current).forEach(group => group.remove());
    layersGroupRef.current = {};

    const isSatellite = basemap === 'satellite';

    // 1. WATERSHED CATCHMENT BOUNDARY
    if (layers.watershedBoundary) {
      const boundaryGroup = L.layerGroup();
      const polygon = L.polygon(DEMO_WATERSHED_DIVIDE.coordinates, {
        color: isSatellite ? '#67E8F9' : '#4F46E5',
        weight: 2.5,
        dashArray: '8, 6',
        fillColor: '#6366F1',
        fillOpacity: 0.06,
      });
      polygon.bindTooltip(`
        <div class="px-2 py-1 text-xs">
          <span class="font-bold text-indigo-950">⛰️ ${DEMO_WATERSHED_DIVIDE.name}</span><br/>
          <span class="text-slate-600">Springshed Basin: <strong>${DEMO_WATERSHED_DIVIDE.areaKm2} km²</strong></span>
        </div>
      `, { sticky: true });
      polygon.addTo(boundaryGroup);
      boundaryGroup.addTo(map);
      layersGroupRef.current.watershedBoundary = boundaryGroup;
    }

    // 1b. SPRING S-104 DEDICATED SPRINGSHED BASIN AREA (2.4 km² Colored Micro-Catchment)
    if (layers.springs) {
      const s104AreaGroup = L.layerGroup();
      const s104Polygon = L.polygon(DEMO_S104_SPRINGSHED_AREA.polygonCoordinates, {
        color: '#0284C7',
        weight: 2.5,
        dashArray: '6, 4',
        fillColor: '#38BDF8',
        fillOpacity: isSatellite ? 0.38 : 0.26,
      });
      s104Polygon.bindTooltip(`
        <div class="px-2.5 py-1.5 text-xs bg-white rounded shadow-md border border-sky-300">
          <div class="font-bold text-sky-950 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>${DEMO_S104_SPRINGSHED_AREA.springCode} Springshed Area</span>
          </div>
          <div class="text-sky-800 font-semibold mt-0.5">
            Delineated Basin: <strong>${DEMO_S104_SPRINGSHED_AREA.areaKm2} km²</strong>
          </div>
          <div class="text-[10px] text-slate-500">
            ${DEMO_S104_SPRINGSHED_AREA.springName}
          </div>
        </div>
      `, { sticky: true });
      s104Polygon.addTo(s104AreaGroup);
      s104AreaGroup.addTo(map);
      layersGroupRef.current.s104SpringshedArea = s104AreaGroup;
    }

    // 2. RECHARGE ZONES LAYER
    if (layers.rechargeZones) {
      const rzGroup = L.layerGroup();
      rechargeZones.forEach(zone => {
        const color = 
          zone.suitability === 'HIGH' ? '#16A34A' :
          zone.suitability === 'MODERATE' ? '#EAB308' : '#DC2626';
        
        const isSelected = selectedZone?.id === zone.id || highlightItemId === zone.id;

        const polygon = L.polygon(zone.polygonCoordinates, {
          color: color,
          weight: isSelected ? 3.5 : 2,
          opacity: 0.85,
          fillColor: color,
          fillOpacity: isSelected ? 0.38 : 0.22,
          dashArray: zone.suitability === 'MODERATE' ? '4, 4' : undefined,
        });

        polygon.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <span class="font-bold text-slate-800">${zone.code}: ${zone.name}</span><br/>
            <span class="text-slate-600">Recharge Suitability: <strong>${zone.suitability}</strong> (${zone.confidenceScore}%)</span>
          </div>
        `, { sticky: true });

        polygon.on('click', () => {
          if (onSelectRechargeZone) onSelectRechargeZone(zone);
        });

        polygon.addTo(rzGroup);
      });
      rzGroup.addTo(map);
      layersGroupRef.current.rechargeZones = rzGroup;
    }

    // 3. RISK ZONES LAYER
    if (layers.riskZones) {
      const riskGroup = L.layerGroup();
      riskZones.forEach(risk => {
        const color = risk.riskLevel === 'HIGH' ? '#DC2626' : '#EA580C';
        const isSelected = selectedRisk?.id === risk.id || highlightItemId === risk.id;

        const circle = L.circle([risk.lat, risk.lng], {
          radius: risk.radiusMeters,
          color: color,
          weight: isSelected ? 3 : 2,
          dashArray: '6, 6',
          fillColor: color,
          fillOpacity: 0.22,
        });

        circle.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <div class="font-bold text-red-700 flex items-center gap-1">⚠️ ${risk.code}: ${risk.name}</div>
            <div class="text-slate-700">${risk.primaryRisk} (${risk.riskLevel} Risk)</div>
          </div>
        `, { sticky: true });

        circle.on('click', () => {
          if (onSelectRisk) onSelectRisk(risk);
        });

        circle.addTo(riskGroup);
      });
      riskGroup.addTo(map);
      layersGroupRef.current.riskZones = riskGroup;
    }

    // 4. DRAINAGE STREAMS
    if (layers.drainage) {
      const drainageGroup = L.layerGroup();
      DEMO_DRAINAGE_STREAMS.forEach(stream => {
        const polyline = L.polyline(stream.coordinates, {
          color: isSatellite ? '#38BDF8' : '#0284C7',
          weight: 2.8,
          opacity: 0.85,
        });
        polyline.bindTooltip(`<span class="text-xs text-sky-800 font-semibold">🌊 ${stream.name}</span>`);
        polyline.addTo(drainageGroup);
      });
      drainageGroup.addTo(map);
      layersGroupRef.current.drainage = drainageGroup;
    }

    // 5. FAULTS AND FRACTURES
    if (layers.faults) {
      const faultGroup = L.layerGroup();
      DEMO_GEOLOGICAL_FAULTS.forEach(fault => {
        const polyline = L.polyline(fault.coordinates, {
          color: isSatellite ? '#F472B6' : '#7C3AED',
          weight: 2.2,
          opacity: 0.85,
          dashArray: '8, 5',
        });
        polyline.bindTooltip(`<span class="text-xs text-purple-800 font-medium">⚡ ${fault.name} (${fault.type})</span>`);
        polyline.addTo(faultGroup);
      });
      faultGroup.addTo(map);
      layersGroupRef.current.faults = faultGroup;
    }

    // 6. INTERVENTION SITES
    if (layers.interventionSites) {
      const intGroup = L.layerGroup();
      interventionSites.forEach(site => {
        const isSelected = selectedIntervention?.id === site.id || highlightItemId === site.id;
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'border-amber-400 ring-2 ring-emerald-500' : 'border-white'}">
              <span class="text-xs font-bold">📍</span>
            </div>
            <div class="absolute -bottom-1 -right-1 px-1 bg-slate-900 text-[9px] font-bold text-white rounded">
              ${site.priority === 'HIGH' ? 'P1' : 'P2'}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([site.lat, site.lng], { icon });
        marker.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <div class="font-bold text-slate-800">${site.code}: ${site.name}</div>
            <div class="text-emerald-700 font-semibold">${site.recommendedIntervention} (${site.priority} Priority)</div>
            <div class="text-[10px] text-slate-500">Status: ${site.status}</div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          if (onSelectIntervention) onSelectIntervention(site);
        });

        marker.addTo(intGroup);
      });
      intGroup.addTo(map);
      layersGroupRef.current.interventionSites = intGroup;
    }

    // 7. SPRINGS LAYER
    if (layers.springs) {
      const springGroup = L.layerGroup();
      springs.forEach(spring => {
        const isSelected = selectedSpring?.id === spring.id || highlightItemId === spring.id;
        const isSeasonal = spring.seasonality === 'Seasonal';
        const isS104 = spring.id === 's-104' || spring.code.includes('S-104');
        
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            ${isS104 ? '<span class="absolute -inset-1 rounded-full bg-sky-400 opacity-60 animate-ping"></span>' : ''}
            <div class="w-7 h-7 rounded-full ${isS104 ? 'bg-sky-600 ring-2 ring-sky-300 shadow-md' : isSeasonal ? 'bg-sky-500' : 'bg-blue-600'} text-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'border-amber-400 ring-2 ring-sky-400' : 'border-white'}">
              <span class="text-xs">💧</span>
            </div>
            <span class="absolute -top-3.5 ${isS104 ? 'bg-sky-900 border border-sky-300 text-sky-100 font-bold' : 'bg-slate-900 text-white'} text-[9px] px-1 py-0.2 rounded shadow whitespace-nowrap">
              ${spring.code.replace('Spring ', '')}
            </span>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-spring-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([spring.lat, spring.lng], { icon });
        marker.bindTooltip(`
          <div class="px-2 py-1 text-xs">
            <div class="font-bold text-slate-900">${spring.code} - ${spring.name}</div>
            <div class="text-sky-700">Discharge: ${spring.dischargeLpm} L/min • ${spring.seasonality}</div>
            <div class="text-emerald-700 font-semibold">Suitability: ${spring.rechargeSuitability} (${spring.confidenceScore}%)</div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          if (onSelectSpring) onSelectSpring(spring);
        });

        marker.addTo(springGroup);
      });
      springGroup.addTo(map);
      layersGroupRef.current.springs = springGroup;
    }

    // 8. COMMUNITY OBSERVATIONS
    const commGroup = L.layerGroup();
    communityObservations.forEach(obs => {
      const iconHtml = `
        <div class="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow border border-white hover:scale-110 cursor-pointer">
          <span class="text-[11px]">💬</span>
        </div>
      `;
      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-comm-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([obs.lat, obs.lng], { icon });
      marker.bindTooltip(`
        <div class="px-2 py-1 text-xs">
          <div class="font-bold text-amber-800">Community Observation</div>
          <div class="text-slate-800">${obs.village} (${obs.observerName})</div>
          <div class="text-[10px] text-slate-500">${obs.springCondition}</div>
        </div>
      `, { sticky: true });

      marker.on('click', () => {
        if (onSelectObservation) onSelectObservation(obs);
      });

      marker.addTo(commGroup);
    });
    commGroup.addTo(map);
    layersGroupRef.current.communityObservations = commGroup;

  }, [
    basemap,
    layers,
    springs,
    rechargeZones,
    interventionSites,
    riskZones,
    communityObservations,
    selectedSpring,
    selectedZone,
    selectedIntervention,
    selectedRisk,
    highlightItemId,
    onSelectSpring,
    onSelectRechargeZone,
    onSelectIntervention,
    onSelectRisk,
    onSelectObservation,
  ]);

  // Center to selected item if requested
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedSpring) {
      map.flyTo([selectedSpring.lat, selectedSpring.lng], 14, { duration: 0.8 });
    } else if (selectedZone) {
      map.flyTo([selectedZone.lat, selectedZone.lng], 14, { duration: 0.8 });
    } else if (selectedIntervention) {
      map.flyTo([selectedIntervention.lat, selectedIntervention.lng], 14, { duration: 0.8 });
    } else if (selectedRisk) {
      map.flyTo([selectedRisk.lat, selectedRisk.lng], 14, { duration: 0.8 });
    }
  }, [selectedSpring, selectedZone, selectedIntervention, selectedRisk]);

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    const cur = mapInstanceRef.current.getZoom();
    if (cur < 18) {
      mapInstanceRef.current.setZoom(cur + 1);
    }
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    const cur = mapInstanceRef.current.getZoom();
    if (cur > 4) {
      mapInstanceRef.current.setZoom(cur - 1);
    }
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(defaultCenter, defaultZoom, { duration: 1.0 });
    setCurrentZoom(defaultZoom);
  };

  const handleViewAllIndia = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(indiaCenter, indiaZoom, { duration: 1.0 });
    setCurrentZoom(indiaZoom);
  };

  const toggleLayer = (layerKey: keyof MapLayerConfig) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : heightClass
      }`}
      style={{ minHeight: '460px' }}
    >
      {/* Real Leaflet Map DOM Node */}
      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 z-0"
        style={{ minHeight: '460px', width: '100%', height: '100%' }}
      />

      {/* Top Left: Clean Basemap Switcher (Standard / Satellite / Topo with Contours) */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        {/* Basemap Segmented Switcher */}
        <div className="bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1 text-xs">
          <button
            onClick={() => setBasemap('light')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              basemap === 'light'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🗺️ Map</span>
          </button>

          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              basemap === 'satellite'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🛰️ Satellite</span>
          </button>

          <button
            onClick={() => setBasemap('topo')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              basemap === 'topo'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Topographic Map with Natural Elevation Contours & Relief"
          >
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>⛰️ Topo / Contours</span>
          </button>
        </div>

        {/* GIS Layers Toggle Button */}
        {showLayerToggle && (
          <div className="relative">
            <button
              onClick={() => setShowLayersDropdown(!showLayersDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-slate-700 text-xs font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Toggle Feature Layers"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Layers</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-0.5"></span>
            </button>

            {/* Layer Selector Dropdown */}
            {showLayersDropdown && (
              <div className="absolute top-full mt-1.5 left-0 w-60 bg-white rounded-lg shadow-lg border border-slate-200 p-2.5 z-30 text-xs animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Feature Overlays</span>
                  <span className="text-[10px] text-slate-400">Springshed GIS</span>
                </div>
                
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>💧</span> Springs Inventory
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.springs}
                      onChange={() => toggleLayer('springs')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>🟢</span> Probable Recharge Zones
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.rechargeZones}
                      onChange={() => toggleLayer('rechargeZones')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>📍</span> Intervention Sites
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.interventionSites}
                      onChange={() => toggleLayer('interventionSites')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>⚠️</span> Risk Zones
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.riskZones}
                      onChange={() => toggleLayer('riskZones')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>🌊</span> Drainage Streams
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.drainage}
                      onChange={() => toggleLayer('drainage')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>⚡</span> Geological Faults
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.faults}
                      onChange={() => toggleLayer('faults')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>🏞️</span> Watershed Boundary
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.watershedBoundary}
                      onChange={() => toggleLayer('watershedBoundary')}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Elevation Profile Cross-Section Button */}
        <button
          onClick={() => setShowElevationProfile(!showElevationProfile)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-slate-700 text-xs font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          title="View Ridge-to-Spring Hydrogeological Cross Section"
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>Elevation Profile</span>
        </button>

        {/* Measure Tool Button */}
        <button
          onClick={() => {
            setIsMeasuring(!isMeasuring);
            setMeasurePoints([]);
            setMeasuredDistanceM(null);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-xs text-xs font-semibold rounded-lg shadow-sm border transition-colors ${
            isMeasuring
              ? 'bg-orange-500 text-white border-orange-600'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Click two points to measure ground distance"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>{isMeasuring ? 'Click 2 Points...' : 'Measure'}</span>
        </button>
      </div>

      {/* Measured Distance Floating Pill */}
      {measuredDistanceM !== null && (
        <div className="absolute top-14 left-3 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg shadow-md border border-slate-700 text-xs flex items-center gap-2">
          <span>📏 Ground Distance: <strong className="text-amber-400 font-mono text-sm">{(measuredDistanceM / 1000).toFixed(2)} km</strong> ({measuredDistanceM} m)</span>
          <button onClick={() => { setMeasurePoints([]); setMeasuredDistanceM(null); }} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Floating Pill when zoomed out to All-India view */}
      {currentZoom <= 8 && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 animate-in fade-in">
          <button
            onClick={handleResetView}
            className="bg-emerald-800 text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 hover:bg-emerald-900 transition-transform hover:scale-105 border border-emerald-500"
          >
            <span>📍 Kashipur Springshed Pilot (Odisha)</span>
            <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded font-bold">Zoom into Springshed →</span>
          </button>
        </div>
      )}

      {/* Floating Map Controls (Zoom, All-India, Reset, Fullscreen) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs rounded-lg shadow-sm border border-slate-200 p-1">
        <button
          onClick={handleZoomIn}
          disabled={currentZoom >= 18}
          className={`p-1.5 rounded transition-colors ${
            currentZoom >= 18
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={currentZoom >= 18 ? 'Maximum zoom level reached' : 'Zoom In'}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={currentZoom <= 4}
          className={`p-1.5 rounded transition-colors ${
            currentZoom <= 4
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={currentZoom <= 4 ? 'All-India national zoom level reached' : 'Zoom Out'}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 my-0.5" />
        <button
          onClick={handleViewAllIndia}
          className="p-1.5 rounded text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center justify-center font-bold text-xs"
          title="Zoom out to Full India Map"
        >
          🇮🇳
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Center on Tribal Springshed (Local Area)"
        >
          <Crosshair className="w-4 h-4 text-emerald-600" />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Real-time Cursor Coordinates & Elevation Bar */}
      {cursorPos && (
        <div className="absolute bottom-3 right-3 z-10 bg-slate-900/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-sm flex items-center gap-2 border border-slate-700">
          <span>Lat: {cursorPos.lat}°N</span>
          <span>Lng: {cursorPos.lng}°E</span>
          <span className="text-emerald-400 font-bold border-l border-slate-700 pl-2">
            Elev: {cursorPos.elevM} m
          </span>
          <span className="text-slate-400 border-l border-slate-700 pl-2">
            Zoom: {currentZoom}x
          </span>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs rounded-lg shadow-sm border border-slate-200 px-3 py-2 text-xs max-w-sm">
        <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-100 flex items-center justify-between">
          <span>Map Legend</span>
          <span className="text-[9px] text-slate-400 font-normal">
            {basemap === 'topo' ? 'Topo Mode Active' : basemap === 'satellite' ? 'Satellite View' : 'Standard View'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>🟢 High Recharge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>🟡 Moderate Recharge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-sky-300 border border-sky-600 border-dashed rounded-2xs"></span>
            <span className="text-sky-900 font-semibold">💧 S-104 Basin (2.4 km²)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>💧</span>
            <span>Spring Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>Intervention Site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Risk Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-600"></span>
            <span>Drainage Stream</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-indigo-600 border-dashed"></span>
            <span>Catchment Divide</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-purple-600 border-dashed"></span>
            <span>Geological Fault</span>
          </div>
        </div>
      </div>

      {/* Elevation Profile Cross-Section Drawer */}
      {showElevationProfile && (
        <div className="absolute bottom-12 inset-x-4 sm:inset-x-12 z-30 bg-white/98 backdrop-blur-md rounded-xl shadow-xl border border-slate-300 p-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-slate-900">
                Hydrogeological Cross-Section Profile (Ridge Crest → Spring S-104 Emergence)
              </h4>
            </div>
            <button onClick={() => setShowElevationProfile(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 relative h-28 w-full bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-end justify-between text-[10px] font-mono">
            <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <polygon points="0,15 120,35 240,48 360,65 500,90 500,100 0,100" fill="url(#profileGrad)" />
              <polyline
                points="0,15 120,35 240,48 360,65 500,90"
                fill="none"
                stroke="#047857"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="15" r="4" fill="#047857" />
              <circle cx="120" cy="35" r="4" fill="#10B981" />
              <circle cx="240" cy="48" r="4" fill="#0284C7" />
              <circle cx="360" cy="65" r="5" fill="#2563EB" />
              <circle cx="500" cy="90" r="4" fill="#64748B" />
            </svg>

            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-slate-800">1,600m</span>
              <span className="text-[9px] text-slate-500">Ridge Crest</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-emerald-800">1,490m</span>
              <span className="text-[9px] text-emerald-700 font-semibold">Zone RZ-21</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-sky-800">1,450m</span>
              <span className="text-[9px] text-sky-700">Contour Trench</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-blue-900 bg-blue-100 px-1 rounded">1,420m</span>
              <span className="text-[9px] text-blue-800 font-bold">💧 Spring S-104</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold text-slate-700">1,280m</span>
              <span className="text-[9px] text-slate-500">Valley Nala</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total Profile Distance: ~2.4 km along hydraulic gradient</span>
            <span className="font-semibold text-emerald-800">Infiltration Travel Time: ~14-22 days to discharge</span>
          </div>
        </div>
      )}
    </div>
  );
};
