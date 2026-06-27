import { randomUUID } from 'node:crypto';
import { db } from './db.js';
import { hashPassword } from './auth.js';
import type { ConversationDTO, LocalizedText, MessageDTO, PublicProfile } from './types.js';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name_zh: string;
  name_en: string;
  avatar_color: string;
  initials: string;
  university_zh: string;
  university_en: string;
  major_zh: string;
  major_en: string;
  grad_year: number;
  city: string;
  occupation_zh: string;
  occupation_en: string;
  headline_zh: string | null;
  headline_en: string | null;
  immigration_year: number | null;
  verified: number;
  open_to: string;
  created_at: number;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  text_zh: string;
  text_en: string;
  display_time: string;
  system: number;
  created_at: number;
}

export function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function rowToProfile(row: UserRow, includeEmail = false): PublicProfile {
  const profile: PublicProfile = {
    id: row.id,
    name: { zh: row.name_zh, en: row.name_en },
    avatarColor: row.avatar_color,
    initials: row.initials,
    university: { zh: row.university_zh, en: row.university_en },
    major: { zh: row.major_zh, en: row.major_en },
    gradYear: row.grad_year,
    city: row.city,
    occupation: { zh: row.occupation_zh, en: row.occupation_en },
    immigrationYear: row.immigration_year ?? undefined,
    verified: row.verified === 1,
    openTo: JSON.parse(row.open_to) as string[],
  };
  if (row.headline_zh || row.headline_en) {
    profile.headline = { zh: row.headline_zh ?? '', en: row.headline_en ?? '' };
  }
  if (includeEmail) profile.email = row.email;
  return profile;
}

export function getUserRow(id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

export function getUserByEmail(email: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as
    | UserRow
    | undefined;
}

export function listProfiles(): PublicProfile[] {
  const rows = db.prepare('SELECT * FROM users ORDER BY created_at ASC').all() as UserRow[];
  return rows.map((r) => rowToProfile(r));
}

export interface NewUserInput {
  id?: string;
  email: string;
  password: string;
  name: LocalizedText;
  avatarColor: string;
  initials: string;
  university?: LocalizedText;
  major?: LocalizedText;
  gradYear?: number;
  city?: string;
  occupation?: LocalizedText;
  headline?: LocalizedText;
  immigrationYear?: number;
  verified?: boolean;
  openTo?: string[];
  passwordIsHashed?: boolean;
}

export function createUser(input: NewUserInput): PublicProfile {
  const id = input.id ?? `u_${randomUUID().slice(0, 8)}`;
  const hash = input.passwordIsHashed ? input.password : hashPassword(input.password);
  db.prepare(
    `INSERT INTO users (
      id, email, password_hash, name_zh, name_en, avatar_color, initials,
      university_zh, university_en, major_zh, major_en, grad_year, city,
      occupation_zh, occupation_en, headline_zh, headline_en, immigration_year,
      verified, open_to, created_at
    ) VALUES (
      @id, @email, @password_hash, @name_zh, @name_en, @avatar_color, @initials,
      @university_zh, @university_en, @major_zh, @major_en, @grad_year, @city,
      @occupation_zh, @occupation_en, @headline_zh, @headline_en, @immigration_year,
      @verified, @open_to, @created_at
    )`,
  ).run({
    id,
    email: input.email.toLowerCase(),
    password_hash: hash,
    name_zh: input.name.zh,
    name_en: input.name.en,
    avatar_color: input.avatarColor,
    initials: input.initials,
    university_zh: input.university?.zh ?? '',
    university_en: input.university?.en ?? '',
    major_zh: input.major?.zh ?? '',
    major_en: input.major?.en ?? '',
    grad_year: input.gradYear ?? 0,
    city: input.city ?? '',
    occupation_zh: input.occupation?.zh ?? '',
    occupation_en: input.occupation?.en ?? '',
    headline_zh: input.headline?.zh ?? null,
    headline_en: input.headline?.en ?? null,
    immigration_year: input.immigrationYear ?? null,
    verified: input.verified ? 1 : 0,
    open_to: JSON.stringify(input.openTo ?? []),
    created_at: Date.now(),
  });
  return rowToProfile(getUserRow(id)!);
}

export function conversationParticipants(conversationId: string): string[] {
  const rows = db
    .prepare('SELECT user_id FROM participants WHERE conversation_id = ?')
    .all(conversationId) as { user_id: string }[];
  return rows.map((r) => r.user_id);
}

export function isParticipant(conversationId: string, userId: string): boolean {
  const row = db
    .prepare('SELECT 1 FROM participants WHERE conversation_id = ? AND user_id = ?')
    .get(conversationId, userId);
  return !!row;
}

function rowToMessage(row: MessageRow): MessageDTO {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: { zh: row.text_zh, en: row.text_en },
    time: row.display_time,
    createdAt: row.created_at,
    system: row.system === 1,
  };
}

export function listMessages(conversationId: string): MessageDTO[] {
  const rows = db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
    .all(conversationId) as MessageRow[];
  return rows.map(rowToMessage);
}

