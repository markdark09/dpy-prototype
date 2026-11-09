// No browser needed: every old WordPress address in _redirects answers 301 to a page that exists,
// the files that make up the repo (not the site) are never served, and the form sender refuses bad requests.
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, BASE, check, done } from './lib.mjs'

const get = (url, init = {}) => fetch(BASE + url, { redirect: 'manual', ...init })

// redirects: static rules only (the three wildcard rules are checked with a sample address)
const rules = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => l.split(/\s+/))
const seen = new Map()
for (const [from, to, code] of rules) {
  const probe = from.replace(/\*$/, 'sample-old-page/')
  const r = await get(probe)
  const loc = r.headers.get('location') || ''
  const target = new URL(loc, BASE)
  if (!seen.has(target.pathname)) seen.set(target.pathname, (await get(target.pathname)).status)
  check(`redirect ${probe}`, String(r.status) === (code || '301') && target.pathname === new URL(to, BASE).pathname && seen.get(target.pathname) === 200,
    { status: r.status, location: loc, targetStatus: seen.get(target.pathname) })
}

// private files: the config, sources, tests, dependencies and any local secrets file
for (const url of ['/README.md', '/wrangler.jsonc', '/package.json', '/package-lock.json', '/worker/send.js', '/worker/index.js',
  '/src/products.mjs', '/tools/build.mjs', '/tools/test/lib.mjs', '/node_modules/wrangler/package.json', '/.gitignore', '/.assetsignore',
  '/.dev.vars', '/.env', '/.git/HEAD']) {
  const r = await get(url)
  check(`not served: ${url}`, r.status === 404, r.status)
}

// unknown address: the branded 404 page with a real 404 status
{
  const r = await get('/no-such-page-here')
  check('unknown address gives the 404 page', r.status === 404 && /DPY/.test(await r.text()), r.status)
}

// the form sender: only POST from the same site, and nothing sends without its settings
{
  const r1 = await get('/api/send')
  check('form sender refuses GET', r1.status === 405 || r1.status === 404, r1.status)
  const r2 = await get('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: '{}' })
  check('form sender refuses another site', r2.status === 403, r2.status)
}
await done()
