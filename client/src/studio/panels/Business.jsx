import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { Field } from '../Fields.jsx';

export default function Business() {
  const { c, categories, errors, setCategory } = useStudio();
  const t = useT();
  return (
    <>
      <div className="g2">
        <Field k="business" label="Business name" ph="Spice Junction" req />
        <Field k="owner" label="Your name" ph="Rohit Kulkarni" req />
      </div>
      <div className="g2">
        <Field k="phone" label="Phone" ph="98765 43210" req />
        <Field k="whatsapp" label="WhatsApp number" ph="98765 43210" req />
      </div>
      <div className="g2">
        <Field k="city" label="City" ph="Pune" req />
        <div className="f">
          <label className="lbl">{t('Business category')} <span className="req">*</span></label>
          <select
            className={'in' + (errors.category ? ' bad' : '')}
            value={c.category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((x) => <option key={x.slug} value={x.slug}>{t(x.name)}</option>)}
          </select>
        </div>
      </div>
      <Field k="address" label="Shop / clinic address" ph="12 FC Road, Shivajinagar" />
      <div className="g2">
        <Field k="hours" label="Opening hours" ph="Mon – Sat · 10 am – 8 pm" />
        <Field k="email" label="Email" ph="you@example.com" type="email" />
      </div>
      <div className="g2">
        <Field k="instagram" label="Instagram" ph="@yourbusiness" />
        <Field k="website" label="Current website, if any" ph="yourbusiness.com" />
      </div>
      <div className="g2">
        <Field k="ownerRole" label="Your title on the page" ph="Owner" />
        <Field k="eyebrow" label="Small line above the heading" ph="Since 2011 · Pune" />
      </div>
    </>
  );
}
