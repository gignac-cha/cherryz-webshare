import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/settings';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  FileItem,
  CreateDirectoryRequest,
  MoveFileRequest,
} from '@/types';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If JSON parsing fails, use default error message
    }

    throw new ApiError(errorMessage, response.status);
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(data.error || 'An error occurred');
  }

  return data.data as T;
}

// Authentication API
export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/authentication/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    return handleResponse<LoginResponse>(response);
  },

  async register(credentials: LoginRequest): Promise<{ id: string; username: string; role: string }> {
    const response = await fetch(`${API_BASE_URL}/authentication/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    return handleResponse<{ id: string; username: string; role: string }>(response);
  },
};

// File API
export const fileApi = {
  async listFiles(path?: string): Promise<FileItem[]> {
    const url = new URL(`${API_BASE_URL}/files`);
    if (path) {
      url.searchParams.set('path', path);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });

    return handleResponse<FileItem[]>(response);
  },

  async uploadFile(file: File, path?: string): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return handleResponse<FileItem>(response);
  },

  async createDirectory(data: CreateDirectoryRequest): Promise<FileItem> {
    const response = await fetch(`${API_BASE_URL}/files/directory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<FileItem>(response);
  },

  async moveFile(data: MoveFileRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/files/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    await handleResponse<void>(response);
  },

  async deleteFile(path: string): Promise<void> {
    const url = new URL(`${API_BASE_URL}/files`);
    url.searchParams.set('path', path);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<void>(response);
  },

  getDownloadUrl(path: string): string {
    const url = new URL(`${API_BASE_URL}/files/download`);
    url.searchParams.set('path', path);

    const token = getAuthToken();
    if (token) {
      url.searchParams.set('token', token);
    }

    return url.toString();
  },
};

export { ApiError };
