/* DPY website: the private admin page, where DPY's staff add, edit, close and remove job openings.
   /admin                  the page (admin/index.html), for signed-in staff only
   GET  /api/admin/jobs    every position, open and closed, with the list's revision number
   PUT  /api/admin/jobs    { rev, jobs }: saves the whole list, if nobody else saved since that revision

   Who can get in is decided by Cloudflare Access (Zero Trust > Access > Applications), which asks for a work email
   and a one-time code before /admin or /api/admin is reached. This Worker checks Access's signed token as well, so
   the admin stays shut even if the Access application is missing or misconfigured. Settings (Variables and secrets):
     ACCESS_TEAM_DOMAIN  the Zero Trust team domain, e.g. dpymi.cloudflareaccess.com
     ACCESS_AUD          the Access application's "Application Audience (AUD) Tag"
   Without both, the admin answers "not set up yet". Saving also needs the JOBS KV binding (see wrangler.jsonc).
   For local testing only: ADMIN_DEV=1 in .dev.vars opens the admin without Access, and only on localhost. */
import { clean } from '../src/jobs.mjs'
import { KEY, loadJobs } from './careers.js'

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })
const PRIVATE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'same-origin' }

// ---------- who is asking ----------
const b64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0))
const certs = new Map() // team domain -> { at, keys }
async function accessKeys(team, refresh) {
  const hit = certs.get(team)
  if (hit && !refresh && Date.now() - hit.at < 3600e3) return hit.keys
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`)
  if (!res.ok) throw new Error('certs ' + res.status)
  const keys = (await res.json()).keys || []
  certs.set(team, { at: Date.now(), keys })
  return keys
}
function cookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? m[1] : ''
}
// { email } for a signed-in member of staff, { setup: true } when Access isn't configured, or null
export async function staff(request, env) {
  const url = new URL(request.url)
  if (env.ADMIN_DEV === '1' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return { email: 'dev@localhost' }
  const team = (env.ACCESS_TEAM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''), aud = env.ACCESS_AUD
  if (!team || !aud) return { setup: true }
  const token = request.headers.get('Cf-Access-Jwt-Assertion') || cookie(request, 'CF_Authorization')
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const head = JSON.parse(new TextDecoder().decode(b64url(parts[0]))), body = JSON.parse(new TextDecoder().decode(b64url(parts[1])))
    if (head.alg !== 'RS256') return null
    let jwk = (await accessKeys(team)).find(k => k.kid === head.kid)
    if (!jwk) jwk = (await accessKeys(team, true)).find(k => k.kid === head.kid) // keys rotate
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]))
    const now = Date.now() / 1000
    if (!ok || body.iss !== `https://${team}` || ![].concat(body.aud).includes(aud) || !(body.exp > now) || (body.nbf && body.nbf > now + 60)) return null
    return body.email ? { email: String(body.email) } : null
  } catch { return null }
}

// ---------- the page ----------
const SETUP = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Admin not set up yet</title><body style="font:16px/1.6 system-ui,sans-serif;max-width:560px;margin:12vh auto;padding:0 20px;color:#0E1116">
<h1 style="font-size:24px">The admin page isn't switched on yet</h1>
<p>It opens once Cloudflare Access protects <code>/admin</code> and the Worker has its <code>ACCESS_TEAM_DOMAIN</code> and <code>ACCESS_AUD</code> settings. The steps are in the README, under "Careers admin".</p>
<p><a href="/careers">Back to the Careers page</a></p></body></html>`

export async function adminPage(request, env) {
  const who = await staff(request, env)
  if (who?.setup) return new Response(SETUP, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', ...PRIVATE } })
  if (!who) return new Response('Please sign in through Cloudflare Access to use the admin page.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...PRIVATE } })
  const url = new URL(request.url)
  if (url.pathname !== '/admin') return Response.redirect(url.origin + '/admin', 302)
  const res = await env.ASSETS.fetch(new URL('/admin/', url))
  const h = new Headers(res.headers)
  for (const [k, v] of Object.entries(PRIVATE)) h.set(k, v)
  h.set('X-Frame-Options', 'DENY')
  return new Response(res.body, { status: res.status, headers: h })
}

// ---------- the API ----------
export async function adminApi(request, env) {
  const who = await staff(request, env)
  if (who?.setup) return json({ error: 'The admin page is not set up yet.' }, 503)
  if (!who) return json({ error: 'Please sign in again.' }, 401)

  if (request.method === 'GET') {
    const { jobs, rev, stored, updated, by } = await loadJobs(env)
    return json({ jobs, rev, stored, updated: updated || null, by: by || null, canSave: !!env.JOBS, email: who.email })
  }
  if (request.method !== 'PUT') return json({ error: 'Method not allowed' }, 405)

  // same-origin JSON only, so another site can't make a signed-in browser save something
  const origin = request.headers.get('Origin')
  try { if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: 'Forbidden' }, 403) } catch { return json({ error: 'Forbidden' }, 403) }
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return json({ error: 'Send JSON.' }, 415)
  if (Number(request.headers.get('Content-Length') || 0) > 256 * 1024) return json({ error: 'That is too much text for one save.' }, 413)
  if (!env.JOBS) return json({ error: 'Saving is not switched on yet: the JOBS storage is not connected.' }, 503)

  let body
  try { body = await request.json() } catch { return json({ error: 'That did not arrive in one piece. Please try again.' }, 400) }
  const checked = clean(body?.jobs)
  if (checked.error) return json(checked, 422)

  const cur = await loadJobs(env)
  if (Number(body.rev) !== cur.rev) return json({ error: 'Someone else saved changes while you were editing. The latest list is loaded: please make your change again.', conflict: true, jobs: cur.jobs, rev: cur.rev }, 409)

  const next = { rev: cur.rev + 1, updated: new Date().toISOString(), by: who.email, jobs: checked.jobs }
  // the list before this save is kept for 60 days, in case something needs to be put back
  if (cur.stored) await env.JOBS.put(`history:${cur.rev}`, JSON.stringify({ rev: cur.rev, updated: cur.updated, by: cur.by, jobs: cur.jobs }), { expirationTtl: 60 * 86400 })
  await env.JOBS.put(KEY, JSON.stringify(next))
  return json({ jobs: next.jobs, rev: next.rev, updated: next.updated, by: next.by })
}
