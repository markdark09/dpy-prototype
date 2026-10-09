import { crumbsHtml, img, I, BRANCHES } from '../../tools/lib.mjs'

// from dpymi.com.ph/dpy-mercantile, /gratek-smart-water-corp and /awards; registration numbers left out on purpose
const TIME = [
  ['2001', 'DPY Mercantile begins', 'Mr. Danilo P. Yap sets up DPY Mercantile in August 2001 to supply quality water heaters for homes, businesses and industry.'],
  ['2011', 'DPY Mercantile, Inc.', 'On May 27, 2011 the business becomes a corporation, to grow into a leading supplier of water heaters, heat exchangers and after-sales service.'],
  ['Gratek', 'A company for homes', 'Gratek Smart Water Corp. is formed to serve homeowners, condo developers and resorts with water heaters and hassle-free service.'],
  ['2021', 'Golden Globe awardee', 'DPY is named an awardee of the Golden Globe Annual Awards for Business Excellence.'],
  ['Today', 'Five branches, twelve brands', 'Sales and service from Manila, Boracay, Iloilo, Cebu and Davao, with partners from Germany, Australia and beyond.'],
]
const VALUES = [['P', 'Professionalism', 'We do the job right, on time, and stand behind it.'], ['R', 'Respect', 'For our customers, our partners and each other.'], ['I', 'Integrity', 'Honest advice, even when the right heater is the cheaper one.'], ['Z', 'Zeal', 'We care about getting hot water right, every time.'], ['E', 'Excellence', 'World-class products, installed to a high standard.']]

