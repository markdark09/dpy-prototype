import { PRODUCTS, CATS, card, crumbsHtml, img, I, MSGR, specTable, prodImg, SITE } from '../../tools/lib.mjs'

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
.pd .ph-acts .addq{height:46px;padding:0 18px;font-size:13.5px}
.pd .msg{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px;font-size:12.5px;color:var(--mute)}
/* features */
.feats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;counter-reset:f}
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
.prom span{font-size:12.5px;color:var(--mute);line-height:1.45}
.rel{grid-template-columns:repeat(4,1fr)}
/* phones: a quote bar that stays in reach */
.qbar{display:none}
@media (max-width:980px){.pd-grid{grid-template-columns:1fr}.stage{height:360px;order:-1;margin-top:-10px}.feats,.prom{grid-template-columns:1fr 1fr}.rel{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.feats,.prom{grid-template-columns:1fr}.facts{gap:8px}.facts div{padding:12px 10px}.facts b{font-size:17px}.rel{grid-template-columns:1fr}.stage{height:300px;padding-bottom:56px}.stage .plinth{bottom:30px}.stage .floor{bottom:44px}
  .qbar{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;gap:8px;padding:8px;border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 18px 40px -14px rgba(1,20,50,.45),0 0 0 1px var(--line);transform:translateY(140%);transition:transform .5s var(--ease)}
  .qbar.on{transform:none}.qbar .btn{flex:1;height:44px}.qbar .tel{flex:none;width:44px;padding:0}
  .foot{padding-bottom:90px}}
`

function pg(p) {
  const c = CATS[p.cat], src = prodImg(p)
  const rel = PRODUCTS.filter(x => x !== p && x.cat === p.cat).concat(PRODUCTS.filter(x => x !== p && x.cat !== p.cat && x.for.some(f => p.for.includes(f)))).slice(0, 4)
  const tables = (p.specs || []).map(k => specTable(k)).join('') + (p.table ? specTable(null, p.table) : '')
  return {
    path: 'products/' + p.slug, nav: 'water-heaters',
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
        <div class="ph-acts"><a class="btn red" href="${R}contact?add=${p.slug}#quote" data-quote-now="${p.slug}" data-name="${p.name}" data-img="${src}" data-cat="${p.cat}">Get a quote for this ${I.arr}</a><button class="addq" type="button" data-add="${p.slug}" data-name="${p.name}" data-img="${src}" data-cat="${p.cat}" aria-pressed="false">${I.plus}<span class="of">Add to quote list</span><span class="on">In your quote list</span></button></div>
        <div class="msg">Questions first? ${MSGR}<a class="msgr" style="background:var(--ink)" href="tel:+639338672954">${I.tel}Call</a></div>
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
${tables ? `
<section class="sec soft" id="specs" aria-labelledby="spT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Specifications</span><h2 class="thin h2" id="spT">Sizes &amp; Specs</h2></div><p class="lede">From the manufacturer's spec sheets. Not sure which size? We'll work it out at your free site visit.</p></div>
    ${tables}
  </div>
</section>` : ''}${p.diagram ? `
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
    <div class="sec-head"><div><span class="kick">Also consider</span><h2 class="thin h2" id="rlT">Related Products</h2></div><a class="link" href="${R}water-heaters">See all products ${I.arr}</a></div>
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
`,
  }
}
export default PRODUCTS.map(pg)
