import type { Theme, ThemeMode } from '@/types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#f9f9f9',
    border: '#e0e0e0',
    text: '#1a1a1a',
    textSecondary: '#666666',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    error: '#ef4444',
    errorHover: '#dc2626',
    success: '#10b981',
    warning: '#f59e0b',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceHover: '#2a2a2a',
    border: '#333333',
    text: '#f5f5f5',
    textSecondary: '#a0a0a0',
    primary: '#818cf8',
    primaryHover: '#6366f1',
    error: '#f87171',
    errorHover: '#ef4444',
    success: '#34d399',
    warning: '#fbbf24',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
