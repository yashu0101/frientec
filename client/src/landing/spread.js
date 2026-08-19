/* Designs to feature, spread across trades rather than taken in file order —
   six cards from six different businesses says "catalogue", six restaurants
   says "we only do restaurants". */
export function spread(demos, n) {
  const published = (demos || []).filter((d) => d.published);
  const byCat = {};
  const order = [];
  const out = [];
  published.forEach((d) => {
    if (!byCat[d.category]) { byCat[d.category] = []; order.push(d.category); }
    byCat[d.category].push(d);
  });
  for (let round = 0; out.length < n && round < 4; round += 1) {
    for (let i = 0; i < order.length && out.length < n; i += 1) {
      const d = byCat[order[i]][round];
      if (d) out.push(d);
    }
  }
  return out;
}

export const CALM = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
