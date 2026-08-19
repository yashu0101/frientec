/* ---------------------------------------------------------------------------
   The live preview.

   An iframe, so the customer's site gets a clean CSS scope and cannot be styled
   by the catalogue's stylesheet. It is rendered at a real desktop width and
   scaled down to fit the column, so what they see is the actual layout rather
   than a narrow one.

   The document is rebuilt on a trailing debounce — typing repaints once you stop,
   not once per keystroke — and the frame's scroll position is carried across the
   swap so the page does not jump back to the top while you edit its footer.
--------------------------------------------------------------------------- */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../i18n/I18nProvider.jsx';
import { useStudio } from './StudioContext.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { renderCustom } from '../lib/renderCustom.js';
import { openHtmlInTab } from '../lib/images.js';

const DEBOUNCE = 380;

export default function PreviewPane() {
  const { c, demo, device, setDevice, slug, say } = useStudio();
  const { openPreview } = useUI();
  const t = useT();

  const stageRef = useRef(null);
  const scalerRef = useRef(null);
  const frameRef = useRef(null);
  const [scaleLabel, setScaleLabel] = useState('');

  const html = useDebounced(() => renderCustom(demo, c), [c, demo], DEBOUNCE);

  /* Rendered at 1240 (or 390 for a phone) and scaled to whatever room the column
     has. scale() does not change the laid-out width, so the offset is applied by
     hand to keep it centred. */
  const fit = useCallback(() => {
    const stage = stageRef.current;
    const scaler = scalerRef.current;
    const frame = frameRef.current;
    if (!stage || !scaler || !frame) return;

    const wide = device === 'desktop';
    const w = wide ? 1240 : 390;
    const h = 1500;
    frame.style.width = `${w}px`;
    frame.style.height = `${h}px`;

    const avail = stage.clientWidth;
    const k = Math.min(1, avail / w);
    scaler.style.width = `${w}px`;
    scaler.style.height = `${h}px`;
    scaler.style.transform = `scale(${k.toFixed(4)})`;
    scaler.style.marginLeft = `${Math.max(0, Math.round((avail - w * k) / 2))}px`;
    stage.style.height = `${Math.round(h * k)}px`;
    setScaleLabel(wide ? `${Math.round(k * 100)}% of ${w}px` : 'Phone · 390px');
  }, [device]);

  useLayoutEffect(() => {
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [fit]);

  // keep the reader where they were across a repaint
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let y = 0;
    try { y = frame.contentWindow ? frame.contentWindow.scrollY : 0; } catch { y = 0; }
    frame.onload = () => {
      try { if (y) frame.contentWindow.scrollTo(0, y); } catch { /* cross-doc timing */ }
    };
    frame.srcdoc = html;
  }, [html]);

  return (
    <aside className="preview">
      <div className="pv-head">
        <div className="seg2">
          <button type="button" className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>
            {t('Desktop')}
          </button>
          <button type="button" className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>
            {t('Phone')}
          </button>
        </div>
        <div className="pv-meta">
          <span className="pv-scale mono">{scaleLabel}</span>
          <button
            type="button"
            className="linkbtn"
            onClick={() => { if (!openHtmlInTab(renderCustom(demo, c))) say(t('Your browser blocked the new tab.')); }}
          >
            {t('Open full size ↗')}
          </button>
          <button type="button" className="linkbtn" onClick={() => openPreview(slug)}>
            {t('See the original design')}
          </button>
        </div>
      </div>
      <div className="pv-stage" ref={stageRef}>
        <div className="pv-scaler" ref={scalerRef}>
          <iframe id="pv" title="Your website preview" ref={frameRef} />
        </div>
      </div>
      <div className="pv-foot mono">{t('Live preview · your content, your colours')}</div>
    </aside>
  );
}

/* Trailing debounce over a computed value. The first value is produced straight
   away, so the preview is never blank on the way in. */
function useDebounced(compute, deps, wait) {
  const [value, setValue] = useState(compute);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    const id = setTimeout(() => setValue(compute()), wait);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}
