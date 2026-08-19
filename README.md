# The Frendzo

A catalogue of ready-made website designs for local businesses, the studio where a customer
makes one of them theirs, and the lead desk behind both.

Browse designs → **describe your business and let Claude write the page** → adjust anything →
pick a plan → pick a domain → pay → the order lands in your admin panel with the customisation
attached.

**React front end, Node/Express API, JSON files on disk.** The front end is Vite + React 18;
the API is Express in ES modules. The AI SDK is the only optional dependency — the API boots
without it and the studio drafts pages offline instead.

---

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** — Vite serves the React app and proxies `/api`, `/img` and
`/sites` through to the API on :4000.

| Command | Does |
|---|---|
| `npm run dev` | API on :4000 + Vite with hot reload on :5173 — what you want while developing |
| `npm run build` | builds the React app to `client/dist` |
| `npm start` | API on :4000, serving the built app from the same port |
| `npm run preview` | build, then start — one port, production shape |
| `npm run reset` | deletes `data/`, reseeds on next boot |

* Admin: <http://localhost:5173/#/admin> — password `admin`
* Different port for the API: `PORT=5000 npm start`

Node 18 or newer.

### Turning on the AI

```bash
export ANTHROPIC_API_KEY=sk-...  # or: ant auth login
npm run dev
```

