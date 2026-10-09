import { PRODUCTS, CATS, card, crumbsHtml, img, I, prodImg } from '../../tools/lib.mjs'

const TYPES = [ // the four ways to heat water, compared in plain terms (meters: 1 = low, 3 = high)
  { k: 'instant', img: 'aquapower-a35', t: 'Instant', how: 'Heats water as it flows', ready: 'In seconds, no waiting', taps: 1, up: 1, run: 2, space: 'Smallest: fits beside the shower', best: 'Condos, single bathrooms' },
  { k: 'storage', img: 'rheem', t: 'Electric storage', how: 'Heats and stores a tank', ready: 'Always, until the tank runs low', taps: 2, up: 2, run: 2, space: 'A tank on the wall or floor', best: 'Family homes, several taps' },
  { k: 'heatpump', img: 'heatpump-5star', t: 'Heat pump', how: 'Moves heat from the air', ready: 'Always, from a tank', taps: 3, up: 3, run: 1, space: 'Outdoor unit or tall tank', best: 'Hotels, hospitals, big homes' },
  { k: 'solar', img: 'solar-5star', t: 'Solar', how: 'Heated by the sun', ready: 'Always, with electric backup', taps: 2, up: 3, run: 1, space: 'Panels and tank on the roof', best: 'Sunny roofs, resorts' },
]
const meter = (n, label, low) => `<span class="mt" role="img" aria-label="${label}: ${['low', 'medium', 'high'][n - 1]}"><i class="${n >= 1 ? 'f' : ''}"></i><i class="${n >= 2 ? 'f' : ''}"></i><i class="${n >= 3 ? 'f' : ''}"></i><em>${low ? ['Low', 'Medium', 'High'][n - 1] : ['1 or 2', 'Several', 'A whole building'][n - 1]}</em></span>`
const ORDER = ['instant', 'storage', 'heatpump', 'solar', 'tank', 'pump', 'pipe', 'control', 'fan']

