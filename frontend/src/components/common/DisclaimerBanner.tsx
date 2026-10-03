import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { colors } from '../../styles/designTokens';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#1E1408',
        borderBottom: `1px solid ${colors.demo.border}`,
        color: colors.demo.text,
        padding: '6px 16px',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        letterSpacing: '0.02em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
        <span>
          <strong>DISASTER INTELLIGENCE PROTOTYPE:</strong> Decision-support system. Predictions require field validation and should not replace official NDMA / SDMA instructions.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ opacity: 0.85, fontFamily: 'var(--font-mono)' }}>
          DATA: <strong>SYNTHETIC (DEMO)</strong>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38BDF8' }}>
          <ShieldCheck size={12} /> NER REGION (INDIA)
        </span>
      </div>
    </div>
  );
};
