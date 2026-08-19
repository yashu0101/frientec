import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import { AppProvider } from './state/AppProvider.jsx';
import './styles.css';

/* HashRouter, not BrowserRouter: every link the old app ever printed — and
   every order confirmation that says "look it up at /#/order" — is a hash URL.
   Keeping them working is worth more than prettier paths. */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </I18nProvider>
    </HashRouter>
  </React.StrictMode>,
);
