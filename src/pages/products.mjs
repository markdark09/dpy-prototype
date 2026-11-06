import { PRODUCTS, CATS, card, crumbsHtml, img, I, MSGR, specTable, prodImg, SITE } from '../../tools/lib.mjs'
import { howto } from '../howto.mjs'

const css = `
.pd{padding-bottom:80px}
.pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,80px);align-items:center}
/* the product on a glass plinth, under a soft spotlight (same staging as the homepage hero) */
.stage{position:relative;height:clamp(380px,40vw,520px);display:flex;align-items:flex-end;justify-content:center;padding-bottom:70px}
.stage .halo{position:absolute;left:50%;top:46%;width:min(120%,620px);aspect-ratio:1/.9;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;background:radial-gradient(closest-side,rgba(255,255,255,.98),rgba(232,242,252,.7) 45%,rgba(255,255,255,0) 72%)}
.stage .halo::after{content:"";position:absolute;inset:8%;border-radius:50%;background:radial-gradient(closest-side,rgba(95,168,236,.35),rgba(95,168,236,0) 70%)}
.stage .plinth{position:absolute;left:50%;bottom:42px;width:70%;height:44px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.35) 60%,rgba(255,255,255,0))}
.stage .floor{position:absolute;left:50%;bottom:56px;width:48%;height:20px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(1,30,70,.3),rgba(1,30,70,0))}
.stage .main{position:relative;z-index:1;max-height:88%;max-width:80%;width:auto;object-fit:contain;filter:drop-shadow(0 26px 22px rgba(1,30,70,.2));animation:pdIn 1.2s var(--ease) both}
.stage .main.photo{max-height:92%;border-radius:22px;filter:drop-shadow(0 26px 30px rgba(1,30,70,.18))}
@keyframes pdIn{from{opacity:0;transform:translateY(30px) scale(.96)}}
.stage .noimg{position:relative;z-index:1;align-self:center;display:grid;place-items:center;width:260px;height:260px;border-radius:50%;background:#fff;box-shadow:var(--sh);font-size:30px;font-weight:800;letter-spacing:.1em;color:#3A4655}
.stage .noimg small{display:block;margin-top:6px;text-align:center;font-size:11px;letter-spacing:.06em;font-weight:600;color:var(--mute)}
.pd .kick{margin-bottom:12px}
.pd h1{font-size:clamp(2.1rem,3.8vw,3.3rem)}
.pd .lede{margin-top:16px;font-size:16px;color:var(--ink2)}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:26px 0 0}
.facts div{padding:14px 14px 12px;border-radius:18px;background:#fff;box-shadow:var(--card)}
.facts b{display:block;font-size:clamp(18px,1.8vw,22px);font-weight:600;letter-spacing:-.03em;line-height:1.15}
.facts span{display:block;margin-top:2px;font-size:12px;color:var(--mute)}
.best{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:18px 0 0;padding:0;list-style:none;font-size:12.5px}
.best li{padding:5px 11px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-weight:600;color:var(--ink2)}
.best li:first-child{background:none;box-shadow:none;padding-left:0;color:var(--mute);font-weight:600}
.pd .ph-acts{margin-top:26px;align-items:center}
.pd .ph-acts .addq{height:46px;padding:0 18px;font-size:13.5px;white-space:nowrap}
.pd .pd-msg{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px;font-size:12.5px;color:var(--mute)}
/* features */
/* how it works: the diagram (same style as For Business), its numbered steps, and how to use it */
.how-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:center}
.how-vis{margin:0;padding:clamp(12px,2vw,22px);border-radius:28px;background:linear-gradient(180deg,#0B1D38,#0A1830);box-shadow:0 40px 80px -50px rgba(1,20,50,.8)}
.how-vis svg{display:block;width:100%;height:auto;overflow:visible}
.how-img{margin:0;padding:14px;border-radius:28px;background:#fff;box-shadow:var(--card)}.how-img img{display:block;width:100%;height:auto;border-radius:18px}
.how-img figcaption{margin:10px 4px 0;font-size:13px;color:var(--mute)}
.how-vis .leg{display:flex;flex-wrap:wrap;gap:14px;margin:10px 4px 0;font-size:12.5px;color:#9DB0C6}
.how-vis .leg span{display:inline-flex;align-items:center;gap:8px}.how-vis .leg i{width:22px;height:5px;border-radius:4px}
.how-vis .pipe{fill:none;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.how-vis .cold{stroke:#4C9BE8}.how-vis .hot{stroke:#E3473B}.how-vis .warm{stroke:#F08A4B}.how-vis .ref{stroke:#B79CFF;stroke-width:5}.how-vis .green{stroke:#3CC48A}.how-vis .pow{stroke:#FFC24D;stroke-width:4}.how-vis .air{stroke:#9DB0C6;stroke-width:3}
.how-vis .flow{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-dasharray:2 16;opacity:.7;animation:hwflow 1.6s linear infinite}
.how-vis .flow.slow{animation-duration:2.6s}
@keyframes hwflow{to{stroke-dashoffset:-36}}
.how-vis .box,.how-vis .shell{fill:#132B4E;stroke:rgba(255,255,255,.22);stroke-width:2}
.how-vis .part,.how-vis .ring{fill:#1B3A66;stroke:#7CC0FF;stroke-width:2}
.how-vis .tri{fill:#7CC0FF}
.how-vis .needle{stroke:#fff;stroke-width:3;stroke-linecap:round}
.how-vis .coil{fill:none;stroke:url(#hwCoil);stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.how-vis .coil.hotc{stroke:#FFD2A8}
.how-vis .fix{fill:none;stroke:#C9D6E4}.how-vis .fix .drops{stroke:#7CC0FF}
.how-vis .fin{stroke:rgba(255,255,255,.35);stroke-width:2}
.how-vis .fanb path{fill:none;stroke:#C9D6E4;stroke-width:4;stroke-linecap:round}.how-vis .hub{fill:#C9D6E4}
.how-vis .spin{animation:hwspin 3s linear infinite}
@keyframes hwspin{to{transform:rotate(360deg)}}
.how-vis .sunb circle{fill:#FFC24D}.how-vis .sunb path{stroke:#FFC24D;stroke-width:3;stroke-linecap:round}
.how-vis .panel{fill:#24477A;stroke:#7CC0FF;stroke-width:2}.how-vis .roof{stroke:rgba(255,255,255,.25);stroke-width:3}
.how-vis .pool{fill:#1E6FB8;stroke:#7CC0FF;stroke-width:2}.how-vis .wave{fill:none;stroke:#BFE3FF;stroke-width:3}
.how-vis .one{fill:none;stroke:#7CC0FF;stroke-width:2;stroke-dasharray:8 8}
.how-vis .floor{fill:rgba(255,255,255,.05);stroke:rgba(255,255,255,.2)}
.how-vis .pp{fill:#E8EEF4;stroke:#9DB0C6}.how-vis .sock{fill:#C9D6E4}.how-vis .fuse{fill:#F08A4B}.how-vis .tool{fill:#B3262B;stroke:#FFB3A3;stroke-width:2}
.how-vis .arrow{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.how-vis .house{fill:#132B4E;stroke:#C9D6E4;stroke-width:2}
.how-vis .steam{fill:none;stroke:#9DB0C6;stroke-width:3;stroke-linecap:round;opacity:.7}
.how-vis .t{font:600 22px var(--font);fill:#fff}.how-vis .s{font:500 18px var(--font);fill:#9DB0C6}
.how-vis .mk circle{fill:#fff;transition:fill .3s}.how-vis .mk text{font:700 19px var(--font);fill:#0A1830;text-anchor:middle;dominant-baseline:central;transition:fill .3s}
.how-vis .mk{cursor:pointer}.how-vis .mk.on circle{fill:#E3262B}.how-vis .mk.on text{fill:#fff}
.how-steps{list-style:none;margin:0;padding:0;display:grid;gap:8px;counter-reset:hw}
.how-steps li{position:relative;padding:14px 16px 14px 60px;border-radius:18px;cursor:default;transition:background .3s}
.how-steps li::before{counter-increment:hw;content:counter(hw);position:absolute;left:16px;top:14px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:700;background:var(--ink);color:#fff;transition:background .3s}
.how-steps li.on{background:var(--soft)}.how-steps li.on::before{background:var(--red)}
.how-steps b{display:block;font-size:16.5px;font-weight:600;letter-spacing:-.01em}
.how-steps p{margin:4px 0 0;font-size:15px;line-height:1.55;color:var(--ink2)}
.use{display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,2fr);gap:32px;margin-top:56px;padding-top:40px;border-top:1px solid var(--line)}
.use-hd h3{margin:8px 0 0;font-size:24px;font-weight:600;letter-spacing:-.02em}
.use-hd p{margin:10px 0 0;font-size:14px;line-height:1.55;color:var(--mute)}
.use-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;counter-reset:us}
.use-steps li{padding:18px;border-radius:18px;background:#fff;box-shadow:var(--card)}
.use-steps li::before{counter-increment:us;content:"Step " counter(us);display:block;margin-bottom:6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}
.use-steps b{display:block;font-size:16px;font-weight:600}
.use-steps p{margin:4px 0 0;font-size:14.5px;line-height:1.55;color:var(--ink2)}
@media (prefers-reduced-motion:reduce){.how-vis .flow,.how-vis .spin{animation:none}}
@media (max-width:980px){.how-grid,.use{grid-template-columns:minmax(0,1fr)}.use{gap:16px}}
@media (max-width:640px){.use-steps{grid-template-columns:minmax(0,1fr)}.how-steps li{padding-left:56px}.use{margin-top:40px;padding-top:30px}}
.feats{display:grid;grid-template-columns:repeat(12,1fr);gap:16px;counter-reset:f}
/* rows always fill: 3 a row by default, 1 card full width, 2 as halves, 4 cards in one row, 5 as 3 + 2, 7 as 4 + 3 */
.feats > .ft-c{grid-column:span 4}
.feats > .ft-c:only-child{grid-column:1/-1}
.feats > .ft-c:first-child:nth-last-child(2),.feats > .ft-c:first-child:nth-last-child(2) ~ .ft-c{grid-column:span 6}
.feats > .ft-c:first-child:nth-last-child(4),.feats > .ft-c:first-child:nth-last-child(4) ~ .ft-c{grid-column:span 3}
.feats > .ft-c:first-child:nth-last-child(5) ~ .ft-c:nth-child(n+4){grid-column:span 6}
.feats > .ft-c:first-child:nth-last-child(7),.feats > .ft-c:first-child:nth-last-child(7) ~ .ft-c:nth-child(-n+4){grid-column:span 3}
.ft-c{position:relative;padding:22px 22px 20px;border-radius:22px;background:#fff;box-shadow:var(--card);counter-increment:f}
.ft-c::before{content:counter(f,decimal-leading-zero);display:block;margin-bottom:12px;font-size:13px;font-weight:700;letter-spacing:.06em;background:linear-gradient(90deg,var(--sky),var(--red));-webkit-background-clip:text;background-clip:text;color:transparent}
.ft-c h3{margin:0 0 6px;font-size:17px;font-weight:600;letter-spacing:-.02em;line-height:1.3}
.ft-c p{margin:0;font-size:14px;line-height:1.55;color:var(--mute)}
/* specs */
.specs-note{margin:0 0 26px;font-size:13px;color:var(--mute)}
.fig{margin:0;border-radius:24px;overflow:hidden;background:#fff;box-shadow:var(--card)}
.fig img{width:100%}
.fig figcaption{padding:14px 18px;font-size:13px;color:var(--mute)}
/* the promise strip */
.prom{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.prom div{display:flex;gap:12px;align-items:flex-start;padding:18px;border-radius:20px;background:rgba(255,255,255,.7);box-shadow:inset 0 0 0 1px rgba(255,255,255,.9)}
.prom i{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff}
.prom i svg{width:15px;height:15px}
.prom b{display:block;font-size:14.5px;font-weight:600;line-height:1.3}
.prom span{font-size:14px;color:var(--mute);line-height:1.45}
.rel{grid-template-columns:repeat(4,1fr)}
/* phones: a quote bar that stays in reach */
.qbar{display:none}
@media (max-width:980px){.pd-grid{grid-template-columns:1fr}.stage{height:360px;order:-1;margin-top:-10px}.feats,.prom{grid-template-columns:1fr 1fr}.feats > .ft-c{grid-column:auto!important}.feats > .ft-c:last-child:nth-child(odd){grid-column:1/-1!important}.rel{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.feats,.prom{grid-template-columns:1fr}.feats > .ft-c:last-child:nth-child(odd){grid-column:auto!important}.facts{gap:8px}.facts div{padding:12px 10px}.facts b{font-size:17px}.rel{grid-template-columns:1fr}.stage{height:300px;padding-bottom:56px}.stage .plinth{bottom:30px}.stage .floor{bottom:44px}
  .qbar{position:fixed;left:calc(12px + env(safe-area-inset-left,0px));right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:50;display:flex;gap:8px;padding:8px;border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 18px 40px -14px rgba(1,20,50,.45),0 0 0 1px var(--line);transform:translateY(calc(100% + 24px + env(safe-area-inset-bottom,0px)));transition:transform .5s var(--ease)}
  /* off: fully below the home bar, and out of the keyboard order */
  .qbar:not(.on){visibility:hidden;transition:transform .5s var(--ease),visibility 0s .5s}
  .qbar.on{transform:none}.qbar .btn{flex:1;height:44px}.qbar .tel{flex:none;width:44px;padding:0}
  .foot{padding-bottom:90px}}
`

