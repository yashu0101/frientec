/* ---------------------------------------------------------------------------
   Not a nicety. The sample photographs are Creative Commons, and CC BY and
   CC BY-SA both require the photographer, the licence and a link. This page is
   the compliance, generated straight from what the fetcher recorded.
--------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { useT } from '../i18n/I18nProvider.jsx';
import StageHead from '../components/StageHead.jsx';
import { asset } from '../config.js';

export default function Credits() {
  const t = useT();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(asset('/img/credits.json'))
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => {
        setRows(
          Object.keys(j)
            .map((file) => ({ file, ...j[file] }))
            .sort((a, b) => a.file.localeCompare(b.file)),
        );
      })
      .catch(() => {
        setRows([]);
        setError('Could not read the credits file.');
      });
  }, []);

  const list = rows || [];

  return (
    <>
      <StageHead
        label="Licensing"
        title="Photo credits"
        blurb="The sample photographs in this catalogue are Creative Commons images from Openverse, filtered to licences that allow commercial use and modification. Every one is credited below, as those licences require."
      />
      <div className="wrap narrow" style={{ padding: '44px 0 70px' }}>
        <p className="muted" style={{ lineHeight: 1.75, margin: '0 0 30px', maxWidth: '640px' }}>
          {t("They are stand-ins. A real customer site gets the customer's own photographs before it goes live.")}
        </p>

        {error ? (
          <div className="card" style={{ padding: '24px' }}>{t(error)}</div>
        ) : !list.length ? (
          <div className="card muted" style={{ padding: '24px' }}>
            {t('No photographs installed — the catalogue is showing its drawn placeholders, which need no attribution.')}
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>{['Image', 'Photograph', 'By', 'Licence'].map((h) => <th key={h}>{t(h)}</th>)}</tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.file}>
                    <td className="mono dim" style={{ fontSize: '10.5px', whiteSpace: 'nowrap' }}>{c.file}</td>
                    <td>
                      {c.source ? (
                        <a href={c.source} target="_blank" rel="noopener" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                          {c.title}
                        </a>
                      ) : c.title}
                    </td>
                    <td className="muted">
                      {c.creator_url ? <a href={c.creator_url} target="_blank" rel="noopener">{c.creator}</a> : (c.creator || '—')}
                    </td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                      {c.licence_url ? <a href={c.licence_url} target="_blank" rel="noopener">{c.licence}</a> : c.licence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mono dim" style={{ marginTop: '18px' }}>
          {list.length} {t('photographs · regenerate with')} <code>node tools/fetch-photos.js</code>
        </div>
      </div>
    </>
  );
}
