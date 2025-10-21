/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fileApi } from '@/api/client';
import { FileList } from '@/components/files/FileList';
import { FileUpload } from '@/components/files/FileUpload';
import { FileActions } from '@/components/files/FileActions';
import type { Theme, AuthState, FileItem } from '@/types';
import { ROUTES } from '@/settings';

interface FilesPageProps {
  theme: Theme;
  auth: AuthState;
  onToast: (variant: 'success' | 'error', title: string, description?: string) => void;
}

export function FilesPage({ theme, auth, onToast }: FilesPageProps) {
  const params = useParams<{ '*': string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentPath = params['*'] || '';
  const isAdmin = auth.user?.role === 'admin';

  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [fileToMove, setFileToMove] = useState<FileItem | null>(null);

  // Fetch files query
  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => fileApi.listFiles(currentPath),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, path }: { file: File; path: string }) => fileApi.uploadFile(file, path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] });
    },
  });

  // Create directory mutation
  const createDirMutation = useMutation({
    mutationFn: (path: string) => fileApi.createDirectory({ path }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (path: string) => fileApi.deleteFile(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] });
    },
  });

  // Move mutation
  const moveMutation = useMutation({
    mutationFn: ({ sourcePath, destPath }: { sourcePath: string; destPath: string }) =>
      fileApi.moveFile({ sourcePath, destPath }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] });
    },
  });

  // Breadcrumb navigation
  const breadcrumbs = currentPath
    ? currentPath.split('/').reduce((acc, part, index, arr) => {
        const path = arr.slice(0, index + 1).join('/');
        acc.push({ name: part, path });
        return acc;
      }, [] as { name: string; path: string }[])
    : [];

  const handleNavigate = (path: string) => {
    navigate(`${ROUTES.FILES}/${path}`);
  };

  const handleDownload = (file: FileItem) => {
    const url = fileApi.getDownloadUrl(file.path);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (file: File, path: string) => {
    await uploadMutation.mutateAsync({ file, path });
  };

  const handleCreateDirectory = async (path: string) => {
    await createDirMutation.mutateAsync(path);
  };

  const handleDelete = async (path: string) => {
    await deleteMutation.mutateAsync(path);
  };

  const handleMove = async (sourcePath: string, destPath: string) => {
    await moveMutation.mutateAsync({ sourcePath, destPath });
  };

  if (error) {
    return (
      <div
        css={css`
          padding: ${theme.spacing.xl};
          text-align: center;
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.error};
          border-radius: ${theme.borderRadius.md};
          color: ${theme.colors.error};
        `}
      >
        <p>Error loading files: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.lg};
      `}
    >
      {/* Header */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: ${theme.spacing.md};
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
            File Browser
          </h1>

          {/* Breadcrumbs */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: ${theme.spacing.sm};
              color: ${theme.colors.textSecondary};
            `}
          >
            <button
              onClick={() => navigate(ROUTES.FILES)}
              css={css`
                background: none;
                border: none;
                color: ${theme.colors.primary};
                cursor: pointer;
                padding: ${theme.spacing.xs} ${theme.spacing.sm};
                border-radius: ${theme.borderRadius.sm};
                display: flex;
                align-items: center;
                gap: ${theme.spacing.xs};
                transition: all 0.2s;

                &:hover {
                  background: ${theme.colors.primary}22;
                }
              `}
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Root</span>
            </button>

            {breadcrumbs.map((crumb) => (
              <div
                key={crumb.path}
                css={css`
                  display: flex;
                  align-items: center;
                  gap: ${theme.spacing.sm};
                `}
              >
                <FontAwesomeIcon icon={faChevronRight} size="sm" />
                <button
                  onClick={() => handleNavigate(crumb.path)}
                  css={css`
                    background: none;
                    border: none;
                    color: ${theme.colors.primary};
                    cursor: pointer;
                    padding: ${theme.spacing.xs} ${theme.spacing.sm};
                    border-radius: ${theme.borderRadius.sm};
                    transition: all 0.2s;

                    &:hover {
                      background: ${theme.colors.primary}22;
                    }
                  `}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <FileActions
            theme={theme}
            currentPath={currentPath}
            onCreateDirectory={handleCreateDirectory}
            onDeleteFile={handleDelete}
            onMoveFile={handleMove}
            fileToDelete={fileToDelete}
            fileToMove={fileToMove}
            onCancelDelete={() => setFileToDelete(null)}
            onCancelMove={() => setFileToMove(null)}
            onSuccess={() => {
              onToast('success', 'Success', 'Operation completed successfully');
            }}
            onError={(error) => {
              onToast('error', 'Error', error);
            }}
          />
        )}
      </div>

      {/* Upload Section (Admin Only) */}
      {isAdmin && (
        <FileUpload
          theme={theme}
          currentPath={currentPath}
          onUpload={handleUpload}
          onSuccess={() => {
            onToast('success', 'File uploaded', 'File uploaded successfully');
          }}
          onError={(error) => {
            onToast('error', 'Upload failed', error);
          }}
        />
      )}

      {/* File List */}
      {isLoading ? (
        <div
          css={css`
            padding: ${theme.spacing.xl};
            text-align: center;
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.md};
            color: ${theme.colors.textSecondary};
          `}
        >
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p css={css`margin-top: ${theme.spacing.md};`}>Loading files...</p>
        </div>
      ) : (
        <FileList
          files={files || []}
          theme={theme}
          onNavigate={handleNavigate}
          onDownload={handleDownload}
          onDelete={setFileToDelete}
          onMove={setFileToMove}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
