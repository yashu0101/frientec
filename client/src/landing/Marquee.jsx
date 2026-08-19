/* ---------------------------------------------------------------------------
   The scrolling word wall. Oversized ghost words behind everything — ours are
   the trades we actually build for, which turns a texture into a statement of
   coverage. The row is duplicated and the pair slides exactly one copy's width,
   so the loop has no seam.
--------------------------------------------------------------------------- */
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export default function Marquee() {
  const { categories } = useApp();
  const t = useT();
  const words = categories.map((c) => c.name.replace(/ *&.*$/, ''));
  if (!words.length) return null;

  const copy = (hidden) => (
    <div className="marq-copy" aria-hidden={hidden ? 'true' : undefined}>
      {words.map((w) => (
        <span key={w} style={{ display: 'contents' }}>
          <span>{t(w)}</span>
          <em aria-hidden="true">·</em>
        </span>
      ))}
    </div>
  );

  return (
    <section className="marq" aria-label="Trades we build for">
      <div className="marq-run">{copy(false)}{copy(true)}</div>
    </section>
  );
}
