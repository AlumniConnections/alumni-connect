# 校友连线 · AlumniConnect

A mobile social networking app for **Chinese alumni of Chinese universities who have immigrated to Canada**. Built with **Expo (React Native) + TypeScript + expo-router**. Fully **bilingual (中文 / English)** — tap the language toggle in the top-right of the Home or Profile screen to switch instantly.

## Features

| Area | Where to find it |
| --- | --- |
| 👤 **Profiles** (name, major, grad year, city, occupation, university) | Profile tab + tap any alumni in the Network tab |
| 🧑‍🤝‍🧑 **Alumni directory** with search & city filters | Network tab |
| 💬 **Direct & group messaging** | Messages tab → open any chat |
| 🎥 **Voice / video meetings** | Home → Meetings, or the 📞 / 🎥 buttons inside any chat |
| 🗳️ **Voting / polls** | Home feed polls + Home → Voting |
| 📢 **Advertising** | Sponsored cards in the Home feed |
| 🔔 **Group notifications** | Bell icon on Home → Notifications |
| 🗂️ **Forums** with categories, threads, replies & upvotes | Forums tab |
| ✈️ **New immigrant assistance** | Home → Newcomer (Resources) |
| 💼 **Career coaching** | Home → Career (Resources) |
| 🚀 **Startup resources** | Home → Startup (Resources) |

## Getting started

```bash
npm install
npm start          # then press i (iOS), a (Android), or w (web)
# or directly:
npm run ios
npm run android
```

Scan the QR code with the **Expo Go** app on your phone, or run on a simulator.

## Backend (auth + real-time messaging)

The app now has a real backend in [`server/`](./server): **JWT authentication** and
**real-time messaging over WebSockets**, backed by SQLite. Run it alongside the app:

```bash
cd server
npm install
npm run dev      # starts http://localhost:4000 (+ ws://localhost:4000/ws)
```

Then launch the app (`npm start`). The app **auto-detects** the server URL from the
Expo packager host, so it works on a simulator *and* in Expo Go on a physical phone
on the same Wi-Fi — no manual IP config. To point at a different server, set
`EXPO_PUBLIC_API_URL` (e.g. `EXPO_PUBLIC_API_URL=http://192.168.1.20:4000 npm start`).

**Sign in** with a demo account — email `me@alumni.app`, password `alumni123` (or tap
"Fill demo credentials" on the login screen) — or register a brand-new account.

What's wired to the backend:

- **Auth gate** — the app redirects to a login/register screen until you're signed in; the JWT is stored securely with `expo-secure-store` and the session is restored on relaunch.
- **Messaging** — the Messages tab and chat screens load conversations/history over REST and send/receive in **real time over WebSocket**, with optimistic send, **typing indicators**, **online presence**, live **unread counts**, and auto-reconnect.
- **Direct chats** — the "Message" button on any alumni profile opens (or creates) a real 1:1 conversation on the server.

Forums, the home feed, meetings, voting, and resources still use local mock data in `src/data/`.

## Project structure

```
app/                 # expo-router screens (file-based routing)
  login              # auth: sign in / sign up
  (tabs)/            # Home, Network, Forums, Messages, Profile
  chat/[id]          # direct & group conversation (realtime)
  meeting/[id]       # voice/video call experience
  thread/[id]        # forum thread + replies
  alumni/[id]        # alumni profile detail
  resources/         # newcomer / career / startup hubs
  voting, notifications, meetings
src/
  api/               # REST client, WebSocket client, base-URL detection
  store/             # AuthContext (session) + AppContext (lang, votes, realtime)
  theme/             # design system (maple-red palette)
  i18n/              # bilingual UI strings
  data/              # mock alumni, chats, forums, polls, resources
  components/        # reusable UI + PollCard
  types/             # shared TypeScript types
server/              # Node + Express + ws + SQLite backend (see server/README.md)
```

## Notes

The next step toward production would be a managed Postgres database, push
notifications, and a meetings SDK such as Agora / Twilio / LiveKit behind the
existing voice/video call UI.
