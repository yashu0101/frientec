/* ---------------------------------------------------------------------------
   The depth engine, and the two bits of decoration that ride along with it.

   Pointer-driven tilt for cards and parallax for the hero scene. The pointer is
   not written straight to the transform: each frame the rendered value eases a
   fraction of the way toward the pointer, so a card trails the cursor instead of
   snapping to it — the movement reads as weight rather than jitter. Angles are
   deliberately shallow; the tilt should be noticed only once the pointer stops.

   One set of listeners on the document, installed once for the life of the app,
   so React re-rendering the cards underneath it changes nothing.
--------------------------------------------------------------------------- */
import { useEffect } from 'react';

const TILT = { card: 3.4, cat: 1.8, ease: 0.1, settle: 0.02 };

export const motionOk = () =>
  !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function installDepth() {
  if (!window.matchMedia || !window.requestAnimationFrame) return () => {};
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || !motionOk()) return () => {};

  let box = null;
  let scene = null;
  let loop = 0;
  const cur = { rx: 0, ry: 0, gx: 50, gy: 50, mx: 0, my: 0 };
  const tgt = { rx: 0, ry: 0, gx: 50, gy: 50, mx: 0, my: 0 };

  const clear = (el, vars) => {
    if (!el) return;
    vars.forEach((v) => el.style.removeProperty(v));
  };

  function dropBox() {
    if (!box) return;
    const t = box.querySelector('.tilt');
    if (t) { t.classList.remove('live'); clear(t, ['--rx', '--ry']); }
    clear(box.querySelector('.glare'), ['--gx', '--gy']);
    box = null;
    cur.rx = cur.ry = tgt.rx = tgt.ry = 0;
  }

  function dropScene() {
    if (!scene) return;
    scene.classList.remove('tracking');
    clear(scene, ['--mx', '--my']);
    scene = null;
    cur.mx = cur.my = tgt.mx = tgt.my = 0;
  }

  function aim(e) {
    if (box && !box.isConnected) box = null;
    if (scene && !scene.isConnected) scene = null;

    const nextBox = e.target && e.target.closest ? e.target.closest('.tiltbox') : null;
    if (nextBox !== box) {
      dropBox();
      box = nextBox;
      const t0 = box && box.querySelector('.tilt');
      if (t0) {
        t0.classList.add('live');
        // start from where it is, not from centre, so entering a card is smooth
        cur.gx = 50;
        cur.gy = 50;
      }
    }
    if (box) {
      const r = box.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      const max = box.querySelector('.cat-card') ? TILT.cat : TILT.card;
      tgt.ry = (px - 0.5) * 2 * max;
      tgt.rx = (0.5 - py) * 2 * max;
      tgt.gx = px * 100;
      tgt.gy = py * 100;
    }

    const nextScene = e.target && e.target.closest ? e.target.closest('.scene') : null;
    if (nextScene !== scene) {
      dropScene();
      scene = nextScene;
      if (scene) scene.classList.add('tracking');
    }
    if (scene) {
      const sr = scene.getBoundingClientRect();
      tgt.mx = Math.max(-1, Math.min(1, ((e.clientX - sr.left) / sr.width - 0.5) * 2));
      tgt.my = Math.max(-1, Math.min(1, ((e.clientY - sr.top) / sr.height - 0.5) * 2));
    }
  }

  function step() {
    loop = 0;
    let moving = false;
    ['rx', 'ry', 'gx', 'gy', 'mx', 'my'].forEach((k) => {
      const d = tgt[k] - cur[k];
      if (Math.abs(d) > TILT.settle) moving = true;
      cur[k] += d * TILT.ease;
    });

    if (box) {
      const t = box.querySelector('.tilt');
      if (t) {
        t.style.setProperty('--rx', cur.rx.toFixed(3) + 'deg');
        t.style.setProperty('--ry', cur.ry.toFixed(3) + 'deg');
      }
      const g = box.querySelector('.glare');
      if (g) {
        g.style.setProperty('--gx', cur.gx.toFixed(2) + '%');
        g.style.setProperty('--gy', cur.gy.toFixed(2) + '%');
      }
    }
    if (scene) {
      scene.style.setProperty('--mx', cur.mx.toFixed(4));
      scene.style.setProperty('--my', cur.my.toFixed(4));
    }
    if ((box || scene) && moving) start();
  }

  function start() { if (!loop) loop = requestAnimationFrame(step); }

  const onMove = (e) => { aim(e); start(); };
  const onDown = () => { dropBox(); dropScene(); };
  const onBlur = () => { dropBox(); dropScene(); };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('blur', onBlur);

  return () => {
    cancelAnimationFrame(loop);
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerdown', onDown);
    window.removeEventListener('blur', onBlur);
  };
}

export function useDepth() {
  useEffect(() => {
    try {
      return installDepth();
    } catch {
      return undefined; // the effect is decoration; the app comes first
    }
  }, []);
}

/* --- reveal on scroll -----------------------------------------------------
   Additive by construction: the class that hides a card is only ever applied by
   the same code that removes it, so a missing IntersectionObserver leaves the
   page fully visible instead of blank. Re-armed per route, and the first six
   cards are never hidden — they are above the fold. */
export function useReveal(key) {
  useEffect(() => {
    if (!window.IntersectionObserver || !motionOk()) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const sibs = el.parentNode ? el.parentNode.children : [el];
          const idx = Array.prototype.indexOf.call(sibs, el);
          el.style.animationDelay = `${(idx % 8) * 55}ms`;
          el.classList.remove('pre');
          el.classList.add('shown');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    );

    const boxes = Array.from(document.querySelectorAll('.tiltbox'));
    boxes.slice(6).forEach((el) => {
      el.classList.add('pre');
      io.observe(el);
    });

    return () => io.disconnect();
  }, [key]);
}

/* --- numbers that count themselves up ----------------------------------- */
export function useCountUp(deps) {
  useEffect(() => {
    if (!window.requestAnimationFrame || !motionOk()) return undefined;
    const frames = [];
    document.querySelectorAll('.stat[data-count]').forEach((el) => {
      const target = Number(el.getAttribute('data-count')) || 0;
      const prefix = el.getAttribute('data-prefix') || '';
      if (target <= 0) return;
      let startAt = null;
      const tick = (now) => {
        if (startAt === null) startAt = now;
        const t = Math.min(1, (now - startAt) / 600);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = prefix + Math.round(target * eased).toLocaleString('en-IN');
        if (t < 1) frames.push(requestAnimationFrame(tick));
      };
      frames.push(requestAnimationFrame(tick));
    });
    return () => frames.forEach(cancelAnimationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
