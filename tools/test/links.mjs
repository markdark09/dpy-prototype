// Every link on every page leads somewhere real: internal pages answer 200 (after any redirect),
// and a link to a #section finds that section on its page. External links are listed, not fetched.
import { chromium, BASE, sitemapPaths, DESKTOP, open, check, done } from './lib.mjs'

const b = await chromium.launch()
const ctx = await b.newContext(DESKTOP)
const seen = new Map() // url (no hash) -> { status, ids }
const pageInfo = async url => {
  if (seen.has(url)) return seen.get(url)
  const p = await ctx.newPage()
  let info
  try {
    const res = await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(150)
    info = { status: res ? res.status() : 0, ids: await p.evaluate(() => [...document.querySelectorAll('[id]')].map(e => e.id)) }
  } catch (e) { info = { status: 0, ids: [], err: e.message.split('\n')[0] } }
  await p.close(); seen.set(url, info); return info
}
const external = new Set()
for (const path of sitemapPaths()) {
  const p = await open(ctx, path, { wait: 300 })
  const links = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => new URL(a.getAttribute('href'), location.href).href))])
  await p.close()
  const bad = []
  for (const href of links) {
    const u = new URL(href)
    if (!/^https?:$/.test(u.protocol)) continue // tel:, mailto:, viber:
    if (u.origin !== new URL(BASE).origin) { external.add(u.origin); continue }
    const target = u.origin + u.pathname + u.search
    const info = await pageInfo(target)
    const id = decodeURIComponent(u.hash.slice(1))
    if (info.status !== 200 || (id && !['top', 'finder'].includes(id) && !info.ids.includes(id))) bad.push(`${u.pathname}${u.search}${u.hash} -> ${info.status}${id && !info.ids.includes(id) ? ' (no #' + id + ')' : ''}`)
  }
  check(`${path}: ${links.length} links lead somewhere real`, !bad.length, bad.slice(0, 5))
}
console.log('external sites linked:', [...external].join(', '))
await done(b)
