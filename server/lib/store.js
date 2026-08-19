/* ---------------------------------------------------------------------------
   The store: five JSON documents — categories, demos, leads, projects and
   settings — read and written whole.

   Where they live is a driver choice. `DATABASE_URL` set means Postgres, which
   is what a free host needs because its disk does not survive a redeploy;
   otherwise they are files in ./data, which is what runs locally.

   Both drivers are loaded once at boot into memory. Reads are served from there
   and are synchronous, which is why every route can stay a plain function; each
   one hands back a structured clone, so a route that mutates the array it got
   cannot corrupt what the next request sees. Writes go through one queue, so two
   requests can never interleave on the same document, and they replace the cached
   copy as they go.

   The trade is that this assumes a single instance. So do the in-memory admin
   sessions, so nothing new is being given up — but two replicas would drift, and
   that is the line to notice before scaling this out.
--------------------------------------------------------------------------- */
import * as seed from './seed.js';

export const KEYS = {
  categories: 'categories',
  demos: 'demos',
  leads: 'leads',
  projects: 'projects',
  settings: 'settings',
};

const ORDER = Object.values(KEYS);

const SEEDS = {
  categories: () => seed.CATEGORIES,
  demos: () => seed.buildDemos(),
  leads: () => seed.LEADS,
  projects: () => seed.buildProjects(),
  settings: () => seed.SETTINGS,
};

let driver = null;
const cache = {};
let queue = Promise.resolve();

/* structuredClone is in Node 17+; the fallback keeps this honest on anything
   older rather than silently handing out a live reference. */
const clone = (v) =>
  (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export function readJson(key) {
  return clone(cache[key]);
}

export function writeJson(key, value) {
  cache[key] = clone(value);
  queue = queue
    .then(() => driver.save(key, value))
    .catch((e) => console.error(`write failed (${key}):`, e));
  return queue;
}

/* settings.json written by an older version will be missing the pricing keys, so
   every read layers it over the seed defaults. Nothing downstream has to check
   whether a plan list exists. */
export function settings() {
  return { ...seed.SETTINGS, ...cache.settings };
}

export function publicSettings() {
  const safe = settings();
  delete safe.adminPassword;
  return safe;
}

export const driverName = () => (driver ? driver.name : 'none');

export async function initStore() {
  driver = process.env.DATABASE_URL
    ? await import('./drivers/postgres.js')
    : await import('./drivers/files.js');

  const loaded = await driver.load(ORDER);

  for (const key of ORDER) {
    if (loaded[key] !== undefined) {
      cache[key] = loaded[key];
      continue;
    }
    // absent on a first run — seed it, and persist so the next boot finds it
    cache[key] = SEEDS[key]();
    await driver.save(key, cache[key]);
    console.log('  seeded', driver.describe(key));
  }
}
