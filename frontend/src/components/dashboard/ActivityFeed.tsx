import React from 'react';
import { useApp } from '../../context/AppContext';
import { BellRing, ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { colors } from '../../styles/designTokens';
import { StatusBadge } from '../common/StatusBadge';

export const ActivityFeed: React.FC = () => {
  const { alerts, setSelectedZone, zones, setActivePage } = useApp();

  const handleAlertClick = (zoneId: string) => {
    const target = zones.find((z) => z.zone_id === zoneId);
    if (target) {
      setSelectedZone(target);
    }
  };

  return (
    <div className="card-base" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: `1px solid ${colors.bg.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={16} style={{ color: colors.status.warning }} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            INCIDENT STREAM
          </span>
        </div>
        <button
          className="btn-secondary"
          style={{ fontSize: '11px', padding: '3px 8px' }}
          onClick={() => setActivePage('alerts')}
        >
          View All ({alerts.length})
        </button>
      </div>

      {alerts.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.muted,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <CheckCircle size={24} style={{ color: colors.status.online, marginBottom: '8px' }} />
          <span style={{ fontSize: '12px', color: colors.text.secondary }}>All sectors nominal</span>
          <span style={{ fontSize: '11px', color: colors.text.muted }}>No active warning triggers</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            maxHeight: '320px',
          }}
        >
          {alerts.slice(0, 6).map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert.zone_id)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(11, 23, 40, 0.5)',
                border: `1px solid ${alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.35)' : colors.bg.borderSubtle}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(23, 44, 70, 0.4)';
                e.currentTarget.style.borderColor = colors.brand.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(11, 23, 40, 0.5)';
                e.currentTarget.style.borderColor =
                  alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.35)' : colors.bg.borderSubtle;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#FFFFFF' }}>
                  Zone {alert.zone_id}
                </span>
                <StatusBadge level={alert.severity} score={alert.score} size="sm" />
              </div>
              <div style={{ fontSize: '11.5px', color: colors.text.secondary, lineHeight: 1.3 }}>
                Trigger: <span style={{ color: colors.text.primary }}>{alert.trigger}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '6px',
                  fontSize: '10.5px',
                  color: colors.text.muted,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>Status: {alert.status}</span>
                <span>{alert.created_at ? alert.created_at.slice(11, 16) + ' UTC' : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
