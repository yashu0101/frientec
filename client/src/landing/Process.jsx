/* ---------------------------------------------------------------------------
   The pinned process. The steps do not scroll past you — they change while a
   scene holds still behind them. A tall section with a sticky inner panel, and
   the step index read off scroll progress.

   If the section is off-screen or the effect never runs, all four steps are
   simply visible and readable: the pinning is an enhancement, not the content.
--------------------------------------------------------------------------- */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { artOf } from '../lib/format.js';
import { Paren } from '../components/StageHead.jsx';
import { spread, CALM } from './spread.js';

const STEPS = [
  ['Pick a design', 'Open the designs written for your trade and view them full-screen, on a phone if you like. Nothing is a placeholder — what you see is what gets built.'],
  ['Make it yours', 'Your name, your words, your photos, your colours. The studio previews it live as you type, so you approve a real page rather than a promise.'],
  ['Choose a plan', 'One page or ten, extra languages, a domain and hosting if you need them. The price adds up in front of you before you commit to anything.'],
  ['Go live', 'We put your content in, connect the domain, set up Google, and hand over the keys. Usually inside a week, with one number to text afterwards.'],
];

export default function Process() {
  const { demos } = useApp();
  const t = useT();
  const secRef = useRef(null);
  const [at, setAt] = useState(0);
  const n = STEPS.length;

  const plates = useMemo(() => spread(demos, 4), [demos]);

  /* Step index from how far the pinned section has travelled. Read inside a
     rAF so a fast scroll cannot queue up a hundred layout reads. */
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return undefined;
    let queued = false;

    const measure = () => {
      queued = false;
      const box = sec.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.max(0, Math.min(0.9999, -box.top / travel));
      setAt(Math.floor(p * n));
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    measure();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [n]);

  /* Clicking a step scrolls to where that step becomes the active one, so the
     list works as navigation and not only as a read-out. */
  const jump = (idx) => {
    const sec = secRef.current;
    if (!sec) return;
    const travel = sec.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    window.scrollTo({ top: sec.offsetTop + travel * ((idx + 0.5) / n), behavior: CALM() ? 'auto' : 'smooth' });
  };

  return (
    <section className="proc" id="proc" ref={secRef}>
      <div className="proc-pin">
        <div className="wrap proc-in">
          <div className="proc-copy">
            <Paren>How it works</Paren>
            <h2 className="sec disp">{t('Four steps, and one of them is ours')}</h2>
            <ol className="steps">
              {STEPS.map(([title, body], i) => (
                <li key={title} className={'step' + (i === at ? ' on' : '')} onClick={() => jump(i)}>
                  <span className="num mono">0{i + 1}</span>
                  <div className="step-b">
                    <h3>{t(title)}</h3>
                    <p>{t(body)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="proc-rail">
              <span className="proc-fill" style={{ width: `${Math.round(((at + 1) / n) * 100)}%` }} />
            </div>
          </div>
          {/* Plates at four depths on a perspective root, each tied to a step,
              lifting forward as its step becomes the active one. */}
          <div className="proc-scene" aria-hidden="true">
            {plates.map((d, i) => (
              <i
                key={d.slug}
                className={'pl' + (i === at ? ' on' : '')}
                style={{
                  backgroundImage: `url('${artOf(d)}')`,
                  '--pz': `${-260 + i * 70}px`,
                  '--px': `${i * 9 - 12}%`,
                  '--py': `${i * 11 - 14}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
