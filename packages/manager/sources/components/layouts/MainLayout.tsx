/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faFolder,
  faSignOutAlt,
  faMoon,
  faSun,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Theme } from '@/types';
import type { AuthState } from '@/types';
import { ROUTES } from '@/settings';

interface MainLayoutProps {
  theme: Theme;
  toggleTheme: () => void;
  auth: AuthState;
}

export function MainLayout({ theme, toggleTheme, auth }: MainLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      css={css`
        min-height: 100vh;
        background: ${theme.colors.background};
        color: ${theme.colors.text};
      `}
    >
      {/* Header */}
      <header
        css={css`
          background: ${theme.colors.surface};
          border-bottom: 1px solid ${theme.colors.border};
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: ${theme.spacing.lg};
          `}
        >
          <h1
            css={css`
              margin: 0;
              font-size: 1.5rem;
              font-weight: 700;
              color: ${theme.colors.primary};
            `}
          >
            Cherryz WebShare
          </h1>

          <nav
            css={css`
              display: flex;
              gap: ${theme.spacing.md};
            `}
          >
            <Link
              to={ROUTES.DASHBOARD}
              css={css`
                display: flex;
                align-items: center;
                gap: ${theme.spacing.sm};
                padding: ${theme.spacing.sm} ${theme.spacing.md};
                border-radius: ${theme.borderRadius.md};
                text-decoration: none;
                color: ${theme.colors.text};
                transition: all 0.2s;

                &:hover {
                  background: ${theme.colors.surfaceHover};
                }
              `}
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Dashboard</span>
            </Link>

            <Link
              to={ROUTES.FILES}
              css={css`
                display: flex;
                align-items: center;
                gap: ${theme.spacing.sm};
                padding: ${theme.spacing.sm} ${theme.spacing.md};
                border-radius: ${theme.borderRadius.md};
                text-decoration: none;
                color: ${theme.colors.text};
                transition: all 0.2s;

                &:hover {
                  background: ${theme.colors.surfaceHover};
                }
              `}
            >
              <FontAwesomeIcon icon={faFolder} />
              <span>Files</span>
            </Link>
          </nav>
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            gap: ${theme.spacing.md};
          `}
        >
          <button
            onClick={toggleTheme}
            css={css`
              background: none;
              border: none;
              color: ${theme.colors.text};
              cursor: pointer;
              padding: ${theme.spacing.sm};
              border-radius: ${theme.borderRadius.md};
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;

              &:hover {
                background: ${theme.colors.surfaceHover};
              }
            `}
            title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
          >
            <FontAwesomeIcon icon={theme.mode === 'light' ? faMoon : faSun} />
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              css={css`
                background: none;
                border: 1px solid ${theme.colors.border};
                color: ${theme.colors.text};
                cursor: pointer;
                padding: ${theme.spacing.sm} ${theme.spacing.md};
                border-radius: ${theme.borderRadius.md};
                display: flex;
                align-items: center;
                gap: ${theme.spacing.sm};
                transition: all 0.2s;

                &:hover {
                  background: ${theme.colors.surfaceHover};
                }
              `}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{auth.user?.username}</span>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                css={css`
                  background: ${theme.colors.surface};
                  border: 1px solid ${theme.colors.border};
                  border-radius: ${theme.borderRadius.md};
                  padding: ${theme.spacing.sm};
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  min-width: 180px;
                  z-index: 1000;
                `}
              >
                <DropdownMenu.Item
                  css={css`
                    padding: ${theme.spacing.sm} ${theme.spacing.md};
                    border-radius: ${theme.borderRadius.sm};
                    cursor: pointer;
                    outline: none;
                    color: ${theme.colors.text};
                    display: flex;
                    align-items: center;
                    gap: ${theme.spacing.md};

                    &:hover {
                      background: ${theme.colors.surfaceHover};
                    }
                  `}
                  onSelect={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      {/* Main Content */}
      <main
        css={css`
          max-width: 1400px;
          margin: 0 auto;
          padding: ${theme.spacing.xl};
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
