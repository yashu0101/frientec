/* ---------------------------------------------------------------------------
   Everything the app loads once and shares: the catalogue, the trades, public
   settings, the admin session and its two tables, and the toast queue.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, getToken, setToken as persistToken } from '../api.js';

const AppContext = createContext(null);

export const PREMIUM_SLUG = 'premium';

/* Each design gets a slot — its position among the designs for its trade. The
   renderers start a design's photographs at an offset taken from the slot, so
   three clinics never all open on the same dental chair. Assigned from the live
   list rather than stored, so a design added in the admin gets a slot too. */
export function stampShots(list) {
  const seen = {};
  (list || []).forEach((d) => {
    seen[d.category] = seen[d.category] === undefined ? 0 : seen[d.category] + 1;
    d.shot = seen[d.category];
  });
  return list;
}

export function AppProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [demos, setDemos] = useState([]);
  const [settings, setSettings] = useState({});
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [token, setTokenState] = useState(getToken());
  const [booted, setBooted] = useState(false);
  const [bootError, setBootError] = useState('');
  const [toast, setToastState] = useState('');
  const toastTimer = useRef(0);

  const say = useCallback((message) => {
    setToastState(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(''), 2600);
  }, []);

  const setToken = useCallback((next) => {
    persistToken(next);
    setTokenState(next || '');
    if (!next) { setLeads([]); setProjects([]); }
  }, []);

  const loadLeads = useCallback(
    () => api('GET', '/leads').then(setLeads).catch(() => setToken('')),
    [setToken],
  );

  // The lead desk still works without the order table, so this one stays quiet.
  const loadProjects = useCallback(() => api('GET', '/projects').then(setProjects).catch(() => {}), []);

  useEffect(() => {
    api('GET', '/bootstrap')
      .then((data) => {
        setCategories(data.categories);
        setDemos(stampShots(data.demos));
        setSettings(data.settings);
        document.title = data.settings.brand + ' — professional websites for local businesses';
      })
      .catch((e) => setBootError(e.message))
      .finally(() => setBooted(true));
  }, []);

  useEffect(() => {
    if (!token) return;
    loadLeads();
    loadProjects();
  }, [token, loadLeads, loadProjects]);

  const value = useMemo(() => {
    const cat = (slug) => categories.find((c) => c.slug === slug);
    return {
      categories, demos, settings, leads, projects, token, booted, bootError, toast,
      say, setToken, setSettings, setDemos, setLeads, setProjects, loadLeads, loadProjects,
      cat,
      catName: (slug) => (cat(slug) ? cat(slug).name : slug),
      demoBySlug: (slug) => demos.find((d) => d.slug === slug),
      demoById: (id) => demos.find((d) => d.id === id),
      demosIn: (slug) => demos.filter((d) => d.category === slug && d.published),
      publishedDemos: () => demos.filter((d) => d.published),
      /* Premium is an editorial flag, not a category — a premium design still
         belongs to its trade and still appears under it. */
      premiumDemos: () => demos.filter((d) => d.premium && d.published),
      /* Both admin tables mutate one row at a time, so they get helpers rather
         than every screen reaching for the setter. */
      replaceLead: (lead) => setLeads((all) => all.map((l) => (l.id === lead.id ? lead : l))),
      dropLead: (id) => setLeads((all) => all.filter((l) => l.id !== id)),
      replaceProject: (p) => setProjects((all) => all.map((x) => (x.id === p.id ? p : x))),
      dropProject: (id) => setProjects((all) => all.filter((x) => x.id !== id)),
      replaceDemo: (demo) => setDemos((all) => stampShots(all.map((d) => (d.id === demo.id ? demo : d)))),
      addDemo: (demo) => setDemos((all) => stampShots([...all, demo])),
      dropDemo: (id) => setDemos((all) => stampShots(all.filter((d) => d.id !== id))),
    };
  }, [categories, demos, settings, leads, projects, token, booted, bootError, toast, say, setToken, loadLeads, loadProjects]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
