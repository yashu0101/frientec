/* ---------------------------------------------------------------------------
   Order tracking. The reference number on the confirmation screen was decoration
   until this existed. Ref + phone, because a reference alone is short enough to
   walk — and once they are in, this is also where content gets sent, on the page
   they already have open rather than in a WhatsApp thread nobody can search.
--------------------------------------------------------------------------- */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { api } from '../api.js';
import { inr, STAGE_STEPS, waLink, fullDomainOf } from '../lib/format.js';
import { readImage, openHtmlInTab } from '../lib/images.js';
import { renderCustom } from '../lib/renderCustom.js';
import StageHead from '../components/StageHead.jsx';

const MAX_PHOTOS = 20;

export default function Track() {
  const { settings, say } = useApp();
  const t = useT();
  const navigate = useNavigate();

  const [ref, setRef] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [images, setImages] = useState([]);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sent, setSent] = useState(false);
  const sendBlock = useRef(null);

  async function find() {
    setError('');
    setBusy(true);
    try {
      setOrder(await api('POST', '/track', { ref, phone }));
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setOrder(null);
    setError('');
    setImages([]);
    setNote('');
    setSent(false);
    setSendError('');
  }

  async function addFiles(list) {
    const picked = Array.from(list || []);
    const room = Math.max(0, MAX_PHOTOS - images.length);
    if (!room) { say(t('Twenty photos is the limit in one go.')); return; }
    const take = picked.slice(0, room);
    const added = [];
    for (const f of take) {
      try {
        added.push({ name: f.name, data: await readImage(f, 1600) });
      } catch (e) {
        say(e.message);
      }
    }
    if (added.length) setImages((all) => [...all, ...added]);
    if (picked.length > room) say(`${t('Added')} ${room} — ${t('send the rest in a second batch.')}`);
  }

  async function send() {
    if (!images.length && !note.trim()) { say(t('Add a photo or write something first.')); return; }
    setSending(true);
    setSendError('');
    setSent(false);
    try {
      await api('POST', '/submit', { ref: order.id, phone, images, note });
      setImages([]);
      setNote('');
      setSent(true);
      // refresh so the "already sent" count is right
      setOrder(await api('POST', '/track', { ref: order.id, phone }));
      sendBlock.current?.scrollIntoView({ block: 'center' });
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (!order) {
    return (
      <>
        <StageHead
          label="Order tracking"
          title="Track your order"
          blurb="Enter the reference number from your confirmation and the phone number on the order. You will see where your website has got to."
        />
        <div className="wrap narrow" style={{ padding: '44px 0 70px' }}>
          <div className="card" style={{ padding: '22px', maxWidth: '520px' }}>
            <div className="g2">
              <div>
                <label className="lbl">{t('Reference number')}</label>
                <input className="in mono-in" value={ref} placeholder="SF-2401" onChange={(e) => setRef(e.target.value)} />
              </div>
              <div>
                <label className="lbl">{t('Phone on the order')}</label>
                <input className="in" value={phone} placeholder="98765 43210" onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            {error ? <div className="err" style={{ marginTop: '12px' }}>{error}</div> : null}
            <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" className="btn go" onClick={find} disabled={busy}>
                {busy ? t('Looking…') : t('Find my order')}
              </button>
              <button type="button" className="btn line" onClick={() => navigate('/designs')}>{t('Browse designs')}</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const Q = order.quote || {};
  const at = STAGE_STEPS.indexOf(order.stage);
  const dom = fullDomainOf(order.domain);
  const submissions = order.submissions || [];

  return (
    <div className="wrap narrow" style={{ padding: '44px 0 70px' }}>
      <div className="mono dim" style={{ marginBottom: '10px' }}>
        {t('Order')} {order.id} · {t('placed')} {order.date}
      </div>
      <h1 className="disp" style={{ fontSize: 'clamp(26px,4.2vw,36px)', marginBottom: '8px' }}>{order.business}</h1>
      <p className="muted" style={{ margin: '0 0 26px' }}>
        {order.demoName} · {(Q.plan || {}).name || ''} {t('plan')}
      </p>

      {order.stage === 'Cancelled' ? (
        <div className="card" style={{ padding: '20px', marginBottom: '22px' }}>
          <strong>{t('This order was cancelled.')}</strong>
          <div className="muted" style={{ marginTop: '6px' }}>{t('If that is a surprise, message us and we will sort it out.')}</div>
        </div>
      ) : (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <div className="mono dim" style={{ marginBottom: '16px' }}>{t('Where it has got to')}</div>
          <ol className="stagelist">
            {STAGE_STEPS.map((s, i) => (
              /* is-done / is-now, not done / now: `.done` is already the
                 confirmation screen's container class */
              <li key={s} className={at < 0 ? '' : i < at ? 'is-done' : i === at ? 'is-now' : ''}>
                <span className="dot" />
                <span>{t(s)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
        <div className="mono dim" style={{ marginBottom: '14px' }}>{t('Your quote')}</div>
        <table className="itable">
          <tbody>
            {(Q.lines || []).map((l) => (
              <tr key={l.key}>
                <td><div className="il">{l.label}</div></td>
                <td className="ia">{inr(l.amount)}</td>
              </tr>
            ))}
            <tr><td>{t(`GST ${Q.gstPercent || 0}%`)}</td><td className="ia">{inr(Q.gst)}</td></tr>
            <tr className="tot"><td>{t('Total')}</td><td className="ia">{inr(Q.total)}</td></tr>
          </tbody>
        </table>
        <div className="mono dim" style={{ marginTop: '14px' }}>
          {t('Advance')} {inr(order.payment.advance)} · {t('balance')} {inr(order.payment.balance)} · {order.payment.status}
          {dom ? ` · ${dom}` : ''}
        </div>
      </div>

      {/* Sending content is the step that decides whether a project moves. */}
      <div className="card" style={{ padding: '22px', marginBottom: '22px' }} ref={sendBlock}>
        <div className="mono dim" style={{ marginBottom: '6px' }}>{t('Send us your content')}</div>
        <h2 className="disp" style={{ fontSize: '20px', marginBottom: '6px' }}>{t('Photos, prices, anything you want changed')}</h2>
        <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.65, fontSize: '14.5px' }}>
          {t('This is faster than WhatsApp and nothing gets lost in the thread. Photos of your actual place beat any stock picture — shoot them on your phone in daylight.')}
        </p>

        {images.length ? (
          <div className="gal" style={{ marginBottom: '12px' }}>
            {images.map((im, i) => (
              <div className="galitem" key={i}>
                <img src={im.data} alt="" />
                <button
                  type="button"
                  className="galx"
                  title="Remove"
                  onClick={() => setImages((all) => all.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
          <label className="btn line sm" style={{ cursor: 'pointer' }}>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
            />
            + {t('Add photos')}
          </label>
          <span className="mono dim">
            {images.length} {t('of 20 · resized on your phone before sending')}
          </span>
        </div>

        <textarea
          className="in"
          rows="4"
          value={note}
          placeholder={t('New prices, a menu change, timings, anything you want different on the site.')}
          onChange={(e) => setNote(e.target.value)}
        />

        {sendError ? <div className="err" style={{ marginTop: '10px' }}>{sendError}</div> : null}
        {sent ? (
          <div className="notice pay" style={{ marginTop: '12px' }}>
            {t('Got it — that is on your project now. We will pick it up on the next working day.')}
          </div>
        ) : null}

        <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" className="btn go" onClick={send} disabled={sending}>
            {sending ? t('Sending…') : t('Send to the studio')}
          </button>
          {submissions.length ? (
            <span className="mono dim">
              {submissions.length} {t('already sent · last on')} {String(submissions[submissions.length - 1].at).slice(0, 10)}
            </span>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <a
          className="btn ink"
          target="_blank"
          rel="noopener"
          href={waLink(settings.whatsapp, `Hi, about order ${order.id} for ${order.business}`)}
        >
          {t('💬 Ask about this order')}
        </a>
        <button
          type="button"
          className="btn line"
          onClick={() => {
            if (!openHtmlInTab(renderCustom({}, order.customisation || {}))) say(t('Your browser blocked the new tab.'));
          }}
        >
          {t('Open my website')}
        </button>
        <button type="button" className="btn ghost" onClick={reset}>{t('Look up a different order')}</button>
      </div>
    </div>
  );
}
