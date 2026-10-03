import React from 'react';
import { colors, RiskLevel } from '../../styles/designTokens';

interface StatusBadgeProps {
  level: RiskLevel | string;
  score?: number;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  level,
  score,
  showDot = true,
  size = 'md',
}) => {
  const normLevel = (level || 'UNKNOWN').toUpperCase() as RiskLevel;
  const color = colors.risk[normLevel] || colors.risk.UNKNOWN;
  const bg = colors.riskBg[normLevel] || colors.riskBg.UNKNOWN;
  const border = colors.riskBorder[normLevel] || colors.riskBorder.UNKNOWN;

  const fontSizes = {
    sm: '11px',
    md: '12px',
    lg: '13px',
  };

  const paddings = {
    sm: '2px 6px',
    md: '3px 8px',
    lg: '5px 12px',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        padding: paddings[size],
        fontSize: fontSizes[size],
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {showDot && (
        <span
          style={{
            width: size === 'sm' ? '5px' : '7px',
            height: size === 'sm' ? '5px' : '7px',
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
          className={normLevel === 'CRITICAL' ? 'pulse-dot' : ''}
        />
      )}
      <span>{normLevel}</span>
      {score !== undefined && (
        <span style={{ opacity: 0.85, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          ({score.toFixed(0)})
        </span>
      )}
    </span>
  );
};
