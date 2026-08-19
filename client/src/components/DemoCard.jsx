import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { accOf, accVars } from '../lib/format.js';
import Thumb from './Thumb.jsx';

/* Title, the spec line, then a sentence on who the design is actually for. The
   name and the style label alone do not tell you whether a design suits your
   trade — the sentence is what makes the grid browsable instead of decorative. */
export default function DemoCard({ demo: d }) {
  const { cat } = useApp();
  const { openPreview } = useUI();
  const t = useT();
  const navigate = useNavigate();
  const c = cat(d.category);

  return (
    <div className="tiltbox">
      <div className="card hoverable demo-card tilt" style={accVars(d.accent || accOf(d.category))}>
        <span className="edge" />
        <div className="media">
          <Thumb demo={d} />
          {d.featured ? <div className="ribbon mono">{t('Featured')}</div> : null}
          {/* Right-hand side so a design can be both featured and premium
              without the two markers stacking on top of each other. */}
          {d.premium ? <div className="ribbon prem mono">✦ {t('Premium')}</div> : null}
          <span className="glare" />
        </div>
        <div className="body">
          <div>
            <h3>{d.name}</h3>
            <div className="mono dim" style={{ marginTop: '5px' }}>
              {(c ? c.name.split(' ')[0] : d.category)} · {d.style} · {(d.sections || []).length} {t('sections')}
            </div>
            {d.description ? <p className="blurb">{t(d.description)}</p> : null}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {/* a design can carry the same tag twice — data, not a mistake to
                fix here — so the index is part of the key */}
            {(d.tags || []).map((tag, i) => (
              <span className="tag" key={`${tag}-${i}`}>{tag}</span>
            ))}
          </div>
          <div className="acts">
            <button type="button" className="btn line sm" onClick={() => openPreview(d.slug)}>
              {t('Live preview')}
            </button>
            <button type="button" className="btn go sm" onClick={() => navigate(`/build/${d.slug}`)}>
              {t('Customise this →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
