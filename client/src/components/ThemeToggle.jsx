/* One attribute on <html> drives every colour in the stylesheet. It is set
   before first paint in index.html, so there is no flash of the wrong theme. */
import { useState } from 'react';

const current = () => document.documentElement.getAttribute('data-theme') || 'light';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(current);

  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('sf_theme', next); } catch { /* private mode */ }
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="iconbtn"
      onClick={flip}
      title="Switch between light and dark"
      aria-label="Switch theme"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}
