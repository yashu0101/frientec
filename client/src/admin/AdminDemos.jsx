import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { api } from '../api.js';
import DemoEditor from './DemoEditor.jsx';

export default function AdminDemos() {
  const { demos, cat, premiumDemos, replaceDemo, dropDemo, say } = useApp();
  const { openPreview } = useUI();
  const [editing, setEditing] = useState(null); // demo id, or 'new'

  async function toggle(demo, key, value) {
    try {
      replaceDemo(await api('PATCH', `/demos/${demo.id}`, { [key]: value }));
      say('Saved.');
    } catch (err) {
      say(err.message);
    }
  }

  async function remove(id) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this design? Leads that reference it will keep the name on record.')) return;
    try {
      await api('DELETE', `/demos/${id}`);
      dropDemo(id);
      say('Design deleted.');
    } catch (err) {
      say(err.message);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="disp" style={{ fontSize: '23px', marginBottom: '4px' }}>Designs</h2>
          <div className="muted" style={{ fontSize: '14px' }}>
            {demos.filter((d) => d.published).length} published of {demos.length} · {premiumDemos().length} premium · stored in data/demos.json
          </div>
        </div>
        <button type="button" className="btn go sm" onClick={() => setEditing('new')}>+ New design</button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              {['Design', 'Category', 'Style', 'Route', 'Template', 'Featured', 'Premium', 'Published', '']
                .map((h, i) => <th key={h || i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {demos.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td className="muted">{(cat(d.category) || {}).name || d.category}</td>
                <td className="muted">{d.style}</td>
                <td className="mono dim" style={{ fontSize: '10.5px' }}>/demos/{d.category}/{d.slug}</td>
                <td>
                  <span
                    className="pill"
                    style={{
                      background: d.template === 'generic' ? 'var(--wash)' : 'var(--go-soft)',
                      color: d.template === 'generic' ? 'var(--ink-2)' : 'var(--go)',
                    }}
                  >
                    {d.template || 'generic'}
                  </span>
                </td>
                {['featured', 'premium', 'published'].map((key) => (
                  <td key={key}>
                    <input type="checkbox" checked={!!d[key]} onChange={(e) => toggle(d, key, e.target.checked)} />
                  </td>
                ))}
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button type="button" className="btn ghost sm" onClick={() => openPreview(d.slug)}>Preview</button>
                  <button type="button" className="btn ghost sm" onClick={() => setEditing(d.id)}>Edit</button>
                  <button type="button" className="btn ghost sm" style={{ color: 'var(--red)' }} onClick={() => remove(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <DemoEditor id={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      ) : null}
    </>
  );
}
