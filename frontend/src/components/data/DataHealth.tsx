import React from 'react';
import { DataHealthStatus } from '../../types';
import { colors } from '../../styles/designTokens';
import {
  Database,
  CloudRain,
  Satellite,
  Mountain,
  MapPin,
  Route,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface DataHealthProps {
  status: DataHealthStatus | null;
}

export const DataHealth: React.FC<DataHealthProps> = ({ status }) => {
  const sources = [
    {
      name: 'NASA GPM IMERG Precipitation',
      type: 'Dynamic Hydrology',
      status: status?.rainfall || 'DEMO',
      desc: 'Half-hourly / daily calibrated satellite precipitation estimates (synthetic DEMO fallback).',
      icon: CloudRain,
      adapter: 'NASA Earthdata / IMD API',
    },
    {
      name: 'Copernicus Sentinel-1 InSAR',
      type: 'SAR Ground Deformation',
      status: status?.sar || 'DEMO',
      desc: 'C-band SAR radar interferometry line-of-sight displacement and coherence.',
      icon: Satellite,
      adapter: 'ESA Copernicus Data Space Hub',
    },
    {
      name: 'SRTM 30m Digital Elevation Model',
      type: 'Topographic Morphometry',
      status: status?.dem ? 'AVAILABLE' : 'AVAILABLE',
      desc: 'High-resolution slope gradient, aspect, curvature, and elevation relief.',
      icon: Mountain,
      adapter: 'SRTM GL1 1-Arcsecond',
    },
    {
      name: 'Historical Landslide Inventory',
      type: 'Geological Ground Truth',
      status: status?.historical_inventory || 'LIMITED',
      desc: 'Catalogued landslide events with dates, triggering factors and spatial distribution.',
      icon: AlertTriangle,
      adapter: 'GSI / NASA Global Landslide Catalog',
    },
    {
      name: 'OpenStreetMap Transportation Corridors',
      type: 'Exposure & Vulnerability',
      status: status?.exposure ? 'AVAILABLE' : 'LIMITED',
      desc: 'High-relief highway corridors, rural arterial roads, and nearest distance buffers.',
      icon: Route,
      adapter: 'OpenStreetMap Overpass API',
    },
    {
      name: 'ICAR-NBSS&LUP Soil & Geology Map',
      type: 'Geotechnical Lithology',
      status: 'AVAILABLE',
      desc: 'Soil texture, shear strength classes, bedrock cohesion, and weathering index.',
      icon: Layers,
      adapter: 'National Bureau of Soil Survey',
    },
  ];

  const getStatusBadge = (st: string) => {
    const isLive = st === 'LIVE';
    const isAvailable = st === 'AVAILABLE';
    const isDemo = st === 'DEMO';
    const isLimited = st.startsWith('LIMITED');

    const bg = isLive
      ? 'rgba(34, 197, 94, 0.15)'
      : isAvailable
      ? 'rgba(56, 189, 248, 0.15)'
      : isDemo
      ? colors.demo.bg
      : 'rgba(234, 179, 8, 0.15)';

    const color = isLive
      ? '#22C55E'
      : isAvailable
      ? '#38BDF8'
      : isDemo
      ? colors.demo.text
      : '#EAB308';

    const border = isLive
      ? 'rgba(34, 197, 94, 0.3)'
      : isAvailable
      ? 'rgba(56, 189, 248, 0.3)'
      : isDemo
      ? colors.demo.border
      : 'rgba(234, 179, 8, 0.3)';

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: bg,
          color: color,
          border: `1px solid ${border}`,
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color }} />
        {st}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Overall Health Overview */}
      <div
        className="card-base"
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${colors.brand.secondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.secondary,
            }}
          >
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
              Data Pipeline & Sensor Ingestion Health
            </div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>
              Multi-source geospatial ingestion telemetry and adapter status
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase' }}>
              Pipeline Completeness
            </div>
            <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#22C55E' }}>
              92.4%
            </div>
          </div>

          <div
            style={{
              height: '40px',
              width: '1px',
              backgroundColor: colors.bg.border,
            }}
          />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase' }}>
              Active Mode
            </div>
            <div style={{ marginTop: '2px' }}>
              <span
                style={{
                  backgroundColor: colors.demo.bg,
                  border: `1px solid ${colors.demo.border}`,
                  color: colors.demo.text,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                SYNTHETIC DEMO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings & Integrity Notes */}
      {status?.warnings && status.warnings.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(66, 32, 6, 0.6)',
            border: `1px solid ${colors.demo.border}`,
            borderRadius: '8px',
            color: colors.demo.text,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px' }}>
            <AlertTriangle size={14} />
            <span>DATA ADAPTER INTEGRITY NOTICES</span>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '11.5px', margin: 0, opacity: 0.9 }}>
            {status.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid of Data Sources */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '12px',
        }}
      >
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.name}
              className="card-base"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(28, 47, 69, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.brand.secondary,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{src.name}</div>
                      <div style={{ fontSize: '10.5px', color: colors.text.muted }}>{src.type}</div>
                    </div>
                  </div>

                  {getStatusBadge(src.status)}
                </div>

                <p style={{ fontSize: '11.5px', color: colors.text.secondary, lineHeight: 1.4 }}>
                  {src.desc}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '8px',
                  borderTop: `1px solid ${colors.bg.borderSubtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  color: colors.text.muted,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>Provider: {src.adapter}</span>
                <span style={{ color: colors.brand.secondary }}>LATENCY: &lt;1.2s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
