/* ---------------------------------------------------------------------------
   Extra languages are a real translation pass, not a toggle: the customer types
   each version and the site gets a switcher. Anything left blank falls back to
   the primary language, so a partial translation is safe.
--------------------------------------------------------------------------- */
import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { HintLine } from '../Fields.jsx';
import { SITE_LANGS, I18N_KEYS } from '../../lib/renderCustom.js';
import { inr } from '../../lib/format.js';

const langName = (code) => {
  const l = SITE_LANGS.find((x) => x.code === code);
  return l ? l.native + (l.name !== l.native ? ' · ' + l.name : '') : code;
};

const MAX_LANGS = 5;

export default function Languages() {
  const { c, sel, setC, setLanguages, settings, ai, runTranslate, say } = useStudio();
  const t = useT();
  const chosen = c.languages;
  const price = settings.extraLanguagePrice || 0;

  function toggle(code) {
    const at = chosen.indexOf(code);
    if (at === 0) { say('That is the main language. Pick a different one as main first.'); return; }
    if (at > 0) {
      setLanguages(chosen.filter((x) => x !== code));
      setC((prev) => {
        const i18n = { ...prev.i18n };
        delete i18n[code];
        return { ...prev, i18n };
      });
      return;
    }
    if (chosen.length >= MAX_LANGS) {
      say('Five languages is the limit — past that a site gets hard to keep updated.');
      return;
    }
    setLanguages([...chosen, code]);
    setC((prev) => ({ ...prev, i18n: { ...prev.i18n, [code]: prev.i18n[code] || {} } }));
  }

  const makePrimary = (code) => {
    const at = chosen.indexOf(code);
    if (at <= 0) return;
    setLanguages([code, ...chosen.filter((x) => x !== code)]);
  };

  const setCopy = (code, key, value) =>
    setC((prev) => ({ ...prev, i18n: { ...prev.i18n, [code]: { ...prev.i18n[code], [key]: value } } }));

  return (
    <>
      <div className="f">
        <label className="lbl">{t('Languages your website should be in')}</label>
        <div className="chips">
          {SITE_LANGS.map((l) => {
            const i = chosen.indexOf(l.code);
            return (
              <button key={l.code} type="button" className={'chip2' + (i >= 0 ? ' on' : '')} onClick={() => toggle(l.code)}>
                {i === 0 ? '★ ' : i > 0 ? '✓ ' : ''}{l.native}
              </button>
            );
          })}
        </div>
        <HintLine>
          {t('★ is the main language — the one the site opens in. Every language after the first is +')}{inr(price)}.{' '}
          {t('Right now:')} <strong>{chosen.length}</strong>{' '}
          ({sel.extraLanguages ? `+${inr(sel.extraLanguages * price)}` : t('no extra charge')}).
        </HintLine>
      </div>

      {chosen.length > 1 ? (
        <div className="f">
          <label className="lbl">{t('Which one opens first')}</label>
          <div className="picks">
            {chosen.map((code) => (
              <button
                key={code}
                type="button"
                className={'pick' + (code === chosen[0] ? ' on' : '')}
                onClick={() => makePrimary(code)}
              >
                <span className="pt">{langName(code)}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {chosen.slice(1).map((code) => {
        const d = c.i18n[code] || {};
        const busy = ai.translating === code;
        return (
          <div className="langblock" key={code}>
            <div className="langhead">
              <div className="langtop">
                <span>{langName(code)}</span>
                <button
                  type="button"
                  className="btn line sm"
                  disabled={busy}
                  onClick={() => runTranslate(code, SITE_LANGS)}
                >
                  {busy ? <><span className="spin" /> {t('Translating…')}</> : <>✦ {t('Translate with AI')}</>}
                </button>
              </div>
              <em>{t('Leave a box empty and that line stays in your main language.')}</em>
            </div>
            {I18N_KEYS.map(([key, label]) => {
              const big = key === 'about' || key === 'ctaText' || key === 'heroText';
              return (
                <div className="f" key={key}>
                  <label className="lbl">{t(label)}</label>
                  {big ? (
                    <textarea className="in" rows="2" value={d[key] || ''} onChange={(e) => setCopy(code, key, e.target.value)} />
                  ) : (
                    <input className="in" value={d[key] || ''} onChange={(e) => setCopy(code, key, e.target.value)} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <HintLine>
        {t('Names, prices and phone numbers are not translated — they stay exactly as you typed them. If you would rather we do the translating, tick it and we will quote for it.')}
      </HintLine>
    </>
  );
}
