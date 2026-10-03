import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';
import { colors } from '../../styles/designTokens';

interface AIExplanationCardProps {
  factors?: string[];
  zoneName?: string;
  confidence?: number;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  factors = [],
  zoneName = 'Monitored Area',
  confidence,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(11, 23, 40, 0.5)',
        border: `1px solid ${colors.bg.border}`,
        borderRadius: '10px',
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={16} style={{ color: colors.brand.secondary }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            AI EXPLANABILITY & DRIVERS
          </span>
        </div>
        {confidence !== undefined && (
          <span
            style={{
              fontSize: '10.5px',
              fontFamily: 'var(--font-mono)',
              color: colors.brand.secondary,
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            CONFIDENCE: {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '10px' }}>
        Primary environmental and morphological features elevating risk for <strong>{zoneName}</strong>:
      </div>

      {factors.length === 0 ? (
        <div style={{ fontSize: '11px', color: colors.text.muted, fontStyle: 'italic', padding: '6px 0' }}>
          No elevated trigger factors identified for this sector.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {factors.map((factor, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 31, 51, 0.6)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.brand.secondary,
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  padding: '2px 5px',
                  borderRadius: '3px',
                }}
              >
                0{idx + 1}
              </span>
              <span style={{ fontSize: '12px', color: colors.text.primary, fontWeight: 500 }}>
                {factor}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '10px',
          fontSize: '10.5px',
          color: colors.text.muted,
        }}
      >
        <Info size={12} style={{ flexShrink: 0 }} />
        <span>Attributed using XGBoost & Random Forest standardized feature deviation.</span>
      </div>
    </div>
  );
};
