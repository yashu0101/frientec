/* ---------------------------------------------------------------------------
   The shop's own language, not the customer's site language.

   The old app translated the finished DOM after every render. React owns the
   DOM now, so the same dictionary is used the other way round: components ask
   t('English copy') and get the current language back. Untranslated strings
   fall through to the English they were written with.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGS, hasLanguage, lookup } from './dict.js';

const I18nContext = createContext({ lang: 'en', setLang: () => {}, t: (s) => s, langs: LANGS });

const saved = () => {
  try {
    const code = localStorage.getItem('sf_lang');
    return code && hasLanguage(code) ? code : 'en';
  } catch {
    return 'en';
  }
};

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(saved);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((code) => {
    if (!hasLanguage(code)) return;
    setLangState(code);
    try { localStorage.setItem('sf_lang', code); } catch { /* private mode */ }
  }, []);

  const t = useCallback((s) => lookup(s, lang), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, langs: LANGS }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/* Sugar for the common case, so components read `const t = useT()`. */
export const useT = () => useContext(I18nContext).t;
