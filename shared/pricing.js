/* ---------------------------------------------------------------------------
   One quote function, imported by the React studio and by the Express API.

   The studio uses it to show a running total; the server uses it again when the
   order arrives, and stores its own answer. So a tampered price in a request
   body changes nothing — the number on the invoice is always computed here from
   settings.json.
--------------------------------------------------------------------------- */

const num = (n) => Math.max(0, Math.round(Number(n) || 0));

function findPlan(s, id) {
  const plans = s.plans || [];
  return plans.find((p) => p.id === id) || plans[0] || { id: 'starter', name: 'Starter', price: 0, pages: 1 };
}

function findTld(s, tld) {
  const list = s.domains || [];
  return list.find((t) => t.tld === tld) || list[0] || { tld: '.com', price: 0 };
}

function findHosting(s, id) {
  const list = s.hosting || [];
  return list.find((h) => h.id === id) || { id: 'none', name: 'No hosting', price: 0 };
}

/* sel = { planId, pages, addons:[id], extraLanguages, domain:{mode,name,tld,years,privacy}, hostingId } */
export function quote(sel, s) {
  sel = sel || {};
  s = s || {};
  const plan = findPlan(s, sel.planId);
  const lines = [];

  lines.push({
    key: 'plan',
    label: plan.name + ' plan',
    detail: 'Up to ' + plan.pages + (plan.pages === 1 ? ' page' : ' pages') + ' · ' + (plan.delivery || ''),
    amount: num(plan.price),
  });

  const wanted = Math.max(1, num(sel.pages) || plan.pages);
  const extra = Math.max(0, wanted - plan.pages);
  if (extra) {
    lines.push({
      key: 'pages',
      label: extra + ' extra ' + (extra === 1 ? 'page' : 'pages'),
      detail: 'Beyond the ' + plan.pages + ' in ' + plan.name,
      amount: num(extra * (s.extraPagePrice || 0)),
    });
  }

  // Languages beyond the primary one: each is a full translation pass, so it
  // is priced per language rather than as a single tick-box.
  const langs = Math.max(0, num(sel.extraLanguages));
  if (langs) {
    lines.push({
      key: 'languages',
      label: langs + ' extra ' + (langs === 1 ? 'language' : 'languages'),
      detail: 'Language switcher, translated pages, ' + (langs === 1 ? 'one' : langs) + ' extra version' + (langs === 1 ? '' : 's'),
      amount: num(langs * (s.extraLanguagePrice || 0)),
    });
  }

  const picked = Array.isArray(sel.addons) ? sel.addons : [];
  (s.addons || []).forEach((a) => {
    if (picked.indexOf(a.id) < 0) return;
    lines.push({ key: 'addon:' + a.id, label: a.name, detail: a.note || '', amount: num(a.price) });
  });

  const dom = sel.domain || {};
  if (dom.mode === 'new' && dom.name) {
    const t = findTld(s, dom.tld);
    const years = Math.min(5, Math.max(1, num(dom.years) || 1));
    lines.push({
      key: 'domain',
      label: 'Domain ' + String(dom.name).toLowerCase() + t.tld,
      detail: 'Registered in your name for ' + years + (years === 1 ? ' year' : ' years'),
      amount: num(t.price * years),
    });
    if (dom.privacy) {
      lines.push({
        key: 'privacy',
        label: 'Domain privacy',
        detail: 'Keeps your phone and address out of public WHOIS',
        amount: num(s.domainPrivacyPrice),
      });
    }
  }

  const host = findHosting(s, sel.hostingId);
  if (host.price) {
    lines.push({ key: 'hosting', label: host.name, detail: 'Server, SSL certificate and one business mailbox', amount: num(host.price) });
  }

  const subtotal = lines.reduce((t, l) => t + l.amount, 0);
  const gstPercent = Number(s.gstPercent) || 0;
  const gst = Math.round((subtotal * gstPercent) / 100);
  const total = subtotal + gst;
  const advancePercent = Number(s.advancePercent) || 100;
  const advance = Math.round((total * advancePercent) / 100);

  return {
    plan, lines, pages: wanted,
    subtotal, gstPercent, gst, total,
    advancePercent, advance, balance: total - advance,
  };
}

export default { quote };
