import http from 'node:http';
import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import './db.js';
import { seedIfEmpty } from './seed.js';
import { authRouter } from './routes/auth.js';
import { profilesRouter } from './routes/profiles.js';
import { conversationsRouter } from './routes/conversations.js';
import { attachWebSocketServer } from './ws.js';

seedIfEmpty();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'alumni-connect-server', time: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/conversations', conversationsRouter);

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(config.port, () => {
  console.log(`\n  AlumniHub server listening on http://localhost:${config.port}`);
  console.log(`  WebSocket endpoint: ws://localhost:${config.port}/ws`);
  console.log(`  Demo logins: me@alumni.app … p12@alumni.app  (password: ${config.demoPassword})\n`);
});
