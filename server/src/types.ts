export interface LocalizedText {
  zh: string;
  en: string;
}

export interface PublicProfile {
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

export interface ConversationDTO {
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

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  text: LocalizedText;
  time: string;
  createdAt: number;
  system?: boolean;
}

/** Messages sent from client to server over the WebSocket. */
export type ClientEvent =
  | { type: 'message:send'; conversationId: string; text: string; clientId?: string }
  | { type: 'typing'; conversationId: string }
  | { type: 'read'; conversationId: string }
  | { type: 'ping' };

/** Messages sent from server to client over the WebSocket. */
export type ServerEvent =
  | { type: 'ready'; userId: string; onlineUserIds: string[] }
  | { type: 'message:new'; message: MessageDTO; clientId?: string }
  | { type: 'conversation:update'; conversation: ConversationDTO }
  | { type: 'typing'; conversationId: string; userId: string }
  | { type: 'presence'; userId: string; online: boolean }
  | { type: 'pong' }
  | { type: 'error'; message: string };
