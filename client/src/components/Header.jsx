import { Link, useNavigate } from 'react-router-dom';
import { useApp, PREMIUM_SLUG } from '../state/AppProvider.jsx';
import { useUI } from '../state/UIProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header() {
  const { settings, premiumDemos } = useApp();
  const { openLead } = useUI();
  const t = useT();
  const navigate = useNavigate();
  const hasPremium = premiumDemos().length > 0;

  return (
    <header className="top">
      <div className="wrap bar">
        <Link className="logo" to="/">
          <span className="mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff">
              <rect width="16" height="3" rx="1" />
              <rect y="6" width="7" height="7" rx="1.5" />
              <rect x="9" y="6" width="7" height="7" rx="1.5" opacity=".65" />
            </svg>
          </span>
          <span className="disp" style={{ fontSize: '18px' }}>{settings.brand || 'Frientec'}</span>
        </Link>
        <nav>
          {/* hide-sm because the tab bar carries this route on a phone; the header
              keeps only identity and the two controls that are not navigation */}
          <button type="button" className="btn ghost sm hide-sm" onClick={() => navigate('/designs')}>{t('Designs')}</button>
          {hasPremium ? (
            <button type="button" className="btn ghost sm hide-sm navprem" onClick={() => navigate(`/designs/${PREMIUM_SLUG}`)}>
              {t('Premium')}
            </button>
          ) : null}
          <button type="button" className="btn ghost sm hide-sm" onClick={() => navigate('/how')}>{t('How it works')}</button>
          <LangSwitcher />
          <ThemeToggle />
          <button type="button" className="btn line sm hide-sm" onClick={() => navigate('/admin')}>{t('Admin')}</button>
          <button type="button" className="btn go sm" onClick={() => openLead('')}>{t('Get a website')}</button>
        </nav>
      </div>
    </header>
  );
}
