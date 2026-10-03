import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  return (
    <main
      className="animate-fade-in"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </main>
  );
};
