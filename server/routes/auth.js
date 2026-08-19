import { Router } from 'express';
import { settings } from '../lib/store.js';
import { mint } from '../lib/auth.js';
import { limit } from '../lib/throttle.js';

const router = Router();

router.post('/login', limit('login', 6, 'Too many attempts. Wait a minute and try again.'), (req, res) => {
  if (req.body.password !== settings().adminPassword) {
    return res.status(401).json({ error: 'That password does not match.' });
  }
  res.json({ token: mint() });
});

export default router;
