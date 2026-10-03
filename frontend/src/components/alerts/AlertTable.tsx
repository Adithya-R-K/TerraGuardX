import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Alert } from '../../types';
import { colors } from '../../styles/designTokens';
import { StatusBadge } from '../common/StatusBadge';
import {
  BellRing,
  Send,
  CheckCheck,
  CheckCircle,
  Eye,
  PhoneCall,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';

interface AlertTableProps {
  onInspectZone?: (zoneId: string) => void;
}

export const AlertTable: React.FC<AlertTableProps> = ({ onInspectZone }) => {
  const { alerts, role, refreshAll, setMessage, zones, setSelectedZone, setActivePage } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  const handleAction = async (alertId: number, action: 'send' | 'acknowledge' | 'resolve') => {
    setActionInProgress(alertId);
    try {
      const res = await api.sendAlertAction(alertId, action);
      setMessage(`Alert #${alertId} updated to ${res.status}`);
      await refreshAll();
    } catch (err: any) {
      setMessage(`Alert action failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleInspect = (zoneId: string) => {
    const target = zones.find((z) => z.zone_id === zoneId);
    if (target) {
      setSelectedZone(target);
      setActivePage('map');
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchZone = a.zone_id.toLowerCase().includes(q);
      const matchTrigger = a.trigger.toLowerCase().includes(q);
      const matchMsg = a.message.toLowerCase().includes(q);
      if (!matchZone && !matchTrigger && !matchMsg) return false;
    }
    return true;
  });

  return (
    <div className="card-base" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Table Toolbar */}
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
          <BellRing size={16} style={{ color: colors.status.warning }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
            EARLY WARNING DISPATCH QUEUE ({filteredAlerts.length})
          </span>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Search
              size={13}
              style={{ position: 'absolute', left: '8px', top: '9px', color: colors.text.muted }}
            />
            <input
              type="text"
              placeholder="Search alerts…"
              className="tg-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '28px', fontSize: '12px', height: '32px' }}
            />
          </div>

          {/* Severity Filter */}
          <select
            className="tg-input"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{ width: 'auto', fontSize: '12px', height: '32px', padding: '0 8px' }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            className="tg-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', fontSize: '12px', height: '32px', padding: '0 8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table className="tg-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sector / Zone</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Trigger Description</th>
              <th>Dispatch Time</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: colors.text.muted }}>
                  No incident records match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => {
                const isWorking = actionInProgress === alert.id;
                return (
                  <tr key={alert.id}>
                    <td className="font-mono" style={{ color: colors.brand.secondary, fontWeight: 600 }}>
                      #{alert.id}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Zone {alert.zone_id}</div>
                      <div style={{ fontSize: '10.5px', color: colors.text.muted }}>
                        Pred ID: {alert.prediction_id || 'N/A'}
                      </div>
                    </td>

                    <td>
                      <StatusBadge level={alert.severity} size="sm" />
                    </td>

                    <td className="font-mono" style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {alert.score.toFixed(0)}
                      <span style={{ fontSize: '10px', color: colors.text.muted }}>/100</span>
                    </td>

                    <td style={{ maxWidth: '220px', color: colors.text.secondary }}>
                      {alert.trigger}
                    </td>

                    <td className="font-mono" style={{ fontSize: '11px', color: colors.text.muted }}>
                      {alert.created_at ? alert.created_at.slice(0, 16).replace('T', ' ') : 'N/A'}
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor:
                            alert.status === 'SENT'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : alert.status === 'RESOLVED'
                              ? 'rgba(34, 197, 94, 0.15)'
                              : alert.status === 'ACKNOWLEDGED'
                              ? 'rgba(234, 179, 8, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            alert.status === 'SENT'
                              ? '#60A5FA'
                              : alert.status === 'RESOLVED'
                              ? '#22C55E'
                              : alert.status === 'ACKNOWLEDGED'
                              ? '#EAB308'
                              : '#EF4444',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {/* Inspect on Map */}
                        <button
                          onClick={() => handleInspect(alert.zone_id)}
                          title="Inspect on Map"
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          <Eye size={12} />
                        </button>

                        {/* Send SMS (Admin only) */}
                        {role === 'ADMIN' && alert.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleAction(alert.id, 'send')}
                            disabled={isWorking}
                            title="Send SMS Broadcast to District Authorities"
                            className="btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#2563EB' }}
                          >
                            {isWorking ? <Loader2 size={12} className="radar-sweep" /> : <Send size={12} />}
                            <span>Send</span>
                          </button>
                        )}

                        {/* Acknowledge (Admin & Authority) */}
                        {role !== 'VIEWER' && alert.status === 'PENDING' && (
                          <button
                            onClick={() => handleAction(alert.id, 'acknowledge')}
                            disabled={isWorking}
                            title="Acknowledge Alert"
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px', color: '#EAB308' }}
                          >
                            <CheckCheck size={12} />
                            <span>Ack</span>
                          </button>
                        )}

                        {/* Resolve (Admin & Authority) */}
                        {role !== 'VIEWER' && alert.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleAction(alert.id, 'resolve')}
                            disabled={isWorking}
                            title="Mark Incident Resolved"
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px', color: '#22C55E' }}
                          >
                            <CheckCircle size={12} />
                            <span>Resolve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
