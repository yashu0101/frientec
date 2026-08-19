import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio, AI_EXAMPLES } from '../StudioContext.jsx';

export default function AiPanel() {
  const { ai, setAi, runAI } = useStudio();
  const t = useT();
  const a = ai;

  return (
    <section className={'aipanel' + (a.busy ? ' busy' : '')}>
      <div className="aihead">
        <span className="aibadge">✦ AI</span>
        <div>
          <h2>{t('Describe your business. We write the page.')}</h2>
          <p>
            {t('A couple of lines is enough — name, what you do, where you are, anything you are known for. It fills in every panel below, and you edit whatever you want after.')}
          </p>
        </div>
      </div>

      <textarea
        className="in aibrief"
        rows="4"
        disabled={a.busy}
        value={a.brief}
        placeholder={t('Spice Junction — pure veg family restaurant on FC Road, Pune. Open since 2011, known for our paneer tikka and Sunday thali.')}
        onChange={(e) => setAi((prev) => ({ ...prev, brief: e.target.value }))}
      />

      <div className="airow">
        <button type="button" className="btn go" disabled={a.busy} onClick={runAI}>
          {a.busy ? <><span className="spin" /> {t('Writing your page…')}</> : <>✦ {t('Generate my page')}</>}
        </button>
        {a.brief && !a.busy ? (
          <button type="button" className="btn line" onClick={() => setAi((prev) => ({ ...prev, brief: '', note: '' }))}>
            {t('Clear')}
          </button>
        ) : null}
        <span className="aihint">{t('Nothing is saved or ordered by this — it only fills the form.')}</span>
      </div>

      {a.brief || a.note ? null : (
        <div className="aiex">
          <span className="mono dim">{t('Try one')}</span>
          {AI_EXAMPLES.map((x, i) => (
            <button
              key={i}
              type="button"
              className="chip2"
              onClick={() => setAi((prev) => ({ ...prev, brief: AI_EXAMPLES[i] }))}
            >
              {x.split(/[—,.]/)[0].trim()}
            </button>
          ))}
        </div>
      )}

      {a.note ? (
        <div className={'ainote' + (a.by === 'local' ? ' local' : '')}>
          <strong>{a.by === 'claude' ? t('Claude wrote this draft.') : t('Written offline.')}</strong> {a.note}
        </div>
      ) : null}
    </section>
  );
}
