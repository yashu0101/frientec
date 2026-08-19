import { useNavigate } from 'react-router-dom';
import { useApp, PREMIUM_SLUG } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export default function Footer() {
  const { settings, categories, demos, premiumDemos } = useApp();
  const { openLead } = useUI();
  const t = useT();
  const navigate = useNavigate();

  return (
    <>
      <footer className="site">
        <div className="wrap">
          <div className="cols">
            <div>
              <div className="disp" style={{ color: '#fff', fontSize: '19px', marginBottom: '10px' }}>{settings.brand}</div>
              <p style={{ lineHeight: 1.7, fontSize: '14.5px', maxWidth: '320px', margin: 0 }}>
                {t('Ready-made website designs for local businesses, customised and launched by a small studio in')}{' '}
                {(settings.city || '').split(',')[0]}.
              </p>
            </div>
            <div>
              <div className="mono" style={{ color: 'rgba(255,255,255,.4)', marginBottom: '12px' }}>{t('Popular')}</div>
              {premiumDemos().length ? (
                <div className="link" style={{ color: '#fff' }} onClick={() => navigate(`/designs/${PREMIUM_SLUG}`)}>
                  ✦ {t('Premium designs')}
                </div>
              ) : null}
              {categories.slice(0, 5).map((c) => (
                <div className="link" key={c.slug} onClick={() => navigate(`/designs/${c.slug}`)}>{t(c.name)}</div>
              ))}
            </div>
            <div>
              <div className="mono" style={{ color: 'rgba(255,255,255,.4)', marginBottom: '12px' }}>{t('Contact')}</div>
              <div className="link">WhatsApp {settings.whatsapp}</div>
              <div className="link">{settings.email}</div>
              <div className="link">{settings.city}</div>
              <div className="link" style={{ color: '#fff' }} onClick={() => navigate('/order')}>{t('Track your order ›')}</div>
              <div className="link" onClick={() => navigate('/credits')}>{t('Photo credits')}</div>
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: '18px', fontSize: '13px',
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
            }}
          >
            <span>{t('All demo businesses shown are fictional.')}</span>
            <span>{demos.length} {t('designs · data stored in ./data')}</span>
          </div>
        </div>
      </footer>
      <button type="button" className="fab" onClick={() => openLead('')}>{t('💬 Talk to us')}</button>
    </>
  );
}
