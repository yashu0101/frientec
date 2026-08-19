import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';

const FIELDS = [
  ['brand', 'Brand name', 'text'],
  ['startingPrice', 'Starting price shown on the site (₹)', 'number'],
  ['whatsapp', 'WhatsApp number', 'text'],
  ['email', 'Email', 'text'],
  ['city', 'City', 'text'],
  ['tagline', 'Homepage subheadline', 'text'],
];

export default function AdminSettings() {
  const { settings, setSettings, say } = useApp();
  const [draft, setDraft] = useState(() => {
    const d = {};
    FIELDS.forEach(([k]) => { d[k] = settings[k] ?? ''; });
    d.adminPassword = '';
    return d;
  });

  const set = (k, v) => setDraft((prev) => ({ ...prev, [k]: v }));

  async function save() {
    const patch = {};
    FIELDS.forEach(([k]) => { patch[k] = k === 'startingPrice' ? Number(draft[k] || 0) : draft[k]; });
    if (draft.adminPassword.trim()) patch.adminPassword = draft.adminPassword;
    try {
      setSettings(await api('PUT', '/settings', patch));
      setDraft((prev) => ({ ...prev, adminPassword: '' }));
      say('Settings saved to data/settings.json.');
    } catch (err) {
      say(err.message);
    }
  }

  return (
    <div className="card" style={{ padding: '24px', maxWidth: '560px' }}>
      <h2 className="disp" style={{ fontSize: '21px', marginBottom: '6px' }}>Settings</h2>
      <p className="muted" style={{ fontSize: '14px', margin: '0 0 20px' }}>
        These feed the public site. Saved to data/settings.json.
      </p>
      <div style={{ display: 'grid', gap: '14px' }}>
        {FIELDS.map(([k, label, type]) => (
          <div key={k}>
            <label className="lbl">{label}</label>
            <input className="in" type={type} value={draft[k]} onChange={(e) => set(k, e.target.value)} />
          </div>
        ))}
        <div>
          <label className="lbl">New admin password (leave blank to keep current)</label>
          <input className="in" type="text" placeholder="••••" value={draft.adminPassword} onChange={(e) => set('adminPassword', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: '18px' }}>
        <button type="button" className="btn go" onClick={save}>Save settings</button>
      </div>
    </div>
  );
}
