/* DPY Mercantile: shared script for every page.
   The quote list (kept in this browser) and the email forms run everywhere. On the inner pages it also runs the header and menu
   and the scroll reveals; the homepage runs its own (window.DPY_HOME), tied to its GSAP animations. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches, HOME = !!window.DPY_HOME
const DPY = window.DPY = { $, $$, RM }

/* ---------- scrolling is the browser's own (a smooth-scroll library made pages repaint every frame on integrated graphics) ---------- */
DPY.lock = on => document.documentElement.classList.toggle('modal-open', on) // dialogs: the page stays put behind them
const go = DPY.go = HOME ? (el => window.DPYgo?.(el)) : (el, off = -80) => {
  if (typeof el === 'string') el = $(el); if (!el) return
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: RM ? 'auto' : 'smooth' })
}

if (!HOME) {
  document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return; e.preventDefault(); closeMenu(); go(id); history.replaceState(null, '', id) })
  // arriving with #section: land just above it once the layout has settled
  if (location.hash && $(location.hash)) addEventListener('load', () => setTimeout(() => go(location.hash), 60))

  /* ---------- header: solid after a little scroll, hides going down, returns going up ---------- */
  const nav = $('.nav'); let lastY = 0
  const onScroll = () => { const y = scrollY; nav.classList.toggle('solid', y > 30); nav.classList.toggle('up', y > lastY && y > 500 && !document.body.classList.contains('menu-open')); lastY = y }
  addEventListener('scroll', onScroll, { passive: true }); requestAnimationFrame(onScroll) // not straight away: reading the scroll position would force the first layout inside this script
  const mb = $('.menu-btn')
  var closeMenu = () => { document.body.classList.remove('menu-open'); document.documentElement.classList.remove('menu-lock'); mb?.setAttribute('aria-expanded', 'false') }
  mb?.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); document.documentElement.classList.toggle('menu-lock', o); mb.setAttribute('aria-expanded', o) })
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu() })

  /* ---------- reveal on scroll, in small staggered groups ---------- */
  const io = new IntersectionObserver(es => {
    es.filter(e => e.isIntersecting).forEach((e, i) => { e.target.style.transitionDelay = RM ? '0s' : Math.min(i * 70, 420) + 'ms'; e.target.classList.add('in'); io.unobserve(e.target) })
  }, { rootMargin: '0px 0px -8% 0px' })
  DPY.reveal = (root = document) => $$('[data-r]:not(.in)', root).forEach(el => io.observe(el))
  DPY.reveal()
  // decorative loops pause while their section is off screen
  $$('.phead, [data-loop]').forEach(s => new IntersectionObserver(([e]) => s.classList.toggle('off', !e.isIntersecting)).observe(s))
}

/* ---------- quote list: products a visitor wants priced, kept in this browser only ---------- */
const KEY = 'dpy-quote'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const write = l => { try { localStorage.setItem(KEY, JSON.stringify(l)) } catch {} }
const Q = DPY.quote = {
  list: read,
  has: s => read().some(x => x.s === s),
  add(s, n, i = '', c = '') { const l = read(); if (!l.some(x => x.s === s)) { l.push({ s, n, i, c }); write(l) } Q.sync(true) },
  remove(s) { write(read().filter(x => x.s !== s)); Q.sync() },
  clear() { write([]); Q.sync() },
  sync(pop) {
    const l = read()
    $$('.ql-n').forEach(b => { b.textContent = l.length; b.hidden = !l.length; if (pop && !RM) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 400) } })
    $$('[data-add]').forEach(b => b.setAttribute('aria-pressed', l.some(x => x.s === b.dataset.add)))
    $$('[data-ql]').forEach(box => showList(box, l))
    document.dispatchEvent(new CustomEvent('dpy:quote', { detail: l }))
  },
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return
  e.preventDefault(); const d = b.dataset; Q.has(d.add) ? Q.remove(d.add) : Q.add(d.add, d.name, d.img, d.cat)
})
addEventListener('storage', e => e.key === KEY && Q.sync())

// a quote form's list: the products, a remove button each, the hidden "products" field and the matching "Interested in" chips
const ROOT = new URL('../../', document.currentScript.src).href
const TYPE = { instant: 'Instant', storage: 'Storage', heatpump: 'Heat pump', solar: 'Solar', tank: 'Tanks & pumps', pump: 'Tanks & pumps', pipe: 'Tanks & pumps' }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
function showList(box, l) {
  box.hidden = !l.length
  $('ul', box).innerHTML = l.map(x => `<li><span>${x.i ? `<img src="${ROOT + x.i}" alt="">` : `<span class="ni">${esc(x.n.split(' ')[0].toUpperCase())}</span>`}</span><a href="${ROOT}products/${x.s}">${esc(x.n)}</a><button type="button" data-rm="${x.s}" aria-label="Remove ${esc(x.n)}">×</button></li>`).join('')
  const form = box.closest('form') || box.parentElement.querySelector('form')
  if (!form) return
  if (form.elements.products) form.elements.products.value = l.map(x => x.n).join('; ')
  l.forEach(x => { const v = TYPE[x.c]; const c = v && $$('input[name=interest]', form).find(i => i.value === v); if (c) c.checked = true })
}
document.addEventListener('click', e => {
  const r = e.target.closest('[data-ql] [data-rm]'); if (r) Q.remove(r.dataset.rm)
  if (e.target.closest('[data-ql] .clr')) Q.clear()
})
Q.sync()

