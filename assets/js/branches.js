/* The branch map, on the homepage and the Contact page: a satellite map of the Philippines with the five branches.
   Picking one flies down to it, then fades into Google Street View facing the office.
   Branches from dpymi.com.ph/branches; Baguio and Tagaytay from "Where to buy". */
(() => {
const stageEl = document.querySelector('.br-stage'); if (!stageEl) return
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
const ROOT = new URL('../../', document.currentScript.src).href // the site root: pages live at / and /products/
// pin = the office on Google Maps; sv = the nearest Street View spot and the heading/pitch that faces the office
const BR = [
  { k: 'manila', n: 'Manila', rg: 'Head office', a: '778-B Mahogany St., Octagon Village, Brgy. Dela Paz, Pasig City', pin: [121.0954281, 14.6111876], sv: [14.6112029, 121.0953304, 99, -4], bearing: -24 },
  { k: 'boracay', n: 'Boracay', rg: 'Visayas', a: 'Station 2, Manoc-Manoc, Boracay Island, Malay, Aklan', pin: [121.9246445, 11.9609959], sv: [11.9609959, 121.9246445, 0, -2], bearing: 18, area: true, side: 'l' },
  { k: 'iloilo', n: 'Iloilo', rg: 'Visayas', a: '2nd Floor Agro Building, Jalandoni Street, Brgy. Villa Anita, Iloilo City', pin: [122.5586473, 10.7162841], sv: [10.7163347, 122.5585963, 135, -4], bearing: -12, side: 'l' },
  { k: 'cebu', n: 'Cebu', rg: 'Visayas', a: '3rd Floor Horacio Sr. Centre, S.B. Cabahug, Ibabao-Estancia, Mandaue City', pin: [123.9450424, 10.3350685], sv: [10.3350473, 123.9449658, 60, -6], bearing: 28 },
  { k: 'davao', n: 'Davao', rg: 'Mindanao', a: 'Camella Northpoint, J.P. Laurel Avenue, Bajada, Davao City', pin: [125.613112, 7.0964317], sv: [7.0962733, 125.6130287, 62, -14], bearing: -30 },
]
const ALSO = [['Baguio City', 120.5960, 16.4023, ''], ['Tagaytay', 120.9620, 14.1153, 'l']]
const stage = $('.br-stage'), ov = $('.br-ov'), info = $('.br-info'), all = $('.all', ov), sv = $('.br-sv'), svf = $('iframe', sv), dive = $('.br-dive'), vw = $('.vw', info)
const WALK = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="3" r="2"/><path d="M6 6h4l1 5H9.5l-.5 4h-2l-.5-4H5z"/></svg>Street view', MAPV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1.5 4l4-1.5 5 1.5 4-1.5v9.5l-4 1.5-5-1.5-4 1.5z"/><path d="M5.5 2.5v10M10.5 4v10"/></svg>Map view'
$('ul', ov).innerHTML = BR.map((b, i) => `<li><button data-i="${i}" aria-pressed="false"><span class="n">0${i + 1}</span><span><b>${b.n}</b><small>${b.rg}</small></span></button></li>`).join('')
const B = $$('ul button', ov)
const HOME = innerWidth < 860 ? { center: [122.6, 11.0], zoom: 4.55, pitch: 20, bearing: -6 } : { center: [120.9, 11.3], zoom: 5.05, pitch: 26, bearing: -8 } // the country sits right of the list
let map = null, mk = [], cur = -1, step = 0, T = []
const later = (fn, ms) => T.push(setTimeout(fn, RM ? 0 : ms)), stop = () => { T.forEach(clearTimeout); T = []; step++ }
const press = i => { B.forEach((b, j) => b.setAttribute('aria-pressed', j === i)); all.setAttribute('aria-pressed', i < 0); mk.forEach((m, j) => m.classList.toggle('on', j === i)); stage.classList.toggle('zoomed', i >= 0) }
const svURL = ([la, ln, h, p]) => `https://maps.google.com/maps?layer=c&cbll=${la},${ln}&cbp=12,${h},0,0,${p}&output=svembed`
function walkIn(i) { // dive to the street, then fade into the walk view facing the office
  const s = ++step, b = BR[i]
  vw.innerHTML = MAPV; $('.tn', sv).textContent = b.area ? 'Street view · ' + b.n + ' (area)' : 'Street view · DPY ' + b.n
  svf.onload = () => { if (s !== step) return; later(() => { dive.classList.remove('on'); sv.classList.add('on'); stage.classList.add('walking') }, 250) }
  svf.src = svURL(b.sv)
  if (map && !RM) { dive.classList.add('on'); map.easeTo({ center: b.pin, zoom: 18.4, pitch: 76, duration: 1400, easing: x => x * x }) }
  later(() => s === step && (dive.classList.remove('on'), sv.classList.add('on'), stage.classList.add('walking')), 4000) // in case the iframe is slow, never leave a white screen
}
function walkOut(i) { stop(); sv.classList.remove('on'); stage.classList.remove('walking'); dive.classList.remove('on'); vw.innerHTML = WALK; if (i >= 0) map?.easeTo({ center: BR[i].pin, zoom: 15.6, pitch: 62, duration: RM ? 0 : 1200 }) }
function fly(i) {
  stop(); sv.classList.remove('on'); stage.classList.remove('walking'); dive.classList.remove('on'); vw.innerHTML = WALK; cur = i; press(i)
  if (i < 0) { info.classList.remove('on'); map?.flyTo({ ...HOME, duration: RM ? 0 : 3000, curve: 1.5, essential: true }); return }
  const b = BR[i], s = step
  $('.k', info).textContent = i ? b.rg + ' branch' : 'Head office'; $('h3', info).textContent = b.n; $('.ad', info).textContent = b.a
  $('.dirs', info).href = 'https://www.google.com/maps/dir/?api=1&destination=' + b.pin[1] + ',' + b.pin[0]
  info.classList.remove('on'); later(() => cur === i && info.classList.add('on'), 1800)
  if (!map) return
  map.flyTo({ center: b.pin, zoom: 15.6, pitch: 62, bearing: b.bearing, duration: RM ? 0 : 4200, curve: 1.6, essential: true })
  map.once('moveend', () => s === step && cur === i && later(() => s === step && walkIn(i), 700)) // land, take a breath, then walk in
}
B.forEach((b, i) => b.addEventListener('click', () => fly(i))); all.addEventListener('click', () => fly(-1))
vw.addEventListener('click', () => sv.classList.contains('on') || dive.classList.contains('on') ? walkOut(cur) : walkIn(cur))
// MapLibre loads only when the section comes near, so the page opens as fast as before
function boot() {
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = ROOT + 'assets/vendor/maplibre-gl.css'; document.head.append(css)
  const s = document.createElement('script'); s.src = ROOT + 'assets/vendor/maplibre-gl.js'; s.onerror = () => $('.br-ld').textContent = 'The map could not load. Please refresh the page.'
  s.onload = () => {
    const E = 'https://server.arcgisonline.com/ArcGIS/rest/services/'
    map = new maplibregl.Map({ container: 'brMap', ...HOME, zoom: HOME.zoom - 1.2, pitch: 0, bearing: 0, attributionControl: { compact: true }, pixelRatio: Math.min(devicePixelRatio, 1.5), maxPitch: 78, maxZoom: 19, cooperativeGestures: true, fadeDuration: 150,
      style: { version: 8, sources: {
        sat: { type: 'raster', tiles: [E + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' },
        ref: { type: 'raster', tiles: [E + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 18 } },
        layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#06101F' } }, { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': -.15, 'raster-contrast': .05 } }, { id: 'ref', type: 'raster', source: 'ref', minzoom: 9, paint: { 'raster-opacity': .7 } } /* place names only up close, so they don't crowd our pins */] } })
    map.scrollZoom.disable() // the page scroll stays the page scroll
    const pin = (lng, lat, label, cls, onClick) => { const el = document.createElement('div'); el.className = 'mk ' + cls; el.innerHTML = `<i></i><span>${label}</span>`; if (onClick) el.addEventListener('click', onClick); new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map); return el }
    mk = BR.map((b, i) => pin(b.pin[0], b.pin[1], b.n, b.side || '', () => fly(i)))
    ALSO.forEach(([n, lng, lat, side]) => pin(lng, lat, n, 'sm ' + side))
    map.once('load', () => { $('.br-ld').remove(); new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; o.disconnect(); if (cur < 0) map.flyTo({ ...HOME, duration: RM ? 0 : 2600, essential: true }) }, { threshold: .35 }).observe(stage) })
  }
  document.head.append(s)
}
vw.innerHTML = WALK
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); (window.requestIdleCallback || setTimeout)(boot, { timeout: 1500 }) } }, { rootMargin: '900px' }).observe(stage)
})()
