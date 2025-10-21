/** @jsxImportSource @emotion/react */
import { css, Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { getTheme } from '@/settings/theme';
import { ToastProvider } from '@/components/ui/Toast';
import { MainLayout } from '@/components/layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FilesPage } from '@/pages/FilesPage';
import { ROUTES } from '@/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}

export function Application() {
  const auth = useAuthentication();
  const { mode, toggleTheme } = useTheme();
  const toast = useToast();

  const theme = getTheme(mode);

  return (
    <QueryClientProvider client={queryClient}>
      <EmotionThemeProvider theme={theme}>
        <ToastProvider toasts={toast.toasts} onClose={toast.removeToast} theme={theme}>
          <Global
            styles={css`
              * {
                box-sizing: border-box;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              #root {
                min-height: 100vh;
              }
            `}
          />

          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginPage theme={theme} auth={auth} />} />

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout theme={theme} toggleTheme={toggleTheme} auth={auth} />
                  </ProtectedRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage theme={theme} auth={auth} />} />
                <Route
                  path={`${ROUTES.FILES}/*`}
                  element={
                    <FilesPage
                      theme={theme}
                      auth={auth}
                      onToast={(variant, title, description) => {
                        if (variant === 'success') toast.success(title, description);
                        else if (variant === 'error') toast.error(title, description);
                      }}
                    />
                  }
                />
              </Route>

              <Route
                path={ROUTES.HOME}
                element={
                  auth.isAuthenticated ? (
                    <Navigate to={ROUTES.DASHBOARD} replace />
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />

              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </EmotionThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
