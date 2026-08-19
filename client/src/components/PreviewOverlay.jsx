/* ---------------------------------------------------------------------------
   A design, full screen, exactly as a customer would meet it.

   Most templates return a fragment, which is injected into the stage. The five
   premium designs are whole documents of their own and come back as an <iframe>;
   those get the `embed` class, because a page that scrolls inside its own
   document needs the stage to stop scrolling and hand it a fixed height instead.
   Without that the iframe collapses — the stage is height:fit-content and an
   iframe contributes no intrinsic content height.
--------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { EMBED_TEMPLATES, renderTemplate } from '../lib/templates.js';
import { inr } from '../lib/format.js';

export default function PreviewOverlay({ slug, onClose }) {
  const { demoBySlug, cat, settings } = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [device, setDevice] = useState('desktop');
  const d = demoBySlug(slug);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!d) return null;

  const c = cat(d.category) || {};
  const html = renderTemplate(d, { categoryName: c.name, categoryBlurb: c.blurb });
  const embed = !!(EMBED_TEMPLATES[d.template] || EMBED_TEMPLATES[d.slug]);
  const build = () => navigate(`/build/${d.slug}`);

  return (
    <div id="overlay">
      <div className={`live ${device}${embed ? ' embed' : ''}`}>
        <div className="chrome">
          <button type="button" className="btn sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }} onClick={onClose}>
            ‹ {t('Back')}
          </button>
          <div style={{ textAlign: 'center', minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>{d.name}</div>
            <div className="mono" style={{ color: 'rgba(255,255,255,.45)', fontSize: '9.5px' }}>
              /demos/{d.category}/{d.slug}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div className="seg">
              <button type="button" className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>{t('Desktop')}</button>
              <button type="button" className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>{t('Mobile')}</button>
            </div>
            <button type="button" className="x" style={{ color: '#fff' }} onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* `lv-stage`, not `stage`: the landing hero owns a global `.stage`
            class with min-height:100svh on it, and that would push a design's
            own sticky navbar down the page. */}
        <div className="lv-stage">
          {/* An embedded page is the iframe and nothing else: `.live.embed .frame`
              is a flex container and `.siteframe` claims its height with
              flex:1 1 auto, so any wrapper in between would leave the iframe at
              its intrinsic 150px in a stretched stage. */}
          {embed ? (
            <div className="frame" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
          <div className="frame">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {/* The closing pitch is appended below a fragment template. An
                embedded page fills the stage and scrolls itself, so there is no
                "below" — the bar underneath carries the same action for those. */}
            {(
              <div style={{ background: 'var(--inverse)', color: 'var(--on-inverse)', padding: '34px 24px', textAlign: 'center' }}>
                <div className="mono" style={{ color: '#7FD3B4', marginBottom: '10px' }}>{t('Like this design?')}</div>
                <h3 className="disp" style={{ fontSize: '26px', marginBottom: '8px' }}>{t('Make it yours, then see the price.')}</h3>
                <p style={{ color: 'rgba(255,255,255,.6)', margin: '0 0 20px', fontSize: '15px' }}>
                  {t('Your name, your photos, your prices and colours — then a plan, a domain and one total.')}
                </p>
                <button type="button" className="btn go" onClick={build}>{t('Customise this design →')}</button>
              </div>
            )}
          </div>
          )}
        </div>

        <div className="cta">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '14.5px' }}>{d.name}</div>
            <div className="mono dim">{t(`Starts at ${inr(settings.startingPrice)}`)}</div>
          </div>
          <button type="button" className="btn go" onClick={build}>{t('I want this website')}</button>
        </div>
      </div>
    </div>
  );
}
