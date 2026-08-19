import { Router } from 'express';
import { FILES, readJson, writeJson } from '../lib/store.js';
import { requireAdmin } from '../lib/auth.js';
import { nextLeadId, today } from '../lib/ids.js';

const router = Router();

const REQUIRED = ['owner', 'business', 'phone', 'whatsapp', 'city', 'category'];

router.post('/leads', async (req, res) => {
  const leads = readJson(FILES.leads);
  const b = req.body;
  const missing = REQUIRED.filter((k) => !String(b[k] || '').trim());
  if (missing.length) return res.status(400).json({ error: 'Missing required fields', fields: missing });

  const lead = {
    id: nextLeadId(leads),
    owner: b.owner, business: b.business, phone: b.phone, whatsapp: b.whatsapp,
    city: b.city, category: b.category, demo: b.demo || '',
    email: b.email || '', website: b.website || '', instagram: b.instagram || '',
    budget: b.budget || '', features: Array.isArray(b.features) ? b.features : [],
    message: b.message || '', status: 'New', value: 0, priority: 'Medium', notes: '',
    date: today(), createdAt: new Date().toISOString(),
  };
  leads.unshift(lead);
  await writeJson(FILES.leads, leads);
  console.log(`  new lead ${lead.id} — ${lead.business} (${lead.city}) wants ${lead.demo || 'a quote'}`);
  res.status(201).json(lead);
});

router.get('/leads', requireAdmin, (req, res) => res.json(readJson(FILES.leads)));

router.patch('/leads/:id', requireAdmin, async (req, res) => {
  const leads = readJson(FILES.leads);
  const i = leads.findIndex((l) => l.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Lead not found.' });
  const b = { ...req.body };
  delete b.id;
  leads[i] = { ...leads[i], ...b, updatedAt: new Date().toISOString() };
  await writeJson(FILES.leads, leads);
  res.json(leads[i]);
});

router.delete('/leads/:id', requireAdmin, async (req, res) => {
  const leads = readJson(FILES.leads);
  const next = leads.filter((l) => l.id !== req.params.id);
  if (next.length === leads.length) return res.status(404).json({ error: 'Lead not found.' });
  await writeJson(FILES.leads, next);
  res.json({ deleted: req.params.id });
});

export default router;
