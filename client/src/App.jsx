/* ---------------------------------------------------------------------------
   The shell: chrome on every page, the routes, and the two global overlays.

   The studio and the admin desk are laid out edge to edge and print their own
   footers, so neither gets the site footer. The admin desk also stays in
   English — it is one operator's internal tool.
--------------------------------------------------------------------------- */
import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './state/AppProvider.jsx';
import { UIProvider } from './state/UIProvider.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import { useDepth, useReveal } from './lib/motion.js';

import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import How from './pages/How.jsx';
import Track from './pages/Track.jsx';
import Credits from './pages/Credits.jsx';
import Admin from './pages/Admin.jsx';

/* The studio is the heaviest screen in the app and most visitors never open it,
   so it arrives on demand. */
const Studio = lazy(() => import('./studio/Studio.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // the studio manages its own scroll between steps
    if (pathname.startsWith('/build/')) return;
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Chrome() {
  const location = useLocation();
  const bare = location.pathname.startsWith('/build/') || location.pathname.startsWith('/admin');
  useReveal(location.pathname);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designs" element={<Browse />} />
        <Route path="/designs/:slug" element={<Browse />} />
        {/* the old app's deep-link shape: /demos/<category>/<slug> opened the
            catalogue with that design previewing on top */}
        <Route path="/demos/:slug" element={<Browse />} />
        <Route path="/demos/:slug/:preview" element={<Browse />} />
        <Route path="/how" element={<How />} />
        <Route path="/order" element={<Track />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/build/:slug"
          element={
            <Suspense fallback={<div className="boot">Opening the studio…</div>}>
              <Studio />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {bare ? null : <Footer />}
    </>
  );
}

export default function App() {
  const { booted, bootError, toast } = useApp();
  useDepth();

  if (!booted) return <div className="boot">Loading the catalogue…</div>;

  if (bootError) {
    return (
      <div className="boot">
        Could not reach the server. Is it running? <code>npm run dev</code>
        <br />
        <br />
        {bootError}
      </div>
    );
  }

  return (
    <UIProvider>
      <ScrollToTop />
      <Chrome />
      <Toast message={toast} />
    </UIProvider>
  );
}
