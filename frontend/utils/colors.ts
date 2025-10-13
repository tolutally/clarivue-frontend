export const brandColors = {
  default: {
    primary: '#102C64',
    accent: '#FE686D',
    secondary: '#C8A0FE',
    tertiary: '#B8CCF4',
  },
  university: {
    primary: '#8B0000',
    accent: '#FFD700',
    secondary: '#4169E1',
    tertiary: '#87CEEB',
  },
  corporate: {
    primary: '#1E3A8A',
    accent: '#10B981',
    secondary: '#8B5CF6',
    tertiary: '#06B6D4',
  },
} as const;

export const semanticTokens = {
  surface: 'var(--surface)',
  surfaceHover: 'var(--surface-hover)',
  surfaceActive: 'var(--surface-active)',
  
  border: 'var(--border)',
  borderMedium: 'var(--border-medium)',
  borderStrong: 'var(--border-strong)',
  
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  textMuted: 'var(--text-muted)',
  
  primary: 'var(--primary)',
  primaryLight: 'var(--primary-light)',
  primaryDark: 'var(--primary-dark)',
  
  accent: 'var(--accent)',
  accentLight: 'var(--accent-light)',
  accentDark: 'var(--accent-dark)',
  
  secondary: 'var(--secondary)',
  secondaryLight: 'var(--secondary-light)',
  secondaryDark: 'var(--secondary-dark)',
  
  tertiary: 'var(--tertiary)',
  tertiaryLight: 'var(--tertiary-light)',
  tertiaryDark: 'var(--tertiary-dark)',
  
  success: 'var(--success)',
  successLight: 'var(--success-light)',
  successDark: 'var(--success-dark)',
  
  warning: 'var(--warning)',
  warningLight: 'var(--warning-light)',
  warningDark: 'var(--warning-dark)',
  
  danger: 'var(--danger)',
  dangerLight: 'var(--danger-light)',
  dangerDark: 'var(--danger-dark)',
} as const;

export const backgrounds = {
  primary: 'bg-[var(--primary)]',
  accent: 'bg-[var(--accent)]',
  secondary: 'bg-[var(--secondary)]',
  tertiary: 'bg-[var(--tertiary)]',
  primaryLight: 'bg-[var(--primary-light)]',
  accentLight: 'bg-[var(--accent-light)]',
  secondaryLight: 'bg-[var(--secondary-light)]',
  tertiaryLight: 'bg-[var(--tertiary-light)]',
  surface: 'bg-[var(--surface)]',
  surfaceHover: 'bg-[var(--surface-hover)]',
} as const;

export const borders = {
  primary: 'border-[var(--primary)]',
  accent: 'border-[var(--accent)]',
  secondary: 'border-[var(--secondary)]',
  tertiary: 'border-[var(--tertiary)]',
  primaryLight: 'border-[var(--primary-light)]',
  accentLight: 'border-[var(--accent-light)]',
  secondaryLight: 'border-[var(--secondary-light)]',
  tertiaryLight: 'border-[var(--tertiary-light)]',
  default: 'border-[var(--border)]',
  medium: 'border-[var(--border-medium)]',
  strong: 'border-[var(--border-strong)]',
} as const;

export const text = {
  primary: 'text-[var(--primary)]',
  accent: 'text-[var(--accent)]',
  secondary: 'text-[var(--secondary)]',
  tertiary: 'text-[var(--tertiary)]',
  base: 'text-[var(--text-primary)]',
  muted: 'text-[var(--text-secondary)]',
  subtle: 'text-[var(--text-tertiary)]',
  faint: 'text-[var(--text-muted)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  danger: 'text-[var(--danger)]',
} as const;

export const hover = {
  primary: 'hover:bg-[var(--primary)]',
  accent: 'hover:bg-[var(--accent)]',
  secondary: 'hover:bg-[var(--secondary)]',
  tertiary: 'hover:bg-[var(--tertiary)]',
  primaryLight: 'hover:bg-[var(--primary-light)]',
  accentLight: 'hover:bg-[var(--accent-light)]',
  secondaryLight: 'hover:bg-[var(--secondary-light)]',
  tertiaryLight: 'hover:bg-[var(--tertiary-light)]',
  surface: 'hover:bg-[var(--surface-hover)]',
} as const;

export const gradients = {
  primary: 'from-[var(--primary)] to-[var(--secondary)]',
  accent: 'from-[var(--accent)] to-[var(--secondary)]',
  secondary: 'from-[var(--secondary)] to-[var(--tertiary)]',
  tertiary: 'from-[var(--tertiary)] to-[var(--primary)]',
  success: 'from-[var(--success-light)] to-[var(--surface)]',
} as const;

export const cardStyles = {
  primary: `bg-gradient-to-br ${gradients.primary} text-white`,
  accent: `bg-gradient-to-br ${gradients.accent} text-white`,
  secondary: `bg-gradient-to-br ${gradients.secondary} text-white`,
  tertiary: `bg-gradient-to-br ${gradients.tertiary} text-white`,
  
  primaryLight: `bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary-light)]/50 ${borders.primaryLight}`,
  accentLight: `bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-light)]/50 ${borders.accentLight}`,
  secondaryLight: `bg-gradient-to-br from-[var(--secondary-light)] to-[var(--secondary-light)]/50 ${borders.secondaryLight}`,
  tertiaryLight: `bg-gradient-to-br from-[var(--tertiary-light)] to-[var(--tertiary-light)]/50 ${borders.tertiaryLight}`,
} as const;

export const semantic = {
  surface: backgrounds.surface,
  border: borders.default,
  borderMedium: borders.medium,
  borderStrong: borders.strong,
  textPrimary: text.base,
  textSecondary: text.muted,
  textTertiary: text.subtle,
  textMuted: text.faint,
  
  bgSubtle: 'bg-[var(--surface-hover)]',
  bgHover: hover.surface,
  
  success: text.success,
  successBg: 'bg-[var(--success-light)]',
  successBorder: 'border-[var(--success-light)]',
  successGradient: gradients.success,
  
  warning: text.warning,
  warningBg: 'bg-[var(--warning-light)]',
  warningBorder: 'border-[var(--warning-light)]',
  highlight: 'bg-[var(--warning-light)]',
  
  danger: text.danger,
  dangerBg: 'bg-[var(--danger-light)]',
  dangerBorder: 'border-[var(--danger-light)]',
} as const;

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;
