/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import type { Theme } from '@/types';
import type { Toast as ToastType } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
  theme: Theme;
}

const getIcon = (variant: ToastType['variant']) => {
  switch (variant) {
    case 'success':
      return faCheckCircle;
    case 'error':
      return faExclamationCircle;
    case 'warning':
      return faExclamationTriangle;
    case 'info':
      return faInfoCircle;
  }
};

const getColor = (variant: ToastType['variant'], theme: Theme) => {
  switch (variant) {
    case 'success':
      return theme.colors.success;
    case 'error':
      return theme.colors.error;
    case 'warning':
      return theme.colors.warning;
    case 'info':
      return theme.colors.primary;
  }
};

export function Toast({ toast, onClose, theme }: ToastProps) {
  const icon = getIcon(toast.variant);
  const color = getColor(toast.variant, theme);

  return (
    <ToastPrimitive.Root
      css={css`
        background: ${theme.colors.surface};
        border: 1px solid ${theme.colors.border};
        border-left: 4px solid ${color};
        border-radius: ${theme.borderRadius.md};
        padding: ${theme.spacing.md};
        display: flex;
        align-items: flex-start;
        gap: ${theme.spacing.md};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 300px;
        max-width: 500px;

        &[data-state='open'] {
          animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        &[data-state='closed'] {
          animation: hide 100ms ease-in;
        }

        @keyframes slideIn {
          from {
            transform: translateX(calc(100% + 24px));
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes hide {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}
    >
      <div
        css={css`
          color: ${color};
          flex-shrink: 0;
        `}
      >
        <FontAwesomeIcon icon={icon} />
      </div>

      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.xs};
        `}
      >
        <ToastPrimitive.Title
          css={css`
            font-weight: 600;
            color: ${theme.colors.text};
            margin: 0;
          `}
        >
          {toast.title}
        </ToastPrimitive.Title>
        {toast.description && (
          <ToastPrimitive.Description
            css={css`
              color: ${theme.colors.textSecondary};
              font-size: 0.875rem;
              margin: 0;
            `}
          >
            {toast.description}
          </ToastPrimitive.Description>
        )}
      </div>

      <ToastPrimitive.Close
        css={css`
          background: none;
          border: none;
          color: ${theme.colors.textSecondary};
          cursor: pointer;
          padding: ${theme.spacing.xs};
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: ${theme.borderRadius.sm};
          transition: all 0.2s;

          &:hover {
            background: ${theme.colors.surfaceHover};
            color: ${theme.colors.text};
          }
        `}
        onClick={() => onClose(toast.id)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

interface ToastProviderProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
  theme: Theme;
  children: React.ReactNode;
}

export function ToastProvider({ toasts, onClose, theme, children }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} theme={theme} />
      ))}
      <ToastPrimitive.Viewport
        css={css`
          position: fixed;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          padding: ${theme.spacing.lg};
          gap: ${theme.spacing.md};
          width: 390px;
          max-width: 100vw;
          margin: 0;
          list-style: none;
          z-index: 2147483647;
          outline: none;
        `}
      />
    </ToastPrimitive.Provider>
  );
}
