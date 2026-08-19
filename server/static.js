/* ---------------------------------------------------------------------------
   Static files: the sample art, the self-contained premium sites, and — in
   production — the built React app.

   Sample art is referenced without an extension — /img/salons-hero — so the
   photographs from tools/fetch-photos.js and the drawn placeholders from
   tools/make-images.js are interchangeable. A .jpg wins if one is there;
   otherwise the .svg renders. Nothing in the client has to care, and dropping
   your own photo in with the right name just works.
--------------------------------------------------------------------------- */
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { PUBLIC, CLIENT_DIST } from './lib/paths.js';

const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

function resolveArt(rel) {
  for (const ext of EXTS) {
    const candidate = path.join(PUBLIC, path.normalize(rel + ext).replace(/^(\.\.[/\\])+/, ''));
    if (candidate.startsWith(PUBLIC) && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export function mountStatic(app) {
  // extension-less art first, so /img/salons-hero resolves to whichever file exists
  app.get(/^\/img\/.+/, (req, res, next) => {
    const rel = decodeURIComponent(req.path);
    if (path.extname(rel)) return next();
    const art = resolveArt(rel);
    if (!art) return res.status(404).json({ error: 'Not found' });
    // sample art changes only when a tool is re-run, so let the browser keep it
    res.sendFile(art, { maxAge: '1h' });
  });

  app.use('/img', express.static(path.join(PUBLIC, 'img'), { maxAge: '1h' }));
  app.use('/sites', express.static(path.join(PUBLIC, 'sites')));
}

/* Production only: serve the built client and hand every unknown path to it,
   so a deep link like /#/designs/premium still boots the app. In dev this is
   skipped — Vite serves the client and proxies /api here. */
export function mountClient(app) {
  if (!fs.existsSync(CLIENT_DIST)) {
    app.get('/', (req, res) =>
      res
        .status(503)
        .type('html')
        .send('<pre style="font:14px ui-monospace;padding:40px;line-height:1.7">The React app has not been built yet.\n\n  npm run dev     — Vite dev server on :5173 (what you want while developing)\n  npm run build   — build the client, then this server serves it\n</pre>'));
    return;
  }
  app.use(express.static(CLIENT_DIST, { index: false }));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}
