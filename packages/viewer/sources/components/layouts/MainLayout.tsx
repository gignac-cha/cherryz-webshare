import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMoon, faSun, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuthentication } from '../../hooks/useAuthentication.js';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:active {
    background-color: ${props => props.theme.colors.active};
  }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

interface MainLayoutProps {
  children: ReactNode;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export function MainLayout({ children, onThemeToggle, isDarkMode }: MainLayoutProps) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthentication();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Logo>
          <FontAwesomeIcon icon={faFileAlt} />
          Cherryz WebShare Viewer
        </Logo>
        <Actions>
          <Button onClick={onThemeToggle} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </Button>
          {isAuthenticated && user && (
            <>
              <UserInfo>
                Logged in as: <strong>{user.username}</strong>
              </UserInfo>
              <Button onClick={handleLogout} title="Logout">
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </Button>
            </>
          )}
        </Actions>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
}
