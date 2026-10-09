import { CLIENTS, crumbsHtml, img, I } from '../../tools/lib.mjs'

const total = Object.values(CLIENTS).flat().length
export default {
  path: 'projects', nav: 'projects',
  title: 'Projects & Clients: Hotels, Hospitals and Buildings',
  desc: 'Hotels, hospitals, residences and restaurants across the Philippines that run on hot water systems supplied and installed by DPY Mercantile and Gratek.',
  crumbs: [['Projects']],
  css: `
.pj-hero{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:200px 200px;gap:14px;margin-top:48px}
.pj-hero figure{position:relative;margin:0;border-radius:22px;overflow:hidden;background:#dfe8f1}
.pj-hero figure:first-child{grid-row:1/3;grid-column:1/3}
.pj-hero img{width:100%;height:100%;object-fit:cover;transition:transform 1.4s var(--ease)}
.pj-hero figure:hover img{transform:scale(1.04)}
.pj-hero figcaption{position:absolute;left:12px;bottom:12px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.92);font-size:12px;font-weight:600;box-shadow:var(--sh-s)}
.lg{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.lg li{display:grid;grid-template-rows:1fr auto;gap:8px;justify-items:center;align-items:center;height:132px;padding:16px 12px 12px;border-radius:18px;background:#fff;box-shadow:var(--card);transition:opacity .45s,transform .6s var(--ease)}
.lg li[hidden]{display:none}
.lg img{max-height:56px;max-width:100%;width:auto;filter:grayscale(1);opacity:.78;transition:filter .4s,opacity .4s}
.lg li:hover img{filter:none;opacity:1}
.lg span{font-size:11.5px;font-weight:600;color:var(--mute);text-align:center;line-height:1.3}
.sect{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:40px}
.sect div{padding:20px;border-radius:20px;background:#fff;box-shadow:var(--card)}
.sect b{display:block;font-size:34px;font-weight:300;letter-spacing:-.04em;line-height:1.1}
.sect span{font-size:13px;color:var(--mute)}
.honest{margin:28px 0 0;font-size:13px;color:var(--mute);text-align:center}
.what{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.what div{padding:24px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.what b{display:block;font-size:17px;font-weight:600;margin:10px 0 6px}
.what p{margin:0;font-size:14px;color:var(--mute);line-height:1.55}
.what em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--blue)}
@media (max-width:1100px){.lg{grid-template-columns:repeat(4,1fr)}}
@media (max-width:980px){.pj-hero{grid-template-columns:1fr 1fr;grid-template-rows:220px 160px 160px}.pj-hero figure:first-child{grid-column:1/3;grid-row:1}.sect{grid-template-columns:1fr 1fr}.what{grid-template-columns:1fr}}
@media (max-width:640px){.lg{grid-template-columns:repeat(2,1fr)}.lg li{height:116px}}
`,
  body: R => `
<section class="phead">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Projects']])}
    <div class="ph-grid">
      <div><span class="kick">Projects &amp; clients</span><h1 class="thin h1">Hot Water for Places<br>People Rely On</h1><p class="lede">Hotels, hospitals, residences and restaurants across the Philippines run on hot water systems we supplied, installed and still maintain.</p></div>
      <ul class="ph-stats"><li><b>${total}</b><small>Clients shown here</small></li><li><b>100+</b><small>Hotel &amp; hospital projects</small></li><li><b>2001</b><small>In business since</small></li></ul>
    </div>
    <div class="pj-hero">
      <figure data-r>${img(R, 'assets/img/dpy/haase-install.webp', 'A HAASE energy storage tank installed by DPY', ' fetchpriority="high"')}<figcaption>HAASE tank installation by DPY</figcaption></figure>
      <figure data-r>${img(R, 'assets/img/dpy/resort-render.webp', 'Resort project', ' loading="lazy"')}<figcaption>Resort project</figcaption></figure>
      <figure data-r>${img(R, 'assets/img/dpy/tower-render.webp', 'Residential tower project', ' loading="lazy"')}<figcaption>Residential tower</figcaption></figure>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="clT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Our clients</span><h2 class="thin h2" id="clT">Trusted Across<br>Every Kind of Building</h2></div><p class="lede">Filter by type of building. These names come from DPY's and Gratek's project references.</p></div>
    <div class="sect">${Object.entries(CLIENTS).map(([k, v]) => `<div data-r><b>${v.length}</b><span>${k}</span></div>`).join('')}</div>
    <ul class="tabs" aria-label="Filter clients"><li><button class="chip" type="button" data-c="" aria-pressed="true">All <small>${total}</small></button></li>${Object.entries(CLIENTS).map(([k, v]) => `<li><button class="chip" type="button" data-c="${k}" aria-pressed="false">${k} <small>${v.length}</small></button></li>`).join('')}</ul>
    <ul class="lg">${Object.entries(CLIENTS).flatMap(([k, v]) => v.map(([f, n]) => `<li data-c="${k}" data-r>${img(R, `assets/img/clients/${f}.webp`, '', ' loading="lazy"')}<span>${n}</span></li>`)).join('')}</ul>
    <p class="honest">Logos belong to their owners and are shown as project references.</p>
  </div>
</section>

<section class="sec soft" aria-labelledby="wdT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">What we do on a project</span><h2 class="thin h2" id="wdT">More Than<br>Supplying Units</h2></div><a class="link" href="${R}business">How we design systems ${I.arr}</a></div>
    <div class="what">
      <div data-r><em>DESIGN</em><b>Sized for the peak hour</b><p>We work with your engineers and contractors to size heaters, tanks and pumps for the busiest morning of the year.</p></div>
      <div data-r><em>INSTALL</em><b>Our own technicians</b><p>Installed, tested and commissioned by DPY's team, with genuine units and spare parts in stock.</p></div>
      <div data-r><em>MAINTAIN</em><b>Years after handover</b><p>Preventive maintenance and repairs from five branches, so the system keeps running at full occupancy.</p></div>
    </div>
  </div>
</section>`,
  js: `
const B = $$('[data-c]').filter(b => b.tagName === 'BUTTON'), L = $$('.lg li')
B.forEach(b => b.addEventListener('click', () => { B.forEach(x => x.setAttribute('aria-pressed', x === b)); L.forEach(l => { l.hidden = !!b.dataset.c && l.dataset.c !== b.dataset.c; l.classList.add('in') }) }))
`,
}
