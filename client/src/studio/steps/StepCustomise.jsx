import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { Panel } from '../Fields.jsx';
import AiPanel from '../panels/AiPanel.jsx';
import Business from '../panels/Business.jsx';
import Words from '../panels/Words.jsx';
import Look from '../panels/Look.jsx';
import Photos from '../panels/Photos.jsx';
import { Services, Reviews } from '../panels/Rows.jsx';
import Sections from '../panels/Sections.jsx';
import Languages from '../panels/Languages.jsx';
import Scope from '../panels/Scope.jsx';
import PreviewPane from '../PreviewPane.jsx';

export default function StepCustomise() {
  const { c, next, exit, saveDraftNow } = useStudio();
  const t = useT();

  return (
    <>
      <div className="studio-grid">
        <div className="editor">
          <div className="ehead">
            <h1>{t('Make it yours')}</h1>
            <p>{t('Every panel below changes the preview on the right. Nothing is sent anywhere until you place the order.')}</p>
          </div>
          <AiPanel />
          <Panel id="business" num="1" title="Your business" hint="Name, phone, address, hours"><Business /></Panel>
          <Panel id="words" num="2" title="Words on the page" hint="Headings, about text, selling points"><Words /></Panel>
          <Panel id="look" num="3" title="Colours & type" hint="Accent, background, typeface, corners, layout"><Look /></Panel>
          <Panel id="photos" num="4" title="Your photos" hint="Logo, main photo, gallery"><Photos /></Panel>
          <Panel id="services" num="5" title={c.servicesLabel || 'Services'} hint="Names, prices, descriptions"><Services /></Panel>
          <Panel id="reviews" num="6" title="Reviews" hint="What your customers said"><Reviews /></Panel>
          <Panel id="sections" num="7" title="Sections" hint="Turn parts of the page on and off"><Sections /></Panel>
          <Panel id="langs" num="8" title="Languages" hint="Hindi, Marathi, Tamil — a switcher on your site"><Languages /></Panel>
          <Panel id="scope" num="9" title="Pages & extras" hint="How big the site is, what it must do"><Scope /></Panel>
        </div>
        <PreviewPane />
      </div>

      <div className="studio-foot">
        <div className="ffacts">
          <button type="button" className="btn ghost sm" onClick={saveDraftNow}>{t('Save draft')}</button>
          <span className="mono dim">{t('Step 1 of 4 · nothing charged yet')}</span>
        </div>
        <div className="fbtns">
          <button type="button" className="btn line" onClick={exit}>{t('Back to designs')}</button>
          <button type="button" className="btn go" onClick={next}>{t('Continue to plans →')}</button>
        </div>
      </div>
    </>
  );
}
