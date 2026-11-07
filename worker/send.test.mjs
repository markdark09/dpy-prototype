// node --test worker/send.test.mjs : checks the form sender without sending anything (fetch to Resend is stubbed)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { send, renderEmail, esc } from './send.js'

const ORIGIN = 'https://prototype.dpy-mi.workers.dev'
const ok = { kind: 'quote', name: 'Ana Cruz', phone: '0917 123 4567', email: 'ana@example.com', consent: true, fields: [['Building', 'Condo'], ['Anything else?', 'Replacing an old heater']] }
const env = { RESEND_API_KEY: 're_test', QUOTE_TO: 'sales@dpymi.com.ph', SERVICE_TO: 'service@dpymi.com.ph', MAIL_FROM: 'DPY Website <website@dpymi.com.ph>' }
const req = (body, { origin = ORIGIN, method = 'POST' } = {}) => new Request(ORIGIN + '/api/send', {
  method, headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
})
function stubResend(status = 200) {
  const calls = []
  globalThis.fetch = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return new Response('{}', { status }) }
  return calls
}

test('a good quote request is emailed to QUOTE_TO, with the visitor as reply-to', async () => {
  const calls = stubResend()
  const res = await send(req(ok), env)
  assert.equal(res.status, 200)
  assert.equal(calls.length, 1)
  assert.deepEqual(calls[0].body.to, ['sales@dpymi.com.ph'])
  assert.equal(calls[0].body.reply_to, 'ana@example.com')
  assert.match(calls[0].body.subject, /Free quote request: Ana Cruz/)
  assert.match(calls[0].body.text, /Building: Condo/)
})

test('a service request goes to SERVICE_TO, and the browser cannot choose the recipient', async () => {
  const calls = stubResend()
  await send(req({ ...ok, kind: 'service', to: 'attacker@example.com' }), env)
  assert.deepEqual(calls[0].body.to, ['service@dpymi.com.ph'])
})

test('no email given: no reply-to, still sent', async () => {
  const calls = stubResend()
  const res = await send(req({ ...ok, email: '' }), env)
  assert.equal(res.status, 200)
  assert.equal('reply_to' in calls[0].body, false)
})

test('not configured: 503 with fallback, so the page opens the email app instead', async () => {
  const calls = stubResend()
  const res = await send(req(ok), { QUOTE_TO: 'sales@dpymi.com.ph' })
  assert.equal(res.status, 503)
  assert.equal((await res.json()).fallback, true)
  assert.equal(calls.length, 0)
})

test('Resend failing: 502 with fallback', async () => {
  stubResend(500)
  const res = await send(req(ok), env)
  assert.equal(res.status, 502)
  assert.equal((await res.json()).fallback, true)
})

test('honeypot filled: pretends success, sends nothing', async () => {
  const calls = stubResend()
  const res = await send(req({ ...ok, hp_field: 'http://spam' }), env)
  assert.equal(res.status, 200)
  assert.equal(calls.length, 0)
})

test('other sites and scripts are refused', async () => {
  stubResend()
  assert.equal((await send(req(ok, { origin: 'https://evil.example' }), env)).status, 403)
  assert.equal((await send(req(ok, { origin: null }), env)).status, 403)
  assert.equal((await send(req(ok, { method: 'GET' }), env)).status, 405)
})

test('validation names the field to fix', async () => {
  stubResend()
  for (const [patch, field] of [[{ name: ' ' }, 'fullname'], [{ phone: 'call me' }, 'phone'], [{ email: 'nope' }, 'email'], [{ consent: false }, 'consent']]) {
    const res = await send(req({ ...ok, ...patch }), env)
    assert.equal(res.status, 400)
    assert.equal((await res.json()).field, field)
  }
  assert.equal((await send(req({ ...ok, kind: 'other' }), env)).status, 400)
})

test('the rate limit stops a sixth request in ten minutes', async () => {
  stubResend()
  const store = new Map(), kv = { get: async k => store.get(k) ?? null, put: async (k, v) => store.set(k, v) }
  const ipReq = () => { const r = req(ok); return new Request(r, { headers: { ...Object.fromEntries(r.headers), 'CF-Connecting-IP': '1.2.3.4' } }) }
  for (let i = 0; i < 5; i++) assert.equal((await send(ipReq(), { ...env, RATE_LIMIT: kv })).status, 200)
  assert.equal((await send(ipReq(), { ...env, RATE_LIMIT: kv })).status, 429)
})

test('the email escapes what visitors type', () => {
  const html = renderEmail({ kind: { label: 'New quote request', reply: '' }, name: '<script>x</script>', phone: '0917', email: '', fields: [['Note', '<img src=x onerror=alert(1)>']], sentAt: '' })
  assert.doesNotMatch(html, /<script>x|<img src=x/)
  assert.equal(esc(`<a href="x">'`), '&lt;a href=&quot;x&quot;&gt;&#39;')
})

// job applications: email required, a real PDF or Word CV attached
const pdf = Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n%%EOF\n').toString('base64')
const app = { kind: 'careers', name: 'Ben Reyes', phone: '0917 555 0101', email: 'ben@example.com', consent: true, fields: [['Applying for', 'Sales Engineer (Cebu)']], cv: { name: 'Ben Reyes CV.pdf', data: pdf } }
const envC = { ...env, CAREERS_TO: 'careers@dpymi.com.ph' }

test('a job application goes to CAREERS_TO with the CV attached', async () => {
  const calls = stubResend()
  const res = await send(req(app), envC)
  assert.equal(res.status, 200)
  assert.deepEqual(calls[0].body.to, ['careers@dpymi.com.ph'])
  assert.equal(calls[0].body.reply_to, 'ben@example.com')
  assert.deepEqual(calls[0].body.attachments, [{ filename: 'Ben Reyes CV.pdf', content: pdf }])
  assert.match(calls[0].body.text, /CV: Ben Reyes CV\.pdf \(attached\)/)
  assert.match(calls[0].body.subject, /Job application: Ben Reyes/)
})

test('applications need an email and a real CV', async () => {
  stubResend()
  const field = async b => { const r = await send(req(b), envC); return [r.status, (await r.json()).field] }
  assert.deepEqual(await field({ ...app, email: '' }), [400, 'email'])
  assert.deepEqual(await field({ ...app, cv: undefined }), [400, 'cv'])
  assert.deepEqual(await field({ ...app, cv: { name: 'cv.exe', data: pdf } }), [400, 'cv'])
  // named .pdf but not a PDF inside
  assert.deepEqual(await field({ ...app, cv: { name: 'cv.pdf', data: Buffer.from('MZ not a pdf').toString('base64') } }), [400, 'cv'])
  // over 5 MB
  const big = Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(5 * 1024 * 1024 + 10)]).toString('base64')
  assert.deepEqual(await field({ ...app, cv: { name: 'cv.pdf', data: big } }), [400, 'cv'])
  // a Word file passes, and an odd file name is made safe
  const docx = Buffer.concat([Buffer.from([0x50, 0x4B, 0x03, 0x04]), Buffer.from('word')]).toString('base64')
  const calls = stubResend()
  const r = await send(req({ ...app, cv: { name: '../../<script>CV.DOCX', data: docx } }), envC)
  assert.equal(r.status, 200)
  assert.equal(calls[0].body.attachments[0].filename, 'script CV.docx')
})

test('CAREERS_TO not set: 503 with fallback', async () => {
  stubResend()
  const res = await send(req(app), env)
  assert.equal(res.status, 503)
  assert.equal((await res.json()).fallback, true)
})
