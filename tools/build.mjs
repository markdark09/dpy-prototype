// node tools/build.mjs : writes the inner pages (about.html, water-heaters.html, products/*.html ...) from src/pages.
// The output is plain static HTML, committed with the site, so Cloudflare still deploys with no build step.
// The homepage (index.html) is hand-written; the script only fills its shared blocks (header, footer, chat) and shared styles.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, SITE, page, nav, foot, ver, inlineCss, ASK, BRMAP, BRMAP_CSS } from './lib.mjs'

const dir = path.join(ROOT, 'src/pages'), out = []
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(path.join(dir, f)).href)
  const pages = typeof mod.default === 'function' ? await mod.default() : mod.default
  for (const pg of [].concat(pages)) {
    const file = path.join(ROOT, pg.path + '.html'); fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, page(pg)); out.push(pg.path)
  }
}
console.log(`built ${out.length} pages: ${out.join(', ')}`)

// the homepage is hand-written, but its header, menu and footer are the shared ones, and its shared files get their versions
const H = path.join(ROOT, 'index.html')
let home = fs.readFileSync(H, 'utf8')
const fill = (name, html) => { const re = new RegExp(`(<!-- @${name}:[^>]*-->\\n)[\\s\\S]*?(<!-- /@${name} -->)`); if (!re.test(home)) throw new Error('index.html: missing @' + name); home = home.replace(re, (m, a, b) => a + html + '\n' + b) }
fill('nav', nav({ home: true, nav: 'home' }, ''))
fill('branchmap', BRMAP.split('\n').map(l => '      ' + l).join('\n'))
fill('footer', foot('', { noCta: true }))
fill('ask', ASK)
// base.css written in, like the other pages (the homepage's own styles follow it)
home = home.replace(/<link rel="stylesheet" href="assets\/css\/base\.css\?v=\w+">[^\n]*\n|<style id="base-css">[\s\S]*?<\/style>\n/, () => `<style id="base-css">\n${inlineCss('', ['assets/css/base.css'])}\n</style>\n`)
// the branch map's styles, shared with the Contact page
home = home.replace(/(<style id="base-css">[\s\S]*?<\/style>\n)(?:<style id="br-css">[\s\S]*?<\/style>\n)?/, (m, a) => a + `<style id="br-css">\n${BRMAP_CSS}\n</style>\n`)
for (const f of ['assets/js/site.js', 'assets/js/ask.js', 'assets/js/branches.js']) home = home.replace(new RegExp(`${f.replace(/\./g, '\\.')}\\?v=\\w+`), `${f}?v=${ver(f)}`)
fs.writeFileSync(H, home)
console.log('homepage: header, footer and versions updated')

// _redirects: every address the WordPress site at dpymi.com.ph had (its two sitemaps and its menu) goes
// to the page that replaces it, with a 301, so search rankings and old links on Facebook and Lazada carry over.
// Product addresses come from each product's `from` in src/products.mjs; the rest are listed here.
const { PRODUCTS } = await import(pathToFileURL(path.join(ROOT, 'src/products.mjs')).href)
const PAGES = [
  ['/dpy-mercantile/', '/about'],
  ['/gratek-smart-water-corp/', '/about#gratek'],
  ['/awards/', '/about#awards'],
  ['/branches/', '/contact#branches'],
  ['/contact-us/', '/contact'],
  ['/contact-us/contact-us-2/', '/contact#branches'],
  ['/contact-us/services-and-preventive-maintenance/', '/service'],
  ['/thank-you/', '/contact'],
  ['/careers/', '/careers'],
  ['/products/', '/water-heaters'],
  ['/products/instantaneous-water-heater/', '/water-heaters?type=instant'],
  ['/products/electric-storage-water-heater/', '/water-heaters?type=storage'],
  ['/products/heat-pumps/', '/water-heaters?type=heatpump'],
  ['/products/air-to-water-heat-pump-with-built-in-circulating-pump/', '/water-heaters?type=heatpump'],
  ['/products/air-to-water-heat-pump/', '/products/deron-air-to-water-heat-pump'],
  ['/products/chilled-ground-water-to-water-heat-pump/', '/products/deron-water-to-water-heat-pump'],
  ['/products/air-to-water-swimming-pool-heat-pump/', '/products/deron-swimming-pool-heat-pump'],
  ['/products/air-to-water-all-in-one-heat-pump/', '/products/5-star-integral-heat-pump'],
  ['/products/integral-heat-pump/', '/products/5-star-integral-heat-pump'],
  ['/products/solar-water-heater/', '/water-heaters?type=solar'],
  ['/products/storage-tank/', '/water-heaters?type=tank'],
  ['/products/energy-storage-heat-exchanger-tank/', '/water-heaters?type=tank'],
  ['/products/ppr-pipes-and-fittings/', '/water-heaters?type=pipe'],
  ['/products/ac-thor/', '/water-heaters?type=control'],
  ['/products/exhaust-fan/', '/water-heaters?type=fan'],
]
const prod = new Map()
for (const p of PRODUCTS) {
  if (!p.from) continue
  const from = '/' + p.from.replace(/^\/|\/$/g, '') + '/'
  // two products can share an old page (the Rotex page showed the Enermax tank): the one named in the address wins
  if (!prod.has(from) || from.includes(p.slug.split('-')[0])) prod.set(from, '/products/' + p.slug)
}
const rules = [...PAGES, ...prod]
// each address with and without its closing slash; an encoded character in both letter cases
const lines = new Set()
for (const [from, to] of rules) {
  for (const f of new Set([from, from.toUpperCase() === from ? from : from.replace(/%[0-9a-f]{2}/gi, m => m.toUpperCase()), from.replace(/%[0-9a-f]{2}/gi, m => m.toLowerCase())])) {
    for (const g of [f, f.replace(/\/$/, '')]) if (g !== to) lines.add(`${g} ${to} 301`) // never a rule that points at itself
  }
}
fs.writeFileSync(path.join(ROOT, '_redirects'), [
  '# Generated by tools/build.mjs: edit PAGES there or `from` in src/products.mjs, not this file.',
  '# Old dpymi.com.ph (WordPress) addresses -> the new pages, permanently.',
  ...lines,
  '# Old product addresses not listed above, and WordPress system paths',
  '/wp-login.php / 301',
  '/feed / 301',
  '/sitemap_index.xml /sitemap.xml 301',
  '/page-sitemap.xml /sitemap.xml 301',
  '/product-sitemap.xml /sitemap.xml 301',
  '/product/* /water-heaters 301',
  '/wp-admin/* / 301',
  '/feed/* / 301',
  '',
].join('\n'))
console.log(`_redirects: ${lines.size} rules from ${rules.length} old addresses`)

// sitemap.xml: every page, at the SITE address (lib.mjs). robots.txt only points to it once the site goes live.
const urls = ['', ...out.filter(p => p !== 'privacy').sort()].map(p => SITE + p)
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n')
console.log(`sitemap.xml: ${urls.length} pages`)
