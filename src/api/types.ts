import type { LocalizedText, Message } from '../types';

/** A profile as returned by the backend. */
export interface ApiProfile {
  id: string;
  email?: string;
  name: LocalizedText;
  avatarColor: string;
  initials: string;
  university: LocalizedText;
  major: LocalizedText;
  gradYear: number;
  city: string;
  occupation: LocalizedText;
  headline?: LocalizedText;
  immigrationYear?: number;
  verified?: boolean;
  openTo: string[];
}

/** A conversation as returned by the backend (title/avatar resolved per viewer). */
export interface ApiConversation {
  id: string;
  kind: 'direct' | 'group';
  title: LocalizedText;
  avatarColor: string;
  initials: string;
  participantIds: string[];
  lastMessage: LocalizedText;
  lastTime: string;
  unread: number;
  pinned?: boolean;
}

export interface ApiMessage extends Message {
  createdAt: number;
}

export interface AuthResponse {
  token: string;
  user: ApiProfile;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: LocalizedText | string;
  university?: LocalizedText;
  major?: LocalizedText;
  gradYear?: number;
  city?: string;
  occupation?: LocalizedText;
  immigrationYear?: number;
  openTo?: string[];
}

/** Events the server pushes over the WebSocket. */
export type ServerEvent =
  | { type: 'ready'; userId: string; onlineUserIds: string[] }
  | { type: 'message:new'; message: ApiMessage; clientId?: string }
  | { type: 'conversation:update'; conversation: ApiConversation }
  | { type: 'typing'; conversationId: string; userId: string }
  | { type: 'presence'; userId: string; online: boolean }
  | { type: 'pong' }
  | { type: 'error'; message: string };

/** Events the client sends over the WebSocket. */
export type ClientEvent =
  | { type: 'message:send'; conversationId: string; text: string; clientId?: string }
  | { type: 'typing'; conversationId: string }
  | { type: 'read'; conversationId: string }
  | { type: 'ping' };
