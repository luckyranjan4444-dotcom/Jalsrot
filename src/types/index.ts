export type SuitabilityLevel = 'HIGH' | 'MODERATE' | 'LOW';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type VerificationStatus = 'Pending Verification' | 'Verified Valid' | 'Rejected' | 'Modified';
export type Seasonality = 'Perennial' | 'Seasonal' | 'Ephemeral';
export type InterventionType = 
  | 'Contour Trench'
  | 'Recharge Pit'
  | 'Check Dam'
  | 'Percolation Structure'
  | 'Loose Boulder Structure'
  | 'Staggered Trenches';

export type DataQualityRating = 'Good' | 'Moderate' | 'Limited';

export interface SpringData {
  id: string;
  name: string;
  code: string; // e.g. S-104
  village: string;
  panchayat: string;
  block: string;
  elevationM: number;
  dischargeLpm: number;
  seasonality: Seasonality;
  springshedAreaKm2: number;
  lat: number;
  lng: number;
  associatedRechargeZoneId: string;
  
  // AI Assessment
  rechargeSuitability: SuitabilityLevel;
  confidenceScore: number; // 0 - 100
  dataQuality: DataQualityRating;
  
  // Explainability Factors
  factors: {
    rainfall: 'High' | 'Moderate' | 'Low';
    slope: 'Suitable' | 'Moderate' | 'Steep/Unfavorable';
    geology: 'Suitable' | 'Moderate' | 'Unfavorable';
    drainage: 'High' | 'Moderate' | 'Low';
    landCover: 'Suitable' | 'Moderate' | 'Unfavorable';
  };
  
  beneficiaryHouseholds: number;
  waterQualityIndex: 'Good' | 'Fair' | 'High Turbidity';
  lastFieldCheck?: string;
  criticality: 'High' | 'Medium' | 'Normal';
}

export interface RechargeZoneData {
  id: string;
  code: string; // e.g. RZ-21
  name: string;
  areaHectares: number;
  suitability: SuitabilityLevel;
  confidenceScore: number;
  dataQuality: DataQualityRating;
  lat: number;
  lng: number;
  polygonCoordinates: [number, number][]; // Leaflet LatLng coordinates
  factors: {
    rainfall: 'High' | 'Moderate' | 'Low';
    slope: 'High' | 'Moderate' | 'Low';
    geology: 'High' | 'Moderate' | 'Low';
    drainage: 'High' | 'Moderate' | 'Low';
    landCover: 'High' | 'Moderate' | 'Low';
  };
  explanation: string;
  rockFormation: string;
  soilDepthCm: number;
  recommendedStructures: InterventionType[];
  verified: boolean;
}

export interface InterventionSiteData {
  id: string;
  code: string; // e.g. INT-07
  name: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedIntervention: InterventionType;
  zoneCode: string;
  lat: number;
  lng: number;
  reasons: string[];
  estCostInr: number;
  estimatedStorageM3: number;
  slopeDeg: number;
  soilType: string;
  status: VerificationStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  photoUrl?: string;
}

export interface RiskZoneData {
  id: string;
  code: string;
  name: string;
  riskLevel: RiskLevel;
  primaryRisk: 'Landslide Susceptibility' | 'Steep Slope & Runoff' | 'Geological Fault Zone' | 'Severe Data Uncertainty';
  description: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  rechargeSuitability: SuitabilityLevel;
  warningNote: string;
  mitigationRequirement: string;
}

export interface CommunityObservationData {
  id: string;
  springCode?: string;
  village: string;
  observerName: string;
  role: 'Villager' | 'Field Mobilizer' | 'ASHA Worker' | 'Panchayat Member';
  date: string;
  lat: number;
  lng: number;
  springCondition: 'Drying up earlier' | 'Steady yield' | 'Muddy during monsoon' | 'Severely decreased flow';
  waterAvailabilityMonths: number;
  localObservations: string;
  existingStructures: string;
  problemsObserved: string;
  photoPlaceholder?: string;
  isCommunityVerified: boolean;
}

export type BasemapType = 'light' | 'satellite' | 'terrain' | 'topo';

export interface ContourLineData {
  id: string;
  elevationM: number;
  isIndex: boolean; // e.g. 100m index contours are thicker
  coordinates: [number, number][];
}

export interface MapLayerConfig {
  springs: boolean;
  rechargeZones: boolean;
  elevation: boolean;
  slope: boolean;
  drainage: boolean;
  geology: boolean;
  landUse: boolean;
  faults: boolean;
  existingStructures: boolean;
  interventionSites: boolean;
  riskZones: boolean;
  contours: boolean;
  watershedBoundary: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'springs'
  | 'recharge'
  | 'interventions'
  | 'risk'
  | 'validation'
  | 'community'
  | 'reports'
  | 'data';