`@anthropic-ai/sdk` is an optional dependency and is loaded lazily, so without a key the app
runs exactly as it otherwise would and the studio writes drafts on the device instead — see
[Writing the page with AI](#writing-the-page-with-ai). `GET /api/ai/status` tells you which
mode you are in.

---

## Where the data lives

```
data/
  categories.json   17 business categories
  demos.json        56 designs (9 hand-built + 5 self-contained + 42 generic)
  leads.json        every request submitted through the site
  projects.json     studio orders — customisation, plan, domain, quote, payment,
                    and anything the customer sent in afterwards
  settings.json     brand, prices, plans, add-ons, domain rates, admin password
```

These files are created on first boot from `server/lib/seed.js`. After that the server owns them —
edit them by hand while it's stopped, or through the admin panel while it's running.
Writes go through a queue and are written to a temp file then renamed, so a crash
mid-write can't leave you with half a JSON file.

---

## Project layout

```
package.json         npm workspaces: client + server, and the dev/build scripts
shared/
  pricing.js         the quote function — imported by the studio AND the API
server/
  index.js           Express app, body limits, boot
  static.js          /img extension-less resolution, /sites, and client/dist in production
  lib/
    paths.js         where the data, the art and the built client live
    store.js         JSON storage — atomic writes through one queue
    seed.js          first-boot data — categories, designs, plans, prices
    ai.js            Claude drafting + translation (optional, lazily loaded)
    auth.js          admin sessions, requireAdmin middleware
    throttle.js      one sliding window for login, tracking and AI
    ids.js           slugs, dates, next-id helpers
  routes/            auth, bootstrap, demos, leads, projects, track, ai, settings, data
  public/
    img/             sample photography, four per trade (+ credits.json)
    sites/           the five self-contained premium sites, served as real pages
client/
  index.html         shell, and the theme is set before first paint
  vite.config.js     dev proxy to the API, @shared alias
  src/
    main.jsx         mounts the app inside HashRouter + the two providers
    App.jsx          chrome, routes, and the lazily loaded studio
    api.js           one fetch wrapper; carries the admin token
    styles.css       design system, light + dark, and the stage
    state/
      AppProvider    catalogue, trades, settings, admin session, toast
      UIProvider     the live preview and the lead form, openable from anywhere
    i18n/
      dict.js        English/Hindi/Marathi dictionary + the pattern fallbacks
      I18nProvider   the language, persisted, and the t() every component calls
    lib/
      templates.js   the catalogue's showpiece templates + generic engine
      renderCustom.js the customer's own site, built from their content
      format.js      money, trade colours and icons, thumbnail slots
      images.js      canvas downscaling before an upload leaves the device
      motion.js      the depth engine, reveal-on-scroll, count-up
    components/      header, footer, cards, sheets, preview overlay, lead form
    landing/         the landing scenes — stage, turning box, pinned process
    pages/           home, browse, how, track, credits, admin
    studio/          the studio: customise → plan → domain → payment
    admin/           the desk: leads, orders, designs, settings + their dialogs
tools/
  make-images.js     draws the SVG placeholder scenes
  fetch-photos.js    downloads CC-licensed photographs from Openverse
data/                created on first run
```

`shared/pricing.js` is deliberately shared. The studio imports it to show a running total; the
API imports the same file and recomputes the quote when the order arrives, storing its own
answer. A tampered price in a request body changes nothing.

The two HTML-string renderers — `templates.js` and `renderCustom.js` — stayed as plain
functions rather than becoming components. What they return is a whole document for an
`<iframe>`: the customer's site gets its own CSS scope and cannot be styled by the catalogue's
stylesheet. React renders the app around them, not inside them.

---

## API

| Method | Route | Auth | Does |
|---|---|---|---|
| POST | `/api/login` | — | password in, token out |
| GET | `/api/bootstrap` | — | categories + demos + settings |
| GET | `/api/demos` | — | all designs |
| POST | `/api/demos` | admin | create a design |
| PATCH | `/api/demos/:id` | admin | edit, publish, feature |
| DELETE | `/api/demos/:id` | admin | remove |
| POST | `/api/leads` | — | public request form |
| GET | `/api/leads` | admin | list |
| PATCH | `/api/leads/:id` | admin | status, value, priority, notes |
| DELETE | `/api/leads/:id` | admin | remove |
| POST | `/api/track` | — | reference + phone → that customer's own order |
| POST | `/api/submit` | — | reference + phone → send photos and notes after ordering |
| POST | `/api/import` | admin | restore from an export file |
| GET | `/api/ai/status` | — | is AI configured, and which model |
| POST | `/api/ai/describe` | — | a brief → a whole drafted page |
| POST | `/api/ai/translate` | — | the page's strings → one language |
| POST | `/api/projects` | — | studio order — customisation, plan, domain, payment |
| GET | `/api/projects` | admin | list orders |
| PATCH | `/api/projects/:id` | admin | stage, payment status, notes |
| DELETE | `/api/projects/:id` | admin | remove |
| PUT | `/api/settings` | admin | brand, price, WhatsApp, password |
| GET | `/api/export` | admin | whole store as one file |

Admin routes need `x-admin-token`, handed out by `/api/login` and held in
`sessionStorage`. Sessions live in memory, so restarting the server signs you out.

---

## The template registry

`client/src/lib/templates.js` exports a map of `template name → function(demo) → HTML`.
A design's `template` field picks the renderer. Nine designs have their own:

`maison-noir` · `urban-plate` · `tandoor-lane` · `smilecare` · `northline` ·
`aurum-health` · `velvet-studio` · `studio-ash` · `neon-rouge`

Everything else uses `generic`, which builds a site from the design's accent colour,
mode and section list. That's what keeps the other 14 categories working while you
hand-build them one at a time.

### Adding a new design

**No code** — Admin → Designs → New design. Name, category, colours, sections.
It appears in the catalogue immediately and renders through `generic`.

**With its own look** — write a function in `templates.js`, register it in the
`window.TEMPLATES` map at the bottom, then set the design's *Template renderer*
field to that key in the admin panel. Two files touched, no routing changes.

### Adding a category

Add an entry to `data/categories.json` (slug, name, blurb) and give it an icon in
`CAT_ICON` in `client/src/lib/format.js`. Create designs for it from the admin panel.

---

## Premium designs

A design carries a `premium: true` flag in `data/demos.json`, set from the
*Premium* checkbox in Admin → Designs. Six ship flagged — **Setu Buildworks**,
**Noor Kapadia**, **Ninety-Four**, **Rane & Khosla**, **Villa Seventeen** and
**Mirrorwork**, the self-contained sites described below. They are the only
designs in the catalogue that are whole pages rather than fragments, which is
what makes them the expensive tier rather than a label applied to one.

Premium is **not** a category. It is an editorial flag that cuts across all of
them — a premium salon design still lives under Salons & Beauty and still shows
up when someone browses that trade. That is deliberate: the person shopping for
a salon should meet the expensive option in context, and the person who came
looking for the expensive ones should be able to see only those.

Where it shows:

| Where | What appears |
|---|---|
| Homepage | a warm gold band, *Our most expensive work*, with the first three |
| `#/demos/:cat/:slug` | the site itself, full-screen, running its own scene |
| `#/designs/premium` | the full premium list, its own stage header |
| Filter row | a gold **✦ Premium** chip, first, ahead of the trades |
| Every card | a **✦ Premium** ribbon, top-right |
| Header + footer | a Premium link |

The band quotes a price read off the `premium` plan in `data/settings.json`
rather than written into the copy, so it cannot drift from what the checkout
charges. Flag nothing and the band, the chip and both links disappear rather
than rendering empty.

`premium` is the reserved slug — a category with that slug would be shadowed by
this view. The colours are the `--prem*` tokens in `client/src/styles.css`, kept apart from
`--ochre` so a design can be both Featured and Premium without the two ribbons
colliding.

---

## Self-contained sites

Every other template returns an HTML *fragment*, which the preview drops
straight into the catalogue's own document. Six designs are not fragments:

| Design | Category | File |
|---|---|---|
| Setu Buildworks | Contractors | `server/public/sites/setu-buildworks.html` |
| Noor Kapadia | Photographers | `server/public/sites/noor-kapadia.html` |
| Ninety-Four | Restaurants | `server/public/sites/ninety-four.html` |
| Rane & Khosla | Lawyers & Accountants | `server/public/sites/rane-khosla.html` |
| Villa Seventeen | Real Estate Agents | `server/public/sites/villa-seventeen.html` |
| Mirrorwork | Salons & Beauty | `server/public/sites/mirrorwork.html` |

Mirrorwork is the odd one out twice over: it is the only light page in the group
and the only one with no three.js in it at all — its salon is CSS 3D, three
arched stations and ten chairs on a perspective root, turned by scroll. It still
belongs in this table for the same reason as the rest: it is a whole document
with its own reset that expects to own the window.

The first four load three.js as a classic script (r128). Villa Seventeen loads
three 0.160 as an ES module through an import map, with its post-processing
add-ons imported optionally so a blocked CDN degrades instead of failing — it
needs `RoundedBoxGeometry` and a bevel on every edge, which r128's global build
does not carry. Either way the page owns its own scroll and its own reset, which
is what puts it in this table.

Each is a complete page — its own `<head>`, its own `*{margin:0}` reset, and a
scene driven by window scroll (a fixed-position `<canvas>` for five of them, a
perspective root for Mirrorwork). Inlining one would reset the catalogue's own
margins, pin a canvas over the top of it, and read the wrong scroll container for
the animation. So they are served as real files and previewed in an `<iframe>`,
which is the only honest way to show a page that expects to own the window.

How it hangs together:

* `SITE_FILES` in `templates.js` maps template key → file path, and `sitePage()`
  returns the iframe. Both are registered in `window.TEMPLATES` like any other
  renderer, so nothing about routing or the demo model changes.
* The same map is published as `window.EMBED_TEMPLATES`. `openPreview()` reads
  it and puts an `embed` class on the preview shell.
* `.live.embed` stops the stage scrolling and gives the frame a real height —
  without it the iframe collapses, because the stage is `height:fit-content` and
  an iframe contributes no intrinsic content height.
* The trailing *"Like this design?"* panel is dropped for these. The page fills
  the stage and scrolls itself, so there is no "below" to append to; the bar
  under the preview carries the same action.

The three.js pages load it from a CDN and each catches a missing `THREE` to fall
back to a CSS gradient, so with no internet they degrade to a flat but complete
page rather than a blank one. Mirrorwork has nothing to fall back from.

**The trade-off:** the studio cannot recolour these from the demo's accent the
way it recolours a fragment template. That is the correct trade for something
sold as bespoke — it is customised by editing its own file. It is also why these
six are the premium designs.

### Adding another one

1. Drop the page in `server/public/sites/<slug>.html`.
2. Add `'<slug>': '/sites/<slug>.html'` to `SITE_FILES` in
   `client/src/lib/templates.js`, and `'<slug>': sitePage` to `TEMPLATES`.
3. Add the demo to `data/demos.json` (and `server/lib/seed.js` if it should survive a
   reset) with `template: '<slug>'` and `premium: true`.

---

## The preview shell

Opening a design full-screen builds three stacked rows inside `.live`: the
chrome bar, the scrolling `.lv-stage`, and the CTA bar. The design itself sits
in `.frame`.

Four things in here are load-bearing and easy to undo by accident:

**`.lv-stage`, not `.stage`.** The landing hero owns a global `.stage` class
carrying `min-height:100svh`, `align-items:center` and `padding:96px 0 34px`.
All three used to land on the preview by accident, which pushed each design's
sticky navbar down the page and left it floating over the hero. Two unrelated
things cannot share a class name.

**`align-items:flex-start` and `min-height:0` on the stage.** Every template's
navbar is `position:sticky;top:0`, and sticky measures against the top of its
scrollport. Centre the frame, or let the scrollport grow past the viewport, and
the navbar sticks to a line nobody can see.

**`overflow:clip` on the mobile bezel, never `hidden`.** Both round the page off
against the device frame, but `hidden` also makes that element a scroll
container — the sticky navbar then sticks to a box that never scrolls and
slides away with the page. `clip` cuts the corners without claiming the scroll.

**The device toggle swaps a token, it does not rebuild the class list.**
`live.className = 'live ' + device` silently dropped `embed`, which left a
self-contained site with no height after a trip through mobile and back.

### Responsive previews

Mobile mode is a **390px-wide element inside a full-width window**. A viewport
media query asks the window and misses the frame entirely, so:

* `.live .frame` carries `container-type:inline-size`.
* Templates size type in `cqi`, not `vw`. `7vw` asked the 1440px window and came
  back with a 100px headline for a 374px column. Outside a container these fall
  back to the viewport, so nothing breaks if a template is rendered elsewhere.
* Every template navbar carries `class="tnav"`, and `@container` rules in
  `client/src/styles.css` tighten it at 640px and stack it centred at 440px. They use
  `!important` because the templates are inline-styled strings and nothing else
  can reach them — the cost is paid in one block rather than in ten templates.

All twelve templates are checked in both modes: navbar pinned to the top and
holding under scroll, no horizontal overflow.

---

## Routes on the front end

| Hash | Page |
|---|---|
| `#/` | homepage |
| `#/designs` | full catalogue |
| `#/designs/:category` | one category |
| `#/designs/premium` | the premium designs only — see below |
| `#/demos/:category/:slug` | opens that design full-screen — shareable link |
| `#/build/:slug` | the studio for that design |
| `#/how` | how it works |
| `#/order` | track an order — reference + phone |
| `#/credits` | photo credits and licences |
| `#/admin` | lead desk and order desk |

---

## The studio

`#/build/:slug`. Four steps, and nothing is sent to the server until the last one.

**1 · Customise.** An AI drafting box and nine panels on the left, a live preview on the right. The preview is an
`<iframe>` rendered by `client/src/lib/renderCustom.js`, so the customer's site has its own CSS scope and
cannot be styled by the catalogue's stylesheet. It renders at a real 1240px and is scaled to
fit the column, so what they see is the actual layout rather than a narrow one.

* **Describe your business** — the AI shortcut past all of it; see
  [Writing the page with AI](#writing-the-page-with-ai)
* **Your business** — name, phone, WhatsApp, address, hours
* **Words on the page** — every heading and paragraph
* **Colours & type** — accent, ink, light/dark, four typefaces, corner radius, three hero layouts.
  Seeded from the design they picked, with one button to reset back to it.
* **Your photos** — logo, main photo, gallery of up to eight. Resized in the browser with a
  canvas before they ever leave it: 1600px JPEG for photos, 480px PNG for logos.
* **Services & prices** and **Reviews** — repeatable rows
* **Photo captions** — a title and a line of description under each gallery picture. A photo of a
  room says almost nothing on its own; *"The back terrace — seats twelve, open till 11"* is the
  sentence that sells it. Both lines are optional, and every trade ships starter captions written
  as prompts (*"Say how many it seats and whether it is air conditioned"*) so the customer is
  correcting a sentence rather than facing an empty box.
* **Sections** — turn parts of the page off; the navigation follows
* **Languages** — see below
* **Pages & extras** — how big, and what it has to do

Each category opens with a complete starter page — a clinic gets treatments and *Book
appointment*, a restaurant gets a menu and *Book a table* — so nobody edits an empty box.

**2 · Plan.** Three plans priced against what they just built, extras itemised, and a
highlighted panel about dynamic builds (admin panels, logins, live stock, dashboards) with a
WhatsApp link for a custom quote.

**3 · Domain.** Name and extension with per-TLD prices, suggestions from the business name, and
a **Check on GoDaddy** button that opens GoDaddy with that exact domain. Or "I already have
one", which costs nothing and gets nameserver instructions instead.

**4 · Payment.** One itemised total with GST, an advance split, four payment methods, and the
order. The confirmation carries the reference number, what happens next, a WhatsApp link, a
downloadable summary, and a button to open their finished site in a new tab.

**What gets shipped with the site.** The catalogue promises "titles, descriptions, business
schema and a sitemap set up before launch", so the generated page carries them: a real `<title>`
and meta description, Open Graph and Twitter tags (so a WhatsApp share shows the business, not a
bare link), `theme-color`, a favicon generated from the initial on the accent colour — no file
needed — and a `LocalBusiness` JSON-LD block built **only** from what the customer typed: name,
address, phone, hours, and their services as an offer catalogue. No invented ratings. Photos are
real `<img>` elements with alt text and `loading="lazy"`, because a background image is invisible
to image search and a local business wants to be found by its photos.

Drafts save to `localStorage` as you go. Photos are deliberately excluded from the draft — they
would blow the quota — and the studio says so when it restores one.

---

## What is in there on first boot

Enough to see every screen working without typing anything in.

**Eight sample orders** across eight trades and every stage the pipeline has, with quotes
computed by the same `shared/pricing.js` the checkout uses — so they add up exactly like a real one and
stay correct if you edit a price:

| Reference | Business | Phone | Stage |
|---|---|---|---|
| `SF-2401` | Spice Junction, Pune | `98220 11234` | Live |
| `SF-2402` | SmileWell Dental, Nashik | `99700 88221` | Building |
| `SF-2403` | Blush Salon & Spa, Mumbai | `90040 55112` | Content collected |
| `SF-2404` | Patil Fabricators, Pimpri | `98901 23344` | Order placed |
| `SF-2405` | Coastal Trails, Mangaluru | `90080 66214` | Review |
| `SF-2406` | Threadwork Boutique, Kolhapur | `90280 17734` | Advance received |
| `SF-2407` | Ansari Photography, Mumbai | `98920 63348` | Order placed |
| `SF-2408` | Verma Furniture House, Indore | `94250 71190` | Cancelled |

Use any of those pairs on `#/order` to see the tracking page with real data in it. Three of them
also carry **content the customer sent in afterwards** — notes and photos — so the submission
list in the admin order detail is not an empty state either.

**Sixteen leads** sit in the lead desk across all seven statuses, from a ₹9,500 electrician who
paid cash to a ₹92,000 diagnostics chain that needs a dynamic build. Every business is
fictional, and `npm run reset` clears the lot.

### The sample photography

**Real photographs, properly licensed.** `node tools/fetch-photos.js` pulls six photographs for
each of the 17 trades from **Openverse** — Creative Commons search across
Flickr, Wikimedia and others — filtered to licences that permit commercial use and modification.

Not Google Images. A Google Images result is somebody's copyrighted photograph that happens to be
indexed; shipping those inside a product your customers publish is infringement, however easy it
is to right-click. Openverse results come with a licence and a photographer, and the fetcher
records both for every file it saves. **CC BY and CC BY-SA require credit, so `#/credits` is
licence compliance, not a nicety** — it is generated straight from `public/img/credits.json`.

Art is referenced **without a file extension** — `/img/salons-hero` — and the server resolves it
to `.jpg` if a photograph is installed, `.svg` otherwise. So the photographs and the drawn
placeholders are interchangeable, a failed download costs one picture rather than breaking a
page, and dropping your own photo in with the right name just works.

`public/img/` also holds 68 generated SVG scenes — a hero and three gallery shots for each of the 17
trades. **Generated, not downloaded**: this project has to run with no network and no licensing
questions, and stock photos are neither. Each is a flat scene drawn from its trade's colour,
muted toward slate so it reads as a photograph rather than as a second brand colour fighting the
one the customer picked.

```bash
node tools/make-images.js     # the drawn placeholders — 102 files, ~100 KB
node tools/fetch-photos.js    # real CC-licensed photographs — 102 files, ~20 MB
node tools/fetch-photos.js salons gyms   # or just re-do a couple of trades
```

**Six per trade, and each design draws a different spread.** Every design gets a *slot* — its
position among the designs for its trade — and starts its photographs two apart from it: slot 0
opens on the hero, slot 1 on picture 2, slot 2 on picture 4. So the three restaurant designs
cannot open on the same dining room, and a gallery row shows four different photographs rather
than cycling through three. This was a hash of the design's name first, which is the obvious
thing to reach for and the wrong one — three designs landing in six slots collide often enough
that four trades ended up showing one photograph three times. A slot taken from the design's own
position can't collide. It is assigned when the catalogue loads rather than stored, so a design
added in the admin gets one too. Six queries per trade rather than one, too — a single query
tends to return one photographer's set shot from six angles.

**The catalogue uses them too.** Every one of the 51 designs used to render gradient blocks where
its photographs go, which made a finished template look like a wireframe. All ten renderers —
the nine hand-built ones and the generic engine behind the other 42 — now draw the trade's
pictures under each template's own colour wash, so a dark fine-dining page keeps its darkness
and the picture sits underneath it. The catalogue cards show the same art in their hero band —
literally the picture that design opens with, so the grid previews the design instead of decorating it.

**Every card says what its design is for.** A card used to give a name, a trade, a style word and a
section count, which tells you nothing about whether it suits your shop. All 51 now carry a written
line underneath — *"Dark, serif and unhurried. For a tasting menu and two seatings a night, not a
lunch rush"* against *"Loud and hard-edged, built like a menu board. For late nights and a queue on
the pavement"* — so two restaurant designs read as different choices rather than two names. They live
in `server/lib/seed.js` beside the design, clamp to three lines on the card, and the generic engine falls back
to *"<style> template for <trade>"* if one is ever missing.

The studio pre-fills the hero and gallery with the trade's set the moment a design is opened, so
the preview is a whole site from the first second rather than a page of grey boxes.

**No photograph is tinted — not ours, not theirs.** The catalogue used to wash each design's
colour over its pictures. It doesn't any more: a photograph of a restaurant should look like that
restaurant. A design carries its identity in its type, layout, spacing and buttons, which is
where a studio would put it anyway. The single remaining overlay is a neutral darkening at the
top of the catalogue card miniatures, because those draw white bars over the band to stand in for
hero text and the bars vanish on a bright picture.

**A customer's own photograph is never tinted either.** The design's colour wash belongs on our stand-in
art, not on a picture of somebody's actual shop — so the moment a real photo is uploaded it is
shown exactly as it was taken, in the preview and in the checkout's summary rail, which also
switches to their business name. Only the placeholders carry brand colour. They are
labelled **sample** everywhere they appear, they follow the category if it is changed, the first
real upload clears them, and there is a *Clear all the sample pictures* link. An order placed
with them still in carries them as short `/img/...` paths, not megabytes of data URL.

---

## After the order

The reference number on the confirmation screen is a real thing you can use.
**`#/order`** takes that reference plus the phone number on the order and shows the customer
where their site has got to: a stage timeline, their itemised quote, the domain, what is paid
and what is outstanding, and a button that opens the site they designed.

Both are required, because a reference like `SF-2403` is short enough to walk. A wrong reference
and a wrong phone number get the *same* answer, so the endpoint can't be used to discover which
references exist. Ten lookups a minute per IP. The reply is a hand-picked subset of the order —
never the internal notes.

The admin desk owns the stage; moving it there is what the customer sees.

### Sending content in

The same page carries the step that actually decides whether a project moves: **photos, prices
and changes**. Previously that arrived as WhatsApp messages nobody could find a week later; now
it lands on the project as a dated submission, and the order detail in the admin panel shows
each one with downloadable thumbnails.

Photos go through the same canvas downscale the studio uses, so a 12MP phone picture leaves the
device at around 200KB. Submissions append — nothing overwrites what was sent before.

### Backups

`Export JSON` in the lead desk has a `Restore…` next to it. The export is now a real backup:
restore validates the shape of every section before writing any of it, and each section is
optional, so a partial export restores the parts it has. `npm run reset` is no longer a one-way
door.

---

## Writing the page with AI

The first thing in the studio is a box that says *describe your business*. Two lines in — name,
trade, city, what you're known for — and **Generate my page** fills every panel below it:
headings, the about paragraph, services with rupee prices, three selling points, sample reviews,
and a colour, typeface and layout chosen for the trade. Then you edit whatever you want. It fills
the form; it never places an order.

`server/lib/ai.js` holds it, and two decisions shape that file.

**The model returns a validated object, not prose.** The request uses structured outputs
(`output_config.format` with a JSON schema), so Claude's answer arrives in exactly the shape the
customisation object already has — including a `category` constrained to the seventeen catalogue
slugs. The studio applies it without parsing or repair. Model is `claude-opus-5` at `medium`
effort for drafting and `low` for translation; contact details are never overwritten, because
those are the customer's, not the model's.

**AI is an upgrade, never a requirement.** The SDK is `require`d lazily inside a `try`. With no
package and no key, the server still boots, the endpoint answers `503 {fallback: true}`, and the
studio writes the draft *on the device* — it reads the brief for the trade, the city and the
business name, drops the owner's own words into the matching starter pack, and says plainly in
the note that nothing was rewritten. The button always does something, and it never lies about
what did the work.

The draft carries a note back from the model about what it assumed and what to check — shown
above the form, attributed to whichever writer produced it.

**Translate with AI** sits in the Languages panel, one button per extra language. It sends the
page's own strings, so it translates what the customer actually wrote rather than the template.

| Route | Does |
|---|---|
| `GET /api/ai/status` | whether a key is configured, and which model |
| `POST /api/ai/describe` | brief → a whole page |
| `POST /api/ai/translate` | the page's strings → one language |

Both POST routes are public, because customers use them, and throttled to 8 requests a minute
per IP — enough to stop a stuck loop burning tokens, not a substitute for a real gateway if you
put this on the internet.

---

## Languages

There are two separate things called "languages" here, and they are worth keeping apart.

### 1. The Frendzo's own interface

The switcher in the header — **EN · हिं · मरा** — puts the catalogue, the studio and the whole
checkout into Hindi or Marathi. A shopkeeper in Nashik should be able to buy a website without
reading English.

`client/src/i18n/dict.js` holds it, and the English string *is* the key. Components call
`t('English copy')` and get the current language back; an untranslated string simply stays
English instead of breaking, so a partial dictionary is a valid one.

Strings that carry a live number go through `t()` **whole** — `` t(`Projects start at ${inr(price)}`) ``
rather than a translated half plus a figure. The dictionary matches those with regular
expressions that put the number back where the language wants it, and a key with a price baked
into it would stop matching the moment the price changed.

That trick also covers content that arrives as *data* rather than code: category names and
blurbs from `categories.json`, and the plan names, feature lists, add-ons and domain notes from
`settings.json` are all translated by matching their English text. Edit one in the admin panel
and it stops matching — which is the right outcome for words someone typed themselves.

Adding a language is that one file: add a code to `LANGS` and a dictionary to `DICT`. Partial
dictionaries are fine. Two things are deliberately left in English: the admin panel (an
internal tool with one operator) and the preview iframe, which is the customer's own site.

### 2. The website the customer is buying

Separate feature, in the studio's Languages panel. A customer picks up to five languages; the
first is the primary one, and each one after that is priced per language, because it is a real
translation pass rather than a toggle.

They type the translated headings and paragraphs themselves. The generated site gets a language
switcher in its nav and remembers the visitor's choice. Anything left untranslated falls back to
the primary language, so a half-finished translation still reads properly. Names, prices and
phone numbers are never translated.

Twelve languages are wired up: English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu,
Kannada, Malayalam, Punjabi, Odia and Urdu — with `dir="rtl"` handled for Urdu.

---

## The landing experience

The landing experience is built from two briefs the user supplied: **nudot.com.tw** — near-black,
enormous split type, small parenthetical labels tucked into the corners — and **vectrfl.com** —
pale and airy, with a numbered process pinned beside it as you scroll. They pull in opposite
directions, so rather than average them into mush the page is one layout with two atmospheres:
light reads as Vectr, dark reads as Nudot.

What moves, and why:

* **The hero showcase.** The background is a real design from the catalogue, cross-fading on a
  timer, with a filmstrip that switches it and a counter saying which of the six you are looking
  at. The homepage is a rolling showcase rather than a stock photo.
* **The turning box.** Six real designs on the six faces of a box that turns on two axes. Click it
  and the face towards you opens full-screen.
* **The process plates.** Four plates at four depths behind the numbered steps, each lifting
  forward as its step becomes the active one.

No canvas, no WebGL, no library: CSS 3D transforms on a perspective root and about a hundred lines
of JavaScript. Under `prefers-reduced-motion` the drift stops, art swaps immediately, and the
marquee and scroll cue stand still — everything still works, it simply stops moving.

### Removed: the drifting card world

An earlier version pinned a sticky 3D world behind the whole run — eighteen browser-shaped panels
carrying real catalogue art, each on nine springs, retargeted by scroll into eleven named
formations, and steered by a **Formation rail** in the hero. It rode along into the catalogue
header, the studio band and the admin desk, adopted rather than rebuilt so the scene never
restarted between pages.

It has been removed at the client's request: `scene.js` is deleted and no longer loaded, the
rail is gone (it only ever re-formed the world — it never navigated), and the empty `#world` hosts
have been taken out of the homepage, the catalogue header, the studio and the desk. The hero
showcase, the turning box and the process plates above are unaffected.

---

## Light and dark

The whole app themes off one attribute on `<html>`, set synchronously in `index.html` before
first paint so there is no flash of the wrong theme. It follows the operating system until the
customer touches the toggle in the header, after which their choice is remembered.

Every colour in `client/src/styles.css` is a variable. If you add markup, use the variables — `--card`,
`--wash`, `--inverse`, `--line` — rather than a hex, and it will theme itself.

Light and dark for the *customer's* site is a separate setting, in the studio's Colours panel:
their site's mode is their decision, not their visitor's.

---

## Prices

Every number the checkout adds up lives in `data/settings.json` and is editable without
touching code: `plans`, `addons`, `domains`, `hosting`, `extraPagePrice`, `extraLanguagePrice`,
`domainPrivacyPrice`, `gstPercent`, `advancePercent`, `upiId`, and the `dynamicNote` shown in
the highlighted panel on the plan step.

A `settings.json` written by an older version is missing these keys, so every read layers the
file over the seed defaults — nothing downstream has to check whether a plan list exists.

---

## Lead flow

The quick form is still there for visitors who only want a call back.

1. Visitor hits **Get a website** or **Talk to us**.
2. The form opens with the design already attached — no ambiguity later about which one.
3. Required: name, business, phone, WhatsApp, city, category. Everything else optional.
4. `POST /api/leads` → appended to `data/leads.json` → reference number shown, with a
   WhatsApp link pre-filled with the reference and business name.
5. The server logs each new lead to the terminal.
6. Admin sees it top of the table, sets status, value, priority and notes.

---

## Notes before you put this anywhere public

* The password sits in plain text in `settings.json` and sessions are in memory.
  Fine on your laptop; swap for hashed passwords and a real session store before deploying.
  `/api/login` is limited to 6 attempts a minute per IP, which slows a guesser down but is not
  a substitute for a real password.
* JSON files are single-writer. They'll hold thousands of leads without complaint,
  but if you ever run two instances, move to SQLite or Postgres first — the API surface
  is already shaped for it, so only the four functions at the top of `server.js` change.
* Every demo business is fictional. Names, prices and reviews are invented.
* **Nothing is actually charged.** The payment step records a chosen method and an amount;
  there is no gateway behind it. Wire up a real one before taking money.
* **GoDaddy is a link, not an integration.** The button opens a domain search with the name
  pre-filled — it does not query availability or register anything. Add their API when you want
  a real availability check and an in-flow purchase.
* Uploaded photos — both the studio's and anything sent in afterwards — are stored inline in
  `projects.json` as data URLs. Fine for a laptop and a few dozen orders; move them to files or
  object storage before that file gets large.
* The sample pictures in `public/img/` are stand-ins, and the studio says so. Nobody should
  launch with them — replace them with the customer's real photos before a site goes live.
* If you keep the CC photographs, **keep `#/credits` reachable**. CC BY and CC BY-SA require
  attribution; removing the page while shipping the photos breaks the licence.
* The starter prices in `server/lib/seed.js` are placeholders. Set your own in the admin panel before you
  show this to anyone.
* **The AI endpoints are unauthenticated** and only rate-limited per IP. On a laptop that is
  fine; exposed to the internet it is someone else spending your tokens. Put them behind your
  own auth, or a gateway with a real budget, before you deploy.
* AI-written prices, reviews and claims are a **first draft**. The studio says so and the model
  is told to say so, but nobody should publish a page of invented reviews — replace them with
  real ones.
