/**
 * Global Styles
 * Reusable style objects used across multiple screens
 */

import { StyleSheet } from 'react-native';
import COLORS from './colors';
import THEME from './theme';

const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Padding helpers
  screenPadding: {
    paddingHorizontal: THEME.spacing.md,
  },

  // Text styles
  title: {
    fontSize: THEME.fontSize.title,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.semiBold,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.regular,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: THEME.fontSize.sm,
    color: COLORS.textLight,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.md,
  },
});

export default globalStyles;
