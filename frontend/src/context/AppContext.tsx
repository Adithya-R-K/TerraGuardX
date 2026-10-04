import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  Zone,
  Alert,
  SatelliteObservation,
  LandslideEvent,
  ModelPerformanceData,
  DataHealthStatus,
  ExposureData,
} from '../types';

interface AppContextType {
  token: string;
  role: 'ADMIN' | 'AUTHORITY' | 'VIEWER' | '';
  username: string;
  isAuthenticated: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;

  zones: Zone[];
  alerts: Alert[];
  selectedZone: Zone | null;
  setSelectedZone: (z: Zone | null) => void;
  roads: any[];
  villages: any[];
  satelliteObservations: SatelliteObservation[];
  landslides: LandslideEvent[];
  dataStatus: DataHealthStatus | null;
  modelPerf: ModelPerformanceData | null;
  lastUpdated: string;
  dataMode: 'LIVE' | 'DEMO';

  activePage: string;
  setActivePage: (page: string) => void;
  activeLayer: string;
  setActiveLayer: (layer: string) => void;

  isLoading: boolean;
  message: string;
  setMessage: (msg: string) => void;

  refreshAll: (authToken?: string) => Promise<void>;
  runSimulation: () => Promise<void>;
  syncRealtime: () => Promise<void>;
  toggleDataMode: (mode: 'live' | 'demo') => Promise<void>;
  isSimulating: boolean;
  simulationStep: number;
  simulationStepName: string;
  showSimulationModal: boolean;
  setShowSimulationModal: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('tgx_token') || '');
  const [role, setRole] = useState<'ADMIN' | 'AUTHORITY' | 'VIEWER' | ''>(() => {
    return (localStorage.getItem('tgx_role') as any) || '';
  });
  const [username, setUsername] = useState<string>(() => localStorage.getItem('tgx_user') || 'admin');

  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [roads, setRoads] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  const [satelliteObservations, setSatelliteObservations] = useState<SatelliteObservation[]>([]);
  const [landslides, setLandslides] = useState<LandslideEvent[]>([]);
  const [dataStatus, setDataStatus] = useState<DataHealthStatus | null>(null);
  const [modelPerf, setModelPerf] = useState<ModelPerformanceData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataMode, setDataModeState] = useState<'LIVE' | 'DEMO'>('LIVE');

  const [activePage, setActivePage] = useState<string>('overview');
  const [activeLayer, setActiveLayer] = useState<string>('risk');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Simulation modal & step animation
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationStepName, setSimulationStepName] = useState<string>('');
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);

  const refreshAll = useCallback(async (authToken?: string) => {
    let currentToken = authToken !== undefined ? authToken : token;
    
    // Auto-login fallback if no token
    if (!currentToken) {
      try {
        const autoRes = await api.login('admin', 'Sasikarthi@123').catch(() => api.login('admin', 'admin123'));
        if (autoRes?.access_token) {
          currentToken = autoRes.access_token;
          setToken(autoRes.access_token);
          setRole(autoRes.role);
          setUsername('admin');
          localStorage.setItem('tgx_token', autoRes.access_token);
          localStorage.setItem('tgx_role', autoRes.role);
          localStorage.setItem('tgx_user', 'admin');
        }
      } catch {
        return;
      }
    }

    if (!currentToken) return;

    setIsLoading(true);
    try {
      api.setToken(currentToken);
      let [healthRes, riskRes, alertsRes, statusRes, perfRes, exposureRes, satRes, lsRes] = await Promise.allSettled([
        api.getHealth(),
        api.getRisk(),
        api.getAlerts(),
        api.getDataStatus(),
        api.getModelPerformance(),
        api.getExposure(),
        api.getSatellite(),
        api.getLandslides(),
      ]);

      // Check if 401 token error occurred; if so, re-authenticate and retry
      const hasAuthError = [healthRes, riskRes, alertsRes].some(
        (r) => r.status === 'rejected' && (r.reason?.message?.includes('token') || r.reason?.message?.includes('401') || r.reason?.message?.includes('Unauthorized'))
      );

      if (hasAuthError) {
        try {
          const reAuth = await api.login('admin', 'Sasikarthi@123').catch(() => api.login('admin', 'admin123'));
          if (reAuth?.access_token) {
            setToken(reAuth.access_token);
            setRole(reAuth.role);
            localStorage.setItem('tgx_token', reAuth.access_token);
            localStorage.setItem('tgx_role', reAuth.role);
            api.setToken(reAuth.access_token);
            [healthRes, riskRes, alertsRes, statusRes, perfRes, exposureRes, satRes, lsRes] = await Promise.allSettled([
              api.getHealth(),
              api.getRisk(),
              api.getAlerts(),
              api.getDataStatus(),
              api.getModelPerformance(),
              api.getExposure(),
              api.getSatellite(),
              api.getLandslides(),
            ]);
          }
        } catch (e) {
          console.error('Re-auth failed:', e);
        }
      }

      if (healthRes.status === 'fulfilled') {
        const mode = healthRes.value.data_mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'DEMO';
        setDataModeState(mode);
      }

      if (riskRes.status === 'fulfilled') {
        let loadedZones = riskRes.value.zones || [];
        // If zones is still empty, trigger prediction pipeline to seed
        if (loadedZones.length === 0) {
          try {
            const simRes = await api.runPrediction();
            if (simRes?.zones && simRes.zones.length > 0) {
              loadedZones = simRes.zones;
            }
          } catch (e) {
            console.warn('Auto simulation trigger on empty zones:', e);
          }
        }

        setZones(loadedZones);
        if (loadedZones.length > 0 && loadedZones[0].updated) {
          setLastUpdated(loadedZones[0].updated);
        } else {
          setLastUpdated(new Date().toISOString());
        }
      }

      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value || []);
      }

      if (statusRes.status === 'fulfilled') {
        setDataStatus(statusRes.value);
      }

      if (perfRes.status === 'fulfilled') {
        setModelPerf(perfRes.value);
      }

      if (exposureRes.status === 'fulfilled') {
        const exp = exposureRes.value as ExposureData;
        setRoads(exp.roads?.features || []);
        setVillages(exp.villages?.features || []);
      }

      if (satRes.status === 'fulfilled') {
        setSatelliteObservations(satRes.value.observations || []);
      }

      if (lsRes.status === 'fulfilled') {
        setLandslides(lsRes.value.events || []);
      }
    } catch (err: any) {
      console.error('Error refreshing TerraGuardX state:', err);
      setMessage(`Sync error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshAll(token);
  }, [token, refreshAll]);

  const login = async (u: string, p: string) => {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await api.login(u, p);
      setToken(res.access_token);
      setRole(res.role);
      setUsername(u);
      localStorage.setItem('tgx_token', res.access_token);
      localStorage.setItem('tgx_role', res.role);
      localStorage.setItem('tgx_user', u);
      api.setToken(res.access_token);
      await refreshAll(res.access_token);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setRole('');
    setUsername('');
    localStorage.removeItem('tgx_token');
    localStorage.removeItem('tgx_role');
    localStorage.removeItem('tgx_user');
    api.setToken('');
    setZones([]);
    setAlerts([]);
    setSelectedZone(null);
  };

  const syncRealtime = async () => {
    setIsLoading(true);
    try {
      const res = await api.syncRealtime();
      setMessage(`Real-time sync complete: ${res.records.rainfall} precipitation readings & ${res.records.satellite} Sentinel-1 SAR observations updated.`);
      await refreshAll();
    } catch (err: any) {
      setMessage(`Real-time sync error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDataMode = async (newMode: 'live' | 'demo') => {
    setIsLoading(true);
    try {
      await api.setDataMode(newMode);
      setDataModeState(newMode.toUpperCase() as any);
      setMessage(`Data mode switched to ${newMode.toUpperCase()}`);
      await refreshAll();
    } catch (err: any) {
      setMessage(`Mode switch error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runSimulation = async () => {
    if (role === 'VIEWER') {
      setMessage('Viewer role has read-only access. Cannot trigger pipeline simulation.');
      return;
    }

    setIsSimulating(true);
    setShowSimulationModal(true);
    setSimulationStep(1);
    setSimulationStepName('INGESTING REAL-TIME METEOROLOGICAL & TERRAIN FEEDS');

    const steps = [
      { step: 1, name: 'INGESTING REAL-TIME METEOROLOGICAL & TERRAIN FEEDS' },
      { step: 2, name: 'PROCESSING 72H REAL-TIME PRECIPITATION & ANTECEDENT SATURATION' },
      { step: 3, name: 'ANALYZING SENTINEL-1 InSAR DISPLACEMENT & COHERENCE LOSS' },
      { step: 4, name: 'RUNNING RANDOM FOREST & XGBOOST AI MODELS' },
      { step: 5, name: 'FUSING MULTI-CRITERIA RISK & FACTOR ATTRIBUTIONS' },
      { step: 6, name: 'GENERATING EARLY WARNING DISPATCHES & EXPOSURE IMPACT' },
    ];

    try {
      let stepIdx = 0;
      const interval = setInterval(() => {
        stepIdx++;
        if (stepIdx < steps.length) {
          setSimulationStep(steps[stepIdx].step);
          setSimulationStepName(steps[stepIdx].name);
        }
      }, 450);

      const result = await api.runSimulation();
      clearInterval(interval);

      setSimulationStep(6);
      setSimulationStepName('SIMULATION PIPELINE COMPLETE');
      setMessage(`Simulation Run ${result.run_id} complete: ${result.zones.length} zones computed using ${result.data_mode} dataset.`);
      
      await refreshAll();

      setTimeout(() => {
        setIsSimulating(false);
        setShowSimulationModal(false);
      }, 900);
    } catch (err: any) {
      setIsSimulating(false);
      setShowSimulationModal(false);
      setMessage(`Simulation error: ${err.message}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        role,
        username,
        isAuthenticated: !!token,
        login,
        logout,
        zones,
        alerts,
        selectedZone,
        setSelectedZone,
        roads,
        villages,
        satelliteObservations,
        landslides,
        dataStatus,
        modelPerf,
        lastUpdated,
        dataMode,
        activePage,
        setActivePage,
        activeLayer,
        setActiveLayer,
        isLoading,
        message,
        setMessage,
        refreshAll,
        runSimulation,
        syncRealtime,
        toggleDataMode,
        isSimulating,
        simulationStep,
        simulationStepName,
        showSimulationModal,
        setShowSimulationModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
