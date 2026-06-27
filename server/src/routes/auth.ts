import { Router, type Request } from 'express';
import { requireAuth, signToken, verifyPassword } from '../auth.js';
import { createUser, getUserByEmail, getUserRow, rowToProfile } from '../store.js';
import type { LocalizedText } from '../types.js';

export const authRouter = Router();

function bilingual(value: unknown, fallback = ''): LocalizedText {
  if (value && typeof value === 'object' && 'zh' in value && 'en' in value) {
    const v = value as { zh: unknown; en: unknown };
    return { zh: String(v.zh ?? fallback), en: String(v.en ?? fallback) };
  }
  const s = value == null ? fallback : String(value);
  return { zh: s, en: s };
}

const AVATAR_COLORS = ['#C8102E', '#1F8A70', '#2C6FB3', '#7A4FB5', '#D98324'];

authRouter.post('/register', (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    res.status(400).json({ error: 'email, password and name are required' });
    return;
  }
  if (String(password).length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }
  if (getUserByEmail(String(email))) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const displayName = bilingual(name);
  const initials = (displayName.en || displayName.zh).trim().charAt(0).toUpperCase() || '?';
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const profile = createUser({
    email: String(email),
    password: String(password),
    name: displayName,
    avatarColor,
    initials,
    university: bilingual(req.body.university),
    major: bilingual(req.body.major),
    gradYear: Number(req.body.gradYear) || 0,
    city: req.body.city ? String(req.body.city) : '',
    occupation: bilingual(req.body.occupation),
    immigrationYear: req.body.immigrationYear ? Number(req.body.immigrationYear) : undefined,
    openTo: Array.isArray(req.body.openTo) ? req.body.openTo.map(String) : [],
  });

  const token = signToken(profile.id);
  res.status(201).json({ token, user: { ...profile, email: String(email).toLowerCase() } });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }
  const row = getUserByEmail(String(email));
  if (!row || !verifyPassword(String(password), row.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = signToken(row.id);
  res.json({ token, user: rowToProfile(row, true) });
});

authRouter.get('/me', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const row = getUserRow(userId);
  if (!row) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: rowToProfile(row, true) });
});
