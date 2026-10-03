import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, ShieldAlert, KeyRound, User, Lock, ArrowRight, AlertCircle, Database, Check } from 'lucide-react';
import { colors } from '../styles/designTokens';

export const LoginPage: React.FC = () => {
  const { login, isLoading, message } = useApp();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const setDemoAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.bg.primary,
        color: colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      {/* Background Topographic Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/src/assets/svgs/topographic-grid.svg)',
          backgroundSize: '120px 120px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Mountain Silhouette Bottom Graphic */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          backgroundImage: 'url(/src/assets/svgs/mountain-silhouette.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: 'cover',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Radar Ring Graphic */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          backgroundImage: 'url(/src/assets/svgs/radar-rings.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />

      {/* Main Login Card */}
      <div
        className="card-elevated animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px',
          position: 'relative',
          zIndex: 10,
          border: `1px solid ${colors.bg.borderLight}`,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.15)',
        }}
      >
        {/* Top subtle blue highlight bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3B82F6, #38BDF8, #60A5FA)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.primary,
              margin: '0 auto 14px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)',
            }}
          >
            <Radio size={28} className="pulse-dot" />
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            TERRAGUARD<span style={{ color: colors.brand.secondary }}>X</span>
          </h1>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: colors.brand.secondary,
              marginTop: '4px',
              textTransform: 'uppercase',
            }}
          >
            AI Geospatial Landslide Intelligence
          </div>

          <p style={{ fontSize: '12px', color: colors.text.secondary, marginTop: '8px', lineHeight: 1.4 }}>
            Disaster management operations & early warning command platform
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: colors.demo.bg,
            border: `1px solid ${colors.demo.border}`,
            color: colors.demo.text,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            marginBottom: '20px',
          }}
        >
          <Database size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>DEMO ENVIRONMENT:</strong> Synthetic multi-source training datasets active.
          </span>
        </div>

        {/* Error Notification */}
        {(error || message) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '11.5px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error || message}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: colors.text.secondary,
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Operator Identity
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={15}
                style={{ position: 'absolute', left: '12px', top: '12px', color: colors.text.muted }}
              />
              <input
                type="text"
                className="tg-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / authority / viewer"
                required
                style={{ paddingLeft: '36px', height: '40px' }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: colors.text.secondary,
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Security Credentials
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{ position: 'absolute', left: '12px', top: '12px', color: colors.text.muted }}
              />
              <input
                type="password"
                className="tg-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                style={{ paddingLeft: '36px', height: '40px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              height: '42px',
              marginTop: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            <span>{isLoading ? 'AUTHENTICATING…' : 'ACCESS COMMAND CENTER'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Roles Quick Select */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.bg.border}` }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: colors.text.muted,
              marginBottom: '8px',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            OR SELECT DEMO OPERATOR ROLE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDemoAccount('admin', 'admin123')}
              style={{
                fontSize: '11px',
                padding: '6px 4px',
                flexDirection: 'column',
                gap: '2px',
                backgroundColor: username === 'admin' ? 'rgba(59, 130, 246, 0.15)' : undefined,
                borderColor: username === 'admin' ? colors.brand.primary : undefined,
              }}
            >
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Admin</span>
              <span style={{ fontSize: '9.5px', color: colors.text.muted }}>Full Control</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDemoAccount('authority', 'authority123')}
              style={{
                fontSize: '11px',
                padding: '6px 4px',
                flexDirection: 'column',
                gap: '2px',
                backgroundColor: username === 'authority' ? 'rgba(56, 189, 248, 0.15)' : undefined,
                borderColor: username === 'authority' ? colors.brand.secondary : undefined,
              }}
            >
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Authority</span>
              <span style={{ fontSize: '9.5px', color: colors.text.muted }}>Disaster Dept</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDemoAccount('viewer', 'viewer123')}
              style={{
                fontSize: '11px',
                padding: '6px 4px',
                flexDirection: 'column',
                gap: '2px',
                backgroundColor: username === 'viewer' ? 'rgba(100, 116, 139, 0.15)' : undefined,
                borderColor: username === 'viewer' ? colors.text.secondary : undefined,
              }}
            >
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Viewer</span>
              <span style={{ fontSize: '9.5px', color: colors.text.muted }}>Read Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Version */}
      <div
        style={{
          marginTop: '24px',
          fontSize: '11px',
          color: colors.text.muted,
          fontFamily: 'var(--font-mono)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        TerraGuardX v0.1.0 · Northeast India High-Relief GIS Grid
      </div>
    </div>
  );
};
