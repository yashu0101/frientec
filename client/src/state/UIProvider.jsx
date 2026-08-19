/* ---------------------------------------------------------------------------
   The two things any screen can open on top of itself: a full-screen live
   preview of a design, and the "request this website" form. Held here so a card
   deep in a grid can raise one without every layer in between passing a prop.
--------------------------------------------------------------------------- */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PreviewOverlay from '../components/PreviewOverlay.jsx';
import LeadSheet from '../components/LeadSheet.jsx';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [preview, setPreview] = useState(null);   // demo slug
  const [lead, setLead] = useState(null);         // { slug } or {}
  const location = useLocation();

  const openPreview = useCallback((slug) => setPreview(slug), []);
  const closePreview = useCallback(() => setPreview(null), []);
  const openLead = useCallback((slug) => setLead({ slug: slug || '' }), []);
  const closeLead = useCallback(() => setLead(null), []);

  // Any route change clears whatever was open: nothing opens a dialog and
  // navigates in the same gesture, so there is nothing to keep.
  const key = location.pathname;
  useMemo(() => { setPreview(null); setLead(null); }, [key]);

  const value = useMemo(() => ({ openPreview, closePreview, openLead, closeLead }), [openPreview, closePreview, openLead, closeLead]);

  return (
    <UIContext.Provider value={value}>
      {children}
      {preview ? <PreviewOverlay slug={preview} onClose={closePreview} /> : null}
      {lead ? <LeadSheet slug={lead.slug} onClose={closeLead} /> : null}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
