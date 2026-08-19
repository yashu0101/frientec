import { asset } from '../config.js';

/* Numbers, names and the per-trade colour and icon each card is dressed in. */

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const initials = (s) =>
  String(s || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '').slice(0, 40);

/* One accent per trade, carried by the icon tile, the card edge and the glow
   under the pointer — so a clinic is never a recoloured salon. */
export const CAT_COLOR = {
  restaurants: '#C2410C', clinics: '#0E7490', salons: '#BE185D', gyms: '#B91C1C',
  hotels: '#A16207', 'real-estate': '#1D4ED8', 'interior-designers': '#7C2D12',
  'coaching-classes': '#6D28D9', manufacturers: '#3F4A5A', furniture: '#92400E',
  boutiques: '#9D174D', photographers: '#243244', 'event-planners': '#C026D3',
  'lawyers-accountants': '#155E75', travel: '#0F766E', contractors: '#B4740B',
  'local-services': '#0369A1',
};

export const CAT_ICON = {
  restaurants: '🍽', clinics: '🩺', salons: '✂️', gyms: '🏋️', hotels: '🛏', 'real-estate': '🏢',
  'interior-designers': '🛋', 'coaching-classes': '🎓', manufacturers: '🏭', furniture: '🪑',
  boutiques: '👗', photographers: '📷', 'event-planners': '🎉', 'lawyers-accountants': '⚖️',
  travel: '✈️', contractors: '🦺', 'local-services': '🔧',
};

export const accOf = (slug) => CAT_COLOR[slug] || '#0E7C5A';

export function tint(hex, a) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (!isFinite(n)) return `rgba(14,124,90,${a})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* The two custom properties every hoverable card is themed by. */
export const accVars = (hex) => ({ '--acc': hex, '--acc-soft': tint(hex, 0.12) });

/* The card shows the picture its design actually opens with, using the same
   slot the renderers use — so the grid previews the design rather than showing
   every design in a trade behind the same photograph. */
export function pickShot(slot, i) {
  const n = ((Number(slot) || 0) * 2 + (i || 0)) % 6;
  return n === 0 ? 'hero' : n;
}

export const thumbArt = (category, variant) =>
  `linear-gradient(180deg,rgba(0,0,0,.34),rgba(0,0,0,.06)),url('${asset(`/img/${category || 'local-services'}-${variant}`)}')`;

/* The bare photograph a design opens with, no gradient over it — what the
   landing scenes put on an orbiting card or the face of a box. */
export const artOf = (d) => asset(`/img/${d.category || 'local-services'}-${pickShot(d.shot, 0)}`);

/* Stays relative on purpose: this value goes into the studio's state and is
   saved onto the order, so it must not carry whichever host built the page.
   It is resolved at render time instead. */
export const sampleImage = (slug, variant) => `/img/${slug || 'local-services'}-${variant}`;
export const isSample = (src) => typeof src === 'string' && src.indexOf('/img/') === 0;

export const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export const STATUS_COLOR = {
  New: ['#E7F0FB', '#1B5FA8'], Contacted: ['#FDF0DC', '#8A5A0B'], Qualified: ['#EDE9FB', '#5B45A8'],
  'Proposal Sent': ['#E4F4EC', '#0E7C5A'], Negotiation: ['#FBEDE4', '#9A4A1B'],
  Won: ['#DFF3E6', '#14663A'], Lost: ['#F6E7E7', '#9A2C2C'],
};

export const BUDGETS = ['Under ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000–₹1,00,000', '₹1,00,000+'];

export const FEATURES = ['Online booking', 'WhatsApp chat', 'Online payments', 'Product catalogue',
  'Ecommerce', 'Appointment system', 'Contact forms', 'Google Maps', 'Gallery', 'Blog',
  'Customer login', 'Other'];

export const ORDER_STAGES = ['Order placed', 'Advance received', 'Content collected', 'Building', 'Review', 'Live', 'Cancelled'];

export const STAGE_STEPS = ['Order placed', 'Advance received', 'Content collected', 'Building', 'Review', 'Live'];

export const PAY_LABEL = {
  upi: 'UPI', bank: 'Bank transfer / NEFT',
  card: 'Card or netbanking', call: 'Decide on the call',
};

/* The admin table's shorter labels for the same four methods. */
export const PAY_LABEL_SHORT = { upi: 'UPI', bank: 'Bank transfer', card: 'Card / netbanking', call: 'Decide on call' };

export const waLink = (number, text) =>
  `https://wa.me/${String(number || '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export const fullDomainOf = (domain) => {
  if (!domain) return '';
  return domain.mode === 'own'
    ? String(domain.own || '').trim().toLowerCase()
    : (domain.name ? slugify(domain.name) + domain.tld : '');
};
