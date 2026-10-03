import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BellRing,
  RefreshCw,
  Play,
  Menu,
  CheckCircle2,
  Clock,
  Radio,
  X,
  AlertTriangle,
} from 'lucide-react';
import { colors } from '../../styles/designTokens';
import { StatusBadge } from '../common/StatusBadge';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const {
    activePage,
    lastUpdated,
    role,
    alerts,
    refreshAll,
    runSimulation,
    isSimulating,
    isLoading,
    setSelectedZone,
    setActivePage,
  } = useApp();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);

  const activeAlerts = alerts.filter((a) => !['RESOLVED'].includes(a.status));

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Geospatial Intelligence Command Center',
      subtitle: 'Real-time multi-criteria landslide risk fusion & early warning monitoring',
    },
    map: {
      title: 'Live Risk Map & GIS Intelligence',
      subtitle: 'Spatial distribution of susceptible zones, precipitation, and SAR surface deformation',
    },
    zones: {
      title: 'Zone Analysis & Multi-Criteria Matrix',
      subtitle: 'Granular terrain, geotechnical parameters and model trigger factors per monitored zone',
    },
    exposure: {
      title: 'Vulnerability & Exposure Intelligence',
      subtitle: 'Road corridors, village communities and critical infrastructure impact assessment',
    },
    rainfall: {
      title: 'Precipitation & Antecedent Trigger Monitor',
      subtitle: 'Real-time rainfall accumulation, intensity thresholds and temporal forecast trends',
    },
    satellite: {
      title: 'Sentinel-1 SAR Interferometry & InSAR Intelligence',
      subtitle: 'Microwave ground displacement, coherence loss and temporal deformation velocity',
    },
    terrain: {
      title: 'Digital Elevation Model & Morphometry Analysis',
      subtitle: 'Slope gradient, elevation distribution, aspect orientation and soil geocodes',
    },
    alerts: {
      title: 'Incident & Emergency Alert Dispatch Center',
      subtitle: 'Automated high/critical risk detection and authority SMS broadcast dispatch',
    },
    feedback: {
      title: 'Field Authority Ground-Truth Feedback',
      subtitle: 'Empirical landslide verification, false alarm reporting and active model retraining',
    },
    model: {
      title: 'AI Machine Learning Model Performance & Telemetry',
      subtitle: 'Random Forest static susceptibility and XGBoost dynamic trigger metrics & ROC curves',
    },
    health: {
      title: 'Data Stream Health & Pipeline Completeness',
      subtitle: 'Live adapter telemetry, sensor data completeness and synthetic feed integrity',
    },
    settings: {
      title: 'System Settings & Decision Thresholds',
      subtitle: 'Fusion model weights, API configurations and role access permissions',
    },
  };

  const currentMeta = pageMeta[activePage] || {
    title: 'TerraGuardX Intelligence',
    subtitle: 'AI Landslide Early Warning System',
  };

  const formatTimestamp = (ts: string) => {
    if (!ts) return 'Synchronized';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: colors.bg.secondary,
        borderBottom: `1px solid ${colors.bg.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Left: Mobile Toggle & Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.bg.border}`,
              color: colors.text.secondary,
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h1
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {currentMeta.title}
          </h1>
          <p
            style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginTop: '1px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Telemetry, Actions & Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {/* System Online Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontSize: '11px',
            fontWeight: 700,
            color: colors.status.online,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: colors.status.online,
              boxShadow: `0 0 8px ${colors.status.online}`,
            }}
            className="pulse-dot"
          />
          SYSTEM ONLINE
        </div>

        {/* Last Updated */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: colors.text.secondary,
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'rgba(16, 31, 51, 0.5)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: `1px solid ${colors.bg.borderSubtle}`,
          }}
        >
          <Clock size={12} style={{ color: colors.brand.secondary }} />
          <span style={{ color: colors.text.muted }}>LAST SYNC:</span>
          <span style={{ color: colors.text.primary, fontWeight: 500 }}>
            {formatTimestamp(lastUpdated)}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => refreshAll()}
          disabled={isLoading}
          title="Refresh telemetry and prediction state"
          style={{
            background: 'rgba(16, 31, 51, 0.8)',
            border: `1px solid ${colors.bg.border}`,
            color: colors.text.secondary,
            padding: '7px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.brand.secondary;
            e.currentTarget.style.borderColor = colors.brand.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.secondary;
            e.currentTarget.style.borderColor = colors.bg.border;
          }}
        >
          <RefreshCw size={15} className={isLoading ? 'radar-sweep' : ''} />
        </button>

        {/* Alerts Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            title="Active Incidents & Alerts"
            style={{
              background: activeAlerts.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 31, 51, 0.8)',
              border: activeAlerts.length > 0 ? `1px solid rgba(239, 68, 68, 0.5)` : `1px solid ${colors.bg.border}`,
              color: activeAlerts.length > 0 ? '#EF4444' : colors.text.secondary,
              padding: '7px 9px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
              transition: 'all 0.15s',
            }}
          >
            <BellRing size={15} className={activeAlerts.length > 0 ? 'pulse-dot' : ''} />
            {activeAlerts.length > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: '#EF4444',
                }}
              >
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Popup Menu */}
          {showAlertsDropdown && (
            <div
              className="card-elevated animate-fade-in"
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '340px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '14px',
                zIndex: 100,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                border: `1px solid ${colors.bg.borderLight}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  marginBottom: '10px',
                  borderBottom: `1px solid ${colors.bg.border}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} style={{ color: colors.risk.CRITICAL }} />
                  ACTIVE EARLY WARNINGS ({activeAlerts.length})
                </div>
                <button
                  onClick={() => setShowAlertsDropdown(false)}
                  style={{ background: 'none', border: 'none', color: colors.text.muted, cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              {activeAlerts.length === 0 ? (
                <div style={{ padding: '16px 0', textAlign: 'center', color: colors.text.muted, fontSize: '12px' }}>
                  No active incidents. Risk levels within baseline.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeAlerts.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(11, 23, 40, 0.7)',
                        border: `1px solid ${a.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : colors.bg.borderSubtle}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setActivePage('alerts');
                        setShowAlertsDropdown(false);
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#FFFFFF' }}>
                          Zone {a.zone_id}
                        </span>
                        <StatusBadge level={a.severity} score={a.score} size="sm" />
                      </div>
                      <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                        Trigger: {a.trigger}
                      </div>
                    </div>
                  ))}

                  <button
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '6px', fontSize: '11.5px', padding: '6px' }}
                    onClick={() => {
                      setActivePage('alerts');
                      setShowAlertsDropdown(false);
                    }}
                  >
                    View All Incidents in Alert Center →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Run Simulation Trigger Button (Disabled for VIEWER) */}
        {role !== 'VIEWER' && (
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="btn-primary"
            style={{
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            }}
          >
            <Play size={13} fill="currentColor" />
            <span>{isSimulating ? 'SIMULATING…' : 'RUN SIMULATION'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
