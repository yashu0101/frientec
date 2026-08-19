import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { Field, Area } from '../Fields.jsx';

export default function Words() {
  const { c, setC } = useStudio();
  const t = useT();

  const setPoint = (i, v) =>
    setC((prev) => {
      const points = prev.points.slice();
      points[i] = v;
      return { ...prev, points };
    });

  return (
    <>
      <Field k="heroTitle" label="Main heading" ph={c.business || 'Your business name'} />
      <Area k="heroText" label="Line under the heading" ph="One sentence on what you do and who for." rows={2} />
      <div className="g2">
        <Field k="ctaLabel" label="Button text" ph="Book a table" />
        <Field k="ctaTitle" label="Closing band heading" ph="Ready to visit us?" />
      </div>
      <div className="f">
        <label className="lbl">{t('Three short selling points')}</label>
        <div className="g3">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              className="in"
              value={c.points[i] || ''}
              placeholder={`${t('Point')} ${i + 1}`}
              onChange={(e) => setPoint(i, e.target.value)}
            />
          ))}
        </div>
      </div>
      <div className="g2">
        <Field k="aboutTitle" label="About heading" ph="Why people come to us" />
        <Field k="servicesTitle" label="Services heading" ph={c.servicesLabel} />
      </div>
      <Area k="about" label="About text" ph="How you started, what you are known for." rows={4} />
      <Area k="ctaText" label="Closing band text" ph="Send us a message and we reply the same day." rows={2} />
      <div className="g2">
        <Field k="servicesLabel" label="Name for the services section" ph="Menu / Treatments / Packages" />
        <Field k="reviewsTitle" label="Reviews heading" ph="What customers say" />
      </div>
    </>
  );
}
