/* ---------------------------------------------------------------------------
   The AI half of the studio.

   Two jobs, both of which write straight into the customisation object the
   preview already renders:

     describe(brief)  →  a whole site — headings, about text, services with
                         prices, selling points, reviews, colours, layout
     translate(...)   →  the same page in Hindi, Marathi, Tamil, …

   Two things are deliberate here.

   1. The SDK is loaded lazily. The Frendzo's whole pitch is that you clone it
      and run `node server.js`. If @anthropic-ai/sdk isn't installed, or no
      API key is set, the server still boots and the studio still works — it
      answers 503 with `fallback: true`, and the studio writes the draft
      offline from its own starter packs. AI is an upgrade, never a
      requirement.

   2. Claude returns a validated JSON object, not prose we then parse. The
      schema is the contract: structured outputs guarantee the shape, so the
      studio can apply the result without defensive parsing.
--------------------------------------------------------------------------- */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

/* The SDK stays a lazy, optional dependency: `createRequire` keeps that lookup
   synchronous inside an ES module, so `available()` is still a plain call. */
const require = createRequire(import.meta.url);

const MODEL = 'claude-opus-5';

/* --- lazy client ---------------------------------------------------------- */
let cached;

function client() {
  if (cached !== undefined) return cached;
  try {
    const mod = require('@anthropic-ai/sdk');
    const Anthropic = mod.default || mod;
    // Zero-arg constructor: picks up ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN,
    // or an `ant auth login` profile — whichever the operator has set up.
    cached = new Anthropic();
  } catch (e) {
    cached = null; // not installed, or no credentials — fall back to local
  }
  return cached;
}

/* The SDK constructor does not throw on a missing key — it fails at request
   time — so check for a credential ourselves. An `ant auth login` profile on
   disk counts, which is why this looks for the config directory too. */
function hasCredentials() {
  if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) return true;
  try {
    const os = require('os');
    const dir = process.env.ANTHROPIC_CONFIG_DIR ||
      (process.platform === 'win32'
        ? path.join(process.env.APPDATA || '', 'Anthropic')
        : path.join(os.homedir(), '.config', 'anthropic'));
    return fs.existsSync(path.join(dir, 'credentials'));
  } catch (e) {
    return false;
  }
}

function available() {
  return !!client() && hasCredentials();
}

const NO_KEY = 'No AI key on this server. Set ANTHROPIC_API_KEY (or run `ant auth login`) and restart to turn this on.';

/* --- the shape Claude must return ----------------------------------------- */
const SITE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'business', 'category', 'eyebrow', 'heroTitle', 'heroText', 'ctaLabel',
    'aboutTitle', 'about', 'points', 'servicesLabel', 'servicesTitle',
    'services', 'reviews', 'ctaTitle', 'ctaText', 'accent', 'mode', 'font',
    'radius', 'layout', 'hours', 'note',
  ],
  properties: {
    business: { type: 'string', description: 'The business name, exactly as the owner wrote it.' },
    category: {
      type: 'string',
      description: 'The catalogue category slug that fits best.',
      enum: [
        'restaurants', 'clinics', 'salons', 'gyms', 'hotels', 'real-estate',
        'interior-designers', 'coaching-classes', 'manufacturers', 'furniture',
        'boutiques', 'photographers', 'event-planners', 'lawyers-accountants',
        'travel', 'contractors', 'local-services',
      ],
    },
    eyebrow: { type: 'string', description: 'Small line above the heading. Six words max, e.g. "Since 2011 · Pune".' },
    heroTitle: { type: 'string', description: 'Main heading. Under nine words. Say what the business is, not a slogan.' },
    heroText: { type: 'string', description: 'One or two sentences under the heading. What they do and who for.' },
    ctaLabel: { type: 'string', description: 'Button text, two or three words. "Book a table", "Get a quote".' },
    aboutTitle: { type: 'string' },
    about: { type: 'string', description: 'Two or three sentences. How they started, what they are known for. Plain language.' },
    points: {
      type: 'array', minItems: 3, maxItems: 3,
      items: { type: 'string', description: 'A short selling point, four words or so.' },
    },
    servicesLabel: { type: 'string', description: 'What this trade calls its list: Menu, Treatments, Packages, Services.' },
    servicesTitle: { type: 'string' },
    services: {
      type: 'array', minItems: 3, maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'desc', 'price'],
        properties: {
          name: { type: 'string' },
          desc: { type: 'string', description: 'One short line.' },
          price: { type: 'string', description: 'Indian rupees, e.g. "₹280" or "From ₹8,500" or "On enquiry".' },
        },
      },
    },
    reviews: {
      type: 'array', minItems: 2, maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'author'],
        properties: {
          text: { type: 'string', description: 'A believable customer review, one or two sentences.' },
          author: { type: 'string', description: 'A first name and last initial.' },
        },
      },
    },
    ctaTitle: { type: 'string' },
    ctaText: { type: 'string' },
    accent: { type: 'string', description: 'Hex colour that suits this trade, e.g. "#C2410C".' },
    mode: { type: 'string', enum: ['light', 'dark'] },
    font: { type: 'string', enum: ['modern', 'classic', 'bold', 'editorial'] },
    radius: { type: 'string', enum: ['sharp', 'soft', 'round'] },
    layout: { type: 'string', enum: ['split', 'center', 'image'] },
    hours: { type: 'string', description: 'Opening hours if the brief mentions them, otherwise a sensible default for the trade.' },
    note: { type: 'string', description: 'One sentence to the owner: what you assumed, and what they should check or replace.' },
  },
};

