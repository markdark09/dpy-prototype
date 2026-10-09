import { CLIENTS, crumbsHtml, img, I } from '../../tools/lib.mjs'

const SECTORS = [
  { k: 'hotels', t: 'Hotels & Resorts', img: 'dpy/resort-render', need: 'Every guest showers in the same two morning hours, and the pool, kitchen and laundry need hot water too.', we: 'Central heat pump plants with large storage tanks and circulation pumps, sized for full occupancy, so the last guest gets the same hot shower as the first.', parts: [['Deron air to water heat pumps', 'deron-air-to-water-heat-pump'], ['HAASE energy storage tanks', 'haase-energy-storage-tank'], ['Wilo circulation pumps', 'wilo-pumps'], ['Pool heat pumps', 'deron-swimming-pool-heat-pump']], cl: 'Hotels & Resorts' },
  { k: 'hospitals', t: 'Hospitals & Clinics', img: 'plant', need: 'Wards, operating rooms, kitchens and laundries need hot water around the clock, at safe and steady temperatures.', we: 'Heat pumps backed up by electric heaters, hygienic storage tanks that keep bacteria out, and mixing valves, so supply never stops and never scalds.', parts: [['Heat pumps', 'deron-air-to-water-heat-pump'], ['Rotex Sanicube hygienic tanks', 'rotex-sanicube'], ['Champion storage tanks', 'champion-storage-tank'], ['Maintenance plans', '../service']], cl: 'Hospitals & Schools' },
  { k: 'towers', t: 'Condos & Residential Towers', img: 'dpy/tower-render', need: 'Developers need units that fit small bathrooms, work on every floor\'s water pressure and are easy for owners to look after.', we: 'Instant or storage heaters for each unit, chosen for the floor plan and pressure, or one central system for the whole tower.', parts: [['Aquapower instant heaters', 'aquapower-a35m-a55'], ['Gratek Aquarius with pump', 'gratek-aquarius-aqa-30e'], ['Rheem storage heaters', 'rheem'], ['PPR pipes & fittings', 'aquaplast-ppr-pipes']], cl: 'Residences & Offices' },
  { k: 'commercial', t: 'Restaurants, Gyms & Offices', img: 'shower', need: 'Kitchens need hot water for cleaning at peak hours. Gyms need dozens of showers running at once after classes.', we: 'Systems sized to your busiest hour: storage heaters or heat pumps with tanks, plus exhaust fans for kitchens and changing rooms.', parts: [['Everhot storage heaters', 'everhot'], ['5 Star integral heat pumps', '5-star-integral-heat-pump'], ['Aquapower Q9M instant heaters', 'aquapower-q6m-q9m'], ['Katen exhaust fans', 'katen-exhaust-fans']], cl: 'Food & Fitness' },
]
const STEPS = [
  ['Site survey', 'Free. Our sales engineers visit, look at the plant room, the roof and the pipes, and ask how the building is used.'],
  ['System design', 'We size the heaters, tanks and pumps for your peak hour, and plan where everything goes.'],
  ['Written proposal', 'An itemized quotation: units, pipes, pumps, installation and commissioning.'],
  ['Supply & installation', 'Genuine units from 12 brands, installed by our own technicians, then tested and commissioned with your engineers.'],
  ['Maintenance', 'Preventive maintenance and repairs from our five branches, for as long as the system runs.'],
]

