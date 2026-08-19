import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { Field } from '../Fields.jsx';
import Rail from '../Rail.jsx';
import { inr, PAY_LABEL } from '../../lib/format.js';

export default function StepPay() {
  const { q: Q, settings: s, payment, setPayment, errors, setErrors, submitting, submit, back } = useStudio();
  const t = useT();

  const methods = [
    ['upi', PAY_LABEL.upi, `Pay the advance now to ${s.upiId || ''} — instant, no fee`],
    ['bank', PAY_LABEL.bank, 'We email the account details and a GST invoice'],
    ['card', PAY_LABEL.card, 'We send a payment link, valid 48 hours'],
    ['call', PAY_LABEL.call, 'Nothing now. We confirm the scope first, then invoice'],
  ];

  return (
    <>
      <div className="studio-grid rail">
        <div className="col">
          <div className="ehead">
            <h1>{t('Confirm and place the order')}</h1>
            <p>
              {t('Everything you picked, added up once.')} {Q.advancePercent}% {t('now starts the work, the rest on handover.')}
            </p>
          </div>

          <div className="block invoice">
            <h2>{t('What you are ordering')}</h2>
            <table className="itable">
              <tbody>
                {Q.lines.map((l) => (
                  <tr key={l.key}>
                    <td>
                      <div className="il">{l.label}</div>
                      {l.detail ? <div className="id">{l.detail}</div> : null}
                    </td>
                    <td className="ia">{inr(l.amount)}</td>
                  </tr>
                ))}
                <tr className="sum"><td>{t('Subtotal')}</td><td className="ia">{inr(Q.subtotal)}</td></tr>
                <tr><td>{t(`GST @ ${Q.gstPercent}%`)}</td><td className="ia">{inr(Q.gst)}</td></tr>
                <tr className="tot"><td>{t('Total')}</td><td className="ia">{inr(Q.total)}</td></tr>
                <tr className="adv">
                  <td>{t(`Advance to start (${Q.advancePercent}%)`)}</td>
                  <td className="ia">{inr(Q.advance)}</td>
                </tr>
                <tr><td>{t('Balance on handover')}</td><td className="ia">{inr(Q.balance)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="block">
            <h2>{t('How you want to pay')}</h2>
            <div className="picks wide">
              {methods.map(([id, label, note]) => (
                <button
                  key={id}
                  type="button"
                  className={'pick' + (payment.method === id ? ' on' : '')}
                  onClick={() => setPayment({ method: id })}
                >
                  <span className="pt">{t(label)}</span>
                  <span className="pd">{t(note)}</span>
                </button>
              ))}
            </div>
            {payment.method === 'upi' ? (
              <div className="notice">
                {t('UPI ID')} <strong>{s.upiId || ''}</strong> · {t('amount')} {inr(Q.advance)}.{' '}
                {t('Place the order first — the confirmation screen carries your reference number, and you put that in the UPI note.')}
              </div>
            ) : null}
          </div>

          <div className="block">
            <h2>{t('We will call this number')}</h2>
            <div className="g2">
              <Field k="phone" label="Phone" ph="98765 43210" req />
              <Field k="whatsapp" label="WhatsApp" ph="98765 43210" req />
            </div>
            <div className="g2">
              <Field k="owner" label="Your name" ph="Rohit Kulkarni" req />
              <Field k="email" label="Email for the invoice" ph="you@example.com" type="email" />
            </div>
          </div>

          <label className={'check big' + (errors.terms ? ' bad' : '')}>
            <input
              type="checkbox"
              checked={!!payment.terms}
              onChange={(e) => { setPayment({ terms: e.target.checked }); if (errors.terms) setErrors({}); }}
            />
            {' '}
            {t('I understand this is a fixed-price order for a static website as itemised above, that content and photos I send are mine to use, and that the domain is registered in my name.')}
          </label>
          {errors.terms ? <div className="err">{t(errors.terms)}</div> : null}
        </div>
        <Rail />
      </div>

      <div className="studio-foot">
        <div className="ffacts"><span className="mono dim">{t('Step 4 of 4 · payment')}</span></div>
        <div className="fbtns">
          <button type="button" className="btn line" onClick={back}>← {t('Back to domain')}</button>
          <button type="button" className="btn go" onClick={submit} disabled={submitting}>
            {submitting ? t('Placing the order…') : `${t('Place order')} · ${inr(Q.advance)} ${t('now')}`}
          </button>
        </div>
      </div>
    </>
  );
}
