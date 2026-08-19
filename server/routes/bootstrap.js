import { Router } from 'express';
import { FILES, readJson, publicSettings } from '../lib/store.js';

const router = Router();

/* One call the React app makes on boot: the catalogue, the trades and the
   public half of settings. */
router.get('/bootstrap', (req, res) => {
  res.json({
    categories: readJson(FILES.categories),
    demos: readJson(FILES.demos),
    settings: publicSettings(),
  });
});

export default router;
