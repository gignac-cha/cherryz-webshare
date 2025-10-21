import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Breadcrumb = styled.button<{ isActive?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isActive ? props.theme.colors.textSecondary : props.theme.colors.primary};
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => !props.isActive ? props.theme.colors.hover : 'transparent'};
  }
`;

const Separator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const Info = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

interface FileDetailsProps {
  currentPath: string;
  itemCount: number;
  onNavigate: (path: string) => void;
}

export function FileDetails({ currentPath, itemCount, onNavigate }: FileDetailsProps) {
  const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      onNavigate('');
      return;
    }
    const newPath = pathParts.slice(0, index + 1).join('/');
    onNavigate(newPath);
  };

  return (
    <Container>
      <Breadcrumbs>
        <Breadcrumb
          onClick={() => handleBreadcrumbClick(-1)}
          isActive={pathParts.length === 0}
        >
          <FontAwesomeIcon icon={faHome} /> Home
        </Breadcrumb>

        {pathParts.map((part, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Separator>
              <FontAwesomeIcon icon={faChevronRight} />
            </Separator>
            <Breadcrumb
              onClick={() => handleBreadcrumbClick(index)}
              isActive={index === pathParts.length - 1}
            >
              {part}
            </Breadcrumb>
          </div>
        ))}
      </Breadcrumbs>

      <Info>
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in this folder
      </Info>
    </Container>
  );
}
