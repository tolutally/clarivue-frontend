export const colors = {
  primary: '#102C64',
  accent: '#FE686D',
  secondary: '#C8A0FE',
  tertiary: '#B8CCF4',
} as const;

export const gradients = {
  primary: 'from-[#102C64] to-[#C8A0FE]',
  accent: 'from-[#FE686D] to-[#C8A0FE]',
  secondary: 'from-[#C8A0FE] to-[#B8CCF4]',
  tertiary: 'from-[#B8CCF4] to-[#102C64]',
  coral: 'from-[#FE686D] to-[#FE686D]/80',
  purple: 'from-[#C8A0FE] to-[#C8A0FE]/80',
  blue: 'from-[#102C64] to-[#102C64]/80',
  light: 'from-[#B8CCF4] to-[#B8CCF4]/80',
} as const;

export const backgrounds = {
  primary: 'bg-[#102C64]',
  accent: 'bg-[#FE686D]',
  secondary: 'bg-[#C8A0FE]',
  tertiary: 'bg-[#B8CCF4]',
  primaryLight: 'bg-[#102C64]/10',
  accentLight: 'bg-[#FE686D]/10',
  secondaryLight: 'bg-[#C8A0FE]/10',
  tertiaryLight: 'bg-[#B8CCF4]/10',
} as const;

export const borders = {
  primary: 'border-[#102C64]',
  accent: 'border-[#FE686D]',
  secondary: 'border-[#C8A0FE]',
  tertiary: 'border-[#B8CCF4]',
  primaryLight: 'border-[#102C64]/20',
  accentLight: 'border-[#FE686D]/20',
  secondaryLight: 'border-[#C8A0FE]/20',
  tertiaryLight: 'border-[#B8CCF4]/20',
} as const;

export const text = {
  primary: 'text-[#102C64]',
  accent: 'text-[#FE686D]',
  secondary: 'text-[#C8A0FE]',
  tertiary: 'text-[#B8CCF4]',
} as const;

export const hover = {
  primary: 'hover:bg-[#102C64]',
  accent: 'hover:bg-[#FE686D]',
  secondary: 'hover:bg-[#C8A0FE]',
  tertiary: 'hover:bg-[#B8CCF4]',
  primaryLight: 'hover:bg-[#102C64]/10',
  accentLight: 'hover:bg-[#FE686D]/10',
  secondaryLight: 'hover:bg-[#C8A0FE]/10',
  tertiaryLight: 'hover:bg-[#B8CCF4]/10',
} as const;

export const cardStyles = {
  primary: `bg-gradient-to-br ${gradients.primary} text-white`,
  accent: `bg-gradient-to-br ${gradients.accent} text-white`,
  secondary: `bg-gradient-to-br ${gradients.secondary} text-white`,
  tertiary: `bg-gradient-to-br ${gradients.tertiary} text-white`,
  
  primaryLight: `bg-gradient-to-br from-[#102C64]/10 to-[#102C64]/5 ${borders.primaryLight}`,
  accentLight: `bg-gradient-to-br from-[#FE686D]/10 to-[#FE686D]/5 ${borders.accentLight}`,
  secondaryLight: `bg-gradient-to-br from-[#C8A0FE]/10 to-[#C8A0FE]/5 ${borders.secondaryLight}`,
  tertiaryLight: `bg-gradient-to-br from-[#B8CCF4]/10 to-[#B8CCF4]/5 ${borders.tertiaryLight}`,
} as const;

export const semantic = {
  surface: 'bg-white',
  border: 'border-gray-100',
  borderMedium: 'border-gray-200',
  borderStrong: 'border-gray-300',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textTertiary: 'text-gray-500',
  textMuted: 'text-gray-400',
  
  bgSubtle: 'bg-gray-50',
  bgHover: 'hover:bg-gray-50',
  
  success: 'text-emerald-600',
  successBg: 'bg-emerald-50',
  successBorder: 'border-emerald-200',
  successGradient: 'from-emerald-50 to-white',
  
  warning: 'text-amber-600',
  warningBg: 'bg-amber-50',
  warningBorder: 'border-amber-200',
  highlight: 'bg-yellow-200',
  
  danger: 'text-red-600',
  dangerBg: 'bg-red-50',
  dangerBorder: 'border-red-200',
} as const;

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;
