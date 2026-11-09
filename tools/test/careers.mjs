// Careers: Apply picks the role, validation (fields, missing CV, wrong file type), the CV box, sending with the CV,
// and the email-app fallback asking for the CV (the local server has no CAREERS_TO, so it answers "not set up").
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium, PHONE, DESKTOP, open, check, done, shot } from './lib.mjs'

const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'dpy-cv-'))
fs.writeFileSync(path.join(DIR, 'Juan Cruz CV.pdf'), '%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n%%EOF\n')
fs.writeFileSync(path.join(DIR, 'photo.png'), 'not a cv')
const b = await chromium.launch()
const submit = p => p.locator('#apply button[type=submit]').click().then(() => p.waitForTimeout(350))

for (const [name, opts] of [['desktop', DESKTOP], ['phone', PHONE]]) {
  const ctx = await b.newContext(opts)
  let body = null, mode = 'sent'
  await ctx.route('**/api/send', r => { body = JSON.parse(r.request().postData()); return mode === 'sent' ? r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }) : r.continue() })
  // a role's own page: View role from the list, then Apply, which arrives at the form with the role picked
  const p = await open(ctx, '/careers', { wait: 500 })
  await Promise.all([p.waitForURL(/careers\/sales-engineer-cebu$/), p.locator('a[href="careers/sales-engineer-cebu"].btn').click()])
  check(`${name} a role has its own page`, await p.evaluate(() => document.querySelector('h1').textContent === 'Sales Engineer' && document.querySelectorAll('.jp-list li').length >= 7))
  await Promise.all([p.waitForURL(/careers\?role=sales-engineer-cebu#apply$/), p.locator('.jp-head .btn.red').click()]); await p.waitForTimeout(1400)
  const st = await p.evaluate(() => ({ role: document.querySelector('#cR').value, focus: document.activeElement?.id, top: Math.round(document.querySelector('#apply').getBoundingClientRect().top) }))
  check(`${name} Apply on the role page picks the role and moves to the form`, st.role === 'Sales Engineer (Cebu)' && st.focus === 'cN' && st.top < 200, st)
  await submit(p)
  check(`${name} empty send marks the fields`, await p.evaluate(() => document.querySelectorAll('#apply .bad').length >= 3))
  await p.fill('#cN', 'Juan Cruz'); await p.fill('#cP', '0917 123 4567'); await p.fill('#cE', 'juan@example.com')
  await p.evaluate(() => { document.querySelector('#apply input[name=consent]').checked = true })
  await submit(p)
  const noCv = await p.evaluate(() => ({ marked: document.querySelector('.drop').classList.contains('bad'), msg: document.querySelector('#apply .f-err').textContent }))
  check(`${name} missing CV marks the CV box`, noCv.marked && /CV/.test(noCv.msg), noCv)
  check(`${name} nothing sent without a CV`, body === null, body?.kind)
  await p.setInputFiles('#cV', path.join(DIR, 'photo.png')); await submit(p)
  const e1 = await p.evaluate(() => document.querySelector('#apply .f-err').textContent)
  check(`${name} an image is refused`, /PDF or Word/.test(e1) && body === null, e1)
  await p.setInputFiles('#cV', path.join(DIR, 'Juan Cruz CV.pdf')); await p.waitForTimeout(200)
  const d = await p.evaluate(() => ({ has: document.querySelector('.drop').classList.contains('has'), name: document.querySelector('.drop .t b').textContent }))
  check(`${name} the CV box shows the file`, d.has && d.name === 'Juan Cruz CV.pdf', d)
  await shot(p.locator('.ap'), `careers-form-${name}`)
  await submit(p); await p.waitForTimeout(600)
  const sent = await p.evaluate(() => document.querySelector('#apply .f-done.on p')?.textContent || '')
  const pdf = body?.cv?.data ? Buffer.from(body.cv.data, 'base64').toString().startsWith('%PDF') : false
  check(`${name} sends with the CV`, body?.kind === 'careers' && body.email === 'juan@example.com' && pdf && /We have your application/.test(sent) &&
    body.fields.some(([k, v]) => k === 'Role' && v === 'Sales Engineer (Cebu)'), { kind: body?.kind, fields: body?.fields, sent })
  mode = 'real'
  await p.evaluate(() => { document.querySelector('#apply .again').click(); const send = window.DPY.send; window.DPY.send = async o => { window.__mail = o.mailto; o.mailto = 'javascript:void(0)'; return send(o) } })
  await submit(p); await p.waitForTimeout(600)
  const fb = await p.evaluate(() => ({ p: document.querySelector('#apply .f-done.on p')?.textContent || '', mail: decodeURIComponent(window.__mail || '') }))
  check(`${name} fallback asks the applicant to attach the CV`, /Attach your CV/.test(fb.p) && /attach your CV to this email/.test(fb.mail) && fb.mail.startsWith('mailto:careers@'), fb)
  check(`${name} no script errors`, !p.errors.length, p.errors)
  await ctx.close()
}
fs.rmSync(DIR, { recursive: true, force: true })
await done(b)
