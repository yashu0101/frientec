'use strict';
/* ---------------------------------------------------------------------------
   Replaces the generated SVG stand-ins with real photographs.

     node tools/fetch-photos.js              # all trades
     node tools/fetch-photos.js salons gyms  # just these

   Where the photos come from, and why not Google Images: a Google Images
   result is somebody's copyrighted photograph that happens to be indexed.
   Shipping those inside a product your customers publish is infringement,
   however easy it is to right-click. This pulls from Openverse instead —
   Creative Commons search across Flickr, Wikimedia and others — filtered to
   licences that permit commercial use and modification, and it records the
   photographer, licence and source URL for every single file it saves.

   That attribution is not decoration. CC BY and CC BY-SA require credit, so
   server/public/img/credits.json is part of the licence compliance, and the app
   serves it at #/credits.

   Files land as <trade>-hero.jpg / -1 / -2 / -3.jpg next to the SVGs. The
   server resolves /img/<name> to the .jpg when one exists and the .svg
   otherwise, so nothing else in the codebase has to know which you have.
--------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '..', 'server', 'public', 'img');
const CREDITS = path.join(OUT, 'credits.json');

/* Two or three phrasings per trade: Openverse ranks on tags and titles, and a
   single query tends to return one photographer's whole set. */
const QUERIES = {
  restaurants: ['restaurant interior dining', 'indian food thali', 'cafe counter coffee', 'chef kitchen cooking', 'restaurant table setting', 'street food stall'],
  clinics: ['dental clinic chair', 'doctor stethoscope patient', 'medical clinic reception', 'hospital corridor', 'medical equipment room', 'pharmacy counter'],
  salons: ['hair salon interior', 'barber shop haircut', 'beauty salon styling', 'makeup artist brushes', 'spa treatment room', 'nail salon manicure'],
  gyms: ['gym dumbbells weights', 'fitness training gym', 'yoga class studio', 'treadmill cardio room', 'boxing gym training', 'kettlebell crossfit'],
  hotels: ['hotel room bed', 'hotel lobby reception', 'resort swimming pool', 'hotel bathroom interior', 'hotel restaurant breakfast', 'guest house balcony'],
  'real-estate': ['house exterior home', 'apartment building facade', 'living room property', 'house keys handover', 'suburban street houses', 'balcony city view'],
  'interior-designers': ['living room interior design', 'modern kitchen interior', 'bedroom interior decor', 'wardrobe storage design', 'dining room interior', 'home office interior'],
  'coaching-classes': ['classroom students', 'library study books', 'teacher whiteboard lesson', 'students exam desk', 'science laboratory school', 'computer lab students'],
  manufacturers: ['factory machine industrial', 'metal workshop welding', 'cnc lathe machining', 'assembly line production', 'warehouse pallets storage', 'engineering workshop tools'],
  furniture: ['furniture store sofa', 'wooden chair workshop', 'dining table wood', 'bedroom furniture showroom', 'bookshelf wooden storage', 'carpenter woodworking bench'],
  boutiques: ['clothing boutique rack', 'indian saree textile', 'tailor sewing fabric', 'shop window display clothes', 'handloom weaving loom', 'jewellery display shop'],
  photographers: ['camera photographer lens', 'photo studio lighting', 'wedding photography', 'portrait studio backdrop', 'camera lenses equipment', 'darkroom prints photography'],
  'event-planners': ['wedding decoration flowers', 'event stage lights', 'banquet table setting', 'birthday party decoration', 'conference hall seating', 'marquee tent wedding'],
  'lawyers-accountants': ['law books office', 'office desk documents', 'accountant calculator paperwork', 'courthouse building exterior', 'meeting room conference table', 'filing cabinet archive'],
  travel: ['mountain landscape travel', 'india travel monument', 'beach coast holiday', 'airport terminal departure', 'backwaters houseboat kerala', 'desert dunes camel'],
  contractors: ['construction site building', 'painter wall painting', 'carpenter tools work', 'bricklayer masonry wall', 'scaffolding building site', 'tiling bathroom renovation'],
  'local-services': ['plumber pipe repair', 'electrician wiring work', 'tools workshop repair', 'air conditioner service', 'cleaning service mop', 'appliance repair technician'],
};

/* Wikimedia's User-Agent policy asks for an app name and a contact. A generic
   UA is answered with 429, which is what silently emptied whole trades before
   this was set. */
const UA = 'FrientecSampleFetcher/1.0 (https://example.com/frientec; local demo project)';

/* Flickr serves a 1024px rendition from the same URL with an _b suffix, which
   is the right size for a hero and about a tenth of the bytes. Wikimedia's
   thumb service refuses these requests, so those come as originals and are
   simply skipped when they are too heavy to ship — see the candidate
   fallthrough in fetchTrade. */
function webSized(url) {
  return url.replace(/_[a-z]\.jpg$/i, '_b.jpg');
}

const LICENCE_NAME = {
  cc0: 'CC0', pdm: 'Public Domain Mark', by: 'CC BY', 'by-sa': 'CC BY-SA',
};

