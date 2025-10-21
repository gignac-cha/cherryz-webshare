import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { LoginForm } from '../components/authentication/LoginForm.js';
import { useAuthentication } from '../hooks/useAuthentication.js';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
`;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthentication();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/files');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (username: string, password: string) => {
    await login({ username, password });
    navigate('/files');
  };

  return (
    <Container>
      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
}
