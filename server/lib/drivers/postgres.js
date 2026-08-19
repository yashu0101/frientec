/* ---------------------------------------------------------------------------
   The same five JSON documents, in one Postgres table.

   This exists because a free host almost never gives you a disk that survives a
   redeploy, and data/*.json IS the database — so on those hosts the documents
   have to live somewhere else. Nothing above this file changes shape: a row is
   still one whole document, read and written whole.

     DATABASE_URL=postgres://user:pass@host/db?sslmode=require
--------------------------------------------------------------------------- */
import pg from 'pg';

const { Pool } = pg;

const url = process.env.DATABASE_URL;

/* Neon, Supabase and most managed Postgres require TLS, and their certificates
   are not in Node's default trust store. The connection is still encrypted; what
   is skipped is chain verification, which is the usual trade for a managed URL
   that already carries its own credentials.

   `sslmode` is stripped from the string rather than left for pg to interpret.
   pg 8 treats `require` as `verify-full` and warns that this changes in pg 9, so
   leaving it in means both a console warning today and a behaviour change on a
   future upgrade. Deciding TLS here instead makes it explicit and quiet. */
const wantsTls = /sslmode=(require|verify-ca|verify-full|prefer)|neon\.tech|supabase\.(co|com)|render\.com|\.rds\.amazonaws\.com/i.test(url || '');

const cleanUrl = (url || '').replace(/([?&])sslmode=[^&]*&?/gi, (m, p1) => (m.endsWith('&') ? p1 : '')).replace(/[?&]$/, '');

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: wantsTls ? { rejectUnauthorized: false } : undefined,
  max: 4,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const name = `postgres (${(url || '').replace(/:\/\/[^@]*@/, '://***@')})`;

export async function load(keys) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS store (
      key        text PRIMARY KEY,
      doc        jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query('SELECT key, doc FROM store WHERE key = ANY($1)', [keys]);
  const found = Object.fromEntries(rows.map((r) => [r.key, r.doc]));
  const out = {};
  for (const key of keys) out[key] = found[key]; // undefined when absent, so it gets seeded
  return out;
}

export async function save(key, value) {
  await pool.query(
    `INSERT INTO store (key, doc) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET doc = $2, updated_at = now()`,
    [key, JSON.stringify(value)],
  );
}

export const describe = (key) => `store.${key}`;
export const close = () => pool.end();
