import React from 'react';
import { useApp } from '../../context/AppContext';
import { KPICard } from './KPICard';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  BellRing,
  MapPin,
  BrainCircuit,
} from 'lucide-react';
import { colors } from '../../styles/designTokens';

export const KPIGrid: React.FC = () => {
  const { zones, alerts, modelPerf } = useApp();

  const criticalCount = zones.filter((z) => z.risk_level === 'CRITICAL').length;
  const highCount = zones.filter((z) => z.risk_level === 'HIGH').length;
  const activeAlertsCount = alerts.filter((a) => !['RESOLVED'].includes(a.status)).length;
  const totalMonitored = zones.length;

  const maxRainfall = zones.length > 0 ? Math.max(...zones.map((z) => z.rainfall_24h || 0)) : 0;
  const avgConfidence =
    zones.length > 0
      ? (zones.reduce((acc, z) => acc + (z.model_confidence || 0), 0) / zones.length) * 100
      : modelPerf?.dynamic?.metrics.roc_auc ? modelPerf.dynamic.metrics.roc_auc * 100 : 88.4;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* 1. Critical Zones */}
      <KPICard
        title="Critical Zones"
        value={criticalCount}
        subtitle="Immediate threat level"
        change={criticalCount > 0 ? `▲ ${criticalCount} active` : 'Normal baseline'}
        isPositiveChange={criticalCount === 0}
        accentColor={colors.risk.CRITICAL}
        icon={ShieldAlert}
      />

      {/* 2. High Risk Zones */}
      <KPICard
        title="High Risk Zones"
        value={highCount}
        subtitle="Elevated susceptibility"
        change={highCount > 0 ? `▲ ${highCount} elevated` : 'Stable'}
        isPositiveChange={highCount === 0}
        accentColor={colors.risk.HIGH}
        icon={AlertTriangle}
      />

      {/* 3. 24h Max Rainfall */}
      <KPICard
        title="Max 24h Rainfall"
        value={maxRainfall.toFixed(1)}
        unit="mm"
        subtitle="Peak station accumulation"
        accentColor={colors.brand.secondary}
        icon={CloudRain}
        badgeText={maxRainfall > 50 ? 'THRESHOLD EXCEEDED' : 'NOMINAL'}
      />

      {/* 4. Active Alerts */}
      <KPICard
        title="Active Alerts"
        value={activeAlertsCount}
        subtitle="Pending & sent dispatches"
        change={activeAlertsCount > 0 ? 'Requires attention' : 'All clear'}
        isPositiveChange={activeAlertsCount === 0}
        accentColor={colors.status.warning}
        icon={BellRing}
      />

      {/* 5. Monitored Zones */}
      <KPICard
        title="Monitored Sectors"
        value={totalMonitored || 48}
        subtitle="NER India high-relief grid"
        accentColor={colors.brand.primary}
        icon={MapPin}
        badgeText="100% COVERAGE"
      />

      {/* 6. Model Confidence */}
      <KPICard
        title="Model Confidence"
        value={avgConfidence.toFixed(1)}
        unit="%"
        subtitle="Ensemble fusion heuristic"
        accentColor="#A855F7"
        icon={BrainCircuit}
        badgeText="RF + XGB"
      />
    </div>
  );
};
