/* ---------------------------------------------------------------------------
   The catalogue. One route serves three things: everything, one trade, and the
   premium cut. `premium` rides the same path as a trade but is not one, so it is
   resolved before cat() ever sees it — otherwise it would fall through as an
   unknown category and quietly render an empty grid.
--------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, PREMIUM_SLUG } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import StageHead from '../components/StageHead.jsx';
import DemoCard from '../components/DemoCard.jsx';

const FAQ = [
  ['Can I change the colours and photos?', 'Yes. The design is the starting point — your logo, colours, photos and text all go in during customisation.'],
  ['How long does it take?', 'Usually five to seven working days once you send us your content.'],
  ['Do I need to buy a domain?', 'If you do not have one, we will register it for you and add the cost to the quote.'],
  ['What happens after it is live?', 'You get a WhatsApp line for changes. Small edits are usually done the same day.'],
];

export default function Browse() {
  const { slug, preview } = useParams();
  const { categories, cat, demosIn, publishedDemos, premiumDemos } = useApp();
  const { openPreview } = useUI();
  const t = useT();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  // /demos/<category>/<slug> — the old deep link that opened a design on top
  useEffect(() => {
    if (preview) openPreview(preview);
  }, [preview, openPreview]);

  // a fresh trade is a fresh search
  useEffect(() => { setQ(''); }, [slug]);

  const isPrem = slug === PREMIUM_SLUG;
  const c = slug && !isPrem ? cat(slug) : null;

  let list = isPrem ? premiumDemos() : slug ? demosIn(slug) : publishedDemos();
  const needle = q.trim().toLowerCase();
  if (needle) {
    list = list.filter((d) =>
      `${d.name} ${d.style} ${(d.tags || []).join(' ')} ${(cat(d.category) || {}).name || ''}`
        .toLowerCase()
        .includes(needle));
  }

  const label = isPrem ? 'Designs · premium' : c ? `Designs · ${c.slug}` : 'The catalogue';
  const title = isPrem ? 'Premium website designs' : c ? `${c.name} websites` : 'All website designs';
  const blurb = isPrem
    ? 'The top of the catalogue — each one hand-built for its business rather than recoloured from a template. They sit in their own trade too, so you will meet them again while browsing.'
    : c
      ? c.blurb
      : `Every design in the catalogue, across all ${categories.length} kinds of business. Open one full-screen to see it as your customers would.`;

  return (
    <>
      <StageHead label={label} title={title} blurb={blurb}>
        <input
          className="in"
          placeholder={t('Search designs, styles, tags')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: '380px', margin: '22px 0 18px' }}
        />
        <div className="chiprow">
          <span className={'chip' + (slug ? '' : ' on')} onClick={() => navigate('/designs')}>{t('All')}</span>
          {/* Premium sits first among the filters, before the trades: it cuts
              across all of them, so putting it in the alphabet of categories
              would suggest it is one. */}
          {premiumDemos().length ? (
            <span
              className={'chip prem' + (isPrem ? ' on' : '')}
              onClick={() => navigate(`/designs/${PREMIUM_SLUG}`)}
            >
              ✦ {t('Premium')}
            </span>
          ) : null}
          {categories.map((x) => (
            <span
              key={x.slug}
              className={'chip' + (slug === x.slug ? ' on' : '')}
              onClick={() => navigate(`/designs/${x.slug}`)}
            >
              {t(x.name)}
            </span>
          ))}
        </div>
      </StageHead>

      <div className="wrap" style={{ padding: '26px 0 60px' }}>
        <div className="mono dim" style={{ marginBottom: '16px' }}>{t(`${list.length} designs`)}</div>

        {list.length ? (
          <div className="g3">{list.map((d) => <DemoCard demo={d} key={d.id} />)}</div>
        ) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>{t('No designs match')} “{q}”</div>
            <div className="muted" style={{ marginBottom: '18px' }}>
              {t('Clear the search, or tell us what you are looking for and we will design it.')}
            </div>
            <button type="button" className="btn line" onClick={() => setQ('')}>{t('Clear search')}</button>
          </div>
        )}

        {c ? (
          <div style={{ marginTop: '48px' }}>
            <h2 className="disp" style={{ fontSize: '26px', marginBottom: '18px' }}>{t('Common questions')}</h2>
            <div className="card">
              {FAQ.map(([qq, aa], i) => (
                <div key={qq} style={{ padding: '18px', ...(i < 3 ? { borderBottom: '1px solid var(--line-2)' } : null) }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{t(qq)}</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>{t(aa)}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
