import { Router } from 'express';
import { FILES, readJson, writeJson } from '../lib/store.js';
import { requireAdmin } from '../lib/auth.js';
import { slugify, nextDemoId } from '../lib/ids.js';
import * as seed from '../lib/seed.js';

const router = Router();

router.get('/demos', (req, res) => res.json(readJson(FILES.demos)));

router.post('/demos', requireAdmin, async (req, res) => {
  const demos = readJson(FILES.demos);
  const b = req.body;
  if (!b.name || !b.category) return res.status(400).json({ error: 'Name and category are required.' });

  let slug = slugify(b.slug || b.name);
  while (demos.some((d) => d.slug === slug)) slug += '-2';

  const sections = Array.isArray(b.sections) && b.sections.length
    ? b.sections
    : ['Navbar', 'Hero', ...(seed.GENERIC_SECTIONS[b.category] || ['Services', 'Gallery', 'Reviews', 'Contact']), 'Footer'];

  const demo = {
    id: nextDemoId(demos), slug, name: b.name, category: b.category,
    style: b.style || 'Custom', description: b.description || '',
    ink: b.ink || '#161A1D', accent: b.accent || '#0E7C5A', mode: b.mode === 'dark' ? 'dark' : 'light',
    tags: Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    sections, template: b.template || 'generic', kind: 'custom',
    published: b.published !== false, featured: !!b.featured, premium: !!b.premium,
    createdAt: new Date().toISOString(),
  };
  demos.push(demo);
  await writeJson(FILES.demos, demos);
  res.status(201).json(demo);
});

router.patch('/demos/:id', requireAdmin, async (req, res) => {
  const demos = readJson(FILES.demos);
  const { id } = req.params;
  const i = demos.findIndex((d) => d.id === id || d.slug === id);
  if (i < 0) return res.status(404).json({ error: 'Design not found.' });

  const b = { ...req.body };
  delete b.id;
  if (b.slug) b.slug = slugify(b.slug);
  demos[i] = { ...demos[i], ...b, updatedAt: new Date().toISOString() };
  await writeJson(FILES.demos, demos);
  res.json(demos[i]);
});

router.delete('/demos/:id', requireAdmin, async (req, res) => {
  const demos = readJson(FILES.demos);
  const { id } = req.params;
  const next = demos.filter((d) => d.id !== id && d.slug !== id);
  if (next.length === demos.length) return res.status(404).json({ error: 'Design not found.' });
  await writeJson(FILES.demos, next);
  res.json({ deleted: id });
});

export default router;
