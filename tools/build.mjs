// node tools/build.mjs : writes the inner pages (about.html, water-heaters.html, products/*.html ...) from src/pages.
// The output is plain static HTML, committed with the site, so Cloudflare still deploys with no build step.
// The homepage (index.html) is hand-written and not touched by this script.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, page } from './lib.mjs'

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
