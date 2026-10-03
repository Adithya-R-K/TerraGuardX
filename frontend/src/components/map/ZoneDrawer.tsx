import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Zone, HourlyRainfall } from '../../types';
import { colors } from '../../styles/designTokens';
import { RiskGauge } from '../dashboard/RiskGauge';
import { RiskBreakdown } from '../dashboard/RiskBreakdown';
import { AIExplanationCard } from '../dashboard/AIExplanationCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  MapPin,
  CloudRain,
  Mountain,
  Route,
  Activity,
  CheckCircle2,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  Send,
  Loader2,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ZoneDrawerProps {
  zone: Zone | null;
  onClose: () => void;
}

export const ZoneDrawer: React.FC<ZoneDrawerProps> = ({ zone, onClose }) => {
  const { role, setMessage, refreshAll } = useApp();
  const [rainData, setRainData] = useState<HourlyRainfall[]>([]);
  const [loadingRain, setLoadingRain] = useState<boolean>(false);
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string>('');

  useEffect(() => {
    if (!zone) return;
    setLoadingRain(true);
    setFeedbackSuccess('');

    api
      .getRainfall(zone.zone_id)
      .then((res) => {
        if (res && res.hourly) {
          const formatted = res.hourly.slice(-72).map((h) => ({
            t: h.timestamp ? h.timestamp.slice(5, 13) : '',
            mm: h.rain_mm || 0,
          }));
          setRainData(formatted);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch zone rainfall:', err);
      })
      .finally(() => {
        setLoadingRain(false);
      });
  }, [zone]);

  if (!zone) return null;

  const handleFeedback = async (
    eventType: 'CONFIRMED_LANDSLIDE' | 'NO_LANDSLIDE' | 'FALSE_ALARM' | 'UNKNOWN'
  ) => {
    if (!zone) return;
    setSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        zone_id: zone.zone_id,
        prediction_id: zone.prediction_id || null,
        actual_event: eventType,
        latitude: zone.lat,
        longitude: zone.lon,
        event_date: new Date().toISOString().slice(0, 10),
      });
      setFeedbackSuccess(`Field feedback [${eventType}] stored for retraining`);
      setMessage(`Authority feedback submitted for ${zone.name}`);
      await refreshAll();
    } catch (err: any) {
      setMessage(`Feedback error: ${err.message}`);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div
      className="card-elevated animate-drawer"
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        bottom: '12px',
        width: '420px',
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.bg.cardElevated,
        border: `1px solid ${colors.bg.borderLight}`,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(3, 8, 16, 0.9)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${colors.bg.border}`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(11, 23, 40, 0.6)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: colors.brand.secondary,
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {zone.zone_id}
            </span>
            <span style={{ fontSize: '11.5px', color: colors.text.secondary }}>
              {zone.district}, {zone.state}
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {zone.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(16, 31, 51, 0.8)',
            border: `1px solid ${colors.bg.border}`,
            color: colors.text.secondary,
            padding: '6px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Risk Gauge & Level Overview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(11, 23, 40, 0.5)',
            border: `1px solid ${colors.bg.borderSubtle}`,
            borderRadius: '10px',
            padding: '16px 12px',
          }}
        >
          <RiskGauge score={zone.risk_score} level={zone.risk_level} size={110} strokeWidth={8} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CURRENT RISK CLASSIFICATION
              </div>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge level={zone.risk_level} score={zone.risk_score} size="lg" />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Coordinates:
              <div className="font-mono" style={{ color: colors.text.primary, fontSize: '11.5px', marginTop: '2px' }}>
                {zone.lat.toFixed(4)}°N, {zone.lon.toFixed(4)}°E
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Criteria Composition Breakdown */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.4)',
            border: `1px solid ${colors.bg.borderSubtle}`,
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            Risk Fusion Breakdown
          </div>
          <RiskBreakdown
            staticScore={zone.static_susceptibility}
            dynamicScore={zone.dynamic_trigger}
            sarScore={zone.sar_signal}
            sarMode={zone.sar_mode}
          />
        </div>

        {/* AI Explainability */}
        <AIExplanationCard
          factors={zone.top_factors}
          zoneName={zone.name}
          confidence={zone.model_confidence}
        />

        {/* Geotechnical & Meteorological Telemetry Table */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.4)',
            border: `1px solid ${colors.bg.borderSubtle}`,
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            Geotechnical & Sensor Metrics
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              {[
                ['24h Rainfall Accumulation', `${zone.rainfall_24h} mm`, CloudRain],
                ['72h Rainfall Total', `${zone.rainfall_72h} mm`, CloudRain],
                ['Terrain Slope Gradient', `${zone.slope}°`, Mountain],
                ['Elevation Above Sea Level', `${zone.elevation} m`, Mountain],
                ['Distance to Nearest Road', `${zone.nearest_road_km} km`, Route],
                ['Data Stream Mode', `${zone.data_mode} (Synthetic)`, Database],
                ['Model Confidence Index', `${((zone.model_confidence || 0.88) * 100).toFixed(0)}%`, Activity],
                ['Input Data Completeness', `${((zone.data_completeness || 1) * 100).toFixed(0)}%`, Layers],
              ].map(([k, v, Icon]: any) => (
                <tr key={k} style={{ borderBottom: '1px solid rgba(35, 58, 85, 0.4)' }}>
                  <td style={{ padding: '7px 0', color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={13} style={{ color: colors.brand.secondary }} />
                    {k}
                  </td>
                  <td className="font-mono" style={{ padding: '7px 0', textAlign: 'right', fontWeight: 600, color: '#FFFFFF' }}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 72h Rainfall Sparkline Chart */}
        <div
          style={{
            backgroundColor: 'rgba(11, 23, 40, 0.4)',
            border: `1px solid ${colors.bg.borderSubtle}`,
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: '#FFFFFF', textTransform: 'uppercase' }}>
              72h Hourly Precipitation
            </span>
            <span style={{ fontSize: '10.5px', color: colors.brand.secondary, fontFamily: 'var(--font-mono)' }}>
              NASA GPM IMERG (DEMO)
            </span>
          </div>

          {loadingRain ? (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={20} className="radar-sweep" style={{ color: colors.brand.primary }} />
            </div>
          ) : rainData.length > 0 ? (
            <div style={{ width: '100%', height: '110px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rainData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="t" stroke="#52657A" fontSize={9} tickLine={false} />
                  <YAxis stroke="#52657A" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101F33',
                      border: '1px solid #233A55',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mm"
                    name="Rainfall (mm)"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: colors.text.muted, textAlign: 'center', padding: '16px' }}>
              No precipitation records available for this station.
            </div>
          )}
        </div>

        {/* Field Feedback Actions (Authority & Admin) */}
        {role !== 'VIEWER' && (
          <div
            style={{
              backgroundColor: 'rgba(11, 23, 40, 0.6)',
              border: `1px solid ${colors.bg.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: '#FFFFFF', textTransform: 'uppercase' }}>
                Field Authority Feedback
              </span>
              <span style={{ fontSize: '10.5px', color: colors.status.warning }}>Active Retraining</span>
            </div>

            <p style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '10px' }}>
              Verify ground truth for this sector to update training datasets and adjust model weights:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                className="btn-danger"
                disabled={submittingFeedback}
                style={{ fontSize: '11px', padding: '6px 8px' }}
                onClick={() => handleFeedback('CONFIRMED_LANDSLIDE')}
              >
                Confirmed Landslide
              </button>

              <button
                className="btn-secondary"
                disabled={submittingFeedback}
                style={{ fontSize: '11px', padding: '6px 8px', color: colors.risk.LOW, borderColor: 'rgba(34, 197, 94, 0.4)' }}
                onClick={() => handleFeedback('NO_LANDSLIDE')}
              >
                No Landslide (Stable)
              </button>

              <button
                className="btn-secondary"
                disabled={submittingFeedback}
                style={{ fontSize: '11px', padding: '6px 8px', color: colors.risk.MEDIUM, borderColor: 'rgba(234, 179, 8, 0.4)' }}
                onClick={() => handleFeedback('FALSE_ALARM')}
              >
                False Alarm
              </button>

              <button
                className="btn-secondary"
                disabled={submittingFeedback}
                style={{ fontSize: '11px', padding: '6px 8px' }}
                onClick={() => handleFeedback('UNKNOWN')}
              >
                Inconclusive / Unknown
              </button>
            </div>

            {feedbackSuccess && (
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '11px',
                  color: colors.status.online,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} />
                <span>{feedbackSuccess}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
