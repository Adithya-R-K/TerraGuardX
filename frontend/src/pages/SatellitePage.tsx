import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SARCard } from '../components/satellite/SARCard';
import { DeformationChart } from '../components/satellite/DeformationChart';
import { DataModeBadge } from '../components/common/DataModeBadge';
import { colors } from '../styles/designTokens';
import {
  Satellite,
  Radio,
  Activity,
  Trees,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const SatellitePage: React.FC = () => {
  const { satelliteObservations, zones, setSelectedZone } = useApp();
  const [search, setSearch] = useState<string>('');
  const [selectedObsZone, setSelectedObsZone] = useState<string | null>(null);

  const enrichedObservations = satelliteObservations.map((obs) => {
    const matchingZone = zones.find((z) => z.zone_id === obs.zone_id);
    return {
      ...obs,
      name: matchingZone ? matchingZone.name : `Sector ${obs.zone_id}`,
      district: matchingZone ? matchingZone.district : '',
      state: matchingZone ? matchingZone.state : '',
    };
  });

  const filtered = enrichedObservations.filter((obs) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      obs.zone_id.toLowerCase().includes(q) ||
      obs.name.toLowerCase().includes(q) ||
      obs.district.toLowerCase().includes(q)
    );
  });

  const maxDeform =
    satelliteObservations.length > 0
      ? Math.max(...satelliteObservations.map((o) => Math.abs(o.deformation_mm)))
      : 14.2;

  const avgCoherence =
    satelliteObservations.length > 0
      ? (satelliteObservations.reduce((acc, o) => acc + (o.coherence || 0), 0) /
          satelliteObservations.length) *
        100
      : 74.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.demo.bg,
          border: `1px solid ${colors.demo.border}`,
          borderRadius: '8px',
          padding: '10px 16px',
          color: colors.demo.text,
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} />
          <span>
            <strong>SENTINEL-1 SAR INTELLIGENCE:</strong> InSAR Line-of-Sight deformation & coherence loss derived from synthetic DEMO radar feeds.
          </span>
        </div>
        <DataModeBadge mode="DEMO" variant="compact" />
      </div>

      {/* Satellite Telemetry Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="card-base" style={{ padding: '16px', borderLeft: '3px solid #F472B6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Max InSAR Creep
            </span>
            <Activity size={16} style={{ color: '#F472B6' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {maxDeform.toFixed(1)} mm
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Peak cumulative surface subsidence
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.brand.secondary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Mean Radar Coherence
            </span>
            <Radio size={16} style={{ color: colors.brand.secondary }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {avgCoherence.toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Phase stability & backscatter correlation
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: '3px solid #22C55E' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              NDVI Vegetation Index
            </span>
            <Trees size={16} style={{ color: '#22C55E' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            Sentinel-2 MSI
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Slope canopy disruption & scar detection
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.brand.primary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Constellation Orbit
            </span>
            <Satellite size={16} style={{ color: colors.brand.primary }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            Track 128 / C-SAR
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Ascending pass · 5.405 GHz (C-band)
          </div>
        </div>
      </div>

      {/* Displacement Bar Chart */}
      <DeformationChart observations={satelliteObservations} />

      {/* Sector Observations Grid */}
      <div className="card-base" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              SECTOR-BY-SECTOR SAR TELEMETRY INVENTORY
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Select a sector to inspect localized phase interferogram metrics
            </div>
          </div>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: colors.text.muted }} />
            <input
              type="text"
              className="tg-input"
              placeholder="Search sector or zone ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '12px', height: '34px' }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
          }}
        >
          {filtered.map((obs) => (
            <SARCard
              key={obs.zone_id}
              observation={obs}
              zoneName={obs.name}
              isSelected={selectedObsZone === obs.zone_id}
              onClick={() => {
                setSelectedObsZone(obs.zone_id);
                const matching = zones.find((z) => z.zone_id === obs.zone_id);
                if (matching) setSelectedZone(matching);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