export function insertMessage(args: {
  conversationId: string;
  senderId: string;
  textZh: string;
  textEn: string;
  system?: boolean;
  createdAt?: number;
  displayTime?: string;
}): MessageDTO {
  const createdAt = args.createdAt ?? Date.now();
  const id = `m_${randomUUID().slice(0, 10)}`;
  const displayTime = args.displayTime ?? formatTime(createdAt);
  db.prepare(
    `INSERT INTO messages (id, conversation_id, sender_id, text_zh, text_en, display_time, system, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    args.conversationId,
    args.senderId,
    args.textZh,
    args.textEn,
    displayTime,
    args.system ? 1 : 0,
    createdAt,
  );
  return rowToMessage(getMessageRow(id)!);
}

function getMessageRow(id: string): MessageRow | undefined {
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as MessageRow | undefined;
}

export function markRead(conversationId: string, userId: string, at = Date.now()): void {
  db.prepare(
    'UPDATE participants SET last_read_at = ? WHERE conversation_id = ? AND user_id = ?',
  ).run(at, conversationId, userId);
}

interface ConversationRow {
  id: string;
  kind: 'direct' | 'group';
  title_zh: string;
  title_en: string;
  avatar_color: string;
  initials: string;
  pinned: number;
}

/**
 * Build a conversation DTO for a specific viewer. For direct chats the title
 * and avatar resolve to the *other* participant.
 */
export function conversationForUser(conversationId: string, viewerId: string): ConversationDTO | null {
  const row = db
    .prepare('SELECT * FROM conversations WHERE id = ?')
    .get(conversationId) as ConversationRow | undefined;
  if (!row) return null;

  const participantIds = conversationParticipants(conversationId);
  let title: LocalizedText = { zh: row.title_zh, en: row.title_en };
  let avatarColor = row.avatar_color;
  let initials = row.initials;

  if (row.kind === 'direct') {
    const otherId = participantIds.find((p) => p !== viewerId);
    const other = otherId ? getUserRow(otherId) : undefined;
    if (other) {
      title = { zh: other.name_zh, en: other.name_en };
      avatarColor = other.avatar_color;
      initials = other.initials;
    }
  }

  const last = db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(conversationId) as MessageRow | undefined;

  const reader = db
    .prepare('SELECT last_read_at FROM participants WHERE conversation_id = ? AND user_id = ?')
    .get(conversationId, viewerId) as { last_read_at: number } | undefined;
  const lastReadAt = reader?.last_read_at ?? 0;

  const unreadRow = db
    .prepare(
      'SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND created_at > ? AND sender_id != ?',
    )
    .get(conversationId, lastReadAt, viewerId) as { n: number };

  return {
    id: row.id,
    kind: row.kind,
    title,
    avatarColor,
    initials,
    participantIds,
    lastMessage: last ? { zh: last.text_zh, en: last.text_en } : { zh: '', en: '' },
    lastTime: last?.display_time ?? '',
    unread: unreadRow.n,
    pinned: row.pinned === 1,
  };
}

export function listConversationsForUser(viewerId: string): ConversationDTO[] {
  const rows = db
    .prepare(
      `SELECT c.id FROM conversations c
       JOIN participants p ON p.conversation_id = c.id
       WHERE p.user_id = ?`,
    )
    .all(viewerId) as { id: string }[];

  const dtos = rows
    .map((r) => conversationForUser(r.id, viewerId))
    .filter((c): c is ConversationDTO => !!c);

  // Pinned first, then most recent activity.
  return dtos.sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return Number(!!b.pinned) - Number(!!a.pinned);
    return 0;
  });
}

export function findDirectConversation(userA: string, userB: string): string | null {
  const row = db
    .prepare(
      `SELECT c.id FROM conversations c
       JOIN participants p1 ON p1.conversation_id = c.id AND p1.user_id = ?
       JOIN participants p2 ON p2.conversation_id = c.id AND p2.user_id = ?
       WHERE c.kind = 'direct' LIMIT 1`,
    )
    .get(userA, userB) as { id: string } | undefined;
  return row?.id ?? null;
}

export function createConversation(args: {
  id?: string;
  kind: 'direct' | 'group';
  title: LocalizedText;
  avatarColor: string;
  initials: string;
  participantIds: string[];
  pinned?: boolean;
}): string {
  const id = args.id ?? `c_${randomUUID().slice(0, 8)}`;
  db.prepare(
    `INSERT INTO conversations (id, kind, title_zh, title_en, avatar_color, initials, pinned, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    args.kind,
    args.title.zh,
    args.title.en,
    args.avatarColor,
    args.initials,
    args.pinned ? 1 : 0,
    Date.now(),
  );
  const addParticipant = db.prepare(
    'INSERT OR IGNORE INTO participants (conversation_id, user_id, last_read_at) VALUES (?, ?, 0)',
  );
  for (const uid of args.participantIds) addParticipant.run(id, uid);
  return id;
}
