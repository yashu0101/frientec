import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));   // server/lib

export const SERVER_DIR = path.join(here, '..');             // server
export const ROOT = path.join(here, '..', '..');             // project root
export const DATA = path.join(ROOT, 'data');                 // unchanged on disk
export const PUBLIC = path.join(SERVER_DIR, 'public');       // img/, sites/
export const CLIENT_DIST = path.join(ROOT, 'client', 'dist');
