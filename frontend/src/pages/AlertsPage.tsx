import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTable } from '../components/alerts/AlertTable';
import { colors } from '../styles/designTokens';
import { BellRing, ShieldAlert, CheckCircle2, PhoneCall, Radio, Send, Users } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, role } = useApp();

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH' && a.status !== 'RESOLVED').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = alerts.filter((a) => a.status === 'RESOLVED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Incidents Summary Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.risk.CRITICAL}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Active Critical Incidents
            </span>
            <ShieldAlert size={16} style={{ color: colors.risk.CRITICAL }} />
          </div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Immediate disaster intervention required
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.risk.HIGH}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              High Risk Alerts
            </span>
            <BellRing size={16} style={{ color: colors.risk.HIGH }} />
          </div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {highCount}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Threshold exceeded · Monitor dynamically
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.status.warning}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Acknowledged by Team
            </span>
            <CheckCircle2 size={16} style={{ color: colors.status.warning }} />
          </div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {acknowledgedCount}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Field teams alerted and dispatched
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.status.online}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Resolved Incidents
            </span>
            <CheckCircle2 size={16} style={{ color: colors.status.online }} />
          </div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Stabilized or verified safe
          </div>
        </div>
      </div>

      {/* Emergency Dispatch Broadcast Channel Info */}
      <div
        className="card-base"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'rgba(11, 23, 40, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={20} style={{ color: colors.brand.secondary }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              MULTI-CHANNEL EARLY WARNING BROADCAST GATEWAY
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Automated SMS Dispatch: Mock SMS Provider active (Set TWILIO_* for live SMS delivery)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: colors.status.online,
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}
          >
            MOCK SMS ACTIVE
          </span>
          <span style={{ fontSize: '11px', color: colors.text.muted }}>
            Default Recipient: +91-98765-43210 (SDMA NER)
          </span>
        </div>
      </div>

      {/* Alerts Table */}
      <AlertTable />
    </div>
  );
};