const SYSTEM = [
  'You write the first draft of a small business website for a studio in India.',
  '',
  'The owner has described their business in a sentence or two. Turn that into',
  'the page: headings, an about paragraph, their services with realistic Indian',
  'rupee prices, three selling points, and two or three reviews.',
  '',
  'Write the way the owner would speak, not the way a marketing agency writes.',
  'Short sentences. No "unlock", "elevate", "seamless", "nestled in the heart of".',
  'No exclamation marks. Concrete beats clever: "Open till 11, parking at the back"',
  'is worth more than "an unforgettable experience".',
  '',
  'Prices and services are a starting point the owner will correct, so keep them',
  'plausible for the trade and the city rather than aspirational.',
  '',
  'Reviews must read like a real customer typed them on a phone, and the owner',
  'is told to replace them with real ones — so keep them specific and modest,',
  'never five-star marketing copy.',
  '',
  'Pick colours, typeface and layout that suit the trade: a dentist is calm and',
  'light, a tandoori place is warm and bold, a law firm is restrained.',
].join('\n');

/* --- the AI path ---------------------------------------------------------- */
async function describeWithClaude(brief, hints) {
  const c = client();
  const context = [
    'The owner wrote:',
    '"""',
    String(brief).slice(0, 4000),
    '"""',
  ];
  if (hints && hints.city) context.push('', 'City: ' + hints.city);
  if (hints && hints.category) context.push('Category they picked in the form: ' + hints.category);
  if (hints && hints.design) context.push('Design they chose in the catalogue: ' + hints.design + ' — keep the draft sympathetic to it.');

  const res = await c.messages.create({
    model: MODEL,
    max_tokens: 16000,
    // Opus 5 thinks by default; medium effort is plenty for a page of copy
    // and keeps the studio's spinner short.
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: SITE_SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: 'user', content: context.join('\n') }],
  });

  if (res.stop_reason === 'refusal') {
    const err = new Error('Claude declined to write that one. Try describing the business differently.');
    err.status = 422;
    throw err;
  }

  const text = (res.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  return { site: JSON.parse(text), by: 'claude', usage: res.usage };
}

/* --- translation ---------------------------------------------------------- */
function translationSchema(keys) {
  const props = {};
  keys.forEach((k) => { props[k] = { type: 'string' }; });
  return { type: 'object', additionalProperties: false, required: keys, properties: props };
}

async function translateWithClaude(fields, language) {
  const c = client();
  const keys = Object.keys(fields).filter((k) => String(fields[k] || '').trim());
  if (!keys.length) return { fields: {}, by: 'claude' };

  const res = await c.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: translationSchema(keys) },
    },
    system: [
      'You translate small business website copy into ' + language + '.',
      '',
      'Translate the meaning, not the words. This is shop signage, not literature:',
      'use the everyday register a shopkeeper would actually use with customers,',
      'and keep each line about as short as the English.',
      '',
      'Leave untranslated: the business name, people\'s names, place names, phone',
      'numbers, prices, and English words that are normally used as-is in Indian',
      'speech (WhatsApp, online, booking).',
    ].join('\n'),
    messages: [{
      role: 'user',
      content: 'Translate each value into ' + language + '.\n\n' +
        JSON.stringify(keys.reduce((o, k) => { o[k] = fields[k]; return o; }, {}), null, 2),
    }],
  });

  if (res.stop_reason === 'refusal') {
    const err = new Error('Claude declined that translation.');
    err.status = 422;
    throw err;
  }

  const text = (res.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  return { fields: JSON.parse(text), by: 'claude', usage: res.usage };
}

/* --- public --------------------------------------------------------------- */
async function describe(brief, hints) {
  if (!String(brief || '').trim()) {
    const err = new Error('Describe the business first — a sentence or two is enough.');
    err.status = 400;
    throw err;
  }
  if (!available()) {
    // The studio has its own offline writer using the same starter packs it
    // already ships, so it handles this rather than us duplicating that data
    // server-side. `fallback` tells it to.
    const err = new Error(NO_KEY);
    err.status = 503;
    err.fallback = true;
    throw err;
  }
  try {
    return await describeWithClaude(brief, hints);
  } catch (e) {
    if (e.status === 422) throw e;
    // Transport, auth or quota failure: let the studio write the draft locally
    // instead of leaving the customer at a dead button.
    const err = new Error(e.message || 'The AI service could not be reached.');
    err.status = 503;
    err.fallback = true;
    throw err;
  }
}

async function translate(fields, language) {
  if (!available()) {
    const err = new Error('Translation needs AI on the server — type them in by hand for now. (' + NO_KEY + ')');
    err.status = 503;
    throw err;
  }
  try {
    return await translateWithClaude(fields, language);
  } catch (e) {
    if (e.status === 422) throw e;
    const err = new Error('Could not reach the AI service: ' + (e.message || 'unknown error'));
    err.status = 503;
    throw err;
  }
}

export { describe, translate, available, MODEL };
