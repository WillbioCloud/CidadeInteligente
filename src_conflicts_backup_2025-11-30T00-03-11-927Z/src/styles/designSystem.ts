// src/styles/designSystem.ts

import { StyleSheet } from 'react-native';

<<<<<<< HEAD
const COLORS = {
=======
const FONT_FAMILY = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const PALETTE = {
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
  blue: '#4A90E2',
  green: '#50E3C2',
  orange: '#F5A623',
  red: '#D0021B',
  black: '#121212',
  gray_dark: '#555555',
  gray_medium: '#888888',
  gray_light: '#CCCCCC',
  gray_extralight: '#F4F5F7',
  white: '#FFFFFF',
<<<<<<< HEAD
  dark_blue: '#1E3A8A',
  light_blue: '#3B82F6',
};

// 2. Temas de Cores para os Loteamentos
export const THEME_COLORS = {
  orange: { primary: '#F97316', accent: '#FB923C', light: '#FFF7ED', gradient: ['#F97316', '#EA580C'] },
  red: { primary: '#EF4444', accent: '#F87171', light: '#FEF2F2', gradient: ['#EF4444', '#DC2626'] },
  green: { primary: '#22C55E', accent: '#4ADE80', light: '#F0FDF4', gradient: ['#22C55E', '#16A34A'] },
  dark_blue: { primary: '#3B82F6', accent: '#60A5FA', light: '#EFF6FF', gradient: ['#3B82F6', '#2563EB'] },
  light_blue: { primary: '#0EA5E9', accent: '#38BDF8', light: '#F0F9FF', gradient: ['#0EA5E9', '#0284C7'] },
  purple: { primary: '#8B5CF6', accent: '#A78BFA', light: '#F5F3FF', gradient: ['#8B5CF6', '#7C3AED'] },
  brown: { primary: '#A16207', accent: '#CA8A04', light: '#FEFCE8', gradient: ['#A16207', '#854D0E'] },
};

// 3. Constantes de Espaçamento e Fontes
export const SPACING = {
  xs: 4, s: 8, m: 16, l: 24, xl: 40,
};

export const FONT_FAMILY = {
  regular: 'System', // Substitua pelos nomes das suas fontes
  semiBold: 'System',
  bold: 'System',
};

// 4. Estilos Globais Reutilizáveis
const globalStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  text_h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 28,
    color: COLORS.black,
  },
  // ... outros estilos globais
});

// 5. Exporta tudo em um único objeto para fácil acesso
export const designSystem = {
  COLORS,
  THEME_COLORS,
  SPACING,
  FONT_FAMILY,
  STYLES: globalStyles,
=======
};

// Mapeamento de Cores por Tema (Loteamento)
export const THEME_COLORS = {
  'orange': { primary: '#F97316', accent: '#FB923C', light: '#FFF7ED', gradient: ['#F97316', '#EA580C'] },
  'red': { primary: '#EF4444', accent: '#F87171', light: '#FEF2F2', gradient: ['#EF4444', '#DC2626'] },
  'green': { primary: '#22C55E', accent: '#4ADE80', light: '#F0FDF4', gradient: ['#22C55E', '#16A34A'] },
  'dark_blue': { primary: '#3B82F6', accent: '#60A5FA', light: '#EFF6FF', gradient: ['#3B82F6', '#2563EB'] },
  'light_blue': { primary: '#0EA5E9', accent: '#38BDF8', light: '#F0F9FF', gradient: ['#0EA5E9', '#0284C7'] },
};

export const designSystem = {
  COLORS: PALETTE,
  THEME_COLORS,
  FONT_FAMILY,
  SPACING: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  STYLES: StyleSheet.create({
    card: {
      backgroundColor: PALETTE.white,
      borderRadius: 16,
      padding: 16,
      shadowColor: PALETTE.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: '#F0F0F0',
    },
    text_h1: {
      fontFamily: FONT_FAMILY.bold,
      fontSize: 28,
      color: PALETTE.black,
    },
    text_h2: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: 22,
      color: PALETTE.black,
    },
    text_body: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: 16,
      color: PALETTE.gray_dark,
    },
    text_caption: {
        fontFamily: FONT_FAMILY.regular,
        fontSize: 14,
        color: PALETTE.gray_medium,
    },
  }),
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
};