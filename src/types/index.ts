export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  modifiedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
