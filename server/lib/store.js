/* ---------------------------------------------------------------------------
   JSON files on disk are the database. Writes go through one queue so two
   requests can never interleave on a single file, and each write lands in a
   temp file that is then renamed — atomic on the same filesystem, so a crash
   mid-write cannot leave half a JSON file behind.
--------------------------------------------------------------------------- */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { DATA, ROOT } from './paths.js';
import * as seed from './seed.js';

export const FILES = {
  categories: path.join(DATA, 'categories.json'),
  demos: path.join(DATA, 'demos.json'),
  leads: path.join(DATA, 'leads.json'),
  projects: path.join(DATA, 'projects.json'),
  settings: path.join(DATA, 'settings.json'),
};

let queue = Promise.resolve();

export function writeJson(file, value) {
  queue = queue
    .then(async () => {
      const tmp = file + '.tmp';
      await fsp.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
      await fsp.rename(tmp, file);
    })
    .catch((e) => console.error('write failed:', e));
  return queue;
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/* settings.json written by an older version will be missing the pricing keys,
   so every read layers the file over the seed defaults. Nothing downstream has
   to check whether a plan list exists. */
export function settings() {
  return { ...seed.SETTINGS, ...readJson(FILES.settings) };
}

export function publicSettings() {
  const safe = settings();
  delete safe.adminPassword;
  return safe;
}

export function ensureData() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  const initial = {
    categories: seed.CATEGORIES,
    demos: seed.buildDemos(),
    leads: seed.LEADS,
    projects: seed.buildProjects(),
    settings: seed.SETTINGS,
  };
  for (const [key, file] of Object.entries(FILES)) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(initial[key], null, 2), 'utf8');
      // a relative path is only readable when the store is inside the project;
      // pointed at a mounted volume it turns into a run of ../../.., so print
      // whichever of the two actually tells the operator where the file went
      const rel = path.relative(ROOT, file);
      console.log('  seeded', rel.startsWith('..') ? file : rel);
    }
  }
}
