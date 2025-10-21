/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as Progress from '@radix-ui/react-progress';
import type { Theme } from '@/types';

interface FileUploadProps {
  theme: Theme;
  currentPath: string;
  onUpload: (file: File, path: string) => Promise<void>;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function FileUpload({ theme, currentPath, onUpload, onSuccess, onError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate progress (in a real implementation, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(selectedFile, currentPath);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setSelectedFile(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onSuccess();
      }, 500);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      css={css`
        background: ${theme.colors.surface};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.md};
        padding: ${theme.spacing.lg};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.md};
      `}
    >
      <div
        css={css`
          display: flex;
          gap: ${theme.spacing.md};
          align-items: flex-start;
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          css={css`
            flex: 1;
            padding: ${theme.spacing.sm};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.md};
            background: ${theme.colors.background};
            color: ${theme.colors.text};
            cursor: pointer;

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            &::file-selector-button {
              background: ${theme.colors.primary};
              color: white;
              border: none;
              padding: ${theme.spacing.sm} ${theme.spacing.md};
              border-radius: ${theme.borderRadius.sm};
              cursor: pointer;
              margin-right: ${theme.spacing.md};

              &:hover {
                background: ${theme.colors.primaryHover};
              }
            }
          `}
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          css={css`
            padding: ${theme.spacing.sm} ${theme.spacing.lg};
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
            white-space: nowrap;

            &:hover:not(:disabled) {
              background: ${theme.colors.primaryHover};
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}
        >
          {isUploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>

      {isUploading && (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing.sm};
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 0.875rem;
              color: ${theme.colors.textSecondary};
            `}
          >
            <span>{selectedFile?.name}</span>
            <span>{progress}%</span>
          </div>
          <Progress.Root
            value={progress}
            css={css`
              position: relative;
              overflow: hidden;
              background: ${theme.colors.background};
              border-radius: ${theme.borderRadius.sm};
              width: 100%;
              height: 8px;
            `}
          >
            <Progress.Indicator
              css={css`
                background: ${theme.colors.primary};
                width: 100%;
                height: 100%;
                transition: transform 0.3s cubic-bezier(0.65, 0, 0.35, 1);
              `}
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>
      )}
    </div>
  );
}
