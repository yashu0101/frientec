/* ---------------------------------------------------------------------------
   Template registry.

   Every template is a function (demo) -> HTML string. The key is the demo's
   `template` field, so adding a new design is:
     1. write a function here
     2. register it in TEMPLATES below
     3. create the demo in the admin panel with template = <your key>

   Anything with template = "generic" is rendered by the generic engine from
   its colours and section list, which is how the other 14 categories work
   until you hand-build them.
--------------------------------------------------------------------------- */

  /* Sizes in these templates are `cqi`, not `vw`. A template is rendered into
     the preview frame, and in mobile mode that frame is 390px wide while the
     browser window behind it is not — so `7vw` asked the window and came back
     with 100px for a headline sitting in a 374px column. `cqi` asks the frame,
     which is the thing the design is actually laid out in. `.live .frame`
     carries `container-type:inline-size` to answer. Outside a container these
     fall back to the viewport, so nothing breaks if a template is ever
     rendered somewhere else. */
  var SERIF = 'Georgia,"Times New Roman",serif';
  var SANS = '"Inter","Helvetica Neue",Arial,sans-serif';
  var MONO = 'ui-monospace,"SF Mono",Menlo,Consolas,monospace';
  var PAD = 'padding:clamp(44px,7cqi,84px) clamp(18px,5cqi,64px);';

  function sec(inner, style) { return '<section style="' + PAD + (style || '') + '">' + inner + '</section>'; }
  function eyebrow(text, color, font) {
    return '<div style="font-family:' + (font || MONO) + ';font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:' + color + ';margin-bottom:14px;">' + text + '</div>';
  }
  function map(label, style) {
    return '<div style="' + style + 'display:flex;align-items:center;justify-content:center;font-family:' + MONO + ';font-size:11px;letter-spacing:.14em;">' + (label || 'GOOGLE MAP EMBED') + '</div>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  /* --- pictures ------------------------------------------------------------
     Every design used to show gradient blocks where the photographs go, which
     made a finished template look like a wireframe. These pull the generated
     photographs from public/img instead, shown as they were taken. No colour
     wash: a design carries its identity in its type, layout and buttons, which
     is where a real studio would put it — not by dyeing the photographs.

     Regenerate the art with `node tools/make-images.js`. */
  var CAT_OF = {
    'maison-noir': 'restaurants', 'urban-plate': 'restaurants', 'tandoor-lane': 'restaurants',
    smilecare: 'clinics', northline: 'clinics', 'aurum-health': 'clinics',
    'velvet-studio': 'salons', 'studio-ash': 'salons', 'neon-rouge': 'salons',
  };

  function hexA(hex, a) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (!isFinite(n)) return 'rgba(16,24,32,' + a + ')';
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* Six pictures per trade. Which six slots a design draws is derived from its
     own name, so the three restaurant designs do not all open with the same
     dining room, and a page that shows four pictures shows four different
     ones rather than cycling through three. */
  var VARIANTS = 6;

  /* Each design starts its photographs at a different offset — slot 0 opens on
     the hero, slot 1 on picture 2, slot 2 on picture 4 — so two designs for the
     same trade never show the same picture first. The slot is stamped on the
     design in seed.js. */
  function pick(slot, i) {
    var n = ((Number(slot) || 0) * 2 + i) % VARIANTS;
    return n === 0 ? 'hero' : n;
  }

  function photo(cat, v, style) {
    return '<div style="' + (style || '') +
      "background-image:url('/img/" + cat + '-' + v + "');" +
      'background-size:cover;background-position:center;"></div>';
  }


  /* --- Restaurant 01 — Maison Noir (dark, serif, fine dining) ------------- */
  function maisonNoir() {
    var g = '#C6A15B';
    return '<div style="background:#12100E;color:#EDE6DA;font-family:' + SERIF + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:20px clamp(18px,5cqi,64px);border-bottom:1px solid rgba(198,161,91,.22);position:sticky;top:0;background:rgba(18,16,14,.94);z-index:5;">' +
        '<div style="font-size:19px;letter-spacing:.26em;text-transform:uppercase;">Maison Noir</div>' +
        '<div style="display:flex;gap:26px;font-family:' + MONO + ';font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.75;"><span>Menu</span><span>Story</span><span>Gallery</span><span style="color:' + g + '">Reserve</span></div>' +
      '</nav>' +
      sec(eyebrow('Est. 2019 · Koregaon Park, Pune', g) +
        '<h1 style="font-size:clamp(38px,7cqi,76px);font-weight:400;line-height:1.06;margin:0 0 20px;">Eleven courses,<br><em style="color:' + g + '">one long evening.</em></h1>' +
        '<p style="max-width:520px;margin:0 auto 32px;line-height:1.75;opacity:.74;font-size:17px;">A tasting menu built around what the coast sent us this morning. Two seatings a night, twenty-four seats.</p>' +
        '<button style="background:' + g + ';color:#12100E;border:0;padding:15px 34px;font-family:' + MONO + ';font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;">Reserve a table</button>' +
        photo('restaurants', pick(0, 0), 'margin-top:56px;height:300px;border:1px solid rgba(198,161,91,.25);'),
        'text-align:center;padding-top:clamp(70px,11cqi,140px);background:radial-gradient(700px 320px at 50% 0%,rgba(198,161,91,.13),transparent 70%);') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px;align-items:center;max-width:980px;margin:0 auto;">' +
          photo('restaurants', pick(0, 1), 'height:340px;') + '<div>' + eyebrow('The kitchen', g) +
          '<h2 style="font-size:34px;font-weight:400;margin:0 0 18px;line-height:1.2;">We buy small and cook late.</h2>' +
          '<p style="line-height:1.85;opacity:.72;">Chef Ira Menon spent nine years cooking in Lisbon before opening Maison Noir with her brother. The menu changes every eleven days. Nothing is written down until the fish arrives.</p></div></div>',
        'border-top:1px solid rgba(198,161,91,.18);') +
      sec(eyebrow('Signatures', g) + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:26px;">' +
        [['Charred pomfret', 'burnt butter, curry leaf oil', '₹1,450'], ['Smoked bone marrow', 'sourdough, pickled shallot', '₹980'], ['Saffron kheer', 'pistachio brittle', '₹640']].map(function (d, i) {
          return '<div style="border-top:1px solid ' + g + ';padding-top:18px;">' + photo('restaurants', pick(0, i + 2), 'height:150px;margin-bottom:16px;') +
            '<div style="display:flex;justify-content:space-between;font-size:19px;"><span>' + d[0] + '</span><span style="color:' + g + '">' + d[2] + '</span></div>' +
            '<div style="opacity:.6;margin-top:6px;font-style:italic;">' + d[1] + '</div></div>';
        }).join('') + '</div>', 'background:#0D0C0B;') +
      sec(eyebrow('Guests', g) + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:30px;">' +
        [['The pacing is the point. Four hours went in twenty minutes.', 'Nikhil R.'], ['Best meal I have had in this city, and I eat out too much.', 'Priya S.'], ['Ask for the corner two-top by the window.', 'Aditya M.']].map(function (t) {
          return '<div><div style="color:' + g + ';font-size:22px;">★★★★★</div><p style="font-size:18px;line-height:1.7;font-style:italic;margin:12px 0;">&ldquo;' + t[0] + '&rdquo;</p>' +
            '<div style="font-family:' + MONO + ';font-size:11px;opacity:.6;letter-spacing:.1em;">— ' + t[1] + '</div></div>';
        }).join('') + '</div>') +
      sec('<div>' + eyebrow('Hours', g) + '<div style="line-height:2;opacity:.8;">Tue – Sun · 7:00 pm &amp; 9:30 pm<br>Closed Mondays<br>Kitchen closes 11:45 pm</div></div>' +
          '<div>' + eyebrow('Find us', g) + '<div style="line-height:2;opacity:.8;">3 Lane 6, Koregaon Park<br>Pune 411001<br>+91 98765 43210</div></div>' +
          '<div>' + eyebrow('Map', g) + map('GOOGLE MAP EMBED', 'height:130px;border:1px solid rgba(198,161,91,.3);opacity:.5;') + '</div>',
        'background:#0D0C0B;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:36px;') +
      '<footer style="padding:36px clamp(18px,5cqi,64px);border-top:1px solid rgba(198,161,91,.2);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:' + MONO + ';font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;"><span>Maison Noir · fictional demo restaurant</span><span>Instagram · Facebook</span></footer></div>';
  }

  /* --- Restaurant 02 — Urban Plate (light, modern bistro) ----------------- */
  function urbanPlate() {
    var g = '#1F9D6B';
    return '<div style="background:#fff;color:#14322A;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:16px clamp(18px,5cqi,56px);position:sticky;top:0;background:rgba(255,255,255,.95);border-bottom:1px solid #E7EDEA;z-index:5;">' +
        '<div style="font-weight:800;font-size:20px;letter-spacing:-.02em;">Urban<span style="color:' + g + '">Plate</span></div>' +
        '<div style="display:flex;gap:22px;align-items:center;font-size:14px;font-weight:500;"><span>Menu</span><span>About</span><span>Gallery</span>' +
        '<button style="background:' + g + ';color:#fff;border:0;padding:10px 16px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;">Order on WhatsApp</button></div></nav>' +
      sec('<div><div style="display:inline-block;background:#E4F4EC;color:' + g + ';padding:6px 12px;border-radius:999px;font-size:12.5px;font-weight:700;margin-bottom:18px;">Open today until 11 pm</div>' +
          '<h1 style="font-size:clamp(36px,6cqi,60px);font-weight:800;letter-spacing:-.033em;line-height:1.02;margin:0 0 18px;">All-day kitchen on FC Road.</h1>' +
          '<p style="font-size:18px;line-height:1.7;color:#4A6157;margin:0 0 26px;max-width:460px;">Breakfast bowls, wood-fired pizza and filter coffee. Dine in, take away, or send us a WhatsApp and we will have it ready.</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;"><button style="background:#14322A;color:#fff;border:0;padding:14px 22px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;">See the menu</button>' +
          '<button style="background:#fff;color:#14322A;border:1px solid #D3E0DA;padding:14px 22px;border-radius:10px;font-weight:600;font-size:15px;cursor:pointer;">Book a table</button></div></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' + photo('restaurants', pick(1, 0), 'height:250px;border-radius:14px;') +
          '<div style="display:grid;gap:12px;">' + photo('restaurants', pick(1, 1), 'height:119px;border-radius:14px;') + photo('restaurants', pick(1, 2), 'height:119px;border-radius:14px;') + '</div></div>',
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:44px;align-items:center;background:linear-gradient(180deg,#F4FAF7,#fff);') +
      sec(eyebrow('Most ordered', g) + '<h2 style="font-size:32px;font-weight:800;letter-spacing:-.03em;margin:0 0 28px;">What regulars keep coming back for</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;">' +
        [['Truffle mushroom pizza', '₹480', '#9BD3B8'], ['Kolhapuri chicken bowl', '₹360', '#F0C070'], ['Cold brew tonic', '₹220', '#A8C8E0'], ['Chocolate babka', '₹180', '#C9A98B']].map(function (d, i) {
          return '<div style="border:1px solid #E7EDEA;border-radius:14px;overflow:hidden;">' + photo('restaurants', pick(1, i + 3), 'height:130px;') +
            '<div style="padding:14px;"><div style="font-weight:700;margin-bottom:4px;">' + d[0] + '</div><div style="color:' + g + ';font-weight:700;">' + d[1] + '</div></div></div>';
        }).join('') + '</div>') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:34px;">' +
        [['Breakfast', ['Akuri on sourdough — ₹240', 'Poha bowl — ₹160', 'Banana oat pancakes — ₹280']],
         ['Mains', ['Margherita — ₹420', 'Butter garlic prawns — ₹560', 'Paneer tikka rice bowl — ₹340']],
         ['Drinks', ['Filter coffee — ₹90', 'Masala chaas — ₹110', 'Kokum cooler — ₹150']]].map(function (b) {
          return '<div><h3 style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:' + g + ';margin:0 0 14px;font-family:' + MONO + '">' + b[0] + '</h3>' +
            b[1].map(function (i) { return '<div style="padding:11px 0;border-bottom:1px dashed #DCE7E2;font-size:15px;">' + i + '</div>'; }).join('') + '</div>';
        }).join('') + '</div>', 'background:#F7FAF9;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">' +
        ['#2FBE86', '#F3C969', '#8CC1AC', '#D89B2C', '#14322A', '#CFE8DD'].map(function (c) { return '<div style="height:140px;border-radius:12px;background:' + c + ';opacity:.85;"></div>'; }).join('') + '</div>') +
      sec('<div><h4 style="margin:0 0 8px;">Hours</h4><div style="opacity:.78;line-height:1.9;font-size:14.5px;">Mon–Fri 8 am – 11 pm<br>Sat–Sun 8 am – midnight</div></div>' +
          '<div><h4 style="margin:0 0 8px;">Address</h4><div style="opacity:.78;line-height:1.9;font-size:14.5px;">112 FC Road, Shivajinagar<br>Pune 411005</div></div>' +
          '<div><h4 style="margin:0 0 8px;">Order</h4><div style="opacity:.78;line-height:1.9;font-size:14.5px;">WhatsApp +91 98765 43210<br>Delivery within 4 km</div></div>' +
          map('GOOGLE MAP', 'background:rgba(255,255,255,.08);border-radius:12px;min-height:130px;opacity:.6;'),
        'background:#14322A;color:#fff;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px;') +
      '<footer style="padding:24px clamp(18px,5cqi,56px);background:#0F251F;color:rgba(255,255,255,.5);font-size:13px;">Urban Plate — a fictional demo restaurant.</footer></div>';
  }

  /* --- Restaurant 03 — Tandoor Lane (street food) ------------------------- */
  function tandoorLane() {
    var o = '#F2541B';
    return '<div style="background:#FFE9B0;color:#1A1004;font-family:' + MONO + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:14px clamp(16px,5cqi,48px);background:#1A1004;color:#FFE9B0;position:sticky;top:0;z-index:5;">' +
        '<div style="font-weight:700;letter-spacing:.2em;font-size:15px;">TANDOOR LANE</div>' +
        '<div style="background:' + o + ';color:#fff;padding:8px 14px;font-size:11px;letter-spacing:.16em;font-weight:700;">OPEN TILL 2 AM</div></nav>' +
      sec('<div style="border:3px solid #1A1004;background:' + o + ';color:#FFE9B0;padding:clamp(26px,5cqi,52px);box-shadow:10px 10px 0 #1A1004;">' +
        '<div style="font-size:11px;letter-spacing:.3em;margin-bottom:16px;">SINCE 1994 · CAMP, PUNE</div>' +
        '<h1 style="font-size:clamp(34px,8cqi,78px);line-height:.96;margin:0 0 20px;font-weight:700;letter-spacing:-.02em;font-family:' + SANS + '">KABABS.<br>LATE NIGHTS.<br>NO CUTLERY.</h1>' +
        '<p style="max-width:460px;line-height:1.7;font-size:14px;margin-bottom:26px;">Four charcoal grills, one narrow lane, and a queue that starts at nine. Parcel available. Cash and UPI.</p>' +
        '<button style="background:#1A1004;color:#FFE9B0;border:0;padding:16px 26px;font-family:' + MONO + ';font-size:12px;letter-spacing:.2em;font-weight:700;cursor:pointer;">ORDER ON WHATSAPP →</button></div>', 'padding-bottom:30px;') +
      sec('<div style="font-size:11px;letter-spacing:.3em;margin-bottom:16px;">TODAY\'S BOARD</div><div style="border:3px solid #1A1004;background:#1A1004;color:#FFE9B0;">' +
        [['SEEKH KABAB', '6 PCS', '₹220'], ['CHICKEN TIKKA', '8 PCS', '₹280'], ['TANDOORI PANEER', '6 PCS', '₹240'], ['ROOMALI ROTI', '2 PCS', '₹60'], ['MALAI KULFI', '1 PC', '₹80']].map(function (r, i) {
          return '<div style="display:grid;grid-template-columns:1fr auto 90px;gap:14px;padding:16px 20px;' + (i < 4 ? 'border-bottom:1px dashed rgba(255,233,176,.3);' : '') + 'font-size:14px;letter-spacing:.08em;">' +
            '<span style="font-weight:700;">' + r[0] + '</span><span style="opacity:.55;">' + r[1] + '</span><span style="color:#FFB302;text-align:right;font-weight:700;">' + r[2] + '</span></div>';
        }).join('') + '</div>', 'padding-top:20px;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">' +
        ['#F2541B', '#1A1004', '#FFB302', '#8C2B10'].map(function (c, i) { return photo('restaurants', pick(2, i), 'height:150px;border:3px solid #1A1004;'); }).join('') + '</div>', 'padding-top:0;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:26px;">' +
        [['Ten years, same taste. That is the whole review.', 'SANDEEP J.'], ['Go at 11 pm. Trust me on this.', 'RIYA T.'], ['Best seekh in the city, and it is not close.', 'IMRAN K.']].map(function (t) {
          return '<div style="border:2px solid rgba(255,233,176,.35);padding:20px;"><div style="color:#FFB302;letter-spacing:.2em;margin-bottom:10px;">★★★★★</div>' +
            '<p style="line-height:1.7;font-size:13.5px;margin:0 0 12px;">"' + t[0] + '"</p><div style="font-size:10.5px;letter-spacing:.22em;opacity:.6;">' + t[1] + '</div></div>';
        }).join('') + '</div>', 'background:#1A1004;color:#FFE9B0;') +
      sec('<div><div style="font-size:11px;letter-spacing:.28em;margin-bottom:12px;">TIMINGS</div><div style="line-height:2;font-size:13.5px;">DAILY 6 PM – 2 AM<br>CLOSED ON EID</div></div>' +
          '<div><div style="font-size:11px;letter-spacing:.28em;margin-bottom:12px;">FIND US</div><div style="line-height:2;font-size:13.5px;">LANE 4, CAMP<br>PUNE 411001<br>+91 98765 43210</div></div>' +
          map('GOOGLE MAP', 'border:3px solid #1A1004;min-height:120px;'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:26px;') +
      '<footer style="background:#1A1004;color:rgba(255,233,176,.55);padding:22px clamp(16px,5cqi,48px);font-size:11px;letter-spacing:.16em;">TANDOOR LANE — FICTIONAL DEMO BUSINESS</footer></div>';
  }

  /* --- Clinic 01 — SmileCare ---------------------------------------------- */
  function smileCare() {
    var b = '#1273C4';
    return '<div style="background:#fff;color:#0B2B45;font-family:' + SANS + '">' +
      '<div style="background:#0B2B45;color:#fff;padding:8px clamp(18px,5cqi,56px);font-size:13px;display:flex;gap:20px;flex-wrap:wrap;"><span>☎ +91 98765 43210</span><span>◷ Mon–Sat, 9 am – 8 pm</span></div>' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:16px clamp(18px,5cqi,56px);border-bottom:1px solid #E4EDF4;position:sticky;top:0;background:#fff;z-index:5;">' +
        '<div style="font-weight:800;font-size:20px;color:' + b + '">SmileCare<span style="color:#0B2B45"> Dental</span></div>' +
        '<div style="display:flex;gap:20px;align-items:center;font-size:14px;font-weight:500;"><span>Services</span><span>Doctors</span><span>About</span>' +
        '<button style="background:' + b + ';color:#fff;border:0;padding:10px 16px;border-radius:8px;font-weight:600;cursor:pointer;">Book appointment</button></div></nav>' +
      sec('<div>' + eyebrow('Dental care in Baner, Pune', b, SANS) +
          '<h1 style="font-size:clamp(34px,5.5cqi,54px);font-weight:800;letter-spacing:-.033em;line-height:1.04;margin:0 0 18px;">Painless dentistry, explained before it happens.</h1>' +
          '<p style="font-size:17px;line-height:1.75;color:#40607A;margin-bottom:26px;max-width:470px;">Digital X-rays, single-visit root canals and a treatment plan you approve before we start. Same-day emergency slots kept open daily.</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;"><button style="background:' + b + ';color:#fff;border:0;padding:14px 22px;border-radius:9px;font-weight:600;font-size:15px;cursor:pointer;">Book an appointment</button>' +
          '<button style="background:#fff;border:1px solid #C9DCEA;padding:14px 22px;border-radius:9px;font-weight:600;font-size:15px;color:#0B2B45;cursor:pointer;">Call the clinic</button></div>' +
          '<div style="display:flex;gap:26px;margin-top:30px;flex-wrap:wrap;">' +
          [['12', 'years running'], ['4', 'dentists'], ['6,000+', 'treatments']].map(function (s) {
            return '<div><div style="font-size:25px;font-weight:800;color:' + b + '">' + s[0] + '</div><div style="font-size:12.5px;color:#6B849A;">' + s[1] + '</div></div>';
          }).join('') + '</div></div>' +
          photo('clinics', pick(0, 0), 'height:340px;border-radius:16px;'),
        'background:#F3F8FC;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:44px;align-items:center;') +
      sec('<h2 style="font-size:30px;font-weight:800;letter-spacing:-.03em;margin:0 0 8px;">Treatments we offer</h2>' +
        '<p style="color:#6B849A;margin:0 0 28px;">Every treatment is quoted in writing before it begins.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">' +
        [['Root canal', 'Single sitting, 45–60 minutes'], ['Braces &amp; aligners', 'Metal, ceramic and clear options'], ['Implants', 'Titanium implants with 10-year warranty'], ['Teeth whitening', 'In-clinic, one session'], ["Kids' dentistry", 'Sealants, fillings, first visits'], ['Emergency care', 'Same-day slots, 9 am – 8 pm']].map(function (s, i) {
          return '<div style="border:1px solid #E4EDF4;border-radius:12px;padding:20px;"><div style="width:38px;height:38px;border-radius:9px;background:#E8F3FB;display:grid;place-items:center;margin-bottom:14px;color:' + b + ';font-weight:700;">✓</div>' +
            '<div style="font-weight:700;margin-bottom:6px;">' + s[0] + '</div><div style="font-size:14px;color:#6B849A;line-height:1.6;">' + s[1] + '</div></div>';
        }).join('') + '</div>') +
      sec('<h2 style="font-size:30px;font-weight:800;letter-spacing:-.03em;margin:0 0 26px;">Meet the dentists</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:18px;">' +
        [['Dr. Kavita Rao', 'BDS, MDS — Endodontics', '16 yrs'], ['Dr. Sameer Joshi', 'BDS — Implantology', '11 yrs'], ['Dr. Neha Prabhu', 'BDS, MDS — Orthodontics', '9 yrs'], ['Dr. Arjun Menon', 'BDS — Paediatric dentistry', '7 yrs']].map(function (d, i) {
          return '<div style="background:#fff;border:1px solid #E4EDF4;border-radius:12px;overflow:hidden;">' + photo('clinics', pick(0, i + 1), 'height:160px;') +
            '<div style="padding:16px;"><div style="font-weight:700;">' + d[0] + '</div><div style="font-size:13.5px;color:#6B849A;margin:5px 0;">' + d[1] + '</div>' +
            '<div style="font-size:12px;color:' + b + ';font-weight:600;">' + d[2] + ' experience</div></div></div>';
        }).join('') + '</div>', 'background:#F3F8FC;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;">' +
        [['Explained every step before doing it. First time I have not dreaded a dental visit.', 'Manisha K.'], ['Took my son in at 8 pm for a chipped tooth. Sorted in thirty minutes.', 'Rahul D.'], ['Quoted ₹18,000 for the implant and charged exactly that.', 'Feroz A.']].map(function (t) {
          return '<div style="border:1px solid #E4EDF4;border-radius:12px;padding:22px;"><div style="color:#F5A623;margin-bottom:10px;">★★★★★</div>' +
            '<p style="line-height:1.7;margin:0 0 14px;">&ldquo;' + t[0] + '&rdquo;</p><div style="font-size:13px;font-weight:600;color:#6B849A;">' + t[1] + '</div></div>';
        }).join('') + '</div>') +
      sec('<h2 style="font-size:32px;font-weight:800;letter-spacing:-.03em;margin:0 0 12px;">Book an appointment</h2>' +
        '<p style="opacity:.88;margin-bottom:24px;">Pick a slot online or call us. We confirm on WhatsApp within an hour.</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;"><button style="background:#fff;color:' + b + ';border:0;padding:14px 26px;border-radius:9px;font-weight:700;font-size:15px;cursor:pointer;">Choose a time</button>' +
        '<button style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.55);padding:14px 26px;border-radius:9px;font-weight:600;font-size:15px;cursor:pointer;">WhatsApp us</button></div>',
        'background:' + b + ';color:#fff;text-align:center;') +
      sec('<div><h4 style="margin:0 0 10px;">Hours</h4><div style="color:#6B849A;line-height:1.9;font-size:14.5px;">Mon–Sat 9 am – 8 pm<br>Sunday 10 am – 2 pm</div></div>' +
          '<div><h4 style="margin:0 0 10px;">Address</h4><div style="color:#6B849A;line-height:1.9;font-size:14.5px;">2nd floor, Sunrise Plaza<br>Baner Road, Pune 411045</div></div>' +
          map('Google Map embed', 'background:#F3F8FC;border:1px solid #E4EDF4;border-radius:12px;min-height:130px;color:#8FA9BE;'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:30px;') +
      '<footer style="background:#0B2B45;color:rgba(255,255,255,.55);padding:24px clamp(18px,5cqi,56px);font-size:13px;">SmileCare Dental — a fictional demo clinic.</footer></div>';
  }

  /* --- Clinic 02 — Northline (minimal) ------------------------------------ */
  function northline() {
    var g = '#3A6B4C';
    var lbl = function (t) { return '<div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8A8A82;margin-bottom:22px;">' + t + '</div>'; };
    return '<div style="background:#FAFAF8;color:#1C1C1A;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:22px clamp(18px,6cqi,72px);position:sticky;top:0;background:rgba(250,250,248,.94);z-index:5;">' +
        '<div style="font-family:' + SERIF + ';font-size:19px;">Northline</div>' +
        '<div style="display:flex;gap:26px;font-size:13.5px;color:#5B5B55;"><span>Services</span><span>Doctors</span><span>Visit</span><span style="color:' + g + ';font-weight:600;">Appointment</span></div></nav>' +
      sec(lbl('Family practice · Aundh, Pune') +
        '<h1 style="font-family:' + SERIF + ';font-size:clamp(34px,6cqi,58px);font-weight:400;line-height:1.14;margin:0 0 24px;">A family doctor who has time for the whole appointment.</h1>' +
        '<p style="font-size:18px;line-height:1.85;color:#54544D;max-width:560px;margin:0 0 30px;">Twenty-minute consultations, no walk-in queue, and one doctor who knows your history. General medicine, paediatrics and preventive check-ups.</p>' +
        '<button style="background:' + g + ';color:#fff;border:0;padding:14px 24px;border-radius:3px;font-weight:600;font-size:15px;cursor:pointer;">Request an appointment</button>',
        'max-width:820px;margin:0 auto;padding-top:clamp(60px,9cqi,120px);') +
      sec(photo('clinics', pick(1, 0), 'height:260px;'), 'max-width:820px;margin:0 auto;padding-top:0;') +
      sec(lbl('What we treat') +
        [['General medicine', 'Fever, infections, blood pressure, diabetes management'], ['Paediatrics', 'Vaccinations, growth checks, childhood illnesses'], ['Preventive health', 'Annual check-ups, blood work, lifestyle counselling'], ["Women's health", 'Routine screening, menopause care, referrals']].map(function (r) {
          return '<div style="display:grid;grid-template-columns:200px 1fr;gap:24px;padding:20px 0;border-bottom:1px solid #E5E5DF;"><div style="font-weight:600;">' + r[0] + '</div><div style="color:#6B6B63;line-height:1.7;">' + r[1] + '</div></div>';
        }).join(''), 'max-width:820px;margin:0 auto;border-top:1px solid #E5E5DF;') +
      sec(lbl('Doctors') + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:26px;">' +
        [['Dr. Vandana Kale', 'MBBS, MD — General medicine'], ['Dr. Rohan Iyer', 'MBBS, DCH — Paediatrics']].map(function (d, i) {
          return '<div>' + photo('clinics', pick(1, i + 1), 'height:210px;margin-bottom:14px;') +
            '<div style="font-family:' + SERIF + ';font-size:19px;">' + d[0] + '</div><div style="color:#6B6B63;font-size:14px;margin-top:4px;">' + d[1] + '</div></div>';
        }).join('') + '</div>', 'max-width:820px;margin:0 auto;') +
      sec(lbl('How a visit works') +
        ['Request a slot online or by phone. We confirm within two hours.', 'Arrive five minutes early. There is no waiting queue — slots are held.', 'Twenty minutes with the doctor. Prescriptions sent to you on WhatsApp.', 'Follow-up call after three days if you were prescribed antibiotics.'].map(function (s, i) {
          return '<div style="display:flex;gap:18px;padding:14px 0;"><div style="font-family:' + MONO + ';color:' + g + ';font-size:13px;">' + String(i + 1).padStart(2, '0') + '</div><div style="color:#54544D;line-height:1.7;">' + s + '</div></div>';
        }).join(''), 'max-width:820px;margin:0 auto;border-top:1px solid #E5E5DF;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:28px;">' +
        [['HOURS', 'Mon–Fri 10 am – 7 pm<br>Sat 10 am – 2 pm'], ['ADDRESS', '7 Parihar Chowk<br>Aundh, Pune 411007'], ['CONTACT', '+91 98765 43210<br>hello@northline.example']].map(function (c) {
          return '<div><div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.2em;color:#8A8A82;margin-bottom:12px;">' + c[0] + '</div><div style="line-height:1.9;color:#54544D;">' + c[1] + '</div></div>';
        }).join('') + '</div>', 'max-width:820px;margin:0 auto;background:#F1F2ED;border-top:1px solid #E5E5DF;') +
      '<footer style="padding:26px clamp(18px,6cqi,72px);color:#8A8A82;font-size:13px;border-top:1px solid #E5E5DF;">Northline Family Practice — a fictional demo clinic.</footer></div>';
  }

  /* --- Clinic 03 — Aurum Health (premium) --------------------------------- */
  function aurumHealth() {
    var p = '#8B6CC4';
    return '<div style="background:#F7F4FB;color:#241E2B;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:18px clamp(18px,5cqi,60px);background:#241E2B;color:#fff;position:sticky;top:0;z-index:5;">' +
        '<div style="font-family:' + SERIF + ';font-size:21px;letter-spacing:.06em;">Aurum <span style="color:#C9B5EC">Health</span></div>' +
        '<div style="display:flex;gap:22px;align-items:center;font-size:14px;"><span style="opacity:.8">Specialities</span><span style="opacity:.8">Consultants</span>' +
        '<button style="background:' + p + ';color:#fff;border:0;padding:10px 18px;border-radius:999px;font-weight:600;cursor:pointer;">Book consultation</button></div></nav>' +
      sec(eyebrow('Preventive &amp; specialist care · Kalyani Nagar', p) +
        '<h1 style="font-family:' + SERIF + ';font-weight:400;font-size:clamp(34px,6cqi,58px);line-height:1.12;margin:0 auto 20px;max-width:780px;">Health care that starts with an hour of listening.</h1>' +
        '<p style="max-width:560px;margin:0 auto 30px;font-size:17.5px;line-height:1.8;color:#5B5069;">Annual health programmes, specialist consultations and a care manager assigned to every member.</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:46px;">' +
        '<button style="background:#241E2B;color:#fff;border:0;padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;cursor:pointer;">Book a consultation</button>' +
        '<button style="background:#fff;border:1px solid #D8CCEC;padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;color:#241E2B;cursor:pointer;">See health plans</button></div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;max-width:940px;margin:0 auto;">' +
        ['#C9B5EC', '#8B6CC4', '#5D4A80', '#E3D8F5'].map(function (c, i) { return photo('clinics', pick(2, i), 'height:200px;border-radius:18px;'); }).join('') + '</div>',
        'text-align:center;background:linear-gradient(180deg,#EDE6F8,#F7F4FB);') +
      sec('<h2 style="font-family:' + SERIF + ';font-weight:400;font-size:34px;margin:0 0 26px;text-align:center;">Specialities</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">' +
        [['Cardiology', 'Screening, ECG, stress testing and long-term management'], ['Endocrinology', 'Diabetes, thyroid and hormonal health'], ['Nutrition', 'Plans built around what you actually eat'], ['Physiotherapy', 'In-clinic and at-home sessions'], ['Diagnostics', 'In-house lab with same-day reports'], ['Mental health', 'Confidential counselling, in person or online']].map(function (s) {
          return '<div style="background:#fff;border-radius:16px;padding:24px;border:1px solid #E7DFF3;"><div style="font-family:' + SERIF + ';font-size:21px;margin-bottom:8px;">' + s[0] + '</div>' +
            '<div style="color:#6B6076;line-height:1.7;font-size:14.5px;">' + s[1] + '</div></div>';
        }).join('') + '</div>') +
      sec('<h2 style="font-family:' + SERIF + ';font-weight:400;font-size:34px;margin:0 0 26px;">Health plans</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">' +
        [['Essential', '₹12,000 / year', ['Annual full-body check', '2 specialist consults', 'Care manager on WhatsApp']],
         ['Complete', '₹28,000 / year', ['Twice-yearly check', 'Unlimited consults', 'Home sample collection', 'Nutrition plan']],
         ['Family', '₹65,000 / year', ['Cover for four', 'Paediatric care included', 'Priority appointments']]].map(function (pl, i) {
          return '<div style="background:' + (i === 1 ? p : 'rgba(255,255,255,.06)') + ';border-radius:18px;padding:26px;border:1px solid rgba(255,255,255,.14);">' +
            '<div style="font-family:' + SERIF + ';font-size:24px;margin-bottom:6px;">' + pl[0] + '</div><div style="font-size:17px;opacity:.85;margin-bottom:18px;">' + pl[1] + '</div>' +
            pl[2].map(function (x) { return '<div style="padding:6px 0;font-size:14.5px;opacity:.9;">✓ &nbsp;' + x + '</div>'; }).join('') + '</div>';
        }).join('') + '</div>', 'background:#241E2B;color:#fff;') +
      sec('<div><h4 style="margin:0 0 10px;">Hours</h4><div style="color:#6B6076;line-height:1.9;">Mon–Sat 8 am – 8 pm<br>Sunday by appointment</div></div>' +
          '<div><h4 style="margin:0 0 10px;">Address</h4><div style="color:#6B6076;line-height:1.9;">Aurum House, Kalyani Nagar<br>Pune 411006</div></div>' +
          map('Google Map embed', 'background:#EDE6F8;border-radius:16px;min-height:130px;color:#8B7CA0;'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;') +
      '<footer style="background:#1B1621;color:rgba(255,255,255,.5);padding:26px clamp(18px,5cqi,60px);font-size:13px;">Aurum Health — a fictional demo clinic.</footer></div>';
  }

  /* --- Salon 01 — Velvet Studio ------------------------------------------- */
  function velvetStudio() {
    var r = '#B4587A';
    return '<div style="background:#FBF2F5;color:#2A1620;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:20px clamp(18px,5cqi,60px);position:sticky;top:0;background:rgba(251,242,245,.95);z-index:5;">' +
        '<div style="font-family:' + SERIF + ';font-size:22px;letter-spacing:.1em;">Velvet Studio</div>' +
        '<div style="display:flex;gap:22px;align-items:center;font-size:14px;"><span>Services</span><span>Prices</span><span>Gallery</span>' +
        '<button style="background:' + r + ';color:#fff;border:0;padding:11px 20px;border-radius:999px;font-weight:600;cursor:pointer;">Book now</button></div></nav>' +
      sec('<div>' + eyebrow('Hair · Skin · Nails · Bridal', r) +
          '<h1 style="font-family:' + SERIF + ';font-weight:400;font-size:clamp(36px,6.5cqi,62px);line-height:1.08;margin:0 0 20px;">The chair you book<br>two weeks ahead.</h1>' +
          '<p style="font-size:17px;line-height:1.8;color:#6A4E5A;margin-bottom:28px;max-width:420px;">Balayage, keratin, bridal packages and a colour bar run by stylists trained in Mumbai and Milan.</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;"><button style="background:#2A1620;color:#fff;border:0;padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;cursor:pointer;">Book an appointment</button>' +
          '<button style="background:transparent;border:1px solid #E0C4CF;padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;color:#2A1620;cursor:pointer;">WhatsApp us</button></div></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' + photo('salons', pick(0, 0), 'height:320px;border-radius:200px;') +
          '<div style="display:grid;gap:12px;">' + photo('salons', pick(0, 1), 'height:154px;border-radius:18px;') + photo('salons', pick(0, 2), 'height:154px;border-radius:18px;') + '</div></div>',
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:44px;align-items:center;') +
      sec('<h2 style="font-family:' + SERIF + ';font-weight:400;font-size:34px;margin:0 0 8px;">Price list</h2>' +
        '<p style="color:#8A6A76;margin:0 0 28px;">Prices vary with hair length. Consultation is free.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:34px;">' +
        [['Hair', [['Cut &amp; style', '₹900'], ['Global colour', '₹3,500'], ['Balayage', '₹6,500'], ['Keratin treatment', '₹7,000']]],
         ['Skin &amp; nails', [['Hydrafacial', '₹2,800'], ['Clean-up', '₹1,200'], ['Gel manicure', '₹1,400'], ['Pedicure', '₹1,100']]],
         ['Bridal', [['Bridal makeup', '₹18,000'], ['Engagement look', '₹9,000'], ['Family package', 'On request'], ['Trial session', '₹4,000']]]].map(function (b) {
          return '<div><div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:' + r + ';margin-bottom:14px;">' + b[0] + '</div>' +
            b[1].map(function (row) { return '<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #F0E2E7;font-size:15px;"><span>' + row[0] + '</span><span style="font-weight:700;">' + row[1] + '</span></div>'; }).join('') + '</div>';
        }).join('') + '</div>', 'background:#fff;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;">' +
        ['#E8BCCD', '#B4587A', '#7C3F55', '#F3DDE4', '#C98BA0', '#2A1620'].map(function (c) { return '<div style="height:170px;border-radius:14px;background:' + c + ';"></div>'; }).join('') + '</div>') +
      sec('<h2 style="font-family:' + SERIF + ';font-weight:400;font-size:34px;margin:0 0 26px;">The team</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:20px;">' +
        [['Tanvi Shah', 'Creative director'], ['Zoya Khan', 'Colour specialist'], ['Ritu Mehra', 'Bridal makeup'], ['Aman Verma', 'Senior stylist']].map(function (t, i) {
          return '<div style="text-align:center;">' + photo('salons', pick(0, i + 3), 'height:190px;border-radius:14px;margin-bottom:12px;') +
            '<div style="font-family:' + SERIF + ';font-size:19px;">' + t[0] + '</div><div style="color:#8A6A76;font-size:13.5px;margin-top:3px;">' + t[1] + '</div></div>';
        }).join('') + '</div>', 'background:#fff;') +
      sec('<h2 style="font-family:' + SERIF + ';font-weight:400;font-size:34px;margin:0 0 12px;">Book your chair</h2>' +
        '<p style="opacity:.9;margin-bottom:24px;">Weekends fill up by Wednesday. Message us to hold a slot.</p>' +
        '<button style="background:#fff;color:' + r + ';border:0;padding:15px 30px;border-radius:999px;font-weight:700;font-size:15px;cursor:pointer;">WhatsApp to book</button>',
        'background:' + r + ';color:#fff;text-align:center;') +
      sec('<div><h4 style="margin:0 0 10px;">Hours</h4><div style="color:#8A6A76;line-height:1.9;">Tue–Sun 10 am – 9 pm<br>Closed Mondays</div></div>' +
          '<div><h4 style="margin:0 0 10px;">Address</h4><div style="color:#8A6A76;line-height:1.9;">Shop 4, Ivy Arcade<br>Kalyani Nagar, Pune</div></div>' +
          map('Google Map embed', 'background:#fff;border-radius:14px;min-height:130px;color:#C2A3AE;'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;') +
      '<footer style="background:#2A1620;color:rgba(255,255,255,.5);padding:26px clamp(18px,5cqi,60px);font-size:13px;">Velvet Studio — a fictional demo salon.</footer></div>';
  }

  /* --- Salon 02 — Studio Ash (swiss minimal) ------------------------------ */
  function studioAsh() {
    var lbl = function (t) { return '<div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8A8A84;">' + t + '</div>'; };
    return '<div style="background:#F0F0EE;color:#191919;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:20px clamp(18px,6cqi,64px);border-bottom:1px solid #DCDCD8;position:sticky;top:0;background:#F0F0EE;z-index:5;">' +
        '<div style="font-weight:700;letter-spacing:.24em;font-size:13px;">STUDIO ASH</div>' +
        '<div style="display:flex;gap:24px;font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;color:#5A5A56;"><span>Services</span><span>Prices</span><span>Book</span></div></nav>' +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;align-items:end;">' +
        '<h1 style="font-size:clamp(40px,9cqi,96px);margin:0;line-height:.92;font-weight:800;letter-spacing:-.04em;">Cut.<br>Colour.<br>Nothing else.</h1>' +
        '<p style="font-size:16.5px;line-height:1.8;color:#55554F;max-width:380px;">A two-chair studio in Kothrud. One stylist, one appointment at a time, ninety minutes each. No packages, no upselling.</p></div>' +
        photo('salons', pick(1, 0), 'height:340px;margin-top:44px;'), 'padding-top:clamp(50px,8cqi,110px);') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:30px;">' + lbl('Services') + '<div style="grid-column:span 3;min-width:0;">' +
        [['Precision cut', '90 min', '₹1,600'], ['Colour, single process', '150 min', '₹4,200'], ['Balayage', '210 min', '₹7,800'], ['Treatment &amp; blow-dry', '60 min', '₹1,900']].map(function (s) {
          return '<div style="display:grid;grid-template-columns:1fr 90px 90px;padding:18px 0;border-bottom:1px solid #DCDCD8;font-size:16px;"><span style="font-weight:600;">' + s[0] + '</span>' +
            '<span style="color:#8A8A84;font-size:14px;">' + s[1] + '</span><span style="text-align:right;font-weight:600;">' + s[2] + '</span></div>';
        }).join('') + '</div></div>', 'border-top:1px solid #DCDCD8;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">' +
        ['#B9B9B3', '#6F7B75', '#8E9A94', '#D5D5CF'].map(function (c) { return '<div style="height:220px;background:' + c + ';"></div>'; }).join('') + '</div>') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:30px;">' + lbl('Stylists') +
        '<div style="grid-column:span 3;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;">' +
        [['Ash Kulkarni', 'Owner, cutting'], ['Devika Rane', 'Colour']].map(function (t, i) {
          return '<div>' + photo('salons', pick(1, i + 1), 'height:200px;margin-bottom:12px;') + '<div style="font-weight:600;">' + t[0] + '</div><div style="color:#77776F;font-size:14px;margin-top:3px;">' + t[1] + '</div></div>';
        }).join('') + '</div></div>', 'border-top:1px solid #DCDCD8;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:30px;">' +
        '<div><h2 style="font-size:34px;margin:0 0 14px;font-weight:800;letter-spacing:-.03em;">Book a chair</h2>' +
        '<p style="opacity:.7;line-height:1.8;margin-bottom:22px;">Appointments only. Message on WhatsApp with the service and your preferred day.</p>' +
        '<button style="background:#F0F0EE;color:#191919;border:0;padding:14px 24px;font-weight:600;font-size:15px;cursor:pointer;">WhatsApp to book</button></div>' +
        '<div style="opacity:.72;line-height:2;font-size:14.5px;">TUE–SAT 11 AM – 8 PM<br>SUN 11 AM – 5 PM<br>CLOSED MON</div>' +
        '<div style="opacity:.72;line-height:2;font-size:14.5px;">18 Karve Road<br>Kothrud, Pune 411038<br>+91 98765 43210</div></div>',
        'background:#191919;color:#F0F0EE;') +
      '<footer style="padding:24px clamp(18px,6cqi,64px);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8A8A84;">Studio Ash — fictional demo salon</footer></div>';
  }

  /* --- Salon 03 — Neon Rouge (bold fashion) ------------------------------- */
  function neonRouge() {
    var n = '#FF2E63';
    return '<div style="background:#0D0D12;color:#F2F2F5;font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:18px clamp(18px,5cqi,60px);position:sticky;top:0;background:rgba(13,13,18,.9);z-index:5;border-bottom:1px solid rgba(255,255,255,.08);">' +
        '<div style="font-weight:900;font-size:19px;letter-spacing:-.02em;">NEON<span style="color:' + n + '">ROUGE</span></div>' +
        '<button style="background:' + n + ';color:#fff;border:0;padding:10px 18px;border-radius:6px;font-weight:700;font-size:13.5px;cursor:pointer;">BOOK NOW</button></nav>' +
      sec('<div style="position:absolute;top:-140px;right:-100px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,' + n + '55,transparent 65%);"></div>' +
        '<div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.28em;color:' + n + ';margin-bottom:18px;">HAIR · MAKEUP · EDITORIAL</div>' +
        '<h1 style="font-size:clamp(42px,10cqi,110px);margin:0 0 22px;line-height:.9;text-transform:uppercase;font-weight:800;letter-spacing:-.04em;">Loud hair<br><span style="color:' + n + '">welcome here</span></h1>' +
        '<p style="max-width:480px;font-size:17px;line-height:1.75;color:rgba(242,242,245,.66);margin-bottom:30px;">Vivid colour, sharp cuts and shoot-ready makeup. Walk in with a screenshot, walk out with the real thing.</p>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;"><button style="background:' + n + ';color:#fff;border:0;padding:15px 26px;border-radius:6px;font-weight:700;font-size:15px;cursor:pointer;">Book a slot</button>' +
        '<button style="background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;padding:15px 26px;border-radius:6px;font-weight:600;font-size:15px;cursor:pointer;">See the lookbook</button></div>',
        'position:relative;overflow:hidden;padding-top:clamp(50px,8cqi,100px);') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">' +
        ['#FF2E63', '#22223B', '#8A2BE2', '#141420', '#FF2E63', '#2F2F45'].map(function (c, i) {
          return photo('salons', pick(2, i), 'height:210px;border:1px solid rgba(255,255,255,0.18);border-radius:8px;');
        }).join('') + '</div>', 'padding-top:20px;') +
      sec('<h2 style="font-size:34px;margin:0 0 26px;text-transform:uppercase;font-weight:800;letter-spacing:-.03em;">Menu &amp; rates</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;">' +
        [['COLOUR', [['Vivid full head', '₹8,500'], ['Root touch-up', '₹2,200'], ['Bleach &amp; tone', '₹5,500']]],
         ['CUT', [['Signature cut', '₹1,800'], ['Fringe trim', '₹500'], ['Buzz &amp; fade', '₹900']]],
         ['MAKEUP', [['Editorial', '₹6,000'], ['Party glam', '₹3,200'], ['Shoot half-day', '₹12,000']]]].map(function (b) {
          return '<div><div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.24em;color:' + n + ';margin-bottom:14px;">' + b[0] + '</div>' +
            b[1].map(function (row) { return '<div style="display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.09);font-size:15px;"><span style="color:rgba(242,242,245,.8)">' + row[0] + '</span><span style="font-weight:700;">' + row[1] + '</span></div>'; }).join('') + '</div>';
        }).join('') + '</div>', 'background:#141420;') +
      sec('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;">' +
        [['Asked for something between copper and pink. They nailed it first go.', 'Sanya M.'], ['Only place in the city that does not talk me out of a colour.', 'Dev P.'], ['Booked for a shoot at 6 am. They opened early.', 'Kabir S.']].map(function (t) {
          return '<div style="border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:22px;background:#141420;"><div style="color:' + n + ';margin-bottom:10px;">★★★★★</div>' +
            '<p style="line-height:1.7;margin:0 0 12px;color:rgba(242,242,245,.85);">&ldquo;' + t[0] + '&rdquo;</p>' +
            '<div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.16em;color:rgba(242,242,245,.45);">' + t[1] + '</div></div>';
        }).join('') + '</div>') +
      sec('<h2 style="font-size:clamp(30px,5cqi,46px);margin:0 0 12px;text-transform:uppercase;font-weight:800;letter-spacing:-.03em;">Chairs open this week</h2>' +
        '<button style="background:#0D0D12;color:#fff;border:0;padding:16px 30px;border-radius:6px;font-weight:700;font-size:15px;margin-top:10px;cursor:pointer;">WhatsApp to book</button>',
        'background:' + n + ';text-align:center;') +
      sec('<div><div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.22em;color:' + n + ';margin-bottom:12px;">HOURS</div><div style="color:rgba(242,242,245,.65);line-height:1.9;">Tue–Sun 11 am – 9 pm</div></div>' +
          '<div><div style="font-family:' + MONO + ';font-size:11px;letter-spacing:.22em;color:' + n + ';margin-bottom:12px;">STUDIO</div><div style="color:rgba(242,242,245,.65);line-height:1.9;">301 Vega House, Viman Nagar<br>Pune 411014</div></div>' +
          map('GOOGLE MAP', 'border:1px solid rgba(255,255,255,.12);border-radius:8px;min-height:130px;color:rgba(242,242,245,.35);'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;') +
      '<footer style="border-top:1px solid rgba(255,255,255,.08);padding:24px clamp(18px,5cqi,60px);font-size:12.5px;color:rgba(242,242,245,.4);">Neon Rouge — a fictional demo salon.</footer></div>';
  }

  /* --- Generic engine ------------------------------------------------------ */
  function generic(d, ctx) {
    var dark = d.mode === 'dark';
    var bg = dark ? d.ink : '#fff';
    var fg = dark ? '#F3F4F6' : d.ink;
    var muted = dark ? 'rgba(243,244,246,.62)' : 'rgba(0,0,0,.55)';
    var line = dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.09)';
    var soft = dark ? 'rgba(255,255,255,.05)' : '#F7F8F8';
    var btnFg = dark ? '#0B0B0D' : '#fff';
    var blurb = (ctx && ctx.categoryBlurb) || d.description || 'Sections and copy are written during customisation, from your business details.';
    var body = (d.sections || []).filter(function (s) { return ['Navbar', 'Hero', 'Footer'].indexOf(s) < 0; });

    return '<div style="background:' + bg + ';color:' + fg + ';font-family:' + SANS + '">' +
      '<nav class="tnav" style="display:flex;justify-content:space-between;align-items:center;padding:16px clamp(18px,5cqi,56px);border-bottom:1px solid ' + line + ';position:sticky;top:0;background:' + bg + ';z-index:5;">' +
        '<div style="font-weight:800;font-size:19px;letter-spacing:-.02em;">' + esc(d.name) + '</div>' +
        '<button style="background:' + d.accent + ';color:' + btnFg + ';border:0;padding:10px 17px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;">Contact us</button></nav>' +
      sec('<div>' + eyebrow(esc(d.style) + (ctx && ctx.categoryName ? ' · ' + esc(ctx.categoryName) : ''), d.accent) +
          '<h1 style="font-size:clamp(34px,6cqi,58px);margin:0 0 18px;font-weight:800;letter-spacing:-.033em;line-height:1.02;">' + esc(d.name) + '</h1>' +
          '<p style="font-size:17px;line-height:1.75;color:' + muted + ';max-width:460px;margin:0 0 26px;">' + esc(blurb) + '</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;"><button style="background:' + d.accent + ';color:' + btnFg + ';border:0;padding:14px 22px;border-radius:9px;font-weight:600;font-size:15px;cursor:pointer;">Get in touch</button>' +
          '<button style="background:transparent;border:1px solid ' + line + ';color:' + fg + ';padding:14px 22px;border-radius:9px;font-weight:600;font-size:15px;cursor:pointer;">WhatsApp</button></div></div>' +
          photo(d.category, pick(d.shot, 0), 'height:320px;border-radius:16px;'),
        'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:40px;align-items:center;' + (dark ? '' : 'background:' + soft + ';')) +
      body.map(function (s, i) {
        return sec(eyebrow('Section ' + String(i + 1).padStart(2, '0'), d.accent) +
          '<h2 style="font-size:30px;margin:0 0 10px;font-weight:800;letter-spacing:-.03em;">' + esc(s) + '</h2>' +
          '<p style="color:' + muted + ';max-width:560px;line-height:1.75;margin:0 0 24px;">Written content for this section is drafted during customisation, using your business details, photos and prices.</p>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">' +
          [0, 1, 2].map(function (k) {
            return '<div style="border:1px solid ' + line + ';border-radius:12px;overflow:hidden;">' +
              photo(d.category, pick(d.shot, i * 3 + k + 1), 'height:130px;') +
              '<div style="padding:16px;"><div style="height:9px;width:70%;border-radius:4px;background:' + fg + ';opacity:.8;margin-bottom:9px;"></div>' +
              '<div style="height:7px;width:92%;border-radius:4px;background:' + fg + ';opacity:.28;margin-bottom:6px;"></div>' +
              '<div style="height:7px;width:55%;border-radius:4px;background:' + fg + ';opacity:.28;"></div></div></div>';
          }).join('') + '</div>', 'border-top:1px solid ' + line + ';' + (i % 2 ? 'background:' + soft + ';' : ''));
      }).join('') +
      '<footer style="padding:26px clamp(18px,5cqi,56px);border-top:1px solid ' + line + ';color:' + muted + ';font-size:13px;">' + esc(d.name) + ' — a fictional demo business.</footer></div>';
  }

  /* --- self-contained sites ------------------------------------------------
     Everything above returns a fragment that the preview drops straight into
     the catalogue's own document. A few designs are not fragments: they are
     whole pages with their own reset, their own fixed-position canvas and a
     WebGL scene driven by window scroll. Inlining one of those would reset the
     catalogue's margins, pin a canvas over it and read the wrong scroll
     container — so they live as real files under public/sites and are shown in
     an iframe, which is the only honest way to preview a page that expects to
     own the window.

     The trade-off is that the studio cannot recolour them from the demo's
     accent the way a fragment template can. That is the correct trade for a
     design sold as bespoke: it is customised by editing its own file. */
  var SITE_FILES = {
    'setu-buildworks': '/sites/setu-buildworks.html',
    'noor-kapadia': '/sites/noor-kapadia.html',
    'ninety-four': '/sites/ninety-four.html',
    'rane-khosla': '/sites/rane-khosla.html',
    'villa-seventeen': '/sites/villa-seventeen.html',
    'mirrorwork': '/sites/mirrorwork.html',
  };

  function sitePage(d) {
    var src = SITE_FILES[d.template] || SITE_FILES[d.slug];
    /* `title` rather than a bare frame: screen readers announce an unlabelled
       iframe as "frame", which tells nobody what they have landed in. */
    return '<iframe class="siteframe" src="' + src + '" title="' + esc(d.name) + ' — live preview" loading="lazy"></iframe>';
  }

  /* app.js asks this before opening a preview, so the shell can hand the whole
     stage over to the iframe instead of letting it collapse to nothing. */
export const EMBED_TEMPLATES = SITE_FILES;

export const TEMPLATES = {
    'setu-buildworks': sitePage,
    'noor-kapadia': sitePage,
    'ninety-four': sitePage,
    'rane-khosla': sitePage,
    'villa-seventeen': sitePage,
    'mirrorwork': sitePage,
    'maison-noir': maisonNoir,
    'urban-plate': urbanPlate,
    'tandoor-lane': tandoorLane,
    'smilecare': smileCare,
    'northline': northline,
    'aurum-health': aurumHealth,
    'velvet-studio': velvetStudio,
    'studio-ash': studioAsh,
    'neon-rouge': neonRouge,
    'generic': generic,
  };

export function renderTemplate(demo, ctx) {
  const fn = TEMPLATES[demo.template] || TEMPLATES[demo.slug] || TEMPLATES.generic;
  return fn(demo, ctx);
}
