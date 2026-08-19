/* ---------------------------------------------------------------------------
   The brand split down the middle with the mark in the gap, thrown to the full
   width of the viewport. Any brand name works — the split lands on a real seam
   when the name has one (an internal capital, a space or a hyphen) and only
   falls back to the midpoint when it does not. A name with no seam at all
   needs an entry in SEAMS — "Frientec" is friend + tech, so it breaks FRIEN·TEC
   rather than at the midpoint,
   because the midpoint would cut it mid-syllable — SHOPF·RONT is the kind of
   detail that makes an otherwise expensive-looking page read as automated.
--------------------------------------------------------------------------- */
const SEAMS = { shopfront: 4, frientec: 5 };

export default function Wordmark({ brand }) {
  const b = String(brand || 'Frientec');
  const seam = b.slice(1).search(/[A-Z]/);
  let at = seam >= 0 ? seam + 1 : /[ -]/.test(b) ? b.search(/[ -]/) : Math.floor(b.length / 2);
  if (SEAMS[b.toLowerCase()]) at = SEAMS[b.toLowerCase()];

  return (
    <h1 className="wordmark">
      <span className="wm-a">{b.slice(0, at).trim()}</span>
      <span className="wm-mk" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="currentColor">
          <rect width="16" height="3" rx="1" />
          <rect y="6" width="7" height="7" rx="1.5" />
          <rect x="9" y="6" width="7" height="7" rx="1.5" opacity=".55" />
        </svg>
      </span>
      <span className="wm-b">{b.slice(at).trim()}</span>
    </h1>
  );
}
