/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as Label from '@radix-ui/react-label';
import type { Theme } from '@/types';

interface LoginFormProps {
  theme: Theme;
  onSubmit: (username: string, password: string) => Promise<void>;
}

export function LoginForm({ theme, onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.lg};
        width: 100%;
        max-width: 400px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        `}
      >
        <Label.Root
          htmlFor="username"
          css={css`
            font-weight: 500;
            color: ${theme.colors.text};
          `}
        >
          Username
        </Label.Root>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoComplete="username"
          css={css`
            padding: ${theme.spacing.md};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.md};
            background: ${theme.colors.surface};
            color: ${theme.colors.text};
            font-size: 1rem;
            transition: all 0.2s;

            &:focus {
              outline: none;
              border-color: ${theme.colors.primary};
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}
        />
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        `}
      >
        <Label.Root
          htmlFor="password"
          css={css`
            font-weight: 500;
            color: ${theme.colors.text};
          `}
        >
          Password
        </Label.Root>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
          css={css`
            padding: ${theme.spacing.md};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.md};
            background: ${theme.colors.surface};
            color: ${theme.colors.text};
            font-size: 1rem;
            transition: all 0.2s;

            &:focus {
              outline: none;
              border-color: ${theme.colors.primary};
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}
        />
      </div>

      {error && (
        <div
          css={css`
            padding: ${theme.spacing.md};
            background: ${theme.colors.error}22;
            border: 1px solid ${theme.colors.error};
            border-radius: ${theme.borderRadius.md};
            color: ${theme.colors.error};
            font-size: 0.875rem;
          `}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        css={css`
          padding: ${theme.spacing.md};
          background: ${theme.colors.primary};
          color: white;
          border: none;
          border-radius: ${theme.borderRadius.md};
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${theme.spacing.sm};
          transition: all 0.2s;

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Logging in...</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSignInAlt} />
            <span>Login</span>
          </>
        )}
      </button>
    </form>
  );
}
