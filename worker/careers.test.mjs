// node --test worker/ : job pages, the admin sign-in check and saving, with fake storage and files (nothing leaves the machine)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'
import { staff } from './admin.js'
import { clean } from '../src/jobs.mjs'

const HOST = 'https://prototype.dpy-mi.workers.dev'
const TEAM = 'dpy.cloudflareaccess.com', AUD = 'aud-tag-123'

// fake static files: the Careers page with its markers, the job template, the 404 page, the sitemap, the admin page
const FILES = {
  '/careers': '<ul><!--jobs:list-->OLD<!--/jobs:list--></ul><select><!--jobs:options-->OLD<!--/jobs:options--></select><b><!--jobs:open-->6<!--/jobs:open--></b><b><!--jobs:cities-->2<!--/jobs:cities--></b>',
  '/careers/job-template': '<title>%%JOB_TITLE%% | Careers</title><meta content="%%JOB_DESC%%"><meta property="og:url" content="https://x/careers/job-template">%%JOB_LD%%<main>%%JOB_BODY%%</main>',
  '/404': '<h1>Not found</h1>',
  '/sitemap.xml': `<urlset>\n  <url><loc>${HOST}/careers</loc></url>\n  <url><loc>${HOST}/careers/old-role</loc></url>\n  <url><loc>${HOST}/contact</loc></url>\n</urlset>`,
  '/admin/': '<h1>Admin</h1>',
}
const ASSETS = { fetch: async req => { const p = new URL(req.url ?? req).pathname; return FILES[p] !== undefined ? new Response(FILES[p], { headers: { 'Content-Type': p.endsWith('.xml') ? 'application/xml' : 'text/html' } }) : new Response('nf', { status: 404 }) } }
const kv = (init = {}) => { const m = new Map(Object.entries(init)); return { m, get: async (k, t) => m.has(k) ? (t === 'json' ? JSON.parse(m.get(k)) : m.get(k)) : null, put: async (k, v) => { m.set(k, v) } } }
const job = (o = {}) => ({ slug: 'service-technician-davao', title: 'Service Technician', location: 'Davao', type: 'Full-time', summary: 'Install and service heaters in Davao.', about: '', duties: ['Install heaters'], requirements: [], offer: [], open: true, posted: '2026-11-09', ...o })
const get = (path, env, headers = {}) => worker.fetch(new Request(HOST + path, { headers }), env)

// ---------- public pages ----------
test('without saved positions, the built Careers page is served as it is', async () => {
  const res = await get('/careers', { ASSETS, JOBS: kv() })
  assert.equal(await res.text(), FILES['/careers'])
})
test('with saved positions, the Careers list, options and counts are swapped', async () => {
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job(), job({ slug: 'closed-one', title: 'Closed', open: false })] }) })
  const t = await (await get('/careers', { ASSETS, JOBS })).text()
  assert.match(t, /careers\/service-technician-davao/)
  assert.doesNotMatch(t, /OLD|closed-one/)
  assert.match(t, /<!--jobs:open-->1<!--\/jobs:open-->/)
  assert.match(t, /data-slug="service-technician-davao">Service Technician \(Davao\)/)
})
test('a job page fills the template; HTML typed by staff stays text', async () => {
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job({ title: 'Tech <script>alert(1)</script>' })] }) })
  const res = await get('/careers/service-technician-davao', { ASSETS, JOBS })
  const t = await res.text()
  assert.equal(res.status, 200)
  assert.match(t, /<title>Tech &lt;script&gt;alert\(1\)&lt;\/script&gt;, Davao \| Careers<\/title>/)
  assert.doesNotMatch(t, /<script>alert/)
  assert.match(t, /og:url" content="https:\/\/x\/careers\/service-technician-davao"/)
  assert.doesNotMatch(t, /%%JOB_/)
  // the structured data can't be broken out of either
  assert.match(t, /"JobPosting"/); assert.doesNotMatch(t.split('application/ld+json')[1].split('</script>')[0], /</)
})
test('unknown roles and the template address answer 404; /careers/ goes to /careers', async () => {
  for (const p of ['/careers/nope', '/careers/job-template', '/careers/..%2Fadmin']) assert.equal((await get(p, { ASSETS, JOBS: kv() })).status, 404, p)
  const r = await get('/careers/', { ASSETS, JOBS: kv() })
  assert.equal(r.status, 301); assert.equal(r.headers.get('Location'), HOST + '/careers')
})
test('the sitemap lists the saved open roles in place of the built ones', async () => {
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job()] }) })
  const t = await (await get('/sitemap.xml', { ASSETS, JOBS })).text()
  assert.match(t, /careers\/service-technician-davao/); assert.doesNotMatch(t, /old-role/); assert.match(t, /\/contact</)
})

