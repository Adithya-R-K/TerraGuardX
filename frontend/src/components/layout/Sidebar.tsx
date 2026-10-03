import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  Route,
  CloudRain,
  Satellite,
  Mountain,
  BellRing,
  MessageSquareWarning,
  BrainCircuit,
  Database,
  Settings2,
  LogOut,
  UserCircle,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { colors } from '../../styles/designTokens';
import { DataModeBadge } from '../common/DataModeBadge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isCollapsed?: boolean; onCloseMobile?: () => void }> = ({
  isCollapsed = false,
  onCloseMobile,
}) => {
  const { activePage, setActivePage, role, username, logout, alerts } = useApp();

  const activeAlertCount = alerts.filter((a) => !['RESOLVED'].includes(a.status)).length;

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [{ id: 'overview', label: 'Command Overview', icon: LayoutDashboard }],
    },
    {
      title: 'RISK INTELLIGENCE',
      items: [
        { id: 'map', label: 'Live Risk Map', icon: Map },
        { id: 'zones', label: 'Zone Analysis', icon: ShieldAlert },
        { id: 'exposure', label: 'Exposure & Assets', icon: Route },
      ],
    },
    {
      title: 'ENVIRONMENT',
      items: [
        { id: 'rainfall', label: 'Rainfall Monitor', icon: CloudRain },
        { id: 'satellite', label: 'Satellite Intelligence', icon: Satellite },
        { id: 'terrain', label: 'Terrain Morphometry', icon: Mountain },
      ],
    },
    {
      title: 'INCIDENTS',
      items: [
        { id: 'alerts', label: 'Alerts & Incidents', icon: BellRing, badge: activeAlertCount || undefined },
        { id: 'feedback', label: 'Field Feedback', icon: MessageSquareWarning },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'model', label: 'Model Performance', icon: BrainCircuit },
        { id: 'health', label: 'Data Health', icon: Database },
        { id: 'settings', label: 'System Settings', icon: Settings2 },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      style={{
        width: isCollapsed ? '64px' : '260px',
        backgroundColor: colors.bg.secondary,
        borderRight: `1px solid ${colors.bg.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '16px 8px' : '20px 18px',
          borderBottom: `1px solid ${colors.bg.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(7, 17, 31, 0.4)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.brand.primary,
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
          }}
        >
          <Radio size={20} className="pulse-dot" />
        </div>

        {!isCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              TERRAGUARD<span style={{ color: colors.brand.secondary }}>X</span>
            </div>
            <div
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: colors.text.secondary,
                marginTop: '3px',
                textTransform: 'uppercase',
              }}
            >
              AI Landslide Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '12px 6px' : '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {sections.map((sec) => (
          <div key={sec.title}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: colors.text.muted,
                  padding: '4px 10px',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {sec.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: '7px',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.16)' : 'transparent',
                      color: isActive ? '#FFFFFF' : colors.text.secondary,
                      border: isActive ? `1px solid rgba(59, 130, 246, 0.4)` : '1px solid transparent',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 500,
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(23, 44, 70, 0.5)';
                        e.currentTarget.style.color = colors.text.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.text.secondary;
                      }
                    }}
                  >
                    <Icon
                      size={17}
                      style={{
                        color: isActive ? colors.brand.secondary : colors.text.secondary,
                        flexShrink: 0,
                      }}
                    />
                    {!isCollapsed && <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        style={{
                          backgroundColor: colors.risk.CRITICAL,
                          color: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '1px 6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: isCollapsed ? '12px 6px' : '14px 14px',
          borderTop: `1px solid ${colors.bg.border}`,
          backgroundColor: 'rgba(7, 17, 31, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <DataModeBadge mode="DEMO" variant="compact" />
            <span
              style={{
                fontSize: '10.5px',
                color: colors.status.online,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: colors.status.online,
                  boxShadow: `0 0 6px ${colors.status.online}`,
                }}
              />
              ONLINE
            </span>
          </div>
        )}

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '8px',
            padding: isCollapsed ? '4px 0' : '6px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(16, 31, 51, 0.7)',
            border: `1px solid ${colors.bg.borderSubtle}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <UserCircle size={20} style={{ color: colors.brand.secondary, flexShrink: 0 }} />
            {!isCollapsed && (
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.text.primary,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {username || 'Commander'}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: colors.brand.primaryHover,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {role || 'VIEWER'}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.text.muted,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.risk.CRITICAL;
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.muted;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
