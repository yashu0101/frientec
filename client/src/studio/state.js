/* ---------------------------------------------------------------------------
   The studio's state: what a fresh session looks like, what gets kept on the
   device between visits, and what must be filled in before each step can pass.
--------------------------------------------------------------------------- */
import { sampleImage, slugify } from '../lib/format.js';
import { pack, guessCity } from './packs.js';

export function freshState(demo, settings, categories) {
  const d = demo || {};
  const p = pack(d.category);
  const plans = settings.plans || [];
  const chosen = plans.find((x) => x.popular) || plans[1] || plans[0] || { id: 'starter', pages: 1 };

  return {
    c: {
      // who
      owner: '', ownerRole: 'Owner', business: '', phone: '', whatsapp: '', email: '',
      city: '', address: '', hours: 'Mon – Sat · 10 am – 8 pm', instagram: '', website: '',
      category: d.category || (categories[0] || {}).slug || '',
      // words
      eyebrow: '', heroTitle: '', heroText: '', tagline: '',
      ctaLabel: p.cta, aboutLabel: 'About us', aboutTitle: '',
      about: 'Write two or three lines about how you started, what you are known for, and why people keep coming back. Plain language works best.',
      points: p.points.slice(),
      servicesLabel: p.svcLabel, servicesTitle: p.svcLabel, servicesText: '',
      galleryTitle: 'Have a look', reviewsTitle: 'What customers say', visitTitle: 'Where to find us',
      ctaTitle: '', ctaText: 'Send us a message on WhatsApp and we will reply the same day.',
      // look — seeded from the design that was picked
      accent: d.accent || '#0E7C5A', ink: d.ink || '#101820', mode: d.mode || 'light',
      font: 'modern', radius: 'soft', layout: 'split', topbar: true,
      /* media — the trade's sample photos, so the preview is a whole site from
         the first second. `sampleImages` keeps the panel honest about where they
         came from, and clears the moment one is replaced. */
      logo: '', hero: sampleImage(d.category, 'hero'),
      gallery: [sampleImage(d.category, 1), sampleImage(d.category, 2), sampleImage(d.category, 3)],
      sampleImages: true,
      // content
      services: p.services.map((x) => ({ name: x.name, desc: x.desc, price: x.price })),
      reviews: [
        { text: 'Write out a real review a customer gave you. Two lines is plenty.', author: 'Customer name' },
        { text: 'A second one, about something specific — the service, the price, the timing.', author: 'Customer name' },
      ],
      sections: { about: true, services: true, gallery: true, reviews: true, hours: true, cta: true },
      galleryMeta: (p.shots || []).map((x) => ({ title: x.title, desc: x.desc })),
      // languages: first one is primary; the rest add a switcher to the site
      languages: ['en'],
      i18n: {},
    },
    sel: {
      planId: chosen.id,
      pages: chosen.pages,
      addons: [],
      extraLanguages: 0,
      domain: {
        mode: 'new', name: '',
        tld: (settings.domains && settings.domains[0] ? settings.domains[0].tld : '.com'),
        years: 1, privacy: true, own: '',
      },
      hostingId: (settings.hosting || []).find((h) => h.recommended) ? 'h1' : 'none',
    },
    payment: { method: 'upi', terms: false },
  };
}

/* --- draft persistence (images excluded — they blow the quota) ------------ */
const draftKey = (slug) => 'sf_studio_' + slug;

export function saveDraft(slug, c, sel) {
  const copy = JSON.parse(JSON.stringify({ c, sel }));
  copy.c.logo = '';
  copy.c.hero = '';
  copy.c.gallery = [];
  localStorage.setItem(draftKey(slug), JSON.stringify(copy));
}

export function loadDraft(slug) {
  try {
    const raw = localStorage.getItem(draftKey(slug));
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.c) return null;
    d.c.logo = '';
    d.c.hero = '';
    d.c.gallery = [];
    return d;
  } catch {
    return null;
  }
}

export function clearDraft(slug) {
  try { localStorage.removeItem(draftKey(slug)); } catch { /* private mode */ }
}

/* --- validation ---------------------------------------------------------- */
const PHONE = /^[0-9 +\-()]{8,}$/;

export function validateCustomise(c) {
  const e = {};
  [['business', 'Your business name is needed — it goes all over the site.'],
   ['owner', 'Required'], ['phone', 'Required'], ['whatsapp', 'Required'], ['city', 'Required']]
    .forEach(([k, msg]) => { if (!String(c[k] || '').trim()) e[k] = msg; });
  if (!c.category) e.category = 'Pick a category';
  if (c.phone && !PHONE.test(c.phone)) e.phone = 'Enter a valid phone number';
  if (c.whatsapp && !PHONE.test(c.whatsapp)) e.whatsapp = 'Enter a valid number';
  return e;
}

export function validateDomain(sel) {
  const e = {};
  const d = sel.domain;
  if (d.mode === 'new') {
    if (!slugify(d.name)) e.dname = 'Type the name you want, or switch to “I already have one”.';
  } else if (!String(d.own || '').trim()) {
    e.own = 'Type the domain you already own.';
  } else if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(String(d.own).trim())) {
    e.own = 'That does not look like a domain. Example: yourbusiness.com';
  }
  return e;
}

export function validatePayment(c, payment) {
  const e = {};
  ['owner', 'phone', 'whatsapp'].forEach((k) => { if (!String(c[k] || '').trim()) e[k] = 'Required'; });
  if (!payment.terms) e.terms = 'Tick this to place the order.';
  return e;
}

/* --- the offline writer's output ----------------------------------------- */
/* When the server has no AI key the Generate button still has to do something
   honest. This says so in its note; it does not pretend to be the model. */
export function localDraft(brief, { demo, c, categoryOf }) {
  const category = categoryOf(brief) || c.category || demo.category;
  const p = pack(category);
  const firstLine = String(brief).split(/[.!?\n]/).map((s) => s.trim()).filter(Boolean)[0] || '';

  return {
    business: c.business || '',
    category,
    eyebrow: guessCity(brief) || c.city || '',
    heroTitle: c.business || demo.name,
    heroText: firstLine.length > 20 ? firstLine : '',
    ctaLabel: p.cta,
    aboutTitle: c.business ? 'About ' + c.business : 'About us',
    about: String(brief).trim().slice(0, 600),
    points: p.points.slice(0, 3),
    servicesLabel: p.svcLabel,
    servicesTitle: p.svcLabel,
    services: p.services.map((s) => ({ name: s.name, desc: s.desc, price: s.price })),
    reviews: c.reviews,
    ctaTitle: c.business ? `Ready to visit ${c.business}?` : '',
    ctaText: c.ctaText,
    accent: demo.accent, mode: demo.mode, font: c.font, radius: c.radius, layout: c.layout,
    hours: c.hours,
    note: 'Written on your device from the ' + category.replace(/-/g, ' ') +
      ' starter page — this server has no AI key set, so your words went in but nothing was rewritten. Every line is worth editing.',
  };
}
