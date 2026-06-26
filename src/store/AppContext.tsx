import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Lang, LocalizedText, Message } from '../types';
import { strings, type StringKey } from '../i18n/strings';
import { currentUser } from '../data/profiles';
import { seedMessages } from '../data/conversations';

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Translate a UI string key. */
  t: (key: StringKey) => string;
  /** Resolve a bilingual content object to the active language. */
  tx: (value: LocalizedText | undefined) => string;

  currentUserId: string;

  // Live voting state: pollId -> selected optionId
  votes: Record<string, string>;
  castVote: (pollId: string, optionId: string) => void;

  // Live messages keyed by conversation id
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => ({ ...seedMessages }));

  const toggleLang = useCallback(() => setLang((l) => (l === 'zh' ? 'en' : 'zh')), []);

  const t = useCallback((key: StringKey) => strings[key][lang], [lang]);
  const tx = useCallback(
    (value: LocalizedText | undefined) => (value ? value[lang] : ''),
    [lang],
  );

  const castVote = useCallback((pollId: string, optionId: string) => {
    setVotes((prev) => (prev[pollId] ? prev : { ...prev, [pollId]: optionId }));
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: 'me',
      text: { zh: trimmed, en: trimmed },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), msg],
    }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      tx,
      currentUserId: currentUser.id,
      votes,
      castVote,
      messages,
      sendMessage,
    }),
    [lang, toggleLang, t, tx, votes, castVote, messages, sendMessage],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
