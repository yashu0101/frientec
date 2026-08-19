import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';
import { TEMPLATES } from '../lib/templates.js';
import Sheet, { SheetHead } from '../components/Sheet.jsx';

const list = (s) => String(s || '').split(',').map((t) => t.trim()).filter(Boolean);

export default function DemoEditor({ id, onClose }) {
  const { demos, categories, replaceDemo, addDemo, say } = useApp();
  const existing = id ? demos.find((x) => x.id === id) : null;

  const [v, setV] = useState(() => ({
    name: '', category: (categories[0] || {}).slug || '', style: '', description: '',
    accent: '#0E7C5A', ink: '#161A1D', mode: 'light', template: 'generic',
    published: true, featured: false, premium: false,
    ...(existing || {}),
    tags: ((existing || {}).tags || []).join(', '),
    sections: ((existing || {}).sections || []).join(', '),
  }));

  const set = (k, val) => setV((prev) => ({ ...prev, [k]: val }));

  async function save() {
    if (!v.name) { say('Give the design a name.'); return; }
    const payload = {
      name: v.name, category: v.category, style: v.style, description: v.description,
      accent: v.accent, ink: v.ink, mode: v.mode, template: v.template,
      published: v.published, featured: v.featured, premium: v.premium,
      tags: list(v.tags),
    };
    const sections = list(v.sections);
    if (sections.length) payload.sections = sections;

    try {
      if (existing) {
        replaceDemo(await api('PATCH', `/demos/${existing.id}`, payload));
        say('Design saved.');
      } else {
        addDemo(await api('POST', '/demos', payload));
        say('Design created and published.');
      }
      onClose();
    } catch (err) {
      say(err.message);
    }
  }

  return (
    <Sheet onClose={onClose} width={600}>
      <SheetHead
        title={existing ? 'Edit design' : 'New design'}
        sub={existing ? 'Saved back to data/demos.json' : 'Appears in the catalogue as soon as you save.'}
        onClose={onClose}
      />
      <div style={{ padding: '22px', display: 'grid', gap: '16px' }}>
        <div className="g2">
          <div>
            <label className="lbl">Design name <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="in" value={v.name} placeholder="Casa Verde" onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="lbl">Category <span style={{ color: 'var(--red)' }}>*</span></label>
            <select className="in" value={v.category} onChange={(e) => set('category', e.target.value)}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="g2">
          <div>
            <label className="lbl">Style label</label>
            <input className="in" value={v.style} placeholder="Boutique stay" onChange={(e) => set('style', e.target.value)} />
          </div>
          <div>
            <label className="lbl">Tags, comma separated</label>
            <input className="in" value={v.tags} placeholder="warm, serif, calm" onChange={(e) => set('tags', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="lbl">Short description</label>
          <input
            className="in"
            value={v.description}
            placeholder="What this design is good for."
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <div className="g2">
          <div>
            <label className="lbl">Accent colour</label>
            <input className="in" type="color" value={v.accent} style={{ height: '44px', padding: '4px' }} onChange={(e) => set('accent', e.target.value)} />
          </div>
          <div>
            <label className="lbl">Ink / base colour</label>
            <input className="in" type="color" value={v.ink} style={{ height: '44px', padding: '4px' }} onChange={(e) => set('ink', e.target.value)} />
          </div>
        </div>
        <div className="g2">
          <div>
            <label className="lbl">Mode</label>
            <select className="in" value={v.mode} onChange={(e) => set('mode', e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="lbl">Template renderer</label>
            <select className="in" value={v.template} onChange={(e) => set('template', e.target.value)}>
              {Object.keys(TEMPLATES).map((tpl) => <option key={tpl} value={tpl}>{tpl}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="lbl">Sections, comma separated</label>
          <input
            className="in"
            value={v.sections}
            placeholder="Leave blank to use this category's default sections"
            onChange={(e) => set('sections', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '18px' }}>
          {[['published', 'Published'], ['featured', 'Featured on homepage'], ['premium', 'Premium']].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              <input type="checkbox" checked={!!v[key]} onChange={(e) => set(key, e.target.checked)} /> {label}
            </label>
          ))}
        </div>
        <div className="muted" style={{ fontSize: '13px', marginTop: '-8px' }}>
          Premium adds it to the premium band on the homepage and to /designs/premium. It stays in its own category as well.
        </div>
      </div>

      <div className="foot">
        <button type="button" className="btn line" onClick={onClose}>Cancel</button>
        <button type="button" className="btn go" onClick={save}>{existing ? 'Save design' : 'Create design'}</button>
      </div>
    </Sheet>
  );
}
