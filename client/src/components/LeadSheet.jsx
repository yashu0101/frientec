/* ---------------------------------------------------------------------------
   "Request this website" — the short form for someone who does not want to go
   through the studio. The design they were looking at rides along, so there is
   no confusion later about which one they meant.
--------------------------------------------------------------------------- */
import { useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { api } from '../api.js';
import { BUDGETS, FEATURES, inr, waLink } from '../lib/format.js';
import Sheet, { SheetHead } from './Sheet.jsx';
import Thumb from './Thumb.jsx';

const REQUIRED = ['owner', 'business', 'phone', 'whatsapp', 'city', 'category'];

const blank = (demo) => ({
  owner: '', business: '', phone: '', whatsapp: '', city: '',
  category: demo ? demo.category : '', email: '', website: '', instagram: '',
  budget: '', features: [], message: '', demo: demo ? demo.slug : '',
});

/* Declared at module scope on purpose. A component defined inside LeadSheet
   would be a brand-new type on every render, so React would unmount the input
   mid-keystroke and the field would lose focus after each character. */
function Field({ k, label, optional, ph, type, form, errors, set, t }) {
  return (
    <div>
      <label className="lbl">
        {t(label)}{optional ? null : <> <span style={{ color: 'var(--red)' }}>*</span></>}
      </label>
      <input
        className={'in' + (errors[k] ? ' bad' : '')}
        type={type || 'text'}
        value={form[k]}
        placeholder={ph}
        onChange={(e) => set(k, e.target.value)}
      />
      {errors[k] ? <div className="err">{errors[k]}</div> : null}
    </div>
  );
}

export default function LeadSheet({ slug, onClose }) {
  const { demoBySlug, categories, cat, settings, say } = useApp();
  const t = useT();
  const demo = slug ? demoBySlug(slug) : null;

  const [form, setForm] = useState(() => blank(demo));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggle = (key, value) =>
    setForm((f) => {
      const list = f[key];
      return { ...f, [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] };
    });

  async function submit() {
    const next = {};
    REQUIRED.forEach((k) => { if (!String(form[k] || '').trim()) next[k] = t('Required'); });
    if (form.phone && !/^[0-9 +\-()]{8,}$/.test(form.phone)) next.phone = t('Enter a valid phone number');
    setErrors(next);
    if (Object.keys(next).length) { say(t('Fill in the highlighted fields.')); return; }

    setBusy(true);
    try {
      setDone(await api('POST', '/leads', form));
    } catch (err) {
      say(err.message);
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Sheet onClose={onClose}>
        <div style={{ padding: '48px 28px', textAlign: 'center' }}>
          <div
            style={{
              width: '54px', height: '54px', borderRadius: '50%', background: 'var(--go-soft)',
              display: 'grid', placeItems: 'center', margin: '0 auto 18px', fontSize: '24px', color: 'var(--go)',
            }}
          >
            ✓
          </div>
          <h2 className="disp" style={{ fontSize: '26px', marginBottom: '10px' }}>{t('Request received')}</h2>
          <p className="muted" style={{ lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 8px' }}>
            {t('We will call you on')} {done.phone} {t('within one working day with a quote and next steps.')}
          </p>
          <div className="mono dim" style={{ marginBottom: '8px' }}>{t('Reference')} {done.id}</div>
          <div className="mono dim" style={{ marginBottom: '24px' }}>{t('Saved to data/leads.json')}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              className="btn ink"
              target="_blank"
              rel="noopener"
              href={waLink(settings.whatsapp, `Hi, I just requested a website (${done.id}) for ${done.business}`)}
            >
              {t('💬 Message us on WhatsApp')}
            </a>
            <button type="button" className="btn line" onClick={onClose}>{t('Keep browsing designs')}</button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <SheetHead title={t('Request this website')} onClose={onClose} />
      <div className="muted" style={{ fontSize: '13.5px', padding: '0 22px 8px', marginTop: '-14px' }}>
        {t('Takes a minute. No payment now.')}
      </div>

      {demo ? (
        <div
          style={{
            display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 22px',
            background: 'var(--wash)', borderBottom: '1px solid var(--wash-line)',
          }}
        >
          <div style={{ width: '88px', flexShrink: 0, border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(.46)', transformOrigin: 'top left', width: '191px', height: '87px' }}>
              <Thumb demo={demo} />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="mono" style={{ color: 'var(--go)' }}>{t('Selected design')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>
              {demo.name} — {(cat(demo.category) || {}).name || ''}
            </div>
            <div className="muted" style={{ fontSize: '13px', marginTop: '2px' }}>{demo.style}</div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: '22px', display: 'grid', gap: '16px' }}>
        <div className="g2">
          <Field k="owner" label="Your name" ph="Rohit Kulkarni" form={form} errors={errors} set={set} t={t} />
          <Field k="business" label="Business name" ph="Spice Junction" form={form} errors={errors} set={set} t={t} />
        </div>
        <div className="g2">
          <Field k="phone" label="Phone" ph="98765 43210" form={form} errors={errors} set={set} t={t} />
          <Field k="whatsapp" label="WhatsApp number" ph="98765 43210" form={form} errors={errors} set={set} t={t} />
        </div>
        <div className="g2">
          <Field k="city" label="City" ph="Pune" form={form} errors={errors} set={set} t={t} />
          <div>
            <label className="lbl">{t('Business category')} <span style={{ color: 'var(--red)' }}>*</span></label>
            <select className={'in' + (errors.category ? ' bad' : '')} value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">{t('Select a category')}</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{t(c.name)}</option>)}
            </select>
            {errors.category ? <div className="err">{errors.category}</div> : null}
          </div>
        </div>
        <div className="g2">
          <Field k="email" label="Email" optional ph="you@example.com" type="email" form={form} errors={errors} set={set} t={t} />
          <Field k="instagram" label="Instagram" optional ph="@yourbusiness" form={form} errors={errors} set={set} t={t} />
        </div>
        <Field k="website" label="Current website, if any" optional ph="yourbusiness.com" form={form} errors={errors} set={set} t={t} />

        <div>
          <label className="lbl">{t('Budget')}</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {BUDGETS.map((b) => (
              <span
                key={b}
                className={'chip' + (form.budget === b ? ' on' : '')}
                onClick={() => set('budget', form.budget === b ? '' : b)}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="lbl">{t('Features you need')}</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FEATURES.map((x) => (
              <span
                key={x}
                className={'chip' + (form.features.includes(x) ? ' on' : '')}
                onClick={() => toggle('features', x)}
              >
                {form.features.includes(x) ? '✓ ' : ''}{t(x)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="lbl">{t('Anything else we should know')}</label>
          <textarea
            className="in"
            rows="3"
            value={form.message}
            placeholder={t('Menu changes weekly, need it in Marathi too, etc.')}
            onChange={(e) => set('message', e.target.value)}
          />
        </div>
      </div>

      <div className="foot">
        <div className="mono dim">{t(`Projects start at ${inr(settings.startingPrice)}`)}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn line" onClick={onClose}>{t('Cancel')}</button>
          <button type="button" className="btn go" onClick={submit} disabled={busy}>
            {busy ? t('Sending…') : t('Send request →')}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
