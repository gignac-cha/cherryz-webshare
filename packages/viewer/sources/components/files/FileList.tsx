import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFile,
  faDownload,
  faSearch,
  faSortAlphaDown,
  faSortAlphaUp,
  faSortAmountDown,
  faSortAmountUp,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { downloadFile } from '../../api/client.js';
import type { FileItem } from '../../types/index.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  flex: 1;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SortButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.hover};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Icon = styled.div<{ isDirectory?: boolean }>`
  color: ${props => props.isDirectory ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
`;

const FileName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FileMetadata = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  gap: 1rem;
`;

const DownloadButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

type SortBy = 'name' | 'size' | 'date';
type SortOrder = 'asc' | 'desc';

interface FileListProps {
  files: FileItem[];
  onNavigate: (path: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '-';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i] || 'B'}`;
}

export function FileList({ files, onNavigate }: FileListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(file =>
        file.name.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [files, searchQuery, sortBy, sortOrder]);

  const toggleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleItemClick = (file: FileItem) => {
    if (file.type === 'directory') {
      onNavigate(file.path);
    }
  };

  const handleDownload = (file: FileItem) => {
    downloadFile(file.path);
  };

  return (
    <Container>
      <Toolbar>
        <SearchBox>
          <FontAwesomeIcon icon={faSearch} />
          <SearchInput
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <SortButton
          active={sortBy === 'name'}
          onClick={() => toggleSort('name')}
        >
          <FontAwesomeIcon icon={sortBy === 'name' && sortOrder === 'desc' ? faSortAlphaUp : faSortAlphaDown} />
          Name
        </SortButton>

        <SortButton
          active={sortBy === 'size'}
          onClick={() => toggleSort('size')}
        >
          <FontAwesomeIcon icon={sortBy === 'size' && sortOrder === 'desc' ? faSortAmountUp : faSortAmountDown} />
          Size
        </SortButton>

        <SortButton
          active={sortBy === 'date'}
          onClick={() => toggleSort('date')}
        >
          <FontAwesomeIcon icon={sortBy === 'date' && sortOrder === 'desc' ? faSortAmountUp : faSortAmountDown} />
          Date
        </SortButton>
      </Toolbar>

      {filteredAndSortedFiles.length === 0 ? (
        <EmptyState>
          {searchQuery ? 'No files match your search.' : 'This folder is empty.'}
        </EmptyState>
      ) : (
        <List>
          {filteredAndSortedFiles.map((file) => (
            <ListItem key={file.path}>
              <Icon isDirectory={file.type === 'directory'}>
                <FontAwesomeIcon icon={file.type === 'directory' ? faFolder : faFile} />
              </Icon>

              <FileInfo onClick={() => handleItemClick(file)}>
                <FileName>{file.name}</FileName>
                <FileMetadata>
                  <span>Size: {formatFileSize(file.size)}</span>
                  <span>Modified: {dayjs(file.modifiedAt).format('MMM D, YYYY HH:mm')}</span>
                </FileMetadata>
              </FileInfo>

              {file.type === 'file' && (
                <DownloadButton onClick={() => handleDownload(file)}>
                  <FontAwesomeIcon icon={faDownload} />
                  Download
                </DownloadButton>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
