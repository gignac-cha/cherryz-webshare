import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/client';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/settings';
import type { User, AuthState } from '@/types';

export function useAuthentication(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authApi.login({ username, password });

    // Store in state
    setToken(response.token);
    setUser(response.user);

    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };
}