export default {
  path: 'water-heaters', nav: 'water-heaters',
  title: 'Water Heaters, Heat Pumps & Solar Heaters',
  desc: 'Every water heater DPY and Gratek supply: instant, storage, heat pump and solar, plus tanks, pumps and pipes. Compare types, see specs and get a free quote.',
  crumbs: [['Water Heaters']],
  css: `
.lineup{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:clamp(6px,1.4vw,18px);height:300px;padding:0 10px 34px}
.lineup::before{content:"";position:absolute;left:4%;right:4%;bottom:18px;height:40px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.3) 60%,rgba(255,255,255,0))}
.lineup::after{content:"";position:absolute;left:14%;right:14%;bottom:28px;height:16px;border-radius:50%;background:radial-gradient(closest-side,rgba(1,30,70,.22),rgba(1,30,70,0))}
.lineup img{position:relative;z-index:1;width:auto;filter:drop-shadow(0 18px 16px rgba(1,30,70,.18));transition:transform .8s var(--ease)}
.lineup img:hover{transform:translateY(-8px)}
.lineup .a{height:150px}.lineup .b{height:210px}.lineup .c{height:250px}.lineup .d{height:170px}
/* type cards */
.types{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ty{position:relative;display:flex;flex-direction:column;text-align:left;padding:18px;border-radius:24px;background:#fff;box-shadow:var(--card);transition:transform .6s var(--ease),box-shadow .6s}
.ty:hover{transform:translateY(-5px)}
.ty[aria-pressed="true"]{box-shadow:inset 0 0 0 2px var(--ink),var(--card)}
.ty .ph{height:150px;display:grid;place-items:end center;border-radius:18px;background:radial-gradient(70% 70% at 50% 45%,#fff,#E6EFF8)}
.ty .ph img{max-height:132px;width:auto;margin-bottom:6px;transition:transform .7s var(--ease)}
.ty:hover .ph img{transform:translateY(-6px)}
.ty b{display:block;margin:14px 0 2px;font-size:18px;font-weight:600;letter-spacing:-.02em}
.ty small{display:block;font-size:13px;line-height:1.45;color:var(--mute)}
.ty .n{position:absolute;right:16px;top:16px;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;background:#fff;color:var(--ink2);box-shadow:var(--sh-s)}
/* compare table */
.cmp{margin-top:26px;border-radius:24px;background:#fff;box-shadow:var(--card);overflow:hidden}
.cmp table{width:100%;border-collapse:collapse;font-size:13.5px}
.cmp th,.cmp td{padding:14px 16px;text-align:left;border-bottom:1px solid var(--line);vertical-align:middle}
.cmp tr:last-child > *{border-bottom:0}
.cmp thead th{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--blue);background:#F7FAFD}
.cmp tbody th{width:170px;font-size:12.5px;font-weight:700;color:var(--mute)}
.mt{display:inline-flex;align-items:center;gap:3px}
.mt i{width:16px;height:6px;border-radius:4px;background:#E3EAF1}
.mt i.f{background:linear-gradient(90deg,var(--sky),var(--blue))}
.run .mt i.f,.up .mt i.f{background:linear-gradient(90deg,#FFB08F,var(--red2))}
.mt em{margin-left:8px;font-style:normal;font-size:12.5px;font-weight:600;color:var(--ink2)}
.run .mt.low i.f{background:linear-gradient(90deg,#8FD9AE,#1E9E55)}
/* catalogue */
.cat-bar{position:sticky;top:0;z-index:20;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:14px 0;margin-bottom:26px;background:linear-gradient(180deg,#F4F7FA 80%,rgba(244,247,250,0));transition:top .6s var(--ease)}
.nav:not(.up) ~ main .cat-bar{top:76px}
.seg{display:inline-flex;gap:2px;padding:4px;border-radius:999px;background:#E4E9EE}
.seg button{height:32px;padding:0 14px;border-radius:999px;font-size:12.5px;font-weight:600;color:var(--ink2);transition:background .3s,color .3s}
.seg button[aria-pressed="true"]{background:#fff;color:var(--ink);box-shadow:0 2px 8px -4px rgba(0,0,0,.25)}
.cat-grid{grid-template-columns:repeat(4,1fr)}
.pc[hidden]{display:none}
.cat-empty{padding:40px;text-align:center;color:var(--mute)}
.cat-count{font-size:13px;color:var(--mute)}
/* finder */
.finder{display:grid;grid-template-columns:1.1fr .9fr;gap:30px;align-items:center;padding:clamp(26px,4vw,48px);border-radius:30px;color:#fff;background:radial-gradient(70% 90% at 100% 100%,rgba(199,10,14,.5),transparent 70%),radial-gradient(60% 80% at 0% 0%,rgba(13,104,195,.55),transparent 70%),linear-gradient(160deg,#06264D,#0A1830)}
.finder h2{margin:0}
.finder p{margin:14px 0 24px;color:#A9C2DE;max-width:440px}
.finder ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.finder ol li{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font-size:14px}
.finder ol i{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:700;background:#fff;color:var(--ink)}
/* finder dialog */
.qz{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:20px;background:rgba(6,16,31,.55);opacity:0;pointer-events:none;transition:opacity .35s}
.qz.on{opacity:1;pointer-events:auto}
.qz-box{position:relative;width:min(680px,100%);max-height:calc(100svh - 40px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;border-radius:28px;background:#fff;box-shadow:0 50px 100px -40px rgba(0,0,0,.6);transform:translateY(20px) scale(.98);transition:transform .5s var(--ease)}
.qz.on .qz-box{transform:none}
.qz-top{display:flex;align-items:center;gap:14px;padding:22px 24px 0}
.qz-top .bar{flex:1;height:6px;border-radius:9px;background:#EDF1F5;overflow:hidden}
.qz-top .bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--sky),var(--red));transform-origin:0 50%;transform:scaleX(.25);transition:transform .6s var(--ease)}
.qz-top small{font-size:12px;font-weight:700;color:var(--mute);min-width:34px;text-align:right}
.qz-top button{width:36px;height:36px;border-radius:50%;background:var(--soft);font-size:18px;line-height:1}
.qz-step{padding:24px 28px 28px;animation:qzIn .5s var(--ease) both}
@keyframes qzIn{from{opacity:0;transform:translateX(24px)}}
.qz-step.back{animation-name:qzBack}@keyframes qzBack{from{opacity:0;transform:translateX(-24px)}}
.qz-step h3{margin:0 0 6px;font-size:26px;font-weight:600;letter-spacing:-.03em;line-height:1.15}
.qz-step > p{margin:0 0 20px;font-size:14px;color:var(--mute)}
.qz-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.qz-opts button{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 16px;border-radius:18px;text-align:left;background:#F5F8FB;transition:background .25s,box-shadow .25s,transform .4s var(--ease)}
.qz-opts button:hover{background:#EDF3F9;transform:translateY(-2px)}
.qz-opts button[aria-pressed="true"]{background:#fff;box-shadow:inset 0 0 0 2px var(--ink)}
.qz-opts .e{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#fff;font-size:19px}
.qz-opts b{display:block;font-size:14.5px;font-weight:600}
.qz-opts small{display:block;font-size:12px;color:var(--mute)}
.qz-bk{margin-top:16px;font-size:13.5px;font-weight:600;color:var(--mute);padding:8px 4px}
.qz-res .k{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--red)}
.qz-res h3{margin:6px 0 4px}
.qz-res .why{list-style:none;margin:10px 0 16px;padding:0;display:grid;gap:6px}
.qz-res .why li{display:flex;gap:8px;font-size:13.5px;color:var(--ink2)}
.qz-res .why li::before{content:"✓";color:var(--blue);font-weight:700}
.qz-picks{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:6px 0 16px}
.qz-picks a{display:grid;justify-items:center;gap:6px;padding:12px 10px;border-radius:16px;background:#F5F8FB;text-align:center;font-size:12.5px;font-weight:600;line-height:1.3;transition:background .3s,transform .4s var(--ease)}
.qz-picks a:hover{background:#EDF3F9;transform:translateY(-2px)}
.qz-picks img{height:84px;width:auto}
.qz-also{margin:0 0 14px;padding:12px 14px;border-radius:14px;background:#F5F8FB;font-size:13px;color:var(--ink2)}
.qz-acts{display:flex;flex-wrap:wrap;gap:10px}
html.modal-open{overflow:hidden}
@media (max-width:1180px){.cat-grid{grid-template-columns:repeat(3,1fr)}}
@media (max-width:980px){.types{grid-template-columns:repeat(2,1fr)}.cat-grid{grid-template-columns:repeat(2,1fr)}.finder{grid-template-columns:1fr}.lineup{height:240px}.lineup .a{height:120px}.lineup .b{height:170px}.lineup .c{height:200px}.lineup .d{height:136px}
  .cmp{overflow-x:auto}.cmp table{min-width:760px}.nav:not(.up) ~ main .cat-bar{top:76px}}
@media (max-width:560px){.lineup .d{display:none}.lineup{height:210px}.types{gap:10px}.ty{padding:12px}.ty .ph{height:110px}.ty .ph img{max-height:96px}.ty b{font-size:15.5px}.ty small{font-size:12px}
  .qz{padding:0;align-items:end}.qz-box{border-radius:24px 24px 0 0;max-height:92svh}.qz-opts{grid-template-columns:1fr}.qz-step h3{font-size:22px}.qz-picks{grid-template-columns:1fr 1fr 1fr}.qz-picks img{height:64px}
  .cat-bar{gap:8px}.cat-bar .chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 calc(var(--g) * -1);padding:2px var(--g);width:calc(100% + var(--g) * 2)}.cat-bar .chips li{flex:none}}
`,
  body: R => {
    const counts = Object.fromEntries(ORDER.map(k => [k, PRODUCTS.filter(p => p.cat === k).length]))
    return `
<section class="phead">
  <span class="glow"></span>
  <div class="wrap ph-grid">
    <div>
      ${crumbsHtml(R, [['Water Heaters']])}
      <span class="kick">Our range</span>
      <h1 class="thin h1">Water Heaters &amp;<br>Hot Water Systems</h1>
      <p class="lede">${PRODUCTS.length} products from ${new Set(PRODUCTS.map(p => p.brand)).size} brands, for a single shower or a whole hotel. Every one is supplied, installed and serviced by our own team.</p>
      <div class="ph-acts"><button class="btn red" type="button" data-finder>Help me choose ${I.arr}</button><a class="btn ghost" href="#range">Browse all products</a></div>
    </div>
    <div class="lineup" aria-hidden="true">${img(R, 'assets/img/dpy/aquapower-a35.webp', '', ' class="a"')}${img(R, 'assets/img/dpy/rheem.webp', '', ' class="b"')}${img(R, 'assets/img/dpy/heatpump-5star.webp', '', ' class="c"')}${img(R, 'assets/img/dpy/deron-wizard.webp', '', ' class="d"')}</div>
  </div>
</section>

<section class="sec" id="types" aria-labelledby="tyT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Start here</span><h2 class="thin h2" id="tyT">Four Ways to<br>Heat Water</h2></div><p class="lede">Pick a type to see the models we carry, or compare them side by side below.</p></div>
    <div class="types">${TYPES.map(t => `<button class="ty" type="button" data-type="${t.k}" aria-pressed="false" data-r><span class="n">${counts[t.k]} models</span><span class="ph">${img(R, `assets/img/dpy/${t.img}.webp`, '', ' loading="lazy"')}</span><b>${t.t}</b><small>${CATS[t.k].d}</small></button>`).join('')}</div>
    <div class="cmp" data-r>
      <table>
        <caption class="vh">The four types of water heater compared</caption>
        <thead><tr><th scope="col"><span class="vh">Compare</span></th>${TYPES.map(t => `<th scope="col">${t.t}</th>`).join('')}</tr></thead>
        <tbody>
          <tr><th scope="row">How it heats</th>${TYPES.map(t => `<td>${t.how}</td>`).join('')}</tr>
          <tr><th scope="row">Hot water ready</th>${TYPES.map(t => `<td>${t.ready}</td>`).join('')}</tr>
          <tr><th scope="row">Taps at once</th>${TYPES.map(t => `<td>${meter(t.taps, 'Taps at once')}</td>`).join('')}</tr>
          <tr class="up"><th scope="row">Upfront cost</th>${TYPES.map(t => `<td>${meter(t.up, 'Upfront cost', 1)}</td>`).join('')}</tr>
          <tr class="run"><th scope="row">Running cost</th>${TYPES.map(t => `<td>${meter(t.run, 'Running cost', 1).replace('class="mt"', t.run === 1 ? 'class="mt low"' : 'class="mt"')}</td>`).join('')}</tr>
          <tr><th scope="row">Space needed</th>${TYPES.map(t => `<td>${t.space}</td>`).join('')}</tr>
          <tr><th scope="row">Best for</th>${TYPES.map(t => `<td><b>${t.best}</b></td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec soft" id="range" aria-labelledby="raT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">The full range</span><h2 class="thin h2" id="raT">Every Product<br>We Carry</h2></div><div><p class="lede">Add anything to your quote list as you browse. We'll price it all in one written quotation. Tap ${I.cmp.replace('<svg', '<svg style="display:inline;width:15px;height:15px;vertical-align:-2px"')} to compare up to four.</p><p style="margin:10px 0 0"><a class="link" href="${R}compare">Open the comparison ${I.arr}</a></p></div></div>
    <div class="cat-bar">
      <ul class="chips" aria-label="Filter by type"><li><button class="chip" type="button" data-cat="" aria-pressed="true">All <small>${PRODUCTS.length}</small></button></li>${ORDER.map(k => `<li><button class="chip" type="button" data-cat="${k}" aria-pressed="false">${CATS[k].t.replace(' water heaters', '').replace('Electric storage heaters', 'Storage').replace(/^./, c => c.toUpperCase())} <small>${counts[k]}</small></button></li>`).join('')}</ul>
      <div class="seg" role="group" aria-label="Who it's for"><button type="button" data-for="" aria-pressed="true">Everyone</button><button type="button" data-for="home" aria-pressed="false">For homes</button><button type="button" data-for="business" aria-pressed="false">For business</button></div>
    </div>
    <p class="cat-count" aria-live="polite"></p>
    <div class="grid cat-grid">${ORDER.flatMap(k => PRODUCTS.filter(p => p.cat === k)).map(p => card(p, R)).join('')}</div>
    <p class="cat-empty" hidden>No products match. <button class="link" type="button" data-reset>Show everything</button></p>
  </div>
</section>

<section class="sec" aria-labelledby="fdT">
  <div class="wrap">
    <div class="finder" data-r>
      <div><span class="kick" style="color:#FFC9C2">Not sure?</span><h2 class="thin h2 on-dark" id="fdT">Find the Right<br>Water Heater</h2><p>Answer four quick questions. We'll suggest the type that fits, and the models to look at.</p><button class="btn white" type="button" data-finder>Start the finder ${I.arr}</button></div>
      <ol><li><i>1</i>Where you need hot water</li><li><i>2</i>How many showers</li><li><i>3</i>What matters most to you</li><li><i>4</i>Whether you have a sunny roof</li></ol>
    </div>
  </div>
</section>

<div class="qz" role="dialog" aria-modal="true" aria-label="Find my water heater"><div class="qz-box"><div class="qz-top"><span class="bar"><i></i></span><small class="cnt">1/4</small><button class="x" type="button" aria-label="Close">×</button></div><div class="qz-body"></div></div></div>`
  },
  js: R => `
/* ---------- filters (kept in the address, so a filtered view can be shared) ---------- */
const cards = $$('.cat-grid .pc'), chips = $$('.cat-bar [data-cat]'), segs = $$('.seg button'), tys = $$('.ty'), count = $('.cat-count'), empty = $('.cat-empty')
const NAMES = ${JSON.stringify(Object.fromEntries(Object.entries(CATS).map(([k, v]) => [k, v.t.toLowerCase()])))}
let cat = '', who = ''
function apply(push) {
  let n = 0
  cards.forEach(c => { const on = (!cat || c.dataset.cat === cat) && (!who || c.dataset.for.includes(who)); c.hidden = !on; if (on) { n++; c.classList.add('in') } })
  chips.forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat)); segs.forEach(b => b.setAttribute('aria-pressed', b.dataset.for === who)); tys.forEach(b => b.setAttribute('aria-pressed', b.dataset.type === cat))
  count.textContent = n + (n === 1 ? ' product' : ' products') + (cat ? ' · ' + NAMES[cat] : '') + (who ? (who === 'home' ? ' · for homes' : ' · for business') : '')
  empty.hidden = n > 0
  if (push) { const u = new URL(location); cat ? u.searchParams.set('type', cat) : u.searchParams.delete('type'); who ? u.searchParams.set('for', who) : u.searchParams.delete('for'); u.hash = ''; history.replaceState(null, '', u) }
}
chips.forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; apply(true) }))
segs.forEach(b => b.addEventListener('click', () => { who = b.dataset.for; apply(true) }))
tys.forEach(b => b.addEventListener('click', () => { cat = cat === b.dataset.type ? '' : b.dataset.type; apply(true); go('#range', -70) }))
$('[data-reset]').addEventListener('click', () => { cat = who = ''; apply(true) })
const qs = new URLSearchParams(location.search); cat = NAMES[qs.get('type')] ? qs.get('type') : ''; who = ['home', 'business'].includes(qs.get('for')) ? qs.get('for') : ''
apply(false); if (cat || who) addEventListener('load', () => setTimeout(() => go('#range', -70), 80))

