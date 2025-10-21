export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AUTH_TOKEN_KEY = 'cherryz_auth_token';
export const AUTH_USER_KEY = 'cherryz_auth_user';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FILES: '/files',
} as const;