/* --- tiny fetch helpers ---------------------------------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Flickr's static host rate-limits a burst, so downloads are paced and a 429
   backs off rather than giving up — otherwise a whole trade silently keeps
   its placeholders because we asked too fast. */
async function getWithRetry(url, attempts) {
  let wait = 1200;
  for (let i = 0; i < (attempts || 4); i += 1) {
    try {
      return await get(url, true);
    } catch (e) {
      const rateLimited = /HTTP 429|HTTP 50\d/.test(e.message);
      if (!rateLimited || i === (attempts || 4) - 1) throw e;
      await sleep(wait);
      wait *= 2;
    }
  }
  throw new Error('unreachable');
}
function get(url, asBuffer, redirects) {
  return new Promise((resolve, reject) => {
    if ((redirects || 0) > 5) return reject(new Error('too many redirects'));
    const req = https.get(url, {
      headers: { 'User-Agent': UA },
      timeout: 25000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(new URL(res.headers.location, url).toString(), asBuffer, (redirects || 0) + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve(asBuffer ? buf : buf.toString('utf8'));
      });
    });
    req.on('timeout', () => { req.destroy(new Error('timed out')); });
    req.on('error', reject);
  });
}

async function search(query) {
  const url = 'https://api.openverse.org/v1/images/?' + new URLSearchParams({
    q: query,
    license_type: 'commercial,modification', // safe to ship and to crop
    page_size: '20',
    mature: 'false',
  });
  const body = await get(url, false);
  const json = JSON.parse(body);
  return json.results || [];
}

/* Landscape, big enough to fill a hero, and not a duplicate of one we already
   took from the same photographer. */
function usable(r, seen) {
  if (!r.url || !r.license) return false;
  if (!LICENCE_NAME[r.license]) return false;
  if (!r.width || !r.height) return false;
  if (r.width < 900) return false;
  const ratio = r.width / r.height;
  if (ratio < 1.15 || ratio > 2.2) return false;
  const key = (r.creator || '') + '|' + (r.title || '');
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}

async function fetchTrade(slug, credits) {
  const queries = QUERIES[slug] || [slug];
  const seen = new Set();
  const candidates = [];

  // Collect well past four: hosts rate-limit, originals can be too heavy, and
  // a dead link should cost us one candidate rather than one of the four slots.
  for (const q of queries) {
    let results;
    try { results = await search(q); }
    catch (e) { console.log(`    search "${q}" failed: ${e.message}`); continue; }
    for (const r of results) {
      if (usable(r, seen)) candidates.push(r);
    }
  }

  if (!candidates.length) {
    console.log(`  ${slug}: nothing usable found — keeping the drawn placeholders`);
    return 0;
  }

  const WANT = 6;
  let saved = 0;
  for (const r of candidates) {
    if (saved >= WANT) break;
    const name = `${slug}-${saved === 0 ? 'hero' : saved}.jpg`;
    try {
      await sleep(400); // be a good citizen on someone else's CDN
      const buf = await getWithRetry(webSized(r.url));
      if (buf.length < 8000) throw new Error('too small');
      if (buf.length > 900000) throw new Error(Math.round(buf.length / 1024) + 'KB, too heavy to ship');
      fs.writeFileSync(path.join(OUT, name), buf);
      credits[name] = {
        title: r.title || 'Untitled',
        creator: r.creator || 'Unknown',
        creator_url: r.creator_url || '',
        licence: LICENCE_NAME[r.license] + (r.license_version ? ' ' + r.license_version : ''),
        licence_url: r.license_url || '',
        source: r.foreign_landing_url || r.url,
        provider: r.provider || '',
      };
      saved += 1;
      console.log(`  ${name.padEnd(24)} ${String(Math.round(buf.length / 1024)).padStart(4)}KB  ${LICENCE_NAME[r.license].padEnd(8)} ${(r.creator || '').slice(0, 26)}`);
    } catch (e) {
      console.log(`  ${('(skipped)').padEnd(24)}        ${e.message}`);
    }
  }
  if (saved < WANT) console.log(`  ${slug}: only ${saved} of ${WANT} — the rest keep their drawn placeholder`);
  return saved;
}

/* --- run ------------------------------------------------------------------- */
(async () => {
  const only = process.argv.slice(2);
  const trades = only.length ? only : Object.keys(QUERIES);
  const unknown = trades.filter((t) => !QUERIES[t]);
  if (unknown.length) {
    console.error('Unknown trade(s):', unknown.join(', '));
    console.error('Known:', Object.keys(QUERIES).join(', '));
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {};

  let total = 0;
  for (const slug of trades) {
    console.log(`\n${slug}`);
    total += await fetchTrade(slug, credits);
    fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2), 'utf8');
  }

  const bytes = fs.readdirSync(OUT)
    .filter((f) => f.endsWith('.jpg'))
    .reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);

  console.log(`\n  ${total} photographs saved, ${Math.round(bytes / 1024 / 1024 * 10) / 10} MB total`);
  console.log('  attribution written to server/public/img/credits.json — it is served at #/credits');
  console.log('  photographs that failed keep their drawn placeholder, which still renders.');
})();
