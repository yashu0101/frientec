import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { Check } from '../Fields.jsx';
import { Addons } from '../panels/Scope.jsx';
import Rail from '../Rail.jsx';
import { inr, waLink } from '../../lib/format.js';

export default function StepPlan() {
  const { c, sel, setSel, settings: s, planById, next, back, wantsDynamic, setWantsDynamic } = useStudio();
  const t = useT();
  const plan = planById(sel.planId);

  const choose = (p) =>
    setSel((prev) => ({ ...prev, planId: p.id, pages: prev.pages < p.pages ? p.pages : prev.pages }));

  const over = sel.pages - plan.pages;

  return (
    <>
      <div className="studio-grid rail">
        <div className="col">
          <div className="ehead">
            <h1>{t(`Pick a plan for ${c.business || 'your website'}`)}</h1>
            {/* Assembled in English first, then translated as one line — the
                dictionary matches this sentence with a pattern that keeps the
                page count and the extras where they belong. */}
            <p>
              {t(
                `Priced for what you just built: ${sel.pages} ${sel.pages === 1 ? 'page' : 'pages'}`
                + (sel.addons.length ? ` and ${sel.addons.length} extra${sel.addons.length === 1 ? '' : 's'}` : '')
                + '. One fixed price, no hourly billing.',
              )}
            </p>
          </div>

          <div className="plans">
            {(s.plans || []).map((p) => {
              const on = sel.planId === p.id;
              return (
                <div className={'plan' + (on ? ' on' : '') + (p.popular ? ' pop' : '')} key={p.id} onClick={() => choose(p)}>
                  {p.popular ? <div className="poptag mono">{t('Most picked')}</div> : null}
                  <div className="pname">{p.name}</div>
                  <div className="pprice">{inr(p.price)}</div>
                  <div className="pdel mono dim">
                    {p.delivery} · {t('up to')} {p.pages} {p.pages === 1 ? t('page') : t('pages')}
                  </div>
                  <p className="pblurb">{t(p.blurb)}</p>
                  <ul>{(p.includes || []).map((x) => <li key={x}>{t(x)}</li>)}</ul>
                  <button type="button" className={'btn ' + (on ? 'go' : 'line') + ' full'} onClick={() => choose(p)}>
                    {on ? `✓ ${t('Selected')}` : `${t('Choose')} ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {over > 0 ? (
            <div className="notice">
              {over} {over === 1 ? t('page') : t('pages')} {t('beyond')} {plan.name} — {t('added at')} {inr(s.extraPagePrice)} {t('each. Move up a plan and it works out cheaper.')}
            </div>
          ) : null}

          <div className="block">
            <h2>{t('Extras')}</h2>
            <p className="muted">{t('Ticked here, itemised at checkout. Change your mind on the call and we re-issue the quote.')}</p>
            <Addons />
          </div>

          {/* the highlighted static-vs-dynamic message */}
          <div className="dynamic">
            <div className="dyntag mono">{t('Want more than a static site?')}</div>
            <p>{t(s.dynamicNote || '')}</p>
            <div className="dynrow">
              <a
                className="btn ink"
                target="_blank"
                rel="noopener"
                href={waLink(s.whatsapp, `Hi, I want a dynamic website (admin panel / logins / live data) for ${c.business || 'my business'}. Please quote.`)}
              >
                {t('💬 Ask for a custom quote')}
              </a>
              <a className="btn line" href={`tel:${String(s.whatsapp || '').replace(/[^\d+]/g, '')}`}>
                {t('Call')} {s.whatsapp || ''}
              </a>
              <Check checked={wantsDynamic} onChange={setWantsDynamic}>
                {t('Add a note to my order that I want this discussed')}
              </Check>
            </div>
          </div>
        </div>
        <Rail />
      </div>

      <div className="studio-foot">
        <div className="ffacts"><span className="mono dim">{t('Step 2 of 4 · plan')}</span></div>
        <div className="fbtns">
          <button type="button" className="btn line" onClick={back}>← {t('Back to customising')}</button>
          <button type="button" className="btn go" onClick={next}>{t('Continue to domain →')}</button>
        </div>
      </div>
    </>
  );
}