// ---------- signing in ----------
const enc = o => Buffer.from(JSON.stringify(o)).toString('base64url')
async function keys() {
  const k = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
  const jwk = { ...(await crypto.subtle.exportKey('jwk', k.publicKey)), kid: 'k1', alg: 'RS256' }
  const sign = async (body, head = { alg: 'RS256', kid: 'k1' }) => { const d = enc(head) + '.' + enc(body); return d + '.' + Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', k.privateKey, new TextEncoder().encode(d))).toString('base64url') }
  return { jwk, sign }
}
const { jwk, sign } = await keys()
const realFetch = globalThis.fetch
globalThis.fetch = async url => String(url) === `https://${TEAM}/cdn-cgi/access/certs` ? new Response(JSON.stringify({ keys: [jwk] })) : realFetch(url)
const now = () => Math.floor(Date.now() / 1000)
const good = () => ({ iss: `https://${TEAM}`, aud: [AUD], email: 'hr@dpymi.com.ph', exp: now() + 600, iat: now() })
const envA = (o = {}) => ({ ASSETS, JOBS: kv(), ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD, ...o })
const req = (path, token, init = {}) => new Request(HOST + path, { ...init, headers: { ...(token ? { 'Cf-Access-Jwt-Assertion': token } : {}), ...(init.headers || {}) } })

test('without Access settings the admin is shut ("not set up"), not open', async () => {
  assert.deepEqual(await staff(req('/admin'), { ADMIN_DEV: '0' }), { setup: true })
  assert.equal((await worker.fetch(req('/admin'), { ASSETS })).status, 503)
  assert.equal((await worker.fetch(req('/api/admin/jobs'), { ASSETS })).status, 503)
})
test('the local-testing switch works only on localhost', async () => {
  assert.equal((await worker.fetch(req('/api/admin/jobs'), { ASSETS, ADMIN_DEV: '1' })).status, 503)
  assert.deepEqual(await staff(new Request('http://localhost:8787/admin'), { ADMIN_DEV: '1' }), { email: 'dev@localhost' })
})
test('a valid Access token lets staff in; a missing, forged, expired or wrong-audience one does not', async () => {
  assert.deepEqual(await staff(req('/admin', await sign(good())), envA()), { email: 'hr@dpymi.com.ph' })
  assert.equal(await staff(req('/admin'), envA()), null)
  assert.equal(await staff(req('/admin', await sign({ ...good(), exp: now() - 5 })), envA()), null)
  assert.equal(await staff(req('/admin', await sign({ ...good(), aud: ['other'] })), envA()), null)
  assert.equal(await staff(req('/admin', await sign({ ...good(), iss: 'https://evil.cloudflareaccess.com' })), envA()), null)
  const t = await sign(good()), [h, , s] = t.split('.')
  assert.equal(await staff(req('/admin', `${h}.${enc({ ...good(), email: 'boss@evil.com' })}.${s}`), envA()), null) // body changed after signing
  assert.equal(await staff(req('/admin', await sign(good(), { alg: 'none', kid: 'k1' })), envA()), null)
  assert.equal((await worker.fetch(req('/admin', await sign(good())), envA())).status, 200)
  assert.equal((await worker.fetch(req('/admin'), envA())).status, 403)
})

// ---------- saving ----------
const put = async (env, body, { origin = HOST, token } = {}) => worker.fetch(req('/api/admin/jobs', token ?? await sign(good()), { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(body) }), env)
test('a save stores the list with the next revision and who saved it, and keeps the previous one', async () => {
  const env = envA({ JOBS: kv({ jobs: JSON.stringify({ rev: 3, jobs: [job()] }) }) })
  const res = await put(env, { rev: 3, jobs: [job({ title: 'Senior Service Technician' })] })
  assert.equal(res.status, 200)
  const saved = JSON.parse(env.JOBS.m.get('jobs'))
  assert.equal(saved.rev, 4); assert.equal(saved.by, 'hr@dpymi.com.ph'); assert.equal(saved.jobs[0].slug, 'service-technician-davao')
  assert.ok(env.JOBS.m.has('history:3'))
})
test('a save from an old revision, another site, or without JSON is refused', async () => {
  const env = envA({ JOBS: kv({ jobs: JSON.stringify({ rev: 3, jobs: [job()] }) }) })
  const old = await put(env, { rev: 2, jobs: [job()] })
  assert.equal(old.status, 409); assert.equal((await old.json()).rev, 3)
  assert.equal((await put(env, { rev: 3, jobs: [job()] }, { origin: 'https://evil.example' })).status, 403)
  assert.equal((await put(env, { rev: 3, jobs: [job()] }, { origin: null })).status, 403)
  assert.equal((await put(envA({ JOBS: undefined }), { rev: 0, jobs: [job()] })).status, 503)
  assert.equal(JSON.parse(env.JOBS.m.get('jobs')).rev, 3)
})
test('checking a list: required fields, limits, unique addresses, no reserved address', () => {
  assert.equal(clean([{ title: 'X', location: 'Cebu', summary: 'A sentence long enough.' }]).field, 'title')
  assert.equal(clean([{ title: 'Tech', location: 'Cebu', summary: 'short' }]).field, 'summary')
  assert.equal(clean([{ title: 'T'.repeat(81), location: 'Cebu', summary: 'A sentence long enough.' }]).field, 'title')
  const r = clean([{ title: 'Tech', location: 'Cebu', summary: 'A sentence long enough.' }, { title: 'Tech', location: 'Cebu', summary: 'A sentence long enough.' }, { slug: 'job-template', title: 'Job', location: 'Template', summary: 'A sentence long enough.' }])
  assert.deepEqual(r.jobs.map(j => j.slug), ['tech-cebu', 'tech-cebu-2', 'job-template-role'])
  assert.equal(clean('nope').error, 'The list of positions is missing.')
})

// ---------- found in review (2026-11-09) ----------
test('a returning visitor with a cached copy still gets the saved list (no 304 of the old page)', async () => {
  const seen = []
  const A = { fetch: async r => { const req = r instanceof Request ? r : new Request(r); seen.push(req.headers.get('If-None-Match')); return ASSETS.fetch(req) } }
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job()] }) })
  const res = await get('/careers', { ASSETS: A, JOBS }, { 'If-None-Match': '"old"' })
  assert.equal(res.status, 200); assert.equal(seen.at(-1), null); assert.equal(res.headers.get('Cache-Control'), 'no-cache')
  assert.match(await res.text(), /service-technician-davao/)
})
test('a new position never takes an older position\'s address, even when listed first', () => {
  const r = clean([{ title: 'Sales Engineer', location: 'Manila', summary: 'A sentence long enough.' }, { slug: 'sales-engineer-manila', title: 'Sales Engineer', location: 'Manila', summary: 'The old one, closed.', open: false }])
  assert.deepEqual(r.jobs.map(j => j.slug), ['sales-engineer-manila-2', 'sales-engineer-manila'])
})
test('a list line over the limit is refused, not cut', () => {
  const r = clean([{ title: 'Tech', location: 'Cebu', summary: 'A sentence long enough.', duties: ['x'.repeat(241)] }])
  assert.equal(r.field, 'duties')
})
test('staff text containing a template place is shown as text, not filled in', async () => {
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job({ title: 'Tech %%JOB_BODY%%', summary: 'See %%JOB_LD%% here please.' })] }) })
  const t = await (await get('/careers/service-technician-davao', { ASSETS, JOBS })).text()
  assert.match(t, /<title>Tech %%JOB_BODY%%, Davao \| Careers<\/title>/)
  assert.equal((t.match(/<main>/g) || []).length, 1)
})
test('odd role addresses: a broken %-sequence is a 404, a trailing slash redirects', async () => {
  const JOBS = kv({ jobs: JSON.stringify({ rev: 1, jobs: [job()] }) })
  assert.equal((await get('/careers/%E0', { ASSETS, JOBS })).status, 404)
  const r = await get('/careers/service-technician-davao/', { ASSETS, JOBS })
  assert.equal(r.status, 301); assert.equal(r.headers.get('Location'), HOST + '/careers/service-technician-davao')
})
