import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Synchronizing geospatial intelligence…' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: 'var(--text-secondary)',
        gap: '12px',
      }}
    >
      <Loader2 size={28} className="radar-sweep" style={{ color: 'var(--brand-primary)' }} />
      <span style={{ fontSize: '13px', letterSpacing: '0.04em' }}>{message}</span>
    </div>
  );
};
