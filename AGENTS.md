# AlumniHub — Agent Instructions

AlumniHub (校友汇) is a bilingual mobile social app for Chinese alumni of Chinese universities living in Canada. Built with **Expo (React Native) + TypeScript + expo-router**, with a **Node/Express + WebSocket + SQLite** backend in `server/`.

## Project layout

```
app/                 # expo-router screens (file-based routing)
src/
  api/               # REST client, WebSocket client, config
  store/             # AuthContext (session) + AppContext (lang, votes, realtime)
  theme/             # design system (maple-red palette)
  i18n/              # bilingual UI strings (zh / en)
  data/              # mock data for features not yet on the backend
  components/        # reusable UI (ui.tsx, PollCard, etc.)
  types/             # shared TypeScript types
server/              # Express REST + ws + better-sqlite3
```

## What is wired to the backend vs mock data

**Backend (real):** JWT auth, alumni profiles, conversations, messages, WebSocket presence/typing/unread.

**Still mock (`src/data/`):** home feed, forums, meetings, voting/polls, resources, notifications.

When adding features, check whether they should extend the server or stay in mock data. Prefer extending the backend for anything that needs persistence or multi-user sync.

## Coding conventions

- **TypeScript everywhere.** Run `npm run typecheck` (app) and `cd server && npm run typecheck` (server) after substantive changes.
- **Match existing patterns.** Reuse components from `src/components/ui.tsx`, theme tokens from `src/theme`, and context hooks (`useAuth`, `useApp`) rather than introducing new abstractions.
- **Keep diffs focused.** Do not refactor unrelated code or add dependencies without a clear need.
- **No secrets in git.** Use `server/.env` (see `server/.env.example`); never commit credentials.

## Bilingual UI (required)

Every user-facing string must support **中文 and English**:

1. Add entries to `src/i18n/strings.ts` as `{ zh: '...', en: '...' }`.
2. Use `t('key')` from `useApp()` for static strings.
3. Use `tx(value)` for `LocalizedText` objects from mock data.

Do not hardcode English-only or Chinese-only text in screens.

## Design system

Use tokens from `src/theme/index.ts` — especially the maple-red primary (`colors.primary`), spacing, radii, typography, and shadow presets. The palette intentionally bridges Chinese red and the Canadian maple leaf.

## App routing

Screens live under `app/` using expo-router conventions:

- `(tabs)/` — main tab bar (Home, Network, Forums, Messages, Profile)
- Dynamic routes: `chat/[id]`, `thread/[id]`, `alumni/[id]`, `meeting/[id]`, etc.
- Auth gate in `app/_layout.tsx` redirects guests to `/login`.

## Backend

- Run with `cd server && npm run dev` → `http://localhost:4000` (+ `ws://localhost:4000/ws`).
- The app auto-detects the server URL from the Expo packager host. Override with `EXPO_PUBLIC_API_URL`.
- Demo login: `me@alumni.app` / `alumni123`.
- REST routes in `server/src/routes/`; WebSocket logic in `server/src/ws.ts`; DB in `server/src/db.ts`.
- See `server/README.md` for the full API and WebSocket protocol.

When adding server endpoints, update `src/api/client.ts` and `src/api/types.ts` on the app side.

## Real-time messaging

Messaging flows through `AppContext` + `src/api/socket.ts`. Preserve existing behavior: optimistic send, typing indicators, online presence, unread counts, and auto-reconnect.

## Local development

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — app
npm install && npm start
```

## Production direction

The README notes future work: managed Postgres, push notifications, and a real meetings SDK (Agora / Twilio / LiveKit) behind the existing voice/video UI. Keep mock meeting UI functional until a provider is integrated.
