import React from 'react';
import { Mountain, CloudRain, Satellite, BrainCircuit, ShieldAlert, BellRing, CheckCircle2, Loader2 } from 'lucide-react';
import { colors } from '../../styles/designTokens';

interface SimulationModalProps {
  isOpen: boolean;
  currentStep: number;
  stepName: string;
}

const steps = [
  { id: 1, title: 'ANALYZING TERRAIN', desc: 'Processing DEM elevation, slope, aspect & ruggedness', icon: Mountain },
  { id: 2, title: 'PROCESSING RAINFALL', desc: 'Computing 24h/72h rainfall, intensity & antecedent trigger', icon: CloudRain },
  { id: 3, title: 'ANALYZING SAR SIGNAL', desc: 'Evaluating Sentinel-1 InSAR deformation & coherence loss', icon: Satellite },
  { id: 4, title: 'RUNNING AI MODELS', desc: 'Inferencing Random Forest Susceptibility & XGBoost Dynamic Trigger', icon: BrainCircuit },
  { id: 5, title: 'FUSING RISK', desc: 'Multi-criteria weighted score fusion & factor attribution', icon: ShieldAlert },
  { id: 6, title: 'GENERATING ALERTS', desc: 'Evaluating warning thresholds and exposure impact', icon: BellRing },
];

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, currentStep }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 8, 16, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        className="card-elevated animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          border: `1px solid ${colors.brand.primary}`,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top scanline bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3B82F6, #38BDF8, #60A5FA)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--brand-secondary)', fontWeight: 700, letterSpacing: '0.1em' }}>
              TERRAGUARDX AI PIPELINE EXECUTION
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              Geospatial Risk Simulation
            </h2>
          </div>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60A5FA',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            STEP {Math.min(currentStep, 6)}/6
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '6px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(Math.min(currentStep, 6) / 6) * 100}%`,
              backgroundColor: '#3B82F6',
              backgroundImage: 'linear-gradient(90deg, #3B82F6, #38BDF8)',
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px #38BDF8',
            }}
          />
        </div>

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            const isUpcoming = currentStep < s.id;

            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: isCurrent
                    ? 'rgba(59, 130, 246, 0.12)'
                    : isCompleted
                    ? 'rgba(11, 23, 40, 0.6)'
                    : 'rgba(11, 23, 40, 0.3)',
                  border: isCurrent
                    ? `1px solid ${colors.brand.primary}`
                    : isCompleted
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s',
                  opacity: isUpcoming ? 0.45 : 1,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCompleted
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isCurrent
                      ? 'rgba(59, 130, 246, 0.25)'
                      : 'rgba(28, 47, 69, 0.4)',
                    color: isCompleted
                      ? '#22C55E'
                      : isCurrent
                      ? '#38BDF8'
                      : 'var(--text-muted)',
                  }}
                >
                  <Icon size={16} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: isCurrent ? '#FFFFFF' : isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {s.desc}
                  </div>
                </div>

                <div>
                  {isCompleted && <CheckCircle2 size={18} style={{ color: '#22C55E' }} />}
                  {isCurrent && <Loader2 size={18} className="radar-sweep" style={{ color: '#38BDF8' }} />}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: '20px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Executing live backend feature extraction & risk modeling pipeline…
        </div>
      </div>
    </div>
  );
};
