/* ---------------------------------------------------------------------------
   The customer's side of an order: looking it up, and sending content in.

   The reference number alone is short and guessable, so it is always paired
   with the phone number on the order — you need both. The reply is a
   hand-picked subset: the customer's own details and their quote, never the
   internal notes or a stage the studio has not told them about.
--------------------------------------------------------------------------- */
import { Router } from 'express';
import { KEYS, readJson, writeJson } from '../lib/store.js';
import { limit } from '../lib/throttle.js';
import { phoneTail } from '../lib/ids.js';

const router = Router();

const matcher = (ref, digits) => (p) => {
  if (String(p.id).toUpperCase() !== ref) return false;
  return phoneTail(p.customer.phone) === phoneTail(digits) || phoneTail(p.customer.whatsapp) === phoneTail(digits);
};

router.post('/track', limit('track', 10, 'Too many lookups. Wait a minute.'), (req, res) => {
  const ref = String(req.body.ref || '').trim().toUpperCase();
  const digits = String(req.body.phone || '').replace(/\D/g, '');
  if (!ref || digits.length < 4) {
    return res.status(400).json({ error: 'Enter your reference number and the phone number on the order.' });
  }

  const project = readJson(KEYS.projects).find(matcher(ref, digits));
  // Same answer whether the ref is wrong or the phone is — no probing.
  if (!project) return res.status(404).json({ error: 'No order matches that reference and phone number.' });

  res.json({
    id: project.id,
    date: project.date,
    stage: project.stage,
    business: project.customer.business,
    owner: project.customer.owner,
    demoName: project.demoName,
    quote: project.quote,
    domain: project.selection && project.selection.domain ? project.selection.domain : null,
    payment: {
      method: project.payment.method, status: project.payment.status,
      advance: project.payment.advance, balance: project.payment.balance,
    },
    wantsDynamic: project.wantsDynamic,
    customisation: project.customisation, // so they can reopen their own site
    submissions: (project.submissions || []).map((s) => ({
      id: s.id, at: s.at, note: s.note, images: (s.images || []).length,
    })),
    updatedAt: project.updatedAt || project.createdAt,
  });
});

/* Sending content after the order. This is where projects actually stall —
   photos and prices arrive as WhatsApp messages nobody can find later. Same
   reference + phone gate as tracking; everything lands on the project as a
   dated submission rather than overwriting what is there. */
router.post('/submit', limit('submit', 12, 'Too many uploads at once. Give it a minute.'), async (req, res) => {
  const b = req.body;
  const ref = String(b.ref || '').trim().toUpperCase();
  const digits = String(b.phone || '').replace(/\D/g, '');

  const projects = readJson(KEYS.projects);
  const i = projects.findIndex(matcher(ref, digits));
  if (i < 0) return res.status(404).json({ error: 'No order matches that reference and phone number.' });

  const images = Array.isArray(b.images) ? b.images.slice(0, 20) : [];
  const note = String(b.note || '').slice(0, 4000);
  if (!images.length && !note.trim()) return res.status(400).json({ error: 'Add a photo or write something first.' });

  const submission = {
    id: 'sub_' + Date.now().toString(36),
    at: new Date().toISOString(),
    note,
    images: images.map((im) => ({ name: String(im.name || 'photo').slice(0, 120), data: im.data })),
  };
  projects[i].submissions = (projects[i].submissions || []).concat([submission]);
  projects[i].updatedAt = new Date().toISOString();
  await writeJson(KEYS.projects, projects);
  console.log(`  content received for ${projects[i].id} — ${images.length} photo(s)${note ? ' + a note' : ''}`);
  res.status(201).json({ ok: true, count: projects[i].submissions.length });
});

export default router;
