import React from 'react';
import { colors } from '../../styles/designTokens';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  change?: string;
  isPositiveChange?: boolean;
  accentColor?: string;
  icon: React.ElementType;
  badgeText?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  change,
  isPositiveChange,
  accentColor = colors.brand.primary,
  icon: Icon,
  badgeText,
}) => {
  return (
    <div
      className="card-base"
      style={{
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '110px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      {/* Background glow watermark */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '12px', color: colors.text.secondary, fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        {subtitle && (
          <span style={{ fontSize: '11px', color: colors.text.muted }}>
            {subtitle}
          </span>
        )}

        {change && (
          <span
            className="font-mono"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: isPositiveChange ? colors.risk.LOW : colors.risk.CRITICAL,
              backgroundColor: isPositiveChange ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {change}
          </span>
        )}

        {badgeText && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: accentColor,
              backgroundColor: `${accentColor}15`,
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
