// node tools/build.mjs : writes the inner pages (about.html, water-heaters.html, products/*.html ...) from src/pages.
// The output is plain static HTML, committed with the site, so Cloudflare still deploys with no build step.
// The homepage (index.html) is hand-written; the script only fills its shared blocks (header, footer, chat) and shared styles.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, page, nav, foot, ver, inlineCss, ASK, BRMAP, BRMAP_CSS } from './lib.mjs'

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
