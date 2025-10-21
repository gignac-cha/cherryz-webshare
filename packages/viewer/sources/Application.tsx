import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, Global, css } from '@emotion/react';
import { useAuthentication } from './hooks/useAuthentication.js';
import { MainLayout } from './components/layouts/MainLayout.js';
import { LoginPage } from './pages/LoginPage.js';
import { FilesPage } from './pages/FilesPage.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const lightTheme = {
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    border: '#e0e0e0',
    hover: '#f0f0f0',
    active: '#e5e5e5',
    error: '#dc2626',
  },
};

const darkTheme = {
  colors: {
    background: '#0f0f0f',
    surface: '#1a1a1a',
    text: '#e5e5e5',
    textSecondary: '#a3a3a3',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    border: '#2a2a2a',
    hover: '#262626',
    active: '#333333',
    error: '#ef4444',
  },
};

const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }
`;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthentication();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('cherryz_viewer_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('cherryz_viewer_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Global styles={globalStyles} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/files/*"
            element={
              <ProtectedRoute>
                <MainLayout onThemeToggle={toggleTheme} isDarkMode={isDarkMode}>
                  <FilesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/files" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export function Application() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
