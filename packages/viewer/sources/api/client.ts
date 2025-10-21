import { API_BASE_URL, AUTH_TOKEN_KEY } from '../settings/index.js';
import type {
  LoginRequest,
  LoginResponse,
  FilesResponse,
  ErrorResponse,
} from '../types/index.js';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new ApiError(
      errorData.error || 'An error occurred',
      response.status,
    );
  }

  return data as T;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/authentication/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getFiles(path: string = ''): Promise<FilesResponse> {
  const queryParam = path ? `?path=${encodeURIComponent(path)}` : '';
  return fetchApi<FilesResponse>(`/files${queryParam}`);
}

export function getDownloadUrl(path: string): string {
  const token = getAuthToken();
  const url = new URL(`${API_BASE_URL}/files/download`);
  url.searchParams.set('path', path);
  if (token) {
    url.searchParams.set('token', token);
  }
  return url.toString();
}

export function downloadFile(path: string): void {
  const url = getDownloadUrl(path);
  const link = document.createElement('a');
  link.href = url;
  link.download = path.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { ApiError };
