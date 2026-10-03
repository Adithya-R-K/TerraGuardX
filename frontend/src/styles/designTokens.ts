/**
 * TerraGuardX Design Tokens
 * Geospatial Disaster Intelligence Command Center Theme
 */

export const colors = {
  bg: {
    primary: '#07111F',
    secondary: '#0B1728',
    card: '#101F33',
    cardElevated: '#14263D',
    cardHover: '#172C46',
    border: '#233A55',
    borderSubtle: '#1C2F45',
    borderLight: '#2C496A',
  },
  brand: {
    primary: '#3B82F6',
    primaryHover: '#60A5FA',
    primaryLight: 'rgba(59, 130, 246, 0.15)',
    secondary: '#38BDF8',
    secondaryHover: '#7DD3FC',
    secondaryLight: 'rgba(56, 189, 248, 0.12)',
    accent: '#6366F1',
  },
  text: {
    primary: '#E8F0F8',
    secondary: '#8EA6BF',
    muted: '#52657A',
    inverse: '#07111F',
    highlight: '#FFFFFF',
  },
  risk: {
    LOW: '#22C55E',
    MEDIUM: '#EAB308',
    HIGH: '#F97316',
    CRITICAL: '#EF4444',
    UNKNOWN: '#64748B',
  },
  riskBg: {
    LOW: 'rgba(34, 197, 94, 0.15)',
    MEDIUM: 'rgba(234, 179, 8, 0.15)',
    HIGH: 'rgba(249, 115, 22, 0.15)',
    CRITICAL: 'rgba(239, 68, 68, 0.18)',
    UNKNOWN: 'rgba(100, 116, 139, 0.15)',
  },
  riskBorder: {
    LOW: 'rgba(34, 197, 94, 0.4)',
    MEDIUM: 'rgba(234, 179, 8, 0.4)',
    HIGH: 'rgba(249, 115, 22, 0.4)',
    CRITICAL: 'rgba(239, 68, 68, 0.5)',
    UNKNOWN: 'rgba(100, 116, 139, 0.4)',
  },
  demo: {
    bg: '#422006',
    border: '#92400E',
    text: '#FCD34D',
    badge: '#B45309',
  },
  status: {
    online: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#38BDF8',
  }
} as const;

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '28px',
    '4xl': '34px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
};

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  card: '0 4px 20px -2px rgba(3, 8, 16, 0.5), 0 0 0 1px rgba(35, 58, 85, 0.6)',
  cardHover: '0 8px 30px -4px rgba(3, 8, 16, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.4)',
  glowBrand: '0 0 20px rgba(59, 130, 246, 0.25)',
  glowCritical: '0 0 25px rgba(239, 68, 68, 0.35)',
  drawer: '-10px 0 30px rgba(0, 0, 0, 0.7)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '350ms cubic-bezier(0.16, 1, 0.3, 1)',
};
