import React from 'react';
import { colors } from '../../styles/designTokens';
import { Database, AlertTriangle } from 'lucide-react';

interface DataModeBadgeProps {
  mode?: string;
  variant?: 'compact' | 'full';
}

export const DataModeBadge: React.FC<DataModeBadgeProps> = ({ mode = 'DEMO', variant = 'compact' }) => {
  const isDemo = mode.toUpperCase() === 'DEMO';

  if (!isDemo) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#22C55E',
          borderRadius: '6px',
          padding: '3px 8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            boxShadow: '0 0 6px #22C55E',
          }}
        />
        LIVE MODE
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: colors.demo.bg,
          border: `1px solid ${colors.demo.border}`,
          color: colors.demo.text,
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '12px',
        }}
      >
        <AlertTriangle size={16} style={{ flexShrink: 0, color: colors.demo.text }} />
        <div>
          <span style={{ fontWeight: 700, letterSpacing: '0.05em', marginRight: '6px' }}>
            DEMO MODE
          </span>
          <span style={{ opacity: 0.9 }}>
            Using synthetic data. Not an operational warning.
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: colors.demo.bg,
        border: `1px solid ${colors.demo.border}`,
        color: colors.demo.text,
        borderRadius: '6px',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      <Database size={12} style={{ color: colors.demo.text }} />
      <span>DEMO MODE</span>
    </span>
  );
};
