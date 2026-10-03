import React from 'react';
import { useApp } from '../context/AppContext';
import { colors } from '../styles/designTokens';
import { Route, Users, AlertTriangle, ShieldCheck, MapPin, Building2, Truck } from 'lucide-react';
import { RiskMap } from '../components/map/RiskMap';

export const ExposurePage: React.FC = () => {
  const { roads, villages, zones, setSelectedZone } = useApp();

  const totalVillages = villages.length || 32;
  const totalRoadFeatures = roads.length || 18;

  // Find zones with highest vulnerability (high risk + high road/village proximity)
  const vulnerableZones = [...zones]
    .filter((z) => z.risk_level === 'CRITICAL' || z.risk_level === 'HIGH')
    .sort((a, b) => (a.nearest_road_km || 0) - (b.nearest_road_km || 0));

  const totalEstPopulation = villages.reduce(
    (acc, v) => acc + (v.properties?.population || 1200),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Exposure KPI Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.brand.primary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Exposed Road Network
            </span>
            <Route size={16} style={{ color: colors.brand.primary }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {totalRoadFeatures} Corridors
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            High-relief state highways & arterial links
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.brand.secondary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Vulnerable Settlements
            </span>
            <Building2 size={16} style={{ color: colors.brand.secondary }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {totalVillages} Habitations
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Located within &lt;2.5 km slope buffer zones
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.risk.CRITICAL}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Estimated Population
            </span>
            <Users size={16} style={{ color: colors.risk.CRITICAL }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            ~{totalEstPopulation.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Estimated census population in threat envelope
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.status.warning}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Critical Proximity Sectors
            </span>
            <AlertTriangle size={16} style={{ color: colors.status.warning }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {vulnerableZones.length} Sectors
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Directly threatening transport connectivity
          </div>
        </div>
      </div>

      {/* Main Grid: Exposure Map & Asset Intersections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
          gap: '16px',
        }}
      >
        {/* Left: GIS Map */}
        <div style={{ height: '560px' }}>
          <RiskMap height="100%" />
        </div>

        {/* Right: Critical Road Intersections & Settlement Risk */}
        <div
          className="card-base"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '560px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: `1px solid ${colors.bg.border}`,
              backgroundColor: 'rgba(11, 23, 40, 0.5)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              HIGH PRIORITY ASSET EXPOSURE
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
              Sectors with elevated risk intersecting key transport corridors
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vulnerableZones.map((zone) => (
              <div
                key={zone.zone_id}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(11, 23, 40, 0.6)',
                  border: `1px solid ${zone.risk_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.35)' : colors.bg.borderSubtle}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="font-mono" style={{ fontSize: '10px', color: colors.brand.secondary, fontWeight: 700 }}>
                      {zone.zone_id}
                    </span>
                    <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{zone.name}</strong>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: zone.risk_level === 'CRITICAL' ? colors.risk.CRITICAL : colors.risk.HIGH,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Risk: {zone.risk_score}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: colors.text.secondary }}>
                  <div>
                    Road Proximity:{' '}
                    <strong className="font-mono" style={{ color: '#FFFFFF' }}>
                      {zone.nearest_road_km} km
                    </strong>
                  </div>
                  <div>
                    24h Rainfall:{' '}
                    <strong className="font-mono" style={{ color: '#FFFFFF' }}>
                      {zone.rainfall_24h} mm
                    </strong>
                  </div>
                </div>

                <div style={{ fontSize: '10.5px', color: colors.text.muted }}>
                  Primary Trigger: {zone.top_factors?.[0] || 'Combined morphological slope instability'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
