/* The studio's form vocabulary — one place, so nine panels stay short. */
import { useT } from '../i18n/I18nProvider.jsx';
import { useStudio } from './StudioContext.jsx';

export function Field({ k, label, ph, req, type }) {
  const { c, field, errors } = useStudio();
  const t = useT();
  return (
    <div className="f">
      <label className="lbl">
        {t(label)}{req ? <> <span className="req">*</span></> : null}
      </label>
      <input
        className={'in' + (errors[k] ? ' bad' : '')}
        type={type || 'text'}
        value={c[k] ?? ''}
        placeholder={ph ? t(ph) : ''}
        onChange={(e) => field(k, e.target.value)}
      />
      {errors[k] ? <div className="err">{t(errors[k])}</div> : null}
    </div>
  );
}

export function Area({ k, label, ph, rows }) {
  const { c, field } = useStudio();
  const t = useT();
  return (
    <div className="f">
      <label className="lbl">{t(label)}</label>
      <textarea
        className="in"
        rows={rows || 3}
        value={c[k] ?? ''}
        placeholder={ph ? t(ph) : ''}
        onChange={(e) => field(k, e.target.value)}
      />
    </div>
  );
}

/* A colour picker and its hex box, each writing the same key. */
export function SwatchRow({ k, label }) {
  const { c, field } = useStudio();
  const t = useT();
  return (
    <div className="f">
      <label className="lbl">{t(label)}</label>
      <div className="colorrow">
        <input className="colorin" type="color" value={c[k]} onChange={(e) => field(k, e.target.value)} />
        <input className="in mono-in" type="text" value={c[k]} spellCheck="false" onChange={(e) => field(k, e.target.value)} />
      </div>
    </div>
  );
}

export function PickRow({ k, label, opts }) {
  const { c, field } = useStudio();
  const t = useT();
  return (
    <div className="f">
      <label className="lbl">{t(label)}</label>
      <div className="picks">
        {opts.map(([val, title, note]) => (
          <button
            key={val}
            type="button"
            className={'pick' + (c[k] === val ? ' on' : '')}
            onClick={() => field(k, val)}
          >
            <span className="pt">{t(title)}</span>
            {note ? <span className="pd">{t(note)}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Check({ checked, onChange, children, className }) {
  return (
    <label className={'check' + (className ? ' ' + className : '')}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {' '}{children}
    </label>
  );
}

export function Panel({ id, num, title, hint, children }) {
  const { panel, setPanel } = useStudio();
  const t = useT();
  const open = panel === id;
  return (
    <section className={'pnl' + (open ? ' open' : '')}>
      <button type="button" className="phead" onClick={() => setPanel(open ? '' : id)}>
        <span className="pnum">{num}</span>
        <span className="ptitle">{t(title)}<em>{t(hint)}</em></span>
        <span className="pchev">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="pbody">{children}</div> : null}
    </section>
  );
}

export function HintLine({ children }) {
  return <div className="hintline">{children}</div>;
}
