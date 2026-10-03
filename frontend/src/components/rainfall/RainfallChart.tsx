import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { colors } from '../../styles/designTokens';
import { CloudRain, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

interface RainfallChartProps {
  hourlyData: { timestamp?: string; t?: string; rain_mm?: number; mm?: number; cumulative?: number }[];
  threshold?: number;
  zoneName?: string;
}

export const RainfallChart: React.FC<RainfallChartProps> = ({
  hourlyData,
  threshold = 35,
  zoneName = 'Monitored Region',
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'cumulative'>('area');

  // Compute cumulative series
  let runningTotal = 0;
  const processedData = hourlyData.map((d, i) => {
    const val = d.rain_mm !== undefined ? d.rain_mm : (d.mm || 0);
    runningTotal += val;
    return {
      time: d.t || (d.timestamp ? d.timestamp.slice(5, 13) : `H${i}`),
      rain: Number(val.toFixed(1)),
      cumulative: Number(runningTotal.toFixed(1)),
    };
  });

  const maxVal = Math.max(0, ...processedData.map((d) => (chartType === 'cumulative' ? d.cumulative : d.rain)));

  return (
    <div className="card-base" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudRain size={16} style={{ color: colors.brand.secondary }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
              PRECIPITATION TIMELINE & INTENSITY
            </span>
          </div>
          <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
            Sensor records for <strong>{zoneName}</strong> (NASA GPM IMERG / IMD calibrated)
          </div>
        </div>

        {/* Chart View Toggles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(11, 23, 40, 0.6)',
            borderRadius: '6px',
            padding: '3px',
            border: `1px solid ${colors.bg.border}`,
            gap: '3px',
          }}
        >
          <button
            onClick={() => setChartType('area')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              backgroundColor: chartType === 'area' ? colors.brand.primary : 'transparent',
              color: chartType === 'area' ? '#FFFFFF' : colors.text.secondary,
              fontWeight: 500,
            }}
          >
            <TrendingUp size={12} />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setChartType('bar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              backgroundColor: chartType === 'bar' ? colors.brand.primary : 'transparent',
              color: chartType === 'bar' ? '#FFFFFF' : colors.text.secondary,
              fontWeight: 500,
            }}
          >
            <BarChart3 size={12} />
            <span>Hourly Bars</span>
          </button>

          <button
            onClick={() => setChartType('cumulative')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              backgroundColor: chartType === 'cumulative' ? colors.brand.primary : 'transparent',
              color: chartType === 'cumulative' ? '#FFFFFF' : colors.text.secondary,
              fontWeight: 500,
            }}
          >
            <TrendingUp size={12} />
            <span>Cumulative</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={processedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2F45" vertical={false} />
              <XAxis dataKey="time" stroke="#52657A" fontSize={10} tickLine={false} />
              <YAxis stroke="#52657A" fontSize={10} tickLine={false} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101F33',
                  border: '1px solid #233A55',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Warning Threshold', fill: '#EF4444', fontSize: 10 }} />
              <Bar dataKey="rain" name="Precipitation (mm)" fill="#38BDF8" radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="rainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cumAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2F45" vertical={false} />
              <XAxis dataKey="time" stroke="#52657A" fontSize={10} tickLine={false} />
              <YAxis stroke="#52657A" fontSize={10} tickLine={false} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101F33',
                  border: '1px solid #233A55',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              />
              <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Trigger Level', fill: '#EF4444', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey={chartType === 'cumulative' ? 'cumulative' : 'rain'}
                name={chartType === 'cumulative' ? 'Cumulative Total (mm)' : 'Rainfall (mm)'}
                stroke={chartType === 'cumulative' ? '#60A5FA' : '#38BDF8'}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${chartType === 'cumulative' ? 'cumAreaGrad' : 'rainAreaGrad'})`}
              />
            </AreaChart>
          )}
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
          <AlertTriangle size={13} style={{ color: colors.status.warning }} />
          Threshold: <strong>{threshold} mm/24h</strong> triggers dynamic XGBoost landslide risk activation.
        </span>
        <span className="font-mono" style={{ color: colors.text.primary }}>
          Peak in series: <strong>{maxVal.toFixed(1)} mm</strong>
        </span>
      </div>
    </div>
  );
};
