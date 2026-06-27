import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang, LocalizedText, Message } from '../types';
import { strings, type StringKey } from '../i18n/strings';
import { useAuth } from './AuthContext';
import { api } from '../api/client';
import { realtime } from '../api/socket';
import type { ApiConversation, ApiMessage, ServerEvent } from '../api/types';

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: StringKey) => string;
  tx: (value: LocalizedText | undefined) => string;

  currentUserId: string;

  // Voting (local, session-persistent)
  votes: Record<string, string>;
  castVote: (pollId: string, optionId: string) => void;

  // Messaging (backed by the server + realtime socket)
  connected: boolean;
  conversations: ApiConversation[];
  conversationById: (id: string) => ApiConversation | undefined;
  messages: Record<string, Message[]>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => void;
  sendTyping: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
  openDirectChat: (userId: string) => Promise<string | null>;
  typingByConversation: Record<string, boolean>;
  onlineUserIds: Set<string>;
}

const AppContext = createContext<AppState | undefined>(undefined);

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { token, currentUserId: authUserId } = useAuth();
  const currentUserId = authUserId ?? 'me';

  const [lang, setLang] = useState<Lang>('zh');
  const [votes, setVotes] = useState<Record<string, string>>({});

  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [typingByConversation, setTypingByConversation] = useState<Record<string, boolean>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const toggleLang = useCallback(() => setLang((l) => (l === 'zh' ? 'en' : 'zh')), []);
  const t = useCallback((key: StringKey) => strings[key][lang], [lang]);
  const tx = useCallback((value: LocalizedText | undefined) => (value ? value[lang] : ''), [lang]);

  const castVote = useCallback((pollId: string, optionId: string) => {
    setVotes((prev) => (prev[pollId] ? prev : { ...prev, [pollId]: optionId }));
  }, []);

  const upsertConversation = useCallback((conv: ApiConversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      if (idx === -1) return [conv, ...prev];
      const next = [...prev];
      next[idx] = conv;
      return next;
    });
  }, []);

  const appendMessage = useCallback((incoming: ApiMessage, clientId?: string) => {
    setMessages((prev) => {
      const list = prev[incoming.conversationId] ?? [];
      // Replace an optimistic placeholder if its clientId matches.
      if (clientId) {
        const tempIdx = list.findIndex((m) => m.id === clientId);
        if (tempIdx !== -1) {
          const next = [...list];
          next[tempIdx] = incoming;
          return { ...prev, [incoming.conversationId]: next };
        }
      }
      if (list.some((m) => m.id === incoming.id)) return prev; // de-dupe
      return { ...prev, [incoming.conversationId]: [...list, incoming] };
    });
  }, []);

  const flagTyping = useCallback((conversationId: string) => {
    setTypingByConversation((prev) => ({ ...prev, [conversationId]: true }));
    clearTimeout(typingTimers.current[conversationId]);
    typingTimers.current[conversationId] = setTimeout(() => {
      setTypingByConversation((prev) => ({ ...prev, [conversationId]: false }));
    }, 3500);
  }, []);

  // Wire the realtime socket to the auth session.
  useEffect(() => {
    if (!token) {
      realtime.disconnect();
      setConnected(false);
      setConversations([]);
      setMessages({});
      setOnlineUserIds(new Set());
      return;
    }

    const offStatus = realtime.onStatus(setConnected);
    const offEvent = realtime.onEvent((event: ServerEvent) => {
      switch (event.type) {
        case 'ready':
          setOnlineUserIds(new Set(event.onlineUserIds));
          break;
        case 'presence':
          setOnlineUserIds((prev) => {
            const next = new Set(prev);
            if (event.online) next.add(event.userId);
            else next.delete(event.userId);
            return next;
          });
          break;
        case 'message:new':
          appendMessage(event.message, event.clientId);
          break;
        case 'conversation:update':
          upsertConversation(event.conversation);
          break;
        case 'typing':
          flagTyping(event.conversationId);
          break;
        default:
          break;
      }
    });

    realtime.connect(token);
    api
      .conversations(token)
      .then(({ conversations: list }) => setConversations(list))
      .catch(() => {/* surfaced elsewhere; keep UI usable */});

    return () => {
      offStatus();
      offEvent();
    };
  }, [token, appendMessage, upsertConversation, flagTyping]);

  const conversationById = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations],
  );

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!token) return;
      try {
        const { messages: list } = await api.messages(token, conversationId);
        setMessages((prev) => ({ ...prev, [conversationId]: list }));
      } catch {
        /* leave any existing messages in place */
      }
    },
    [token],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const clientId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      // Optimistic append so the sender sees their message instantly.
      const optimistic: Message = {
        id: clientId,
        conversationId,
        senderId: currentUserId,
        text: { zh: trimmed, en: trimmed },
        time: nowTime(),
      };
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), optimistic],
      }));
      realtime.send({ type: 'message:send', conversationId, text: trimmed, clientId });
    },
    [currentUserId],
  );

  const sendTyping = useCallback((conversationId: string) => {
    realtime.send({ type: 'typing', conversationId });
  }, []);

  const markRead = useCallback(
    (conversationId: string) => {
      realtime.send({ type: 'read', conversationId });
      // Optimistically clear the local unread badge.
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)),
      );
    },
    [],
  );

  const openDirectChat = useCallback(
    async (userId: string): Promise<string | null> => {
      if (!token) return null;
      try {
        const { conversation } = await api.openDirect(token, userId);
        upsertConversation(conversation);
        return conversation.id;
      } catch {
        return null;
      }
    },
    [token, upsertConversation],
  );

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      tx,
      currentUserId,
      votes,
      castVote,
      connected,
      conversations,
      conversationById,
      messages,
      loadMessages,
      sendMessage,
      sendTyping,
      markRead,
      openDirectChat,
      typingByConversation,
      onlineUserIds,
    }),
    [
      lang,
      toggleLang,
      t,
      tx,
      currentUserId,
      votes,
      castVote,
      connected,
      conversations,
      conversationById,
      messages,
      loadMessages,
      sendMessage,
      sendTyping,
      markRead,
      openDirectChat,
      typingByConversation,
      onlineUserIds,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
