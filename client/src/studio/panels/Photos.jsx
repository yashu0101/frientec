/* ---------------------------------------------------------------------------
   Logo, main photo and the gallery. Every slot starts on a stand-in for the
   trade so the preview is a whole site from the first second, and says so — the
   first real upload clears the stand-ins rather than mixing the customer's own
   shop in among pictures of somebody else's.
--------------------------------------------------------------------------- */
import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { HintLine } from '../Fields.jsx';
import { isSample } from '../../lib/format.js';
import { readImage } from '../../lib/images.js';

const MAX_GALLERY = 8;

function Slot({ slotKey, label, hint, img, maxNote, onUpload, onClear }) {
  const t = useT();
  const sample = isSample(img);
  return (
    <div className={'slot' + (img ? ' has' : '')}>
      {img ? <img src={img} alt="" /> : <div className="slotph">{t(label)}</div>}
      <div className="slotside">
        <div className="slotname">
          {t(label)}
          {sample ? <> <span className="sampletag">{t('sample')}</span></> : null}
        </div>
        <div className="slothint">{t(hint)}</div>
        <div className="slotacts">
          <label className={'btn ' + (sample ? 'go' : 'line') + ' sm'}>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { onUpload(slotKey, e.target.files); e.target.value = ''; }}
            />
            {sample ? t('Use my own') : img ? t('Replace') : t('Upload')}
          </label>
          {img ? (
            <button type="button" className="btn ghost sm danger" onClick={() => onClear(slotKey)}>{t('Remove')}</button>
          ) : null}
        </div>
        <div className="slotnote">{t(maxNote)}</div>
      </div>
    </div>
  );
}

export default function Photos() {
  const { c, setC, field, say } = useStudio();
  const t = useT();
  const g = c.gallery;
  const samples = (isSample(c.hero) ? 1 : 0) + g.filter(isSample).length;

  async function upload(key, files) {
    const list = Array.from(files || []);
    if (!list.length) return;

    if (key === 'gallery') {
      const added = [];
      // the first real photo clears the stand-ins
      const clean = g.some(isSample);
      const room = Math.max(0, MAX_GALLERY - (clean ? g.filter((s) => !isSample(s)).length : g.length));
      if (!room) { say('Eight photos is the limit for the gallery.'); return; }
      for (const f of list.slice(0, room)) {
        try { added.push(await readImage(f, 1400, 'image/jpeg')); } catch (e) { say(e.message); }
      }
      if (!added.length) return;
      setC((prev) => {
        const keepIdx = prev.gallery.map((src, i) => (isSample(src) ? -1 : i)).filter((i) => i >= 0);
        const gallery = clean ? keepIdx.map((i) => prev.gallery[i]) : prev.gallery.slice();
        const meta = clean ? keepIdx.map((i) => (prev.galleryMeta || [])[i]) : (prev.galleryMeta || []).slice();
        return { ...prev, gallery: [...gallery, ...added], galleryMeta: meta, sampleImages: false };
      });
      say(`${added.length} ${added.length === 1 ? t('photo added.') : t('photos added.')}`);
      if (list.length > room) say(`${t('Added')} ${room} — ${t('the gallery holds eight.')}`);
      return;
    }

    const isLogo = key === 'logo';
    try {
      const url = await readImage(list[0], isLogo ? 480 : 1600, isLogo ? 'image/png' : 'image/jpeg');
      setC((prev) => ({
        ...prev,
        [key]: url,
        sampleImages: isSample(prev.hero) || prev.gallery.some(isSample) ? prev.sampleImages : false,
      }));
    } catch (e) {
      say(e.message);
    }
  }

  const clearSamples = () =>
    setC((prev) => {
      const keep = prev.gallery.map((src, i) => (isSample(src) ? -1 : i)).filter((i) => i >= 0);
      return {
        ...prev,
        hero: isSample(prev.hero) ? '' : prev.hero,
        gallery: keep.map((i) => prev.gallery[i]),
        galleryMeta: keep.map((i) => (prev.galleryMeta || [])[i]),
        sampleImages: false,
      };
    });

  const setMeta = (i, key, value) =>
    setC((prev) => {
      const meta = (prev.galleryMeta || []).slice();
      while (meta.length <= i) meta.push({});
      meta[i] = { ...meta[i], [key]: value, edited: true };
      return { ...prev, galleryMeta: meta };
    });

  /* captions travel with their photo */
  const dropPhoto = (i) =>
    setC((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, j) => j !== i),
      galleryMeta: (prev.galleryMeta || []).filter((_, j) => j !== i),
    }));

  return (
    <>
      {samples ? (
        <div className="notice">
          {t('These are stand-in pictures for your trade so the preview looks like a finished site. Swap them for your own — a phone photo of your actual place beats any stock image. If you order with them still in, we replace them before launch.')}
        </div>
      ) : null}

      <Slot
        slotKey="logo"
        label="Logo"
        hint="PNG with a transparent background looks best. Skip it and your name is used as the logo."
        img={c.logo}
        maxNote="Resized to 480px wide"
        onUpload={upload}
        onClear={(k) => field(k, '')}
      />
      <Slot
        slotKey="hero"
        label="Main photo"
        hint="The big one at the top. Your shopfront, your best dish, your work."
        img={c.hero}
        maxNote="Resized to 1600px wide"
        onUpload={upload}
        onClear={(k) => field(k, '')}
      />

      <div className="f">
        <label className="lbl">{t('Gallery — up to 8 photos')}</label>
        <div className="galrows">
          {g.map((src, i) => {
            const m = (c.galleryMeta || [])[i] || {};
            return (
              <div className={'galrow' + (isSample(src) ? ' sample' : '')} key={`${src.slice(0, 24)}-${i}`}>
                <div className="galitem">
                  <img src={src} alt="" />
                  {isSample(src) ? <span className="galtag">{t('sample')}</span> : null}
                  <button type="button" className="galx" title="Remove" onClick={() => dropPhoto(i)}>✕</button>
                </div>
                <div className="galfields">
                  <input
                    className="in"
                    value={m.title || ''}
                    placeholder={t('Caption — what is this?')}
                    onChange={(e) => setMeta(i, 'title', e.target.value)}
                  />
                  <input
                    className="in"
                    value={m.desc || ''}
                    placeholder={t('One more line, if it helps')}
                    onChange={(e) => setMeta(i, 'desc', e.target.value)}
                  />
                </div>
              </div>
            );
          })}
          {g.length < MAX_GALLERY ? (
            <label className="galadd wide">
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => { upload('gallery', e.target.files); e.target.value = ''; }}
              />
              <span>+</span>
              <em>{t('Add photos')}</em>
            </label>
          ) : null}
        </div>
        {samples ? (
          <button type="button" className="linkbtn" onClick={clearSamples}>{t('Clear all the sample pictures')}</button>
        ) : null}
        <HintLine>
          {t('Gallery photos also fill the cards in your services section. No photos of your own yet? Leave these in — we shoot or source real ones before launch.')}
        </HintLine>
      </div>
    </>
  );
}
