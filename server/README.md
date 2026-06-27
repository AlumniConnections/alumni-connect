# AlumniConnect Server

Backend for the AlumniConnect app: **JWT authentication** + **real-time messaging over WebSockets**, backed by SQLite.

## Stack

- **Express** — REST API
- **ws** — WebSocket server (authenticated, with presence + typing + heartbeat)
- **better-sqlite3** — embedded SQLite persistence (no external DB to run)
- **jsonwebtoken** + **bcryptjs** — JWT auth with hashed passwords
- **tsx** — run TypeScript directly (no build step)

## Run it

```bash
cd server
npm install
npm run dev      # http://localhost:4000  (auto-restarts on change)
# or: npm start
```

On first boot the database is created at `server/data/alumni.db` and seeded with
the demo alumni, group chats, and message history.

**Demo logins** (password `alumni123` for all): `me@alumni.app`, `p1@alumni.app` … `p12@alumni.app`.

Configuration is via env vars (see `.env.example`): `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_PATH`.

## REST API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | – | Liveness check |
| POST | `/api/auth/register` | – | Create account → `{ token, user }` |
| POST | `/api/auth/login` | – | Sign in → `{ token, user }` |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/profiles` | Bearer | All alumni |
| GET | `/api/profiles/:id` | Bearer | One profile |
| GET | `/api/conversations` | Bearer | My conversations (title/avatar/unread resolved per viewer) |
| POST | `/api/conversations/direct/:userId` | Bearer | Open (or create) a 1:1 chat |
| GET | `/api/conversations/:id/messages` | Bearer | Message history |
| POST | `/api/conversations/:id/messages` | Bearer | Send (REST fallback; also broadcast over WS) |
| POST | `/api/conversations/:id/read` | Bearer | Mark conversation read |

## WebSocket

Connect to `ws://<host>:4000/ws?token=<JWT>`. Unauthorized connections are rejected.

**Client → server**

```jsonc
{ "type": "message:send", "conversationId": "c_p2", "text": "hello", "clientId": "tmp_1" }
{ "type": "typing", "conversationId": "c_p2" }
{ "type": "read", "conversationId": "c_p2" }
{ "type": "ping" }
```

**Server → client**

```jsonc
{ "type": "ready", "userId": "me", "onlineUserIds": ["me", "p2"] }
{ "type": "message:new", "message": { /* MessageDTO */ }, "clientId": "tmp_1" }
{ "type": "conversation:update", "conversation": { /* ConversationDTO */ } }
{ "type": "typing", "conversationId": "c_p2", "userId": "p2" }
{ "type": "presence", "userId": "p2", "online": true }
{ "type": "pong" }
```

New messages are persisted and broadcast to every participant's live sockets in
real time, along with a per-viewer `conversation:update` (for unread counts and
chat-list ordering).

A quick local check:

```bash
node scripts/ws-smoke.mjs   # logs in two demo users and exchanges live messages
```
