'use strict';
/* ---------------------------------------------------------------------------
   Generates the sample photography in server/public/img/.

     node tools/make-images.js

   Why generated rather than downloaded: this project has to work with no
   network and no licence questions, and stock photos are neither. These are
   flat SVG scenes — one hero and three gallery shots per trade, drawn from the
   category's own accent colour — small enough to sit in git and honest enough
   that nobody mistakes them for the customer's real photos.

   Re-run it after changing a palette or adding a category. It only writes
   files; nothing else reads this script at runtime.
--------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'server', 'public', 'img');

/* --- palette -------------------------------------------------------------- */
const ACCENT = {
  restaurants: '#C2410C', clinics: '#0E7490', salons: '#BE185D', gyms: '#B91C1C',
  hotels: '#A16207', 'real-estate': '#1D4ED8', 'interior-designers': '#7C2D12',
  'coaching-classes': '#6D28D9', manufacturers: '#3F4A5A', furniture: '#92400E',
  boutiques: '#9D174D', photographers: '#243244', 'event-planners': '#C026D3',
  'lawyers-accountants': '#155E75', travel: '#0F766E', contractors: '#B4740B',
  'local-services': '#0369A1',
};

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const to = amount < 0 ? 0 : 255;
  const k = Math.abs(amount);
  const mix = (c) => Math.round(c + (to - c) * k);
  return '#' + [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)]
    .map((c) => c.toString(16).padStart(2, '0')).join('');
}

/* --- scene parts ---------------------------------------------------------- */
/* Each trade gets a small vocabulary of shapes. Variants shift the composition
   so four images from one category do not look like four copies. */

