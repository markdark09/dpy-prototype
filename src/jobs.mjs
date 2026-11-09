// Job openings: checking what the admin page sends, and drawing the Careers list and a job's own page.
// Used by the build (tools/build.mjs, from src/jobs.json) and by the Worker (worker/careers.js, from the saved list),
// so both draw exactly the same markup. Plain functions only: no Node or Worker APIs here.

export const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
export const LIMITS = { jobs: 40, title: 80, location: 40, summary: 200, about: 1500, item: 240, items: 12 }
export const RESERVED = new Set(['job-template'])
// what every DPY role offers (the Why DPY points on the Careers page), shown when a job lists nothing of its own
export const OFFER = ['Real projects: hotels, hospitals and homes across the country', 'Training, and room to grow as the company grows', 'A team that lives its values: professionalism, respect, integrity, zeal and excellence']

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const slugify = (...parts) => parts.join(' ').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'role'
export const label = j => `${j.title} (${j.location})`
export const openJobs = jobs => jobs.filter(j => j.open)

// ---------- checking a list sent by the admin page ----------
// Returns { jobs } cleaned (trimmed, control characters removed, slugs made unique), or { error, index, field }.
const text = (v, max) => typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max + 1) : ''
const list = v => (Array.isArray(v) ? v : typeof v === 'string' ? v.split('\n') : []).map(x => text(x, LIMITS.item)).filter(Boolean)
export function clean(input, today = new Date().toISOString().slice(0, 10)) {
  if (!Array.isArray(input)) return { error: 'The list of positions is missing.' }
  if (input.length > LIMITS.jobs) return { error: `Up to ${LIMITS.jobs} positions, please.` }
  const out = [], used = new Set()
  for (const [i, raw] of input.entries()) {
    if (!raw || typeof raw !== 'object') return { error: 'A position is empty.', index: i }
    const j = {
      title: text(raw.title, LIMITS.title), location: text(raw.location, LIMITS.location),
      type: TYPES.includes(raw.type) ? raw.type : 'Full-time',
      summary: text(raw.summary, LIMITS.summary), about: text(raw.about, LIMITS.about),
      duties: list(raw.duties), requirements: list(raw.requirements), offer: list(raw.offer),
      open: raw.open !== false,
      posted: /^\d{4}-\d{2}-\d{2}$/.test(raw.posted || '') ? raw.posted : today,
    }
    const tooLong = [['title', 'Job title'], ['location', 'Location'], ['summary', 'Short summary'], ['about', 'About the role']].find(([k]) => j[k].length > LIMITS[k])
    if (tooLong) return { error: `${tooLong[1]} is too long (up to ${LIMITS[tooLong[0]]} characters).`, index: i, field: tooLong[0] }
    if (j.title.length < 2) return { error: 'Every position needs a job title.', index: i, field: 'title' }
    if (j.location.length < 2) return { error: 'Every position needs a location.', index: i, field: 'location' }
    if (j.summary.length < 10) return { error: 'Every position needs a short summary (a sentence).', index: i, field: 'summary' }
    for (const k of ['duties', 'requirements', 'offer']) if (j[k].length > LIMITS.items) return { error: `Up to ${LIMITS.items} lines in each list, please.`, index: i, field: k }
    // keep a position's address once it has one, so links to it keep working after an edit
    let slug = typeof raw.slug === 'string' && /^[a-z0-9-]{2,70}$/.test(raw.slug) && !RESERVED.has(raw.slug) ? raw.slug : slugify(j.title, j.location)
    if (RESERVED.has(slug)) slug += '-role'
    for (let n = 2, base = slug; used.has(slug); n++) slug = `${base}-${n}`
    used.add(slug)
    out.push({ slug, ...j })
  }
  return { jobs: out }
}

// ---------- the Careers page ----------
const PIN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z"/><circle cx="8" cy="6.5" r="1.8"/></svg>'
const ARR = '<svg aria-hidden="true"><use href="#arr"/></svg>'
const CK = '<svg aria-hidden="true"><use href="#ck"/></svg>'
export function listHtml(jobs, R) {
  const open = openJobs(jobs)
  if (!open.length) return `<li class="job none"><div><b>No openings right now</b><p>We're not hiring for a specific role at the moment, but we still read every application.</p></div></li>`
  return open.map(j => `<li class="job" data-r><div><b><a href="${R}careers/${j.slug}">${esc(j.title)}</a></b><p>${esc(j.summary)}</p></div><span class="loc">${PIN}${esc(j.location)}</span><a class="btn sm" href="${R}careers/${j.slug}" aria-label="View the ${esc(label(j))} role">View role ${ARR}</a></li>`).join('')
}
export const optionsHtml = jobs => openJobs(jobs).map(j => `<option data-slug="${j.slug}">${esc(label(j))}</option>`).join('')
export const stats = jobs => { const o = openJobs(jobs); return { open: o.length, cities: new Set(o.map(j => j.location.toLowerCase())).size } }

