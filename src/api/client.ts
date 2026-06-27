import { API_BASE_URL } from './config';
import type {
  ApiConversation,
  ApiMessage,
  ApiProfile,
  AuthResponse,
  RegisterPayload,
} from './types';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Network request failed. Is the server running?');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register(payload: RegisterPayload) {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  me(token: string) {
    return request<{ user: ApiProfile }>('/api/auth/me', { token });
  },

  profiles(token: string) {
    return request<{ profiles: ApiProfile[] }>('/api/profiles', { token });
  },

  conversations(token: string) {
    return request<{ conversations: ApiConversation[] }>('/api/conversations', { token });
  },

  messages(token: string, conversationId: string) {
    return request<{ messages: ApiMessage[] }>(
      `/api/conversations/${conversationId}/messages`,
      { token },
    );
  },

  openDirect(token: string, userId: string) {
    return request<{ conversation: ApiConversation }>(
      `/api/conversations/direct/${userId}`,
      { method: 'POST', token },
    );
  },

  markRead(token: string, conversationId: string) {
    return request<{ conversation: ApiConversation }>(
      `/api/conversations/${conversationId}/read`,
      { method: 'POST', token },
    );
  },
};
