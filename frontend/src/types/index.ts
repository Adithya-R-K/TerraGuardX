export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export interface Zone {
  zone_id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  risk_score: number;
  risk_level: RiskLevel;
  static_susceptibility: number;
  dynamic_trigger: number;
  sar_signal: number;
  sar_mode: string;
  rainfall_24h: number;
  rainfall_72h: number;
  slope: number;
  elevation: number;
  nearest_road_km: number;
  top_factors: string[];
  model_confidence: number;
  data_completeness: number;
  data_mode: string;
  updated?: string;
  run_id?: string;
  prediction_id?: number;
}

export interface Alert {
  id: number;
  zone_id: string;
  prediction_id?: number;
  severity: RiskLevel;
  score: number;
  trigger: string;
  message: string;
  recipients?: string[];
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FAILED';
  created_at?: string;
}

export interface HourlyRainfall {
  t: string;
  mm: number;
  timestamp?: string;
  rain_mm?: number;
}

export interface ZoneRainfallResponse {
  data_mode: string;
  hourly: { timestamp: string; rain_mm: number }[];
}

export interface SatelliteObservation {
  zone_id: string;
  name?: string;
  deformation_mm: number;
  coherence: number;
  ndvi_change: number;
  acquisition_date: string;
}

export interface LandslideEvent {
  id?: number;
  zone_id?: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  date: string;
  fatalities?: number;
  volume_m3?: number;
  trigger?: string;
}

export interface GeoFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties?: Record<string, any>;
}

export interface ExposureData {
  villages: {
    type: string;
    features: GeoFeature[];
  };
  roads: {
    type: string;
    features: GeoFeature[];
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  val_roc_auc?: number;
  false_positive_rate?: number;
  false_negative_rate?: number;
  confusion_matrix?: number[][];
}

export interface ModelInfo {
  kind: 'static' | 'dynamic';
  version: number;
  algorithm: string;
  trained_at: string;
  n_train: number;
  n_val: number;
  n_test?: number;
  val_roc_auc?: number;
  metrics: ModelMetrics;
  feature_importance: Record<string, number>;
  note?: string;
}

export interface ModelPerformanceData {
  static?: ModelInfo;
  dynamic?: ModelInfo;
}

export interface DataHealthStatus {
  rainfall: string;
  dem: string;
  sar: string;
  historical_inventory: string;
  exposure: string;
  requested_mode: string;
  live_sync?: boolean;
  warnings: string[];
}

export interface UserAuth {
  username: string;
  role: 'ADMIN' | 'AUTHORITY' | 'VIEWER';
  token: string;
}

export interface FieldFeedbackSubmission {
  zone_id: string;
  actual_event: 'CONFIRMED_LANDSLIDE' | 'NO_LANDSLIDE' | 'FALSE_ALARM' | 'UNKNOWN';
  prediction_id?: number | null;
  severity?: number | null;
  notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  event_date?: string | null;
}
