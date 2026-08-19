/* Auth for a laptop, not a data centre: a signed-in admin gets an opaque token
   held in memory, so restarting the server signs everyone out. */
import crypto from 'node:crypto';

const sessions = new Set();

export const mint = () => {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.add(token);
  return token;
};

export const isAdmin = (req) => sessions.has(req.get('x-admin-token'));

export function requireAdmin(req, res, next) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Sign in to the admin panel first.' });
  next();
}
