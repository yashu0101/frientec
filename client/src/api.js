/* One fetch wrapper. Carries the admin token when there is one, and turns a
   non-2xx into an Error that keeps the status and body — callers sometimes need
   to tell "the server can't do this" apart from "the server said no". */
let token = sessionStorage.getItem('sf_token') || '';

export const getToken = () => token;

export function setToken(next) {
  token = next || '';
  if (token) sessionStorage.setItem('sf_token', token);
  else sessionStorage.removeItem('sf_token');
}

export async function api(method, path, body, { limitless = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['x-admin-token'] = token;

  const res = await fetch('/api' + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let json = {};
  try { json = await res.json(); } catch { /* empty or non-JSON body */ }

  if (!res.ok) {
    const err = new Error(json.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

/* The export route answers with a file, so it is fetched rather than parsed. */
export function exportBlob() {
  return fetch('/api/export', { headers: token ? { 'x-admin-token': token } : {} }).then((r) => {
    if (!r.ok) throw new Error('Could not export.');
    return r.blob();
  });
}
