/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderPlus,
  faTrash,
  faArrowsAlt,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import * as Dialog from '@radix-ui/react-dialog';
import * as Label from '@radix-ui/react-label';
import type { Theme, FileItem } from '@/types';

interface FileActionsProps {
  theme: Theme;
  currentPath: string;
  onCreateDirectory: (path: string) => Promise<void>;
  onDeleteFile: (path: string) => Promise<void>;
  onMoveFile: (sourcePath: string, destPath: string) => Promise<void>;
  fileToDelete: FileItem | null;
  fileToMove: FileItem | null;
  onCancelDelete: () => void;
  onCancelMove: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function FileActions({
  theme,
  currentPath,
  onCreateDirectory,
  onDeleteFile,
  onMoveFile,
  fileToDelete,
  fileToMove,
  onCancelDelete,
  onCancelMove,
  onSuccess,
  onError,
}: FileActionsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDirName, setNewDirName] = useState('');
  const [moveDestPath, setMoveDestPath] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleCreateDirectory = async () => {
    if (!newDirName.trim()) {
      onError('Please enter a directory name');
      return;
    }

    setIsCreating(true);

    try {
      const dirPath = currentPath ? `${currentPath}/${newDirName}` : newDirName;
      await onCreateDirectory(dirPath);
      setNewDirName('');
      setShowCreateDialog(false);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create directory');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);

    try {
      await onDeleteFile(fileToDelete.path);
      onCancelDelete();
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async () => {
    if (!fileToMove || !moveDestPath.trim()) {
      onError('Please enter a destination path');
      return;
    }

    setIsMoving(true);

    try {
      await onMoveFile(fileToMove.path, moveDestPath);
      setMoveDestPath('');
      onCancelMove();
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to move');
    } finally {
      setIsMoving(false);
    }
  };

  const buttonStyle = css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    background: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  const dialogContentStyle = css`
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    box-shadow: 0 10px 38px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 500px;
    max-height: 85vh;
    z-index: 1000;
  `;

  const dialogOverlayStyle = css`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
    z-index: 999;
  `;

  return (
    <>
      <button onClick={() => setShowCreateDialog(true)} css={buttonStyle}>
        <FontAwesomeIcon icon={faFolderPlus} />
        <span>New Folder</span>
      </button>

      {/* Create Directory Dialog */}
      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <Dialog.Portal>
          <Dialog.Overlay css={dialogOverlayStyle} />
          <Dialog.Content css={dialogContentStyle}>
            <Dialog.Title
              css={css`
                font-size: 1.25rem;
                font-weight: 600;
                color: ${theme.colors.text};
                margin: 0 0 ${theme.spacing.lg} 0;
              `}
            >
              Create New Folder
            </Dialog.Title>

            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: ${theme.spacing.md};
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: ${theme.spacing.sm};
                `}
              >
                <Label.Root
                  htmlFor="dirname"
                  css={css`
                    font-weight: 500;
                    color: ${theme.colors.text};
                  `}
                >
                  Folder Name
                </Label.Root>
                <input
                  id="dirname"
                  type="text"
                  value={newDirName}
                  onChange={(e) => setNewDirName(e.target.value)}
                  disabled={isCreating}
                  placeholder="Enter folder name"
                  css={css`
                    padding: ${theme.spacing.md};
                    border: 1px solid ${theme.colors.border};
                    border-radius: ${theme.borderRadius.md};
                    background: ${theme.colors.background};
                    color: ${theme.colors.text};
                    font-size: 1rem;

                    &:focus {
                      outline: none;
                      border-color: ${theme.colors.primary};
                    }

                    &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                  `}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDirectory()}
                />
              </div>

              <div
                css={css`
                  display: flex;
                  gap: ${theme.spacing.md};
                  justify-content: flex-end;
                  margin-top: ${theme.spacing.md};
                `}
              >
                <button
                  onClick={() => setShowCreateDialog(false)}
                  disabled={isCreating}
                  css={css`
                    padding: ${theme.spacing.sm} ${theme.spacing.md};
                    background: ${theme.colors.background};
                    color: ${theme.colors.text};
                    border: 1px solid ${theme.colors.border};
                    border-radius: ${theme.borderRadius.md};
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;

                    &:hover:not(:disabled) {
                      background: ${theme.colors.surfaceHover};
                    }

                    &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                  `}
                >
                  Cancel
                </button>
                <button onClick={handleCreateDirectory} disabled={isCreating} css={buttonStyle}>
                  {isCreating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFolderPlus} />
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <Dialog.Close
              css={css`
                position: absolute;
                top: ${theme.spacing.md};
                right: ${theme.spacing.md};
                background: none;
                border: none;
                color: ${theme.colors.textSecondary};
                cursor: pointer;
                padding: ${theme.spacing.sm};
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: ${theme.borderRadius.sm};

                &:hover {
                  background: ${theme.colors.surfaceHover};
                  color: ${theme.colors.text};
                }
              `}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={!!fileToDelete} onOpenChange={(open) => !open && onCancelDelete()}>
        <Dialog.Portal>
          <Dialog.Overlay css={dialogOverlayStyle} />
          <Dialog.Content css={dialogContentStyle}>
            <Dialog.Title
              css={css`
                font-size: 1.25rem;
                font-weight: 600;
                color: ${theme.colors.text};
                margin: 0 0 ${theme.spacing.lg} 0;
              `}
            >
              Delete {fileToDelete?.type === 'directory' ? 'Folder' : 'File'}
            </Dialog.Title>

            <p
              css={css`
                color: ${theme.colors.text};
                margin: 0 0 ${theme.spacing.lg} 0;
              `}
            >
              Are you sure you want to delete <strong>{fileToDelete?.name}</strong>? This action
              cannot be undone.
            </p>

            <div
              css={css`
                display: flex;
                gap: ${theme.spacing.md};
                justify-content: flex-end;
              `}
            >
              <button
                onClick={onCancelDelete}
                disabled={isDeleting}
                css={css`
                  padding: ${theme.spacing.sm} ${theme.spacing.md};
                  background: ${theme.colors.background};
                  color: ${theme.colors.text};
                  border: 1px solid ${theme.colors.border};
                  border-radius: ${theme.borderRadius.md};
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;

                  &:hover:not(:disabled) {
                    background: ${theme.colors.surfaceHover};
                  }

                  &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                  }
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                css={css`
                  padding: ${theme.spacing.sm} ${theme.spacing.md};
                  background: ${theme.colors.error};
                  color: white;
                  border: none;
                  border-radius: ${theme.borderRadius.md};
                  font-weight: 600;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: ${theme.spacing.sm};
                  transition: all 0.2s;

                  &:hover:not(:disabled) {
                    background: ${theme.colors.errorHover};
                  }

                  &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                  }
                `}
              >
                {isDeleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>

            <Dialog.Close
              css={css`
                position: absolute;
                top: ${theme.spacing.md};
                right: ${theme.spacing.md};
                background: none;
                border: none;
                color: ${theme.colors.textSecondary};
                cursor: pointer;
                padding: ${theme.spacing.sm};
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: ${theme.borderRadius.sm};

                &:hover {
                  background: ${theme.colors.surfaceHover};
                  color: ${theme.colors.text};
                }
              `}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Move File Dialog */}
      <Dialog.Root open={!!fileToMove} onOpenChange={(open) => !open && onCancelMove()}>
        <Dialog.Portal>
          <Dialog.Overlay css={dialogOverlayStyle} />
          <Dialog.Content css={dialogContentStyle}>
            <Dialog.Title
              css={css`
                font-size: 1.25rem;
                font-weight: 600;
                color: ${theme.colors.text};
                margin: 0 0 ${theme.spacing.lg} 0;
              `}
            >
              Move {fileToMove?.type === 'directory' ? 'Folder' : 'File'}
            </Dialog.Title>

            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: ${theme.spacing.md};
              `}
            >
              <div
                css={css`
                  padding: ${theme.spacing.md};
                  background: ${theme.colors.background};
                  border-radius: ${theme.borderRadius.md};
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                Current path: <strong css={css`color: ${theme.colors.text};`}>{fileToMove?.path}</strong>
              </div>

              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: ${theme.spacing.sm};
                `}
              >
                <Label.Root
                  htmlFor="destpath"
                  css={css`
                    font-weight: 500;
                    color: ${theme.colors.text};
                  `}
                >
                  Destination Path
                </Label.Root>
                <input
                  id="destpath"
                  type="text"
                  value={moveDestPath}
                  onChange={(e) => setMoveDestPath(e.target.value)}
                  disabled={isMoving}
                  placeholder="e.g., folder/subfolder/filename.txt"
                  css={css`
                    padding: ${theme.spacing.md};
                    border: 1px solid ${theme.colors.border};
                    border-radius: ${theme.borderRadius.md};
                    background: ${theme.colors.background};
                    color: ${theme.colors.text};
                    font-size: 1rem;

                    &:focus {
                      outline: none;
                      border-color: ${theme.colors.primary};
                    }

                    &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                  `}
                  onKeyDown={(e) => e.key === 'Enter' && handleMove()}
                />
              </div>

              <div
                css={css`
                  display: flex;
                  gap: ${theme.spacing.md};
                  justify-content: flex-end;
                  margin-top: ${theme.spacing.md};
                `}
              >
                <button
                  onClick={onCancelMove}
                  disabled={isMoving}
                  css={css`
                    padding: ${theme.spacing.sm} ${theme.spacing.md};
                    background: ${theme.colors.background};
                    color: ${theme.colors.text};
                    border: 1px solid ${theme.colors.border};
                    border-radius: ${theme.borderRadius.md};
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;

                    &:hover:not(:disabled) {
                      background: ${theme.colors.surfaceHover};
                    }

                    &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                  `}
                >
                  Cancel
                </button>
                <button onClick={handleMove} disabled={isMoving} css={buttonStyle}>
                  {isMoving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Moving...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faArrowsAlt} />
                      <span>Move</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <Dialog.Close
              css={css`
                position: absolute;
                top: ${theme.spacing.md};
                right: ${theme.spacing.md};
                background: none;
                border: none;
                color: ${theme.colors.textSecondary};
                cursor: pointer;
                padding: ${theme.spacing.sm};
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: ${theme.borderRadius.sm};

                &:hover {
                  background: ${theme.colors.surfaceHover};
                  color: ${theme.colors.text};
                }
              `}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
