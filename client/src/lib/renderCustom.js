/* ---------------------------------------------------------------------------
   renderCustom(demo, C) -> a complete HTML document.

   The catalogue templates are fixed showpieces with invented businesses in
   them. This is the other half: the same design language driven entirely by
   the customer's own content — their name, their photos, their prices, their
   colours, their sections. It renders into an iframe in the studio, which is
   why it returns a whole document rather than a fragment: the customer's site
   gets its own CSS scope and cannot be styled by the catalogue's stylesheet.

   Every visible string comes from C. Nothing is hardcoded copy.
--------------------------------------------------------------------------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (!isFinite(n)) return [14, 124, 90];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) { var c = hexToRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function luma(hex) { var c = hexToRgb(hex); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function readable(hex) { return luma(hex) > 0.62 ? '#111417' : '#ffffff'; }

  var FONTS = {
    modern: {
      head: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      body: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      weight: 800, track: '-.033em', caps: false, label: 'Modern sans',
    },
    classic: {
      head: 'Georgia,"Times New Roman",serif',
      body: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      weight: 500, track: '-.012em', caps: false, label: 'Classic serif',
    },
    bold: {
      head: '"Inter",-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif',
      body: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      weight: 900, track: '-.04em', caps: true, label: 'Bold display',
    },
    editorial: {
      head: 'Georgia,"Times New Roman",serif',
      body: 'Georgia,"Times New Roman",serif',
      weight: 400, track: '-.005em', caps: false, label: 'Editorial serif',
    },
  };

  var RADIUS = { sharp: '0px', soft: '12px', round: '24px' };

  /* Languages the sites can be built in. `short` is what the switcher shows. */
  var LANGS = [
    { code: 'en', name: 'English', short: 'EN', native: 'English' },
    { code: 'hi', name: 'Hindi', short: 'हि', native: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', short: 'मरा', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', short: 'ગુ', native: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', short: 'বাং', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', short: 'த', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', short: 'తె', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', short: 'ಕ', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', short: 'മ', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', short: 'ਪੰ', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', short: 'ଓ', native: 'ଓଡ଼ିଆ' },
    { code: 'ur', name: 'Urdu', short: 'اردو', native: 'اردو' },
  ];
  var LANG_BY = {};
  LANGS.forEach(function (l) { LANG_BY[l.code] = l; });

  /* The strings a second language actually needs. Prices and proper nouns stay
     as typed, so this is the set the customer is asked to translate. */
  var I18N_KEYS = [
    ['heroTitle', 'Main heading'],
    ['heroText', 'Line under the heading'],
    ['ctaLabel', 'Button text'],
    ['aboutTitle', 'About heading'],
    ['about', 'About text'],
    ['servicesTitle', 'Services heading'],
    ['galleryTitle', 'Gallery heading'],
    ['reviewsTitle', 'Reviews heading'],
    ['visitTitle', 'Visit us heading'],
    ['ctaTitle', 'Closing band heading'],
    ['ctaText', 'Closing band text'],
    ['point0', 'Selling point 1'],
    ['point1', 'Selling point 2'],
    ['point2', 'Selling point 3'],
  ];

  var RTL = { ur: true };

  /* --- building blocks ---------------------------------------------------- */

  /* A real <img> when there is a photo — a background-image is invisible to
     image search, and a local business wants to be found by its photos. */
  function picture(src, height, fallbackCss, label, alt) {
    if (src) {
      return '<div class="pic" style="height:' + height + '">' +
        '<img src="' + src + '" alt="' + esc(alt || label || '') + '" loading="lazy" /></div>';
    }
    return '<div class="pic ph" style="height:' + height + ';' + fallbackCss + '" role="img" aria-label="' +
      esc(alt || label || 'Placeholder image') + '">' +
      (label ? '<span>' + esc(label) + '</span>' : '') + '</div>';
  }

  function navLinks(on) {
    var links = [];
    if (on.about) links.push('About');
    if (on.services) links.push(on.servicesLabel || 'Services');
    if (on.gallery) links.push('Gallery');
    if (on.reviews) links.push('Reviews');
    if (on.hours) links.push('Visit us');
    return links;
  }

  /* --- the document ------------------------------------------------------- */
export function renderCustom(demo, C) {
    C = C || {};
    demo = demo || {};

    var f = FONTS[C.font] || FONTS.modern;
    var rad = RADIUS[C.radius] || RADIUS.soft;
    var dark = C.mode === 'dark';
    var acc = C.accent || demo.accent || '#0E7C5A';
    var ink = C.ink || demo.ink || '#101820';

    var bg = dark ? ink : '#ffffff';
    var fg = dark ? '#F2F4F5' : ink;
    var muted = dark ? 'rgba(242,244,245,.66)' : 'rgba(16,24,32,.62)';
    var line = dark ? 'rgba(255,255,255,.13)' : 'rgba(16,24,32,.10)';
    var soft = dark ? 'rgba(255,255,255,.045)' : '#F6F8F8';
    var accFg = readable(acc);

    var name = C.business || demo.name || 'Your business';
    var on = C.sections || {};
    var svcLabel = C.servicesLabel || 'What we offer';
    var services = (C.services || []).filter(function (s) { return s && (s.name || s.desc || s.price); });
    var reviews = (C.reviews || []).filter(function (r) { return r && r.text; });
    var gallery = (C.gallery || []).filter(Boolean);
    var points = (C.points || []).filter(function (p) { return String(p || '').trim(); });

    var heroGrad = 'background:linear-gradient(155deg,' + acc + ',' + (dark ? '#000' : ink) + ' 220%);';
    var tileGrad = function (i) {
      return 'background:linear-gradient(150deg,' + rgba(acc, 0.92 - i * 0.16) + ',' + (dark ? '#000' : ink) + ' 250%);';
    };

    var waNumber = String(C.whatsapp || '').replace(/\D/g, '');
    var waHref = waNumber ? 'https://wa.me/' + waNumber : '#';
    var telHref = 'tel:' + String(C.phone || '').replace(/[^\d+]/g, '');
    var mapQuery = encodeURIComponent([C.address, C.city].filter(Boolean).join(', ') || name);

    var cta = C.ctaLabel || 'Book now';

    /* ---- languages ---- */
    var langs = (C.languages && C.languages.length ? C.languages : ['en'])
      .filter(function (code) { return LANG_BY[code]; });
    if (!langs.length) langs = ['en'];
    var primary = langs[0];
    var multi = langs.length > 1;
    var switcher = multi
      ? '<div class="langs" role="group" aria-label="Language">' + langs.map(function (code, i) {
        return '<button class="lang' + (i === 0 ? ' on' : '') + '" data-lang="' + code + '" title="' + esc(LANG_BY[code].native) + '">' +
          esc(LANG_BY[code].short) + '</button>';
      }).join('') + '</div>'
      : '';

    /* ---- nav ---- */
    var brandMark = C.logo
      ? '<img class="logo" src="' + C.logo + '" alt="' + esc(name) + '" />'
      : '<span class="wordmark">' + esc(name) + '</span>';

    var nav =
      (C.topbar !== false && (C.phone || C.hours) ?
        '<div class="ribbon">' +
          (C.hours ? '<span>' + esc(C.hours) + '</span>' : '<span></span>') +
          (C.phone ? '<span class="strong">☎ ' + esc(C.phone) + '</span>' : '') +
        '</div>' : '') +
      '<header class="nav"><a class="brand" href="#top">' + brandMark + '</a>' +
      '<nav class="links">' + navLinks({ about: on.about, services: on.services, gallery: on.gallery, reviews: on.reviews, hours: on.hours, servicesLabel: svcLabel })
        .map(function (l) { return '<a href="#' + l.toLowerCase().replace(/\s+/g, '-') + '">' + esc(l) + '</a>'; }).join('') + '</nav>' +
      '<div class="navright">' + switcher +
      '<a class="btn primary" data-i18n="ctaLabel" href="' + esc(waHref) + '">' + esc(cta) + '</a></div></header>';

    /* ---- hero: three layouts ---- */
    var eyebrow = C.eyebrow || [C.city, demo.style].filter(Boolean).join(' · ');
    var title = C.heroTitle || name;
    var sub = C.heroText || C.tagline || '';
    var heroBtns =
      '<div class="row"><a class="btn primary lg" data-i18n="ctaLabel" href="' + esc(waHref) + '">' + esc(cta) + '</a>' +
      (C.phone ? '<a class="btn ghost lg" href="' + esc(telHref) + '">Call ' + esc(C.phone) + '</a>' : '') + '</div>';
    var h1 = '<h1 data-i18n="heroTitle">' + esc(title) + '</h1>';
    var leadP = sub ? '<p class="lead" data-i18n="heroText">' + esc(sub) + '</p>' : '';

    var hero;
    if (C.layout === 'center') {
      hero =
        '<section class="hero center" id="top">' +
        '<div class="inner">' +
        (eyebrow ? '<div class="eyebrow">' + esc(eyebrow) + '</div>' : '') +
        h1 + leadP + heroBtns + '</div>' +
        picture(C.hero, 'clamp(220px,38vw,420px)', heroGrad, 'Your main photo goes here', name + (C.city ? ' in ' + C.city : '')) +
        '</section>';
    } else if (C.layout === 'image') {
      hero =
        '<section class="hero image" id="top" style="' + (C.hero ? 'background-image:url(' + C.hero + ')' : heroGrad) + '">' +
        '<div class="scrim"></div><div class="inner">' +
        (eyebrow ? '<div class="eyebrow light">' + esc(eyebrow) + '</div>' : '') +
        h1 + leadP + heroBtns + '</div></section>';
    } else {
      hero =
        '<section class="hero split" id="top">' +
        '<div class="inner">' +
        (eyebrow ? '<div class="eyebrow">' + esc(eyebrow) + '</div>' : '') +
        h1 + leadP + heroBtns + '</div>' +
        picture(C.hero, 'clamp(260px,34vw,400px)', heroGrad, 'Your main photo goes here', name + (C.city ? ' in ' + C.city : '')) +
        '</section>';
    }

    /* ---- the rest ---- */
    var out = [hero];

    if (points.length) {
      out.push('<section class="strip">' + points.map(function (p, i) {
        return '<div class="point"><span class="tick">✓</span><span data-i18n="point' + i + '">' + esc(p) + '</span></div>';
      }).join('') + '</section>');
    }

    if (on.about && (C.about || C.gallery[0])) {
      out.push('<section class="band" id="about"><div class="two">' +
        picture(gallery[0] || '', 'clamp(240px,30vw,360px)', tileGrad(0), 'A photo of your place', 'Inside ' + name) +
        '<div><div class="eyebrow">' + esc(C.aboutLabel || 'About us') + '</div>' +
        '<h2 data-i18n="aboutTitle">' + esc(C.aboutTitle || ('Why people come to ' + name)) + '</h2>' +
        '<p class="body" data-i18n="about">' + esc(C.about || '') + '</p>' +
        (C.owner ? '<div class="sig">— ' + esc(C.owner) + (C.ownerRole ? ', ' + esc(C.ownerRole) : '') + '</div>' : '') +
        '</div></div></section>');
    }

    if (on.services && services.length) {
      out.push('<section class="band alt" id="' + esc(svcLabel.toLowerCase().replace(/\s+/g, '-')) + '">' +
        '<div class="head"><div class="eyebrow">' + esc(svcLabel) + '</div>' +
        '<h2 data-i18n="servicesTitle">' + esc(C.servicesTitle || svcLabel) + '</h2>' +
        (C.servicesText ? '<p class="body">' + esc(C.servicesText) + '</p>' : '') + '</div>' +
        '<div class="cards">' + services.map(function (s, i) {
          var img = gallery[(i + 1) % Math.max(1, gallery.length)];
          return '<article class="card">' +
            picture(gallery.length > 1 ? img : '', '150px', tileGrad(i % 3), '', (s.name || svcLabel) + ' at ' + name) +
            '<div class="cbody"><div class="crow"><h3>' + esc(s.name || '') + '</h3>' +
            (s.price ? '<span class="price">' + esc(s.price) + '</span>' : '') + '</div>' +
            (s.desc ? '<p>' + esc(s.desc) + '</p>' : '') + '</div></article>';
        }).join('') + '</div></section>');
    }

    /* Each gallery picture can carry a caption. A photo of a room says almost
       nothing on its own; "The back terrace — seats twelve, open till 11" is
       the sentence that actually sells it. Both lines are optional, so a
       gallery of bare photographs still renders exactly as before. */
    if (on.gallery) {
      var meta = C.galleryMeta || [];
      var figure = function (src, i, label) {
        var m = meta[i] || {};
        var caption = (m.title || m.desc)
          ? '<figcaption class="cap">' +
            (m.title ? '<b>' + esc(m.title) + '</b>' : '') +
            (m.desc ? '<span>' + esc(m.desc) + '</span>' : '') + '</figcaption>'
          : '';
        var alt = m.title ? name + ' — ' + m.title : name + ' — photo ' + (i + 1);
        return '<figure class="shot">' +
          picture(src, '210px', src ? '' : tileGrad(i % 4), label, alt) + caption + '</figure>';
      };

      out.push('<section class="band" id="gallery">' +
        '<div class="head"><div class="eyebrow">Gallery</div><h2 data-i18n="galleryTitle">' + esc(C.galleryTitle || 'Have a look inside') + '</h2>' +
        (C.galleryText ? '<p class="body">' + esc(C.galleryText) + '</p>' : '') + '</div>' +
        '<div class="grid">' + (gallery.length
          ? gallery.map(function (g, i) { return figure(g, i, ''); }).join('')
          : [0, 1, 2, 3, 4, 5].map(function (i) { return figure('', i, 'Photo ' + (i + 1)); }).join('')) +
        '</div></section>');
    }

    if (on.reviews && reviews.length) {
      out.push('<section class="band alt" id="reviews">' +
        '<div class="head"><div class="eyebrow">Reviews</div><h2 data-i18n="reviewsTitle">' + esc(C.reviewsTitle || 'What customers say') + '</h2></div>' +
        '<div class="cards">' + reviews.map(function (r) {
          return '<blockquote class="quote"><div class="stars">★★★★★</div><p>&ldquo;' + esc(r.text) + '&rdquo;</p>' +
            (r.author ? '<cite>— ' + esc(r.author) + '</cite>' : '') + '</blockquote>';
        }).join('') + '</div></section>');
    }

    if (on.hours) {
      out.push('<section class="band" id="visit-us"><div class="head"><div class="eyebrow">Visit us</div>' +
        '<h2 data-i18n="visitTitle">' + esc(C.visitTitle || 'Where to find us') + '</h2></div><div class="two">' +
        '<div class="details">' +
        (C.hours ? '<div class="d"><span>Hours</span><strong>' + esc(C.hours) + '</strong></div>' : '') +
        (C.address ? '<div class="d"><span>Address</span><strong>' + esc(C.address) + (C.city ? ', ' + esc(C.city) : '') + '</strong></div>' : '') +
        (C.phone ? '<div class="d"><span>Phone</span><strong><a href="' + esc(telHref) + '">' + esc(C.phone) + '</a></strong></div>' : '') +
        (C.whatsapp ? '<div class="d"><span>WhatsApp</span><strong><a href="' + esc(waHref) + '">' + esc(C.whatsapp) + '</a></strong></div>' : '') +
        (C.email ? '<div class="d"><span>Email</span><strong><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></strong></div>' : '') +
        (C.instagram ? '<div class="d"><span>Instagram</span><strong>' + esc(C.instagram) + '</strong></div>' : '') +
        '</div>' +
        '<a class="mapbox" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '">' +
        '<span class="pin">📍</span><span class="mtext">' + esc([C.address, C.city].filter(Boolean).join(', ') || 'Your location') + '</span>' +
        '<span class="mlink">Open in Google Maps ›</span></a>' +
        '</div></section>');
    }

    if (on.cta !== false) {
      out.push('<section class="ctaband"><h2 data-i18n="ctaTitle">' + esc(C.ctaTitle || ('Ready to visit ' + name + '?')) + '</h2>' +
        (C.ctaText ? '<p data-i18n="ctaText">' + esc(C.ctaText) + '</p>' : '') +
        '<div class="row">' +
        (C.whatsapp ? '<a class="btn solid lg" href="' + esc(waHref) + '">💬 WhatsApp us</a>' : '') +
        (C.phone ? '<a class="btn outline lg" href="' + esc(telHref) + '">Call ' + esc(C.phone) + '</a>' : '') +
        '</div></section>');
    }

    out.push('<footer class="foot"><div>' + esc(name) + (C.city ? ' · ' + esc(C.city) : '') + '</div>' +
      '<div class="fmeta">' + (C.instagram ? esc(C.instagram) + ' · ' : '') + '© ' + (C.year || new Date().getFullYear()) + '</div></footer>');

    /* ---- stylesheet ---- */
    var css = [
      '*{box-sizing:border-box;margin:0;padding:0;}',
      'html{scroll-behavior:smooth;}',
      'body{background:' + bg + ';color:' + fg + ';font-family:' + f.body + ';font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;}',
      'a{color:inherit;text-decoration:none;}',
      'img{max-width:100%;display:block;}',
      'h1,h2,h3{font-family:' + f.head + ';font-weight:' + f.weight + ';letter-spacing:' + f.track + ';line-height:1.08;}',
      f.caps ? 'h1,h2{text-transform:uppercase;}' : '',
      'h1{font-size:clamp(32px,5.4vw,58px);}',
      'h2{font-size:clamp(24px,3.4vw,36px);margin-bottom:10px;}',
      'h3{font-size:19px;line-height:1.3;}',
      '.eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:' + acc + ';font-weight:700;margin-bottom:14px;font-family:' + f.body + ';}',
      '.eyebrow.light{color:rgba(255,255,255,.85);}',
      '.lead{font-size:clamp(16px,1.5vw,19px);line-height:1.72;color:' + muted + ';max-width:520px;margin:18px 0 28px;}',
      '.body{color:' + muted + ';line-height:1.78;max-width:600px;}',
      '.row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}',
      /* buttons */
      '.btn{display:inline-flex;align-items:center;gap:8px;border-radius:' + rad + ';padding:12px 20px;font-weight:700;font-size:15px;font-family:' + f.body + ';cursor:pointer;border:1px solid transparent;transition:transform .18s ease,opacity .18s ease;}',
      '.btn:hover{transform:translateY(-1px);}',
      '.btn.lg{padding:15px 26px;font-size:16px;}',
      '.btn.primary{background:' + acc + ';color:' + accFg + ';}',
      '.btn.ghost{border-color:' + line + ';color:' + fg + ';}',
      '.btn.solid{background:' + accFg + ';color:' + acc + ';}',
      '.btn.outline{border-color:' + rgba(accFg === '#ffffff' ? '#ffffff' : '#000000', 0.5) + ';color:' + accFg + ';}',
      /* ribbon + nav */
      '.ribbon{background:' + acc + ';color:' + accFg + ';font-size:13px;padding:8px clamp(18px,5vw,56px);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;}',
      '.ribbon .strong{font-weight:700;}',
      '.nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px clamp(18px,5vw,56px);background:' + (dark ? rgba(ink, 0.92) : 'rgba(255,255,255,.92)') + ';backdrop-filter:blur(10px);border-bottom:1px solid ' + line + ';}',
      '.brand{display:flex;align-items:center;gap:10px;min-width:0;}',
      '.logo{height:38px;width:auto;object-fit:contain;}',
      '.wordmark{font-family:' + f.head + ';font-weight:' + Math.max(700, f.weight) + ';font-size:20px;letter-spacing:' + f.track + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.links{display:flex;gap:22px;font-size:14.5px;color:' + muted + ';}',
      '.links a:hover{color:' + acc + ';}',
      '.navright{display:flex;align-items:center;gap:12px;}',
      '.langs{display:flex;gap:2px;border:1px solid ' + line + ';border-radius:' + rad + ';padding:2px;}',
      '.lang{border:0;background:transparent;color:' + muted + ';font-family:' + f.body + ';font-size:12.5px;font-weight:700;' +
        'padding:6px 9px;border-radius:calc(' + rad + ' - 2px);cursor:pointer;line-height:1;}',
      '.lang:hover{color:' + fg + ';}',
      '.lang.on{background:' + acc + ';color:' + accFg + ';}',
      /* pictures */
      '.pic{background-size:cover;background-position:center;border-radius:' + rad + ';overflow:hidden;}',
      '.pic img{width:100%;height:100%;object-fit:cover;display:block;}',
      '.pic.ph{display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;}',
      '.pic.ph span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.72);font-family:' + f.body + ';}',
      /* hero */
      '.hero{padding:clamp(40px,6vw,84px) clamp(18px,5vw,56px);}',
      '.hero.split{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(24px,4vw,54px);align-items:center;}',
      '.hero.center{text-align:center;}',
      '.hero.center .inner{max-width:720px;margin:0 auto 36px;}',
      '.hero.center .lead{margin-left:auto;margin-right:auto;}',
      '.hero.center .row{justify-content:center;}',
      '.hero.image{position:relative;background-size:cover;background-position:center;min-height:clamp(380px,52vw,560px);display:flex;align-items:flex-end;color:#fff;}',
      '.hero.image .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.78));}',
      '.hero.image .inner{position:relative;max-width:680px;}',
      '.hero.image .lead{color:rgba(255,255,255,.86);}',
      /* strip */
      '.strip{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:16px clamp(18px,5vw,56px);background:' + soft + ';border-top:1px solid ' + line + ';border-bottom:1px solid ' + line + ';}',
      '.point{display:flex;align-items:center;gap:8px;font-size:14.5px;color:' + muted + ';padding:4px 10px;}',
      '.point .tick{color:' + acc + ';font-weight:800;}',
      /* bands */
      '.band{padding:clamp(40px,6vw,80px) clamp(18px,5vw,56px);}',
      '.band.alt{background:' + soft + ';border-top:1px solid ' + line + ';border-bottom:1px solid ' + line + ';}',
      '.band .head{max-width:640px;margin-bottom:30px;}',
      '.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(22px,4vw,50px);align-items:center;}',
      '.sig{margin-top:18px;font-style:italic;color:' + acc + ';font-weight:600;}',
      /* cards */
      '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;}',
      '.card{border:1px solid ' + line + ';border-radius:' + rad + ';overflow:hidden;background:' + (dark ? 'rgba(255,255,255,.03)' : '#fff') + ';transition:transform .25s cubic-bezier(.22,.61,.36,1),box-shadow .25s ease;}',
      '.card:hover{transform:translateY(-3px);box-shadow:0 18px 34px -22px rgba(0,0,0,.4);}',
      '.card .pic{border-radius:0;}',
      '.cbody{padding:18px;}',
      '.crow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:7px;}',
      '.price{font-weight:800;color:' + acc + ';white-space:nowrap;font-family:' + f.body + ';}',
      '.cbody p{color:' + muted + ';font-size:14.5px;line-height:1.65;}',
      /* gallery */
      '.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;}',
      '.shot{margin:0;}',
      '.cap{padding:10px 2px 0;}',
      '.cap b{display:block;font-family:' + f.head + ';font-weight:' + Math.max(700, f.weight) + ';font-size:15px;letter-spacing:' + f.track + ';}',
      '.cap span{display:block;font-size:13.5px;line-height:1.55;color:' + muted + ';margin-top:3px;}',
      /* reviews */
      '.quote{border-left:3px solid ' + acc + ';padding:4px 0 4px 20px;}',
      '.quote .stars{color:' + acc + ';letter-spacing:.1em;}',
      '.quote p{font-size:17px;line-height:1.72;margin:10px 0;font-style:italic;}',
      '.quote cite{font-size:13.5px;color:' + muted + ';font-style:normal;font-weight:600;}',
      /* details + map */
      '.details .d{display:grid;grid-template-columns:110px 1fr;gap:14px;padding:13px 0;border-bottom:1px solid ' + line + ';font-size:15px;}',
      '.details .d span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' + muted + ';padding-top:3px;}',
      '.details .d a:hover{color:' + acc + ';}',
      '.mapbox{display:flex;flex-direction:column;justify-content:center;gap:10px;min-height:230px;border:1px dashed ' + rgba(acc, 0.5) + ';border-radius:' + rad + ';background:' + rgba(acc, 0.07) + ';padding:24px;text-align:center;}',
      '.mapbox .pin{font-size:26px;}',
      '.mapbox .mtext{font-weight:600;}',
      '.mapbox .mlink{font-size:13.5px;color:' + acc + ';font-weight:700;}',
      /* cta */
      '.ctaband{background:' + acc + ';color:' + accFg + ';padding:clamp(40px,6vw,72px) clamp(18px,5vw,56px);text-align:center;}',
      '.ctaband p{margin:12px auto 24px;max-width:520px;opacity:.88;}',
      '.ctaband .row{justify-content:center;}',
      /* footer */
      '.foot{padding:26px clamp(18px,5vw,56px);border-top:1px solid ' + line + ';display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:13.5px;color:' + muted + ';}',
      /* narrow */
      '@media(max-width:780px){',
      '.hero.split,.two{grid-template-columns:1fr;}',
      '.links{display:none;}',
      '}',
      '@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;}}',
    ].join('\n');

    /* ---- the language switcher's own script ----
       Every translatable string is tagged data-i18n. The base dictionary is
       what was typed for the primary language; anything a translation leaves
       blank falls back to it, so a half-finished translation still reads. */
    var base = {
      heroTitle: title, heroText: sub, ctaLabel: cta,
      aboutTitle: C.aboutTitle || ('Why people come to ' + name), about: C.about || '',
      servicesTitle: C.servicesTitle || svcLabel,
      galleryTitle: C.galleryTitle || 'Have a look inside',
      reviewsTitle: C.reviewsTitle || 'What customers say',
      visitTitle: C.visitTitle || 'Where to find us',
      ctaTitle: C.ctaTitle || ('Ready to visit ' + name + '?'), ctaText: C.ctaText || '',
      point0: points[0] || '', point1: points[1] || '', point2: points[2] || '',
    };
    var dicts = {};
    langs.forEach(function (code) {
      dicts[code] = code === primary ? base : ((C.i18n || {})[code] || {});
    });

    var script = multi ? '<script>' +
      '(function(){' +
      'var D=' + JSON.stringify(dicts) + ',B=' + JSON.stringify(base) + ',RTL=' + JSON.stringify(RTL) + ';' +
      'function set(code){' +
      'var d=D[code]||{};' +
      'var ns=document.querySelectorAll("[data-i18n]");' +
      'for(var i=0;i<ns.length;i++){var k=ns[i].getAttribute("data-i18n");' +
      'var v=(d[k]!==undefined&&String(d[k]).length)?d[k]:B[k];' +
      'if(v!==undefined)ns[i].textContent=v;}' +
      'document.documentElement.lang=code;' +
      'document.documentElement.dir=RTL[code]?"rtl":"ltr";' +
      'var bs=document.querySelectorAll(".lang");' +
      'for(var j=0;j<bs.length;j++)bs[j].classList.toggle("on",bs[j].getAttribute("data-lang")===code);' +
      'try{localStorage.setItem("site_lang",code);}catch(e){}' +
      '}' +
      'document.addEventListener("click",function(e){' +
      'var b=e.target.closest?e.target.closest(".lang"):null;' +
      'if(b)set(b.getAttribute("data-lang"));});' +
      'try{var saved=localStorage.getItem("site_lang");if(saved&&D[saved])set(saved);}catch(e){}' +
      '})();' +
      '<\/script>' : '';

    /* ---- what a search engine and a WhatsApp preview see ----
       The catalogue promises "titles, descriptions, business schema and a
       sitemap set up before launch", so the generated page has to actually
       carry them. The schema is filled only from what the customer typed —
       no invented ratings, no opening hours we guessed. */
    var pageTitle = [name, C.city, svcLabel].filter(Boolean).slice(0, 2).join(' · ');
    var description = (sub || C.about || '').replace(/\s+/g, ' ').trim().slice(0, 155);
    var socialImage = C.hero || C.logo || '';

    var schema = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: name };
    if (description) schema.description = description;
    if (C.phone) schema.telephone = String(C.phone);
    if (C.email) schema.email = C.email;
    if (socialImage) schema.image = socialImage;
    if (C.address || C.city) {
      schema.address = { '@type': 'PostalAddress' };
      if (C.address) schema.address.streetAddress = C.address;
      if (C.city) schema.address.addressLocality = C.city;
      schema.address.addressCountry = 'IN';
    }
    if (C.hours) schema.openingHours = C.hours;
    if (services.length) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: svcLabel,
        itemListElement: services.slice(0, 20).map(function (s) {
          var offer = { '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name || '' } };
          if (s.price) offer.price = String(s.price);
          return offer;
        }),
      };
    }
    if (C.instagram) {
      schema.sameAs = ['https://instagram.com/' + String(C.instagram).replace(/^@/, '')];
    }

    // A favicon that needs no file: the initial on the accent colour.
    var initial = esc(String(name).trim().charAt(0).toUpperCase() || 'S');
    var favicon = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
      "<rect width='32' height='32' rx='7' fill='" + encodeURIComponent(acc) + "'/>" +
      "<text x='16' y='22' font-family='sans-serif' font-size='17' font-weight='bold' " +
      "text-anchor='middle' fill='" + encodeURIComponent(accFg) + "'>" + initial + '</text></svg>';

    var head = [
      '<meta charset="utf-8" />',
      '<meta name="viewport" content="width=device-width,initial-scale=1" />',
      '<title>' + esc(pageTitle) + '</title>',
      description ? '<meta name="description" content="' + esc(description) + '" />' : '',
      '<meta name="theme-color" content="' + esc(acc) + '" />',
      '<meta property="og:type" content="website" />',
      '<meta property="og:title" content="' + esc(pageTitle) + '" />',
      description ? '<meta property="og:description" content="' + esc(description) + '" />' : '',
      socialImage ? '<meta property="og:image" content="' + socialImage + '" />' : '',
      '<meta name="twitter:card" content="' + (socialImage ? 'summary_large_image' : 'summary') + '" />',
      '<link rel="icon" href="' + favicon + '" />',
      '<script type="application/ld+json">' + JSON.stringify(schema).replace(/</g, '\\u003c') + '<\/script>',
      '<style>' + css + '</style>',
    ].filter(Boolean).join('');

    return '<!doctype html><html lang="' + esc(primary) + '"' + (RTL[primary] ? ' dir="rtl"' : '') + '><head>' +
      head + '</head><body>' +
      nav + out.join('') + script + '</body></html>';
}

export { FONTS as CUSTOM_FONTS, LANGS as SITE_LANGS, I18N_KEYS };
