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
  success: true;
  data: {
    token: string;
    user: User;
  };
}

export interface FileItem {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  modifiedAt: string;
}

export interface FilesResponse {
  success: true;
  data: FileItem[];
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = T | ErrorResponse;
