import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { colors } from '../styles/designTokens';
import { ZoneDrawer } from '../components/map/ZoneDrawer';
import {
  ShieldAlert,
  Search,
  Download,
  ArrowUpDown,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const ZoneAnalysisPage: React.FC = () => {
  const { zones, selectedZone, setSelectedZone } = useApp();
  const [search, setSearch] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [sortField, setSortField] = useState<string>('risk_score');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredAndSorted = zones
    .filter((z) => {
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
    })
    .sort((a, b) => {
      const valA = (a as any)[sortField] ?? 0;
      const valB = (b as any)[sortField] ?? 0;
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

  const exportCSV = () => {
    const headers = [
      'zone_id',
      'name',
      'district',
      'state',
      'risk_score',
      'risk_level',
      'static_susceptibility',
      'dynamic_trigger',
      'sar_signal',
      'rainfall_24h',
      'slope',
      'elevation',
      'nearest_road_km',
    ];
    const rows = filteredAndSorted.map((z) =>
      headers.map((h) => `"${(z as any)[h] ?? ''}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `terraguardx_zone_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      {/* Table & Filter Card */}
      <div className="card-base" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.bg.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'rgba(11, 23, 40, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: colors.brand.secondary }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                MONITORED SECTORS RISK MATRIX
              </span>
              <span style={{ fontSize: '11px', color: colors.text.secondary, marginLeft: '8px' }}>
                ({filteredAndSorted.length} of {zones.length} Sectors)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={13}
                style={{ position: 'absolute', left: '10px', top: '10px', color: colors.text.muted }}
              />
              <input
                type="text"
                placeholder="Search sector, district, ID…"
                className="tg-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '12px', height: '34px' }}
              />
            </div>

            {/* Severity Filter */}
            <select
              className="tg-input"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              style={{ width: 'auto', fontSize: '12px', height: '34px', padding: '0 8px' }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={exportCSV}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '12px', padding: '0 12px' }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tg-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('zone_id')} style={{ cursor: 'pointer' }}>
                  Zone ID <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Sector & District <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('risk_score')} style={{ cursor: 'pointer' }}>
                  Risk Score <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th>Classification</th>
                <th onClick={() => handleSort('static_susceptibility')} style={{ cursor: 'pointer' }}>
                  Static Susc. <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('dynamic_trigger')} style={{ cursor: 'pointer' }}>
                  Dynamic Trig. <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('sar_signal')} style={{ cursor: 'pointer' }}>
                  SAR Signal <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('rainfall_24h')} style={{ cursor: 'pointer' }}>
                  24h Rain <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('slope')} style={{ cursor: 'pointer' }}>
                  Slope <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th onClick={() => handleSort('elevation')} style={{ cursor: 'pointer' }}>
                  Elevation <ArrowUpDown size={11} style={{ display: 'inline', opacity: 0.6 }} />
                </th>
                <th style={{ textAlign: 'right' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((z) => (
                <tr
                  key={z.zone_id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedZone?.zone_id === z.zone_id ? 'rgba(59, 130, 246, 0.15)' : undefined,
                  }}
                >
                  <td className="font-mono" style={{ fontWeight: 700, color: colors.brand.secondary }}>
                    {z.zone_id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{z.name}</div>
                    <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                      {z.district}, {z.state}
                    </div>
                  </td>
                  <td className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                    {z.risk_score.toFixed(1)}
                  </td>
                  <td>
                    <StatusBadge level={z.risk_level} size="sm" />
                  </td>
                  <td className="font-mono" style={{ color: '#38BDF8' }}>
                    {z.static_susceptibility.toFixed(1)}
                  </td>
                  <td className="font-mono" style={{ color: '#60A5FA' }}>
                    {z.dynamic_trigger.toFixed(1)}
                  </td>
                  <td className="font-mono" style={{ color: '#F472B6' }}>
                    {z.sar_signal.toFixed(1)}
                  </td>
                  <td className="font-mono" style={{ color: '#FFFFFF' }}>
                    {z.rainfall_24h} mm
                  </td>
                  <td className="font-mono" style={{ color: colors.text.secondary }}>
                    {z.slope}°
                  </td>
                  <td className="font-mono" style={{ color: colors.text.secondary }}>
                    {z.elevation} m
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '11px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZone(z);
                      }}
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Zone Drawer */}
      {selectedZone && (
        <ZoneDrawer zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  );
};
