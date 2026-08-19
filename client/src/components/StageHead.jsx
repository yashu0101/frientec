/* ---------------------------------------------------------------------------
   Every page that is not the homepage opens on the same short dark band: a
   parenthetical label, a large title, a line of explanation. It is the
   homepage's stage cut down to a header, which is what makes the site feel like
   one site rather than a landing page bolted to an app.
--------------------------------------------------------------------------- */
import { useT } from '../i18n/I18nProvider.jsx';

export function Paren({ children }) {
  const t = useT();
  return <span className="paren">{typeof children === 'string' ? t(children) : children}</span>;
}

export function Underscored({ children }) {
  return <span className="usc mono">{String(children).toUpperCase().replace(/ /g, '_')}</span>;
}

export default function StageHead({ label, title, blurb, children }) {
  const t = useT();
  return (
    <section className="stagehead">
      <span className="wash" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />
      <div className="wrap sh-in">
        {label ? <Paren>{label}</Paren> : null}
        <h1 className="sh-title disp">{t(title)}</h1>
        {blurb ? <p className="sh-blurb">{t(blurb)}</p> : null}
        {children}
      </div>
    </section>
  );
}