const SCENES = {
  restaurants: (a, v) => [
    circle(200 + v * 24, 210, 92 - v * 6, '#fff', 0.95),
    circle(200 + v * 24, 210, 66 - v * 5, shade(a, -0.25), 1),
    circle(180 + v * 20, 195, 20, shade(a, 0.45), 0.9),
    circle(216 + v * 26, 224, 13, shade(a, 0.3), 0.85),
    rect(60, 300, 280, 10, 5, '#fff', 0.5),
    rect(330 - v * 10, 130, 12, 160, 6, '#fff', 0.75),
    circle(336 - v * 10, 126, 13, '#fff', 0.75),
  ],
  clinics: (a, v) => [
    rect(150 + v * 12, 120, 100, 190, 46, '#fff', 0.95),
    rect(168 + v * 12, 150, 64, 130, 32, shade(a, -0.2), 0.5),
    rect(178 - v * 4, 62, 44, 14, 7, '#fff', 0.85),
    rect(193 - v * 4, 47, 14, 44, 7, '#fff', 0.85),
    circle(96, 268, 26, '#fff', 0.35),
    circle(318, 240, 18, '#fff', 0.25),
  ],
  salons: (a, v) => [
    // scissors: two blades crossing, two finger loops
    shape(`M136 ${104 + v * 6} L250 246`, 'none', 1).replace('fill="none"', `fill="none" stroke="#fff" stroke-width="17" stroke-linecap="round"`),
    shape(`M264 ${104 + v * 6} L150 246`, 'none', 1).replace('fill="none"', `fill="none" stroke="#fff" stroke-width="17" stroke-linecap="round"`),
    circle(134, 286, 30, 'none', 1).replace('fill="none"', 'fill="none" stroke="#fff" stroke-width="16"'),
    circle(266, 286, 30, 'none', 1).replace('fill="none"', 'fill="none" stroke="#fff" stroke-width="16"'),
    circle(200, 202, 11, shade(a, -0.45), 1),
    circle(320 - v * 12, 118, 15, '#fff', 0.3),
  ],
  gyms: (a, v) => [
    rect(120, 186 + v * 6, 160, 26, 13, '#fff', 0.95),
    rect(86, 160 + v * 6, 34, 78, 12, '#fff', 0.9),
    rect(280, 160 + v * 6, 34, 78, 12, '#fff', 0.9),
    rect(60, 176 + v * 6, 24, 46, 10, shade(a, 0.4), 0.9),
    rect(316, 176 + v * 6, 24, 46, 10, shade(a, 0.4), 0.9),
    rect(120, 292, 160, 8, 4, '#fff', 0.3),
  ],
  hotels: (a, v) => [
    rect(96, 180 - v * 8, 208, 130, 8, '#fff', 0.95),
    rect(96, 150 - v * 8, 208, 34, 17, shade(a, -0.2), 0.95),
    rect(120, 214 - v * 8, 60, 46, 6, shade(a, -0.35), 0.55),
    rect(220, 214 - v * 8, 60, 46, 6, shade(a, -0.35), 0.55),
    rect(140, 100, 120, 46, 10, '#fff', 0.35),
    circle(300, 92, 24, '#fff', 0.3),
  ],
  'real-estate': (a, v) => [
    shape('M200 92 L322 186 L322 316 L78 316 L78 186 Z', '#fff', 0.95),
    rect(112, 214, 62, 54, 5, shade(a, -0.25), 0.6),
    rect(226, 214, 62, 54, 5, shade(a, -0.25), 0.6),
    rect(172, 256, 56, 60, 4, shade(a, -0.4), 0.9),
    rect(268 + v * 8, 120, 18, 62, 4, '#fff', 0.5),
  ],
  'interior-designers': (a, v) => [
    rect(72, 208, 256, 90, 12, '#fff', 0.95),
    rect(92, 168 + v * 6, 60, 52, 10, '#fff', 0.7),
    rect(164, 156 + v * 6, 60, 64, 10, '#fff', 0.55),
    rect(236, 172 + v * 6, 60, 48, 10, '#fff', 0.7),
    rect(100, 298, 24, 26, 4, shade(a, -0.4), 0.9),
    rect(276, 298, 24, 26, 4, shade(a, -0.4), 0.9),
  ],
  'coaching-classes': (a, v) => [
    shape('M200 108 L336 168 L200 228 L64 168 Z', '#fff', 0.95),
    shape('M132 196 L132 258 q68 40 136 0 L268 196', shade(a, -0.3), 0.9),
    rect(322, 168, 8, 74, 4, '#fff', 0.7),
    circle(326, 250 + v * 6, 12, '#fff', 0.7),
  ],
  manufacturers: (a, v) => [
    rect(64, 214, 272, 100, 6, '#fff', 0.92),
    shape('M96 214 L96 150 L146 186 L146 150 L196 186 L196 214 Z', '#fff', 0.75),
    rect(238, 138 - v * 8, 26, 78, 4, '#fff', 0.6),
    circle(251, 122 - v * 8, 16, '#fff', 0.35),
    rect(96, 250, 40, 40, 4, shade(a, -0.35), 0.7),
    rect(160, 250, 40, 40, 4, shade(a, -0.35), 0.7),
  ],
  furniture: (a, v) => [
    // armchair: tall back, seat cushion, two arms, four legs
    rect(126, 118 + v * 6, 148, 118, 22, '#fff', 0.9),
    rect(112, 206 + v * 6, 176, 62, 16, '#fff', 0.95),
    rect(92, 178 + v * 6, 34, 90, 15, '#fff', 0.8),
    rect(274, 178 + v * 6, 34, 90, 15, '#fff', 0.8),
    rect(112, 268 + v * 6, 14, 34, 4, shade(a, -0.4), 0.9),
    rect(274, 268 + v * 6, 14, 34, 4, shade(a, -0.4), 0.9),
    rect(156, 148 + v * 6, 88, 8, 4, shade(a, -0.25), 0.35),
  ],
  boutiques: (a, v) => [
    shape(`M200 108 L246 138 L${232 + v * 8} 300 L${168 - v * 8} 300 L154 138 Z`, '#fff', 0.95),
    shape('M172 112 q28 34 56 0', shade(a, -0.3), 0.9),
    circle(200, 176, 8, shade(a, -0.4), 0.7),
    circle(200, 210, 8, shade(a, -0.4), 0.7),
    rect(300, 140, 10, 150, 5, '#fff', 0.4),
  ],
  photographers: (a, v) => [
    rect(88, 158, 224, 152, 16, '#fff', 0.95),
    circle(200, 234, 54 - v * 4, shade(a, -0.3), 1),
    circle(200, 234, 30 - v * 3, shade(a, 0.35), 0.9),
    rect(160, 136, 80, 26, 8, '#fff', 0.95),
    circle(282, 186, 10, shade(a, 0.5), 0.9),
  ],
  'event-planners': (a, v) => [
    shape('M200 118 L216 176 L278 176 L228 212 L246 272 L200 236 L154 272 L172 212 L122 176 L184 176 Z', '#fff', 0.95),
    circle(96 + v * 10, 138, 16, '#fff', 0.55),
    circle(310 - v * 10, 158, 12, '#fff', 0.45),
    circle(120, 286, 12, '#fff', 0.4),
    circle(292, 292, 18, '#fff', 0.35),
  ],
  'lawyers-accountants': (a, v) => [
    rect(194, 108, 12, 200, 6, '#fff', 0.95),
    rect(112, 138, 176, 10, 5, '#fff', 0.95),
    shape('M112 148 L84 214 L140 214 Z', '#fff', 0.8),
    shape('M288 148 L260 214 L316 214 Z', '#fff', 0.8),
    rect(150, 300, 100, 14, 7, '#fff', 0.9),
    circle(200, 100, 12 + v * 2, '#fff', 0.7),
  ],
  travel: (a, v) => [
    shape(`M96 236 L316 ${168 - v * 6} L296 216 L200 246 L164 300 L146 262 Z`, '#fff', 0.95),
    circle(300, 118, 26, '#fff', 0.35),
    rect(72, 292, 120, 8, 4, '#fff', 0.3),
    circle(120, 150, 14, '#fff', 0.25),
  ],
  contractors: (a, v) => [
    // hard hat: flat dome, wide brim, centre ridge
    shape('M128 214 q0 -84 72 -84 q72 0 72 84 z', '#fff', 0.95),
    rect(90, 214, 220, 26, 13, '#fff', 0.95),
    rect(193, 132, 14, 82, 7, shade(a, -0.3), 0.55),
    rect(120, 276 + v * 6, 160, 12, 6, '#fff', 0.35),
    circle(322 - v * 10, 132, 14, '#fff', 0.3),
  ],
  'local-services': (a, v) => [
    shape('M148 132 a44 44 0 1 0 44 44 L280 264 a26 26 0 0 0 36 -36 L228 140 a44 44 0 0 0 -44 -44 z', '#fff', 0.95),
    circle(150, 156, 18, shade(a, -0.35), 1),
    rect(96 + v * 10, 268, 66, 12, 6, '#fff', 0.45),
    circle(320, 128, 16, '#fff', 0.3),
  ],
};

