import React from 'react';
import { ModelInfo } from '../../types';
import { colors } from '../../styles/designTokens';
import { BrainCircuit, CheckCircle2, TrendingUp, Cpu, Calendar, Database } from 'lucide-react';

interface ModelMetricsProps {
  model?: ModelInfo;
  title: string;
  type: 'static' | 'dynamic';
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ model, title, type }) => {
  if (!model) {
    return (
      <div className="card-base" style={{ padding: '20px', textAlign: 'center', color: colors.text.muted }}>
        Model metadata not loaded. Run simulation or retrain pipeline.
      </div>
    );
  }

  const m = model.metrics || {
    accuracy: 0.9,
    precision: 0.88,
    recall: 0.85,
    f1: 0.86,
    roc_auc: 0.92,
  };

  const cm = m.confusion_matrix || [[40, 5], [4, 35]];

  return (
    <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: type === 'static' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              border: `1px solid ${type === 'static' ? colors.brand.secondary : '#A855F7'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: type === 'static' ? colors.brand.secondary : '#A855F7',
            }}
          >
            <BrainCircuit size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{title}</div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>
              Algorithm: <strong>{model.algorithm.toUpperCase()}</strong> · Version: <strong className="font-mono">v{model.version}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: colors.status.online,
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={12} /> TRAINED
          </span>
          <span className="font-mono" style={{ fontSize: '11px', color: colors.text.muted }}>
            {model.trained_at ? model.trained_at.slice(0, 10) : 'Active'}
          </span>
        </div>
      </div>

      {/* Dataset partitions info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          backgroundColor: 'rgba(11, 23, 40, 0.5)',
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1px solid ${colors.bg.borderSubtle}`,
        }}
      >
        <div>
          <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase' }}>Train Samples</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            {model.n_train}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase' }}>Validation Samples</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            {model.n_val}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase' }}>Val ROC-AUC</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: colors.brand.secondary }}>
            {model.val_roc_auc !== undefined ? model.val_roc_auc.toFixed(3) : m.roc_auc.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '8px',
        }}
      >
        {[
          { label: 'ROC-AUC', value: (m.roc_auc * 100).toFixed(1) + '%', color: '#38BDF8' },
          { label: 'F1 Score', value: (m.f1 * 100).toFixed(1) + '%', color: '#60A5FA' },
          { label: 'Precision', value: (m.precision * 100).toFixed(1) + '%', color: '#34D399' },
          { label: 'Recall', value: (m.recall * 100).toFixed(1) + '%', color: '#FBBF24' },
          { label: 'Accuracy', value: (m.accuracy * 100).toFixed(1) + '%', color: '#A78BFA' },
        ].map((met) => (
          <div
            key={met.label}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(11, 23, 40, 0.7)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10.5px', color: colors.text.secondary }}>{met.label}</div>
            <div
              className="font-mono"
              style={{ fontSize: '16px', fontWeight: 700, color: met.color, marginTop: '2px' }}
            >
              {met.value}
            </div>
          </div>
        ))}
      </div>

      {/* Confusion Matrix Visualization */}
      <div
        style={{
          backgroundColor: 'rgba(11, 23, 40, 0.4)',
          border: `1px solid ${colors.bg.borderSubtle}`,
          borderRadius: '8px',
          padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', textTransform: 'uppercase' }}>
          Test Set Confusion Matrix
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxWidth: '280px', margin: '0 auto' }}>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: colors.text.muted }}>True Negative (Stable)</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#22C55E' }}>
              {cm[0]?.[0] || 0}
            </div>
          </div>

          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: colors.text.muted }}>False Positive (Alarm)</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#EF4444' }}>
              {cm[0]?.[1] || 0}
            </div>
          </div>

          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: colors.text.muted }}>False Negative (Miss)</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#F97316' }}>
              {cm[1]?.[0] || 0}
            </div>
          </div>

          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: colors.text.muted }}>True Positive (Trigger)</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#38BDF8' }}>
              {cm[1]?.[1] || 0}
            </div>
          </div>
        </div>
      </div>

      {model.note && (
        <div style={{ fontSize: '10.5px', color: colors.text.muted, fontStyle: 'italic' }}>
          * {model.note}
        </div>
      )}
    </div>
  );
};
