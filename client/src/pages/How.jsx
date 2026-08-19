import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/I18nProvider.jsx';
import StageHead from '../components/StageHead.jsx';

const STEPS = [
  ['You browse', 'Open your trade — restaurants, clinics, salons and fourteen more. Each design opens full-screen with real sections: menu, prices, timings, map, reviews.'],
  ['You choose', "Hit 'I want this website'. The design you picked is attached to your request automatically, so there is no confusion later about which one you meant."],
  ['We call you', 'Within one working day. We ask what pages you need, whether you want booking or payments, and send a fixed quote.'],
  ['You send content', 'Logo, photos, prices, timings. If you do not have photos, we will tell you exactly what to shoot on your phone.'],
  ['We build and launch', 'Five to seven working days. We connect your domain, set up Google, and walk you through it on a call.'],
  ['We stay reachable', 'One WhatsApp number for changes. New menu, new prices, new offer — send it across.'],
];

export default function How() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <>
      <StageHead
        label="How it works"
        title="How it works"
        blurb="This is not a website builder. You do not drag anything. You pick a finished design and we do the rest."
      />
      <div className="wrap narrow" style={{ padding: '44px 0 70px' }}>
        {STEPS.map(([title, body], i) => (
          <div
            key={title}
            style={{
              display: 'grid', gridTemplateColumns: '60px 1fr', gap: '18px',
              paddingBottom: '26px', marginBottom: '26px', borderBottom: '1px solid var(--line)',
            }}
          >
            <div className="mono" style={{ color: 'var(--go)', paddingTop: '4px' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '19px', marginBottom: '7px' }}>{t(title)}</div>
              <div className="muted" style={{ lineHeight: 1.7 }}>{t(body)}</div>
            </div>
          </div>
        ))}
        <button type="button" className="btn go" onClick={() => navigate('/designs')}>
          {t('Explore website designs →')}
        </button>
      </div>
    </>
  );
}
