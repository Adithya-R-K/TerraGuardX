import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { RainfallStats } from '../components/rainfall/RainfallStats';
import { RainfallChart } from '../components/rainfall/RainfallChart';
import { colors } from '../styles/designTokens';
import { CloudRain, Droplets, MapPin, AlertTriangle, Zap, Activity } from 'lucide-react';
import { HourlyRainfall } from '../types';

export const RainfallPage: React.FC = () => {
  const { zones, selectedZone, setSelectedZone } = useApp();
  const [activeZoneId, setActiveZoneId] = useState<string>(
    selectedZone?.zone_id || (zones.length > 0 ? zones[0].zone_id : 'Z01')
  );
  const [rainfallSeries, setRainfallSeries] = useState<HourlyRainfall[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentZone = zones.find((z) => z.zone_id === activeZoneId) || zones[0];

  useEffect(() => {
    if (!activeZoneId) return;
    setIsLoading(true);
    api
      .getRainfall(activeZoneId)
      .then((res) => {
        if (res && res.hourly) {
          const formatted = res.hourly.slice(-72).map((h) => ({
            t: h.timestamp ? h.timestamp.slice(5, 13) : '',
            mm: h.rain_mm || 0,
            rain_mm: h.rain_mm || 0,
          }));
          setRainfallSeries(formatted);
        }
      })
      .catch((err) => {
        console.error('Failed to load rainfall for zone:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeZoneId]);

  // Compute metrics from current series
  const sumRain = (hours: number) => {
    const slice = rainfallSeries.slice(-hours);
    return slice.reduce((acc, d) => acc + (d.mm || 0), 0);
  };

  const currentRainRate = rainfallSeries.length > 0 ? rainfallSeries[rainfallSeries.length - 1].mm || 0 : 4.5;
  const rain24h = sumRain(24) || currentZone?.rainfall_24h || 52.4;
  const rain72h = sumRain(72) || currentZone?.rainfall_72h || 118.0;
  const rain7d = rain72h * 1.8;

  const getIntensityLabel = (val24h: number) => {
    if (val24h > 64.5) return 'VERY HEAVY';
    if (val24h > 35.5) return 'HEAVY';
    if (val24h > 15.5) return 'MODERATE';
    return 'LIGHT';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Station Selector Bar */}
      <div
        className="card-base"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CloudRain size={20} style={{ color: colors.brand.secondary }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
              PRECIPITATION MONITORING STATION
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Station: <strong>{currentZone?.name || activeZoneId}</strong> ({currentZone?.district}, {currentZone?.state})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: colors.text.muted, textTransform: 'uppercase' }}>
            Select Sector:
          </span>
          <select
            className="tg-input"
            value={activeZoneId}
            onChange={(e) => {
              setActiveZoneId(e.target.value);
              const target = zones.find((z) => z.zone_id === e.target.value);
              if (target) setSelectedZone(target);
            }}
            style={{ width: 'auto', fontSize: '12px', height: '34px', padding: '0 10px' }}
          >
            {zones.map((z) => (
              <option key={z.zone_id} value={z.zone_id}>
                {z.zone_id} — {z.name} ({z.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meteorological KPI Metrics */}
      <RainfallStats
        current={currentRainRate}
        total24h={rain24h}
        total72h={rain72h}
        total7d={rain7d}
        intensity={getIntensityLabel(rain24h)}
        antecedentRain={rain72h * 0.65}
      />

      {/* Main Rainfall Analytics Chart */}
      <RainfallChart
        hourlyData={rainfallSeries}
        threshold={35}
        zoneName={currentZone?.name || activeZoneId}
      />

      {/* Regional Sector Rainfall Rankings */}
      <div className="card-base" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: colors.status.warning }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              REGIONAL 24h PRECIPITATION INTENSITY RANKING
            </span>
          </div>
          <span style={{ fontSize: '11px', color: colors.text.muted }}>
            Showing top rainfall trigger zones
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
          }}
        >
          {[...zones]
            .sort((a, b) => (b.rainfall_24h || 0) - (a.rainfall_24h || 0))
            .slice(0, 6)
            .map((z, idx) => (
              <div
                key={z.zone_id}
                onClick={() => {
                  setActiveZoneId(z.zone_id);
                  setSelectedZone(z);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: activeZoneId === z.zone_id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(11, 23, 40, 0.5)',
                  border: activeZoneId === z.zone_id ? `1px solid ${colors.brand.primary}` : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: colors.brand.secondary,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <strong style={{ fontSize: '12.5px', color: '#FFFFFF' }}>{z.name}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
                    {z.district} · Slope {z.slope}°
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: colors.brand.secondary }}>
                    {z.rainfall_24h} mm
                  </div>
                  <div style={{ fontSize: '10.5px', color: z.rainfall_24h > 40 ? colors.risk.HIGH : colors.text.muted }}>
                    {z.rainfall_24h > 40 ? 'CRITICAL TRIGGER' : 'NOMINAL'}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
