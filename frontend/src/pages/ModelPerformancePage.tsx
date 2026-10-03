import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ModelMetrics } from '../components/model/ModelMetrics';
import { FeatureImportance } from '../components/model/FeatureImportance';
import { colors } from '../styles/designTokens';
import { BrainCircuit, Cpu, Zap, Layers, RefreshCw, BrainCog } from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const { modelPerf, role, refreshAll } = useApp();
  const [activeTab, setActiveTab] = useState<'static' | 'dynamic'>('dynamic');

  const currentModel = activeTab === 'static' ? modelPerf?.static : modelPerf?.dynamic;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Engine Overview Banner */}
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
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid #A855F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A855F7',
            }}
          >
            <BrainCircuit size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              AI MACHINE LEARNING ENGINE ARCHITECTURE
            </div>
            <div style={{ fontSize: '11.5px', color: colors.text.secondary }}>
              Dual-stage ensemble: Random Forest Susceptibility + XGBoost Dynamic Trigger
            </div>
          </div>
        </div>

        {/* Model Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(11, 23, 40, 0.8)',
            padding: '4px',
            borderRadius: '8px',
            border: `1px solid ${colors.bg.border}`,
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('dynamic')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: activeTab === 'dynamic' ? '#7C3AED' : 'transparent',
              color: activeTab === 'dynamic' ? '#FFFFFF' : colors.text.secondary,
              transition: 'all 0.15s',
            }}
          >
            Dynamic Trigger Model (XGBoost)
          </button>

          <button
            onClick={() => setActiveTab('static')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: activeTab === 'static' ? colors.brand.primary : 'transparent',
              color: activeTab === 'static' ? '#FFFFFF' : colors.text.secondary,
              transition: 'all 0.15s',
            }}
          >
            Static Susceptibility Model (Random Forest)
          </button>
        </div>
      </div>

      {/* Model Performance Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(320px, 1fr)',
          gap: '16px',
        }}
      >
        {/* Left: Metrics & Confusion Matrix */}
        <ModelMetrics
          model={currentModel}
          title={activeTab === 'static' ? 'Static Susceptibility Model' : 'Dynamic Trigger Model'}
          type={activeTab}
        />

        {/* Right: Feature Importance Bar Ranking */}
        <FeatureImportance
          features={currentModel?.feature_importance}
          title={`${activeTab} Model Feature Importance`}
          color={activeTab === 'static' ? colors.brand.secondary : '#A855F7'}
        />
      </div>

      {/* Pipeline Information Callout */}
      <div
        className="card-base"
        style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(11, 23, 40, 0.4)',
          fontSize: '11.5px',
          color: colors.text.secondary,
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: '#FFFFFF' }}>Ensemble Fusion Formula:</strong> Total Risk Index ={' '}
        <code style={{ color: '#38BDF8' }}>0.45 × Static Susceptibility</code> +{' '}
        <code style={{ color: '#60A5FA' }}>0.40 × Dynamic Trigger</code> +{' '}
        <code style={{ color: '#F472B6' }}>0.15 × Sentinel-1 SAR Signal</code>. Missing SAR indicators dynamically redistribute weight to static and dynamic components.
      </div>
    </div>
  );
};
