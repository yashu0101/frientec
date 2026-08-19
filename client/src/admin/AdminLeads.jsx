import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { api, exportBlob } from '../api.js';
import { initials, inr, STATUSES, STATUS_COLOR } from '../lib/format.js';
import { downloadBlob } from '../lib/images.js';
import Stat from './Stat.jsx';
import LeadDetail from './LeadDetail.jsx';

export default function AdminLeads() {
  const { leads, cat, demoBySlug, say } = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date');
  const [open, setOpen] = useState(null);

  const counts = {};
  STATUSES.forEach((s) => { counts[s] = leads.filter((l) => l.status === s).length; });
  const pipeline = leads.filter((l) => !['Won', 'Lost'].includes(l.status)).reduce((x, l) => x + (l.value || 0), 0);
  const won = leads.filter((l) => l.status === 'Won').reduce((x, l) => x + (l.value || 0), 0);

  const rows = leads
    .filter((l) => filter === 'All' || l.status === filter)
    .filter((l) => !q.trim() || `${l.business}${l.owner}${l.city}${l.phone}`.toLowerCase().includes(q.toLowerCase()))
    .slice()
    .sort((x, y) => {
      if (sort === 'value') return (y.value || 0) - (x.value || 0);
      if (sort === 'name') return x.business.localeCompare(y.business);
      return String(y.date).localeCompare(String(x.date));
    });

  async function exportJson() {
    try {
      downloadBlob(await exportBlob(), 'frientec-export.json');
      say('Exported.');
    } catch (err) {
      say(err.message);
    }
  }

  function restore(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => say('Could not read that file.');
    reader.onload = async () => {
      let payload;
      try { payload = JSON.parse(reader.result); } catch { say('That file is not valid JSON.'); return; }
      const parts = ['categories', 'demos', 'leads', 'projects']
        .filter((k) => Array.isArray(payload[k]))
        .map((k) => `${payload[k].length} ${k}`);
      if (!parts.length) { say('Nothing to restore in that file.'); return; }
      // eslint-disable-next-line no-alert
      if (!window.confirm(`Restore ${parts.join(', ')}?\n\nThis replaces what is on disk now. Export first if you are not sure.`)) return;
      try {
        const r = await api('POST', '/import', payload);
        say(`Restored ${r.restored.join(', ')}. Reloading.`);
        setTimeout(() => window.location.reload(), 900);
      } catch (err) {
        say(err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <div className="g4" style={{ marginBottom: '18px' }}>
        <Stat label="Total leads" value={leads.length} count={leads.length} color="var(--ink)" />
        <Stat label="New" value={counts.New} count={counts.New} color="#1B5FA8" />
        <Stat label="In pipeline" value={inr(pipeline)} count={pipeline} prefix="₹" color="var(--ochre)" />
        <Stat label="Won" value={inr(won)} count={won} prefix="₹" color="var(--go)" />
      </div>

      <div
        className="card"
        style={{ padding: '14px', marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <input
          className="in"
          style={{ flex: '1 1 220px' }}
          placeholder="Search business, owner, city, phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="in" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="in" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Newest first</option>
          <option value="value">Highest value</option>
          <option value="name">Business A–Z</option>
        </select>
        <button type="button" className="btn line sm" onClick={exportJson}>Export JSON</button>
        <label className="btn line sm" style={{ cursor: 'pointer' }}>
          <input
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => { restore(e.target.files && e.target.files[0]); e.target.value = ''; }}
          />
          Restore…
        </label>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              {['Business', 'Owner', 'Category', 'Selected design', 'Phone', 'City', 'Budget', 'Status', 'Date']
                .map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((l) => {
              const d = demoBySlug(l.demo);
              const col = STATUS_COLOR[l.status] || ['#EEE', '#333'];
              return (
                <tr className="click" key={l.id} onClick={() => setOpen(l.id)}>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="avatar">{initials(l.business)}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{l.business}</div>
                        <div className="mono dim" style={{ fontSize: '10px' }}>{l.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{l.owner}</td>
                  <td className="muted">{((cat(l.category) || {}).name || l.category).split(' &')[0]}</td>
                  <td className="muted">{d ? d.name : '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.phone}</td>
                  <td>{l.city}</td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>{l.budget || '—'}</td>
                  <td><span className="pill" style={{ background: col[0], color: col[1] }}>{l.status}</span></td>
                  <td className="dim" style={{ whiteSpace: 'nowrap' }}>{l.date}</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="9" style={{ padding: '34px', textAlign: 'center', color: 'var(--ink-3)' }}>
                  No leads match these filters. Clear the search or pick a different status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open ? <LeadDetail id={open} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