/* ---------- the finder: 4 questions, a type and the models to look at ---------- */
const P = ${JSON.stringify(PRODUCTS.map(p => ({ s: p.slug, n: p.name, c: p.cat, i: prodImg(p), f: p.for })))}
const Q = [
  { k: 'where', h: 'Where do you need hot water?', p: 'Pick the closest match.', o: [['condo', '🏢', 'Condo or apartment', 'A unit in a building'], ['house', '🏠', 'House', 'A family home'], ['hotel', '🏨', 'Hotel or resort', 'Guest rooms, kitchens, pools'], ['hospital', '🏥', 'Hospital or clinic', 'Round-the-clock hot water'], ['commercial', '🏬', 'Commercial', 'Restaurant, gym, office, school']] },
  { k: 'showers', h: 'How many showers or bathrooms need hot water?', p: 'A rough number is fine.', o: [['1', '🚿', 'Just 1', ''], ['2-3', '🚿', '2 to 3', ''], ['4-10', '🚿', '4 to 10', ''], ['10+', '🚿', 'More than 10', 'Whole building']] },
  { k: 'want', h: 'What matters most to you?', p: "Pick one. We'll weigh the rest at your site visit.", o: [['fast', '⚡', 'Hot water instantly', 'And a compact unit'], ['many', '💧', 'Lots of hot water at once', 'Several taps running together'], ['save', '💰', 'Low power bills', 'Running cost over the years'], ['budget', '🏷️', 'Low upfront cost', 'Simple and affordable']] },
  { k: 'roof', h: 'Do you have a sunny roof you can use?', p: 'Solar heaters need a few square meters of open sun.', o: [['yes', '☀️', 'Yes', 'Open roof with good sun'], ['no', '🌥️', 'No', 'Shaded, shared or no roof'], ['unsure', '🤔', 'Not sure', '']] },
]
const T = {
  instant: { t: 'Instant Water Heater', why: ['Hot in seconds, heated as it flows', 'Compact and wall-mounted, with no tank', 'The lowest upfront cost'] },
  storage: { t: 'Electric Storage Water Heater', why: ['A tank of hot water always ready', 'Several showers and taps at once', 'Simple to install in most homes'] },
  heatpump: { t: 'Heat Pump Water Heater', why: ['Moves heat from the air: about a quarter of the power', 'Sized with storage tanks for many showers at once', 'The lowest running cost for big hot water use'] },
  solar: { t: 'Solar Water Heater', why: ['Heated by the sun, with electric backup for cloudy days', 'Cuts the power bill the most for homes', 'Uses the sunny roof you already have'] },
}
function pick(a) {
  const big = a.where === 'hotel' || a.where === 'hospital' || a.showers === '10+' || (a.where === 'commercial' && a.showers !== '1')
  if (big) return ['heatpump', a.roof === 'yes' ? 'solar' : 'storage']
  if (a.want === 'fast' || a.showers === '1' || (a.where === 'condo' && a.want !== 'many')) return ['instant', a.want === 'many' ? 'storage' : (a.roof === 'yes' && a.where !== 'condo' ? 'solar' : 'storage')]
  if (a.want === 'save') return a.roof === 'yes' ? ['solar', 'heatpump'] : ['heatpump', 'storage']
  if (a.showers === '4-10') return a.roof === 'yes' ? ['solar', 'heatpump'] : ['heatpump', 'storage']
  if (a.want === 'budget') return ['storage', 'instant']
  return ['storage', a.roof === 'yes' ? 'solar' : 'heatpump']
}
const box = $('.qz'), body = $('.qz-body', box), bar = $('.qz-top .bar i', box), cnt = $('.qz-top .cnt', box)
let step = 0, ans = {}, opener = null
function render(dir = 1) {
  bar.style.transform = 'scaleX(' + Math.min(1, (step + 1) / Q.length) + ')'; cnt.textContent = step < Q.length ? (step + 1) + '/' + Q.length : 'Done'
  if (step >= Q.length) return result()
  const q = Q[step]
  body.innerHTML = '<div class="qz-step' + (dir < 0 ? ' back' : '') + '"><h3>' + q.h + '</h3><p>' + q.p + '</p><div class="qz-opts">' + q.o.map(([v, e, b, s]) => '<button type="button" data-v="' + v + '" aria-pressed="' + (ans[q.k] === v) + '"><span class="e" aria-hidden="true">' + e + '</span><span><b>' + b + '</b>' + (s ? '<small>' + s + '</small>' : '') + '</span></button>').join('') + '</div>' + (step ? '<button class="qz-bk" type="button">← Back</button>' : '') + '</div>'
  $$('.qz-opts button', body).forEach(b => b.addEventListener('click', () => { ans[q.k] = b.dataset.v; $$('.qz-opts button', body).forEach(x => x.setAttribute('aria-pressed', x === b)); setTimeout(() => { step++; render() }, RM ? 0 : 220) }))
  $('.qz-bk', body)?.addEventListener('click', () => { step--; render(-1) })
  $('.qz-opts button', body).focus({ preventScroll: true })
}
function result() {
  const [a, b] = pick(ans), r = T[a], biz = ['hotel', 'hospital', 'commercial'].includes(ans.where)
  const picks = P.filter(p => p.c === a && (biz ? p.f.includes('business') : p.f.includes('home'))).concat(P.filter(p => p.c === a)).filter((p, i, l) => l.indexOf(p) === i).slice(0, 3)
  const bld = { condo: 'Condo', house: 'House', hotel: 'Hotel / Resort', hospital: 'Hospital', commercial: 'Commercial' }[ans.where]
  const quote = 'contact?building=' + encodeURIComponent(bld) + '&interest=' + encodeURIComponent(a) + '&showers=' + encodeURIComponent(ans.showers) + '&note=' + encodeURIComponent('Finder result: ' + r.t + '. Sunny roof: ' + ans.roof + '.') + '#quote'
  body.innerHTML = '<div class="qz-step qz-res"><span class="k">We recommend</span><h3>' + r.t + '</h3><ul class="why">' + r.why.map(x => '<li>' + x + '</li>').join('') + '</ul><div class="qz-picks">' + picks.map(p => '<a href="${R}products/' + p.s + '">' + (p.i ? '<img src="${R}' + p.i + '" alt="">' : '') + p.n + '</a>').join('') + '</div>' + (biz ? '<p class="qz-also">For ' + bld.toLowerCase() + 's we design the whole system: heaters, storage tanks and pumps, sized to your peak hours. <a class="link" href="${R}business">How we do it</a></p>' : '') + '<p class="qz-also">Also worth a look: <b>' + T[b].t + '</b>. We\\'ll compare both at your free site visit.</p><div class="qz-acts"><a class="btn red" href="${R}' + quote + '">Get a free quote for this ${I.arr.replace(/"/g, '\\"')}</a><button class="btn ghost show" type="button">Show these models</button><button class="btn line again" type="button">Start over</button></div></div>'
  $('.again', body).addEventListener('click', () => { step = 0; ans = {}; render(-1) })
  $('.show', body).addEventListener('click', () => { close(); cat = a; who = ''; apply(true); go('#range', -70) })
  $('.btn.red', body).focus({ preventScroll: true })
}
function open(from) { opener = from; step = 0; ans = {}; box.classList.add('on'); DPY.lock(true); render() }
function close() { box.classList.remove('on'); DPY.lock(false); opener?.focus({ preventScroll: true }) }
$$('[data-finder]').forEach(b => b.addEventListener('click', () => open(b)))
window.DPYquiz = open // the chat's "Find my water heater" opens it here
$('.x', box).addEventListener('click', close); box.addEventListener('click', e => e.target === box && close())
addEventListener('keydown', e => e.key === 'Escape' && box.classList.contains('on') && close())
if (location.hash === '#finder') open()
`,
}
