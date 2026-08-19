/* ---------------------------------------------------------------------------
   Where the API and the files it owns actually live.

   Empty means same origin, which is how this runs locally and how it runs when
   the Express server serves the built app on one port. Set `VITE_API_BASE` at
   build time when the front end is hosted apart from the API — a Vercel
   deployment talking to a Railway service, say — because `/api`, `/img` and
   `/sites` are all server features and a static host has none of them.

     VITE_API_BASE=https://frientec-api.up.railway.app
--------------------------------------------------------------------------- */
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const API_BASE = String(env.VITE_API_BASE || '').replace(/\/+$/, '');

/* Resolve a server-owned path against that base. Anything already absolute is
   returned untouched — an uploaded photo is a data: URL, and a customisation
   saved before the base was set may already carry a full URL. */
export function asset(p) {
  if (!p || !API_BASE) return p;
  if (/^(https?:|data:|blob:|\/\/)/i.test(p)) return p;
  return API_BASE + (p.startsWith('/') ? p : '/' + p);
}
