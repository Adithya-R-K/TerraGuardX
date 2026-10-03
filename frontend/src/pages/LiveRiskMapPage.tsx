import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskMap } from '../components/map/RiskMap';
import { StatusBadge } from '../components/common/StatusBadge';
import { colors } from '../styles/designTokens';
import { Search, Filter, ShieldAlert, MapPin } from 'lucide-react';

export const LiveRiskMapPage: React.FC = () => {
  const { zones, selectedZone, setSelectedZone } = useApp();
  const [search, setSearch] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredZones = zones.filter((z) => {
    if (filterLevel !== 'ALL' && z.risk_level !== filterLevel) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = z.name.toLowerCase().includes(q);
      const matchDistrict = z.district.toLowerCase().includes(q);
      const matchState = z.state.toLowerCase().includes(q);
      const matchId = z.zone_id.toLowerCase().includes(q);
      if (!matchName && !matchDistrict && !matchState && !matchId) return false;
    }
    return true;
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 340px) 1fr',
        gap: '16px',
        height: 'calc(100vh - 120px)',
        minHeight: '600px',
      }}
    >
      {/* Left: Search & Filterable Zone List */}
      <div
        className="card-base"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: colors.bg.cardElevated,
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: `1px solid ${colors.bg.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'rgba(11, 23, 40, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SECTORS DIRECTORY ({filteredZones.length})
            </span>
            <span style={{ fontSize: '11px', color: colors.brand.secondary, fontFamily: 'var(--font-mono)' }}>
              NER GRID
            </span>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: colors.text.muted }} />
            <input
              type="text"
              className="tg-input"
              placeholder="Search by zone, district, state…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '12px', height: '34px' }}
            />
          </div>

          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                style={{
                  flex: 1,
                  padding: '4px 0',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: filterLevel === lvl ? `1px solid ${colors.brand.primary}` : '1px solid var(--border-subtle)',
                  backgroundColor: filterLevel === lvl ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: filterLevel === lvl ? '#FFFFFF' : colors.text.muted,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Zone List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredZones.map((zone) => {
            const isSelected = selectedZone?.zone_id === zone.zone_id;
            return (
              <div
                key={zone.zone_id}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.16)' : 'rgba(11, 23, 40, 0.5)',
                  border: isSelected ? `1px solid ${colors.brand.primary}` : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        color: colors.brand.secondary,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      {zone.zone_id}
                    </span>
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: isSelected ? '#FFFFFF' : colors.text.primary,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {zone.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
                    {zone.district}, {zone.state}
                  </div>
                </div>

                <StatusBadge level={zone.risk_level} score={zone.risk_score} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Full GIS Risk Map */}
      <div style={{ height: '100%' }}>
        <RiskMap height="100%" />
      </div>
    </div>
  );
};
