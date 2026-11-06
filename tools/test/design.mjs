// Layout rules that have broken before, checked on every page or product so they can't come back:
// - the header's phone number is readable over the For Business photo
// - product benefit cards fill their rows (no gap on the last row) at desktop and tablet width
// - spec tables fit their box, or show the edge shadow that says they scroll
// - phone grid cards keep "Add" on one line
// - small grey text meets 4.5:1 contrast on white
import fs from 'node:fs'
import path from 'node:path'
import { chromium, ROOT, PHONE, DESKTOP, TABLET, open, check, done, revealAll } from './lib.mjs'

const b = await chromium.launch()
const products = fs.readdirSync(path.join(ROOT, 'products')).filter(f => f.endsWith('.html')).map(f => '/products/' + f.replace(/\.html$/, ''))
const desk = await b.newContext(DESKTOP)

{
  const p = await open(desk, '/business')
  const c = await p.evaluate(() => getComputedStyle(document.querySelector('.nav-tel')).color)
  check('For Business: header number is white over the photo', c === 'rgb(255, 255, 255)', c)
  await p.close()
}

// rows of benefit cards: every row's cards together span the grid's full width
const rowsFull = p => p.evaluate(() => {
  const g = document.querySelector('.feats'); if (!g) return { none: true }
  const gr = g.getBoundingClientRect(), rows = {}
  for (const c of g.children) { const r = c.getBoundingClientRect(); const k = Math.round(r.top); (rows[k] ||= []).push(r) }
  const bad = Object.values(rows).filter(rs => Math.max(...rs.map(r => r.right)) < gr.right - 2 || Math.min(...rs.map(r => r.left)) > gr.left + 2)
  return { cards: g.children.length, rows: Object.keys(rows).length, bad: bad.length }
})
const tab = await b.newContext({ ...TABLET, viewport: { width: 900, height: 1180 } })
for (const url of products) {
  const p = await open(desk, url, { wait: 200 }); await revealAll(p)
  const r = await rowsFull(p)
  if (!r.none) check(`${url}: benefit cards fill their rows (desktop)`, r.bad === 0, r)
  const t = await p.evaluate(() => [...document.querySelectorAll('.tscroll')].map(s => {
    const over = s.scrollWidth > s.clientWidth + 1
    return { over, shadow: /local/.test(getComputedStyle(s).backgroundAttachment) }
  }))
  t.forEach((x, i) => check(`${url}: spec table ${i + 1} fits or shows it scrolls`, !x.over || x.shadow, x))
  await p.close()
  if (!r.none) {
    const q = await open(tab, url, { wait: 200 }); await revealAll(q)
    const r2 = await rowsFull(q)
    check(`${url}: benefit cards fill their rows (tablet)`, r2.bad === 0, r2)
    await q.close()
  }
}

{
  const phone = await b.newContext(PHONE)
  const p = await open(phone, '/water-heaters')
  const r = await p.evaluate(() => [...document.querySelectorAll('.cat-grid .addq')].slice(0, 8).map(e => ({ h: e.offsetHeight, lines: Math.round(e.querySelector('.of').getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight || 16)), text: e.innerText.trim() })))
  const q = await open(phone, '/products/aquapower-s35m-s45m')
  const hid = await q.evaluate(() => { const b = document.querySelector('.qbar'); return { on: b.classList.contains('on'), vis: getComputedStyle(b).visibility } })
  check('product quote bar is fully hidden until its buttons scroll away', !hid.on && hid.vis === 'hidden', hid)
  await q.close()
  check('phone grid: quote buttons on one line', r.length && r.every(x => x.h <= 40 && x.text === 'Add'), r.slice(0, 2))
  await p.close()
}

{
  // the light grey (--dim) and the footer's small print against white
  const p = await open(desk, '/')
  const cr = await p.evaluate(() => {
    const lum = c => c.match(/[\d.]+/g).slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0)
    const ratio = c => (1.05) / (lum(c) + .05)
    const probe = document.createElement('span'); probe.style.color = 'var(--dim)'; document.body.append(probe)
    const dim = getComputedStyle(probe).color; probe.remove()
    return { dim: ratio(dim), base: ratio(getComputedStyle(document.querySelector('.base')).color) }
  })
  check('small grey text: 4.5:1 or more on white', cr.dim >= 4.5 && cr.base >= 4.5, cr)
  await p.close()
}
// the closing banner fits each page, its links lead somewhere real, and the product banner's finder opens
{
  const want = { '/': null, '/water-heaters': 'Ready for a quote?', '/products/rheem': 'Not sure this is the one?', '/compare': 'Ready for a quote?',
    '/business': 'Planning a building?', '/projects': 'Planning a building?', '/service': 'Hot water stopped?', '/about': 'Not sure what you need?',
    '/careers': null, '/contact': null, '/privacy': null }
  for (const [url, title] of Object.entries(want)) {
    const p = await open(desk, url, { wait: 0 })
    const r = await p.evaluate(() => { const c = document.querySelector('.foot-cta'); return c ? { title: c.querySelector('b').textContent, links: [...c.querySelectorAll('a')].map(a => a.getAttribute('href')) } : null })
    check(`${url}: closing banner`, title === null ? r === null : r?.title === title, r)
    for (const h of (r?.links || []).filter(h => !h.startsWith('tel:'))) {
      const res = await fetch(new URL(h, p.url()).href.split('#')[0])
      check(`${url}: banner link ${h} works`, res.status === 200, res.status)
    }
    await p.close()
  }
  const p = await open(desk, '/water-heaters#finder', { wait: 900 })
  check('water-heaters#finder opens the finder', await p.evaluate(() => !!document.querySelector('.qz.on')))
  await p.close()
}

