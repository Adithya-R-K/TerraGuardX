import React from 'react';
import { colors, RiskLevel } from '../../styles/designTokens';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel | string;
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score = 0,
  level = 'UNKNOWN',
  size = 140,
  strokeWidth = 10,
  showLabels = true,
}) => {
  const normLevel = (level || 'UNKNOWN').toUpperCase() as RiskLevel;
  const riskColor = colors.risk[normLevel] || colors.risk.UNKNOWN;

  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation (270 degrees gauge, open at bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(135deg)', overflow: 'visible' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(35, 58, 85, 0.4)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={riskColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s',
            filter: `drop-shadow(0 0 6px ${riskColor}88)`,
          }}
        />
      </svg>

      {/* Center Values */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: size > 120 ? '30px' : '22px',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {clampedScore.toFixed(0)}
        </div>
        <div style={{ fontSize: '10.5px', color: colors.text.muted, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
          / 100
        </div>
        {showLabels && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: riskColor,
              letterSpacing: '0.05em',
            }}
          >
            {normLevel}
          </div>
        )}
      </div>
    </div>
  );
};
