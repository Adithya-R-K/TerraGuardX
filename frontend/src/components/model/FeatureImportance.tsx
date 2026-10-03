import React from 'react';
import { colors } from '../../styles/designTokens';
import { BarChart3 } from 'lucide-react';

interface FeatureImportanceProps {
  features?: Record<string, number>;
  title?: string;
  color?: string;
}

const FEATURE_NAMES: Record<string, string> = {
  rainfall_24h: '24-Hour Rainfall Accumulation',
  rainfall_72h: '72-Hour Cumulative Rainfall',
  slope: 'Terrain Slope Gradient',
  susceptibility: 'Static Terrain Susceptibility',
  antecedent_rainfall: 'Antecedent Soil Moisture Trigger',
  rainfall_intensity: 'Peak Precipitation Intensity',
  elevation: 'Digital Elevation (DEM)',
  dist_road_km: 'Proximity to Road Infrastructure',
  ls_density: 'Historical Landslide Density',
  ruggedness: 'Terrain Ruggedness Index (TRI)',
  curvature: 'Topographic Profile Curvature',
  aspect: 'Slope Aspect Orientation',
  ndvi: 'Normalized Difference Vegetation (NDVI)',
  soil_code: 'Soil Lithology & Texture Class',
  geology_code: 'Geological Bedrock Formation',
  rainfall_1h: '1-Hour Flash Precipitation',
  rainfall_3h: '3-Hour Rain Pulse',
  rainfall_6h: '6-Hour Storm Inflow',
  rainfall_12h: '12-Hour Storm Accumulation',
  rainfall_48h: '48-Hour Accumulated Volume',
  rainfall_7d: '7-Day Synoptic Total',
};

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  features = {},
  title = 'Global Feature Importance Weights',
  color = colors.brand.secondary,
}) => {
  const entries = Object.entries(features).sort((a, b) => b[1] - a[1]);
  const maxVal = entries.length > 0 ? Math.max(...entries.map((e) => e[1])) : 1;

  return (
    <div className="card-base" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={16} style={{ color: color }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
          {title.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.slice(0, 10).map(([key, val]) => {
          const pct = ((val / maxVal) * 100).toFixed(0);
          const niceName = FEATURE_NAMES[key] || key;

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11.5px', color: colors.text.primary, fontWeight: 500 }}>
                  {niceName}
                </span>
                <span className="font-mono" style={{ fontSize: '11px', color: colors.text.muted }}>
                  {val.toFixed(3)} ({(val * 100).toFixed(1)}%)
                </span>
              </div>

              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: 'rgba(11, 23, 40, 0.6)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: color,
                    borderRadius: '3px',
                    boxShadow: `0 0 6px ${color}66`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
