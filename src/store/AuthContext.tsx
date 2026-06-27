import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';
import type { ApiProfile, RegisterPayload } from '../api/types';

const TOKEN_KEY = 'alumni_token';

type AuthStatus = 'loading' | 'authed' | 'guest';

interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: ApiProfile | null;
  currentUserId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* storage unavailable (e.g. web) — session stays in memory only */
  }
}

async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiProfile | null>(null);

  // Restore a saved session on launch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let saved: string | null = null;
      try {
        saved = await SecureStore.getItemAsync(TOKEN_KEY);
      } catch {
        saved = null;
      }
      if (!saved) {
        if (!cancelled) setStatus('guest');
        return;
      }
      try {
        const { user: me } = await api.me(saved);
        if (cancelled) return;
        setToken(saved);
        setUser(me);
        setStatus('authed');
      } catch {
        await clearToken();
        if (!cancelled) setStatus('guest');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: tk, user: u } = await api.login(email, password);
    await saveToken(tk);
    setToken(tk);
    setUser(u);
    setStatus('authed');
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token: tk, user: u } = await api.register(payload);
    await saveToken(tk);
    setToken(tk);
    setUser(u);
    setStatus('authed');
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    setToken(null);
    setUser(null);
    setStatus('guest');
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      status,
      token,
      user,
      currentUserId: user?.id ?? null,
      login,
      register,
      signOut,
    }),
    [status, token, user, login, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
