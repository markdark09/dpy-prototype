// helpers and the page layout for tools/build.mjs, which writes the inner pages (about.html, water-heaters.html, products/*.html ...) from src/.
// The output is plain static HTML, committed with the site, so Cloudflare still deploys with no build step.
// The homepage (index.html) is hand-written and not touched by this script.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { PRODUCTS, CATS } from '../src/products.mjs'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SPECS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/specs.json'), 'utf8'))
export const SITE = 'https://prototype.dpy-mi.workers.dev/' // swap to the real domain at launch
// /assets/* is cached for 30 days (_headers), so the shared files carry a content hash: a change gets a new address
// the shared styles are written into each page (no stylesheet request to wait for before the first paint);
// minified a little, and their relative font and image addresses pointed at the right folder for the page
export const inlineCss = (R, files) => files.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n+/g, '\n').replace(/url\(\.\.\//g, `url(${R}assets/`).trim()
export const ver = f => createHash('sha1').update(fs.readFileSync(path.join(ROOT, f))).digest('hex').slice(0, 8)
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------- image sizes (read from the webp/png/jpg header, so every <img> gets width and height) ----------
const dimCache = {}
export function dims(rel) {
  if (dimCache[rel]) return dimCache[rel]
  const b = fs.readFileSync(path.join(ROOT, rel)); let d = [0, 0]
  if (b.toString('ascii', 0, 4) === 'RIFF') {
    const t = b.toString('ascii', 12, 16)
    if (t === 'VP8X') d = [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
    else if (t === 'VP8L') { const n = b.readUInt32LE(21); d = [(n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1] }
    else d = [b.readUInt16LE(26) & 0x3FFF, b.readUInt16LE(28) & 0x3FFF]
  } else if (b[0] === 0x89) d = [b.readUInt32BE(16), b.readUInt32BE(20)]
  else if (b[0] === 0xFF) { let i = 2; while (i < b.length) { const m = b[i + 1], L = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) { d = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break } i += 2 + L } }
  return (dimCache[rel] = d)
}
// large photos that have a phone-size copy (name-800.webp) get a srcset, so phones download the small one;
// sizes = how wide the photo shows on the page (default: full width on phones, about 60% of the screen otherwise)
export const img = (R, rel, alt, extra = '', sizes = '(max-width:640px) 100vw, 60vw') => {
  const [w, h] = dims(rel), small = rel.replace(/\.webp$/, '-800.webp')
  const set = w > 800 && !extra.includes('srcset') && rel !== small && fs.existsSync(path.join(ROOT, small)) ? ` srcset="${R}${small} 800w, ${R}${rel} ${w}w" sizes="${sizes}"` : ''
  return `<img src="${R}${rel}" width="${w}" height="${h}" alt="${esc(alt)}"${set}${extra}>`
}

// ---------- icons ----------
export const I = {
  arr: '<svg aria-hidden="true"><use href="#arr"/></svg>',
  ext: '<svg aria-hidden="true"><use href="#ext"/></svg>',
  ck: '<svg aria-hidden="true"><use href="#ck"/></svg>',
  plus: '<svg aria-hidden="true"><use href="#plus"/></svg>',
  tel: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 1.8h2.4l1.2 3-1.6 1a8 8 0 0 0 5.2 5.2l1-1.6 3 1.2v2.4a1.5 1.5 0 0 1-1.6 1.5A12.5 12.5 0 0 1 1.5 3.4 1.5 1.5 0 0 1 3 1.8z"/></svg>',
  mail: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M2 4l6 5 6-5"/></svg>',
  pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z"/><circle cx="8" cy="6.5" r="1.8"/></svg>',
  clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="6.2"/><path d="M8 4.6V8l2.4 1.6"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.2 7.1V22l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.9l-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 5-2.7-5.5 5.8z"/></svg>',
  vb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.4 1.5c-2.6 0-7 .4-8.6 2C1.5 4.8 1 6.7 1 9.3v2.4c0 2.6.5 4.5 1.8 5.8.8.8 2 1.3 3.2 1.6v3c0 .6.7.9 1.1.5l2.9-3c.6 0 1.2.1 1.8.1 2.6 0 7-.4 8.6-2 1.3-1.3 1.6-3.2 1.6-5.8V9.3c0-2.6-.4-4.5-1.6-5.8-1.6-1.6-6-2-8.6-2zm4.8 13.2c-.3.8-1.5 1.5-2.2 1.5-.6 0-1.2-.2-3.5-1.4-2.6-1.4-4.4-4.1-4.5-4.3-.2-.2-1-1.4-1-2.7 0-1.3.7-1.9.9-2.2.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.2 1.6z"/></svg>',
}
// the "Ask DPY" chat (behaviour in assets/js/ask.js)
export const ASK = fs.readFileSync(path.join(ROOT, 'src/ask.html'), 'utf8').trim()
export const MSGR = `<a class="msgr fb" href="https://m.me/dpymercantileinc" target="_blank" rel="noopener">${I.fb}Messenger</a><a class="msgr vb" href="viber://chat?number=%2B639338672954">${I.vb}Viber</a>`

// ---------- shared data ----------
export const BRANCHES = [
  { k: 'manila', n: 'Manila', rg: 'Head office · Luzon', a: '778-B Mahogany St., Octagon Village, Brgy. Dela Paz, Pasig City', ll: [14.6111876, 121.0954281] },
  { k: 'boracay', n: 'Boracay', rg: 'Visayas', a: 'Station 2, Manoc-Manoc, Boracay Island, Malay, Aklan', ll: [11.9609959, 121.9246445] },
  { k: 'iloilo', n: 'Iloilo', rg: 'Visayas', a: '2nd Floor Agro Building, Jalandoni Street, Brgy. Villa Anita, Iloilo City', ll: [10.7162841, 122.5586473] },
  { k: 'cebu', n: 'Cebu', rg: 'Visayas', a: '3rd Floor Horacio Sr. Centre, S.B. Cabahug, Ibabao-Estancia, Mandaue City', ll: [10.3350685, 123.9450424] },
  { k: 'davao', n: 'Davao', rg: 'Mindanao', a: 'Camella Northpoint, J.P. Laurel Avenue, Bajada, Davao City', ll: [7.0964317, 125.613112] },
]
export const CLIENTS = {
  'Hotels & Resorts': [['shangri-la', 'Shangri-La'], ['city-of-dreams', 'City of Dreams Manila'], ['dusit-thani', 'Dusit Thani'], ['marco-polo', 'Marco Polo Hotels'], ['sheraton', 'Sheraton Cebu Mactan'], ['four-points', 'Four Points by Sheraton'], ['holiday-inn', 'Holiday Inn Makati'], ['fairfield', 'Fairfield by Marriott'], ['ascott', 'The Ascott'], ['ibis', 'ibis'], ['summit', 'Summit Hotels & Resorts'], ['discovery-shores', 'Discovery Shores Boracay'], ['taal-vista', 'Taal Vista Hotel'], ['maribago', 'Maribago Bluewater'], ['red-planet', 'Red Planet'], ['go-hotels', 'Go Hotels']],
  'Hospitals & Schools': [['makati-med', 'Makati Medical Center'], ['chong-hua', 'Chong Hua Hospital'], ['ace-iloilo', 'Ace Hospital Iloilo'], ['u-baguio', 'University of Baguio']],
  'Residences & Offices': [['arya', 'Arya Residences'], ['trion', 'The Trion Towers'], ['proscenium', 'Proscenium at Rockwell'], ['msr', 'Discovery Primea'], ['park-avenue', 'Park Avenue Hotel & Suites'], ['jp-morgan', 'J.P. Morgan']],
  'Food & Fitness': [['starbucks', 'Starbucks'], ['mcdonalds', "McDonald's"], ['kfc', 'KFC'], ['dunkin', "Dunkin'"], ['shakeys', "Shakey's"], ['fitness-first', 'Fitness First']],
}
export { PRODUCTS, CATS }
export const prodImg = p => p.img ? `assets/img/dpy/${p.img}.webp` : ''

// ---------- spec tables ----------
const SUP = { 1: '¹', 2: '²', 3: '³' }
const META = /printed as|transcribed|merged cells|presumably|Sheet heading|not printed/i
function prepSpec(key) {
  let s = JSON.parse(JSON.stringify(SPECS[key]))
  if (key === 'CHAMPION-STORAGE-TANK-SPECS') { // only the dimensions the drawing makes unambiguous: B is the overall height, C the diameter
    s.columns = ['Model', 'Capacity (gallons)', 'Capacity (liters, approx.)', 'Overall height (mm)', 'Diameter (mm)']
    s.rows = s.rows.map(r => [r[0], r[1], (Math.round(+r[1] * 3.785 / 10) * 10).toLocaleString('en-PH'), r[3], r[4]])
    s.notes = ['Custom sizes from 350 to 2,000 gallons. Full dimension drawing available on request.']
  }
  if (key === '5-Star-Integral-Heat-Pump-Specifications-') s.notes = ['Every model includes a 1.5 kW backup electric heater, an electronic expansion valve, a magnesium anode and a relief and safety valve.', 'An extra heat exchanger coil (for solar, for example) is optional. Ask for it before ordering.']
  if (key === 'Rheem-1-Specifications-') { // A to G only make sense next to the drawing
    const keep = s.columns.map((c, i) => !/^Dimensions \(mm\) [A-G]$/.test(c) ? i : -1).filter(i => i >= 0)
    s.columns = keep.map(i => s.columns[i]); s.rows = s.rows.map(r => keep.map(i => r[i]))
    s.columns = s.columns.map(c => c.replace('Heating time (mins)*', 'Heating time to 60°C (mins)'))
  }
  s.columns = s.columns.map(c => c.replace(/^(\d)\) (.*?)( \(.*\))?$/, (m, n, a, u) => `${a}${SUP[n]}${u || ''}`))
  s.notes = (s.notes || []).filter(n => !META.test(n)).map(n => n.replace(/ \(sheet header:.*\)$/i, '.').replace(/^(\d)\) ?/, (m, d) => SUP[d] + ' ').replace(/^\(\*?(.*)\)$/, '$1').replace(/^\*/, ''))
  return s
}
export function specTable(key, given) {
  const s = given ? JSON.parse(JSON.stringify(given)) : prepSpec(key)
  const n = s.rows.length, same = []
  let cols = s.columns.map((c, i) => i)
  if (n > 1) cols = cols.filter(i => { if (i === 0) return true; const v = s.rows[0][i]; if (s.rows.every(r => r[i] === v)) { same.push([s.columns[i], v]); return false } return true })
  const all = same.length ? `<p class="all"><b>All models:</b> ${same.map(([c, v]) => `${esc(c.replace(/ \(.*\)$/, ''))} ${esc(v)}${/\((.*)\)$/.test(c) && !/[a-z°]/i.test(v.replace(/[\d.,]/g, '')) ? ' ' + esc(c.match(/\((.*)\)$/)[1]) : ''}`).join(' · ')}</p>` : ''
  let table
  if (n <= 3) { // transpose: easier to read with only a few models
    table = `<div class="tscroll tall"><table><thead><tr><th scope="col">Model</th>${s.rows.map(r => `<th scope="col">${esc(r[0])}</th>`).join('')}</tr></thead><tbody>${cols.slice(1).map(i => `<tr><th scope="row">${esc(s.columns[i])}</th>${s.rows.map(r => `<td>${esc(r[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
  } else {
    table = `<div class="tscroll" tabindex="0" role="region" aria-label="${esc(s.title)}"><table><thead><tr>${cols.map(i => `<th scope="col">${esc(s.columns[i])}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${cols.map((i, j) => j ? `<td>${esc(r[i])}</td>` : `<th scope="row">${esc(r[i])}</th>`).join('')}</tr>`).join('')}</tbody></table></div><p class="scroll-hint">Swipe the table sideways to see every column.</p>`
  }
  const title = s.title.replace(/^./, c => c.toUpperCase())
  return `<div class="spec" data-r><h3>${esc(title)}</h3>${all}${table}${s.notes.length ? `<ul class="notes">${s.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`
}

// ---------- product card ----------
export function card(p, R, { h = 'h3' } = {}) {
  const c = CATS[p.cat], src = prodImg(p)
  const pic = src ? `<div class="pic${p.photo ? ' photo' : ''}">${img(R, src, p.name, ' loading="lazy"')}</div>` : `<div class="pic"><span class="noimg">${esc(p.brand.toUpperCase())}</span></div>`
  return `<article class="pc" data-cat="${p.cat}" data-for="${p.for.join(' ')}" data-r>
  <span class="tag">${c.s}</span><span class="who">${p.for.includes('home') ? '<span>Home</span>' : ''}${p.for.includes('business') ? '<span class="b">Business</span>' : ''}</span>
  ${pic}
  <p class="br">${esc(p.brand)}${p.sub ? ' · ' + esc(p.sub) : ''}</p>
  <${h}><a href="${R}products/${p.slug}">${esc(p.name)}</a></${h}>
  <p>${esc(p.short)}</p>
  <div class="kf">${p.key.slice(0, 2).map(([v, l]) => `<span><b>${esc(v)}</b> ${esc(l)}</span>`).join('')}</div>
  <div class="acts"><a class="btn ghost" href="${R}products/${p.slug}">Details</a><button class="addq" type="button" data-add="${p.slug}" data-name="${esc(p.name)}" data-img="${src}" data-cat="${p.cat}" aria-pressed="false">${I.plus}<span class="of">Add to quote</span><span class="on">In your quote</span></button></div>
</article>`
}

// ---------- layout ----------
const NAV = [['water-heaters', 'Water Heaters'], ['business', 'For Business'], ['service', 'Service'], ['projects', 'Projects'], ['about', 'About'], ['contact', 'Contact']]
function head(pg, R) {
  const url = SITE + (pg.path === 'index' ? '' : pg.path), title = pg.title.includes('DPY') ? pg.title : pg.title + ' | DPY Mercantile'
  const crumbs = pg.crumbs ? { '@type': 'BreadcrumbList', itemListElement: [['Home', SITE], ...pg.crumbs.map(([n, u]) => [n, u ? SITE + u : url])].map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u })) } : null
  const ld = [crumbs, ...(pg.ld || [])].filter(Boolean)
  return `<!doctype html>
<html lang="en-PH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(pg.desc)}">
<meta name="robots" content="noindex,nofollow"> <!-- prototype: kept out of search results; use index,follow on the live site -->
<meta name="theme-color" content="#FFFFFF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DPY Mercantile Inc.">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(pg.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${pg.ogImage ? SITE + pg.ogImage : SITE + 'assets/img/og-cover.jpg'}">
<meta property="og:locale" content="en_PH">
<meta name="twitter:card" content="summary_large_image">
${ld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld })}</script>\n` : ''}<link rel="icon" href="${R}assets/brand/dpy-icon.svg" type="image/svg+xml">
<link rel="icon" href="${R}assets/brand/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${R}assets/brand/apple-touch-icon.png">
<link rel="manifest" href="${R}site.webmanifest">
<link rel="preload" href="${R}assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
${inlineCss(R, ['assets/css/base.css', 'assets/css/site.css'])}
${(pg.css || '').trim()}
</style>
</head>`
}
const SYMBOLS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="ext" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="ck" viewBox="0 0 16 16"><path d="M3.5 8.4l2.8 2.8 6-6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="plus" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <linearGradient id="gHeat" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#5FA8EC"/><stop offset="1" stop-color="#C70A0E"/></linearGradient>
</defs></svg>`
// the homepage (pg.home) keeps its sliding highlight, its logo goes back to the top, and its quote button glides to its own form
export function nav(pg, R) {
  const cur = k => pg.nav === k ? ' aria-current="page"' : '', quote = pg.home ? '#quote' : `${R}contact#quote`
  return `<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="${pg.home ? '#top' : R || './'}" aria-label="DPY Mercantile Inc., ${pg.home ? 'back to top' : 'home'}"><img src="${R}assets/brand/dpy-logo.svg" alt="DPY Mercantile Inc." width="132" height="42"></a>
    <ul class="pill">${pg.home ? '<li class="ind" aria-hidden="true"></li>' : ''}${NAV.map(([k, t]) => `<li><a href="${R}${k}"${cur(k)}>${t}</a></li>`).join('')}</ul>
    <div class="nav-cta"><a class="btn line qt" href="${quote}">Get a Quote <span class="ql-n" hidden></span></a><button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="sheet"><i></i><i></i></button></div>
  </div>
</header>
<nav class="sheet" id="sheet" aria-label="Menu"><a href="${pg.home ? '#top' : R || './'}">Home</a>${NAV.map(([k, t]) => `<a href="${R}${k}"${cur(k)}>${t}</a>`).join('')}<a class="btn red" href="${quote}">Get a Free Quote ${I.arr}</a></nav>`
}
export function foot(R, pg) {
  const cat = k => `${R}water-heaters?type=${k}`
  return `<footer class="foot">
  <div class="wrap">
    ${pg.noCta ? '' : `<div class="foot-cta"><div><b>Not sure what you need?</b><span>Tell us about your building. We'll visit, size it and send a written quote, free.</span></div><div class="acts"><a class="btn white" href="${R}contact#quote">Get a free quote ${I.arr}</a><a class="btn line" href="tel:+639338672954">${I.tel}0933 867 2954</a></div></div>`}
    <div class="ft">
      <div class="logo"><img src="${R}assets/brand/dpy-logo.svg" alt="DPY Mercantile Inc." width="150" height="48" loading="lazy"><p>The solution to your hot water needs. Supplying, installing and servicing water heaters since 2001.</p><img class="gk" src="${R}assets/brand/gratek-logo.png" alt="Gratek Smart Water Corp." width="92" height="42" loading="lazy">
        <div class="soc"><a href="https://www.facebook.com/dpymercantileinc" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.2c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.3 2 10 3.5 10 6v2H8v3h2v11h4V11h2.7l.3-3z"/></svg></a><a href="https://www.instagram.com/dpymercantileinc" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a><a href="https://www.youtube.com/channel/UC1LmBQhJYWiKWm2b518fHGg" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2c-.2-1.6-1-2.6-2.6-2.8C17 5 12 5 12 5s-5 0-7.4.4C3 5.6 2.2 6.6 2 8.2 1.8 9.4 1.8 12 1.8 12s0 2.6.2 3.8c.2 1.6 1 2.6 2.6 2.8C7 19 12 19 12 19s5 0 7.4-.4c1.6-.2 2.4-1.2 2.6-2.8.2-1.2.2-3.8.2-3.8s0-2.6-.2-3.8zM10 15V9l5 3z"/></svg></a><a href="https://s.lazada.com.ph/s.fGdZj" target="_blank" rel="noopener" aria-label="DPY shop on Lazada"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></a></div></div>
      <div><h2>Water Heaters</h2><ul><li><a href="${cat('instant')}">Instant water heaters</a></li><li><a href="${cat('storage')}">Electric storage heaters</a></li><li><a href="${cat('heatpump')}">Heat pumps</a></li><li><a href="${cat('solar')}">Solar water heaters</a></li><li><a href="${cat('tank')}">Tanks, pumps &amp; pipes</a></li><li><a href="${R}water-heaters">All products</a></li></ul></div>
      <div><h2>Company</h2><ul><li><a href="${R}about">About DPY &amp; Gratek</a></li><li><a href="${R}business">For hotels &amp; buildings</a></li><li><a href="${R}projects">Projects &amp; clients</a></li><li><a href="${R}careers">Careers</a></li></ul></div>
      <div><h2>Help</h2><ul><li><a href="${R}service">Repairs &amp; maintenance</a></li><li><a href="${R}service#book">Book a service visit</a></li><li><a href="${R}contact#branches">Find a branch</a></li><li><a href="${R}contact#quote">Get a free quote</a></li><li><a href="${R}privacy">Privacy notice</a></li></ul></div>
      <div><h2>Contact</h2><ul><li><a href="tel:+639338672954">0933 867 2954</a></li><li><a href="tel:+639152453528">0915 245 3528</a></li><li><a href="tel:+63279560521">(02) 7956 0521</a></li><li><a href="mailto:sales@dpymi.com.ph">sales@dpymi.com.ph</a></li><li><a href="mailto:service@dpymi.com.ph">service@dpymi.com.ph</a></li><li>Mon–Sat · 8 AM – 5 PM</li></ul></div>
    </div>
    <div class="base"><span>© 2026 DPY Mercantile Inc. &amp; Gratek Smart Water Corp.</span><span><a href="${R}privacy">Privacy notice</a> · Prototype by Makarios IT Solutions · product photos from dpymi.com.ph</span></div>
  </div>
</footer>`
}
export function crumbsHtml(R, list) {
  return `<ol class="crumbs"><li><a href="${R || './'}">Home</a></li>${list.map(([n, u], i) => i === list.length - 1 ? `<li><span aria-current="page">${esc(n)}</span></li>` : `<li><a href="${R}${u}">${esc(n)}</a></li>`).join('')}</ol>`
}
export function page(pg) {
  const R = pg.path.includes('/') ? '../'.repeat(pg.path.split('/').length - 1) : ''
  const body = typeof pg.body === 'function' ? pg.body(R) : pg.body
  return `${head(pg, R)}
<body class="pg-${pg.nav || 'x'}">
<script>document.documentElement.classList.add('js');if(matchMedia('(pointer:coarse)').matches||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData)document.documentElement.classList.add('lite')</script>
<a class="skip" href="#main">Skip to content</a>
${SYMBOLS}
${nav(pg, R)}
<main id="main">
${body.trim()}
</main>
${foot(R, pg)}
${ASK}
<script src="${R}assets/vendor/lenis.min.js" defer></script>
<script src="${R}assets/js/site.js?v=${ver('assets/js/site.js')}" defer></script>
<script src="${R}assets/js/ask.js?v=${ver('assets/js/ask.js')}" defer></script>
${pg.js ? `<script>\naddEventListener('DOMContentLoaded', () => { // after site.js (deferred), so window.DPY is ready\nconst { $, $$, RM, go, quote } = DPY\n${(typeof pg.js === 'function' ? pg.js(R) : pg.js).trim()}\n})\n</script>\n` : ''}</body>
</html>
`
}

