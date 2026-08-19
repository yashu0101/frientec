/* AI drafting. Open to the public because customers use it, so it gets a crude
   per-IP throttle — enough to stop a stuck loop burning tokens, not a
   substitute for a real gateway if you deploy this. */
import { Router } from 'express';
import * as ai from '../lib/ai.js';
import { limit } from '../lib/throttle.js';

const router = Router();

router.get('/ai/status', (req, res) => res.json({ available: ai.available(), model: ai.MODEL }));

const throttled = limit('ai', 8, 'That is a lot of drafts in one minute. Give it a moment.');

router.post('/ai/describe', throttled, async (req, res) => {
  try {
    const out = await ai.describe(req.body.brief, req.body.hints || {});
    console.log(`  ai draft — "${String(req.body.brief || '').slice(0, 60)}" → ${out.site.business} (${out.site.category})`);
    res.json(out);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message, fallback: !!e.fallback });
  }
});

router.post('/ai/translate', throttled, async (req, res) => {
  try {
    res.json(await ai.translate(req.body.fields || {}, req.body.language || 'Hindi'));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message, fallback: !!e.fallback });
  }
});

export default router;