export default {
  path: 'business', nav: 'business',
  title: 'Hot Water Systems for Hotels, Hospitals & Buildings',
  desc: 'Central hot water systems designed, installed and maintained by DPY Mercantile: heat pumps, storage tanks and pumps for hotels, hospitals, condos and commercial buildings.',
  crumbs: [['For Business']],
  ogImage: 'assets/img/dpy/resort-render.webp',
  css: `
.bh{position:relative;isolation:isolate;overflow:clip;padding:160px 0 70px;color:#fff;background:var(--night)}
.bh > img{position:absolute;inset:0;z-index:-2;width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.bh::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(6,16,31,.92) 0%,rgba(6,16,31,.7) 45%,rgba(6,16,31,.25) 100%),linear-gradient(0deg,rgba(6,16,31,.8),rgba(6,16,31,0) 40%)}
.bh .crumbs{color:#9DB0C6}.bh .crumbs [aria-current]{color:#fff}.bh .crumbs li+li::before{color:#5E7896}
.bh .kick{color:#7CC0FF}
.bh .lede{color:#CFE0F2;margin-top:18px;font-size:16px;max-width:540px}
.bh .btn.line{color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6)}.bh .btn.line:hover{background:#fff;color:var(--ink)}
.bh .ph-stats{justify-content:flex-start;margin-top:56px;padding-top:26px;border-top:1px solid rgba(255,255,255,.14)}
.bh .ph-stats small{color:#9DB0C6}
/* the system schematic */
.sch{position:relative;border-radius:30px;padding:26px;background:linear-gradient(180deg,#0B1D38,#0A1830);box-shadow:0 40px 80px -50px rgba(1,20,50,.8);color:#fff}
.sch svg{width:100%;height:auto;overflow:visible}
.sch-x{overflow-x:auto;scrollbar-width:none}.sch-x::-webkit-scrollbar{display:none}
.sch .swipe{display:none;margin:8px 0 0;font-size:12px;color:#8FA6C0}
.sch .pipe{fill:none;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.sch .hot{stroke:#E3473B}.sch .cold{stroke:#4C9BE8}.sch .warm{stroke:#F08A4B}
.sch .flow{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-dasharray:2 16;opacity:.75;animation:flow 1.6s linear infinite}
.sch .flow.slow{animation-duration:2.4s}
@keyframes flow{to{stroke-dashoffset:-36}}
.sch .box{fill:#132B4E;stroke:rgba(255,255,255,.18);stroke-width:1.5}
.sch .lbl{font:600 13px var(--font);fill:#fff}
.sch .sub{font:500 11px var(--font);fill:#8FA6C0}
.sch a:hover .box,.sch a:focus-visible .box{fill:#1B3A66;stroke:#7CC0FF}
.sch a{outline:none}
.sch .fin{stroke:rgba(255,255,255,.22);stroke-width:1.5}
.sch .sun{fill:#FFC24D}
.sch .tap{fill:#7CC0FF}
.sch .hotfill{fill:url(#tankFill)}
.leg{display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;font-size:12.5px;color:#9DB0C6}
.leg span{display:inline-flex;align-items:center;gap:8px}
.leg i{width:22px;height:5px;border-radius:4px}
.sch-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:22px}
.sch-steps div{padding:16px;border-radius:18px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.sch-steps b{display:block;font-size:14.5px;font-weight:600;margin-bottom:4px}
.sch-steps p{margin:0;font-size:13px;line-height:1.5;color:#9DB0C6}
.sch-steps em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.12em;color:#7CC0FF}
/* sectors */
.sx{display:grid;grid-template-columns:1.05fr .95fr;gap:20px;align-items:stretch}
.sx-pic{position:relative;min-height:420px;border-radius:26px;overflow:hidden;background:#dfe8f1}
.sx-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .5s,transform 1.2s var(--ease)}
.sx-pic img:not(.on){opacity:0;transform:scale(1.04)}
.sx-txt{padding:30px;border-radius:26px;background:#fff;box-shadow:var(--card)}
.sx-txt h3{margin:0 0 14px;font-size:26px;font-weight:600;letter-spacing:-.03em}
.sx-txt .q{margin:0 0 4px;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--red)}
.sx-txt .q.b{color:var(--blue)}
.sx-txt p{margin:0 0 18px;font-size:15px;line-height:1.6;color:var(--ink2)}
.sx-parts{list-style:none;margin:0 0 20px;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sx-parts a{display:flex;align-items:center;justify-content:space-between;gap:8px;height:100%;padding:10px 12px;border-radius:12px;background:#F4F7FA;font-size:13px;font-weight:600;transition:background .3s}
.sx-parts a:hover{background:#E8EEF5}
.sx-parts svg{flex:none;width:13px;height:13px;color:var(--dim)}
.sx-logos{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.sx-logos img{height:34px;width:auto;max-width:90px;object-fit:contain;filter:grayscale(1);opacity:.7}
.sx-logos small{font-size:12px;color:var(--mute);margin-right:4px}
.sx-panel[hidden]{display:none}
/* process */
.proc{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;counter-reset:s;position:relative}
.proc::before{content:"";position:absolute;left:24px;right:24px;top:23px;height:2px;background:linear-gradient(90deg,var(--sky),#FF8A3D 60%,var(--red2));opacity:.5}
.proc li{position:relative;counter-increment:s}
.proc li::before{content:counter(s,decimal-leading-zero);position:relative;display:grid;place-items:center;width:48px;height:48px;margin-bottom:16px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 2px var(--ink);font-size:13px;font-weight:700}
.proc li:first-child::before{background:var(--ink);color:#fff}
.proc b{display:block;font-size:16px;font-weight:600;letter-spacing:-.02em;margin-bottom:6px}
.proc p{margin:0;font-size:13.5px;line-height:1.55;color:var(--mute)}
/* brands */
.bwall{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.bwall li{min-width:0;display:grid;place-items:center;height:92px;padding:0 14px;border-radius:16px;background:#fff;box-shadow:var(--card)}
.bwall img{max-height:34px;max-width:min(110px,100%);width:auto;filter:grayscale(1);opacity:.75;transition:filter .4s,opacity .4s}
.bwall li:hover img{filter:none;opacity:1}
.bwall span{font-size:15px;font-weight:800;letter-spacing:.07em;color:#3A4655}
.save{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:30px;border-radius:26px;background:#fff;box-shadow:var(--card)}
.save b{display:block;font-size:22px;font-weight:600;letter-spacing:-.02em}
.save p{margin:6px 0 0;color:var(--mute);font-size:14.5px;max-width:620px}
@media (max-width:980px){.sx{grid-template-columns:1fr}.sx-pic{min-height:280px}.proc{grid-template-columns:1fr 1fr}.proc::before{display:none}.sch-steps{grid-template-columns:1fr 1fr}.bwall{grid-template-columns:repeat(3,1fr)}}
@media (max-width:640px){.sch svg{width:680px;max-width:none}.sch .swipe{display:block}.bh{padding:120px 0 48px}.sch{padding:14px;border-radius:22px}.sch-steps,.proc,.sx-parts{grid-template-columns:1fr}.sx-txt{padding:22px}.save{grid-template-columns:1fr}.bwall{gap:8px}.bwall li{height:64px;padding:0 8px}.bwall span{font-size:11.5px}}
`,
  body: R => {
    const L = s => s.startsWith('../') ? R + s.slice(3) : `${R}products/${s}`
    const logos = cat => CLIENTS[cat].slice(0, 5).map(([f, n]) => img(R, `assets/img/clients/${f}.webp`, n, ' loading="lazy"')).join('')
    return `
<section class="bh">
  ${img(R, 'assets/img/dpy/resort-render.webp', '', ` srcset="${R}assets/img/dpy/resort-render-800.webp 800w, ${R}assets/img/dpy/resort-render.webp 1600w" sizes="(max-width:640px) 400px, 100vw" fetchpriority="high"`)}
  <div class="wrap">
    ${crumbsHtml(R, [['For Business']])}
    <span class="kick">For hotels, hospitals &amp; buildings</span>
    <h1 class="thin h1 on-dark">Hot Water Systems<br>Built Around Your Building</h1>
    <p class="lede">We design, supply, install and maintain central hot water systems: heat pumps, storage tanks, pumps and pipes, from one team since 2001.</p>
    <div class="ph-acts"><a class="btn red" href="${R}contact?type=project#quote">Book a free site survey ${I.arr}</a><a class="btn line" href="${R}projects">See our projects</a></div>
    <ul class="ph-stats"><li><b>25</b><small>Years in hot water</small></li><li><b>100+</b><small>Hotel &amp; hospital projects</small></li><li><b>12</b><small>Brands we install</small></li><li><b>5</b><small>Service branches</small></li></ul>
  </div>
</section>

<section class="sec" aria-labelledby="sxT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">By building</span><h2 class="thin h2" id="sxT">What Your Building<br>Needs From Hot Water</h2></div><p class="lede">Every building uses hot water differently. Pick yours to see what we usually install.</p></div>
    <ul class="tabs" role="tablist" aria-label="Building type">${SECTORS.map((s, i) => `<li role="presentation"><button class="chip" role="tab" id="t-${s.k}" aria-controls="p-${s.k}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${s.t}</button></li>`).join('')}</ul>
    <div class="sx">
      <div class="sx-pic">${SECTORS.map((s, i) => img(R, `assets/img/${s.img}.webp`, '', ` class="${i ? '' : 'on'}" data-k="${s.k}" loading="${i ? 'lazy' : 'eager'}"`)).join('')}</div>
      <div class="sx-txt">${SECTORS.map((s, i) => `<div class="sx-panel" role="tabpanel" id="p-${s.k}" aria-labelledby="t-${s.k}"${i ? ' hidden' : ''}>
        <h3>${s.t}</h3><p class="q">The challenge</p><p>${s.need}</p><p class="q b">What we install</p><p>${s.we}</p>
        <ul class="sx-parts">${s.parts.map(([n, u]) => `<li><a href="${L(u)}">${n}${I.arr}</a></li>`).join('')}</ul>
        <div class="sx-logos"><small>Trusted by</small>${logos(s.cl)}</div></div>`).join('')}</div>
    </div>
  </div>
</section>

<section class="sec soft" aria-labelledby="scT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">How it works</span><h2 class="thin h2" id="scT">One System, Four Parts</h2></div><p class="lede">A typical central system for a hotel or hospital. Tap any part to see the equipment we use.</p></div>
    <div class="sch" data-loop data-r>
      <div class="sch-x" data-x><svg viewBox="0 0 1000 440" role="img" aria-labelledby="schT">
        <title id="schT">Diagram: heat pumps and solar panels heat water into a storage tank, a circulation pump sends it to every floor, and cooled water returns to be reheated.</title>
        <defs><linearGradient id="tankFill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4C9BE8"/><stop offset=".55" stop-color="#F08A4B"/><stop offset="1" stop-color="#E3473B"/></linearGradient></defs>
        <!-- pipes -->
        <path class="pipe hot" d="M190 210 H300 V140 H372"/><path class="flow" d="M190 210 H300 V140 H372"/>
        <path class="pipe cold" d="M372 330 H300 V260 H190"/><path class="flow slow" d="M372 330 H300 V260 H190"/>
        <path class="pipe warm" d="M220 70 H330 V160 H372"/><path class="flow slow" d="M220 70 H330 V160 H372"/>
        <path class="pipe hot" d="M488 140 H560 V200 H600"/><path class="flow" d="M488 140 H560 V200 H600"/>
        <path class="pipe hot" d="M690 200 H760 V60 H790"/><path class="flow" d="M690 200 H760 V60 H790"/>
        <path class="pipe hot" d="M760 120 H790 M760 180 H790 M760 240 H790 M760 300 H790"/>
        <path class="pipe cold" d="M950 360 V400 H540 V330 H488"/><path class="flow slow" d="M950 360 V400 H540 V330 H488"/>
        <!-- solar -->
        <a href="${R}products/5-star-solar-water-heater"><g><rect class="box" x="40" y="30" width="180" height="80" rx="14"/><g transform="translate(58 46)"><rect x="0" y="0" width="46" height="30" rx="3" fill="#24477A" class="fin"/><path class="fin" d="M15 0v30M31 0v30M0 15h46"/><circle class="sun" cx="58" cy="6" r="6"/></g><text class="lbl" x="122" y="66">Solar</text><text class="sub" x="122" y="84">optional</text></g></a>
        <!-- heat pump -->
        <a href="${R}products/deron-air-to-water-heat-pump"><g><rect class="box" x="40" y="180" width="150" height="110" rx="14"/><circle cx="82" cy="235" r="26" fill="none" class="fin"/><path class="fin" d="M82 209v52M56 235h52M64 217l36 36M100 217l-36 36" opacity=".7"/><text class="lbl" x="118" y="230">Heat</text><text class="lbl" x="118" y="247">pumps</text><text class="sub" x="118" y="266">Deron</text></g></a>
        <!-- tank -->
        <a href="${R}products/haase-energy-storage-tank"><g><rect class="box" x="372" y="110" width="116" height="250" rx="22"/><rect class="hotfill" x="384" y="122" width="92" height="226" rx="16" opacity=".85"/><text class="lbl" x="430" y="236" text-anchor="middle">Storage</text><text class="lbl" x="430" y="253" text-anchor="middle">tank</text><text class="sub" x="430" y="384" text-anchor="middle" style="fill:#8FA6C0">HAASE · Champion</text></g></a>
        <!-- pump -->
        <a href="${R}products/wilo-pumps"><g><rect class="box" x="600" y="160" width="90" height="80" rx="40"/><circle cx="645" cy="200" r="20" fill="none" class="fin"/><path d="M637 188l18 12-18 12z" fill="#7CC0FF"/><text class="sub" x="645" y="264" text-anchor="middle">Wilo pump</text></g></a>
        <!-- building -->
        <g><rect class="box" x="790" y="30" width="160" height="330" rx="14"/>${[0, 1, 2, 3, 4].map(i => `<g transform="translate(806 ${44 + i * 60})"><rect width="128" height="44" rx="8" fill="rgba(255,255,255,.04)" class="fin"/><circle class="tap" cx="22" cy="22" r="5"/><circle class="tap" cx="42" cy="22" r="5"/><circle class="tap" cx="62" cy="22" r="5"/><text class="sub" x="78" y="26">Floor ${5 - i}</text></g>`).join('')}</g>
      </svg></div>
      <p class="swipe">Swipe to see the whole system.</p>
      <div class="leg"><span><i style="background:#E3473B"></i>Hot water</span><span><i style="background:#F08A4B"></i>Solar heat</span><span><i style="background:#4C9BE8"></i>Return to be reheated</span></div>
      <div class="sch-steps">
        <div><em>01 · HEAT</em><b>Heat pumps</b><p>Move heat from the air into the water, using about a quarter of the power of electric heaters.</p></div>
        <div><em>02 · STORE</em><b>Storage tank</b><p>Holds enough hot water for your busiest hour, ready before the morning rush.</p></div>
        <div><em>03 · MOVE</em><b>Circulation pump</b><p>Keeps hot water moving in a loop, so every tap on every floor runs hot in seconds.</p></div>
        <div><em>04 · RETURN</em><b>Return loop</b><p>Cooled water flows back to the tank to be reheated. Nothing is wasted down the drain while you wait.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="prT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">How we work</span><h2 class="thin h2" id="prT">From Survey to<br>Service, One Team</h2></div><p class="lede">You deal with the same company from the first site visit to the tenth maintenance check.</p></div>
    <ol class="proc">${STEPS.map(([t, d]) => `<li data-r><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="sec soft" aria-labelledby="brT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Brands</span><h2 class="thin h2" id="brT">Equipment We<br>Supply &amp; Install</h2></div><p class="lede">From Germany, Australia and beyond, chosen for Philippine conditions and backed by our own spare parts.</p></div>
    <ul class="bwall">${[['deron.jpg', 'Deron'], ['haase.jpg', 'HAASE'], ['enermax.jpg', 'Enermax'], ['champion.jpg', 'Champion'], ['wilo.png', 'Wilo'], ['5star.jpg', '5 Star'], ['', 'AQUAPOWER'], ['', 'RHEEM'], ['', 'EVERHOT'], ['', 'ROTEX'], ['', 'GRUNDFOS'], ['', 'MY-PV']].map(([f, n]) => `<li data-r>${f ? img(R, 'assets/img/logos/' + f, n, ' loading="lazy"') : `<span>${n}</span>`}</li>`).join('')}</ul>
  </div>
</section>

<section class="sec tight" aria-label="Savings">
  <div class="wrap"><div class="save" data-r><div><b>How much could a heat pump save your building?</b><p>Move one slider to compare a year of running costs for electric heaters, heat pumps and solar, at your electricity rate.</p></div><a class="btn" href="${R}#savings">Try the savings calculator ${I.arr}</a></div></div>
</section>`
  },
  js: `
const tabs = $$('[role=tab]'), panels = $$('.sx-panel'), pics = $$('.sx-pic img')
function show(i, focus) {
  tabs.forEach((t, j) => { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1 })
  panels.forEach((p, j) => { p.hidden = i !== j; if (i === j && !RM) p.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.7,0,1)' }) })
  pics.forEach((p, j) => { if (i === j) p.loading = 'eager'; p.classList.toggle('on', i === j) })
  if (focus) tabs[i].focus()
}
tabs.forEach((t, i) => { t.addEventListener('click', () => show(i)); t.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); show((i + d + tabs.length) % tabs.length, true) } }) })
`,
}
