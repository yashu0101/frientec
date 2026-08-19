/* ---------------------------------------------------------------------------
   Cross-origin access, off unless asked for.

   When the server also serves the built client there is one origin and none of
   this is needed. Split the two — a static host for the front end, this for the
   API — and the browser will refuse every request until the API says which
   origins it trusts. So `CORS_ORIGIN` is an explicit allowlist:

     CORS_ORIGIN=https://frientec-client.vercel.app
     CORS_ORIGIN=https://frientec.com,https://www.frientec.com
     CORS_ORIGIN=*        # any origin; fine for a public read-mostly demo

   Unset means no CORS headers at all, which is the right default: same-origin
   deployments should not be handing out cross-origin permission they never use.

   No credentials mode. The admin token travels in `x-admin-token`, not a cookie,
   so `Access-Control-Allow-Credentials` would buy nothing and would rule out the
   `*` form entirely.
--------------------------------------------------------------------------- */
const configured = String(process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

export const corsEnabled = configured.length > 0;
export const corsOrigins = configured;

const allow = (origin) => {
  if (!origin) return null;
  if (configured.includes('*')) return '*';
  return configured.includes(origin.replace(/\/+$/, '')) ? origin : null;
};

export function cors(req, res, next) {
  if (!corsEnabled) return next();

  const origin = req.get('origin');
  const allowed = allow(origin);

  if (allowed) {
    res.set('Access-Control-Allow-Origin', allowed);
    res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
    res.set('Access-Control-Max-Age', '600');
    // an allowlist of more than one means the answer varies by request
    if (allowed !== '*') res.set('Vary', 'Origin');
  }

  // preflight ends here either way — answering 204 for a disallowed origin is
  // fine, the missing Allow-Origin header is what the browser acts on
  if (req.method === 'OPTIONS') return res.status(204).end();

  next();
}
