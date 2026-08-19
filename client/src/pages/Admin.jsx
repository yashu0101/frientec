/* ---------------------------------------------------------------------------
   The desk. Deliberately not translated: it is one operator's internal tool, and
   a half-Marathi table of phone numbers and money helps nobody.

   A faint 3D world used to sit behind this screen. It has been removed; the band
   keeps its wash, because that was never part of it.
--------------------------------------------------------------------------- */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';
import { useCountUp } from '../lib/motion.js';
import { Paren, Underscored } from '../components/StageHead.jsx';
import AdminLeads from '../admin/AdminLeads.jsx';
import AdminOrders from '../admin/AdminOrders.jsx';
import AdminDemos from '../admin/AdminDemos.jsx';
import AdminSettings from '../admin/AdminSettings.jsx';

const TABS = [['leads', 'Leads'], ['orders', 'Orders'], ['demos', 'Designs'], ['settings', 'Settings']];

function SignIn() {
  const { setToken, say } = useApp();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    try {
      const r = await api('POST', '/login', { password: pw });
      setToken(r.token);
      say('Signed in.');
    } catch (err) {
      say(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: '380px', padding: '80px 20px' }}>
      <div className="card" style={{ padding: '26px' }}>
        <h1 className="disp" style={{ fontSize: '23px', marginBottom: '6px' }}>Admin sign in</h1>
        <p className="muted" style={{ fontSize: '14px', margin: '0 0 20px' }}>
          Password lives in <code>data/settings.json</code>. Default: <code>admin</code>
        </p>
        <label className="lbl">Password</label>
        <input
          className="in"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') signIn(); }}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
          <button type="button" className="btn go" style={{ flex: 1 }} onClick={signIn} disabled={busy}>Sign in</button>
          <button type="button" className="btn line" onClick={() => navigate('/')}>Back to site</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { token, setToken, settings, leads, projects, demos } = useApp();
  const [tab, setTab] = useState('leads');
  const navigate = useNavigate();

  useCountUp([tab, leads.length, projects.length]);

  if (!token) return <SignIn />;

  return (
    <>
      <div className="worldband desk-band">
        <span className="wash" aria-hidden="true" />
        <div className="wrap wb-in">
          <Paren>The desk</Paren>
          <div className="wb-title">{settings.brand} admin</div>
          <div className="wb-stats">
            {[`${leads.length} leads`, `${projects.length} orders`, `${demos.length} designs`]
              .map((s) => <Underscored key={s}>{s}</Underscored>)}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, background: 'var(--inverse)', color: 'var(--on-inverse)', padding: '12px 0' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 800 }}>
              {settings.brand} <span style={{ color: '#7FD3B4', fontWeight: 500 }}>admin</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  style={{
                    border: 0,
                    background: tab === id ? 'rgba(255,255,255,.14)' : 'transparent',
                    color: tab === id ? '#fff' : 'rgba(255,255,255,.6)',
                    padding: '7px 13px', borderRadius: '7px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                  }}
                >
                  {id === 'orders' && projects.length ? `${label} · ${projects.length}` : label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn line sm"
              style={{ borderColor: 'rgba(255,255,255,.25)', color: '#fff' }}
              onClick={() => navigate('/')}
            >
              View public site
            </button>
            <button
              type="button"
              className="btn line sm"
              style={{ borderColor: 'rgba(255,255,255,.25)', color: '#fff' }}
              onClick={() => setToken('')}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '22px 0 60px' }}>
        {tab === 'leads' ? <AdminLeads />
          : tab === 'orders' ? <AdminOrders />
            : tab === 'demos' ? <AdminDemos />
              : <AdminSettings />}
      </div>
    </>
  );
}
