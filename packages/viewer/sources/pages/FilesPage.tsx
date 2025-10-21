import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { getFiles } from '../api/client.js';
import { FileList } from '../components/files/FileList.js';
import { FileDetails } from '../components/files/FileDetails.js';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: ${props => props.theme.colors.error};
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

export function FilesPage() {
  const navigate = useNavigate();
  const params = useParams();

  const currentPath = params['*'] || '';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => getFiles(currentPath),
  });

  const handleNavigate = (path: string) => {
    navigate(`/files/${path}`);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <div>Loading files...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <FontAwesomeIcon icon={faExclamationCircle} size="3x" />
        <div>Failed to load files</div>
        <div style={{ fontSize: '0.875rem' }}>
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </div>
        <RetryButton onClick={() => refetch()}>Retry</RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <FileDetails
        currentPath={currentPath}
        itemCount={data?.data.length || 0}
        onNavigate={handleNavigate}
      />
      <FileList files={data?.data || []} onNavigate={handleNavigate} />
    </Container>
  );
}