function pg(p) {
  const c = CATS[p.cat], src = prodImg(p)
  const rel = PRODUCTS.filter(x => x !== p && x.cat === p.cat).concat(PRODUCTS.filter(x => x !== p && x.cat !== p.cat && x.for.some(f => p.for.includes(f)))).slice(0, 4)
  const tables = (p.specs || []).map(k => specTable(k)).join('') + (p.table ? specTable(null, p.table) : '')
  return {
    path: 'products/' + p.slug, nav: 'water-heaters', cta: 'product',
    title: `${p.name} | ${c.t.replace(/^./, x => x.toUpperCase())}`,
    desc: `${p.short} Supplied, installed and serviced by DPY Mercantile across the Philippines. Free site visit and quote.`.slice(0, 300),
    crumbs: [['Water Heaters', 'water-heaters'], [c.t.replace(/^./, x => x.toUpperCase()), `water-heaters?type=${p.cat}`], [p.name]],
    ogImage: src || undefined,
    ld: [{ '@type': 'Product', name: p.name, brand: { '@type': 'Brand', name: p.brand }, category: c.t, description: p.short, ...(src ? { image: SITE + src } : {}), url: SITE + 'products/' + p.slug }],
    css,
    body: R => `
<section class="phead pd">
  <span class="glow${p.cat === 'heatpump' || p.cat === 'solar' ? ' warm' : ''}"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Water Heaters', 'water-heaters'], [c.t.replace(/^./, x => x.toUpperCase()), `water-heaters?type=${p.cat}`], [p.name]])}
    <div class="pd-grid">
      <div>
        <span class="kick">${p.brand} · ${c.s}${p.sub ? ' · ' + p.sub : ''}</span>
        <h1 class="thin">${p.name}</h1>
        <p class="lede">${p.short}</p>
        <div class="facts">${p.key.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
        <ul class="best"><li>Best for</li>${p.best.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="ph-acts"><a class="btn red" href="${R}contact?add=${p.slug}#quote" data-quote-now="${p.slug}" data-name="${p.name}" data-img="${src}" data-cat="${p.cat}">Get a quote for this ${I.arr}</a><button class="addq" type="button" data-add="${p.slug}" data-name="${p.name}" data-img="${src}" data-cat="${p.cat}" aria-pressed="false">${I.plus}<span class="of">Add to quote list</span><span class="on">In your quote list</span></button><button class="cmpb wide" type="button" data-cmp="${p.slug}" data-name="${p.name}" data-img="${src}" aria-pressed="false">${I.cmp}<span class="of">Compare</span><span class="on">Comparing</span></button></div>
        <div class="pd-msg">Questions first? ${MSGR}<a class="msgr" style="background:var(--ink)" href="tel:+639338672954">${I.tel}Call</a></div>
      </div>
      <div class="stage"><span class="halo"></span><span class="floor"></span><span class="plinth"></span>${src ? img(R, src, p.name, ` class="main${p.photo ? ' photo' : ''}" fetchpriority="high"`) : `<span class="noimg"><span>${p.brand.toUpperCase()}<small>Photo to follow</small></span></span>`}</div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="whyT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Why choose it</span><h2 class="thin h2" id="whyT">What You Get</h2></div>${p.warranty ? `<p class="lede"><b style="color:var(--ink)">Warranty:</b> ${p.warranty}.</p>` : `<p class="lede">Every unit is genuine, installed by our own technicians and backed by our after-sales team.</p>`}</div>
    <div class="feats">${p.feats.map(([t, d]) => `<div class="ft-c" data-r><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
${(h => h ? `
<section class="sec how" aria-labelledby="hwT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">How it works</span><h2 class="thin h2" id="hwT">${h.title[0]}<br>${h.title[1]}</h2></div><p class="lede">${h.lede}</p></div>
    <div class="how-grid">
      ${h.image ? `<figure class="how-img">${img(R, `assets/img/dpy/${h.image[0]}.webp`, h.image[1], ' loading="lazy"')}<figcaption>${h.image[1]}</figcaption></figure>` : `<figure class="how-vis" data-loop>${h.svg}${h.legendHtml ? `<figcaption class="leg">${h.legendHtml}</figcaption>` : ''}</figure>`}
      <ol class="how-steps">${h.steps.map(([t, d], i) => `<li data-n="${i + 1}"><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
    </div>
    <div class="use">
      <div class="use-hd"><span class="kick">How to use it</span><h3>${p.cat === 'pipe' ? 'How we install it' : 'Day to day'}</h3><p>General guidance. Your technician shows you the exact settings at installation, and the manual has the details.</p></div>
      <ol class="use-steps">${h.use.map(([t, d]) => `<li><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
    </div>
  </div>
</section>` : '')(howto(p))}
${tables ? `
<section class="sec soft" id="specs" aria-labelledby="spT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Specifications</span><h2 class="thin h2" id="spT">Sizes &amp; Specs</h2></div><p class="lede">From the manufacturer's spec sheets. Not sure which size? We'll work it out at your free site visit.</p></div>
    ${tables}
  </div>
</section>` : ''}${p.diagram && !howto(p)?.image ? `
<section class="sec${tables ? '' : ' soft'}" aria-labelledby="dgT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">How it fits in</span><h2 class="thin h2" id="dgT">Part of a Complete System</h2></div><p class="lede">We design the whole system around the tank: heat sources, pumps and pipes.</p></div>
    <figure class="fig" data-r>${img(R, `assets/img/dpy/${p.diagram[0]}.webp`, p.diagram[1], ' loading="lazy"')}<figcaption>${p.diagram[1]}</figcaption></figure>
  </div>
</section>` : ''}${p.gallery ? `
<section class="sec${tables ? '' : ' soft'}" aria-labelledby="glT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">The range</span><h2 class="thin h2" id="glT">Models &amp; Sizes</h2></div></div>
    <figure class="fig" data-r>${img(R, `assets/img/dpy/${p.gallery}.webp`, p.name + ' models', ' loading="lazy"')}</figure>
  </div>
</section>` : ''}
<section class="sec ice" aria-label="Our promise">
  <div class="wrap prom">
    <div data-r><i>${I.ck}</i><span><b>Free site visit</b>We check your space and size it right</span></div>
    <div data-r><i>${I.ck}</i><span><b>Installed by our team</b>Our own technicians, tested on the day</span></div>
    <div data-r><i>${I.ck}</i><span><b>Genuine units</b>Supplied direct${p.warranty ? ', with warranty' : ''}</span></div>
    <div data-r><i>${I.ck}</i><span><b>Serviced for years</b>Repairs and maintenance from 5 branches</span></div>
  </div>
</section>

<section class="sec" aria-labelledby="rlT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Also consider</span><h2 class="thin h2" id="rlT">Related Products</h2></div><span style="display:flex;gap:18px;flex-wrap:wrap"><a class="link" href="${R}compare?p=${[p, ...rel.filter(x => x.cat === p.cat)].slice(0, 3).map(x => x.slug).join(',')}">Compare with similar ${I.arr}</a><a class="link" href="${R}water-heaters">See all products ${I.arr}</a></span></div>
    <div class="grid rel">${rel.map(x => card(x, R)).join('')}</div>
  </div>
</section>
<div class="qbar" aria-hidden="true"><a class="btn red" href="${R}contact?add=${p.slug}#quote" tabindex="-1">Get a quote for this</a><a class="btn ghost tel" href="tel:+639338672954" aria-label="Call" tabindex="-1">${I.tel}</a></div>`,
    js: `
// "Get a quote for this": add it to the quote list first, so the contact page lists it
$('[data-quote-now]').addEventListener('click', e => { const d = e.currentTarget.dataset; quote.add(d.quoteNow, d.name, d.img, d.cat) })
// phones: the quote bar slides up once the main buttons scroll away
const bar = $('.qbar'), acts = $('.pd .ph-acts'), qb = () => { const on = acts.getBoundingClientRect().bottom < 0; bar.classList.toggle('on', on); document.body.classList.toggle('qbar-on', on) }
addEventListener('scroll', qb, { passive: true }); qb()
// how it works: a step and its marker light together; while on screen the steps play in order until someone points at one
{
  const hv = $('.how-vis')
  if (hv) {
    const lis = $$('.how-steps li'), mks = $$('.mk', hv), RM = matchMedia('(prefers-reduced-motion: reduce)').matches
    let n = 0, timer = 0, touched = false
    const on = k => { lis.forEach(l => l.classList.toggle('on', l.dataset.n === k)); mks.forEach(m => m.classList.toggle('on', m.dataset.n === k)) }
    const stop = () => { clearInterval(timer); timer = 0 }
    const pick = k => { touched = true; stop(); on(k) }
    lis.forEach(l => { l.addEventListener('pointerenter', () => pick(l.dataset.n)); l.addEventListener('click', () => pick(l.dataset.n)) })
    mks.forEach(m => { m.addEventListener('pointerenter', () => pick(m.dataset.n)); m.addEventListener('click', () => pick(m.dataset.n)) })
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !touched && !RM && !timer) { on(String(n % lis.length + 1)); timer = setInterval(() => { n++; on(String(n % lis.length + 1)) }, 2600) }
      else if (!e.isIntersecting) stop()
    }, { threshold: .4 }).observe(hv)
  }
}
`,
  }
}
export default PRODUCTS.map(pg)
