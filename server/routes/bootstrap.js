import { Router } from 'express';
import { KEYS, readJson, publicSettings } from '../lib/store.js';

const router = Router();

/* One call the React app makes on boot: the catalogue, the trades and the
   public half of settings. */
router.get('/bootstrap', (req, res) => {
  res.json({
    categories: readJson(KEYS.categories),
    demos: readJson(KEYS.demos),
    settings: publicSettings(),
  });
});

export default router;
