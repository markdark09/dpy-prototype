// Every page in sitemap.xml at phone, tablet and desktop: it loads, has no script errors, never scrolls sideways,
// and on phones and tablets no text field is under 16px (iOS zooms the page into smaller ones).
import { chromium, sitemapPaths, PHONE, TABLET, DESKTOP, open, check, done } from './lib.mjs'

const b = await chromium.launch()
const paths = sitemapPaths()
check('sitemap lists the pages', paths.length >= 30, paths.length)
for (const [name, opts] of [['phone', PHONE], ['tablet', TABLET], ['desktop', DESKTOP]]) {
  const ctx = await b.newContext(opts)
  for (const url of paths) {
    const p = await open(ctx, url, { wait: 0 })
    const r = await p.evaluate(() => ({
      side: document.documentElement.scrollWidth > innerWidth + 1,
      small: [...document.querySelectorAll('input:not([type=checkbox],[type=radio],[type=range],[type=hidden],[type=file]),select,textarea')]
        .filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.id || e.name),
      title: document.title,
    }))
    const ok = p.status === 200 && !p.errors.length && !r.side && (name === 'desktop' || !r.small.length) && r.title
    check(`${name} ${url}`, ok, { status: p.status, sideScroll: r.side, smallFields: r.small, errors: p.errors })
    await p.close()
  }
  await ctx.close()
}
await done(b)
