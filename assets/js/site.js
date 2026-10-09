/* DPY Mercantile: shared script for the inner pages.
   Smooth scrolling, the nav, scroll reveals, the quote list (kept in this browser) and the email forms. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
const DPY = window.DPY = { $, $$, RM }

/* ---------- smooth scrolling (mouse and trackpad only; the loop runs only while the page moves) ---------- */
let lenis = null
if (!RM && window.Lenis && matchMedia('(pointer:fine)').matches) {
  lenis = new Lenis({ lerp: .1 })
  let on = false, last = 0
  const raf = t => { lenis.raf(t); if (lenis.isScrolling || performance.now() - last < 600) requestAnimationFrame(raf); else on = false }
  const kick = () => { last = performance.now(); if (!on) { on = true; requestAnimationFrame(raf) } }
  addEventListener('wheel', kick, { passive: true }); addEventListener('keydown', kick)
  DPY.kick = kick
}
DPY.lenis = lenis
DPY.lock = on => { document.documentElement.classList.toggle('modal-open', on); on ? lenis?.stop() : lenis?.start() } // dialogs: page stays put behind them
const go = (el, off = -80) => {
  if (typeof el === 'string') el = $(el); if (!el) return
  if (lenis) { DPY.kick(); lenis.scrollTo(el, { offset: off, duration: 1.2 }) } else scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: RM ? 'auto' : 'smooth' })
}
DPY.go = go
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return; e.preventDefault(); closeMenu(); go(id); history.replaceState(null, '', id) })
// arriving with #section: land just above it once the layout has settled
if (location.hash && $(location.hash)) addEventListener('load', () => setTimeout(() => go(location.hash), 60))

/* ---------- nav: solid after a little scroll, hides going down, returns going up ---------- */
const nav = $('.nav'); let lastY = 0
const onScroll = () => { const y = scrollY; nav.classList.toggle('solid', y > 30); nav.classList.toggle('up', y > lastY && y > 500 && !document.body.classList.contains('menu-open')); lastY = y }
addEventListener('scroll', onScroll, { passive: true }); onScroll()
const mb = $('.menu-btn')
function closeMenu() { document.body.classList.remove('menu-open'); document.documentElement.classList.remove('menu-lock'); mb?.setAttribute('aria-expanded', 'false'); lenis?.start() }
mb?.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); document.documentElement.classList.toggle('menu-lock', o); mb.setAttribute('aria-expanded', o); o ? lenis?.stop() : lenis?.start() })
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu() })

/* ---------- reveal on scroll, in small staggered groups ---------- */
const io = new IntersectionObserver(es => {
  const shown = es.filter(e => e.isIntersecting)
  shown.forEach((e, i) => { e.target.style.transitionDelay = RM ? '0s' : Math.min(i * 70, 420) + 'ms'; e.target.classList.add('in'); io.unobserve(e.target) })
}, { rootMargin: '0px 0px -8% 0px' })
DPY.reveal = (root = document) => $$('[data-r]:not(.in)', root).forEach(el => io.observe(el))
DPY.reveal()
// decorative loops pause while their section is off screen
$$('.phead, [data-loop]').forEach(s => new IntersectionObserver(([e]) => s.classList.toggle('off', !e.isIntersecting)).observe(s))

/* ---------- quote list: products a visitor wants priced, kept in this browser only ---------- */
const KEY = 'dpy-quote'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const write = l => { try { localStorage.setItem(KEY, JSON.stringify(l)) } catch {} }
const Q = DPY.quote = {
  list: read,
  has: s => read().some(x => x.s === s),
  add(s, n) { const l = read(); if (!l.some(x => x.s === s)) { l.push({ s, n }); write(l) } Q.sync(true) },
  remove(s) { write(read().filter(x => x.s !== s)); Q.sync() },
  clear() { write([]); Q.sync() },
  sync(pop) {
    const l = read()
    $$('.ql-n').forEach(b => { b.textContent = l.length; b.hidden = !l.length; if (pop && !RM) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 400) } })
    $$('[data-add]').forEach(b => b.setAttribute('aria-pressed', l.some(x => x.s === b.dataset.add)))
    document.dispatchEvent(new CustomEvent('dpy:quote', { detail: l }))
  },
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return
  e.preventDefault(); Q.has(b.dataset.add) ? Q.remove(b.dataset.add) : Q.add(b.dataset.add, b.dataset.name)
})
addEventListener('storage', e => e.key === KEY && Q.sync())
Q.sync()

/* ---------- forms: prototype sends by opening the visitor's email app (production would post to DPY's CRM / n8n) ---------- */
$$('form[data-mail]').forEach(form => {
  const done = $('.f-done', form)
  form.addEventListener('input', e => { e.target.classList.remove('bad'); e.target.closest('.ok')?.classList.remove('bad') })
  form.addEventListener('submit', e => {
    e.preventDefault()
    const need = $$('[required]:not([type=checkbox])', form).filter(x => !x.value.trim())
    const tel = $('input[type=tel]', form); if (tel && tel.value.trim() && !/^[0-9+()\s-]{7,}$/.test(tel.value.trim())) need.push(tel)
    const ok = $('.ok input', form); ok?.closest('.ok').classList.toggle('bad', !ok.checked)
    need.forEach(x => x.classList.add('bad')); if (need.length) return need[0].focus()
    if (ok && !ok.checked) return ok.focus()
    const lines = []
    for (const el of $$('input,select,textarea', form)) {
      if (!el.name || el.name === 'consent' || el.type === 'hidden' && !el.value) continue
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue
      const lb = el.dataset.label || form.querySelector(`label[for="${el.id}"]`)?.textContent.replace('*', '').trim() || el.closest('[data-group]')?.dataset.group || el.name
      if (el.value.trim()) lines.push([lb, el.value.trim()])
    }
    const merged = {}; lines.forEach(([k, v]) => merged[k] = merged[k] ? merged[k] + ', ' + v : v)
    const body = Object.entries(merged).map(([k, v]) => `${k}: ${v}`).join('\n')
    const who = (form.elements.fullname?.value || '').trim()
    location.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent((form.dataset.subject || 'Website request') + (who ? ': ' + who : ''))}&body=${encodeURIComponent(body)}`
    if (done) { $('.who', done) && ($('.who', done).textContent = who ? ', ' + who.split(' ')[0] : ''); done.classList.add('on'); $('.again', done)?.focus() }
  })
  $('.again', form)?.addEventListener('click', () => done.classList.remove('on'))
})
})()
