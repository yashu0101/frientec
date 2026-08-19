import { useNavigate } from 'react-router-dom';
import { useApp, PREMIUM_SLUG } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { accOf, accVars, CAT_ICON, inr } from '../lib/format.js';
import { Paren } from '../components/StageHead.jsx';
import DemoCard from '../components/DemoCard.jsx';
import Hero from '../landing/Hero.jsx';
import Marquee from '../landing/Marquee.jsx';
import Showcase from '../landing/Showcase.jsx';
import Process from '../landing/Process.jsx';

const WHY = [
  ['📱', 'Built for phones', 'Most of your customers arrive from WhatsApp or Instagram on a small screen. That is what we design for first.'],
  ['⚡', 'Fast to load', 'Static pages, compressed images. Works on patchy mobile data.'],
  ['💬', 'WhatsApp built in', 'A floating button that opens a chat with your business, pre-filled.'],
  ['🔍', 'Ready for Google', 'Titles, descriptions, business schema and a sitemap set up before launch.'],
  ['🎨', 'Your branding', 'Your logo, colours and photos. Not a stock template with your name pasted on.'],
  ['☎️', 'Personal support', 'Text the person who built the site. Small changes are usually same-day.'],
];

export default function Home() {
  const { demos, categories, settings, demosIn, premiumDemos } = useApp();
  const { openLead } = useUI();
  const t = useT();
  const navigate = useNavigate();

  let featured = demos.filter((d) => d.featured && d.published).slice(0, 3);
  if (!featured.length) featured = demos.filter((d) => d.published).slice(0, 3);
  const prem = premiumDemos();

  /* The band names a price, and the price is the one the studio actually quotes
     — read off the plan rather than written into the copy, so it cannot drift
     from what the checkout charges. */
  const premPlan = (settings.plans || []).find((p) => p.id === 'premium');

  return (
    <>
      {/* The hero, the box and the process share one world, so they are wrapped
          together. The reading sections that follow are opaque and stand alone. */}
      <div className="zone">
        <Hero />
        <Marquee />
        <Showcase />
        <Process />
      </div>

      <section className="band">
        <div className="wrap">
          <div className="bandhead">
            <Paren>Step one</Paren>
            <h2 className="sec disp">{t('Choose your business')}</h2>
            <p className="muted">{t('Every category has designs written for that trade — not one template recoloured.')}</p>
          </div>
          <div className="g4">
            {categories.map((c) => (
              <div className="tiltbox" key={c.slug}>
                <button
                  type="button"
                  className="card hoverable cat-card tilt"
                  style={accVars(accOf(c.slug))}
                  onClick={() => navigate(`/designs/${c.slug}`)}
                >
                  <span className="edge" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="ico">{CAT_ICON[c.slug]}</div>
                    <span className="mono dim count">{t(`${demosIn(c.slug).length} designs`)}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16.5px', marginBottom: '5px' }}>{t(c.name)}</div>
                    <div style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{t(c.blurb)}</div>
                  </div>
                  <div className="go-link" style={{ marginTop: 'auto', fontWeight: 600, fontSize: '14px' }}>
                    {t('View designs ›')}
                  </div>
                  <span className="glare" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band white">
        <div className="wrap">
          <div className="bandhead row">
            <div>
              <Paren>Featured</Paren>
              <h2 className="sec disp">{t('Designs worth opening full-screen')}</h2>
            </div>
            <button type="button" className="btn line sm" onClick={() => navigate('/designs')}>
              {t(`Browse all ${demos.length}`)}
            </button>
          </div>
          <div className="g3">
            {featured.map((d) => <DemoCard demo={d} key={d.id} />)}
          </div>
        </div>
      </section>

      {/* The premium band only exists when something is flagged for it — an
          empty band explaining what would go in it is worse than no band. */}
      {prem.length ? (
        <section className="band prem">
          <div className="wrap">
            <div className="bandhead row">
              <div>
                <Paren>Premium</Paren>
                <h2 className="sec disp">{t('Our most expensive work')}</h2>
                {/* The sentence and the price are separate nodes so the first can
                    be translated: a key with a live rupee figure baked into it
                    would stop matching the moment the price changed. */}
                <p className="muted">
                  <span>{t('Hand-built rather than recoloured: bespoke layouts, custom typography and photography direction.')}</span>
                  {premPlan ? <> <span className="mono premtag">{premPlan.name} · {inr(premPlan.price)}</span></> : null}
                </p>
              </div>
              {/* Only offer "see all" when the band is actually holding some
                  back — a link promising more than it delivers is worse. */}
              {prem.length > 3 ? (
                <button type="button" className="btn line sm" onClick={() => navigate(`/designs/${PREMIUM_SLUG}`)}>
                  {t('See all premium designs')}
                </button>
              ) : null}
            </div>
            {/* Two cards in a three-column grid leave a hole where a third
                should be, which reads as a design that failed to load. */}
            <div className={prem.length === 2 ? 'g2' : 'g3'}>
              {prem.slice(0, 3).map((d) => <DemoCard demo={d} key={d.id} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="band dark">
        <div className="wrap">
          <div className="bandhead">
            <Paren>Why us</Paren>
            <h2 className="sec disp">{t('Why work with us')}</h2>
            <p className="muted">{t('Small studio. You get the person who builds it, on the phone.')}</p>
          </div>
          <div className="g3">
            {WHY.map(([icon, title, body]) => (
              <div className="whycard" key={title}>
                <div style={{ fontSize: '20px' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '17px', margin: '12px 0 7px' }}>{t(title)}</div>
                <div style={{ color: 'rgba(255,255,255,.62)', fontSize: '14.5px', lineHeight: 1.65 }}>{t(body)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band white">
        <div className="wrap narrow" style={{ textAlign: 'center' }}>
          <Paren>Pricing</Paren>
          {/* One node, not two: the dictionary matches this whole line with a
              pattern, so a live price stays inside the translated sentence. */}
          <h2 className="sec disp">{t(`Projects start at ${inr(settings.startingPrice)}`)}</h2>
          <p className="muted" style={{ fontSize: '16.5px', lineHeight: 1.7, margin: '0 0 26px' }}>
            {t('The final number depends on how many pages you need and whether you want booking, payments or a catalogue. Tell us what you are after and we will send a fixed quote — no hourly billing.')}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn go" onClick={() => navigate('/designs')}>{t('Explore designs')}</button>
            <button type="button" className="btn line" onClick={() => openLead('')}>{t('Request a quote')}</button>
          </div>
        </div>
      </section>
    </>
  );
}
