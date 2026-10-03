import React from 'react';
import { useApp } from '../context/AppContext';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { RiskMap } from '../components/map/RiskMap';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { RiskBreakdown } from '../components/dashboard/RiskBreakdown';
import { RiskGauge } from '../components/dashboard/RiskGauge';
import { StatusBadge } from '../components/common/StatusBadge';
import { colors } from '../styles/designTokens';
import {
  CloudRain,
  Satellite,
  BrainCircuit,
  Database,
  ArrowRight,
  ShieldAlert,
  Layers,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    zones,
    selectedZone,
    setSelectedZone,
    setActivePage,
    satelliteObservations,
    modelPerf,
    dataStatus,
  } = useApp();

  // Selected or highest risk zone
  const highestRiskZone =
    selectedZone ||
    (zones.length > 0
      ? [...zones].sort((a, b) => b.risk_score - a.risk_score)[0]
      : null);

  const topDeformation =
    satelliteObservations.length > 0
      ? [...satelliteObservations].sort(
          (a, b) => Math.abs(b.deformation_mm) - Math.abs(a.deformation_mm)
        )[0]
      : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* KPI Stats Grid */}
      <KPIGrid />

      {/* Main Command Center Grid: Map (Left/Center) + Zone Focus / Alerts (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '16px',
        }}
      >
        {/* Left: Interactive Live Risk Map */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '520px', height: '560px' }}>
          <RiskMap height="100%" />
        </div>

        {/* Right: Focused Sector Intelligence & Incident Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '560px' }}>
          {/* Quick Zone Focus Card */}
          {highestRiskZone && (
            <div
              className="card-base"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: `3px solid ${colors.risk[highestRiskZone.risk_level] || colors.risk.UNKNOWN}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        color: colors.brand.secondary,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {highestRiskZone.zone_id}
                    </span>
                    <span style={{ fontSize: '11px', color: colors.text.secondary }}>
                      {highestRiskZone.district}, {highestRiskZone.state}
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {highestRiskZone.name}
                  </div>
                </div>

                <StatusBadge level={highestRiskZone.risk_level} score={highestRiskZone.risk_score} size="sm" />
              </div>

              {/* Gauge & Mini stats */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(11, 23, 40, 0.4)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                }}
              >
                <RiskGauge score={highestRiskZone.risk_score} level={highestRiskZone.risk_level} size={84} strokeWidth={7} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                    24h Rain: <strong className="font-mono" style={{ color: '#FFFFFF' }}>{highestRiskZone.rainfall_24h} mm</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                    Slope: <strong className="font-mono" style={{ color: '#FFFFFF' }}>{highestRiskZone.slope}°</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                    Elevation: <strong className="font-mono" style={{ color: '#FFFFFF' }}>{highestRiskZone.elevation} m</strong>
                  </div>
                </div>
              </div>

              <button
                className="btn-secondary"
                onClick={() => setSelectedZone(highestRiskZone)}
                style={{ width: '100%', fontSize: '11.5px', padding: '6px' }}
              >
                Open Full Analysis Drawer →
              </button>
            </div>
          )}

          {/* Incident Stream / Recent Alerts */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Bottom Sub-Systems Telemetry Row (4 Cards: Rainfall, Satellite, AI Models, Data Health) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        {/* 1. Rainfall Quick Card */}
        <div
          className="card-base"
          onClick={() => setActivePage('rainfall')}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.brand.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.bg.border)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={16} style={{ color: colors.brand.secondary }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                Precipitation Stream
              </span>
            </div>
            <ArrowRight size={13} style={{ color: colors.text.muted }} />
          </div>
          <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
            GPM IMERG multi-satellite rainfall accumulation & antecedent triggering index.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: colors.brand.secondary }}>
            <span>Telemetry: Synchronized</span>
            <span className="font-mono">72h Curves →</span>
          </div>
        </div>

        {/* 2. Satellite InSAR Quick Card */}
        <div
          className="card-base"
          onClick={() => setActivePage('satellite')}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.brand.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.bg.border)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Satellite size={16} style={{ color: '#F472B6' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                Sentinel-1 SAR
              </span>
            </div>
            <ArrowRight size={13} style={{ color: colors.text.muted }} />
          </div>
          <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
            Peak surface displacement:{' '}
            <strong className="font-mono" style={{ color: '#FFFFFF' }}>
              {topDeformation ? `${topDeformation.deformation_mm.toFixed(1)} mm` : '-6.4 mm'}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#F472B6' }}>
            <span>InSAR C-Band Orbit</span>
            <span className="font-mono">Displacements →</span>
          </div>
        </div>

        {/* 3. AI Models Quick Card */}
        <div
          className="card-base"
          onClick={() => setActivePage('model')}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.brand.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.bg.border)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={16} style={{ color: '#A855F7' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                AI Model Engine
              </span>
            </div>
            <ArrowRight size={13} style={{ color: colors.text.muted }} />
          </div>
          <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
            Random Forest (Static) + XGBoost (Dynamic Trigger) dual model pipeline.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#A855F7' }}>
            <span>ROC-AUC: {( (modelPerf?.dynamic?.metrics.roc_auc || 0.92) * 100).toFixed(1)}%</span>
            <span className="font-mono">Metrics →</span>
          </div>
        </div>

        {/* 4. Data Health Quick Card */}
        <div
          className="card-base"
          onClick={() => setActivePage('health')}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.brand.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.bg.border)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} style={{ color: colors.status.online }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                Data Stream Health
              </span>
            </div>
            <ArrowRight size={13} style={{ color: colors.text.muted }} />
          </div>
          <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
            6 Geospatial adapters active · 92.4% stream completeness.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: colors.status.online }}>
            <span>Synthetic DEMO</span>
            <span className="font-mono">Health Matrix →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
