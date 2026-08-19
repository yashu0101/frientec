/* ---------------------------------------------------------------------------
   Everything between "I like this design" and "order placed".

     step 1  Customise   your details, words, colours, fonts, photos, sections
     step 2  Plan        plans priced for this project, plus the dynamic-site note
     step 3  Domain      name, extension, years — checked on GoDaddy
     step 4  Payment     one itemised total, advance, order placed

   One store for the whole flow, so the preview, the rail and the step bar can
   never disagree about what has been chosen.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { api } from '../api.js';
import { quote as priceQuote } from '@shared/pricing.js';
import { isSample, sampleImage, slugify } from '../lib/format.js';
import { pack, guessCategory, guessCity } from './packs.js';
import {
  freshState, saveDraft, loadDraft, clearDraft,
  validateCustomise, validateDomain, validatePayment, localDraft,
} from './state.js';

const StudioContext = createContext(null);

export const AI_EXAMPLES = [
  'Spice Junction — pure veg family restaurant on FC Road, Pune. Open since 2011, famous for our paneer tikka and Sunday thali. Home delivery within 5 km.',
  'SmileWell Dental, Nashik. Two dentists, root canals in a single sitting, braces and implants. Cashless insurance, open 9 to 8.',
  'Patil Fabricators, Pimpri. CNC machining and sheet metal work for auto parts. ISO certified, we take bulk orders across India.',
];

export function StudioProvider({ slug, children }) {
  const app = useApp();
  const { settings, categories, demoBySlug, say, loadLeads, loadProjects } = app;
  const navigate = useNavigate();
  const demo = demoBySlug(slug) || {};

  const [state, setState] = useState(() => freshState(demo, settings, categories));
  const [step, setStep] = useState(1);
  const [panel, setPanel] = useState('business');
  const [device, setDevice] = useState('desktop');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [wantsDynamic, setWantsDynamic] = useState(false);
  const [ai, setAi] = useState({ brief: '', busy: false, note: '', by: '', translating: '' });
  const restored = useRef(false);

  const { c, sel, payment } = state;

  /* A saved draft is picked up once, on the way in. */
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadDraft(slug);
    if (!draft) return;
    setState((s) => ({ ...s, c: { ...s.c, ...draft.c }, sel: { ...s.sel, ...(draft.sel || {}) } }));
    setTimeout(() => say('Picked up your saved draft. Photos need adding again.'), 400);
  }, [slug, say]);

  const setC = useCallback((patch) => {
    setState((s) => ({ ...s, c: typeof patch === 'function' ? patch(s.c) : { ...s.c, ...patch } }));
  }, []);

  const setSel = useCallback((patch) => {
    setState((s) => ({ ...s, sel: typeof patch === 'function' ? patch(s.sel) : { ...s.sel, ...patch } }));
  }, []);

  const setPayment = useCallback((patch) => {
    setState((s) => ({ ...s, payment: { ...s.payment, ...patch } }));
  }, []);

  const field = useCallback((key, value) => setC({ [key]: value }), [setC]);

  /* Extra languages are priced per language, so the selection and the quote are
     kept in step here rather than in the panel that edits them. */
  const setLanguages = useCallback((languages) => {
    setState((s) => ({
      ...s,
      c: { ...s.c, languages },
      sel: { ...s.sel, extraLanguages: Math.max(0, languages.length - 1) },
    }));
  }, []);

  /* Stand-in photos follow the trade, so a salon never shows a factory. The
     captions are trade-specific too and follow — unless the customer has already
     written their own over the top. */
  const setCategory = useCallback((next) => {
    setState((s) => {
      const c2 = { ...s.c, category: next };
      if (s.c.sampleImages) {
        if (isSample(s.c.hero)) c2.hero = sampleImage(next, 'hero');
        c2.gallery = s.c.gallery.map((src, i) => (isSample(src) ? sampleImage(next, (i % 5) + 1) : src));
        const starter = pack(next).shots || [];
        c2.galleryMeta = (s.c.galleryMeta || []).map((m, i) => {
          const untouched = !m || (!m.edited && starter[i]);
          return untouched && starter[i] ? { title: starter[i].title, desc: starter[i].desc } : m;
        });
      }
      return { ...s, c: c2 };
    });
  }, []);

  const q = useMemo(() => priceQuote(sel, settings), [sel, settings]);

  const planById = useCallback(
    (id) => (settings.plans || []).find((p) => p.id === id) || (settings.plans || [])[0] || { id: 'starter', pages: 1 },
    [settings.plans],
  );

  const fullDomain = useMemo(() => {
    const d = sel.domain;
    if (d.mode === 'own') return String(d.own || '').trim().toLowerCase();
    const name = slugify(d.name);
    return name ? name + d.tld : ''; // a bare ".com" in the summary helps nobody
  }, [sel.domain]);

  /* --- navigation between steps ------------------------------------------ */
  const next = useCallback(() => {
    if (step === 1) {
      const e = validateCustomise(c);
      if (Object.keys(e).length) {
        setErrors(e);
        if (e.business || e.owner || e.phone || e.whatsapp || e.city || e.category) setPanel('business');
        say('A few details are still needed before we can price this.');
        return;
      }
    }
    if (step === 3) {
      const e = validateDomain(sel);
      if (Object.keys(e).length) { setErrors(e); say('Sort the domain out first.'); return; }
    }
    setErrors({});
    const to = Math.min(4, step + 1);
    if (to === 3 && !sel.domain.name) setSel((s) => ({ ...s, domain: { ...s.domain, name: slugify(c.business) } }));
    setStep(to);
    window.scrollTo(0, 0);
    try { saveDraft(slug, c, sel); } catch { /* private mode */ }
  }, [step, c, sel, say, setSel, slug]);

  const back = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo(0, 0);
  }, []);

  const gotoStep = useCallback((want) => {
    // forward only through Continue, so validation always runs
    setStep((current) => (want > current ? current : want));
    setErrors({});
    window.scrollTo(0, 0);
  }, []);

  /* --- AI ---------------------------------------------------------------- */
  const applyDraft = useCallback((site) => {
    setState((s) => {
      const c2 = { ...s.c };
      const set = (k, v) => { if (v !== undefined && v !== null && String(v).length) c2[k] = v; };

      // Contact details are the customer's, never the model's — only fill blanks.
      if (!String(c2.business || '').trim()) set('business', site.business);
      else if (site.business && site.business !== c2.business) set('business', site.business);
      if (!String(c2.city || '').trim()) set('city', guessCity(site.eyebrow || ''));

      if (site.category && categories.some((x) => x.slug === site.category)) c2.category = site.category;

      ['eyebrow', 'heroTitle', 'heroText', 'ctaLabel', 'aboutTitle', 'about',
        'servicesLabel', 'servicesTitle', 'ctaTitle', 'ctaText', 'hours',
        'accent', 'mode', 'font', 'radius', 'layout'].forEach((k) => set(k, site[k]));

      if (Array.isArray(site.points) && site.points.length) c2.points = site.points.slice(0, 3);
      if (Array.isArray(site.services) && site.services.length) {
        c2.services = site.services.map((x) => ({ name: x.name || '', desc: x.desc || '', price: x.price || '' }));
      }
      if (Array.isArray(site.reviews) && site.reviews.length) {
        c2.reviews = site.reviews.map((r) => ({ text: r.text || '', author: r.author || '' }));
      }
      return { ...s, c: c2 };
    });
  }, [categories]);

  const runAI = useCallback(async () => {
    const brief = String(ai.brief || '').trim();
    if (ai.busy) return;
    if (brief.length < 15) { say('Give it a bit more — a sentence or two about the business.'); return; }

    setAi((a) => ({ ...a, busy: true, note: '' }));

    const finish = (site, by, note) => {
      applyDraft(site);
      setAi((a) => ({ ...a, busy: false, by, note: note || site.note || '' }));
      setPanel('business');
      window.scrollTo(0, 0);
      say(by === 'claude' ? 'Draft written. Check the details and edit anything.' : 'Draft assembled on this device.');
    };

    try {
      const out = await api('POST', '/ai/describe', {
        brief,
        hints: { city: c.city, category: c.category, design: `${demo.name || ''} — ${demo.style || ''}` },
      });
      finish(out.site, out.by || 'claude');
    } catch (err) {
      if (err.body && err.body.fallback) {
        // No key, or the service could not be reached — write it here instead.
        const draft = localDraft(brief, { demo, c, categoryOf: guessCategory });
        finish(draft, 'local', draft.note);
        return;
      }
      // A real answer we should respect: a refusal, or the throttle.
      setAi((a) => ({ ...a, busy: false }));
      say(err.message);
    }
  }, [ai.brief, ai.busy, applyDraft, c, demo, say]);

  /* Ask for one language at a time — the customer sees each one land, and a
     failure costs them one language rather than all of them. */
  const runTranslate = useCallback(async (code, langs) => {
    if (ai.translating) return;
    const lang = langs.find((l) => l.code === code);
    if (!lang) return;

    const base = {
      heroTitle: c.heroTitle || c.business, heroText: c.heroText,
      ctaLabel: c.ctaLabel, aboutTitle: c.aboutTitle, about: c.about,
      servicesTitle: c.servicesTitle, galleryTitle: c.galleryTitle,
      reviewsTitle: c.reviewsTitle, visitTitle: c.visitTitle,
      ctaTitle: c.ctaTitle, ctaText: c.ctaText,
      point0: c.points[0], point1: c.points[1], point2: c.points[2],
    };

    setAi((a) => ({ ...a, translating: code }));
    try {
      const out = await api('POST', '/ai/translate', { fields: base, language: lang.name });
      setC((prev) => ({ ...prev, i18n: { ...prev.i18n, [code]: { ...prev.i18n[code], ...(out.fields || {}) } } }));
      say(`${lang.native} filled in. Read it over before you order.`);
    } catch (err) {
      say(err.message);
    } finally {
      setAi((a) => ({ ...a, translating: '' }));
    }
  }, [ai.translating, c, say, setC]);

  /* --- submit ------------------------------------------------------------ */
  const submit = useCallback(async () => {
    const e = validatePayment(c, payment);
    if (Object.keys(e).length) { setErrors(e); say('Check the highlighted fields.'); return; }

    setSubmitting(true);
    try {
      const placed = await api('POST', '/projects', {
        demo: slug,
        demoName: demo.name,
        customer: {
          owner: c.owner, business: c.business, phone: c.phone, whatsapp: c.whatsapp,
          email: c.email, city: c.city, category: c.category,
          address: c.address, instagram: c.instagram, website: c.website,
        },
        customisation: c,
        selection: sel,
        payment: { method: payment.method },
        wantsDynamic,
      });
      setOrder(placed);
      setStep(5);
      clearDraft(slug);
      window.scrollTo(0, 0);
      if (app.token) { loadLeads(); loadProjects(); }
    } catch (err) {
      say(err.message || 'Could not place the order.');
    } finally {
      setSubmitting(false);
    }
  }, [c, payment, sel, slug, demo.name, wantsDynamic, say, app.token, loadLeads, loadProjects]);

  const value = useMemo(() => ({
    slug, demo, settings, categories, c, sel, payment, q, step, panel, device, errors,
    submitting, order, wantsDynamic, ai, fullDomain,
    setC, setSel, setPayment, field, setLanguages, setCategory, setPanel, setDevice,
    setErrors, setWantsDynamic, setAi, planById,
    next, back, gotoStep, submit, runAI, runTranslate, say,
    saveDraftNow: () => {
      try { saveDraft(slug, c, sel); say('Draft saved on this device. Photos are not saved — re-add them if you come back.'); }
      catch { say('Could not save the draft in this browser.'); }
    },
    exit: () => navigate(`/designs/${demo.category || ''}`),
  }), [
    slug, demo, settings, categories, c, sel, payment, q, step, panel, device, errors,
    submitting, order, wantsDynamic, ai, fullDomain, setC, setSel, setPayment, field,
    setLanguages, setCategory, planById, next, back, gotoStep, submit, runAI, runTranslate, say, navigate,
  ]);

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export const useStudio = () => useContext(StudioContext);