// ---------- a job's own page (the body of careers/job-template.html, filled in by the Worker) ----------
const date = d => { try { return new Date(d + 'T00:00:00Z').toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) } catch { return d } }
const ul = items => `<ul class="jp-list">${items.map(x => `<li>${CK}<span>${esc(x)}</span></li>`).join('')}</ul>`
export const jobTitle = j => `${j.title}, ${j.location}`
export const jobDesc = j => `${j.title} job in ${j.location} at DPY Mercantile Inc. ${j.summary}`.slice(0, 300)
export function jobBody(j, R) {
  const crumbs = `<ol class="crumbs"><li><a href="${R}">Home</a></li><li><a href="${R}careers">Careers</a></li><li><span aria-current="page">${esc(jobTitle(j))}</span></li></ol>`
  if (!j.open) return `
<section class="phead jp-head">
  <span class="glow warm"></span>
  <div class="wrap">${crumbs}<span class="kick">Position filled</span><h1 class="thin h1">${esc(j.title)}</h1><p class="lede">This ${esc(j.location)} role is no longer open. Thank you for your interest. See our other openings, or send us your CV for the next one.</p>
    <div class="ph-acts"><a class="btn red" href="${R}careers#roles">See open roles ${ARR}</a><a class="btn ghost" href="${R}careers?role=open#apply">Send an open application</a></div></div>
</section>`
  const apply = `${R}careers?role=${j.slug}#apply`
  return `
<section class="phead jp-head">
  <span class="glow warm"></span>
  <div class="wrap">${crumbs}<span class="kick">Open role · ${esc(j.location)}</span><h1 class="thin h1">${esc(j.title)}</h1><p class="lede">${esc(j.summary)}</p>
    <ul class="jp-facts"><li>${PIN}${esc(j.location)}</li><li>${esc(j.type)}</li>${j.posted && !j.sample ? `<li>Posted ${esc(date(j.posted))}</li>` : ''}</ul>
    <div class="ph-acts"><a class="btn red" href="${apply}">Apply for this role ${ARR}</a><a class="btn ghost" href="${R}careers#roles">See all roles</a></div></div>
</section>
<section class="sec" style="--from:#EAF2FA" aria-labelledby="jdT">
  <div class="wrap jp-grid">
    <div class="jp-main">
      ${j.about ? `<h2 class="jp-h" id="jdT">About the role</h2><p class="jp-p">${esc(j.about).replace(/\n+/g, '</p><p class="jp-p">')}</p>` : `<h2 class="jp-h" id="jdT">About the role</h2><p class="jp-p">${esc(j.summary)}</p>`}
      ${j.duties?.length ? `<h2 class="jp-h">What you'll do</h2>${ul(j.duties)}` : ''}
      ${j.requirements?.length ? `<h2 class="jp-h">What we look for</h2>${ul(j.requirements)}` : ''}
      <h2 class="jp-h">What we offer</h2>${ul(j.offer?.length ? j.offer : OFFER)}
      ${j.sample ? `<p class="jp-note">These role details are a sample for this prototype. DPY's HR team will confirm them.</p>` : ''}
    </div>
    <aside class="jp-side"><div class="jp-card">
      <b>${esc(j.title)}</b>
      <dl><dt>Location</dt><dd>${esc(j.location)}</dd><dt>Type</dt><dd>${esc(j.type)}</dd></dl>
      <a class="btn red" href="${apply}">Apply for this role ${ARR}</a>
      <small>Attach your CV (PDF or Word, up to 5 MB) on the next page, or email it to <a href="mailto:careers@dpymi.com.ph">careers@dpymi.com.ph</a>.</small>
    </div></aside>
  </div>
</section>`
}
// structured data, so search engines can list the opening (left out for sample roles, which aren't real postings)
export function jobLd(j, SITE) {
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [['Home', SITE], ['Careers', SITE + 'careers'], [jobTitle(j), SITE + 'careers/' + j.slug]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) }
  const graph = [crumbs]
  if (j.open && !j.sample) graph.push({
    '@type': 'JobPosting', title: j.title, description: [j.summary, j.about, ...(j.duties || []), ...(j.requirements || [])].filter(Boolean).map(x => `<p>${esc(x)}</p>`).join(''),
    datePosted: j.posted, employmentType: { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', Contract: 'CONTRACTOR', Internship: 'INTERN' }[j.type] || 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: 'DPY Mercantile Inc.', sameAs: SITE, logo: SITE + 'assets/brand/dpy-icon.svg' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location, addressCountry: 'PH' } },
  })
  // "<" escaped so text inside the JSON can never close the script tag
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`
}
