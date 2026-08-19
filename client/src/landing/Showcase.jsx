/* ---------------------------------------------------------------------------
   The turning box. Six designs on the six faces of a box that turns on two
   axes; the faces are real catalogue art, and clicking the box opens the design
   currently facing you.

   The box turns by itself; a drag turns it faster and in your direction. The
   click that opens a design is suppressed if the pointer travelled, so a drag
   never navigates.
--------------------------------------------------------------------------- */
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { artOf } from '../lib/format.js';
import { Paren, Underscored } from '../components/StageHead.jsx';
import { spread, CALM } from './spread.js';

const FACES = ['fr', 'bk', 'rt', 'lf', 'tp', 'bt'];

/* Which face is pointing at the viewer, from the rotation alone — cheaper and
   steadier than reading six transformed bounding boxes every frame. */
function frontIndex(spin) {
  const x = ((spin.x % 360) + 360) % 360;
  if (x > 45 && x < 135) return 5;    /* tipped back — bottom up */
  if (x > 225 && x < 315) return 4;   /* tipped forward — top up */
  const y = ((spin.y % 360) + 360) % 360;
  if (y < 45 || y >= 315) return 0;
  if (y < 135) return 3;
  if (y < 225) return 1;
  return 2;
}

export default function Showcase() {
  const { demos, categories } = useApp();
  const { openPreview } = useUI();
  const t = useT();
  const navigate = useNavigate();
  const cubeRef = useRef(null);
  const spin = useRef({ x: -18, y: 24 });

  const six = useMemo(() => {
    let s = spread(demos, 6);
    if (s.length && s.length < 6) s = s.concat(s).slice(0, 6);
    return s;
  }, [demos]);

  const facing = useRef(six);
  facing.current = six;

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube || !six.length) return undefined;

    const apply = () => {
      cube.style.transform = `rotateX(${spin.current.x}deg) rotateY(${spin.current.y}deg)`;
    };
    apply();

    let drag = null;
    let moved = 0;
    let timer = 0;

    if (!CALM()) {
      timer = setInterval(() => {
        if (drag) return;
        spin.current.y += 0.22;
        apply();
      }, 16);
    }

    const open = () => {
      const d = facing.current[frontIndex(spin.current)];
      if (d) openPreview(d.slug);
    };

    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY, sx: spin.current.x, sy: spin.current.y };
      moved = 0;
      cube.setPointerCapture(e.pointerId);
      cube.classList.add('grabbing');
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      spin.current.y = drag.sy + dx * 0.4;
      spin.current.x = Math.max(-70, Math.min(70, drag.sx - dy * 0.4));
      apply();
    };
    const onUp = () => {
      drag = null;
      cube.classList.remove('grabbing');
      if (moved > 6) return;   /* that was a drag, not a click */
      open();
    };
    const onKey = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      open();
    };

    cube.addEventListener('pointerdown', onDown);
    cube.addEventListener('pointermove', onMove);
    cube.addEventListener('pointerup', onUp);
    cube.addEventListener('keydown', onKey);

    return () => {
      clearInterval(timer);
      cube.removeEventListener('pointerdown', onDown);
      cube.removeEventListener('pointermove', onMove);
      cube.removeEventListener('pointerup', onUp);
      cube.removeEventListener('keydown', onKey);
    };
  }, [six, openPreview]);

  if (!six.length) return null;

  return (
    <section className="showcase">
      <div className="wrap sc-in">
        <div className="sc-copy">
          <Paren>The catalogue</Paren>
          <h2 className="sec disp">{t('Fifty-one designs, turned to the light')}</h2>
          <p className="muted">
            {t('Every face of this is a real design from the catalogue — not a mockup drawn for the homepage. Click it and the one facing you opens full-screen, exactly as your customer would see it on their phone.')}
          </p>
          <div className="sc-stats">
            <Underscored>{demos.length} designs</Underscored>
            <Underscored>{categories.length} trades</Underscored>
            <Underscored>live in 7 days</Underscored>
          </div>
          <button type="button" className="btn go" onClick={() => navigate('/designs')}>
            {t('Open the catalogue →')}
          </button>
        </div>
        <div className="sc-box">
          <div
            className="cube"
            id="cube"
            ref={cubeRef}
            role="button"
            tabIndex={0}
            aria-label="Turning showcase — opens the design facing you"
          >
            {FACES.map((f, i) => (
              <span
                key={f}
                className={`face ${f}`}
                style={{ backgroundImage: `url('${artOf(six[i])}')` }}
              >
                <em>{six[i].name}</em>
              </span>
            ))}
          </div>
          <span className="cube-floor" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
