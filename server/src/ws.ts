import type { Server } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from './auth.js';
import {
  conversationForUser,
  conversationParticipants,
  insertMessage,
  isParticipant,
  markRead,
} from './store.js';
import type { ClientEvent, ServerEvent } from './types.js';

interface Socket extends WebSocket {
  userId: string;
  isAlive: boolean;
}

/** userId -> set of live sockets (a user may be connected on multiple devices). */
const connections = new Map<string, Set<Socket>>();

function send(socket: WebSocket, event: ServerEvent): void {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(event));
}

/** Send an event to every live socket of a given user. */
function sendToUser(userId: string, event: ServerEvent): void {
  const sockets = connections.get(userId);
  if (!sockets) return;
  for (const s of sockets) send(s, event);
}

/** Send an event to all participants of a conversation. */
export function broadcastToConversation(conversationId: string, event: ServerEvent): void {
  for (const uid of conversationParticipants(conversationId)) sendToUser(uid, event);
}

function onlineUserIds(): string[] {
  return [...connections.keys()];
}

function register(socket: Socket): void {
  let set = connections.get(socket.userId);
  if (!set) {
    set = new Set();
    connections.set(socket.userId, set);
  }
  const wasOffline = set.size === 0;
  set.add(socket);
  if (wasOffline) {
    // Notify others this user just came online.
    for (const uid of connections.keys()) {
      if (uid !== socket.userId) sendToUser(uid, { type: 'presence', userId: socket.userId, online: true });
    }
  }
}

function unregister(socket: Socket): void {
  const set = connections.get(socket.userId);
  if (!set) return;
  set.delete(socket);
  if (set.size === 0) {
    connections.delete(socket.userId);
    for (const uid of connections.keys()) {
      sendToUser(uid, { type: 'presence', userId: socket.userId, online: false });
    }
  }
}

function handleClientEvent(socket: Socket, raw: string): void {
  let event: ClientEvent;
  try {
    event = JSON.parse(raw) as ClientEvent;
  } catch {
    send(socket, { type: 'error', message: 'Invalid JSON' });
    return;
  }

  switch (event.type) {
    case 'ping':
      send(socket, { type: 'pong' });
      return;

    case 'typing': {
      if (!isParticipant(event.conversationId, socket.userId)) return;
      for (const uid of conversationParticipants(event.conversationId)) {
        if (uid !== socket.userId) {
          sendToUser(uid, { type: 'typing', conversationId: event.conversationId, userId: socket.userId });
        }
      }
      return;
    }

    case 'read': {
      if (!isParticipant(event.conversationId, socket.userId)) return;
      markRead(event.conversationId, socket.userId);
      const dto = conversationForUser(event.conversationId, socket.userId);
      if (dto) send(socket, { type: 'conversation:update', conversation: dto });
      return;
    }

    case 'message:send': {
      const text = (event.text ?? '').trim();
      if (!text) return;
      if (!isParticipant(event.conversationId, socket.userId)) {
        send(socket, { type: 'error', message: 'Not a participant of this conversation' });
        return;
      }

      const message = insertMessage({
        conversationId: event.conversationId,
        senderId: socket.userId,
        textZh: text,
        textEn: text,
      });

      // Sender is implicitly caught up on their own message.
      markRead(event.conversationId, socket.userId, message.createdAt);

      // Deliver the new message to everyone, echoing the sender's clientId
      // back to the author so they can reconcile any optimistic UI.
      for (const uid of conversationParticipants(event.conversationId)) {
        sendToUser(uid, {
          type: 'message:new',
          message,
          clientId: uid === socket.userId ? event.clientId : undefined,
        });
        const dto = conversationForUser(event.conversationId, uid);
        if (dto) sendToUser(uid, { type: 'conversation:update', conversation: dto });
      }
      return;
    }

    default:
      send(socket, { type: 'error', message: 'Unknown event type' });
  }
}

export function attachWebSocketServer(server: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, sock, head) => {
    const { pathname, searchParams } = new URL(req.url ?? '', 'http://localhost');
    if (pathname !== '/ws') {
      sock.destroy();
      return;
    }
    const token =
      searchParams.get('token') ??
      (req.headers['sec-websocket-protocol'] as string | undefined) ??
      '';
    const userId = verifyToken(token);
    if (!userId) {
      sock.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      sock.destroy();
      return;
    }
    wss.handleUpgrade(req, sock, head, (ws) => {
      const socket = ws as Socket;
      socket.userId = userId;
      socket.isAlive = true;
      wss.emit('connection', socket, req);
    });
  });

  wss.on('connection', (socket: Socket) => {
    register(socket);
    send(socket, { type: 'ready', userId: socket.userId, onlineUserIds: onlineUserIds() });

    socket.on('message', (data) => handleClientEvent(socket, data.toString()));
    socket.on('pong', () => {
      socket.isAlive = true;
    });
    socket.on('close', () => unregister(socket));
    socket.on('error', () => unregister(socket));
  });

  // Heartbeat: terminate sockets that stop responding to pings.
  const interval = setInterval(() => {
    for (const set of connections.values()) {
      for (const socket of set) {
        if (!socket.isAlive) {
          socket.terminate();
          continue;
        }
        socket.isAlive = false;
        socket.ping();
      }
    }
  }, 30_000);

  wss.on('close', () => clearInterval(interval));
}
