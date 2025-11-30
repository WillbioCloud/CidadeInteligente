import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#059669', // Emerald 600
  primaryDark: '#047857', // Emerald 700
  primaryLight: '#10B981', // Emerald 500
  primaryBg: '#ECFDF5', // Emerald 50

  secondary: '#3B82F6', // Blue 500
  secondaryDark: '#2563EB', // Blue 600
  secondaryLight: '#60A5FA', // Blue 400
  secondaryBg: '#EFF6FF', // Blue 50

  background: '#FFFFFF',
  surface: '#F9FAFB', // Gray 50
  surfaceHighlight: '#F3F4F6', // Gray 100

  text: {
    primary: '#111827', // Gray 900
    secondary: '#4B5563', // Gray 600
    tertiary: '#9CA3AF', // Gray 400
    inverted: '#FFFFFF',
  },

  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  border: '#E5E7EB', // Gray 200
  icon: '#6B7280', // Gray 500
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.inverted,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
};

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  layout,
};

export default theme;