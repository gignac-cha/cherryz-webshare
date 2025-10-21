// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// File Types
export type FileType = 'file' | 'directory';

export interface FileItem {
  name: string;
  path: string;
  size: number;
  type: FileType;
  modifiedAt: string;
}

export interface UploadFileRequest {
  file: File;
  path?: string;
}

export interface CreateDirectoryRequest {
  path: string;
}

export interface MoveFileRequest {
  sourcePath: string;
  destPath: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    error: string;
    errorHover: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}
