import { useState, useEffect, useCallback } from 'react';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../settings/index.js';
import { login as apiLogin } from '../api/client.js';
import type { User, LoginRequest } from '../types/index.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export function useAuthentication(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userJson = localStorage.getItem(AUTH_USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await apiLogin(credentials);
    const { token, user } = response.data;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}
