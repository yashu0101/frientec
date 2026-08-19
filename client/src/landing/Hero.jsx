/* ---------------------------------------------------------------------------
   The hero showcase: background, caption, counter and filmstrip all move
   together, whether the change came from the timer or from the pointer. One
   piece of state owns them all, so they cannot drift apart.

   Hover previews, click opens — brushing the strip while reading is not the
   same gesture as choosing to leave the page.
--------------------------------------------------------------------------- */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { artOf } from '../lib/format.js';
import { Paren } from '../components/StageHead.jsx';
import Wordmark from './Wordmark.jsx';
import { spread, CALM } from './spread.js';

const RIGHT = ['Ready-made designs', 'Your photos and words', 'Domain and hosting', 'Live in about a week'];

export default function Hero() {
  const { demos, categories, settings, cat } = useApp();
  const { openPreview } = useUI();
  const t = useT();
  const navigate = useNavigate();
  const [at, setAt] = useState(0);

  const show = useMemo(() => spread(demos, 6), [demos]);
  const n = show.length;

  useEffect(() => {
    if (!n || CALM()) return undefined;
    const id = setInterval(() => setAt((i) => (i + 1) % n), 5200);
    return () => clearInterval(id);
  }, [n]);

  if (!n) return null;
  const active = Math.min(at, n - 1);

  return (
    <section className="stage" id="stage" data-count={n}>
      <div className="beds" aria-hidden="true">
        {show.map((d, i) => (
          <span
            key={d.slug}
            className={'bed' + (i === active ? ' on' : '')}
            style={{ backgroundImage: `url('${artOf(d)}')` }}
          />
        ))}
      </div>
      <span className="wash" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />

      <div className="stage-in">
        {/* The corners: trades we build for on the left, what actually ships
            with a site on the right. Real lists, framing the type without
            competing with it. */}
        <div className="stage-top">
          <ul className="edgelist tl">
            {categories.slice(0, 5).map((c) => <li key={c.slug}>{t(c.name)}</li>)}
          </ul>
          <div className="stage-mid"><Paren>Brand direction</Paren></div>
          <ul className="edgelist tr">
            {RIGHT.map((x) => <li key={x}>{t(x)}</li>)}
          </ul>
        </div>

        <Wordmark brand={settings.brand} />
        <p className="stage-sub">{t(settings.tagline || '')}</p>

        <div className="stage-acts">
          <button type="button" className="btn go" onClick={() => navigate('/designs')}>
            {t('Explore website designs →')}
          </button>
          <button type="button" className="btn line" onClick={() => navigate('/how')}>
            {t('See how it works')}
          </button>
        </div>

        <div className="stage-foot">
          <div className="counter mono">
            <b>{String(active + 1).padStart(2, '0')}</b>
            <span>//</span>
            <i>{String(n).padStart(2, '0')}</i>
          </div>
          <div className="caps">
            {show.map((d, i) => {
              const c = cat(d.category);
              return (
                <span key={d.slug} className={'cap' + (i === active ? ' on' : '')}>
                  <b>{d.name}</b>
                  <em>{c ? t(c.name) : d.category} · {d.style}</em>
                </span>
              );
            })}
          </div>
          <div className="strip">
            {show.map((d, i) => (
              <button
                key={d.slug}
                type="button"
                className={'shot' + (i === active ? ' on' : '')}
                style={{ backgroundImage: `url('${artOf(d)}')` }}
                title={d.name}
                aria-label={d.name}
                onMouseEnter={() => setAt(i)}
                onClick={() => openPreview(d.slug)}
              />
            ))}
          </div>
          <div className="cue"><span>{t('Scroll to see the catalogue')}</span></div>
        </div>
      </div>
    </section>
  );
}
