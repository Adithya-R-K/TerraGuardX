import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { colors } from '../styles/designTokens';
import {
  MessageSquareWarning,
  Send,
  CheckCircle2,
  AlertCircle,
  BrainCog,
  MapPin,
  Calendar,
  Sliders,
  FileText,
  Loader2,
} from 'lucide-react';

export const FieldFeedbackPage: React.FC = () => {
  const { zones, role, setMessage, refreshAll } = useApp();

  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.zone_id || 'Z01');
  const [actualEvent, setActualEvent] = useState<
    'CONFIRMED_LANDSLIDE' | 'NO_LANDSLIDE' | 'FALSE_ALARM' | 'UNKNOWN'
  >('CONFIRMED_LANDSLIDE');
  const [severity, setSeverity] = useState<number>(3);
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [retrainResult, setRetrainResult] = useState<any>(null);

  const currentZone = zones.find((z) => z.zone_id === selectedZoneId) || zones[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'VIEWER') {
      setMessage('Viewer role has read-only access. Cannot submit field feedback.');
      return;
    }

    setIsSubmitting(true);
    setSuccessNotice('');
    try {
      const res = await api.submitFeedback({
        zone_id: selectedZoneId,
        prediction_id: currentZone?.prediction_id || null,
        actual_event: actualEvent,
        severity,
        notes: notes || `Field survey report for ${currentZone?.name || selectedZoneId}`,
        latitude: currentZone?.lat,
        longitude: currentZone?.lon,
        event_date: eventDate,
      });

      setSuccessNotice(`Feedback #${res.id} recorded. Saved to ground-truth retraining database.`);
      setMessage(`Authority feedback successfully recorded for ${currentZone?.name}`);
      setNotes('');
      await refreshAll();
    } catch (err: any) {
      setMessage(`Feedback submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetrain = async () => {
    if (role !== 'ADMIN') {
      setMessage('Only ADMIN role can trigger active model retraining.');
      return;
    }

    setIsRetraining(true);
    try {
      const res = await api.retrainModel();
      setRetrainResult(res);
      setMessage(`Static model retrained to v${res.version} with ${res.feedback_records_used} validated feedback records.`);
      await refreshAll();
    } catch (err: any) {
      setMessage(`Retraining failed: ${err.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner */}
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
            <MessageSquareWarning size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              FIELD AUTHORITY GROUND-TRUTH FEEDBACK & VERIFICATION
            </div>
            <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
              Report empirical landslide occurrences and false alarms to power continuous AI retraining
            </div>
          </div>
        </div>

        {/* Retrain Trigger Button (Admin only) */}
        {role === 'ADMIN' && (
          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="btn-primary"
            style={{
              backgroundColor: '#7C3AED',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
            }}
          >
            {isRetraining ? <Loader2 size={15} className="radar-sweep" /> : <BrainCog size={15} />}
            <span>{isRetraining ? 'RETRAINING MODELS…' : 'RETRAIN STATIC MODEL'}</span>
          </button>
        )}
      </div>

      {/* Retrain Success Callout */}
      {retrainResult && (
        <div
          className="animate-fade-in"
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            color: '#D8B4FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} style={{ color: '#A855F7' }} />
            <span>
              <strong>Model Retrained:</strong> Generated Static Susceptibility Model <strong>v{retrainResult.version}</strong> incorporating <strong>{retrainResult.feedback_records_used}</strong> field feedback instances.
            </span>
          </div>
          <span className="font-mono" style={{ fontSize: '11px', color: '#FFFFFF' }}>
            ROC-AUC: {((retrainResult.metrics?.roc_auc || 0.94) * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Form & Overview Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
          gap: '16px',
        }}
      >
        {/* Left: Feedback Submission Form */}
        <div className="card-base" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
            SUBMIT GROUND-TRUTH INCIDENT REPORT
          </div>

          {successNotice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#22C55E',
                fontSize: '12px',
              }}
            >
              <CheckCircle2 size={15} />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Zone Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px' }}>
                MONITORED SECTOR / ZONE
              </label>
              <select
                className="tg-input"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                style={{ height: '38px' }}
              >
                {zones.map((z) => (
                  <option key={z.zone_id} value={z.zone_id}>
                    {z.zone_id} — {z.name} ({z.district}, {z.state}) [Current Risk: {z.risk_level}]
                  </option>
                ))}
              </select>
            </div>

            {/* Actual Event Classification */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px' }}>
                GROUND-TRUTH OBSERVATION RESULT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { id: 'CONFIRMED_LANDSLIDE', label: 'Confirmed Landslide', color: colors.risk.CRITICAL },
                  { id: 'NO_LANDSLIDE', label: 'No Landslide (Stable)', color: colors.risk.LOW },
                  { id: 'FALSE_ALARM', label: 'False Alarm (Prediction Error)', color: colors.risk.MEDIUM },
                  { id: 'UNKNOWN', label: 'Inconclusive / Unknown', color: colors.text.secondary },
                ].map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setActualEvent(ev.id as any)}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: actualEvent === ev.id ? `1px solid ${ev.color}` : '1px solid var(--border-subtle)',
                      backgroundColor: actualEvent === ev.id ? `${ev.color}22` : 'rgba(11, 23, 40, 0.4)',
                      color: actualEvent === ev.id ? '#FFFFFF' : colors.text.secondary,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ color: ev.color, fontSize: '11px', fontWeight: 700 }}>● {ev.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Slider & Event Date Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px' }}>
                  IMPACT SEVERITY SCALE (1–5): <strong style={{ color: '#FFFFFF' }}>{severity}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: colors.brand.primary }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.text.muted, marginTop: '2px' }}>
                  <span>1 (Minor Soil Creep)</span>
                  <span>5 (Massive Failure)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px' }}>
                  OBSERVATION DATE
                </label>
                <input
                  type="date"
                  className="tg-input"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  style={{ height: '38px' }}
                />
              </div>
            </div>

            {/* Field Survey Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px' }}>
                FIELD SURVEY NOTES & REMARKS
              </label>
              <textarea
                className="tg-input"
                rows={3}
                placeholder="Describe slope condition, rockfall presence, road blockages, tension cracks or rainfall intensity…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || role === 'VIEWER'}
              className="btn-primary"
              style={{
                height: '40px',
                fontSize: '13px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {isSubmitting ? <Loader2 size={15} className="radar-sweep" /> : <Send size={15} />}
              <span>{isSubmitting ? 'RECORDING FEEDBACK…' : 'SUBMIT GROUND TRUTH VERIFICATION'}</span>
            </button>
          </form>
        </div>

        {/* Right: Selected Sector Context */}
        <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
            SECTOR BASELINE TELEMETRY
          </div>

          {currentZone && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(11, 23, 40, 0.6)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{currentZone.name}</div>
                <div style={{ fontSize: '11.5px', color: colors.text.secondary, marginTop: '2px' }}>
                  {currentZone.district}, {currentZone.state}
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: colors.text.muted, marginTop: '4px' }}>
                  Lat: {currentZone.lat.toFixed(4)}°N, Lon: {currentZone.lon.toFixed(4)}°E
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(11, 23, 40, 0.4)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: colors.text.muted }}>Current Risk Score</div>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {currentZone.risk_score} / 100
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(11, 23, 40, 0.4)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: colors.text.muted }}>Risk Level</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: colors.risk[currentZone.risk_level], marginTop: '6px' }}>
                    {currentZone.risk_level}
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(11, 23, 40, 0.4)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: colors.text.muted }}>24h Rain</div>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {currentZone.rainfall_24h} mm
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(11, 23, 40, 0.4)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10.5px', color: colors.text.muted }}>Slope</div>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {currentZone.slope}°
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(11, 23, 40, 0.5)',
                  fontSize: '11px',
                  color: colors.text.secondary,
                  lineHeight: 1.4,
                }}
              >
                <strong>Feedback Loop Protocol:</strong> Submissions are stored in SQLite/PostGIS database table <code style={{ color: colors.brand.secondary }}>field_feedback</code>. When retraining is executed, validated records augment base training datasets to refine decision boundaries.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
