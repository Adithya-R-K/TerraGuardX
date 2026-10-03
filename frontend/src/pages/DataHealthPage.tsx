import React from 'react';
import { useApp } from '../context/AppContext';
import { DataHealth } from '../components/data/DataHealth';
import { colors } from '../styles/designTokens';
import { Database, ShieldCheck, Cpu, RefreshCw, Layers } from 'lucide-react';

export const DataHealthPage: React.FC = () => {
  const { dataStatus, refreshAll, isLoading } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div
        className="card-base"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'rgba(11, 23, 40, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.secondary,
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              DATA HEALTH & SENSOR INGESTION MATRIX
            </div>
            <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
              Ingestion telemetry, satellite stream integrity and synthetic demo adapter monitors
            </div>
          </div>
        </div>

        <button
          onClick={() => refreshAll()}
          disabled={isLoading}
          className="btn-secondary"
          style={{ height: '36px', fontSize: '12px', padding: '0 12px' }}
        >
          <RefreshCw size={14} className={isLoading ? 'radar-sweep' : ''} />
          <span>Sync Feeds</span>
        </button>
      </div>

      {/* Main Data Health Telemetry */}
      <DataHealth status={dataStatus} />
    </div>
  );
};
