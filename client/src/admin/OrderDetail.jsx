import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';
import { inr, ORDER_STAGES, PAY_LABEL_SHORT, fullDomainOf } from '../lib/format.js';
import { openHtmlInTab } from '../lib/images.js';
import { renderCustom } from '../lib/renderCustom.js';
import Sheet, { SheetHead } from '../components/Sheet.jsx';

const PAY_STATUSES = ['Awaiting advance', 'Advance received', 'Paid in full', 'Refunded'];

export default function OrderDetail({ id, onClose }) {
  const { projects, cat, demoBySlug, replaceProject, dropProject, say } = useApp();
  const project = projects.find((x) => x.id === id);
  const [patch, setPatch] = useState({});

  if (!project) return null;
  const p = project;
  const Q = p.quote || {};
  const C = p.customisation || {};
  const dom = fullDomainOf(p.selection && p.selection.domain);

  const stage = patch.stage ?? p.stage;
  const payStatus = patch.paymentStatus ?? (p.payment || {}).status;
  const notes = patch.notes ?? (p.notes || '');

  const imgs = [
    ...(C.logo ? [['Logo', C.logo]] : []),
    ...(C.hero ? [['Main photo', C.hero]] : []),
    ...(C.gallery || []).map((g, i) => [`Gallery ${i + 1}`, g]),
  ];

  const facts = [
    ['Owner', p.customer.owner], ['City', p.customer.city], ['Phone', p.customer.phone],
    ['WhatsApp', p.customer.whatsapp], ['Email', p.customer.email || '—'],
    ['Category', (cat(p.customer.category) || {}).name || p.customer.category],
  ];

  async function save() {
    try {
      const saved = await api('PATCH', `/projects/${encodeURIComponent(p.id)}`, {
        stage, notes, payment: { ...p.payment, status: payStatus },
      });
      replaceProject(saved);
      onClose();
      say('Order updated and saved to disk.');
    } catch (err) {
      say(err.message);
    }
  }

  async function remove() {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Delete this order? The customer's customisation goes with it.")) return;
    try {
      await api('DELETE', `/projects/${encodeURIComponent(p.id)}`);
      dropProject(p.id);
      onClose();
      say('Order deleted.');
    } catch (err) {
      say(err.message);
    }
  }

  const cell = (padTop, extra) => ({ padding: '7px 0', border: 0, ...extra });

  return (
    <Sheet onClose={onClose} width={720}>
      <SheetHead
        title={p.customer.business}
        sub={`${p.id} · ${p.demoName || p.demo} · ${p.date}`}
        onClose={onClose}
      />
      <div style={{ padding: '22px', display: 'grid', gap: '18px' }}>
        <div className="g2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <div className="mono dim" style={{ marginBottom: '4px' }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--wash)', border: '1px solid var(--wash-line)', borderRadius: '10px', padding: '16px' }}>
          <div className="mono" style={{ color: 'var(--go)', marginBottom: '10px' }}>Quote — recomputed on the server</div>
          <table className="tbl" style={{ fontSize: '13.5px' }}>
            <tbody>
              {(Q.lines || []).map((l) => (
                <tr key={l.key}>
                  <td style={cell()}>{l.label}</td>
                  <td style={cell(false, { textAlign: 'right', whiteSpace: 'nowrap' })}>{inr(l.amount)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}>GST {Q.gstPercent || 0}%</td>
                <td style={{ padding: '7px 0', borderTop: '1px solid var(--line)', textAlign: 'right' }}>{inr(Q.gst)}</td>
              </tr>
              <tr>
                <td style={cell(false, { fontWeight: 800 })}>Total</td>
                <td style={cell(false, { textAlign: 'right', fontWeight: 800 })}>{inr(Q.total)}</td>
              </tr>
              <tr>
                <td style={cell()}>Advance / balance</td>
                <td style={cell(false, { textAlign: 'right' })}>{inr(Q.advance)} / {inr(Q.balance)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mono dim" style={{ marginTop: '10px' }}>
            Domain {dom || 'not chosen'} · pays by {PAY_LABEL_SHORT[(p.payment || {}).method] || (p.payment || {}).method || '—'}
          </div>
          {p.wantsDynamic ? (
            <div style={{ marginTop: '10px', padding: '10px 12px', background: '#FDF0DC', borderRadius: '8px', fontSize: '13.5px', color: '#8A5A0B', fontWeight: 600 }}>
              Asked about a dynamic build — scope this on the call.
            </div>
          ) : null}
        </div>

        <div>
          <div className="mono dim" style={{ marginBottom: '8px' }}>Their customisation</div>
          <div className="g2" style={{ gap: '10px', fontSize: '13.5px' }}>
            {[
              ['Colours', `${C.accent || ''} / ${C.ink || ''} · ${C.mode || ''}`],
              ['Type & shape', `${C.font || ''} · ${C.radius || ''} corners · ${C.layout || ''} hero`],
              ['Sections on', Object.keys(C.sections || {}).filter((k) => C.sections[k]).join(', ')],
              ['Rows', `${(C.services || []).length} services · ${(C.reviews || []).length} reviews · ${imgs.length} images`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mono dim" style={{ marginBottom: '3px' }}>{label}</div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {C.about ? (
          <div>
            <div className="mono dim" style={{ marginBottom: '6px' }}>Their about text</div>
            <div style={{ lineHeight: 1.65, color: 'var(--ink-2)', fontSize: '14px' }}>{C.about}</div>
          </div>
        ) : null}

        {/* What the customer sent after ordering — the thing that decides whether
            the project moves. It goes above their customisation on purpose. */}
        {(p.submissions || []).length ? (
          <div>
            <div className="mono" style={{ color: 'var(--go)', marginBottom: '10px' }}>
              Content they sent in ({p.submissions.length})
            </div>
            {p.submissions.slice().reverse().map((sub) => (
              <div key={sub.id} style={{ border: '1px solid var(--line)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                <div className="mono dim" style={{ marginBottom: '8px' }}>
                  {String(sub.at).slice(0, 16).replace('T', ' ')}
                </div>
                {sub.note ? <div style={{ lineHeight: 1.65, fontSize: '14px', marginBottom: '10px' }}>{sub.note}</div> : null}
                {(sub.images || []).length ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sub.images.map((im, i) => (
                      <a key={i} href={im.data} download={im.name} title={im.name}>
                        <img
                          src={im.data}
                          alt=""
                          style={{ width: '96px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--line)', display: 'block' }}
                        />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mono dim">
            No content sent in yet — the customer can send photos from {window.location.origin}/#/order
          </div>
        )}

        {imgs.length ? (
          <div>
            <div className="mono dim" style={{ marginBottom: '8px' }}>Files they uploaded</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {imgs.map(([label, src], i) => (
                <div style={{ width: '96px' }} key={`${label}-${i}`}>
                  <img
                    src={src}
                    alt=""
                    style={{ width: '96px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--line)' }}
                  />
                  <div className="mono dim" style={{ fontSize: '9.5px', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="g2">
          <div>
            <label className="lbl">Stage</label>
            <select className="in" value={stage} onChange={(e) => setPatch((x) => ({ ...x, stage: e.target.value }))}>
              {ORDER_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Payment status</label>
            <select className="in" value={payStatus} onChange={(e) => setPatch((x) => ({ ...x, paymentStatus: e.target.value }))}>
              {PAY_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="lbl">Internal notes</label>
          <textarea className="in" rows="3" value={notes} onChange={(e) => setPatch((x) => ({ ...x, notes: e.target.value }))} />
        </div>
      </div>

      <div className="foot">
        <button type="button" className="btn danger sm" onClick={remove}>Delete order</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn line sm"
            onClick={() => {
              if (!openHtmlInTab(renderCustom(demoBySlug(p.demo) || {}, p.customisation || {}))) {
                say('Your browser blocked the new tab.');
              }
            }}
          >
            Open their site
          </button>
          <a className="btn line sm" href={`tel:${String(p.customer.phone).replace(/\s/g, '')}`}>Call</a>
          <button type="button" className="btn go sm" onClick={save}>Save</button>
        </div>
      </div>
    </Sheet>
  );
}
