/**
 * Tailwind CSS Configuration — Dhoond Partner App
 * Uses twrnc for Tailwind utility classes in React Native
 * Custom colors mapped from the Dhoond brand palette
 */

import { create } from 'twrnc';

const tw = create({
  theme: {
    extend: {
      colors: {
        // Primary brand (Dhoond Blue)
        dhoond: {
          DEFAULT: '#2E6BE6',
          light: '#5B8DEF',
          dark: '#1A4FBF',
          soft: 'rgba(46, 107, 230, 0.1)',
        },
        // Card backgrounds
        'card-dark': '#1C4ED8',
        'card-darker': '#1E3A8A',
        // Backgrounds
        'bg-main': '#F0F4FA',
        'surface': '#FFFFFF',
        'surface-alt': '#F7F9FC',
        // Text
        'txt-primary': '#1A202C',
        'txt-secondary': '#64748B',
        'txt-light': '#94A3B8',
        // Status
        'status-success': '#10B981',
        'status-success-soft': 'rgba(16, 185, 129, 0.12)',
        'status-warning': '#F59E0B',
        'status-warning-soft': 'rgba(245, 158, 11, 0.12)',
        'status-error': '#EF4444',
        'status-error-soft': 'rgba(239, 68, 68, 0.12)',
        // Borders
        'border-main': '#E2E8F0',
        'border-light': '#EDF2F7',
        // Misc
        'disabled': '#CBD5E1',
      },
    },
  },
});

export default tw;
