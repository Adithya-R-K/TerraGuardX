import React from 'react';
import { colors } from '../../styles/designTokens';
import { CloudRain, Droplets, Zap, ShieldCheck } from 'lucide-react';

interface RainfallStatsProps {
  current?: number;
  total24h?: number;
  total72h?: number;
  total7d?: number;
  intensity?: string;
  antecedentRain?: number;
}

export const RainfallStats: React.FC<RainfallStatsProps> = ({
  current = 4.2,
  total24h = 48.6,
  total72h = 112.4,
  total7d = 186.0,
  intensity = 'MODERATE',
  antecedentRain = 64.0,
}) => {
  const stats = [
    { label: 'Current Rate', value: `${current.toFixed(1)} mm/h`, icon: Droplets, color: '#38BDF8' },
    { label: '24-Hour Total', value: `${total24h.toFixed(1)} mm`, icon: CloudRain, color: '#60A5FA' },
    { label: '72-Hour Accumulation', value: `${total72h.toFixed(1)} mm`, icon: CloudRain, color: '#818CF8' },
    { label: '7-Day Total', value: `${total7d.toFixed(1)} mm`, icon: CloudRain, color: '#A78BFA' },
    { label: 'Intensity Index', value: intensity, icon: Zap, color: colors.status.warning },
    { label: 'Antecedent Moisture', value: `${antecedentRain.toFixed(1)} mm`, icon: ShieldCheck, color: colors.status.online },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '10px',
        width: '100%',
      }}
    >
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div
            key={st.label}
            className="card-base"
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: colors.text.secondary, fontWeight: 500 }}>
                {st.label}
              </span>
              <Icon size={14} style={{ color: st.color }} />
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}
            >
              {st.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
