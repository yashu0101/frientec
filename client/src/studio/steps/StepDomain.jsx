import { useMemo } from 'react';
import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import Rail from '../Rail.jsx';
import { inr, slugify } from '../../lib/format.js';

const godaddy = (name) =>
  'https://www.godaddy.com/domainsearch/find?domainToCheck=' + encodeURIComponent(name);

export default function StepDomain() {
  const { c, sel, setSel, settings: s, errors, setErrors, next, back } = useStudio();
  const t = useT();
  const d = sel.domain;
  const base = slugify(d.name || c.business);

  const setDomain = (patch) => setSel((prev) => ({ ...prev, domain: { ...prev.domain, ...patch } }));

  const suggestions = useMemo(() => {
    const b = slugify(c.business);
    const city = slugify(c.city);
    if (!b) return [];
    const all = [b, ...(city ? [b + city] : []), 'the' + b, b + 'official', b + 'in'];
    return all.filter((x, i) => x && all.indexOf(x) === i).slice(0, 5);
  }, [c.business, c.city]);

  return (
    <>
      <div className="studio-grid rail">
        <div className="col">
          <div className="ehead">
            <h1>{t('Your domain name')}</h1>
            <p>
              {t('This is the address people type. We register it in')} <strong>{t('your')}</strong>{' '}
              {t('name — you own it, we only manage it.')}
            </p>
          </div>

          <div className="picks wide">
            <button
              type="button"
              className={'pick' + (d.mode === 'new' ? ' on' : '')}
              onClick={() => { setDomain({ mode: 'new' }); setErrors({}); }}
            >
              <span className="pt">{t('Register a new domain')}</span>
              <span className="pd">{t('We buy it and set it up')}</span>
            </button>
            <button
              type="button"
              className={'pick' + (d.mode === 'own' ? ' on' : '')}
              onClick={() => { setDomain({ mode: 'own' }); setErrors({}); }}
            >
              <span className="pt">{t('I already have one')}</span>
              <span className="pd">{t('We point it at the new site — no extra cost')}</span>
            </button>
          </div>

          {d.mode === 'own' ? (
            <div className="block">
              <div className="f">
                <label className="lbl">{t('Your existing domain')} <span className="req">*</span></label>
                <input
                  className={'in' + (errors.own ? ' bad' : '')}
                  value={d.own}
                  placeholder="yourbusiness.com"
                  spellCheck="false"
                  onChange={(e) => setDomain({ own: e.target.value })}
                />
                {errors.own ? <div className="err">{t(errors.own)}</div> : null}
              </div>
              <div className="notice">
                {t('Keep your registrar login handy. We send you two nameserver lines to paste in — it takes about five minutes, or we do it on a screen-share.')}
              </div>
            </div>
          ) : (
            <div className="block">
              <div className="f">
                <label className="lbl">{t('Name you want')} <span className="req">*</span></label>
                <div className="domrow">
                  <input
                    className={'in' + (errors.dname ? ' bad' : '')}
                    value={d.name}
                    placeholder="spicejunction"
                    spellCheck="false"
                    onChange={(e) => setDomain({ name: slugify(e.target.value) })}
                  />
                  <span className="domtld">{d.tld}</span>
                </div>
                {errors.dname ? <div className="err">{t(errors.dname)}</div> : null}
                <div className="hintline">
                  {t('Letters and numbers only, no spaces. Shorter is better — people will say it over the phone.')}
                </div>
              </div>

              {suggestions.length ? (
                <div className="f">
                  <label className="lbl">{t('Suggestions from your business name')}</label>
                  <div className="chips">
                    {suggestions.map((x) => (
                      <button
                        key={x}
                        type="button"
                        className={'chip2' + (base === x ? ' on' : '')}
                        onClick={() => setDomain({ name: x })}
                      >
                        {x}{d.tld}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="f">
                <label className="lbl">{t('Extension')}</label>
                <div className="tlds">
                  {(s.domains || []).map((tl) => (
                    <button
                      key={tl.tld}
                      type="button"
                      className={'tld' + (d.tld === tl.tld ? ' on' : '')}
                      onClick={() => setDomain({ tld: tl.tld })}
                    >
                      <span className="tt">{tl.tld}</span>
                      <span className="tp">{inr(tl.price)}/yr</span>
                      {tl.note ? <span className="tn">{t(tl.note)}</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="godaddy">
                <div className="gdtop">
                  <div>
                    <div className="mono dim">{t('Availability check')}</div>
                    <div className="gdname">{base ? base + d.tld : t('type a name above')}</div>
                  </div>
                  {base ? (
                    <a className="btn ink" target="_blank" rel="noopener" href={godaddy(base + d.tld)}>
                      {t('Check on GoDaddy ↗')}
                    </a>
                  ) : (
                    <button type="button" className="btn ink" disabled>{t('Check on GoDaddy ↗')}</button>
                  )}
                </div>
                <p>
                  {t('GoDaddy opens in a new tab with this exact name. If it is taken, try a suggestion above and check again. Once you find a free one, come back — we register it for you at the price shown and the renewal stays at cost.')}
                </p>
                {base ? (
                  <div className="gdlinks">
                    {t('Also check:')}{' '}
                    {(s.domains || []).slice(0, 5).map((tl, i) => (
                      <span key={tl.tld}>
                        {i ? ' · ' : ''}
                        <a target="_blank" rel="noopener" href={godaddy(base + tl.tld)}>{base + tl.tld}</a>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="g2">
                <div className="f">
                  <label className="lbl">{t('Register for')}</label>
                  <select className="in" value={d.years} onChange={(e) => setDomain({ years: Number(e.target.value) })}>
                    {[1, 2, 3, 5].map((y) => (
                      <option key={y} value={y}>{y} {y === 1 ? t('year') : t('years')}</option>
                    ))}
                  </select>
                </div>
                <div className="f">
                  <label className="lbl">{t('Privacy')}</label>
                  <label className="check tall">
                    <input type="checkbox" checked={!!d.privacy} onChange={(e) => setDomain({ privacy: e.target.checked })} />
                    {' '}{t('Hide my phone and address from public WHOIS')} (+{inr(s.domainPrivacyPrice)})
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="block">
            <h2>{t('Hosting')}</h2>
            <p className="muted">{t('Where the site actually lives. Skip it if you already pay for hosting somewhere.')}</p>
            <div className="picks wide">
              {(s.hosting || []).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={'pick' + (sel.hostingId === h.id ? ' on' : '')}
                  onClick={() => setSel({ hostingId: h.id })}
                >
                  <span className="pt">{t(h.name)}{h.recommended ? ` · ${t('recommended')}` : ''}</span>
                  <span className="pd">{h.price ? inr(h.price) : t('No charge from us')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <Rail />
      </div>

      <div className="studio-foot">
        <div className="ffacts"><span className="mono dim">{t('Step 3 of 4 · domain')}</span></div>
        <div className="fbtns">
          <button type="button" className="btn line" onClick={back}>← {t('Back to plans')}</button>
          <button type="button" className="btn go" onClick={next}>{t('Continue to payment →')}</button>
        </div>
      </div>
    </>
  );
}
