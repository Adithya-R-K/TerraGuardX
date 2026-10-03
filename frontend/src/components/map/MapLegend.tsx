import React from 'react';
import { colors } from '../../styles/designTokens';

export const MapLegend: React.FC<{ activeLayer: string }> = ({ activeLayer }) => {
  const riskLevels = [
    { label: 'CRITICAL', range: '75–100', color: colors.risk.CRITICAL },
    { label: 'HIGH', range: '50–74', color: colors.risk.HIGH },
    { label: 'MEDIUM', range: '25–49', color: colors.risk.MEDIUM },
    { label: 'LOW', range: '0–24', color: colors.risk.LOW },
  ];

  const layerTitles: Record<string, string> = {
    risk: 'COMPOSITE RISK INDEX',
    rainfall: '24-HOUR RAINFALL (MM)',
    susceptibility: 'STATIC SUSCEPTIBILITY',
    sar: 'SAR DEFORMATION SIGNAL',
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        backgroundColor: 'rgba(11, 23, 40, 0.92)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${colors.bg.border}`,
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: colors.text.secondary,
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        {layerTitles[activeLayer] || 'RISK CLASSIFICATION'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {riskLevels.map((lvl) => (
          <div key={lvl.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: lvl.color,
                boxShadow: `0 0 6px ${lvl.color}88`,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text.primary, width: '65px' }}>
              {lvl.label}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '10.5px', color: colors.text.muted }}
            >
              {lvl.range}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: `1px solid ${colors.bg.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '10px',
          color: colors.text.muted,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '2px', backgroundColor: '#64748B', display: 'inline-block' }} />
          Road
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8', display: 'inline-block' }} />
          Village
        </span>
      </div>
    </div>
  );
};
