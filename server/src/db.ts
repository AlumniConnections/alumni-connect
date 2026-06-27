import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

export const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    initials TEXT NOT NULL,
    university_zh TEXT NOT NULL DEFAULT '',
    university_en TEXT NOT NULL DEFAULT '',
    major_zh TEXT NOT NULL DEFAULT '',
    major_en TEXT NOT NULL DEFAULT '',
    grad_year INTEGER NOT NULL DEFAULT 0,
    city TEXT NOT NULL DEFAULT '',
    occupation_zh TEXT NOT NULL DEFAULT '',
    occupation_en TEXT NOT NULL DEFAULT '',
    headline_zh TEXT,
    headline_en TEXT,
    immigration_year INTEGER,
    verified INTEGER NOT NULL DEFAULT 0,
    open_to TEXT NOT NULL DEFAULT '[]',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    title_en TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    initials TEXT NOT NULL,
    pinned INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS participants (
    conversation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    last_read_at INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    text_zh TEXT NOT NULL,
    text_en TEXT NOT NULL,
    display_time TEXT NOT NULL,
    system INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_participants_user ON participants(user_id);
`);

/** Whether the database has already been seeded. */
export function isSeeded(): boolean {
  const row = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  return row.n > 0;
}
