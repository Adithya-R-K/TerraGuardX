import React from 'react';
import { Layers, Maximize2, Minimize2, RotateCcw, Eye, ShieldAlert, CloudRain, Mountain, Satellite } from 'lucide-react';
import { colors } from '../../styles/designTokens';

interface MapControlsProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  showRoads: boolean;
  onToggleRoads: () => void;
  showVillages: boolean;
  onToggleVillages: () => void;
  showLandslides: boolean;
  onToggleLandslides: () => void;
  onResetView: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  activeLayer,
  onLayerChange,
  showRoads,
  onToggleRoads,
  showVillages,
  onToggleVillages,
  showLandslides,
  onToggleLandslides,
  onResetView,
  isExpanded = false,
  onToggleExpand,
}) => {
  const primaryLayers = [
    { id: 'risk', label: 'Composite Risk', icon: ShieldAlert, color: colors.risk.CRITICAL },
    { id: 'rainfall', label: '24h Rainfall', icon: CloudRain, color: colors.brand.secondary },
    { id: 'susceptibility', label: 'Susceptibility', icon: Mountain, color: '#38BDF8' },
    { id: 'sar', label: 'SAR Deformation', icon: Satellite, color: '#F472B6' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'auto',
      }}
    >
      {/* Primary Layer Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(11, 23, 40, 0.92)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${colors.bg.border}`,
          borderRadius: '8px',
          padding: '4px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
          gap: '4px',
        }}
      >
        <div
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: colors.text.muted,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Layers size={13} />
          <span>LAYER</span>
        </div>

        {primaryLayers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                border: isActive ? `1px solid ${colors.brand.primary}` : '1px solid transparent',
                color: isActive ? '#FFFFFF' : colors.text.secondary,
                fontSize: '11.5px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(23, 44, 70, 0.5)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={13} style={{ color: isActive ? layer.color : colors.text.muted }} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* Vector Feature Overlays & Tools */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(11, 23, 40, 0.92)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${colors.bg.border}`,
          borderRadius: '8px',
          padding: '4px 8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
          width: 'fit-content',
        }}
      >
        <span style={{ fontSize: '10px', color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase' }}>
          OVERLAYS:
        </span>

        {/* Roads toggle */}
        <button
          onClick={onToggleRoads}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            backgroundColor: showRoads ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            border: `1px solid ${showRoads ? colors.brand.primary : 'transparent'}`,
            color: showRoads ? '#FFFFFF' : colors.text.muted,
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '8px', height: '2px', backgroundColor: '#64748B' }} />
          Roads
        </button>

        {/* Villages toggle */}
        <button
          onClick={onToggleVillages}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            backgroundColor: showVillages ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
            border: `1px solid ${showVillages ? colors.brand.secondary : 'transparent'}`,
            color: showVillages ? '#FFFFFF' : colors.text.muted,
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
          Villages
        </button>

        {/* Landslides toggle */}
        <button
          onClick={onToggleLandslides}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            backgroundColor: showLandslides ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            border: `1px solid ${showLandslides ? colors.risk.CRITICAL : 'transparent'}`,
            color: showLandslides ? '#FFFFFF' : colors.text.muted,
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          Landslides
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: colors.bg.border, margin: '0 4px' }} />

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          title="Reset Map Center to NER India"
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.text.secondary,
            padding: '4px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.secondary)}
        >
          <RotateCcw size={14} />
        </button>

        {/* Fullscreen Expand Toggle */}
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse Map' : 'Expand Map Fullscreen'}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.text.secondary,
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.secondary)}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};
