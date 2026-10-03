import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'No observations or records found matching current query.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        gap: '10px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: 'rgba(35, 58, 85, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        {icon || <Database size={22} />}
      </div>
      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{title}</div>
      <div style={{ fontSize: '12px', maxWidth: '320px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {description}
      </div>
      {actionText && onAction && (
        <button className="btn-primary" onClick={onAction} style={{ marginTop: '8px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};
