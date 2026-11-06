/* DPY website: the form sender, POST /api/send. It emails a quote or service request to DPY's team through
   Resend (https://resend.com), so the API key stays on the server. It lives apart from index.js because every
   named export of a Worker's main file must be a request handler.

   Settings (Cloudflare dashboard > Workers > prototype > Settings > Variables and secrets):
     RESEND_API_KEY  secret. Without it the endpoint answers 503 and the page falls back to the visitor's email app.
     QUOTE_TO        where quote requests go, e.g. sales@dpymi.com.ph
     SERVICE_TO      where service requests go, e.g. service@dpymi.com.ph
     CAREERS_TO      where job applications go (with the CV attached), e.g. careers@dpymi.com.ph
     MAIL_FROM       a sender on a domain verified in Resend, e.g. "DPY Website <website@dpymi.com.ph>".
                     Defaults to Resend's test sender, which only delivers to the Resend account's own address.
   Optional: a KV namespace bound as RATE_LIMIT caps each visitor at 5 requests per 10 minutes.

   The recipient is chosen here from the request kind, never taken from the browser, so this can't be used to mail anyone else. */

const KINDS = {
  quote: { to: 'QUOTE_TO', subject: 'Free quote request', label: 'New quote request', reply: 'Call within one business day to arrange the free site visit.' },
  service: { to: 'SERVICE_TO', subject: 'Service request', label: 'New service request', reply: 'Call within one business day to confirm the visit.' },
  careers: { to: 'CAREERS_TO', subject: 'Job application', label: 'New job application', reply: 'The CV is attached. Reply to the applicant by email or call them.', email: true, cv: true },
}
// a CV: PDF or Word, up to 5 MB, checked by its first bytes as well as its name
const CV_MAX = 5 * 1024 * 1024
const CV_TYPES = { pdf: [0x25, 0x50, 0x44, 0x46], docx: [0x50, 0x4B, 0x03, 0x04], doc: [0xD0, 0xCF, 0x11, 0xE0] }
const DEFAULT_FROM = 'DPY Website <onboarding@resend.dev>'
const FROM_RE = /^(?:[^<>]*<\s*[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+\s*>|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\s-]{7,20}$/
const LIMITS = { name: 100, phone: 20, email: 200, label: 60, value: 3000, fields: 30 }
export const SEND_FAIL = "We couldn't send your request just now."


export async function send(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // same-origin only: a browser always sends Origin on a fetch POST, so a missing one is a script
  const origin = request.headers.get('Origin')
  try { if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: 'Forbidden' }, 403) } catch { return json({ error: 'Forbidden' }, 403) }

  // a CV in base64 is about 7 MB at most; anything much bigger isn't from our form
  if (Number(request.headers.get('Content-Length') || 0) > 8 * 1024 * 1024) return json({ error: 'That file is too large. Please send a CV under 5 MB.', field: 'cv' }, 413)
  let body
  try { body = await request.json() } catch { return json({ error: 'Bad request' }, 400) }

  // honeypot: people never see this field, bots fill it. Pretend it worked so they don't learn.
  if (typeof body?.hp_field === 'string' && body.hp_field.trim()) return json({ ok: true })

  const kind = KINDS[body?.kind]
  if (!kind) return json({ error: 'Bad request' }, 400)
  const name = str(body.name, LIMITS.name), phone = str(body.phone, LIMITS.phone), email = str(body.email, LIMITS.email)
  if (!name) return json({ error: 'Please enter your name.', field: 'fullname' }, 400)
  if (!PHONE_RE.test(phone)) return json({ error: 'Please enter a mobile number we can call.', field: 'phone' }, 400)
  if (kind.email && !email) return json({ error: 'Please enter your email, so we can reply.', field: 'email' }, 400)
  if (email && !EMAIL_RE.test(email)) return json({ error: 'Please check your email address.', field: 'email' }, 400)
  let cv = null
  if (kind.cv) { cv = readCv(body.cv); if (cv.error) return json({ error: cv.error, field: 'cv' }, 400) }
  if (body.consent !== true) return json({ error: 'Please agree to the privacy notice.', field: 'consent' }, 400)
  const fields = (Array.isArray(body.fields) ? body.fields : []).slice(0, LIMITS.fields)
    .filter(f => Array.isArray(f) && f.length === 2)
    .map(([k, v]) => [str(k, LIMITS.label), str(v, LIMITS.value)])
    .filter(([k, v]) => k && v)

  if (await limited(env, request.headers.get('CF-Connecting-IP') || '')) {
    return json({ error: "You've sent a few requests already. Please call us, or try again in a few minutes." }, 429)
  }

  const to = (env[kind.to] || '').trim()
  if (!env.RESEND_API_KEY || !EMAIL_RE.test(to)) return json({ error: 'Not set up yet', fallback: true }, 503)
  const from = (env.MAIL_FROM || '').trim() || DEFAULT_FROM
  if (!FROM_RE.test(from)) { console.error('MAIL_FROM is not "Name <address>"'); return json({ error: SEND_FAIL, fallback: true }, 502) }

  const sentAt = new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' })
  const subject = `${kind.subject}: ${name}`
  const text = [`${kind.label} from the DPY website`, '', `Name: ${name}`, `Mobile: ${phone}`, `Email: ${email || 'not given'}`,
    ...fields.map(([k, v]) => `${k}: ${v}`), ...(cv ? [`CV: ${cv.filename} (attached)`] : []), '', `Sent ${sentAt} (Manila time)`].join('\n')
  const rows = cv ? [...fields, ['CV', `${cv.filename} (attached)`]] : fields

  let res
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], ...(email ? { reply_to: email } : {}), subject, text, html: renderEmail({ kind, name, phone, email, fields: rows, sentAt }), ...(cv ? { attachments: [{ filename: cv.filename, content: cv.content }] } : {}) }),
    })
  } catch (e) {
    console.error('Resend unreachable', String(e)); return json({ error: SEND_FAIL, fallback: true }, 502)
  }
  if (!res.ok) {
    console.error('Resend error', res.status, (await res.text().catch(() => '')).slice(0, 500))
    return json({ error: SEND_FAIL, fallback: true }, 502)
  }
  return json({ ok: true })
}

