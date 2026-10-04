import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { colors } from '../styles/designTokens';
import {
  Settings2,
  Sliders,
  ShieldAlert,
  Radio,
  UserCheck,
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  CloudRain,
  Satellite,
  Globe2,
  Loader2,
  Zap,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { role, username, dataMode, toggleDataMode, syncRealtime, isLoading } = useApp();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<string>('');

  const isLive = dataMode === 'LIVE';

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess('');
    try {
      await syncRealtime();
      setSyncSuccess('Real-time meteorological & Sentinel-1 SAR telemetry synchronized successfully.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleModeChange = async (newMode: 'live' | 'demo') => {
    try {
      await toggleDataMode(newMode);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Settings Header */}
      <div
        className="card-base"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'rgba(11, 23, 40, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.primary,
            }}
          >
            <Settings2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              SYSTEM CONFIGURATION & DATASET CONNECTOR
            </div>
            <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
              Manage real-time dataset feeds, risk fusion weights, emergency broadcast rules, and role policies
            </div>
          </div>
        </div>

        {/* Live / Demo Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: colors.text.muted }}>CURRENT MODE:</span>
          <span
            style={{
              backgroundColor: isLive ? 'rgba(34, 197, 94, 0.15)' : colors.demo.bg,
              color: isLive ? '#22C55E' : colors.demo.text,
              border: isLive ? '1px solid rgba(34, 197, 94, 0.4)' : `1px solid ${colors.demo.border}`,
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#22C55E' : colors.demo.text,
              }}
              className={isLive ? 'pulse-dot' : ''}
            />
            {dataMode} STREAM
          </span>
        </div>
      </div>

      {/* Real-time Dataset Connection Manager Card */}
      <div
        className="card-elevated animate-fade-in"
        style={{
          padding: '22px 24px',
          border: `1px solid ${isLive ? colors.brand.primary : colors.bg.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(16, 31, 51, 0.85)',
          boxShadow: isLive ? '0 10px 30px rgba(59, 130, 246, 0.15)' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} style={{ color: colors.brand.secondary }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                REAL-TIME DATASET INGESTION & SENSOR FEEDS
              </div>
              <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
                Directly connected to Open-Meteo precipitation, NASA GPM & Copernicus Sentinel-1 InSAR STAC APIs
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mode Switcher Buttons */}
            {role === 'ADMIN' && (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(11, 23, 40, 0.8)',
                  borderRadius: '6px',
                  padding: '3px',
                  border: `1px solid ${colors.bg.border}`,
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleModeChange('live')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isLive ? '#22C55E' : 'transparent',
                    color: isLive ? '#07111F' : colors.text.secondary,
                    transition: 'all 0.15s',
                  }}
                >
                  LIVE DATA
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('demo')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: !isLive ? colors.demo.border : 'transparent',
                    color: !isLive ? colors.demo.text : colors.text.secondary,
                    transition: 'all 0.15s',
                  }}
                >
                  DEMO MODE
                </button>
              </div>
            )}

            {/* Sync Now Button */}
            <button
              onClick={handleSync}
              disabled={isSyncing || isLoading}
              className="btn-primary"
              style={{
                height: '36px',
                padding: '0 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              }}
            >
              {isSyncing ? <Loader2 size={14} className="radar-sweep" /> : <RefreshCw size={14} />}
              <span>{isSyncing ? 'FETCHING LIVE FEEDS…' : 'SYNC REAL-TIME DATASET'}</span>
            </button>
          </div>
        </div>

        {syncSuccess && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#22C55E',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{syncSuccess}</span>
          </div>
        )}

        {/* Live Adapters Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(11, 23, 40, 0.6)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudRain size={14} style={{ color: colors.brand.secondary }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Open-Meteo GPM Rain</span>
              </div>
              <span className="font-mono" style={{ fontSize: '10px', color: '#22C55E', fontWeight: 700 }}>
                ● CONNECTED
              </span>
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              ECMWF IFS / GFS 72h hourly precipitation for all 48 zone coordinates in NER India.
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(11, 23, 40, 0.6)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Satellite size={14} style={{ color: '#F472B6' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Copernicus Sentinel-1</span>
              </div>
              <span className="font-mono" style={{ fontSize: '10px', color: '#22C55E', fontWeight: 700 }}>
                ● STAC ACTIVE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              C-SAR ascending/descending pass orbit tracks, backscatter, & InSAR phase deformation.
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(11, 23, 40, 0.6)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={14} style={{ color: '#38BDF8' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>OpenStreetMap GIS</span>
              </div>
              <span className="font-mono" style={{ fontSize: '10px', color: '#22C55E', fontWeight: 700 }}>
                ● OVERPASS API
              </span>
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              High-relief road transport network, critical infrastructure & village exposure nodes.
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px',
        }}
      >
        {/* 1. Multi-Criteria Risk Weights */}
        <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} style={{ color: colors.brand.secondary }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              RISK FUSION WEIGHTS CONFIGURATION
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: colors.text.primary, fontWeight: 600 }}>Static Susceptibility (W_STATIC)</span>
                <span className="font-mono" style={{ color: colors.brand.secondary, fontWeight: 700 }}>45% (0.45)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', backgroundColor: '#38BDF8' }} />
              </div>
              <div style={{ fontSize: '10.5px', color: colors.text.muted, marginTop: '2px' }}>
                DEM slope, aspect, curvature, bedrock geology & historical density
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: colors.text.primary, fontWeight: 600 }}>Dynamic Trigger (W_DYNAMIC)</span>
                <span className="font-mono" style={{ color: colors.brand.primary, fontWeight: 700 }}>40% (0.40)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', backgroundColor: '#60A5FA' }} />
              </div>
              <div style={{ fontSize: '10.5px', color: colors.text.muted, marginTop: '2px' }}>
                Live GPM 24h/72h rainfall, intensity and antecedent moisture saturation
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: colors.text.primary, fontWeight: 600 }}>Sentinel-1 SAR Signal (W_SAR)</span>
                <span className="font-mono" style={{ color: '#F472B6', fontWeight: 700 }}>15% (0.15)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', backgroundColor: '#F472B6' }} />
              </div>
              <div style={{ fontSize: '10.5px', color: colors.text.muted, marginTop: '2px' }}>
                InSAR line-of-sight surface displacement & phase coherence loss
              </div>
            </div>
          </div>
        </div>

        {/* 2. Risk Classification Thresholds */}
        <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} style={{ color: colors.risk.CRITICAL }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              DECISION RISK THRESHOLDS (0–100 SCALE)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { level: 'CRITICAL', range: '75.0 – 100.0', action: 'Immediate SMS broadcast & evacuation advisory', color: colors.risk.CRITICAL },
              { level: 'HIGH', range: '50.0 – 74.9', action: 'Automated alert generation & field verification', color: colors.risk.HIGH },
              { level: 'MEDIUM', range: '25.0 – 49.9', action: 'Elevated monitoring & sensor sampling', color: colors.risk.MEDIUM },
              { level: 'LOW', range: '0.0 – 24.9', action: 'Baseline nominal monitoring', color: colors.risk.LOW },
            ].map((th) => (
              <div
                key={th.level}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(11, 23, 40, 0.5)',
                  border: `1px solid ${colors.bg.borderSubtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: th.color }}>
                    ● {th.level} RISK
                  </div>
                  <div style={{ fontSize: '10.5px', color: colors.text.muted }}>{th.action}</div>
                </div>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                  {th.range}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Operator Role & Permissions */}
        <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} style={{ color: colors.status.online }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              CURRENT OPERATOR CAPABILITIES
            </span>
          </div>

          <div style={{ backgroundColor: 'rgba(11, 23, 40, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textTransform: 'capitalize' }}>
                  {username || 'Commander'}
                </div>
                <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                  Assigned Role: <strong style={{ color: colors.brand.secondary }}>{role}</strong>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                AUTHENTICATED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: colors.text.secondary }}>
              <div>✓ View GIS Maps & Real-time Predictions: <strong>Enabled</strong></div>
              <div>{role !== 'VIEWER' ? '✓' : '✗'} Run Pipeline Simulations: <strong>{role !== 'VIEWER' ? 'Authorized' : 'Restricted'}</strong></div>
              <div>{role !== 'VIEWER' ? '✓' : '✗'} Submit Ground-Truth Feedback: <strong>{role !== 'VIEWER' ? 'Authorized' : 'Restricted'}</strong></div>
              <div>{role === 'ADMIN' ? '✓' : '✗'} Dispatch SMS Alerts & Model Retraining: <strong>{role === 'ADMIN' ? 'Full Control' : 'Admin Only'}</strong></div>
            </div>
          </div>
        </div>

        {/* 4. Backend System Endpoints */}
        <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={16} style={{ color: colors.brand.primary }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              BACKEND ENGINE & REAL-TIME ADAPTERS
            </span>
          </div>

          <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['API Base', 'http://localhost:8000'],
                ['Real-Time Precipitation', 'Open-Meteo ECMWF / NASA GPM'],
                ['Satellite Telemetry', 'Copernicus Sentinel-1 InSAR STAC'],
                ['Database', 'SQLite (terraguardx.db) / PostGIS'],
                ['Auth Framework', 'JWT Bearer (HS256)'],
                ['Inference Engine', 'scikit-learn + XGBoost Pipeline'],
                ['SMS Gateway', 'Twilio / MockSMSProvider fallback'],
                ['GIS Engine', 'Leaflet 1.9.4 + GeoJSON Overlays'],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid rgba(35, 58, 85, 0.4)' }}>
                  <td style={{ padding: '7px 0', color: colors.text.secondary }}>{k}</td>
                  <td className="font-mono" style={{ padding: '7px 0', textAlign: 'right', color: '#FFFFFF' }}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
