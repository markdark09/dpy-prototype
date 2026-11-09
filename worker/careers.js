/* DPY website: job openings.
   /careers           the static Careers page; once HR has saved positions on the admin page, its list, role options
                      and counts (between the <!--jobs:...--> markers) are swapped for the saved ones.
   /careers/<role>    one opening, drawn into careers/job-template.html (built from src/pages/positions.mjs).
   /sitemap.xml       the static sitemap, with the job addresses swapped for the saved openings.
   The positions live in the KV namespace bound as JOBS, under the key "jobs" ({ rev, updated, by, jobs }).
   Without that binding, or before the first save, everything comes from src/jobs.json, as built. */
import SEED from '../src/jobs.json' with { type: 'json' }
import { listHtml, optionsHtml, stats, jobBody, jobLd, jobTitle, jobDesc, esc } from '../src/jobs.mjs'

export const KEY = 'jobs'
export async function loadJobs(env) {
  if (!env.JOBS) return { jobs: SEED, rev: 0, stored: false }
  const saved = await env.JOBS.get(KEY, 'json')
  return saved?.jobs ? { jobs: saved.jobs, rev: saved.rev || 0, stored: true, updated: saved.updated, by: saved.by } : { jobs: SEED, rev: 0, stored: false }
}

const site = url => url.origin + '/'
const swap = (html, name, value) => html.replace(new RegExp(`(<!--jobs:${name}-->)[\\s\\S]*?(<!--/jobs:${name}-->)`), (m, a, b) => a + value + b)
// pages drawn from the saved list are never cached by the browser: the list can change at any time
const html = (body, res, status = 200) => {
  const h = new Headers(res.headers)
  h.set('Content-Type', 'text/html; charset=utf-8'); h.set('Cache-Control', 'no-cache')
  for (const k of ['Content-Length', 'ETag', 'Last-Modified']) h.delete(k)
  return new Response(body, { status, headers: h })
}
// the built file itself, without the browser's "I have this version" headers: a 304 would keep an old list on screen
const fresh = (env, url) => env.ASSETS.fetch(new Request(url, { method: 'GET' }))
async function notFound(env, url) {
  const res = await env.ASSETS.fetch(new URL('/404', url))
  return html(await res.text(), res, 404)
}

export async function careers(request, env) {
  const url = new URL(request.url)
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })

  if (url.pathname === '/careers' || url.pathname === '/careers.html') {
    const { jobs, stored } = await loadJobs(env)
    if (!stored) return env.ASSETS.fetch(request)
    const res = await fresh(env, url.origin + url.pathname)
    if (!res.ok || !(res.headers.get('Content-Type') || '').includes('text/html')) return res
    let page = await res.text()
    const s = stats(jobs)
    page = swap(page, 'list', listHtml(jobs, ''))
    page = swap(page, 'options', optionsHtml(jobs))
    page = swap(page, 'open', String(s.open))
    page = swap(page, 'cities', String(s.cities))
    return html(page, res)
  }

  // /careers/<role>
  // addresses are plain a-z, 0-9 and hyphens, so nothing needs decoding (and a broken %-sequence can't throw)
  const rest = url.pathname.slice('/careers/'.length), slug = rest.replace(/\/+$/, '')
  if (!slug) return Response.redirect(url.origin + '/careers', 301)
  if (!/^[a-z0-9-]{2,70}$/.test(slug)) return notFound(env, url)
  // one address per page: /careers/<role>/ would break the page's relative links
  if (slug !== rest) return Response.redirect(url.origin + '/careers/' + slug + url.search, 301)
  const { jobs } = await loadJobs(env)
  const job = jobs.find(j => j.slug === slug)
  if (!job) return notFound(env, url)
  const tpl = await fresh(env, url.origin + '/careers/job-template')
  if (!tpl.ok) return tpl
  // one pass, so text typed by staff that happens to contain a %%JOB_...%% place is never filled in again
  const fill = { '%%JOB_TITLE%%': esc(jobTitle(job)), '%%JOB_DESC%%': esc(jobDesc(job)), 'careers/job-template': 'careers/' + job.slug, '%%JOB_LD%%': jobLd(job, site(url)), '%%JOB_BODY%%': jobBody(job, '../') }
  const page = (await tpl.text()).replace(/%%JOB_(?:TITLE|DESC|LD|BODY)%%|careers\/job-template/g, m => fill[m])
  return html(page, tpl)
}

export async function sitemap(request, env) {
  const { jobs, stored } = await loadJobs(env)
  if (!stored) return env.ASSETS.fetch(request)
  const url = new URL(request.url), res = await fresh(env, url.origin + url.pathname)
  if (!res.ok) return res
  const xml = await res.text()
  const base = (xml.match(/<loc>(https?:\/\/[^<]*?\/)careers<\/loc>/) || [])[1]
  if (!base) return new Response(xml, { status: res.status, headers: res.headers })
  const lines = xml.split('\n').filter(l => !l.includes(base + 'careers/'))
  const at = lines.findIndex(l => l.includes(`<loc>${base}careers</loc>`)) + 1
  lines.splice(at, 0, ...jobs.filter(j => j.open).map(j => `  <url><loc>${base}careers/${j.slug}</loc></url>`))
  const h = new Headers(res.headers); h.set('Cache-Control', 'no-cache')
  for (const k of ['Content-Length', 'ETag', 'Last-Modified']) h.delete(k)
  return new Response(lines.join('\n'), { status: 200, headers: h })
}
