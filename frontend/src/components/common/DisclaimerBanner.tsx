import React from 'react';
import { AlertTriangle, ShieldCheck, Radio } from 'lucide-react';
import { colors } from '../../styles/designTokens';
import { useApp } from '../../context/AppContext';

export const DisclaimerBanner: React.FC = () => {
  const { dataMode } = useApp();
  const isLive = dataMode === 'LIVE';

  return (
    <div
      style={{
        backgroundColor: isLive ? '#061912' : '#1E1408',
        borderBottom: isLive ? '1px solid rgba(34, 197, 94, 0.4)' : `1px solid ${colors.demo.border}`,
        color: isLive ? '#86EFAC' : colors.demo.text,
        padding: '6px 16px',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        letterSpacing: '0.02em',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isLive ? (
          <Radio size={13} className="pulse-dot" style={{ color: '#22C55E', flexShrink: 0 }} />
        ) : (
          <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
        )}
        <span>
          <strong>DISASTER INTELLIGENCE PROTOTYPE:</strong> Decision-support system. Predictions require field validation and should not replace official NDMA / SDMA instructions.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ opacity: 0.9, fontFamily: 'var(--font-mono)' }}>
          DATA STREAM:{' '}
          <strong style={{ color: isLive ? '#4ADE80' : colors.demo.text }}>
            {isLive ? 'LIVE (Open-Meteo & Sentinel-1 SAR)' : 'SYNTHETIC (DEMO)'}
          </strong>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38BDF8' }}>
          <ShieldCheck size={12} /> NER REGION (INDIA)
        </span>
      </div>
    </div>
  );
};
