import { Router } from 'express';
import { FILES, readJson, writeJson, settings } from '../lib/store.js';
import { requireAdmin } from '../lib/auth.js';
import { nextLeadId, nextProjectId, today } from '../lib/ids.js';
import { quote } from '../../shared/pricing.js';

const router = Router();

const REQUIRED = ['owner', 'business', 'phone', 'whatsapp', 'city', 'category'];

/* An order from the studio. The customer's uploaded logo and photos ride along
   in this body as data URLs, so it is mounted behind the upload-sized parser. */
router.post('/projects', async (req, res) => {
  const projects = readJson(FILES.projects);
  const b = req.body;
  const c = b.customer || {};

  const missing = REQUIRED.filter((k) => !String(c[k] || '').trim());
  if (missing.length) return res.status(400).json({ error: 'Missing required customer details', fields: missing });
  if (!b.demo) return res.status(400).json({ error: 'No design attached to this order.' });

  const s = settings();
  // The client's own total is ignored — this is the number that counts.
  const q = quote(b.selection || {}, s);

  const project = {
    id: nextProjectId(projects),
    demo: b.demo,
    demoName: b.demoName || b.demo,
    customer: {
      owner: c.owner, business: c.business, phone: c.phone, whatsapp: c.whatsapp,
      email: c.email || '', city: c.city, category: c.category,
      address: c.address || '', instagram: c.instagram || '', website: c.website || '',
    },
    customisation: b.customisation || {},
    selection: b.selection || {},
    quote: q,
    payment: {
      method: b.payment && b.payment.method ? b.payment.method : 'call',
      status: 'Awaiting advance',
      advance: q.advance,
      balance: q.balance,
    },
    wantsDynamic: !!b.wantsDynamic,
    notes: '',
    status: 'New',
    stage: 'Order placed',
    date: today(),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(project);
  await writeJson(FILES.projects, projects);

  // Mirror it into the lead desk so one table still shows all incoming work.
  const leads = readJson(FILES.leads);
  leads.unshift({
    id: nextLeadId(leads),
    owner: c.owner, business: c.business, phone: c.phone, whatsapp: c.whatsapp,
    city: c.city, category: c.category, demo: b.demo,
    email: c.email || '', website: c.website || '', instagram: c.instagram || '',
    budget: 'Ordered — ' + q.plan.name, features: (b.selection && b.selection.addons) || [],
    message: 'Customised in the studio. Order ' + project.id + '.',
    projectId: project.id,
    status: 'Qualified', value: q.total, priority: 'High', notes: '',
    date: today(), createdAt: new Date().toISOString(),
  });
  await writeJson(FILES.leads, leads);

  console.log(`  new order ${project.id} — ${c.business} (${c.city}) · ${q.plan.name} · ₹${q.total.toLocaleString('en-IN')} · advance ₹${q.advance.toLocaleString('en-IN')}`);
  res.status(201).json(project);
});

router.get('/projects', requireAdmin, (req, res) => res.json(readJson(FILES.projects)));

router.patch('/projects/:id', requireAdmin, async (req, res) => {
  const projects = readJson(FILES.projects);
  const i = projects.findIndex((p) => p.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Order not found.' });
  const b = { ...req.body };
  delete b.id;
  delete b.quote; // recomputed, never taken from a request
  projects[i] = { ...projects[i], ...b, updatedAt: new Date().toISOString() };
  await writeJson(FILES.projects, projects);
  res.json(projects[i]);
});

router.delete('/projects/:id', requireAdmin, async (req, res) => {
  const projects = readJson(FILES.projects);
  const next = projects.filter((p) => p.id !== req.params.id);
  if (next.length === projects.length) return res.status(404).json({ error: 'Order not found.' });
  await writeJson(FILES.projects, next);
  res.json({ deleted: req.params.id });
});

export default router;
