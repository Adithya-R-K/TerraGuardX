import React from 'react';
import { colors } from '../../styles/designTokens';
import { SatelliteObservation } from '../../types';
import { Satellite, Radio, Activity, Trees } from 'lucide-react';

interface SARCardProps {
  observation: SatelliteObservation;
  zoneName?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const SARCard: React.FC<SARCardProps> = ({
  observation,
  zoneName,
  onClick,
  isSelected = false,
}) => {
  const deformation = observation.deformation_mm || 0;
  const coherence = observation.coherence || 0;
  const ndviChange = observation.ndvi_change || 0;

  // Severity color for deformation (e.g. >10mm is significant)
  const isHighDeform = Math.abs(deformation) > 8;
  const deformColor = isHighDeform ? colors.risk.CRITICAL : Math.abs(deformation) > 4 ? colors.risk.HIGH : colors.risk.LOW;

  return (
    <div
      className="card-base"
      onClick={onClick}
      style={{
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : undefined,
        borderColor: isSelected ? colors.brand.primary : undefined,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: colors.brand.secondary,
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {observation.zone_id}
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFFFF' }}>
            {zoneName || observation.name || `Sector ${observation.zone_id}`}
          </span>
        </div>

        <span
          className="font-mono"
          style={{ fontSize: '10.5px', color: colors.text.muted }}
        >
          {observation.acquisition_date}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {/* Deformation */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '10px', color: colors.text.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={11} style={{ color: deformColor }} />
            <span>DISPLACEMENT</span>
          </div>
          <div
            className="font-mono"
            style={{ fontSize: '14px', fontWeight: 700, color: deformColor, marginTop: '2px' }}
          >
            {deformation > 0 ? `+${deformation.toFixed(1)}` : deformation.toFixed(1)} mm
          </div>
        </div>

        {/* Coherence */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '10px', color: colors.text.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={11} style={{ color: '#38BDF8' }} />
            <span>COHERENCE</span>
          </div>
          <div
            className="font-mono"
            style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}
          >
            {(coherence * 100).toFixed(0)}%
          </div>
        </div>

        {/* NDVI Change */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '10px', color: colors.text.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trees size={11} style={{ color: '#22C55E' }} />
            <span>Δ NDVI</span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: ndviChange < -0.05 ? colors.risk.HIGH : '#FFFFFF',
              marginTop: '2px',
            }}
          >
            {ndviChange.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
