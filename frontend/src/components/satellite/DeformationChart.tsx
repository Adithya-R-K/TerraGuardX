import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { colors } from '../../styles/designTokens';
import { SatelliteObservation } from '../../types';
import { Satellite, Info } from 'lucide-react';

interface DeformationChartProps {
  observations: SatelliteObservation[];
  onSelectZone?: (zoneId: string) => void;
}

export const DeformationChart: React.FC<DeformationChartProps> = ({
  observations,
  onSelectZone,
}) => {
  const chartData = observations.slice(0, 24).map((obs) => ({
    zone_id: obs.zone_id,
    name: obs.name || obs.zone_id,
    deformation: Number(obs.deformation_mm.toFixed(1)),
    coherence: Number((obs.coherence * 100).toFixed(0)),
    ndvi_change: obs.ndvi_change,
  }));

  return (
    <div className="card-base" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Satellite size={16} style={{ color: colors.brand.secondary }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
              SENTINEL-1 InSAR DISPLACEMENT (MM)
            </span>
          </div>
          <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
            Line-of-Sight (LOS) ground movement velocity across monitored sectors
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'rgba(244, 114, 182, 0.12)',
            color: '#F472B6',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(244, 114, 182, 0.3)',
          }}
        >
          ORBIT: ASCENDING / C-BAND
        </div>
      </div>

      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C2F45" vertical={false} />
            <XAxis
              dataKey="zone_id"
              stroke="#52657A"
              fontSize={10}
              tickLine={false}
              angle={-45}
              textAnchor="end"
            />
            <YAxis stroke="#52657A" fontSize={10} tickLine={false} unit=" mm" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#101F33',
                border: '1px solid #233A55',
                borderRadius: '6px',
                fontSize: '11px',
              }}
              formatter={(value: any) => [`${value} mm`, 'Displacement']}
            />
            <ReferenceLine y={0} stroke="#64748B" />
            <ReferenceLine y={8} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '+8mm Critical', fill: '#EF4444', fontSize: 10 }} />
            <ReferenceLine y={-8} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '-8mm Subsidence', fill: '#EF4444', fontSize: 10 }} />
            <Bar dataKey="deformation" name="Displacement (mm)" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => {
                const isCrit = Math.abs(entry.deformation) >= 8;
                const isHigh = Math.abs(entry.deformation) >= 4;
                const color = isCrit ? colors.risk.CRITICAL : isHigh ? colors.risk.HIGH : colors.brand.secondary;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: `1px solid ${colors.bg.borderSubtle}`,
          fontSize: '11px',
          color: colors.text.muted,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Info size={13} style={{ color: colors.brand.secondary }} />
          Deformation &gt; 8mm indicates severe slope creep preceding shear failure.
        </span>
        <span style={{ color: colors.text.secondary }}>
          Temporal Repeat Cycle: <strong>12 Days</strong>
        </span>
      </div>
    </div>
  );
};
