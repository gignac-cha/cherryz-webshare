/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faServer, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Theme, AuthState } from '@/types';
import { ROUTES } from '@/settings';

interface DashboardPageProps {
  theme: Theme;
  auth: AuthState;
}

export function DashboardPage({ theme, auth }: DashboardPageProps) {
  const isAdmin = auth.user?.role === 'admin';

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.xl};
      `}
    >
      <div>
        <h1
          css={css`
            margin: 0 0 ${theme.spacing.sm} 0;
            font-size: 2rem;
            font-weight: 700;
            color: ${theme.colors.text};
          `}
        >
          Welcome back, {auth.user?.username}!
        </h1>
        <p
          css={css`
            margin: 0;
            color: ${theme.colors.textSecondary};
          `}
        >
          Manage your files and folders with ease
        </p>
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: ${theme.spacing.lg};
        `}
      >
        {/* User Info Card */}
        <div
          css={css`
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.lg};
            padding: ${theme.spacing.xl};
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: ${theme.spacing.md};
              margin-bottom: ${theme.spacing.lg};
            `}
          >
            <div
              css={css`
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: ${theme.colors.primary}22;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.colors.primary};
              `}
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
            </div>
            <div>
              <h3
                css={css`
                  margin: 0 0 ${theme.spacing.xs} 0;
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: ${theme.colors.text};
                `}
              >
                User Profile
              </h3>
              <p
                css={css`
                  margin: 0;
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Your account information
              </p>
            </div>
          </div>

          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: ${theme.spacing.md};
            `}
          >
            <div>
              <div
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                  margin-bottom: ${theme.spacing.xs};
                `}
              >
                Username
              </div>
              <div
                css={css`
                  color: ${theme.colors.text};
                  font-weight: 600;
                `}
              >
                {auth.user?.username}
              </div>
            </div>

            <div>
              <div
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                  margin-bottom: ${theme.spacing.xs};
                `}
              >
                Role
              </div>
              <div
                css={css`
                  display: inline-block;
                  padding: ${theme.spacing.xs} ${theme.spacing.md};
                  background: ${isAdmin ? theme.colors.primary : theme.colors.success}22;
                  color: ${isAdmin ? theme.colors.primary : theme.colors.success};
                  border-radius: ${theme.borderRadius.sm};
                  font-weight: 600;
                  text-transform: capitalize;
                  font-size: 0.875rem;
                `}
              >
                {auth.user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Files Card */}
        <div
          css={css`
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.lg};
            padding: ${theme.spacing.xl};
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: ${theme.spacing.md};
              margin-bottom: ${theme.spacing.lg};
            `}
          >
            <div
              css={css`
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: ${theme.colors.warning}22;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.colors.warning};
              `}
            >
              <FontAwesomeIcon icon={faFolder} size="lg" />
            </div>
            <div>
              <h3
                css={css`
                  margin: 0 0 ${theme.spacing.xs} 0;
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: ${theme.colors.text};
                `}
              >
                File Management
              </h3>
              <p
                css={css`
                  margin: 0;
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Browse and manage files
              </p>
            </div>
          </div>

          <p
            css={css`
              color: ${theme.colors.textSecondary};
              margin: 0 0 ${theme.spacing.lg} 0;
            `}
          >
            {isAdmin
              ? 'Upload, download, move, and delete files and folders'
              : 'Browse and download files'}
          </p>

          <Link
            to={ROUTES.FILES}
            css={css`
              display: inline-flex;
              align-items: center;
              gap: ${theme.spacing.sm};
              padding: ${theme.spacing.sm} ${theme.spacing.lg};
              background: ${theme.colors.primary};
              color: white;
              text-decoration: none;
              border-radius: ${theme.borderRadius.md};
              font-weight: 600;
              transition: all 0.2s;

              &:hover {
                background: ${theme.colors.primaryHover};
              }
            `}
          >
            <span>Open File Browser</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {/* System Info Card */}
        <div
          css={css`
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.lg};
            padding: ${theme.spacing.xl};
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: ${theme.spacing.md};
              margin-bottom: ${theme.spacing.lg};
            `}
          >
            <div
              css={css`
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: ${theme.colors.success}22;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.colors.success};
              `}
            >
              <FontAwesomeIcon icon={faServer} size="lg" />
            </div>
            <div>
              <h3
                css={css`
                  margin: 0 0 ${theme.spacing.xs} 0;
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: ${theme.colors.text};
                `}
              >
                System Status
              </h3>
              <p
                css={css`
                  margin: 0;
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Server information
              </p>
            </div>
          </div>

          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: ${theme.spacing.md};
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <span
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Status
              </span>
              <span
                css={css`
                  padding: ${theme.spacing.xs} ${theme.spacing.md};
                  background: ${theme.colors.success}22;
                  color: ${theme.colors.success};
                  border-radius: ${theme.borderRadius.sm};
                  font-weight: 600;
                  font-size: 0.875rem;
                `}
              >
                Online
              </span>
            </div>

            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <span
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Service
              </span>
              <span
                css={css`
                  color: ${theme.colors.text};
                  font-weight: 600;
                  font-size: 0.875rem;
                `}
              >
                Cherryz WebShare v0.1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
