import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';
import { STATUSES } from '../lib/format.js';
import Sheet, { SheetHead } from '../components/Sheet.jsx';

export default function LeadDetail({ id, onClose }) {
  const { leads, cat, demoBySlug, replaceLead, dropLead, say } = useApp();
  const lead = leads.find((x) => x.id === id);
  const [patch, setPatch] = useState({});

  if (!lead) return null;
  const l = { ...lead, ...patch };
  const d = demoBySlug(l.demo);
  const set = (k, v) => setPatch((p) => ({ ...p, [k]: v }));

  const facts = [
    ['Owner', l.owner], ['City', l.city], ['Phone', l.phone],
    ['WhatsApp', l.whatsapp], ['Email', l.email || '—'], ['Budget', l.budget || '—'],
  ];

  async function save() {
    try {
      const saved = await api('PATCH', `/leads/${encodeURIComponent(l.id)}`, {
        status: l.status, priority: l.priority, value: Number(l.value || 0), notes: l.notes,
      });
      replaceLead(saved);
      onClose();
      say('Lead updated and saved to disk.');
    } catch (err) {
      say(err.message);
    }
  }

  async function remove() {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this lead? It will be removed from data/leads.json.')) return;
    try {
      await api('DELETE', `/leads/${encodeURIComponent(l.id)}`);
      dropLead(l.id);
      onClose();
      say('Lead deleted.');
    } catch (err) {
      say(err.message);
    }
  }

  return (
    <Sheet onClose={onClose} width={620}>
      <SheetHead title={l.business} sub={`${l.id} · received ${l.date}`} onClose={onClose} />
      <div style={{ padding: '22px', display: 'grid', gap: '16px' }}>
        <div className="g2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <div className="mono dim" style={{ marginBottom: '4px' }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--wash)', border: '1px solid var(--wash-line)', borderRadius: '10px', padding: '14px' }}>
          <div className="mono" style={{ color: 'var(--go)', marginBottom: '6px' }}>Selected design</div>
          <div style={{ fontWeight: 700 }}>
            {d ? `${d.name} — ${(cat(d.category) || {}).name || ''}` : 'No design selected (quote request)'}
          </div>
          {d ? (
            <div className="mono dim" style={{ marginTop: '4px', fontSize: '10.5px' }}>
              /demos/{d.category}/{d.slug}
            </div>
          ) : null}
        </div>

        {(l.features || []).length ? (
          <div>
            <div className="mono dim" style={{ marginBottom: '8px' }}>Features requested</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {l.features.map((f) => <span className="tag" key={f}>{f}</span>)}
            </div>
          </div>
        ) : null}

        {l.message ? (
          <div>
            <div className="mono dim" style={{ marginBottom: '6px' }}>Their message</div>
            <div style={{ lineHeight: 1.65, color: 'var(--ink-2)' }}>{l.message}</div>
          </div>
        ) : null}

        <div className="g2">
          <div>
            <label className="lbl">Status</label>
            <select className="in" value={l.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Priority</label>
            <select className="in" value={l.priority} onChange={(e) => set('priority', e.target.value)}>
              {['High', 'Medium', 'Low'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="lbl">Estimated project value (₹)</label>
          <input className="in" type="number" value={l.value || ''} onChange={(e) => set('value', e.target.value)} />
        </div>
        <div>
          <label className="lbl">Internal notes</label>
          <textarea
            className="in"
            rows="3"
            value={l.notes || ''}
            placeholder="Called 6 Aug, sending two more options."
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      <div className="foot">
        <button type="button" className="btn danger sm" onClick={remove}>Delete lead</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a className="btn line sm" href={`tel:${String(l.phone).replace(/\s/g, '')}`}>Call</a>
          <button type="button" className="btn go sm" onClick={save}>Save changes</button>
        </div>
      </div>
    </Sheet>
  );
}
