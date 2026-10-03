import {
  Zone,
  Alert,
  ZoneRainfallResponse,
  SatelliteObservation,
  LandslideEvent,
  ExposureData,
  ModelPerformanceData,
  DataHealthStatus,
  FieldFeedbackSubmission
} from '../types';

const API_BASE = (import.meta as any).env.VITE_API || 'http://localhost:8000';

class ApiService {
  private token: string = '';

  constructor() {
    this.token = localStorage.getItem('tgx_token') || '';
  }

  public setToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('tgx_token', token);
    } else {
      localStorage.removeItem('tgx_token');
    }
  }

  public getToken(): string {
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorDetail;
      } catch {
        // Fallback to status text
      }
      throw new Error(errorDetail);
    }

    return response.json() as Promise<T>;
  }

  // Auth
  public async login(username: string, password: string): Promise<{ access_token: string; role: 'ADMIN' | 'AUTHORITY' | 'VIEWER' }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Health
  public async getHealth(): Promise<{ status: string; data_mode: string; disclaimer: string }> {
    return this.request('/api/health');
  }

  // Risk Predictions
  public async getRisk(): Promise<{ zones: Zone[]; disclaimer: string }> {
    return this.request('/api/risk');
  }

  public async getRiskMap(): Promise<any> {
    return this.request('/api/risk/map');
  }

  public async getRiskZone(zoneId: string): Promise<Zone> {
    return this.request(`/api/risk/${zoneId}`);
  }

  // Zones
  public async getZones(): Promise<any[]> {
    return this.request('/api/zones');
  }

  public async getZone(zoneId: string): Promise<any> {
    return this.request(`/api/zones/${zoneId}`);
  }

  // Rainfall
  public async getRainfall(zoneId: string): Promise<ZoneRainfallResponse> {
    return this.request(`/api/rainfall/${zoneId}`);
  }

  // Satellite
  public async getSatellite(): Promise<{ data_mode: string; observations: SatelliteObservation[] }> {
    return this.request('/api/satellite');
  }

  // Landslides
  public async getLandslides(): Promise<{ data_mode: string; events: LandslideEvent[] }> {
    return this.request('/api/landslides');
  }

  // Exposure
  public async getExposure(): Promise<ExposureData> {
    return this.request('/api/exposure');
  }

  // Alerts
  public async getAlerts(): Promise<Alert[]> {
    return this.request('/api/alerts');
  }

  public async sendAlertAction(alertId: number, action: 'send' | 'acknowledge' | 'resolve', recipients?: string[]): Promise<{ id: number; status: string }> {
    return this.request('/api/alerts/send', {
      method: 'POST',
      body: JSON.stringify({
        alert_id: alertId,
        action,
        recipients: recipients || ['+910000000000'],
      }),
    });
  }

  // Feedback
  public async submitFeedback(feedback: FieldFeedbackSubmission): Promise<{ id: number }> {
    return this.request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  // Model Performance
  public async getModelPerformance(): Promise<ModelPerformanceData> {
    return this.request('/api/model/performance');
  }

  public async getModelFeatures(): Promise<{ static: Record<string, number>; dynamic: Record<string, number> }> {
    return this.request('/api/model/features');
  }

  // Data Status
  public async getDataStatus(): Promise<DataHealthStatus> {
    return this.request('/api/data-status');
  }

  // Retrain
  public async retrainModel(): Promise<{ version: number; feedback_records_used: number; metrics: any }> {
    return this.request('/api/admin/retrain', {
      method: 'POST',
    });
  }

  // Pipeline Simulation
  public async runSimulation(): Promise<{ run_id: string; data_mode: string; zones: Zone[] }> {
    return this.request('/api/prediction', {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
