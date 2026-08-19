/* ---------------------------------------------------------------------------
   Frientec — Express API.

     npm run dev              → this on :4000, Vite on :5173
     npm start                → this on :4000, serving client/dist
     PORT=5000 npm start      → different port

   Everything persists to JSON files in ./data. See lib/store.js.

   API
     POST   /api/login                  { password }            -> { token }
     GET    /api/bootstrap                                      -> categories, demos, settings
     GET    /api/demos
     POST   /api/demos          [admin]  create a demo
     PATCH  /api/demos/:id      [admin]  edit / publish / feature
     DELETE /api/demos/:id      [admin]
     GET    /api/leads          [admin]
     POST   /api/leads                   public lead submission
     PATCH  /api/leads/:id      [admin]
     DELETE /api/leads/:id      [admin]
     GET    /api/projects       [admin]  customised orders from the studio
     POST   /api/projects                public order (customisation + plan + domain)
     PATCH  /api/projects/:id   [admin]
     DELETE /api/projects/:id   [admin]
     POST   /api/track                   order lookup (ref + phone)
     POST   /api/submit                  customer sends photos / notes
     GET    /api/ai/status
     POST   /api/ai/describe             draft a page from a brief
     POST   /api/ai/translate
     PUT    /api/settings       [admin]
     GET    /api/export         [admin]  whole store as one JSON file
     POST   /api/import         [admin]  put an export back
--------------------------------------------------------------------------- */
import express from 'express';
import { ensureData, settings } from './lib/store.js';
import { DATA } from './lib/paths.js';
import { mountStatic, mountClient } from './static.js';

import authRoutes from './routes/auth.js';
import bootstrapRoutes from './routes/bootstrap.js';
import demoRoutes from './routes/demos.js';
import leadRoutes from './routes/leads.js';
import projectRoutes from './routes/projects.js';
import trackRoutes from './routes/track.js';
import aiRoutes from './routes/ai.js';
import settingsRoutes from './routes/settings.js';
import dataRoutes from './routes/data.js';

const PORT = Number(process.env.PORT) || 4000;

// Orders and content submissions carry the customer's logo and photos as data
// URLs, so those routes need a much bigger ceiling than the rest of the API.
const BODY_LIMIT = '1mb';
const UPLOAD_LIMIT = '16mb';

ensureData();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

const api = express.Router();

/* The catalogue changes the moment the admin edits it, so no API answer may be
   cached — an ETag'd /bootstrap is how a newly published design stays invisible
   until a hard reload. */
api.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

api.use('/projects', express.json({ limit: UPLOAD_LIMIT }));
api.use('/submit', express.json({ limit: UPLOAD_LIMIT }));
api.use('/import', express.json({ limit: UPLOAD_LIMIT }));
api.use(express.json({ limit: BODY_LIMIT }));

/* A host's healthcheck needs something cheap that touches no data. */
api.get('/health', (req, res) => res.json({ ok: true, uptime: Math.round(process.uptime()) }));

api.use(authRoutes);
api.use(bootstrapRoutes);
api.use(demoRoutes);
api.use(leadRoutes);
api.use(projectRoutes);
api.use(trackRoutes);
api.use(aiRoutes);
api.use(settingsRoutes);
api.use(dataRoutes);
api.use((req, res) => res.status(404).json({ error: 'No such endpoint.' }));

app.use('/api', api);

mountStatic(app);
mountClient(app);

// A body over the limit, or malformed JSON, should read like the old server did
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'That upload is too large.' });
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  const s = settings();
  console.log(`\n  ${s.brand} API running at http://localhost:${PORT}`);
  console.log(`  admin password: ${s.adminPassword}`);
  console.log(`  data in ${DATA}\n`);
});
