/* Orders come out of the studio with a customisation attached, so they get their
   own table rather than being flattened into the lead list. */
import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { initials, inr, PAY_LABEL_SHORT, fullDomainOf } from '../lib/format.js';
import Stat from './Stat.jsx';
import OrderDetail from './OrderDetail.jsx';

export default function AdminOrders() {
  const { projects } = useApp();
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const booked = projects.reduce((t, p) => t + ((p.quote && p.quote.total) || 0), 0);
  const due = projects
    .filter((p) => p.payment && p.payment.status !== 'Paid')
    .reduce((t, p) => t + ((p.payment && p.payment.advance) || 0), 0);
  const live = projects.filter((p) => p.stage === 'Live').length;

  return (
    <>
      <div className="g4" style={{ marginBottom: '18px' }}>
        <Stat label="Orders" value={projects.length} count={projects.length} color="var(--ink)" />
        <Stat label="Booked value" value={inr(booked)} count={booked} prefix="₹" color="var(--go)" />
        <Stat label="Advances awaited" value={inr(due)} count={due} prefix="₹" color="var(--ochre)" />
        <Stat label="Live sites" value={live} count={live} color="#1B5FA8" />
      </div>

      {projects.length ? (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                {['Ref', 'Business', 'Design', 'Plan', 'Pages', 'Domain', 'Total', 'Advance', 'Payment', 'Stage', 'Date']
                  .map((h) => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const Q = p.quote || {};
                const dom = fullDomainOf(p.selection && p.selection.domain);
                const col = p.stage === 'Live' ? ['#DFF3E6', '#14663A']
                  : p.stage === 'Cancelled' ? ['#F6E7E7', '#9A2C2C']
                    : ['#E7F0FB', '#1B5FA8'];
                return (
                  <tr className="click" key={p.id} onClick={() => setOpen(p.id)}>
                    <td className="mono" style={{ fontSize: '11px' }}>{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div className="avatar">{initials(p.customer.business)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.customer.business}</div>
                          <div className="mono dim" style={{ fontSize: '10px' }}>{p.customer.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="muted">{p.demoName || p.demo}</td>
                    <td>{(Q.plan || {}).name || '—'}</td>
                    <td>{String(Q.pages || '—')}</td>
                    <td className="mono" style={{ fontSize: '11px' }}>{dom || '—'}</td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{inr(Q.total)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{inr(Q.advance)}</td>
                    <td className="muted">{PAY_LABEL_SHORT[(p.payment || {}).method] || (p.payment || {}).method || '—'}</td>
                    <td><span className="pill" style={{ background: col[0], color: col[1] }}>{p.stage || 'Order placed'}</span></td>
                    <td className="dim" style={{ whiteSpace: 'nowrap' }}>{p.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>No orders yet</div>
          <div className="muted" style={{ marginBottom: '18px' }}>
            Anything placed through the customisation studio lands here, with the customer&apos;s content attached.
          </div>
          <button type="button" className="btn line" onClick={() => navigate('/designs')}>Open the catalogue</button>
        </div>
      )}

      {open ? <OrderDetail id={open} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
