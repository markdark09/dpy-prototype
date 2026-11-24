/* The product photo gallery, on product pages with two or more photos (the same file in the prototype and the Laravel
   site). The photos sit in a row that scrolls sideways and snaps, so swiping works without this script; it adds the
   arrows, the thumbnails, the counter, the arrow keys, and a full-screen view where a click or tap zooms in. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
  const root = document.documentElement
  const X = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>'

  // a row of slides that snap: which one shows, and moving to one
  const rail = track => ({
    at: () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth)),
    go: (i, smooth = !RM) => track.scrollTo({ left: i * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' }),
  })

  for (const gal of document.querySelectorAll('[data-gal]')) {
    const track = gal.querySelector('.gal-track'), slides = [...track.children], N = slides.length, r = rail(track)
    const row = gal.parentElement.querySelector('.gal-th'), thumbs = row ? [...row.children] : []
    const prev = gal.querySelector('.gal-btn.prev'), next = gal.querySelector('.gal-btn.next'), count = gal.querySelector('.gal-n b')
    let cur = -1

    const show = i => {
      if (i === cur) return
      cur = i
      prev.disabled = i === 0; next.disabled = i === N - 1
      if (count) count.textContent = i + 1
      thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)))
      // keep the current thumbnail in view in its own row (never by scrolling the page)
      const t = thumbs[i]
      if (t && row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: RM ? 'auto' : 'smooth' })
    }
    const go = i => r.go(Math.max(0, Math.min(N - 1, i)))

    let ticking = false
    track.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; show(r.at()) }) } }, { passive: true })
    // a resize must not leave the row between two photos
    new ResizeObserver(() => r.go(cur, false)).observe(track)
    prev.addEventListener('click', () => go(cur - 1))
    next.addEventListener('click', () => go(cur + 1))
    thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)))
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1)) }
      else if (e.key === 'Enter') open(cur)
    })
    gal.querySelector('.gal-full').addEventListener('click', () => open(cur))
    slides.forEach((s, k) => s.querySelector('img').addEventListener('click', () => open(k)))
    show(0)

    /* ---- full screen, built the first time it opens ---- */
    let dlg, lbTrack, lbr, lbN, lbCur = 0
    const unzoom = () => { for (const img of lbTrack.querySelectorAll('img.zoom')) img.classList.remove('zoom'); lbTrack.classList.remove('zoomed') }
    const lbShow = i => {
      lbCur = i; lbN.textContent = `${i + 1} / ${N}`
      dlg.querySelector('.prev').disabled = i === 0; dlg.querySelector('.next').disabled = i === N - 1
    }
    const lbGo = i => { unzoom(); lbr.go(Math.max(0, Math.min(N - 1, i))) }
    function build() {
      dlg = document.createElement('dialog')
      dlg.className = 'gal-lb'
      dlg.setAttribute('aria-label', gal.getAttribute('aria-label'))
      dlg.innerHTML = `<div class="lb-track"></div><span class="lb-n" aria-live="polite"></span>`
        + `<button class="lb-x" type="button" aria-label="Close">${X}</button>`
        + `<button class="gal-btn prev" type="button" aria-label="Previous photo">${prev.innerHTML}</button><button class="gal-btn next" type="button" aria-label="Next photo">${next.innerHTML}</button>`
      lbTrack = dlg.querySelector('.lb-track'); lbN = dlg.querySelector('.lb-n'); lbr = rail(lbTrack)
      for (const s of slides) {
        const from = s.querySelector('img'), fig = document.createElement('figure'), img = new Image()
        fig.className = 'lb-s'
        // the full-size file (the src), not the phone copy the page may have picked from srcset
        img.src = from.getAttribute('src'); img.alt = from.alt; img.decoding = 'async'
        img.width = from.width; img.height = from.height
        fig.append(img)
        const cap = s.querySelector('figcaption')
        if (cap) fig.append(Object.assign(document.createElement('figcaption'), { textContent: cap.textContent }))
        // zoom: in where it was clicked or tapped, then follow the pointer to look around; again to zoom out
        const aim = e => { const b = img.getBoundingClientRect(); img.style.transformOrigin = `${((e.clientX - b.left) / b.width * 100).toFixed(1)}% ${((e.clientY - b.top) / b.height * 100).toFixed(1)}%` }
        img.addEventListener('click', e => {
          const on = !img.classList.contains('zoom')
          unzoom()
          if (on) { aim(e); img.classList.add('zoom'); lbTrack.classList.add('zoomed') }
        })
        img.addEventListener('pointermove', e => { if (img.classList.contains('zoom')) aim(e) })
        lbTrack.append(fig)
      }
      let t2 = false
      lbTrack.addEventListener('scroll', () => { if (!t2) { t2 = true; requestAnimationFrame(() => { t2 = false; lbShow(lbr.at()) }) } }, { passive: true })
      dlg.querySelector('.lb-x').addEventListener('click', () => dlg.close())
      dlg.querySelector('.prev').addEventListener('click', () => lbGo(lbCur - 1))
      dlg.querySelector('.next').addEventListener('click', () => lbGo(lbCur + 1))
      // a click on the dark space around a photo closes it, as on most sites
      dlg.addEventListener('click', e => { if (e.target === dlg || e.target.classList.contains('lb-s')) dlg.close() })
      dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); lbGo(lbCur + (e.key === 'ArrowRight' ? 1 : -1)) } })
      // closing brings the page's gallery to the photo last seen; the browser returns focus to the button that opened it
      dlg.addEventListener('close', () => { unzoom(); root.classList.remove('gal-open'); r.go(lbCur, false) })
      document.body.append(dlg)
    }
    function open(i) {
      if (!dlg) build()
      root.classList.add('gal-open')
      dlg.showModal()
      lbr.go(i, false); lbShow(i)
      dlg.querySelector('.lb-x').focus()
    }
  }
})()
