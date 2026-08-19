/* Export and restore. An export you cannot put back is not a backup, and
   `npm run reset` was a one-way door without the import half. Each section is
   optional and replaces its file wholesale, so a partial export restores the
   parts it has. */
import { Router } from 'express';
import { KEYS, readJson, writeJson } from '../lib/store.js';
import { requireAdmin } from '../lib/auth.js';

const router = Router();

router.get('/export', requireAdmin, (req, res) => {
  res.set('Content-Disposition', 'attachment; filename="frientec-export.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    categories: readJson(KEYS.categories),
    demos: readJson(KEYS.demos),
    leads: readJson(KEYS.leads),
    projects: readJson(KEYS.projects),
  });
});

const PARTS = [
  ['categories', KEYS.categories, (v) => Array.isArray(v) && v.every((c) => c && c.slug && c.name)],
  ['demos', KEYS.demos, (v) => Array.isArray(v) && v.every((d) => d && d.slug && d.category)],
  ['leads', KEYS.leads, (v) => Array.isArray(v) && v.every((l) => l && l.id)],
  ['projects', KEYS.projects, (v) => Array.isArray(v) && v.every((p) => p && p.id && p.customer)],
];

router.post('/import', requireAdmin, async (req, res) => {
  const b = req.body;
  const restored = [];

  // Validate everything before writing anything, so a bad file cannot leave
  // half the store replaced.
  for (const [key, , valid] of PARTS) {
    if (b[key] === undefined) continue;
    if (!valid(b[key])) return res.status(400).json({ error: `The "${key}" section of that file is not in the right shape.` });
    restored.push(`${key} (${b[key].length})`);
  }
  if (!restored.length) {
    return res.status(400).json({ error: 'That file has nothing to restore. Expected categories, demos, leads or projects.' });
  }

  for (const [key, file] of PARTS) {
    if (b[key] === undefined) continue;
    await writeJson(file, b[key]);
  }
  console.log(`  restored from import — ${restored.join(', ')}`);
  res.json({ restored });
});

export default router;
