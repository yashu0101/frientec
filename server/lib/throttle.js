/* ---------------------------------------------------------------------------
   One sliding window, used for the routes a stranger can reach: AI drafting
   (costs tokens), login (guessable password), and order lookup (a reference
   number is short enough to walk). It is a laptop, not a load balancer — this
   stops a script, not a botnet.
--------------------------------------------------------------------------- */
const buckets = new Map();

export function allow(name, key, perMinute) {
  const id = name + ':' + key;
  const now = Date.now();
  const recent = (buckets.get(id) || []).filter((t) => now - t < 60000);
  if (recent.length >= perMinute) {
    buckets.set(id, recent);
    return false;
  }
  recent.push(now);
  buckets.set(id, recent);
  if (buckets.size > 1000) buckets.clear();
  return true;
}

export const who = (req) => req.ip || req.socket.remoteAddress || 'unknown';

/* Express middleware form: 429s the request rather than returning a boolean. */
export const limit = (name, perMinute, message) => (req, res, next) => {
  if (allow(name, who(req), perMinute)) return next();
  res.status(429).json({ error: message });
};