export const str = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : ''

// { name, data: base64 } from the browser -> { filename, content } for Resend, or { error }
export function readCv(cv) {
  if (!cv || typeof cv.data !== 'string' || !cv.data) return { error: 'Please attach your CV (PDF or Word).' }
  const ext = (String(cv.name || '').toLowerCase().match(/\.(pdf|docx?)$/) || [])[1]
  if (!ext) return { error: 'Please attach your CV as a PDF or Word file.' }
  const data = cv.data.replace(/^data:[^,]*,/, '').replace(/\s/g, '')
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return { error: 'We couldn\'t read that file. Please try another copy of your CV.' }
  if (Math.floor(data.length * 3 / 4) > CV_MAX) return { error: 'That file is too large. Please send a CV under 5 MB.' }
  let head
  try { head = [...atob(data.slice(0, 12))].map(c => c.charCodeAt(0)) } catch { return { error: 'We couldn\'t read that file. Please try another copy of your CV.' } }
  if (!CV_TYPES[ext].every((b, i) => head[i] === b)) return { error: 'That file doesn\'t look like a PDF or Word document. Please check it and try again.' }
  // a safe name: letters, numbers, spaces, dots, dashes; always ending in its real type
  const base = String(cv.name).replace(/\.(pdf|docx?)$/i, '').replace(/[^\w .-]+/g, ' ').replace(/\.{2,}/g, ' ').replace(/\s+/g, ' ').replace(/^[\s.-]+/, '').trim().slice(0, 80) || 'CV'
  return { filename: `${base}.${ext}`, content: data }
}

async function limited(env, ip) {
  const kv = env.RATE_LIMIT
  if (!kv || !ip) return false
  try {
    const key = 'rl:' + ip, n = parseInt(await kv.get(key) || '0', 10) || 0
    if (n >= 5) return true
    await kv.put(key, String(n + 1), { expirationTtl: 600 })
  } catch { /* never block a customer because the counter failed */ }
  return false
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// The email DPY's team receives: table layout and inline styles, because that is what email apps understand.
// Phone first, as a tap-to-call link: the promise on the site is a call back.
const SANS = "'Manrope','Segoe UI',Helvetica,Arial,sans-serif"
const C = { page: '#F2F6FB', card: '#FFFFFF', ink: '#0E1B2C', gray: '#4A5568', mute: '#8794A6', line: '#E6ECF3', navy: '#013C80', red: '#C70A0E', soft: '#F5F8FC' }
export function renderEmail({ kind, name, phone, email, fields, sentAt }) {
  const tel = phone.replace(/[^0-9+]/g, '')
  const row = (k, v) => `<tr><td style="padding:11px 0;border-top:1px solid ${C.line};font:600 13px ${SANS};color:${C.mute};width:150px;vertical-align:top">${esc(k)}</td><td style="padding:11px 0;border-top:1px solid ${C.line};font:15px/1.55 ${SANS};color:${C.ink};word-break:break-word">${esc(v).replace(/\r?\n/g, '<br>')}</td></tr>`
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden">${esc(kind.label)} from ${esc(name)}, ${esc(phone)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.card};border:1px solid ${C.line};border-radius:20px;overflow:hidden">
<tr><td style="height:6px;background:${C.navy};background-image:linear-gradient(90deg,${C.navy},#0D68C3 60%,${C.red})"></td></tr>
<tr><td style="padding:26px 30px 6px"><span style="display:inline-block;background:${C.red};color:#fff;font:700 12px ${SANS};padding:5px 12px;border-radius:999px">${esc(kind.label)}</span></td></tr>
<tr><td style="padding:10px 30px 4px"><h1 style="margin:0;font:700 24px/1.25 ${SANS};color:${C.ink}">${esc(name)}</h1><p style="margin:6px 0 0;font:13px ${SANS};color:${C.mute}">From the DPY website, ${esc(sentAt)}</p></td></tr>
<tr><td style="padding:18px 30px 6px"><a href="tel:${esc(tel)}" style="display:inline-block;background:${C.ink};color:#fff;font:700 15px ${SANS};text-decoration:none;padding:13px 22px;border-radius:999px">Call ${esc(phone)}</a>${email ? `<a href="mailto:${esc(email)}" style="display:inline-block;margin-left:8px;color:${C.navy};font:600 14px ${SANS};text-decoration:none;padding:13px 8px">Reply by email</a>` : ''}</td></tr>
<tr><td style="padding:14px 30px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Mobile', phone)}${row('Email', email || 'Not given')}${fields.map(([k, v]) => row(k, v)).join('')}</table></td></tr>
<tr><td style="padding:12px 30px 28px;font:13px/1.6 ${SANS};color:${C.gray}">${esc(kind.reply)}</td></tr>
</table>
<p style="margin:14px 0 0;font:12px ${SANS};color:${C.mute}">DPY Mercantile Inc. &amp; Gratek Smart Water Corp.</p>
</td></tr></table></body></html>`
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