/* --- primitives ----------------------------------------------------------- */
const rect = (x, y, w, h, r, fill, o) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" opacity="${o}"/>`;
const circle = (cx, cy, r, fill, o) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${o}"/>`;
const shape = (d, fill, o) => `<path d="${d}" fill="${fill}" opacity="${o}"/>`;

/* --- one image ------------------------------------------------------------ */
/* Blend a colour toward a dark slate. These sit next to whatever accent the
   customer picked, so a fully saturated trade colour would fight it — a real
   photograph does not glow. Muting them makes the art read as photography
   rather than as a second brand colour competing with the first. */
function mute(hex, amount) {
  const slate = [26, 34, 44];
  const n = parseInt(hex.slice(1), 16);
  const src = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return '#' + src
    .map((c, i) => Math.round(c + (slate[i] - c) * amount))
    .map((c) => c.toString(16).padStart(2, '0')).join('');
}

function image(slug, variant) {
  const accent = mute(ACCENT[slug] || '#0E7C5A', 0.42);
  const scene = SCENES[slug] || SCENES['local-services'];
  const angle = 140 + variant * 15;
  const from = shade(accent, variant % 2 ? 0.1 : -0.02);
  const to = shade(accent, -0.5 + variant * 0.04);

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">',
    '<defs>',
    `<linearGradient id="g" gradientTransform="rotate(${angle})">`,
    `<stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>`,
    '</linearGradient>',
    '<radialGradient id="s" cx="72%" cy="18%">',
    '<stop offset="0%" stop-color="#fff" stop-opacity=".22"/>',
    '<stop offset="70%" stop-color="#fff" stop-opacity="0"/>',
    '</radialGradient>',
    '</defs>',
    '<rect width="400" height="400" fill="url(#g)"/>',
    scene(accent, variant).join(''),
    '<rect width="400" height="400" fill="url(#s)"/>',
    '</svg>',
  ].join('');
}

/* --- write ---------------------------------------------------------------- */
fs.mkdirSync(OUT, { recursive: true });

let written = 0;
for (const slug of Object.keys(ACCENT)) {
  for (let v = 0; v < 6; v += 1) {
    const name = `${slug}-${v === 0 ? 'hero' : v}.svg`;
    fs.writeFileSync(path.join(OUT, name), image(slug, v), 'utf8');
    written += 1;
  }
}

const bytes = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`  wrote ${written} images to server/public/img (${Math.round(bytes / 1024)} KB total)`);
