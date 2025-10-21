/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFile,
  faDownload,
  faTrash,
  faArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import type { Theme, FileItem } from '@/types';

interface FileListProps {
  files: FileItem[];
  theme: Theme;
  onNavigate: (path: string) => void;
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  isAdmin: boolean;
}

export function FileList({
  files,
  theme,
  onNavigate,
  onDownload,
  onDelete,
  onMove,
  isAdmin,
}: FileListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  if (files.length === 0) {
    return (
      <div
        css={css`
          padding: ${theme.spacing.xl};
          text-align: center;
          color: ${theme.colors.textSecondary};
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.md};
        `}
      >
        <FontAwesomeIcon icon={faFolder} size="3x" style={{ marginBottom: theme.spacing.md }} />
        <p>This folder is empty</p>
      </div>
    );
  }

  return (
    <div
      css={css`
        background: ${theme.colors.surface};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.md};
        overflow: hidden;
      `}
    >
      <table
        css={css`
          width: 100%;
          border-collapse: collapse;
        `}
      >
        <thead>
          <tr
            css={css`
              background: ${theme.colors.surfaceHover};
              border-bottom: 1px solid ${theme.colors.border};
            `}
          >
            <th
              css={css`
                padding: ${theme.spacing.md};
                text-align: left;
                font-weight: 600;
                color: ${theme.colors.text};
              `}
            >
              Name
            </th>
            <th
              css={css`
                padding: ${theme.spacing.md};
                text-align: left;
                font-weight: 600;
                color: ${theme.colors.text};
                width: 120px;
              `}
            >
              Size
            </th>
            <th
              css={css`
                padding: ${theme.spacing.md};
                text-align: left;
                font-weight: 600;
                color: ${theme.colors.text};
                width: 200px;
              `}
            >
              Modified
            </th>
            <th
              css={css`
                padding: ${theme.spacing.md};
                text-align: right;
                font-weight: 600;
                color: ${theme.colors.text};
                width: 150px;
              `}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.path}
              css={css`
                border-bottom: 1px solid ${theme.colors.border};
                transition: background 0.2s;

                &:hover {
                  background: ${theme.colors.surfaceHover};
                }

                &:last-child {
                  border-bottom: none;
                }
              `}
            >
              <td
                css={css`
                  padding: ${theme.spacing.md};
                `}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    gap: ${theme.spacing.md};
                    cursor: ${file.type === 'directory' ? 'pointer' : 'default'};
                    color: ${theme.colors.text};
                  `}
                  onClick={() => file.type === 'directory' && onNavigate(file.path)}
                >
                  <FontAwesomeIcon
                    icon={file.type === 'directory' ? faFolder : faFile}
                    css={css`
                      color: ${file.type === 'directory' ? theme.colors.warning : theme.colors.textSecondary};
                    `}
                  />
                  <span>{file.name}</span>
                </div>
              </td>
              <td
                css={css`
                  padding: ${theme.spacing.md};
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                {formatFileSize(file.size)}
              </td>
              <td
                css={css`
                  padding: ${theme.spacing.md};
                  color: ${theme.colors.textSecondary};
                  font-size: 0.875rem;
                `}
              >
                {dayjs(file.modifiedAt).format('MMM D, YYYY h:mm A')}
              </td>
              <td
                css={css`
                  padding: ${theme.spacing.md};
                  text-align: right;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    gap: ${theme.spacing.sm};
                    justify-content: flex-end;
                  `}
                >
                  {file.type === 'file' && (
                    <button
                      onClick={() => onDownload(file)}
                      title="Download"
                      css={css`
                        background: none;
                        border: none;
                        color: ${theme.colors.primary};
                        cursor: pointer;
                        padding: ${theme.spacing.sm};
                        border-radius: ${theme.borderRadius.sm};
                        transition: all 0.2s;

                        &:hover {
                          background: ${theme.colors.primary}22;
                        }
                      `}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onMove(file)}
                        title="Move"
                        css={css`
                          background: none;
                          border: none;
                          color: ${theme.colors.primary};
                          cursor: pointer;
                          padding: ${theme.spacing.sm};
                          border-radius: ${theme.borderRadius.sm};
                          transition: all 0.2s;

                          &:hover {
                            background: ${theme.colors.primary}22;
                          }
                        `}
                      >
                        <FontAwesomeIcon icon={faArrowsAlt} />
                      </button>
                      <button
                        onClick={() => onDelete(file)}
                        title="Delete"
                        css={css`
                          background: none;
                          border: none;
                          color: ${theme.colors.error};
                          cursor: pointer;
                          padding: ${theme.spacing.sm};
                          border-radius: ${theme.borderRadius.sm};
                          transition: all 0.2s;

                          &:hover {
                            background: ${theme.colors.error}22;
                          }
                        `}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
