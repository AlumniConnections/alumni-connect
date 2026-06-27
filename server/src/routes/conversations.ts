import { Router, type Request } from 'express';
import { requireAuth } from '../auth.js';
import {
  conversationForUser,
  createConversation,
  findDirectConversation,
  getUserRow,
  insertMessage,
  isParticipant,
  listConversationsForUser,
  listMessages,
  markRead,
} from '../store.js';
import { broadcastToConversation } from '../ws.js';

export const conversationsRouter = Router();

conversationsRouter.use(requireAuth);

function uid(req: Request): string {
  return (req as Request & { userId: string }).userId;
}

conversationsRouter.get('/', (req, res) => {
  res.json({ conversations: listConversationsForUser(uid(req)) });
});

/** Open (or create) a direct conversation with another user. */
conversationsRouter.post('/direct/:userId', (req, res) => {
  const me = uid(req);
  const other = req.params.userId;
  if (me === other) {
    res.status(400).json({ error: 'Cannot start a chat with yourself' });
    return;
  }
  const otherRow = getUserRow(other);
  if (!otherRow) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  let conversationId = findDirectConversation(me, other);
  if (!conversationId) {
    conversationId = createConversation({
      kind: 'direct',
      title: { zh: otherRow.name_zh, en: otherRow.name_en },
      avatarColor: otherRow.avatar_color,
      initials: otherRow.initials,
      participantIds: [me, other],
    });
  }
  res.json({ conversation: conversationForUser(conversationId, me) });
});

conversationsRouter.get('/:id/messages', (req, res) => {
  const me = uid(req);
  if (!isParticipant(req.params.id, me)) {
    res.status(403).json({ error: 'Not a participant of this conversation' });
    return;
  }
  res.json({ messages: listMessages(req.params.id) });
});

/** REST fallback for sending a message (the WebSocket is the primary path). */
conversationsRouter.post('/:id/messages', (req, res) => {
  const me = uid(req);
  const text = String(req.body?.text ?? '').trim();
  if (!isParticipant(req.params.id, me)) {
    res.status(403).json({ error: 'Not a participant of this conversation' });
    return;
  }
  if (!text) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const message = insertMessage({
    conversationId: req.params.id,
    senderId: me,
    textZh: text,
    textEn: text,
  });
  markRead(req.params.id, me, message.createdAt);

  broadcastToConversation(req.params.id, { type: 'message:new', message });
  res.status(201).json({ message });
});

conversationsRouter.post('/:id/read', (req, res) => {
  const me = uid(req);
  if (!isParticipant(req.params.id, me)) {
    res.status(403).json({ error: 'Not a participant of this conversation' });
    return;
  }
  markRead(req.params.id, me);
  res.json({ conversation: conversationForUser(req.params.id, me) });
});
