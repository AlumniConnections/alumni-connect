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

## Project structure

```
app/                 # expo-router screens (file-based routing)
  (tabs)/            # Home, Network, Forums, Messages, Profile
  chat/[id]          # direct & group conversation
  meeting/[id]       # voice/video call experience
  thread/[id]        # forum thread + replies
  alumni/[id]        # alumni profile detail
  resources/         # newcomer / career / startup hubs
  voting, notifications, meetings
src/
  theme/             # design system (maple-red palette)
  i18n/              # bilingual UI strings
  store/             # app context (language, votes, live messages)
  data/              # mock alumni, chats, forums, polls, resources
  components/        # reusable UI + PollCard
  types/             # shared TypeScript types
```

## Notes

This is a fully navigable front-end prototype. All data is mocked in `src/data/` so the app runs with no backend. Interactions that persist for the session: casting poll votes, sending chat messages, posting forum replies, and switching language. The next step toward production would be wiring a backend (auth, real-time messaging via WebSocket, and a meetings SDK such as Agora/Twilio/LiveKit for actual voice/video).
