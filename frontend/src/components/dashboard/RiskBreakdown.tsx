import React from 'react';
import { colors } from '../../styles/designTokens';

interface RiskBreakdownProps {
  staticScore: number;
  dynamicScore: number;
  sarScore: number;
  sarMode?: string;
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({
  staticScore = 0,
  dynamicScore = 0,
  sarScore = 0,
  sarMode = 'DEMO',
}) => {
  const items = [
    {
      label: 'Static Susceptibility (Terrain/Lithology)',
      weight: '45%',
      value: staticScore,
      color: '#38BDF8',
      desc: 'Topography, slope, curvature, geology & historical density',
    },
    {
      label: 'Dynamic Trigger (Rainfall Dynamics)',
      weight: '40%',
      value: dynamicScore,
      color: '#60A5FA',
      desc: '24h/72h precipitation & antecedent moisture trigger',
    },
    {
      label: `SAR Deformation (${sarMode || 'DEMO'})`,
      weight: '15%',
      value: sarScore,
      color: '#F472B6',
      desc: 'Sentinel-1 InSAR millimeter surface displacement & coherence',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {items.map((item) => {
        const clampedVal = Math.max(0, Math.min(100, item.value || 0));
        return (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.primary }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: colors.text.muted,
                    backgroundColor: 'rgba(28, 47, 69, 0.4)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  w: {item.weight}
                </span>
              </div>
              <span
                className="font-mono"
                style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}
              >
                {clampedVal.toFixed(1)}
                <span style={{ fontSize: '10px', color: colors.text.muted, marginLeft: '2px' }}>/100</span>
              </span>
            </div>

            {/* Horizontal Bar */}
            <div
              style={{
                height: '7px',
                width: '100%',
                backgroundColor: 'rgba(11, 23, 40, 0.6)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${clampedVal}%`,
                  backgroundColor: item.color,
                  borderRadius: '3px',
                  boxShadow: `0 0 8px ${item.color}66`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: colors.text.muted }}>{item.desc}</div>
          </div>
        );
      })}
    </div>
  );
};
