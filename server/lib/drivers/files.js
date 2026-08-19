/* ---------------------------------------------------------------------------
   JSON files on disk — the default, and what runs locally.

   Each write lands in a temp file that is then renamed, which is atomic on the
   same filesystem, so a crash mid-write cannot leave half a document behind.
--------------------------------------------------------------------------- */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { DATA } from '../paths.js';

const file = (key) => path.join(DATA, `${key}.json`);

export const name = `files (${DATA})`;

export async function load(keys) {
  if (!fs.existsSync(DATA)) await fsp.mkdir(DATA, { recursive: true });
  const out = {};
  for (const key of keys) {
    try {
      out[key] = JSON.parse(await fsp.readFile(file(key), 'utf8'));
    } catch {
      out[key] = undefined; // absent, so the caller seeds it
    }
  }
  return out;
}

export async function save(key, value) {
  const target = file(key);
  const tmp = target + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fsp.rename(tmp, target);
}

export const describe = (key) => path.relative(process.cwd(), file(key));
