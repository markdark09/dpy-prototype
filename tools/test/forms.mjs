// The homepage quote, Contact quote and Service booking forms.
// Phone: the send button pins to the bottom while the form is on screen and the chat button steps aside,
// both outcomes of sending (server sent it, or not set up so the email app opens), the earliest service day.
// Desktop: the send row is the normal one (note left, button right, nothing pinned).
import { chromium, BASE, PHONE, DESKTOP, open, check, done, scrollTo, shot } from './lib.mjs'

const b = await chromium.launch()
const FORMS = [['/', 'q'], ['/contact', 'q'], ['/service', 's']]
const SUB = 'form .f-sub .btn, form .qt-sub .btn'
const state = p => p.evaluate(sel => {
  const r = document.querySelector(sel).getBoundingClientRect(), a = getComputedStyle(document.querySelector('.ask'))
  return { gap: Math.round(innerHeight - r.bottom), w: Math.round(r.width), formOn: document.body.classList.contains('form-on'), chat: a.visibility !== 'hidden' && a.opacity !== '0' }
}, SUB)

// mid form: the name field (near the top of every form) centred, so the form runs on below the screen and the send button has to pin.
// scrollIntoView, not scrollTo: the homepage's smooth scrolling (Lenis) follows it reliably
const midForm = async (p, f) => { await scrollTo(p, `#${f}N`); await p.waitForTimeout(300) }
const phone = await b.newContext(PHONE)
for (const [url, f] of FORMS) {
  const p = await open(phone, url, { wait: 500 })
  let s = await state(p)
  check(`${url} phone, top of page: chat shown`, s.chat && !s.formOn, s)
  await midForm(p, f); s = await state(p)
  check(`${url} phone, mid form: send button pinned, chat hidden`, s.gap >= 10 && s.gap <= 16 && s.w > 300 && !s.chat, s)
  await shot(p, `form-pinned${url.replace(/\W/g, '-') || '-home'}`)
  await scrollTo(p, 'footer', 'start'); s = await state(p)
  check(`${url} phone, past the form: chat back`, s.chat && !s.formOn, s)
  await scrollTo(p, `#${f}N`, 'start'); await p.focus(`#${f}N`); await p.waitForTimeout(400); s = await state(p)
  check(`${url} phone, typing: chat hidden`, !s.chat, s)
  await midForm(p, f); await p.locator(SUB).click(); await p.waitForTimeout(400)
  check(`${url} phone, empty send marks the fields`, await p.evaluate(() => !!document.querySelector('form .bad')))
  check(`${url} phone, no script errors`, !p.errors.length, p.errors)
  await p.close()

  // both outcomes, the server answer stood in for (200 sent, 503 not set up)
  for (const mode of ['sent', 'mail']) {
    const q = await phone.newPage(); const errs = []; q.on('pageerror', e => errs.push(e.message))
    let body = null
    await q.route('**/api/send', r => { body = JSON.parse(r.request().postData()); return r.fulfill({ status: mode === 'sent' ? 200 : 503, contentType: 'application/json', body: mode === 'sent' ? '{"ok":true}' : '{"fallback":true}' }) })
    await q.goto(BASE + url, { waitUntil: 'load' })
    // keep the email-app jump from leaving the page
    await q.evaluate(() => { const send = window.DPY.send; window.DPY.send = async o => { window.__mail = o.mailto; o.mailto = 'javascript:void(0)'; return send(o) } })
    await q.fill(`#${f}N`, 'Test Person'); await q.fill(`#${f}P`, '0917 123 4567')
    if (f === 's') await q.fill('#sA', 'Pasig City')
    await q.evaluate(() => { document.querySelector('form input[name=consent]').checked = true })
    await q.evaluate(sel => document.querySelector(sel).scrollIntoView({ block: 'end' }), SUB)
    await q.locator(SUB).click(); await q.waitForTimeout(900)
    const r = await q.evaluate(() => { const d = document.querySelector('.f-done.on, .qt-done.on'); return { done: !!d, text: d ? d.innerText.replace(/\s+/g, ' ') : '', mail: window.__mail || '', formOn: document.body.classList.contains('form-on') } })
    const ok = r.done && body?.name === 'Test Person' && !r.formOn && !errs.length &&
      (mode === 'sent' ? /We have your request/.test(r.text) : /email app has opened/.test(r.text) && r.mail.startsWith('mailto:'))
    check(`${url} ${mode === 'sent' ? 'sends' : 'falls back to the email app'}`, ok, { kind: body?.kind, text: r.text.slice(0, 90), errs })
    await q.close()
  }
}
// Service: the earliest preferred day is tomorrow in the visitor's own date, and the field keeps its height
{
  const p = await open(phone, '/service')
  const d = await p.evaluate(() => { const i = document.querySelector('#sD'); const t = new Date(); t.setDate(t.getDate() + 1); return { min: i.min, want: t.toLocaleDateString('en-CA'), h: Math.round(i.getBoundingClientRect().height) } })
  check('service day starts tomorrow (local date)', d.min === d.want && d.h === 46, d)
  await p.close()
}
// the sample reviews stay labelled until real ones arrive
{
  const p = await open(phone, '/')
  const t = await p.evaluate(() => document.querySelector('.tm-note')?.textContent || '')
  const reviews = await p.evaluate(() => document.querySelectorAll('.tm-card, .tm figure, .tm blockquote').length)
  check('sample reviews are labelled', /Sample/.test(t) || reviews === 0, t)
  await p.close()
}
const desk = await b.newContext(DESKTOP)
for (const [url] of FORMS) {
  const p = await open(desk, url)
  await scrollTo(p, 'form .f-sub, form .qt-sub')
  const r = await p.evaluate(() => {
    const row = document.querySelector('form .f-sub, form .qt-sub'), s = row.querySelector('small').getBoundingClientRect(), bt = row.querySelector('.btn').getBoundingClientRect()
    return { flex: getComputedStyle(row).display === 'flex', sameRow: Math.abs((s.top + s.bottom) / 2 - (bt.top + bt.bottom) / 2) < 20, right: bt.left > s.right, pinned: getComputedStyle(row.querySelector('.btn')).position === 'sticky' }
  })
  check(`${url} desktop send row`, r.flex && r.sameRow && r.right && !r.pinned, r)
  await p.close()
}
await done(b)