export default {
  path: 'about', nav: 'about',
  title: 'About DPY Mercantile & Gratek Smart Water',
  desc: 'Since 2001, DPY Mercantile Inc. and Gratek Smart Water Corp. have supplied, installed and serviced water heaters for homes, hotels and hospitals across the Philippines.',
  crumbs: [['About']],
  css: `
.ab-photo{position:relative;margin-top:48px;border-radius:30px;overflow:hidden;aspect-ratio:1600/538;box-shadow:var(--sh)}
.ab-photo img{width:100%;height:100%;object-fit:cover}
.ab-photo figcaption{position:absolute;left:16px;bottom:14px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.92);font-size:12px;font-weight:600}
.intro{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.intro p{margin:0 0 16px;font-size:17px;line-height:1.65;color:var(--ink2)}
.intro > div:first-child p:first-child::first-letter{float:left;font-size:64px;line-height:.9;font-weight:300;margin:6px 10px 0 0;color:var(--red)}
/* timeline: a thin cold-to-hot rail */
.tl{position:relative;list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.tl::before{content:"";position:absolute;left:0;right:0;top:9px;height:2px;background:linear-gradient(90deg,var(--sky),#FF8A3D 60%,var(--red2));opacity:.6}
.tl li{position:relative;padding-top:34px}
.tl li::before{content:"";position:absolute;left:0;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px var(--blue),0 0 0 5px rgba(95,168,236,.18)}
.tl li:nth-child(3)::before{box-shadow:inset 0 0 0 3px #FF8A3D,0 0 0 5px rgba(255,138,61,.18)}
.tl li:nth-child(n+4)::before{box-shadow:inset 0 0 0 3px var(--red2),0 0 0 5px rgba(227,38,43,.15)}
.tl em{display:block;font-style:normal;font-size:28px;font-weight:300;letter-spacing:-.03em}
.tl b{display:block;margin:4px 0 6px;font-size:15.5px;font-weight:600}
.tl p{margin:0;font-size:13.5px;line-height:1.55;color:var(--mute)}
/* two companies */
.duo{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.co{display:flex;flex-direction:column;gap:12px;padding:30px;border-radius:26px;background:#fff;box-shadow:var(--card)}
.co img.lg{height:48px;width:auto;align-self:flex-start}
.co .k{font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}
.co.g .k{color:var(--red)}
.co h3{margin:0;font-size:24px;font-weight:600;letter-spacing:-.03em}
.co p{margin:0;font-size:14.5px;line-height:1.6;color:var(--ink2)}
.co ul{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.co li{font-size:12px;font-weight:600;padding:5px 11px;border-radius:999px;background:#F4F7FA}
.co .link{margin-top:auto;align-self:flex-start}
/* mission & values */
.mv{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:56px}
.mv div{padding:28px;border-radius:24px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.mv h3{margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#7CC0FF}
.mv p,.mv li{font-size:16px;line-height:1.6;color:#E3ECF6}
.mv p{margin:0}.mv ul{margin:0;padding-left:20px;display:grid;gap:6px}
.prize{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.prize div{padding:22px 18px;border-radius:22px;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);transition:background .4s}
.prize div:hover{background:rgba(255,255,255,.08)}
.prize em{display:block;font-style:normal;font-size:56px;font-weight:200;line-height:1;letter-spacing:-.04em;background:linear-gradient(180deg,#fff,#5FA8EC);-webkit-background-clip:text;background-clip:text;color:transparent}
.prize b{display:block;margin:10px 0 4px;font-size:15px;font-weight:600}
.prize span{font-size:13px;color:#9DB0C6;line-height:1.5}
.award{display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;padding:28px 30px;border-radius:26px;background:linear-gradient(120deg,#FFF8E8,#FFFFFF);box-shadow:var(--card)}
.award .medal{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#FFE9A8,#E2A93B 60%,#B97A16);box-shadow:0 10px 24px -10px rgba(185,122,22,.7)}
.award .medal svg{width:34px;height:34px;color:#fff}
.award b{display:block;font-size:19px;font-weight:600;letter-spacing:-.02em}
.award p{margin:4px 0 0;font-size:14px;color:var(--mute)}
.legit{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.legit span{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-size:13px;font-weight:600}
.legit svg{width:14px;height:14px;color:#1E9E55}
.join{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:30px;border-radius:26px;background:#fff;box-shadow:var(--card)}
.join b{display:block;font-size:22px;font-weight:600;letter-spacing:-.02em}
.join p{margin:6px 0 0;color:var(--mute);font-size:14.5px}
@media (max-width:980px){.intro,.duo,.mv{grid-template-columns:1fr}.tl{grid-template-columns:1fr;gap:0}.tl::before{left:7px;right:auto;top:0;bottom:0;width:2px;height:auto;background:linear-gradient(180deg,var(--sky),#FF8A3D 60%,var(--red2))}.tl li{padding:0 0 28px 40px}.tl li::before{top:6px}.prize{grid-template-columns:1fr 1fr}.award{grid-template-columns:auto 1fr}.award .btn{grid-column:1/-1;justify-self:start}}
@media (max-width:640px){.ab-photo{aspect-ratio:4/3}.join{grid-template-columns:1fr}.co{padding:24px}.prize div:last-child{grid-column:1/-1}}
`,
  body: R => `
<section class="phead">
  <span class="glow warm"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['About']])}
    <div class="ph-grid">
      <div><span class="kick">About us</span><h1 class="thin h1">25 Years of<br>Hot Water Done Right</h1><p class="lede">DPY Mercantile Inc. and its home company, Gratek Smart Water Corp., supply, install and service water heaters for homes, hotels and hospitals across the Philippines.</p></div>
      <ul class="ph-stats"><li><b>2001</b><small>Founded</small></li><li><b>5</b><small>Branches</small></li><li><b>12</b><small>Brands</small></li></ul>
    </div>
    <figure class="ab-photo">${img(R, 'assets/img/dpy/team.webp', 'The DPY Mercantile team', ' fetchpriority="high"', '(max-width:1240px) 100vw, 1128px')}<figcaption>The DPY team</figcaption></figure>
  </div>
</section>

<section class="sec" aria-label="Who we are">
  <div class="wrap intro">
    <div data-r><p>DPY Mercantile was set up in 2001 by Mr. Danilo P. Yap with one aim: to supply the most complete range of quality water heaters for homes, businesses and industry in the Philippines.</p><p>Partnerships with manufacturers from Germany, Australia and beyond give us the technology and the technical support to solve real engineering problems, and to recommend the most cost-effective system for each client.</p></div>
    <div data-r><p>What sets us apart is what happens after the sale. Our own technicians install every system, and our after-sales team keeps it running, from a single condo shower to a hospital's round-the-clock supply.</p><p>Everything we do follows world-class quality standards, and the same five values our team has worked by from the start.</p><div class="legit"><span>${I.ck}Registered with DTI and SEC</span><span>${I.ck}Incorporated 2011</span><span>${I.ck}Golden Globe awardee 2021</span></div></div>
  </div>
</section>

<section class="sec soft" aria-labelledby="tlT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Our story</span><h2 class="thin h2" id="tlT">From One Business<br>to Two Companies</h2></div></div>
    <ol class="tl">${TIME.map(([y, t, d]) => `<li data-r><em>${y}</em><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="sec" id="gratek" aria-labelledby="duoT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Two companies, one team</span><h2 class="thin h2" id="duoT">DPY for Buildings,<br>Gratek for Homes</h2></div><p class="lede">Whichever you call, you get the same engineers, the same brands and the same after-sales service.</p></div>
    <div class="duo">
      <article class="co" data-r><img class="lg" src="${R}assets/brand/dpy-logo.svg" alt="DPY Mercantile Inc." width="150" height="48" loading="lazy"><span class="k">Projects &amp; commercial</span><h3>DPY Mercantile Inc.</h3><p>Hot water systems for hotels, hospitals, condo towers and industry: heat pumps, storage and heat exchange tanks, pumps and pipes, designed and installed as one system.</p><ul><li>Deron</li><li>HAASE</li><li>Enermax</li><li>Champion</li><li>Wilo</li><li>Grundfos</li></ul><a class="link" href="${R}business">Hot water for buildings ${I.arr}</a></article>
      <article class="co g" data-r>${img(R, 'assets/brand/gratek-logo.png', 'Gratek Smart Water Corp.', ' class="lg" loading="lazy"')}<span class="k">Homes &amp; retail</span><h3>Gratek Smart Water Corp.</h3><p>"Your one-stop hub for hot water at home." Instant, storage and solar water heaters for homeowners, condo developers and resorts, with free consultation, on-site inspection, repairs and preventive maintenance.</p><ul><li>Rheem</li><li>Everhot</li><li>Aquapower</li><li>5 Star</li><li>Aquaplast</li><li>Katen</li></ul><a class="link" href="${R}water-heaters?for=home">Water heaters for homes ${I.arr}</a></article>
    </div>
  </div>
</section>

<section class="sec dark" aria-labelledby="mvT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">What drives us</span><h2 class="thin h2" id="mvT">Mission, Vision<br>&amp; Values</h2></div></div>
    <div class="mv">
      <div data-r><h3>Our mission</h3><ul><li>We provide world-class products and systems.</li><li>We build partnerships with established global brands to meet growing market demand.</li><li>We develop our people into a reliable, professional, service-minded team.</li></ul></div>
      <div data-r><h3>Our vision</h3><p>To be the most trusted and sought-after name in water heating systems, innovation and technical service in the Philippines.</p></div>
    </div>
    <div class="prize">${VALUES.map(([l, t, d]) => `<div data-r><em>${l}</em><b>${t}</b><span>${d}</span></div>`).join('')}</div>
  </div>
</section>

<section class="sec" aria-label="Award and careers">
  <div class="wrap" style="display:grid;gap:20px">
    <div class="award" data-r><span class="medal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4 6.8 19.2l1-5.9L3.5 9.2l5.9-.8z"/></svg></span><div><b>Golden Globe Annual Awards for Business Excellence, 2021</b><p>A joint undertaking of the National Data Research Examiner and Marketing Services Inc., SINAG News Magazine and SINAG Foundation.</p></div></div>
    <div class="join" data-r><div><b>Grow with us</b><p>We see our people as our most valuable asset. We're hiring in Manila and Cebu.</p></div><a class="btn" href="${R}careers">See open roles ${I.arr}</a></div>
  </div>
</section>`,
}
