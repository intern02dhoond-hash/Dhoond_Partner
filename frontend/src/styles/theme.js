/**
 * Theme Configuration — Dhoond Partner
 * Spacing, typography, border radius, and shadow tokens
 * Designed for a clean, modern, premium mobile feel
 */

import COLORS from './colors';

const THEME = {
  colors: COLORS,

  // Spacing scale (multiples of 4)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    title: 28,
    hero: 32,
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Border radius
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    xxl: 24,
    full: 9999,
  },

  // Shadows (for iOS and Android)
  shadow: {
    sm: {
      shadowColor: '#1A4FBF',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#1A4FBF',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#1A4FBF',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

export default THEME;