/* ---------- compare: up to 4 products, kept in this browser; a bar at the bottom shows them and opens the Compare page ---------- */
const CKEY = 'dpy-compare', CMAX = 4
const cread = () => { try { return JSON.parse(localStorage.getItem(CKEY)) || [] } catch { return [] } }
const cwrite = l => { try { localStorage.setItem(CKEY, JSON.stringify(l.slice(0, CMAX))) } catch {} }
const COMPARE_PAGE = /\/compare$/.test(location.pathname.replace(/\.html$/, ''))
let tray = null, trayT
const C = DPY.compare = {
  list: cread, max: CMAX,
  set(l) { cwrite(l); C.sync() },
  toggle(s, n, i) {
    const l = cread()
    if (l.some(x => x.s === s)) return C.set(l.filter(x => x.s !== s))
    if (l.length >= CMAX) return C.sync(`Compare up to ${CMAX} at a time. Remove one first.`)
    l.push({ s, n, i }); C.set(l)
  },
  sync(note) {
    const l = cread()
    $$('[data-cmp]').forEach(b => b.setAttribute('aria-pressed', l.some(x => x.s === b.dataset.cmp)))
    if (!COMPARE_PAGE) drawTray(l, note)
    document.dispatchEvent(new CustomEvent('dpy:compare', { detail: l }))
  },
}
function drawTray(l, note) {
  if (!tray) {
    tray = document.createElement('div'); tray.className = 'ctray'; tray.setAttribute('role', 'region'); tray.setAttribute('aria-label', 'Products to compare')
    tray.innerHTML = '<div class="ct-in"><span class="ct-k">Compare</span><ul></ul><p class="ct-note" aria-live="polite"></p><a class="btn red sm ct-go">Compare <b></b></a><button class="ct-x" type="button" aria-label="Clear the comparison">Clear</button></div>'
    document.body.append(tray)
    tray.addEventListener('click', e => { const r = e.target.closest('[data-crm]'); if (r) C.set(cread().filter(x => x.s !== r.dataset.crm)); if (e.target.closest('.ct-x')) C.set([]) })
  }
  $('ul', tray).innerHTML = l.map(x => `<li><span>${x.i ? `<img src="${ROOT + x.i}" alt="">` : esc(x.n.split(' ')[0])}</span><button type="button" data-crm="${x.s}" aria-label="Remove ${esc(x.n)}">×</button></li>`).join('') + Array.from({ length: CMAX - l.length }, () => '<li class="e"></li>').join('')
  $('.ct-go', tray).href = ROOT + 'compare?p=' + l.map(x => x.s).join(',')
  $('.ct-go b', tray).textContent = l.length
  $('.ct-go', tray).classList.toggle('dis', l.length < 2)
  $('.ct-note', tray).textContent = note || (l.length === 1 ? 'Pick one more to compare' : '')
  clearTimeout(trayT); if (note) trayT = setTimeout(() => $('.ct-note', tray).textContent = l.length === 1 ? 'Pick one more to compare' : '', 3500)
  tray.classList.toggle('on', l.length > 0); document.body.classList.toggle('ctray-on', l.length > 0)
}
document.addEventListener('click', e => { const b = e.target.closest('[data-cmp]'); if (!b) return; e.preventDefault(); C.toggle(b.dataset.cmp, b.dataset.name, b.dataset.img) })
addEventListener('storage', e => e.key === CKEY && C.sync())
C.sync()

/* ---------- forms: the prototype sends by opening the visitor's email app (production would post to DPY's inbox or CRM) ---------- */
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
      if (!el.name || el.name === 'consent') continue
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue
      const lb = el.dataset.label || form.querySelector(`label[for="${el.id}"]`)?.textContent.replace('*', '').trim() || el.closest('[data-group]')?.dataset.group || el.name
      if (el.value.trim()) lines.push([lb, el.value.trim()])
    }
    const merged = {}; lines.forEach(([k, v]) => merged[k] = merged[k] ? merged[k] + ', ' + v : v)
    const body = Object.entries(merged).map(([k, v]) => `${k}: ${v}`).join('\n')
    const who = (form.elements.fullname?.value || '').trim()
    location.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent((form.dataset.subject || 'Website request') + (who ? ': ' + who : ''))}&body=${encodeURIComponent(body)}`
    if (done) { const w = $('.who', done); if (w) w.textContent = who ? ', ' + who.split(' ')[0] : ''; done.classList.add('on'); $('.again', done)?.focus() }
  })
  $('.again', form)?.addEventListener('click', () => done.classList.remove('on'))
})
})()
