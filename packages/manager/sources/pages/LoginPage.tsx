/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginForm } from '@/components/authentication/LoginForm';
import type { Theme, AuthState } from '@/types';
import { ROUTES } from '@/settings';

interface LoginPageProps {
  theme: Theme;
  auth: AuthState;
}

export function LoginPage({ theme, auth }: LoginPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [auth.isAuthenticated, navigate]);

  const handleLogin = async (username: string, password: string) => {
    await auth.login(username, password);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div
      css={css`
        min-height: 100vh;
        background: ${theme.colors.background};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing.lg};
      `}
    >
      <div
        css={css`
          width: 100%;
          max-width: 450px;
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.lg};
          padding: ${theme.spacing.xl};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        `}
      >
        <div
          css={css`
            text-align: center;
            margin-bottom: ${theme.spacing.xl};
          `}
        >
          <h1
            css={css`
              margin: 0 0 ${theme.spacing.sm} 0;
              font-size: 2rem;
              font-weight: 700;
              color: ${theme.colors.primary};
            `}
          >
            Cherryz WebShare
          </h1>
          <p
            css={css`
              margin: 0;
              color: ${theme.colors.textSecondary};
              font-size: 0.875rem;
            `}
          >
            Manager Portal
          </p>
        </div>

        <LoginForm theme={theme} onSubmit={handleLogin} />

        <div
          css={css`
            margin-top: ${theme.spacing.lg};
            padding-top: ${theme.spacing.lg};
            border-top: 1px solid ${theme.colors.border};
            text-align: center;
            color: ${theme.colors.textSecondary};
            font-size: 0.75rem;
          `}
        >
          Default credentials: admin / admin123
        </div>
      </div>
    </div>
  );
}
