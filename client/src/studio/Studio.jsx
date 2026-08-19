/* ---------------------------------------------------------------------------
   The studio shell: the band, the step bar, and whichever step is showing.

   A studio link for a design that no longer exists falls back to browsing —
   there is nothing to customise.
--------------------------------------------------------------------------- */
import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { StudioProvider, useStudio } from './StudioContext.jsx';
import { inr } from '../lib/format.js';
import { Paren } from '../components/StageHead.jsx';
import StepCustomise from './steps/StepCustomise.jsx';
import StepPlan from './steps/StepPlan.jsx';
import StepDomain from './steps/StepDomain.jsx';
import StepPay from './steps/StepPay.jsx';
import StepDone from './steps/StepDone.jsx';

const NAMES = ['Customise', 'Plan', 'Domain', 'Payment'];

function Band() {
  const { step, demo, order } = useStudio();
  const t = useT();
  return (
    <div className="worldband studio-band">
      <span className="wash" aria-hidden="true" />
      <div className="wrap wb-in">
        <Paren>{order ? 'Order placed' : `Step ${step} of 4`}</Paren>
        <div className="wb-title">{demo.name || t('Your website')}</div>
      </div>
    </div>
  );
}

function Stepper() {
  const { step, demo, q, gotoStep } = useStudio();
  const { catName } = useApp();
  const t = useT();

  return (
    <div className="studio-bar">
      <div className="wrap barin">
        <div className="bardesign">
          <span className="dot" style={{ background: demo.accent || '#0E7C5A' }} />
          <span className="bdname">{demo.name || ''}</span>
          <span className="mono dim hide-sm">{catName(demo.category)}</span>
        </div>
        <div className="stepdots">
          {NAMES.map((n, i) => {
            const num = i + 1;
            const state = step > num ? ' done' : step === num ? ' on' : '';
            return (
              <button key={n} type="button" className={'sd' + state} onClick={() => gotoStep(num)}>
                <span className="sdn">{step > num ? '✓' : num}</span>
                <span className="sdl">{t(n)}</span>
              </button>
            );
          })}
        </div>
        <div className="bartotal mono">
          {step > 1 ? `${t('Total')} ${inr(q.total)}` : t('Free to explore')}
        </div>
      </div>
    </div>
  );
}

function StudioBody() {
  const { step } = useStudio();

  if (step === 5) {
    return (
      <div id="studio" className="studio">
        <Band />
        <StepDone />
      </div>
    );
  }

  return (
    <div id="studio" className="studio">
      <Band />
      <Stepper />
      {step === 1 ? <StepCustomise /> : step === 2 ? <StepPlan /> : step === 3 ? <StepDomain /> : <StepPay />}
    </div>
  );
}

export default function Studio() {
  const { slug } = useParams();
  const { demos, demoBySlug } = useApp();

  if (demos.length && !demoBySlug(slug)) return <Navigate to="/designs" replace />;
  if (!demos.length) return <div className="boot">Loading the catalogue…</div>;

  /* Keyed by slug: opening a different design is a different project, not an
     edit of the one that was open. */
  return (
    <StudioProvider slug={slug} key={slug}>
      <StudioBody />
    </StudioProvider>
  );
}
