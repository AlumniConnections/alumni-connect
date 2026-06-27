import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { getUserRow, listProfiles, rowToProfile } from '../store.js';

export const profilesRouter = Router();

profilesRouter.use(requireAuth);

profilesRouter.get('/', (_req, res) => {
  res.json({ profiles: listProfiles() });
});

profilesRouter.get('/:id', (req, res) => {
  const row = getUserRow(req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  res.json({ profile: rowToProfile(row) });
});
