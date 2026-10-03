import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { colors, RiskLevel } from '../../styles/designTokens';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { ZoneDrawer } from './ZoneDrawer';
import { StatusBadge } from '../common/StatusBadge';
import { Zone } from '../../types';

// Helper component to programmatic control map view
const MapController: React.FC<{ center: [number, number]; zoom: number; resetKey: number }> = ({
  center,
  zoom,
  resetKey,
}) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [resetKey, map, center, zoom]);
  return null;
};

interface RiskMapProps {
  height?: string | number;
  showControls?: boolean;
}

export const RiskMap: React.FC<RiskMapProps> = ({ height = '100%', showControls = true }) => {
  const {
    zones,
    roads,
    villages,
    landslides,
    selectedZone,
    setSelectedZone,
    activeLayer,
    setActiveLayer,
  } = useApp();

  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showVillages, setShowVillages] = useState<boolean>(false);
  const [showLandslides, setShowLandslides] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const defaultCenter: [number, number] = [25.8, 92.5];
  const defaultZoom = 6;

  const handleResetView = () => {
    setResetKey((prev) => prev + 1);
  };

  // Helper to compute marker radius and color based on active layer
  const getMarkerMetrics = (zone: Zone) => {
    let value = zone.risk_score || 0;
    if (activeLayer === 'susceptibility') value = zone.static_susceptibility || 0;
    else if (activeLayer === 'rainfall') value = Math.min(100, zone.rainfall_24h || 0);
    else if (activeLayer === 'sar') value = zone.sar_signal || 0;

    const normLevel = (zone.risk_level || 'UNKNOWN').toUpperCase() as RiskLevel;
    const color = colors.risk[normLevel] || colors.risk.UNKNOWN;

    // Radius scaling: base 7px + value scaled
    const radius = 6 + (value / 100) * 10;

    return { value, color, radius, isCritical: normLevel === 'CRITICAL' };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isExpanded ? 'calc(100vh - 100px)' : height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${colors.bg.border}`,
        backgroundColor: '#050D18',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Map Controls */}
      {showControls && (
        <MapControls
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          showRoads={showRoads}
          onToggleRoads={() => setShowRoads(!showRoads)}
          showVillages={showVillages}
          onToggleVillages={() => setShowVillages(!showVillages)}
          showLandslides={showLandslides}
          onToggleLandslides={() => setShowLandslides(!showLandslides)}
          onResetView={handleResetView}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />
      )}

      {/* Map Legend */}
      <MapLegend activeLayer={activeLayer} />

      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController center={defaultCenter} zoom={defaultZoom} resetKey={resetKey} />

        {/* Dark Tile Layer using OpenStreetMap inverted with dark CSS */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Road Polylines */}
        {showRoads &&
          roads.map((road: any, idx: number) => {
            if (!road.geometry || !road.geometry.coordinates) return null;
            const positions = road.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
            return (
              <Polyline
                key={`road-${idx}`}
                positions={positions}
                pathOptions={{
                  color: '#475569',
                  weight: 1.5,
                  opacity: 0.65,
                  dashArray: '4 4',
                }}
              />
            );
          })}

        {/* Village Markers */}
        {showVillages &&
          villages.map((v: any, idx: number) => {
            if (!v.geometry || !v.geometry.coordinates) return null;
            const [lon, lat] = v.geometry.coordinates;
            return (
              <CircleMarker
                key={`village-${idx}`}
                center={[lat, lon]}
                radius={3}
                pathOptions={{
                  color: '#38BDF8',
                  fillColor: '#38BDF8',
                  fillOpacity: 0.7,
                  weight: 1,
                }}
              >
                <Popup>
                  <div style={{ fontSize: '11px' }}>
                    <strong>{v.properties?.name || 'Village Settlement'}</strong>
                    <div style={{ color: colors.text.secondary }}>
                      Pop: {v.properties?.population || 'N/A'}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Historical Landslides */}
        {showLandslides &&
          landslides.map((ls, idx) => (
            <CircleMarker
              key={`ls-${idx}`}
              center={[ls.lat, ls.lon]}
              radius={4}
              pathOptions={{
                color: '#EF4444',
                fillColor: '#EF4444',
                fillOpacity: 0.8,
                weight: 1,
              }}
            >
              <Popup>
                <div style={{ fontSize: '11px' }}>
                  <strong style={{ color: '#EF4444' }}>Historical Landslide</strong>
                  <div>{ls.name}</div>
                  <div style={{ color: colors.text.secondary }}>Date: {ls.date}</div>
                  {ls.fatalities !== undefined && <div>Fatalities: {ls.fatalities}</div>}
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Monitored Risk Zone Markers */}
        {zones.map((zone) => {
          const { color, radius, isCritical } = getMarkerMetrics(zone);
          const isSelected = selectedZone?.zone_id === zone.zone_id;

          return (
            <React.Fragment key={zone.zone_id}>
              {/* Critical Pulse Glow Aura */}
              {isCritical && (
                <CircleMarker
                  center={[zone.lat, zone.lon]}
                  radius={radius + 6}
                  pathOptions={{
                    color: colors.risk.CRITICAL,
                    fillColor: colors.risk.CRITICAL,
                    fillOpacity: 0.2,
                    weight: 1,
                    dashArray: '2 3',
                  }}
                />
              )}

              {/* Selected Zone Ring */}
              {isSelected && (
                <CircleMarker
                  center={[zone.lat, zone.lon]}
                  radius={radius + 4}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: 'transparent',
                    weight: 2,
                  }}
                />
              )}

              {/* Main Zone Marker */}
              <CircleMarker
                center={[zone.lat, zone.lon]}
                radius={radius}
                pathOptions={{
                  color: isSelected ? '#FFFFFF' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.95 : 0.75,
                  weight: isSelected ? 2.5 : 1.5,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedZone(zone);
                  },
                }}
              >
                <Popup>
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>{zone.name}</strong>
                      <span className="font-mono" style={{ fontSize: '10px', color: colors.text.muted }}>
                        {zone.zone_id}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '6px' }}>
                      {zone.district}, {zone.state}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: colors.text.muted }}>Risk Index:</span>
                      <StatusBadge level={zone.risk_level} score={zone.risk_score} size="sm" />
                    </div>

                    <div style={{ fontSize: '10.5px', color: colors.text.secondary, borderTop: '1px solid rgba(35, 58, 85, 0.4)', paddingTop: '4px' }}>
                      Rain 24h: <strong className="font-mono" style={{ color: '#FFFFFF' }}>{zone.rainfall_24h} mm</strong> | Slope: <strong className="font-mono" style={{ color: '#FFFFFF' }}>{zone.slope}°</strong>
                    </div>

                    <button
                      onClick={() => setSelectedZone(zone)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        backgroundColor: colors.brand.primary,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Inspect Zone Intelligence →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Zone Detail Drawer */}
      {selectedZone && (
        <ZoneDrawer zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  );
};
