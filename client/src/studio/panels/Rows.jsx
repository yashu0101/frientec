/* Services and reviews — two list editors with the same shape. */
import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { HintLine } from '../Fields.jsx';

export function Services() {
  const { c, setC, setPanel } = useStudio();
  const t = useT();

  const edit = (i, key, value) =>
    setC((prev) => {
      const services = prev.services.slice();
      services[i] = { ...services[i], [key]: value };
      return { ...prev, services };
    });

  return (
    <>
      <div className="rows">
        {c.services.map((s, i) => (
          <div className="rowitem" key={i}>
            <div className="rowgrip">{i + 1}</div>
            <div className="rowfields">
              <input className="in" value={s.name} placeholder={t('Name')} onChange={(e) => edit(i, 'name', e.target.value)} />
              <input className="in" value={s.price} placeholder={t('₹ price')} onChange={(e) => edit(i, 'price', e.target.value)} />
              <input className="in wide" value={s.desc} placeholder={t('One line about it')} onChange={(e) => edit(i, 'desc', e.target.value)} />
            </div>
            <button
              type="button"
              className="rowx"
              title="Remove"
              onClick={() => setC((prev) => ({ ...prev, services: prev.services.filter((_, j) => j !== i) }))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn line sm"
        onClick={() => setC((prev) => ({ ...prev, services: [...prev.services, { name: '', desc: '', price: '' }] }))}
      >
        + {t('Add a row')}
      </button>
      <HintLine>
        {t('Call it a menu, a price list, treatments, packages — whatever your trade calls it. Rename the section in')}{' '}
        <button type="button" className="linkbtn" onClick={() => setPanel('words')}>{t('Words on the page')}</button>.
      </HintLine>
    </>
  );
}

export function Reviews() {
  const { c, setC } = useStudio();
  const t = useT();

  const edit = (i, key, value) =>
    setC((prev) => {
      const reviews = prev.reviews.slice();
      reviews[i] = { ...reviews[i], [key]: value };
      return { ...prev, reviews };
    });

  return (
    <>
      <div className="rows">
        {c.reviews.map((r, i) => (
          <div className="rowitem" key={i}>
            <div className="rowgrip">★</div>
            <div className="rowfields">
              <input className="in wide" value={r.text} placeholder={t('What they said')} onChange={(e) => edit(i, 'text', e.target.value)} />
              <input className="in" value={r.author} placeholder={t('Their name')} onChange={(e) => edit(i, 'author', e.target.value)} />
            </div>
            <button
              type="button"
              className="rowx"
              title="Remove"
              onClick={() => setC((prev) => ({ ...prev, reviews: prev.reviews.filter((_, j) => j !== i) }))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn line sm"
        onClick={() => setC((prev) => ({ ...prev, reviews: [...prev.reviews, { text: '', author: '' }] }))}
      >
        + {t('Add a review')}
      </button>
      <HintLine>{t('Use real ones from Google or WhatsApp. Made-up reviews are the fastest way to lose trust.')}</HintLine>
    </>
  );
}
