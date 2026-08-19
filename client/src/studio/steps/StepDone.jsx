import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { inr, PAY_LABEL, waLink, fullDomainOf } from '../../lib/format.js';
import { openHtmlInTab, downloadJson } from '../../lib/images.js';
import { renderCustom } from '../../lib/renderCustom.js';

export default function StepDone() {
  const { order: o, settings: s, demo, c, exit, say } = useStudio();
  const t = useT();
  const navigate = useNavigate();
  const Q = o.quote;
  const dom = fullDomainOf(o.selection && o.selection.domain);

  const facts = [
    ['Business', o.customer.business], ['Design', o.demoName], ['Plan', Q.plan.name],
    ['Pages', String(Q.pages)], ['Domain', dom || '—'], ['Total', inr(Q.total)],
    ['Advance now', inr(Q.advance)], ['Payment', PAY_LABEL[o.payment.method] || o.payment.method],
  ];

  const nextSteps = [
    `${t('We check your content and photos, and call you on')} ${o.customer.phone} ${t('within one working day.')}`,
    dom ? `${t('We register')} ${dom} ${t('in your name and point it at the site.')}` : t('We confirm your domain and hosting.'),
    `${t('First version goes up on a preview link in')} ${Q.plan.delivery}.`,
    t('You send changes on WhatsApp. We fix, then go live.'),
    `${t('Balance of')} ${inr(Q.balance)} ${t('on handover, with logins and the invoice.')}`,
  ];

  return (
    <div className="done">
      <div className="donecard">
        <div className="tick">✓</div>
        <h1>{t('Order placed')}</h1>
        <p className="lead">
          {t('Reference')} <strong>{o.id}</strong> — {t('quote it when you pay or when you message us.')}
        </p>

        <div className="dgrid">
          {facts.map(([label, value]) => (
            <div key={label}>
              <div className="mono dim">{t(label)}</div>
              <div className="dv">{value}</div>
            </div>
          ))}
        </div>

        {o.payment.method === 'upi' ? (
          <div className="notice pay">
            <strong>{t('Pay')} {inr(Q.advance)} {t('to')} {s.upiId || ''}</strong>
            <br />
            {t('Put')} <strong>{o.id}</strong> {t('in the UPI note so we can match it. Send us the screenshot on WhatsApp and we start the same day.')}
          </div>
        ) : null}
        {o.payment.method === 'bank' ? (
          <div className="notice pay">
            {t('Account details and a GST invoice for')} {inr(Q.advance)} {t('are on their way to')} {o.customer.email || t('your phone')}.
          </div>
        ) : null}
        {o.payment.method === 'card' ? (
          <div className="notice pay">
            {t('A payment link for')} {inr(Q.advance)} {t('comes to your WhatsApp within the hour. It is valid for 48 hours.')}
          </div>
        ) : null}
        {o.payment.method === 'call' ? (
          <div className="notice pay">
            {t('Nothing to pay yet. We call you on')} {o.customer.phone} {t('within one working day, confirm the scope, then invoice.')}
          </div>
        ) : null}

        <div className="steps">
          <div className="mono dim">{t('What happens next')}</div>
          <ol>{nextSteps.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>

        {o.wantsDynamic ? (
          <div className="notice">
            {t('You asked about a dynamic build — we have flagged it on the order and will scope it on the same call.')}
          </div>
        ) : null}

        <div className="donebtns">
          <a
            className="btn ink"
            target="_blank"
            rel="noopener"
            href={waLink(s.whatsapp, `Hi, I placed order ${o.id} for ${o.customer.business}.`)}
          >
            {t('💬 Message us on WhatsApp')}
          </a>
          <button
            type="button"
            className="btn line"
            onClick={() => { if (!openHtmlInTab(renderCustom(demo, c))) say(t('Your browser blocked the new tab.')); }}
          >
            {t('Open my website preview ↗')}
          </button>
          <button type="button" className="btn line" onClick={() => downloadJson(o, `${o.id || 'order'}.json`)}>
            {t('Download order summary')}
          </button>
          <button type="button" className="btn line" onClick={() => navigate('/order')}>{t('Track this order')}</button>
          <button type="button" className="btn ghost" onClick={exit}>{t('Back to the catalogue')}</button>
        </div>

        <div className="mono dim savednote">
          {t('Look it up any time at')} {window.location.origin}/#/order {t('with')} {o.id} {t('and your phone number')}
        </div>
        <div className="mono dim savednote">{t('Saved to data/projects.json · also in the admin lead desk')}</div>
      </div>
    </div>
  );
}
