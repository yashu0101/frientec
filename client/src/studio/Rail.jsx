/* The sticky summary. Their own photo and their own business name, untinted —
   the rail previews what they are buying, not the design they started from. */
import { useT } from '../i18n/I18nProvider.jsx';
import { useApp } from '../state/AppProvider.jsx';
import { useStudio } from './StudioContext.jsx';
import Thumb from '../components/Thumb.jsx';
import { inr } from '../lib/format.js';

export default function Rail() {
  const { c, q, demo, fullDomain, gotoStep } = useStudio();
  const { catName } = useApp();
  const t = useT();

  return (
    <aside className="rail-col">
      <div className="railcard">
        <div className="railthumb">
          <Thumb demo={demo} height={120} photo={c.hero} name={c.business || demo.name} />
        </div>
        <div className="railbody">
          <div className="mono dim">{t('Your project')}</div>
          <div className="railname">{c.business || t('Unnamed business')}</div>
          <div className="railmeta">{demo.name || ''} · {catName(c.category)}</div>
          <div className="raillines">
            {q.lines.map((l) => (
              <div className="rl" key={l.key}>
                <span>{l.label}</span><b>{inr(l.amount)}</b>
              </div>
            ))}
            <div className="rl sub"><span>{t('Subtotal')}</span><b>{inr(q.subtotal)}</b></div>
            <div className="rl"><span>{t(`GST ${q.gstPercent}%`)}</span><b>{inr(q.gst)}</b></div>
            <div className="rl total"><span>{t('Total')}</span><b>{inr(q.total)}</b></div>
            <div className="rl adv"><span>{t('Advance now')}</span><b>{inr(q.advance)}</b></div>
          </div>
          {fullDomain ? <div className="raildom mono">{fullDomain}</div> : null}
          <button type="button" className="linkbtn" onClick={() => gotoStep(1)}>
            ← {t('Change the design or content')}
          </button>
        </div>
      </div>
    </aside>
  );
}
