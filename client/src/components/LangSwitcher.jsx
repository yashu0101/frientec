import { useI18n } from '../i18n/I18nProvider.jsx';

/* Never translated — each button is already written in the language it selects. */
export default function LangSwitcher() {
  const { lang, setLang, langs } = useI18n();
  return (
    <div className="uilang">
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          className={'uil' + (l.code === lang ? ' on' : '')}
          onClick={() => setLang(l.code)}
          title={l.native}
          lang={l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
