# DPY Mercantile × Gratek: homepage prototype v8 ("Mist")

Modelled on the Fundora landing page:
- a soft, steamy hero
- a thin grey-gradient headline
- floating light cards around a centrepiece
- a coloured brand band that fades to white
- frosted panels on photos
- a three-card plan row

The green is replaced with **DPY's logo colours**:

| Logo part | Used for |
|---|---|
| Drop blues (#013C80 → #0D68C3) | Water, cold, the brand band |
| Gear red (#C70A0E) | Heat, hotspots, the featured buttons |
| Gear black | Type and the primary button |

**Open it:** double-click `index.html`. GSAP, Lenis, Three.js and MapLibre are bundled in `assets/vendor/`. Opened from disk, the 3D borrows Three.js from unpkg, because browsers block local modules on `file://`. Online, everything except the Manrope font, the map tiles and Street View comes from the site itself.

## Deploying to Cloudflare Pages

Project name: **dpy-prototype** (the share-preview tags point to https://dpy-prototype.pages.dev/, so link previews in Messenger and Viber show the hero image; `assets/img/og-cover.jpg` is regenerated from the current hero). Upload the `mist` folder as is (no build step; build output directory = the folder root). It includes:
- `_headers`: `noindex` for the whole prototype, basic security headers, 30-day caching for `/assets/*`, and `index.html` always fresh.
- `_redirects`: `/README.md` redirects to the homepage, so these notes aren't public.
- `404.html`: a branded "page not found" page.
- `robots.txt`: blocks all crawlers (prototype).

Optional: turn on **Web Analytics** in the Pages project settings (free, one click, no code).

**When it becomes the live site:**
- Change `<meta name="robots">` to `index,follow`.
- Remove the `X-Robots-Tag` line from `_headers`.
- Allow crawling in `robots.txt` and add a sitemap.
- Add `<link rel="canonical">` back.
- Point the share-image and structured-data URLs at the real domain.
- Wire the quote form to the n8n webhook.
- Use the Google Maps Embed API (with a key) for Street View.

## Real DPY content

Every product shown is a unit DPY sells. The photos are DPY's own, from dpymi.com.ph. Cut-outs were trimmed, cleaned and resized in `assets/img/dpy/`:
- Aquapower S35M / A35M
- Gratek Aquarius
- Everhot
- Rheem
- 5 Star CZ2.0 solar
- 5 Star integral heat pump
- Deron heat pump

Real photos from the site:
- **Partner logos:** in `assets/img/logos/`.
- **HAASE tank installation:** in the "Supply & Installation" card.
- **DPY team:** in the "Free Consultation" card.
- **Resort and residential tower renders:** in the "Solutions" tabs.

Each product card links out to its category page on dpymi.com.ph.

## What's on the page

- **Hero.**
  - DPY's heaters take turns on a glass plinth under a soft spotlight, with a faint reflection: the Aquapower AQP-28N (black glass, with shower set), Everhot storage heaters, 5 Star CZ2.0 solar, and the Deron DE-27W/S heat pump (cropped from DPY's Deron lineup photo). All photos come from dpymi.com.ph product pages.
  - Each heater has one hotspot.
  - The switcher underneath fills as each product is shown. Clicking it jumps to a product, and hovering pauses it.
  - On desktop the heater turns gently toward the cursor.
  - **Badge:** the line above the headline ends with the Gratek "g" mark.
  - **Gratek card** (same height as the dial card): about Gratek Smart Water Corp., the DPY company for homes. It shows the Gratek logo, a "Home & retail" tag, the tagline "Your one-stop hub for hot water at home", and the brands Gratek carries (Rheem, Everhot, Aquapower), all as described on its page on dpymi.com.ph. "Visit Gratek →" opens that page.
  - "Set your temperature" is a real control: drag it, scroll over it or use the arrow keys. Turning it changes the hero: the glow behind the heater shifts from cool blue to warm orange, heat waves rise off the heater from about 42°C, and the whole room takes on a warm tint. The knob and the mode label (Cool, Warm, Comfortable, Hot, Very hot) change colour, and the number gives a small bump. Once after load, the dial sweeps up to 57°C and back to show it is live, and any touch stops this.
  - The headline draws its gradient on each line separately, because a nested gradient-text clip vanished in Chrome after scrolling back up.
  - The bathroom backdrop is out of focus, so the product stands forward.
- **Brand wall.** A still grid of the 12 brands DPY carries (real logos where the site has them, set in type otherwise). Hovering a tile brings the logo to full colour and shows what DPY supplies from that brand (taken from dpymi.com.ph), linking to that category. It is 6 columns on desktop, 4 on tablet and 3 on phone.
- **Our Water Heaters.** Four product cards with the real cut-outs. Each shows its type, model names, three facts, "Get a Quote" and a link to dpymi.com.ph.
  - **Complete Hot Water Systems** (a row under the four heaters). It covers the other product categories on dpymi.com.ph, each with a real product photo from DPY's site cut out from its background, its brands, a one-line purpose and a link to its page: Storage Tanks (Champion, HAASE, Enermax), Circulation Pumps (Wilo booster set, Grundfos), PPR Pipes & Fittings (Aquaplast) and AC·THOR solar control (my-PV). The assistant knows about them too.
- **How it works (pinned on desktop, deep navy background).** A real-time 3D cutaway of the Rheem electric storage heater DPY supplies, built with Three.js. It has the grey enamel shell, domed top with trim ring, upper and lower access panels, the Rheem badge (cut from DPY's own Rheem product photo) and a rating label. A caption reads "Shown: Rheem electric storage heater · supplied & installed by DPY".
  - A quarter of the tank is cut away to show the real layers: white enamelled steel shell, polyurethane foam insulation and the glass-lined steel inner tank.
  - Inside are the dip tube, copper heating element, magnesium anode rod, thermostat housing, T&P relief valve and drain valve.
  - Scrolling plays it out:
    1. Cold water runs down the dip tube and fills the tank from the bottom.
    2. Twin elements, as in Rheem's dual-element tanks: the upper one heats the top first, then the lower one heats the rest. A shimmering heat plume and convection streaks lift the hot water into a layer at the top.
    3. The thermostat cycles the lower element at 50°C.
    4. Hot water leaves from the top while cold refills below.
  - The step rail runs from 01 to 04 and fills from blue to red as the water heats. Finished steps show a tick, and the current one has a soft pulse ring.
  - Numbered labels are pinned to the 3D parts.
  - A small instrument readout shows the tank temperature, set point and element status.
  - The camera orbits slightly with the scroll and the cursor.
  - It ends with a closing line and a "Find My Water Heater" button.
  - If WebGL or Three.js isn't available, the Everhot photo shows instead.
- **The Right Water Heater for Every Building.** Tabs for Condos, Family Homes, Hotels & Resorts and Hospitals, each naming the recommended heater type. Beside them is a heat-pump card with the Deron unit.
- **How Much Could You Save?** A savings calculator. A slider sets hot showers a day, with presets (family home, small resort, mid-size hotel, large hotel, hospital), and the electricity rate is editable (default ₱12/kWh). It shows a year's running cost for an electric heater, a heat pump and solar with electric backup as animated bars, plus the headline saving. The assumptions are printed under it: 40 L per shower heated from 27 to 42°C, heat pump about 3.5× as efficient, solar covering about 65%. "Get an exact quote" pre-fills the form. **DPY should check these assumptions** against their own sizing.
- **Our Clients.** 32 real client logos taken from the project-reference pages of DPY and Gratek on dpymi.com.ph (in `assets/img/clients/`), sorted by category (Hotels & Resorts, then Hospitals & Schools, Residences & Offices, Food & Fitness). Logos are grey until hovered, when they show in full colour with the client's name. The filter tabs light up the chosen group and dim the rest, so nothing moves. It ends with "Your building next? Talk to our project team". Confirm with DPY that these clients may be shown.
- **From Quote to Hot Shower.** Free Consultation (DPY team photo), Supply & Installation (HAASE installation photo) and After-Sales Service.
- **Branches.** A cinematic satellite map (MapLibre GL with Esri World Imagery) of the whole Philippines, with pins and labels for the five branches (Manila head office, Boracay, Iloilo, Cebu, Davao) and smaller pins for Baguio City and Tagaytay. Picking a branch from the list on the map, or clicking its pin, flies the camera down to a tilted street-level view of that city and brings up a card with the address, "Directions" (Google Maps route), "Call" and the phone numbers. After landing, the camera dives to the street and fades into **Google Street View facing the office** (a walk view you can drag to look around and click to walk). "Map view" goes back up, and "All branches" flies back out. Pins use the offices' Google Maps coordinates: Manila is DPY's own Google listing, Iloilo is the Joy Agro Building, Cebu is Horacio Sr. Centre, and Davao is Camella Northpoint. Each walk view starts at the nearest Street View point (8–20 m away), turned to face the building. Boracay has no street-level photos, so it opens a 360° photo of Station 2 beach, labelled "(area)". The map library loads only when the section comes near, renders only while moving (about 52–58 fps during a flight on Intel UHD, zero cost when still), and leaves the page scroll alone. On phones the branches become a row of chips over the map. **To confirm:** Google lists DPY Davao at "Door 2, Corner Yangtze St., Bacaca Road, Riverview Village", not Camella Northpoint as on the website. The Boracay address (Station 2, Manoc-Manoc) needs an exact spot. The Manila walk view shows the street front at the pin, so DPY should check that it's their gate. and the hero says "7 Service branches" while the site lists 5. For a live site, register a free ArcGIS developer account for the imagery, or switch to Mapbox or MapTiler satellite tiles.
- **Find My Water Heater quiz.** It opens from the hero button, a "Not sure which one you need?" banner that closes the products section, after Complete Hot Water Systems, the How It Works ending, and the assistant. It asks four quick questions (where, how many showers, what matters most, sunny roof), with a progress bar and a Back button. The answer is a recommendation with the real product photo, models, three reasons, a note for hotels, hospitals or commercial buildings, and an "also worth a look" second option. "Get a free quote for this" closes the quiz, scrolls to the form and pre-fills the building, interest, showers and a summary of the answers. On phones it opens as a bottom sheet.
- **Get a Free Quote** (the closing ask, just above the footer). On the left, a red-to-navy panel: "Ready for hot water done right?", three promises (free site visit and sizing, written quotation, one team from quote to after-sales) and a tap-to-call number. On the right, a short form: name and mobile (required), email, building type and interest chips, nearest branch, number of showers, and a message. Every "Get a Quote" button on the page (nav, product cards, service plans, the assistant) glides here and pre-fills what the visitor was looking at, such as ticking "Heat pump" from the heat-pump card. **Prototype:** submitting checks the required fields, then opens an email to sales@dpymi.com.ph with the details filled in and shows a thank-you. For the live site, send the form to DPY's CRM or inbox through a small server, or a form service, instead.
- **Messaging:** Messenger (m.me/dpymercantileinc, from DPY's Facebook page) and Viber (sales number 0933 867 2954) buttons in the quote panel and at the bottom of the chat window. The assistant offers Messenger with contact answers. **To confirm:** that this number is on Viber, and that the Facebook page answers Messenger.
- **Footer.** Facebook, Instagram, YouTube and the Lazada shop are linked, as listed on dpymi.com.ph. Branches are updated to Manila (head office, Pasig), Boracay, Iloilo, Cebu and Davao, plus "also sold in Baguio & Tagaytay". Phone numbers and "Get a free quote" are added.
- **Ask DPY assistant** (bottom right on every screen). Its icon is the droplet from the DPY logo, without the gear. Every 7 seconds it warms from the logo blues to red and back (hot water). On the button it wobbles like a real drop every few seconds and leaves a small ripple. In the chat header it bobs quickly while the assistant is "thinking". A chat window that answers from the site's own content:
  - which heater fits a condo, home, hotel or hospital
  - instant vs storage vs heat pump vs solar
  - prices (free site visit and quote), installation, repairs and maintenance
  - brands, branches by city (with directions), contacts, Gratek, clients and the company
  It offers suggested questions and action buttons (call, email, quote, scroll to a section). After 9 seconds a one-time nudge appears for 7 seconds, and on phones it opens as a bottom sheet. It understands simple Taglish such as "magkano", "sira" and "salamat".
  **It is a front-end prototype:** answers come from keyword matching over a built-in knowledge list, not a live AI. For production, put the same knowledge behind a small server that calls an AI model (for example Claude), so it can handle any phrasing, and add a "talk to a person" handoff.
- **Phones and tablets:** in How It Works the tank stays pinned at the top while the four steps scroll under it, so you always see what each step does. Labels near the screen edge flip inward. The Solutions and Clients tabs are a single swipeable row, and section spacing is tighter.
- **Navigation:** Water Heaters · How It Works · Solutions · Clients · Service · Branches. The logo returns to the top, and the white highlight appears once you scroll into a section.

## Privacy, search and sharing

- **Privacy Notice** (Data Privacy Act, RA 10173). It opens from the quote form and the footer. The form now needs a consent tick before it sends. **The text is a draft:** DPY must confirm the Data Protection Officer contact, the retention period and the service providers.
- **Prototype: kept out of search results** (robots meta `noindex`, the `X-Robots-Tag` header and `robots.txt`). The SEO below is ready for when it goes live.
- **Search basics:** the page title ("Water Heaters & Heat Pumps Philippines | DPY Mercantile Inc.", 60 characters) and description (157 characters) lead with what people search for. The language is set to English (Philippines), The headings go in order (one h1, then h2s; the footer column titles are h2s styled small). 
- **Icons:** the SVG favicon, plus a PNG fallback, a home-screen icon (`apple-touch-icon.png`) and `site.webmanifest`. Opened straight from disk, Chrome logs a harmless manifest error; it loads normally once the site is on a web server.
- **Share previews:** Open Graph and Twitter tags with a 1200×630 cover image (`assets/img/og-cover.jpg`). Links pasted into Facebook, Messenger or Viber show the hero.
- **Structured data (schema.org JSON-LD):** DPY Mercantile as the organization, with phones, socials and Gratek as a sub-organization, plus each of the five branches as a local business with address, map coordinates and opening hours (Mon–Sat, 8 AM–5 PM). It also describes the website and the page, and uses a PNG logo (`assets/brand/dpy-logo.png`), which search engines need instead of SVG. This helps "water heater near me" searches. Swap the domain when the new site goes live.


## Performance (checked on Intel UHD integrated graphics)

| Screen | Idle | Scrolling |
|---|---|---|
| Desktop | about 140 fps | about 96 fps |
| Phone size | about 140 fps | about 131 fps |

**Light mode.** On touch screens, PCs with 4 or fewer CPU cores, and data-saver connections, purely decorative loops stop: hero steam, card float, hotspot pulses, heat-wave and drop loops, and step rings. Everything interactive still animates. The chat drop's colour change is now an opacity cross-fade between two ready-made drops, instead of an animated SVG gradient that repainted the always-visible button every frame. On a phone-size screen with the CPU slowed 4×, the idle frame rate went from 32 to about 102 fps and scrolling from 28 to about 66 fps.


How it stays fast:
- **Hero blur:** baked into `hero-steam-soft.webp`, not applied live.
- **Frosted panels:** a pre-blurred copy of the photo, not `backdrop-filter`.
- **3D cutaway:** Three.js no longer loads with the page. It downloads and builds the scene in the first idle moment after the page loads (or earlier if you scroll toward it), so it never stalls a scroll. Shaders compile in the background, shader error checks are off, it's capped at 1.25× resolution, and the render loop stops completely while the tank is off screen.
- **Phones and tablets scroll natively.** Smooth scrolling (Lenis) runs only with a mouse or trackpad.
- **Branch map:** the map library is parsed when the browser is idle, and the fly-in waits until the map is on screen.
- **Scroll work:** entrance animations stop listening to the scroll once they've played. The temperature dial places its knob by maths instead of measuring the SVG path each frame, and plays one intro sweep instead of two overlapping ones.
- **Logos:** the unneeded multiply blending on the brand and client logos is gone (they sit on white cards).

Measured on this PC: the page is ready (DOMContentLoaded) in 0.72 s instead of 1.23 s, the longest start-up freeze fell from 493 ms to 183 ms, and the worst freeze while scrolling on desktop is back to about 70 ms.
- **Loops:** they pause when their section is off screen.

## Email addresses

The site uses role-based addresses. Each one should forward to the people who handle it:

| Address | Used for on the site |
|---|---|
| hello@dpymi.com.ph | Footer, the assistant's "Email us", Google business data (company and branches) |
| sales@dpymi.com.ph | Quote form, every "Get a Quote", footer "quotes", sales contact in the business data |
| service@dpymi.com.ph | The assistant's repair and maintenance answers, footer "repairs", customer-service contact in the business data |
| privacy@dpymi.com.ph | Privacy notice (Data Protection Officer) |

## Sample content (prototype)

Where dpymi.com.ph has no information, the prototype uses realistic sample content. Replace it before launch:

| Where | Sample used |
|---|---|
| Testimonials (under the client logos) | Three sample reviews: a Boracay resort engineer, an Iloilo hospital facilities head and a Pasig condo owner. Swap in real customer quotes with their permission. |
| Branch hours | Mon–Sat, 8:00 AM – 5:00 PM, closed Sundays and holidays (branch card and assistant) |
| Hero stat | "5 Branches nationwide", matching the branches page |
| Privacy notice | Retention of 5 years after the last transaction; hosting and email providers as processors; "Last updated: October 2026" |
| Viber / Messenger | Viber on the sales number 0933 867 2954; Messenger via the Facebook page |
| Savings calculator | 40 L per shower, 27→42°C, heat pump 3.5× as efficient, solar covering 65%, ₱12/kWh |
| Gratek "Aquarius" and quiz recommendations | General guidance, following the Solutions section |
| Branch pins and walk views | Google Maps listings and nearest Street View; Davao uses the website address (Camella Northpoint); Boracay shows the Station 2 area |
| Stock photos | Shower, plant and technician (Unsplash) |

## Notes

- **Photos from dpymi.com.ph:** the product photos, partner logos, team and installation photos, and project renders come from DPY's own site, so confirm they can be reused on the new site.
- **Stock photos:** the remaining photos (shower, plant, technician) are Unsplash placeholders.
- **Rheem photo:** only a small one exists on the site, so ask DPY for larger product shots.
- **Illustrative content:** the hotspot labels, the dial and the 26–50°C demo are generic. The 3D model follows the look of Rheem's electric storage heaters but isn't an exact model, so DPY's engineers should check the parts and the 50°C set point. Confirm DPY may show the Rheem logo this way (as a Rheem distributor this is normal, but check).
- **Content to confirm with DPY:** 100+ references, the brands carried, and whether free consultation covers projects. The buttons open an email to sales@dpymi.com.ph.
