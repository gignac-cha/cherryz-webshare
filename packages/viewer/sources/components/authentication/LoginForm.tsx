import { useState, FormEvent } from 'react';
import styled from '@emotion/styled';
import * as Label from '@radix-ui/react-label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLabel = styled(Label.Root)`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.error}20;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 4px;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Login to Cherryz WebShare</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Field>
        <StyledLabel htmlFor="username">Username</StyledLabel>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          autoComplete="username"
          disabled={isLoading}
        />
      </Field>

      <Field>
        <StyledLabel htmlFor="password">Password</StyledLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
      </Field>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            Logging in...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSignInAlt} />
            Login
          </>
        )}
      </Button>
    </Form>
  );
}
