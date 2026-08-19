/* ---------------------------------------------------------------------------
   The slide-up panel every dialog in the app uses. Escape and a click on the
   backdrop both close it, and the page behind stops scrolling while it is open.
--------------------------------------------------------------------------- */
import { useEffect } from 'react';

export default function Sheet({ children, onClose, width }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div id="overlay">
      <div
        className="sheet"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="panel" style={width ? { maxWidth: `${width}px` } : undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SheetHead({ title, sub, onClose }) {
  return (
    <div className="head">
      <div>
        <h2 className="disp" style={{ fontSize: '21px', marginBottom: sub ? '4px' : 0 }}>{title}</h2>
        {sub ? <div className="mono dim">{sub}</div> : null}
      </div>
      <button type="button" className="x" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}
