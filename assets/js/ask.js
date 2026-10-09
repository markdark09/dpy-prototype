/* "Ask DPY", the website assistant, on every page (its markup is written into each page by tools/build.mjs). It answers from the site's own content (products, buildings, brands,
   branches, services). Front-end prototype: in production the same knowledge would feed an AI model behind a small server. */
(() => {
const SRC = document.currentScript.src
if (!document.querySelector('.ask')) return // the page has no chat markup
// wired up in the first idle moment: the button is already on the page, so nothing moves
;(window.requestIdleCallback || setTimeout)(() => {
const $ = (s, r = document) => r.querySelector(s)
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
// the site root, from this script's own address (pages live at / and /products/)
const B = new URL('../../', SRC).href
const has = id => !!document.getElementById(id)
// a section on this page scrolls; otherwise the link opens the page that has it
const PAGE = { heaters: 'water-heaters', how: './#how', buildings: 'business', savings: './#savings', clients: 'projects', service: 'service', branches: 'contact#branches', quote: 'contact#quote' }
const root = $('.ask'), win = $('.ask-win'), log = $('.ask-log'), chips = $('.ask-chips'), form = $('.ask-in'), input = $('input', form), btn = $('.ask-btn'), tip = $('.ask-tip')
const CALL = '<a href="tel:+639338672954">Call 0933 867 2954</a>', MAIL = '<a class="l" href="mailto:hello@dpymi.com.ph?subject=Water%20heater%20inquiry">Email us</a>', SVC = '<a class="l" href="mailto:service@dpymi.com.ph?subject=Repair%20or%20maintenance%20request">Email service</a>'
const QUOTE = has('quote') && $('#quote .qt-form, #quote form') ? '<a href="#quote" data-go>Request a free quote</a>' : '<a href="contact#quote">Request a free quote</a>', MSGR = '<a class="l" href="https://m.me/dpymercantileinc" target="_blank" rel="noopener">Messenger</a>'
const sec = (id, label) => has(id) ? `<a class="l" href="#${id}" data-go>${label}</a>` : `<a class="l" href="${PAGE[id]}">${label}</a>`
const BRANCH = {
  manila: ['Manila (head office)', '778-B Mahogany St., Octagon Village, Brgy. Dela Paz, Pasig City'],
  boracay: ['Boracay', 'Station 2, Manoc-Manoc, Boracay Island'],
  iloilo: ['Iloilo', '2nd Floor Agro Building, Jalandoni Street, Brgy. Villa Anita, Iloilo City'],
  cebu: ['Cebu', '3rd Floor Horacio Sr. Centre, S.B. Cabahug, Ibabao-Estancia, Mandaue City'],
  davao: ['Davao', 'Camella Northpoint, J.P. Laurel Avenue, Bajada, Davao City'],
}
const dir = a => `<a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a + ', Philippines')}" target="_blank" rel="noopener">Directions</a>`
const BRANDS = { rheem: ['Rheem', 'electric storage water heaters', 'electric-storage-water-heater'], everhot: ['Everhot', 'electric storage water heaters', 'electric-storage-water-heater'], aquapower: ['Aquapower', 'instant water heaters', 'instantaneous-water-heater'], haase: ['HAASE', 'heat exchange storage tanks', 'storage-tank'], deron: ['Deron', 'heat pumps', 'heat-pumps'], '5 star|five star|5star': ['5 Star', 'solar water heaters and heat pumps', 'solar-water-heater'], enermax: ['Enermax', 'hot water storage tanks', 'storage-tank'], champion: ['Champion', 'glass-lined storage tanks', 'storage-tank'], wilo: ['Wilo', 'circulation pumps', 'pump'], grundfos: ['Grundfos', 'pumps', 'pump'], systemair: ['Systemair', 'ventilation fans and blowers', ''], katen: ['Katen', 'exhaust fans', 'fan'], aquaplast: ['Aquaplast', 'PPR pipes and fittings', 'pipe'] }
const BUILD = {
  condo: '<p>For a <b>condo or apartment</b>, we usually recommend an <b>instant water heater</b> beside each shower: hot water in seconds, and no tank to fit into a small unit.</p><p>Popular picks: Aquapower and Gratek Aquarius.</p>',
  home: '<p>For a <b>family home</b>, a <b>storage water heater</b> (Rheem or Everhot) keeps a tank of hot water ready for several taps at once.</p><p>Add <b>5 Star solar</b> on the roof to cut your power bill.</p>',
  hotel: '<p>For <b>hotels and resorts</b>, we design <b>central heat-pump systems</b> (Deron) with HAASE storage tanks and Wilo circulation pumps, sized for full occupancy.</p><p>Our after-sales team keeps them running.</p>',
  hospital: '<p>For <b>hospitals</b>, we recommend <b>heat pumps with backup heaters</b>, so wards, theatres and kitchens have hot water around the clock.</p><p>We add mixing valves and a maintenance plan.</p>',
}
// each intent: words that point to it (multi-word phrases count double) and the reply
const I = [
  { k: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'kumusta', 'musta'], a: () => ({ t: '<p>Hi! I\'m the DPY Assistant. I can help you pick a water heater, find a branch, or get a quote.</p>', c: ['Which heater for my condo?', 'Find a branch', 'How much does it cost?'] }) },
  { k: ['not sure', 'help me choose', 'which heater', 'which water heater', 'recommend', 'find my', 'quiz', 'suggest', 'what should i'], a: () => ({ t: '<p>Happy to help you choose! Answer <b>4 quick questions</b> and I\'ll recommend the right water heater for your place.</p><p>Or just tell me: is it a condo, house, hotel or hospital?</p>', x: ['<a href="#heaters" data-quiz>Find my water heater</a>'], c: ['Condo', 'House', 'Hotel', 'Hospital'] }) },
  { k: ['condo', 'apartment', 'studio', 'unit', 'dorm'], a: () => ({ t: BUILD.condo, x: [sec('heaters', 'See instant heaters'), QUOTE] }) },
  { k: ['house', 'home', 'family', 'bungalow', 'townhouse'], a: () => ({ t: BUILD.home, x: [sec('heaters', 'See storage heaters'), QUOTE] }) },
  { k: ['hotel', 'resort', 'inn', 'hostel', 'airbnb'], a: () => ({ t: BUILD.hotel, x: [sec('buildings', 'See solutions'), QUOTE] }) },
  { k: ['hospital', 'clinic', 'medical', 'school', 'university', 'gym'], a: () => ({ t: BUILD.hospital, x: [sec('buildings', 'See solutions'), QUOTE] }) },
  { k: ['difference', 'compare', 'versus', 'vs', 'which type', 'types', 'kind'], a: () => ({ t: '<p>The four water heater types we supply:</p><ul><li><b>Instant</b>: heats as water flows, compact, best for one shower.</li><li><b>Storage</b>: keeps a tank hot for several taps.</li><li><b>Heat pump</b>: moves heat from the air, uses far less power, best for hotels.</li><li><b>Solar</b>: heated by the sun, with electric backup.</li></ul>', x: [sec('heaters', 'Compare them'), sec('how', 'How a heater works')] }) },
  { k: ['instant', 'tankless', 'aquarius', 'shower heater', 'single point'], a: () => ({ t: '<p><b>Instant water heaters</b> heat water as it flows, so a shower is hot in seconds and there\'s no tank.</p><p>Models: Aquapower A35M · S35M · Q6M and Gratek Aquarius.</p>', x: [`<a class="l" href="water-heaters?type=instant">View models</a>`, QUOTE] }) },
  { k: ['storage', 'tank', 'gallon', 'litre', 'liter', 'boiler'], a: () => ({ t: '<p><b>Electric storage water heaters</b> keep a tank of hot water ready, so several taps can run at once.</p><p>We carry the Rheem series and Everhot.</p>', x: [`<a class="l" href="water-heaters?type=storage">View models</a>`, sec('how', 'See inside one')] }) },
  { k: ['heat pump', 'heatpump', 'energy', 'save', 'saving', 'electricity', 'bill', 'efficient'], a: () => ({ t: '<p><b>Heat pumps</b> move warmth from the air into the water instead of making it, so they use far less electricity than a plain electric heater.</p><p>We install Deron and 5 Star heat pumps, ideal for hotels and hospitals.</p>', x: [`<a class="l" href="water-heaters?type=heatpump">View heat pumps</a>`, QUOTE] }) },
  { k: ['how much save', 'savings', 'save money', 'calculator', 'running cost', 'power bill', 'electric bill', 'meralco'], a: () => ({ t: '<p>A heat pump uses roughly <b>a third of the electricity</b> of a plain electric heater, and solar can cover about two-thirds of the heat. For a mid-size hotel (60 showers a day at ₱12/kWh), that\'s about <b>₱140,000 a year</b> saved with a heat pump.</p><p>Try our calculator with your own numbers:</p>', x: [sec('savings', 'Open the calculator'), QUOTE] }) },
  { k: ['solar', 'sun', 'roof', 'panel'], a: () => ({ t: '<p><b>Solar water heaters</b> (5 Star CZ2.0 and CZ4.0) heat water with the sun and have an electric backup for cloudy days.</p>', x: [`<a class="l" href="water-heaters?type=solar">View solar</a>`, QUOTE] }) },
  { k: ['price', 'cost', 'how much', 'magkano', 'quote', 'quotation', 'rate', 'budget', 'cheap', 'expensive'], a: () => ({ t: '<p>Prices depend on the model, the size and the installation, so we don\'t list them online.</p><p>Our <b>site visit and written quotation are free</b>. Tell us your building and how many showers, and we\'ll size it for you.</p>', x: [QUOTE, CALL] }) },
  { k: ['install', 'installation', 'set up', 'setup', 'site visit', 'inspection', 'inspect', 'sizing', 'consult'], a: () => ({ t: '<p>We handle it end to end: a <b>free site visit</b> and sizing, then supply and installation by our own technicians, testing and warranty registration.</p>', x: [sec('service', 'How it works'), QUOTE] }) },
  { k: ['repair', 'broken', 'not working', 'leak', 'leaking', 'no hot water', 'maintenance', 'service', 'descale', 'anode', 'spare', 'parts', 'warranty', 'sira'], a: () => ({ t: '<p>Our after-sales team does <b>repairs, spare parts and preventive maintenance</b> (including descaling and anode checks) from our branches.</p><p>Tell us the brand and model and what\'s happening.</p>', x: [CALL, SVC] }) },
  { k: ['branch', 'branches', 'location', 'where', 'address', 'near', 'office', 'store', 'shop', 'showroom'], a: q => {
      const hit = Object.entries({ manila: ['manila', 'pasig', 'metro', 'ncr', 'quezon', 'makati', 'taguig'], boracay: ['boracay', 'aklan'], iloilo: ['iloilo'], cebu: ['cebu', 'mandaue'], davao: ['davao'] }).find(([, w]) => w.some(x => q.includes(x)))
      if (hit) { const [n, a] = BRANCH[hit[0]]; return { t: `<p>Our <b>${n}</b> branch is at:</p><p>${a}</p>`, x: [dir(a), CALL] } }
      if (/baguio|tagaytay/.test(q)) return { t: '<p>Our products are sold in <b>Baguio City</b> and <b>Tagaytay</b> too. For the nearest outlet, call us and we\'ll point you there.</p>', x: [CALL, sec('branches', 'All branches')] }
      return { t: '<p>We have five branches: <b>Manila</b> (head office, Pasig), <b>Boracay</b>, <b>Iloilo</b>, <b>Cebu</b> and <b>Davao</b>. Our products are also sold in Baguio City and Tagaytay.</p><p>Which city are you in?</p>', x: [sec('branches', 'See the map')], c: ['Manila', 'Cebu', 'Davao', 'Iloilo'] } } },
  { k: ['manila', 'pasig', 'cebu', 'mandaue', 'davao', 'iloilo', 'boracay', 'baguio', 'tagaytay', 'makati', 'quezon', 'taguig'], a: q => I.find(x => x.k.includes('branch')).a(q) },
  { k: ['contact', 'phone', 'call', 'number', 'email', 'viber', 'reach', 'talk', 'agent', 'human', 'person', 'sales'], a: () => ({ t: '<p>You can reach our team at:</p><ul><li><b>Sales:</b> 0933 867 2954 · 0915 245 3528</li><li><b>Office:</b> (02) 7956 0521</li><li><b>Customer service:</b> 0956 416 0815</li><li><b>Quotes:</b> sales@dpymi.com.ph</li><li><b>Repairs &amp; maintenance:</b> service@dpymi.com.ph</li><li><b>Everything else:</b> hello@dpymi.com.ph</li></ul>', x: [CALL, MAIL, MSGR] }) },
  { k: ['storage tank', 'buffer tank', 'tanks', 'pump', 'pumps', 'circulation', 'booster', 'pipe', 'pipes', 'ppr', 'fittings', 'fitting', 'valve', 'aquaplast', 'ac thor', 'acthor', 'thor', 'my pv', 'mypv', 'surplus', 'system', 'systems', 'accessories'], a: () => ({ t: '<p>Besides water heaters, we supply the <b>whole hot water system</b>:</p><ul><li><b>Storage tanks</b>: Champion, HAASE, Enermax</li><li><b>Circulation pumps</b>: Wilo, Grundfos</li><li><b>PPR pipes &amp; fittings</b>: Aquaplast</li><li><b>AC·THOR</b> (my-PV): sends surplus solar-panel power into heating water</li></ul>', x: [`<a class="l" href="water-heaters?type=tank">Tanks</a>`, '<a class="l" href="products/wilo-pumps">Pumps</a>', '<a class="l" href="products/aquaplast-ppr-pipes">Pipes</a>', '<a class="l" href="water-heaters?type=control">AC·THOR</a>', QUOTE] }) },
  { k: ['brand', 'brands', 'carry', 'sell', 'distributor', 'supplier', 'dealer'], a: q => {
      const b = Object.entries(BRANDS).find(([k]) => k.split('|').some(w => q.includes(w)))
      if (b) { const [n, what, url] = b[1]; return { t: `<p>Yes, we supply <b>${n}</b> ${what}.</p>`, x: [url ? `<a class="l" href="water-heaters?type=${url}">View ${n}</a>` : '', QUOTE].filter(Boolean) } }
      return { t: '<p>We supply, install and service <b>Rheem, Everhot, Aquapower, HAASE, Deron, 5 Star, Enermax, Champion</b>, plus Wilo and Grundfos pumps, Systemair and Katen fans, and Aquaplast pipes. Gratek is our own home brand.</p>', x: [sec('heaters', 'Our water heaters')] } } },
  { k: Object.keys(BRANDS).flatMap(k => k.split('|')), a: q => I.find(x => x.k.includes('brands')).a(q) },
  { k: ['gratek'], a: () => ({ t: '<p><b>Gratek Smart Water Corp.</b> is the DPY company for homes and shops, your one-stop hub for hot water at home: sales consultation, on-site inspection, repairs and maintenance.</p>', x: ['<a class="l" href="about#gratek">About Gratek</a>'] }) },
  { k: ['client', 'clients', 'project', 'projects', 'reference', 'experience', 'trusted', 'portfolio'], a: () => ({ t: '<p>We\'ve supplied hot water systems for hotels, hospitals and businesses across the Philippines, including <b>Shangri-La, City of Dreams Manila, Dusit Thani, Makati Medical Center</b> and <b>Chong Hua Hospital</b>.</p>', x: [sec('clients', 'See our clients')] }) },
  { k: ['about', 'who are you', 'company', 'since', 'history', 'dpy', 'mercantile'], a: () => ({ t: '<p><b>DPY Mercantile Inc.</b> has supplied, installed and serviced water heaters since 2001: instant, storage, heat pump and solar, for homes, hotels and hospitals across the Philippines.</p>', x: [sec('heaters', 'Our water heaters'), sec('clients', 'Our clients')] }) },
  { k: ['hours', 'open', 'opening', 'schedule', 'weekend', 'sunday', 'saturday'], a: () => ({ t: '<p>Our branches are open <b>Monday to Saturday, 8:00 AM to 5:00 PM</b>, closed on Sundays and holidays.</p><p>For repairs outside those hours, call our customer service line: 0956 416 0815.</p>', x: [CALL, sec('branches', 'Find a branch')] }) },
  { k: ['thanks', 'thank you', 'salamat', 'ty', 'ok', 'okay', 'great'], a: () => ({ t: '<p>You\'re welcome! Anything else I can help with?</p>', c: ['Find a branch', 'Get a quote'] }) },
]
const START = ['Which heater for my condo?', 'Instant vs storage?', 'How much does it cost?', 'Find a branch', 'Repair or maintenance']
const norm = s => ' ' + s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ') + ' '
function answer(raw) {
  const q = norm(raw); let best = null, top = 0
  for (const it of I) { let s = 0; for (const w of it.k) if (q.includes(' ' + w + ' ') || (w.length > 4 && q.includes(w))) s += w.includes(' ') ? 3 : 1 /* a matched phrase beats single words */; if (s > top) { top = s; best = it } }
  if (best) return best.a(q)
  return { t: '<p>I\'m not sure about that one yet. Our team can answer it directly:</p>', x: [CALL, MAIL], c: START.slice(0, 3) }
}
const scroll = () => log.scrollTop = log.scrollHeight
function bot({ t, x = [], c }) {
  const m = document.createElement('div'); m.className = 'msg bot'; m.innerHTML = t + (x.length ? `<div class="acts">${x.join('')}</div>` : '')
  m.querySelectorAll('a[data-quiz]').forEach(a => { if (!window.DPYquiz) { a.removeAttribute('data-quiz'); a.setAttribute('href', 'water-heaters#finder') } })
  m.querySelectorAll('a[href]').forEach(a => { const u = a.getAttribute('href'); if (!/^(#|[a-z]+:)/i.test(u)) a.href = B + u.replace(/^#/, '') })
  log.append(m)
  setChips(c || []); scroll()
}
function me(s) { const m = document.createElement('div'); m.className = 'msg me'; m.textContent = s; log.append(m); scroll() }
function setChips(c) { chips.innerHTML = c.map(s => `<button type="button">${s}</button>`).join(''); chips.hidden = !c.length }
let busy = false
function ask(s) {
  s = s.trim(); if (!s || busy) return; busy = true; root.classList.add('thinking'); me(s); input.value = ''; setChips([])
  const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; log.append(ty); scroll()
  setTimeout(() => { ty.remove(); bot(answer(s)); busy = false; root.classList.remove('thinking') }, RM ? 0 : 550 + Math.min(700, s.length * 12))
}
chips.addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent) })
form.addEventListener('submit', e => { e.preventDefault(); ask(input.value) })
log.addEventListener('click', e => { const q = e.target.closest('[data-quiz]'); if (q) { toggle(false); if (window.DPYquiz && !e.defaultPrevented) { e.preventDefault(); window.DPYquiz(q) } return } const a = e.target.closest('a[data-go]'); if (!a) return; e.preventDefault(); toggle(false); (window.DPYgo || window.DPY?.go)?.(a.getAttribute('href')) })
let started = false
function toggle(o) {
  root.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); tip.classList.remove('on')
  if (o && !started) { started = true; bot({ t: '<p>Hi! 👋 I\'m the DPY Assistant.</p><p>I can help you choose a water heater, find a branch, or get a free quote. What do you need?</p>', c: START }) }
  if (o) setTimeout(() => input.focus({ preventScroll: true }), 300)
}
btn.addEventListener('click', () => toggle(true)); $('.x', win).addEventListener('click', () => toggle(false))
addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('open')) toggle(false) })
// a gentle nudge once, after the visitor has had time to look around
let tipT = setTimeout(() => { if (started) return; tip.classList.add('on'); tipT = setTimeout(() => tip.classList.remove('on'), 7000) }, 9000)
$('button', tip).addEventListener('click', () => { tip.classList.remove('on'); clearTimeout(tipT) })
}, { timeout: 1500 })
})()
