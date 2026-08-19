import { Router } from 'express';
import { FILES, writeJson, settings } from '../lib/store.js';
import { requireAdmin } from '../lib/auth.js';

const router = Router();

router.put('/settings', requireAdmin, async (req, res) => {
  const current = settings();
  const b = req.body;
  const next = { ...current, ...b };
  if (!b.adminPassword) next.adminPassword = current.adminPassword;
  await writeJson(FILES.settings, next);
  const safe = { ...next };
  delete safe.adminPassword;
  res.json(safe);
});

export default router;
