import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { HintLine } from '../Fields.jsx';
import { inr } from '../../lib/format.js';

export function Addons() {
  const { sel, setSel, settings } = useStudio();
  const t = useT();

  const toggle = (id, on) =>
    setSel((prev) => ({
      ...prev,
      addons: on ? [...prev.addons, id] : prev.addons.filter((x) => x !== id),
    }));

  return (
    <div className="addons">
      {(settings.addons || []).map((a) => {
        const on = sel.addons.includes(a.id);
        return (
          <label className={'addon' + (on ? ' on' : '')} key={a.id}>
            <input type="checkbox" checked={on} onChange={(e) => toggle(a.id, e.target.checked)} />
            <span className="an">{t(a.name)}<em>{t(a.note || '')}</em></span>
            <span className="ap">+{inr(a.price)}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function Scope() {
  const { sel, setSel, planById } = useStudio();
  const t = useT();
  const plan = planById(sel.planId);

  const bump = (by) =>
    setSel((prev) => ({ ...prev, pages: Math.max(1, Math.min(30, prev.pages + by)) }));

  return (
    <>
      <div className="f">
        <label className="lbl">{t('How many pages do you want?')}</label>
        <div className="stepper">
          <button type="button" className="btn line sm" onClick={() => bump(-1)}>−</button>
          <span className="pagesnum">{sel.pages}</span>
          <button type="button" className="btn line sm" onClick={() => bump(1)}>+</button>
          <span className="hint">
            {sel.pages === 1 ? t('One long scrolling page') : `${sel.pages} ${t('separate pages')}`}
            {sel.pages > plan.pages ? ` · ${sel.pages - plan.pages} ${t('beyond the')} ${plan.name} ${t('plan')}` : ''}
          </span>
        </div>
      </div>
      <div className="f">
        <label className="lbl">{t('Extras you want quoted')}</label>
        <Addons />
      </div>
      <HintLine>
        {t('Tick what you need — it all shows up itemised on the plan and payment steps, nothing hidden.')}
      </HintLine>
    </>
  );
}
