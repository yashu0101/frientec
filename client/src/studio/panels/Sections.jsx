import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { HintLine } from '../Fields.jsx';

export default function Sections() {
  const { c, setC } = useStudio();
  const t = useT();

  const rows = [
    ['about', 'About us', 'Your story, with a photo'],
    ['services', c.servicesLabel || 'Services', 'Names, prices, one-liners'],
    ['gallery', 'Gallery', 'Grid of your photos'],
    ['reviews', 'Reviews', 'Customer quotes'],
    ['hours', 'Visit us', 'Hours, address, map link'],
    ['cta', 'Closing band', 'Big WhatsApp / call panel'],
  ];

  const toggle = (key, on) =>
    setC((prev) => ({ ...prev, sections: { ...prev.sections, [key]: on } }));

  return (
    <>
      <div className="toggles">
        {rows.map(([key, name, note]) => {
          const on = c.sections[key] !== false;
          return (
            <label className={'toggle' + (on ? ' on' : '')} key={key}>
              <input type="checkbox" checked={on} onChange={(e) => toggle(key, e.target.checked)} />
              <span className="tbox" />
              <span className="tname">{t(name)}<em>{t(note)}</em></span>
            </label>
          );
        })}
      </div>
      <HintLine>{t('Turn off what you do not need. The navigation menu updates by itself.')}</HintLine>
    </>
  );
}
