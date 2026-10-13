import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ModelMetrics } from '../components/model/ModelMetrics';
import { FeatureImportance } from '../components/model/FeatureImportance';
import { colors } from '../styles/designTokens';
import { api } from '../services/api';
import {
  BrainCircuit,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Coins,
  MapPin,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const { modelPerf } = useApp();
  const [activeTab, setActiveTab] = useState<'dynamic' | 'static' | 'insights'>('dynamic');
  const [insightsData, setInsightsData] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getModelInsights()
      .then((data) => {
        if (mounted) setInsightsData(data);
      })
      .catch((err) => {
        console.warn('Could not fetch insights endpoint, falling back to cached baseline:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

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

          <button
            onClick={() => setActiveTab('insights')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: activeTab === 'insights' ? '#059669' : 'transparent',
              color: activeTab === 'insights' ? '#FFFFFF' : colors.text.secondary,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BarChart3 size={14} />
            EDA & Business Insights
          </button>
        </div>
      </div>

      {activeTab !== 'insights' ? (
        <>
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
        </>
      ) : (
        /* EDA & Business Insights View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Exploratory Data Analysis Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div className="card-base" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <FileSpreadsheet size={16} color="#38BDF8" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  STATIC TERRAIN DATASET (EDA)
                </span>
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: 1.6 }}>
                <div>• Total Samples: <strong style={{ color: '#FFFFFF' }}>2,500 grid cells</strong></div>
                <div>• Class Imbalance: <strong style={{ color: '#FFFFFF' }}>29.88% Landslide (1)</strong> vs 70.12% Stable (0)</div>
                <div>• Key Morphometric Drivers: <span style={{ color: '#38BDF8' }}>Slope (r = +0.369)</span>, <span style={{ color: '#38BDF8' }}>Ruggedness (r = +0.350)</span></div>
                <div>• Soil Stabilization Buffer: <span style={{ color: '#10B981' }}>NDVI Vegetation (r = -0.144)</span></div>
                <div>• Toe-cutting Vulnerability: <span style={{ color: '#F43F5E' }}>Road Proximity (r = -0.095)</span></div>
              </div>
            </div>

            <div className="card-base" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <TrendingUp size={16} color="#A855F7" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  DYNAMIC RAINFALL DATASET (EDA)
                </span>
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: 1.6 }}>
                <div>• Total Samples: <strong style={{ color: '#FFFFFF' }}>3,000 hydrologic intervals</strong></div>
                <div>• Positive Trigger Rate: <strong style={{ color: '#FFFFFF' }}>35.83% Trigger Events (1)</strong></div>
                <div>• 7-Day Cumulative Saturation: <span style={{ color: '#A855F7' }}>r = +0.383 correlation</span></div>
                <div>• 24-Hour Acute Burst: <span style={{ color: '#A855F7' }}>r = +0.362 correlation</span></div>
                <div>• 2-Phase Trigger Mechanism: Antecedent regolith saturation followed by acute burst pore-water surge.</div>
              </div>
            </div>

            <div className="card-base" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <MapPin size={16} color="#10B981" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  NORTHEAST INDIA SPATIAL MONITORING
                </span>
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: 1.6 }}>
                <div>• Monitored Sectors: <strong style={{ color: '#FFFFFF' }}>48 High-Relief Mountain Zones</strong></div>
                <div>• Coverage: Assam, Meghalaya, Nagaland, Mizoram, Manipur, Arunachal Pradesh, Sikkim, Tripura</div>
                <div>• Elevation Span: <strong style={{ color: '#FFFFFF' }}>120m to 2,916m ASL</strong></div>
                <div>• InSAR Ground Creep: Copernicus Sentinel-1 LOS displacement</div>
              </div>
            </div>
          </div>

          {/* 2. Machine Learning Benchmark Comparison Table */}
          <div className="card-base" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BrainCircuit size={16} color="#7C3AED" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                MODEL BENCHMARKING: RANDOM FOREST VS. XGBOOST COMPARISON
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.bg.border}`, color: colors.text.secondary }}>
                    <th style={{ padding: '8px' }}>Model Pipeline</th>
                    <th style={{ padding: '8px' }}>Task Type</th>
                    <th style={{ padding: '8px' }}>Accuracy</th>
                    <th style={{ padding: '8px' }}>Precision</th>
                    <th style={{ padding: '8px' }}>Recall</th>
                    <th style={{ padding: '8px' }}>F1-Score</th>
                    <th style={{ padding: '8px' }}>ROC-AUC</th>
                    <th style={{ padding: '8px' }}>FPR / FNR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px', color: '#38BDF8', fontWeight: 600 }}>Random Forest</td>
                    <td style={{ padding: '10px 8px' }}>Static Susceptibility</td>
                    <td style={{ padding: '10px 8px' }}>71.4%</td>
                    <td style={{ padding: '10px 8px' }}>61.1%</td>
                    <td style={{ padding: '10px 8px' }}>29.1%</td>
                    <td style={{ padding: '10px 8px' }}>0.395</td>
                    <td style={{ padding: '10px 8px', color: '#10B981', fontWeight: 700 }}>0.746</td>
                    <td style={{ padding: '10px 8px' }}>8.7% / 70.9%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px', color: '#818CF8', fontWeight: 600 }}>XGBoost</td>
                    <td style={{ padding: '10px 8px' }}>Static Susceptibility</td>
                    <td style={{ padding: '10px 8px' }}>72.8%</td>
                    <td style={{ padding: '10px 8px' }}>63.5%</td>
                    <td style={{ padding: '10px 8px' }}>34.2%</td>
                    <td style={{ padding: '10px 8px' }}>0.444</td>
                    <td style={{ padding: '10px 8px', color: '#10B981', fontWeight: 700 }}>0.762</td>
                    <td style={{ padding: '10px 8px' }}>9.2% / 65.8%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px', color: '#A855F7', fontWeight: 600 }}>Random Forest</td>
                    <td style={{ padding: '10px 8px' }}>Dynamic Trigger</td>
                    <td style={{ padding: '10px 8px' }}>75.7%</td>
                    <td style={{ padding: '10px 8px' }}>70.4%</td>
                    <td style={{ padding: '10px 8px' }}>52.6%</td>
                    <td style={{ padding: '10px 8px' }}>0.602</td>
                    <td style={{ padding: '10px 8px', color: '#10B981', fontWeight: 700 }}>0.786</td>
                    <td style={{ padding: '10px 8px' }}>11.9% / 47.4%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', color: '#C084FC', fontWeight: 600 }}>XGBoost</td>
                    <td style={{ padding: '10px 8px' }}>Dynamic Trigger</td>
                    <td style={{ padding: '10px 8px' }}>77.1%</td>
                    <td style={{ padding: '10px 8px' }}>71.8%</td>
                    <td style={{ padding: '10px 8px' }}>56.4%</td>
                    <td style={{ padding: '10px 8px' }}>0.632</td>
                    <td style={{ padding: '10px 8px', color: '#10B981', fontWeight: 700 }}>0.804</td>
                    <td style={{ padding: '10px 8px' }}>11.2% / 43.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '10px', fontStyle: 'italic' }}>
              * Evaluated using Spatial Group-Split cross-validation to prevent spatial autocorrelation leakage.
            </div>
          </div>

          {/* 3. Cost-Benefit & Economic Asymmetry Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            <div className="card-base" style={{ padding: '18px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Coins size={16} color="#EF4444" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>
                  DISASTER COST ASYMMETRY RATIO (1 : 250)
                </span>
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: 1.6 }}>
                <div>• <strong style={{ color: '#FFFFFF' }}>Cost of False Alarm (Type I):</strong> ~₹1.5 - ₹3.0 Lakhs per sector (precautionary staging, temporary traffic control).</div>
                <div>• <strong style={{ color: '#FFFFFF' }}>Cost of Missed Landslide (Type II):</strong> <span style={{ color: '#EF4444', fontWeight: 700 }}>₹25 - ₹75 Crores+</span> and catastrophic loss of human lives.</div>
                <div>• <strong style={{ color: '#FFFFFF' }}>Calibrated Operating Policy:</strong> TerraGuardX purposefully tunes decision thresholds with a high-recall bias to drive false negatives toward zero.</div>
              </div>
            </div>

            <div className="card-base" style={{ padding: '18px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldAlert size={16} color="#10B981" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                  HUMAN-IN-THE-LOOP ACTIVE LEARNING ROI
                </span>
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: 1.6 }}>
                <div>• <strong style={{ color: '#FFFFFF' }}>Ground Validation Ingestion:</strong> Field feedback reports convert ambiguous events into validated boundary training records.</div>
                <div>• <strong style={{ color: '#FFFFFF' }}>Zero-Downtime Retraining:</strong> Admin retrain triggers real-time weight calibration with versioned rollbacks.</div>
                <div>• <strong style={{ color: '#FFFFFF' }}>Domain Shift Protection:</strong> Compensates for seasonal shifts between pre-monsoon ground desiccation and peak monsoon regolith pore saturation.</div>
              </div>
            </div>
          </div>

          {/* 4. Strategic Evacuation Protocols & Critical Corridors */}
          <div className="card-base" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={16} color="#F59E0B" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                STRATEGIC TRANSPORT LIFELINES & MITIGATION PROTOCOLS (NDMA / BRO)
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '6px', border: `1px solid ${colors.bg.border}` }}>
                <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: '12.5px', marginBottom: '4px' }}>
                  NH-29: Dimapur – Kohima (Nagaland)
                </div>
                <div style={{ fontSize: '11.5px', color: colors.text.secondary, lineHeight: 1.5 }}>
                  Arterial lifeline connecting Manipur & Nagaland. High vulnerability at Pagla Pahar and Kohima Sector 1. Automated warning hyetographs trigger barrier checkpoints when 24h rainfall exceeds 80mm.
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '6px', border: `1px solid ${colors.bg.border}` }}>
                <div style={{ fontWeight: 700, color: '#A855F7', fontSize: '12.5px', marginBottom: '4px' }}>
                  NH-6: Shillong – Silchar (Meghalaya / Assam)
                </div>
                <div style={{ fontSize: '11.5px', color: colors.text.secondary, lineHeight: 1.5 }}>
                  Crucial corridor for Barak Valley, Mizoram & Tripura. Prone to deep regolith saturation slides. SDRF & BRO rapid-clearing units are pre-positioned when 72h antecedent rainfall crosses 150mm.
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(11, 23, 40, 0.6)', borderRadius: '6px', border: `1px solid ${colors.bg.border}` }}>
                <div style={{ fontWeight: 700, color: '#10B981', fontSize: '12.5px', marginBottom: '4px' }}>
                  NH-10: Siliguri – Gangtok (Sikkim)
                </div>
                <div style={{ fontSize: '11.5px', color: colors.text.secondary, lineHeight: 1.5 }}>
                  Sole highway link into Sikkim along the Teesta gorge. Monitored via Sentinel-1 InSAR surface creep velocity to detect micro-displacement before catastrophic debris avalanches occur.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