// For Business: the system section lights one part per step, and on phones the diagram slides to it
for (const [name, opts] of [['desktop', DESKTOP], ['phone', PHONE]]) {
  const ctx = await b.newContext(opts)
  const p = await open(ctx, '/business', { wait: 600 })
  const seen = []
  for (const k of ['heat', 'store', 'move', 'return']) {
    // bring this step's heading to the reading line (the diagram's middle on desktop, the space under it on phones)
    for (let i = 0; i < 3; i++) await p.evaluate(k => {
      const h = document.querySelector(`.sys-steps li[data-step="${k}"] h3`).getBoundingClientRect(), v = document.querySelector('.sys-vis').getBoundingClientRect()
      const line = innerWidth > 980 ? v.top + v.height / 2 : (Math.max(v.bottom, 0) + innerHeight) / 2
      scrollBy(0, h.top + h.height / 2 - line)
    }, k).then(() => p.waitForTimeout(250))
    await p.waitForTimeout(900)
    seen.push(await p.evaluate(() => ({ step: document.querySelector('.sys .sch').dataset.step, x: Math.round(document.querySelector('.sys [data-x]').scrollLeft), stuck: Math.round(document.querySelector('.sys-vis').getBoundingClientRect().top) })))
  }
  const steps = seen.map(s => s.step).join(',')
  check(`${name} For Business: each step lights its part`, steps === 'heat,store,move,return', seen)
  if (name === 'phone') check('phone For Business: the diagram slides to each part', seen[3].x > seen[1].x && seen[1].x > seen[0].x, seen.map(s => s.x))
  check(`${name} For Business: the diagram stays in view`, seen.slice(1).every(s => s.stuck >= 0 && s.stuck < 400), seen.map(s => s.stuck))
  check(`${name} For Business: no script errors`, !p.errors.length, p.errors)
  await ctx.close()
}

// the savings calculator: 60 showers a day at ₱15/kWh (0.70 kWh of heat each; electric 95% efficient; heat pump COP 3.5; solar 65%)
{
  const ctx = await b.newContext({ ...DESKTOP, reducedMotion: 'reduce' })
  const p = await open(ctx, '/', { wait: 800 })
  await p.evaluate(() => document.querySelector('.sav-card').scrollIntoView({ block: 'center' })); await p.waitForTimeout(1200)
  const v = await p.evaluate(() => ({ e: document.querySelector('.svE').textContent, s: document.querySelector('.svS').textContent, rate: document.querySelector('#svR').value }))
  check('savings: 60 showers at ₱15 gives ₱241,246 electric and ₱175,765 saved', v.e === '₱241,246' && v.s === '₱175,765' && v.rate === '15', v)
  await ctx.close()
}

// phone numbers can be copied: dragging across one with a mouse selects it instead of dragging the link
{
  const p = await open(desk, '/contact', { wait: 600 })
  const a = p.locator('.qp-call .nums a').first(); await a.scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
  const bb = await a.boundingBox()
  await p.mouse.move(bb.x + 1, bb.y + bb.height / 2); await p.mouse.down()
  for (let i = 1; i <= 12; i++) await p.mouse.move(bb.x + (bb.width - 1) * i / 12, bb.y + bb.height / 2)
  await p.mouse.up()
  const sel = await p.evaluate(() => getSelection().toString())
  check('a phone number drag-selects for copying', sel === '0933 867 2954', sel)
  await p.close()
}

// logo walls fill their rows: Projects (every filter) and the homepage clients (all sizes)
for (const [name, opts] of [['desktop', DESKTOP], ['tablet', TABLET], ['phone', PHONE]]) {
  const ctx = await b.newContext(opts)
  const p = await open(ctx, '/projects', { wait: 500 })
  const rowsOf = sel => p.evaluate(sel => { const r = {}; [...document.querySelectorAll(sel)].filter(l => !l.hidden && l.offsetWidth).forEach(l => { const t = Math.round(l.getBoundingClientRect().top); r[t] = (r[t] || 0) + 1 }); return Object.values(r) }, sel)
  const all = await rowsOf('.lg li')
  check(`${name} Projects: all 32 logos in full rows`, all.every(n => n === all[0]), all)
  const q = await open(ctx, '/', { wait: 500 })
  const home = await q.evaluate(() => { const r = {}; [...document.querySelectorAll('.cl-grid > *')].forEach(l => { const t = Math.round(l.getBoundingClientRect().top); r[t] = (r[t] || 0) + 1 }); return Object.values(r) })
  check(`${name} homepage: client logos in full rows`, home.every(n => n === home[0]), home)
  await ctx.close()
}

// text size floors on every page: reading text (a sentence, normal weight) 12.5px and up; nothing under 11px (10.5px on phones)
{
  const { sitemapPaths } = await import('./lib.mjs')
  for (const [name, opts, floor] of [['desktop', DESKTOP, 11], ['phone', PHONE, 10.5]]) {
    const ctx = await b.newContext(opts)
    for (const url of sitemapPaths()) {
      const p = await open(ctx, url, { wait: 0 })
      const small = await p.evaluate(fl => {
        const out = []
        for (const el of document.querySelectorAll('body *')) {
          if (!el.offsetWidth || el.closest('#askWin, .sheet, .ctray, .maplibregl-ctrl, svg, [aria-hidden="true"]')) continue
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()
          if (own.length < 2) continue
          const s = getComputedStyle(el), fs = parseFloat(s.fontSize)
          const reading = own.length >= 25 && +s.fontWeight < 600
          if (fs < fl || (reading && fs < 12.5)) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${fs}px "${own.slice(0, 24)}"`)
        }
        return [...new Set(out)]
      }, floor)
      check(`${name} ${url}: text sizes`, !small.length, small.slice(0, 4))
      await p.close()
    }
    await ctx.close()
  }
}
await done(b)
