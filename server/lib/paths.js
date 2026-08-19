import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));   // server/lib

export const SERVER_DIR = path.join(here, '..');             // server
export const ROOT = path.join(here, '..', '..');             // project root
/* Where the JSON store lives. Locally that is ./data beside the code, which is
   what the README documents. On a host with an ephemeral container filesystem it
   has to be a mounted volume instead — otherwise every redeploy silently throws
   away the leads and orders — so DATA_DIR overrides it. */
export const DATA = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT, 'data');
export const PUBLIC = path.join(SERVER_DIR, 'public');       // img/, sites/
export const CLIENT_DIST = path.join(ROOT, 'client', 'dist');
