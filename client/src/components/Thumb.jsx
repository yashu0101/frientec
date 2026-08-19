/* ---------------------------------------------------------------------------
   A miniature of the real page: nav bar, hero band, three content cards.

   The hero band carries the trade's photograph under the design's own colours,
   so a card in the catalogue previews what the design actually looks like rather
   than showing a coloured rectangle. No brand colour goes over the photograph —
   the only overlay is a neutral darkening at the top, because the miniature
   draws white bars over that band to stand in for the hero text.

   `photo` is the customer's own picture, when they have one. It is shown exactly
   as they uploaded it: the design's tint belongs on our stand-in art, not on a
   photograph of somebody's actual shop.
--------------------------------------------------------------------------- */
import { pickShot, thumbArt } from '../lib/format.js';
import { asset } from '../config.js';

export default function Thumb({ demo, height, photo, name }) {
  const d = demo || {};
  const dark = d.mode === 'dark';
  const bg = dark ? d.ink : '#fff';
  const fg = dark ? 'rgba(255,255,255,.86)' : d.ink;
  const soft = dark ? 'rgba(255,255,255,.14)' : 'rgba(16,24,32,.10)';
  const band = photo ? `url('${asset(photo)}')` : thumbArt(d.category, pickShot(d.shot, 0));

  return (
    <div className="thumb" style={{ background: bg, ...(height ? { height: `${height}px` } : null) }}>
      <div className="row">
        <div className="name" style={{ color: fg }}>{name || d.name}</div>
        <div className="navdots">
          {[26, 20, 22].map((w, i) => (
            <i key={i} style={{ width: `${w}px`, opacity: 0.42, background: fg }} />
          ))}
        </div>
      </div>
      <div
        className="band"
        style={{ backgroundImage: band, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="sheen" />
        <i style={{ width: '62%', height: '9px', opacity: 0.95 }} />
        <i style={{ width: '42%', height: '6px', opacity: 0.6 }} />
        <i style={{ width: '52px', height: '15px', borderRadius: '4px', marginTop: '3px' }} />
      </div>
      <div className="cards">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ border: `1px solid ${soft}` }}>
            <em style={{ background: d.accent, opacity: 0.24 - i * 0.04 }} />
            <i style={{ width: '80%', opacity: 0.75, background: fg }} />
            <i style={{ width: '55%', opacity: 0.35, background: fg }} />
          </div>
        ))}
      </div>
    </div>
  );
}
