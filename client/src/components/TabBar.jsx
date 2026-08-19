/* ---------------------------------------------------------------------------
   The mobile chrome.

   On a phone the header cannot hold the whole navigation — at 390px it ran 67px
   past the viewport and the page scrolled sideways. So on small screens the
   navigation moves down here, where a thumb actually reaches, and the app reads
   as an app rather than a desktop site squeezed thin.

   Hidden entirely above 720px: this is not a second navigation to keep in step,
   it is the same routes the header shows when there is room for them.
--------------------------------------------------------------------------- */
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp, PREMIUM_SLUG } from '../state/AppProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* One path each, drawn rather than emoji: an emoji tab bar reads as a toy, and
   these have to sit under a catalogue that is trying to look expensive. */
const PATHS = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  star: 'M12 3.6l2.4 5 5.5.8-4 3.9.95 5.5L12 16.2l-4.85 2.6.95-5.5-4-3.9 5.5-.8z',
  steps: 'M4 18h4v-6H4zM10 18h4V6h-4zM16 18h4v-9h-4z',
  box: 'M3.5 8.5L12 4l8.5 4.5v7L12 20l-8.5-4.5zM3.5 8.5L12 13l8.5-4.5M12 13v7',
  gear: 'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2v.2a2 2 0 11-4 0V21a1.7 1.7 0 00-2.9-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 004 15H3.8a2 2 0 110-4H4a1.7 1.7 0 001.2-2.9l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 0011 4.2V4a2 2 0 114 0v.2a1.7 1.7 0 002.9 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1A1.7 1.7 0 0021 11h.2a2 2 0 110 4H21a1.7 1.7 0 00-1.6 1z',
};

export default function TabBar() {
  const { premiumDemos } = useApp();
  const t = useT();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = [
    { to: '/designs', label: 'Designs', icon: PATHS.grid, on: pathname.startsWith('/designs') && !pathname.endsWith(PREMIUM_SLUG) },
    ...(premiumDemos().length
      ? [{ to: `/designs/${PREMIUM_SLUG}`, label: 'Premium', icon: PATHS.star, on: pathname.endsWith(PREMIUM_SLUG) }]
      : []),
    { to: '/how', label: 'How', icon: PATHS.steps, on: pathname === '/how' },
    { to: '/order', label: 'Order', icon: PATHS.box, on: pathname === '/order' },
    { to: '/admin', label: 'Admin', icon: PATHS.gear, on: pathname === '/admin' },
  ];

  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((tab) => (
        <button
          key={tab.to}
          type="button"
          className={'tab' + (tab.on ? ' on' : '')}
          aria-current={tab.on ? 'page' : undefined}
          onClick={() => navigate(tab.to)}
        >
          <Icon d={tab.icon} />
          <span>{t(tab.label)}</span>
        </button>
      ))}
    </nav>
  );
}
