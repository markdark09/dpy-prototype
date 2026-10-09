// node tools/build.mjs : writes the inner pages (about.html, water-heaters.html, products/*.html ...) from src/pages.
// The output is plain static HTML, committed with the site, so Cloudflare still deploys with no build step.
// The homepage (index.html) is hand-written and not touched by this script.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, page, nav, foot, ver } from './lib.mjs'

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
fill('nav', nav({ home: true, nav: '' }, ''))
fill('footer', foot('', { noCta: true }))
for (const f of ['assets/css/base.css', 'assets/js/site.js', 'assets/js/ask.js']) home = home.replace(new RegExp(`${f.replace(/\./g, '\\.')}\\?v=\\w+`), `${f}?v=${ver(f)}`)
fs.writeFileSync(H, home)
console.log('homepage: header, footer and versions updated')
