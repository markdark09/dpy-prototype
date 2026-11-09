// Page transitions and iPhone spacing.
// A) Tapping a product card cross-fades into the product page and carries its photo; with reduced motion there is no transition.
//    WebKit (Safari's engine) runs too when it is installed on this machine; otherwise that is reported, not failed.
// B) With an iPhone's notch and home-bar insets set (Chromium's safe-area override, portrait and landscape),
//    nothing fixed to the screen edge sits inside them and the page never scrolls sideways.
import { chromium, webkit, BASE, check, done, shot } from './lib.mjs'

async function transition(type, name, reduced) {
  const b = await type.launch()
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  await ctx.addInitScript(() => {
    window.__vt = 'no-event'
    addEventListener('pagereveal', e => {
      window.__vt = e.viewTransition ? 'transition' : 'none'
      if (e.viewTransition) window.__names = [...document.querySelectorAll('*')].map(el => getComputedStyle(el).viewTransitionName).filter(n => n && n !== 'none')
    })
  })
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(BASE + '/water-heaters', { waitUntil: 'load' })
  const link = p.locator('.pc a[href*="products/"]').first()
  await link.scrollIntoViewIfNeeded()
  await Promise.all([p.waitForURL(/\/products\//), link.click()])
  await p.waitForLoadState('load')
  const r = await p.evaluate(() => ({ vt: window.__vt, names: [...new Set(window.__names || [])] }))
  await p.goBack(); await p.waitForLoadState('load')
  const back = new URL(p.url()).pathname
  if (reduced) check(`${name} reduced motion: no transition`, r.vt !== 'transition' && back === '/water-heaters' && !errs.length, { ...r, back, errs })
  else check(`${name} card to product: cross-fade carrying the photo`, r.vt === 'transition' && r.names.includes('product-photo') && r.names.includes('site-nav') && back === '/water-heaters' && !errs.length, { ...r, back, errs })
  await b.close()
}
await transition(chromium, 'chromium', false)
await transition(chromium, 'chromium', true)
try { await (await webkit.launch()).close(); await transition(webkit, 'webkit', false); await transition(webkit, 'webkit', true) }
catch (e) { console.log(`skip webkit: not installed here (${e.message.split('\n')[0].slice(0, 80)})`) }

const b = await chromium.launch()
const cases = [
  // in Safari (not full-screen: the manifest says "browser") the status bar sits outside the page, so portrait's top inset is 0
  { label: 'portrait', vp: { width: 390, height: 844 }, ins: { top: 0, bottom: 34, left: 0, right: 0 } },
  { label: 'landscape', vp: { width: 844, height: 390 }, ins: { top: 0, bottom: 21, left: 47, right: 47 } },
]
for (const c of cases) for (const url of ['/', '/products/aquapower-s35m-s45m', '/compare', '/water-heaters', '/careers']) {
  const ctx = await b.newContext({ viewport: c.vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const p = await ctx.newPage()
  const cdp = await ctx.newCDPSession(p)
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: c.ins })
  await p.goto(BASE + url, { waitUntil: 'load' }); await p.waitForTimeout(400)
  // bring up the bars that only show after an action
  if (url === '/water-heaters') { await p.locator('.pc [data-cmp]').first().click().catch(() => {}); await p.waitForTimeout(300) }
  if (url.startsWith('/products/')) { await p.evaluate(() => scrollBy(0, document.querySelector('.ph-acts').getBoundingClientRect().bottom + 200)); await p.waitForTimeout(700) }
  const m = await p.evaluate(() => {
    const vw = innerWidth, vh = innerHeight, out = {}
    for (const sel of ['.ask', '.ctray', '.qbar', '.cbar', '.cmpbar', '.ph-acts']) {
      const el = document.querySelector(sel); if (!el) continue
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue
      const r = el.getBoundingClientRect(); if (!r.width || r.bottom <= 0 || r.top >= vh) continue
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
      // the bar's own content box, so a full-width background reaching the edge is fine
      const pad = ['paddingLeft', 'paddingRight', 'paddingBottom'].map(k => parseFloat(cs[k]))
      out[sel] = { bottom: Math.round(vh - r.bottom + pad[2]), left: Math.round(r.left + pad[0]), right: Math.round(vw - r.right + pad[1]), full: r.width >= vw - 1 }
    }
    // the header bar spans the screen; what must clear the notch is what's on it
    const nav = document.querySelector('.nav'), brand = nav?.querySelector('.brand')?.getBoundingClientRect()
    const last = [...(nav?.querySelectorAll('.nav-cta > *') || [])].filter(e => e.offsetWidth).pop()?.getBoundingClientRect()
    const header = brand && last && !nav.classList.contains('up') ? { top: Math.round(brand.top), left: Math.round(brand.left), right: Math.round(vw - last.right) } : null
    const qbar = document.querySelector('.qbar'), qbarShown = qbar && getComputedStyle(qbar).display !== 'none'
    return { out, header, qbarOn: qbarShown ? qbar.classList.contains('on') : null, side: document.documentElement.scrollWidth > vw + 1 }
  })
  check(`${c.label} ${url}: no sideways scroll`, !m.side)
  if (m.header) check(`${c.label} ${url}: header logo and buttons clear of the notch`, m.header.top >= c.ins.top && m.header.left >= c.ins.left && m.header.right >= c.ins.right, m.header)
  if (url.startsWith('/products/') && m.qbarOn !== null) check(`${c.label} ${url}: quote bar shows once its buttons scroll away`, m.qbarOn === true && !!m.out['.qbar'], m.qbarOn)
  for (const [sel, v] of Object.entries(m.out)) {
    const atBottom = v.bottom < 120
    const clear = (!atBottom || v.bottom >= c.ins.bottom) && v.left >= c.ins.left && v.right >= c.ins.right
    check(`${c.label} ${url}: ${sel} clear of the notch and home bar`, clear, v)
  }
  await shot(p, `safe-${c.label}${url.replace(/\W+/g, '-')}`)
  await ctx.close()
}
await done(b)
