import React from 'react';
import { useApp } from '../context/AppContext';
import { colors } from '../styles/designTokens';
import { Mountain, Compass, Layers, Globe2, Activity, ArrowUpDown } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const TerrainPage: React.FC = () => {
  const { zones, setSelectedZone, setActivePage } = useApp();

  const slopeBins = [
    { range: '0–15° (Gentle)', count: zones.filter((z) => z.slope < 15).length, risk: 'LOW' },
    { range: '15–25° (Moderate)', count: zones.filter((z) => z.slope >= 15 && z.slope < 25).length, risk: 'MEDIUM' },
    { range: '25–35° (Steep)', count: zones.filter((z) => z.slope >= 25 && z.slope < 35).length, risk: 'HIGH' },
    { range: '35°+ (Very Steep)', count: zones.filter((z) => z.slope >= 35).length, risk: 'CRITICAL' },
  ];

  const elevationSorted = [...zones].sort((a, b) => b.elevation - a.elevation);
  const highestElevation = elevationSorted[0]?.elevation || 2150;
  const lowestElevation = elevationSorted[elevationSorted.length - 1]?.elevation || 320;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Morphometry Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.brand.secondary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Elevation Range (DEM)
            </span>
            <Mountain size={16} style={{ color: colors.brand.secondary }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {lowestElevation}m – {highestElevation}m
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            SRTM 1-ArcSecond (30m Resolution)
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: `3px solid ${colors.risk.HIGH}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Critical Slope Sectors
            </span>
            <Activity size={16} style={{ color: colors.risk.HIGH }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {zones.filter((z) => z.slope > 30).length} Sectors
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Slope gradient exceeding 30° critical threshold
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: '3px solid #A855F7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Geological Bedrock Formations
            </span>
            <Layers size={16} style={{ color: '#A855F7' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            6 Lithology Classes
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Shale, Sandstone, Schist, Alluvium, Gneiss
          </div>
        </div>

        <div className="card-base" style={{ padding: '16px', borderLeft: '3px solid #22C55E' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Geomorphometry Grid
            </span>
            <Globe2 size={16} style={{ color: '#22C55E' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {zones.length} Sectors
          </div>
          <div style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
            Northeast Himalayan Regional Grid
          </div>
        </div>
      </div>

      {/* Slope Gradient Distribution Chart */}
      <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
              SLOPE GRADIENT FREQUENCY DISTRIBUTION
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Number of monitored sectors per terrain slope classification tier
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slopeBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2F45" vertical={false} />
              <XAxis dataKey="range" stroke="#52657A" fontSize={11} tickLine={false} />
              <YAxis stroke="#52657A" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101F33',
                  border: '1px solid #233A55',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="count" name="Sectors" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Steepest High-Risk Terrain Sectors */}
      <div className="card-base" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
          TOPOGRAPHICALLY CRITICAL SECTORS (STEEPEST SLOPES)
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tg-table">
            <thead>
              <tr>
                <th>Zone ID</th>
                <th>Sector Name</th>
                <th>District / State</th>
                <th>Slope Gradient</th>
                <th>Elevation</th>
                <th>Road Distance</th>
                <th>Static Susceptibility</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...zones]
                .sort((a, b) => b.slope - a.slope)
                .slice(0, 8)
                .map((z) => (
                  <tr key={z.zone_id}>
                    <td className="font-mono" style={{ color: colors.brand.secondary, fontWeight: 700 }}>
                      {z.zone_id}
                    </td>
                    <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{z.name}</td>
                    <td style={{ color: colors.text.secondary }}>
                      {z.district}, {z.state}
                    </td>
                    <td className="font-mono" style={{ fontWeight: 700, color: z.slope > 35 ? colors.risk.CRITICAL : colors.risk.HIGH }}>
                      {z.slope}°
                    </td>
                    <td className="font-mono" style={{ color: '#FFFFFF' }}>
                      {z.elevation} m
                    </td>
                    <td className="font-mono" style={{ color: colors.text.secondary }}>
                      {z.nearest_road_km} km
                    </td>
                    <td className="font-mono" style={{ color: '#38BDF8' }}>
                      {z.static_susceptibility} / 100
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => {
                          setSelectedZone(z);
                          setActivePage('map');
                        }}
                      >
                        Inspect on Map
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
