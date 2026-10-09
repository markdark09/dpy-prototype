import { BRANCHES, PRODUCTS, crumbsHtml, I, MSGR, img, prodImg } from '../../tools/lib.mjs'

const INTEREST = [['instant', 'Instant'], ['storage', 'Storage'], ['heatpump', 'Heat pump'], ['solar', 'Solar'], ['tank', 'Tanks & pumps'], ['unsure', 'Not sure yet']]
export default {
  path: 'contact', nav: 'contact',
  title: 'Contact Us, Get a Free Quote & Find a Branch',
  desc: 'Get a free water heater quote from DPY Mercantile, call or message our sales and service teams, or visit a branch in Manila, Boracay, Iloilo, Cebu or Davao.',
  crumbs: [['Contact']],
  noCta: true,
  css: `
.ct-top{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(24px,4vw,56px);align-items:start}
.ch{display:grid;gap:12px}
.ch a,.ch div.c{display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:20px;background:#fff;box-shadow:var(--card);transition:transform .5s var(--ease)}
.ch a:hover{transform:translateX(4px)}
.ch i{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--ink)}
.ch i svg{width:17px;height:17px}
.ch small{display:block;font-size:12px;color:var(--mute)}
.ch b{display:block;font-size:16px;font-weight:600;letter-spacing:-.01em}
.ch .msgs{display:flex;gap:8px;flex-wrap:wrap}
.ch .hrs{font-size:13px;color:var(--mute);padding:4px 4px 0}
/* the quote panel */
.qp{position:relative;border-radius:30px;background:#fff;box-shadow:0 40px 80px -50px rgba(1,30,70,.5);overflow:hidden}
.qp-hd{padding:30px 34px 0}
.qp-hd h2{margin:0;font-size:26px;font-weight:600;letter-spacing:-.03em}
.qp-hd p{margin:6px 0 0;font-size:14px;color:var(--mute)}
.qp .ql{margin:20px 34px 0}
.qp .form{padding:24px 34px 34px}
/* branches */
.bx{display:grid;grid-template-columns:.85fr 1.15fr;gap:20px;align-items:stretch}
.bl{list-style:none;margin:0;padding:0;display:grid;gap:10px;align-content:start}
.bl button{width:100%;display:grid;grid-template-columns:auto 1fr;gap:4px 14px;padding:16px 18px;border-radius:20px;text-align:left;background:#fff;box-shadow:var(--card);transition:box-shadow .3s,transform .5s var(--ease)}
.bl button:hover{transform:translateX(3px)}
.bl button[aria-pressed="true"]{box-shadow:inset 0 0 0 2px var(--ink),var(--card)}
.bl .n{grid-row:1/3;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:var(--soft)}
.bl button[aria-pressed="true"] .n{background:var(--red);color:#fff}
.bl b{font-size:16px;font-weight:600}
.bl b small{margin-left:8px;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--blue)}
.bl span.a{font-size:13px;color:var(--mute);line-height:1.45}
.bl .also b{font-size:inherit;font-weight:700;color:var(--ink2)}
.bl .also{padding:14px 18px;border-radius:20px;background:rgba(255,255,255,.6);font-size:13px;color:var(--mute)}
.map{position:relative;min-height:460px;border-radius:26px;overflow:hidden;background:#DCE6F0;box-shadow:var(--card)}
.map iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.map .ld{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;color:var(--mute)}
.map-card{position:absolute;left:14px;right:14px;bottom:14px;z-index:1;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.97);box-shadow:var(--sh)}
.map-card b{display:block;font-size:15px;font-weight:600}
.map-card span{font-size:12.5px;color:var(--mute)}
.map-card .acts{display:flex;gap:8px}
@media (max-width:980px){.ct-top,.bx{grid-template-columns:1fr}.ch{grid-template-columns:1fr 1fr}.ch .hrs{grid-column:1/-1}}
@media (max-width:640px){.ch{grid-template-columns:1fr}.qp-hd{padding:24px 22px 0}.qp .ql{margin:18px 16px 0}.qp .form{padding:20px 22px 26px}.map{min-height:380px}}
`,
  body: R => `
<section class="phead" style="padding-bottom:40px">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Contact']])}
    <span class="kick">Contact us</span>
    <h1 class="thin h1">Let's Get Your<br>Hot Water Sorted</h1>
    <p class="lede">Ask for a free quote, book a site visit, or just ask a question. Call, message or write: whichever is easiest for you.</p>
  </div>
</section>

<section class="sec" id="quote" style="padding-top:30px;background:linear-gradient(180deg,var(--ice-bg),#fff 420px)">
  <div class="wrap ct-top">
    <div class="ch">
      <a href="tel:+639338672954"><i>${I.tel}</i><span><small>Sales · call or text</small><b>0933 867 2954</b></span></a>
      <a href="tel:+639152453528"><i>${I.tel}</i><span><small>Sales · call or text</small><b>0915 245 3528</b></span></a>
      <a href="tel:+639564160815"><i>${I.tel}</i><span><small>Customer service &amp; repairs</small><b>0956 416 0815</b></span></a>
      <a href="tel:+63279560521"><i>${I.tel}</i><span><small>Head office telefax</small><b>(02) 7956 0521</b></span></a>
      <a href="mailto:sales@dpymi.com.ph?subject=Quote%20request"><i>${I.mail}</i><span><small>Quotes &amp; projects</small><b>sales@dpymi.com.ph</b></span></a>
      <a href="mailto:service@dpymi.com.ph?subject=Service%20request"><i>${I.mail}</i><span><small>Repairs &amp; maintenance</small><b>service@dpymi.com.ph</b></span></a>
      <div class="c"><span class="msgs">${MSGR}</span></div>
      <p class="hrs">${I.clock.replace('<svg', '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px;margin-right:6px"')}Monday to Saturday, 8:00 AM to 5:00 PM</p>
    </div>
    <div class="qp" data-r>
      <div class="qp-hd"><h2>Request a free quote</h2><p>Tell us about your building. We'll recommend the right system, visit if needed, and send a written quotation. No cost, no obligation.</p></div>
      <div class="ql" data-ql hidden><h3>Your quote list <button type="button" class="clr">Clear</button></h3><ul></ul><p class="more"><a class="link" href="${R}water-heaters">Add more products ${I.arr}</a></p></div>
      <form class="form" data-mail="sales@dpymi.com.ph" data-subject="Free quote request" novalidate>
        <input type="hidden" name="products" data-label="Products in quote list">
        <div><label for="qN">Full name <i>*</i></label><input id="qN" name="fullname" autocomplete="name" required></div>
        <div><label for="qP">Mobile number <i>*</i></label><input id="qP" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09XX XXX XXXX" required></div>
        <div><label for="qE">Email</label><input id="qE" name="email" type="email" autocomplete="email" placeholder="you@email.com"></div>
        <div><label for="qC">Company <span style="font-weight:400;color:var(--mute)">(for projects)</span></label><input id="qC" name="company" autocomplete="organization"></div>
        <div class="full"><span class="lb" id="qtB">Type of building</span><div class="qchips" role="group" aria-labelledby="qtB" data-group="Building">${['Condo', 'House', 'Hotel / Resort', 'Hospital', 'Commercial', 'Other'].map(v => `<label><input type="radio" name="building" value="${v}"><span>${v}</span></label>`).join('')}</div></div>
        <div class="full"><span class="lb" id="qtI">Interested in</span><div class="qchips" role="group" aria-labelledby="qtI" data-group="Interested in">${INTEREST.map(([k, v]) => `<label><input type="checkbox" name="interest" value="${v}" data-k="${k}"><span>${v}</span></label>`).join('')}</div></div>
        <div><label for="qB">Nearest branch</label><select id="qB" name="branch">${BRANCHES.map(b => `<option>${b.n}</option>`).join('')}<option>Other area</option></select></div>
        <div><label for="qS">Number of showers / bathrooms</label><input id="qS" name="showers" inputmode="numeric" placeholder="e.g. 3"></div>
        <div class="full"><label for="qM">Anything else?</label><textarea id="qM" name="msg" placeholder="Replacing an old heater? New building? Tell us a bit more."></textarea></div>
        <label class="ok"><input type="checkbox" name="consent" required><span>I agree that DPY may contact me about my request and use these details as described in the <a href="${R}privacy">privacy notice</a>.</span></label>
        <div class="f-sub"><small>Sent to our sales team at sales@dpymi.com.ph. We never sell your details or send spam.</small><button class="btn red" type="submit">Request my free quote ${I.arr}</button></div>
        <div class="f-done" role="status"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><h3>Thank you<span class="who"></span>!</h3><p>Your email app has opened with your request. Just press send, and our team will call you to arrange your free site visit.</p><button class="btn ghost again" type="button">Edit my request</button></div>
      </form>
    </div>
  </div>
</section>

<section class="sec soft" id="branches" aria-labelledby="brT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Branches</span><h2 class="thin h2" id="brT">Visit a Branch<br>Near You</h2></div><p class="lede">Five branches from Luzon to Mindanao, each with its own sales and service team. Open Monday to Saturday, 8 AM to 5 PM.</p></div>
    <div class="bx">
      <ul class="bl">${BRANCHES.map((b, i) => `<li><button type="button" data-i="${i}" aria-pressed="${!i}"><span class="n">0${i + 1}</span><b>${b.n}<small>${b.rg}</small></b><span class="a">${b.a}</span></button></li>`).join('')}<li class="also">Our products are also sold in <b>Baguio City</b> and <b>Tagaytay</b>.</li></ul>
      <div class="map"><span class="ld">Loading the map…</span><iframe title="Map of the selected branch" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="map-card"><div><b class="mn"></b><span class="ma"></span></div><div class="acts"><a class="btn red sm dir" href="https://www.google.com/maps/dir/?api=1&amp;destination=${BRANCHES[0].ll.join(',')}" target="_blank" rel="noopener">Directions ${I.arr}</a><a class="btn ghost sm" href="tel:+639338672954" aria-label="Call">${I.tel}</a></div></div></div>
    </div>
  </div>
</section>`,
  js: R => `
/* ---------- the quote list, and anything passed in the address (from the finder or a product page) ---------- */
const PROD = ${JSON.stringify(Object.fromEntries(PRODUCTS.map(p => [p.slug, [p.name, prodImg(p), p.cat]])))}
const form = $('.qp form'), qs = new URLSearchParams(location.search)
// "Get a quote for this" links pass ?add=<product>; the list itself is drawn by site.js
const pa = PROD[qs.get('add')]; if (pa) quote.add(qs.get('add'), pa[0], pa[1], pa[2])
const bld = qs.get('building'); if (bld) $$('input[name=building]', form).forEach(r => r.checked = r.value === bld)
const it = qs.get('interest'); if (it) { const c = $('input[data-k="' + it + '"]', form); if (c) c.checked = true }
const sh = qs.get('showers'); if (sh) form.showers.value = { '1': '1', '2-3': '2 to 3', '4-10': '4 to 10', '10+': 'More than 10' }[sh] || ''
if (qs.get('note')) form.msg.value = qs.get('note')
if (qs.get('type') === 'project') { form.msg.placeholder = 'Tell us about the project: building type, number of rooms or floors, and your timeline.'; $('.qp-hd h2').textContent = 'Book a free site survey' }

/* ---------- branches: a Google map of the chosen office (no key needed for this embed) ---------- */
const BR = ${JSON.stringify(BRANCHES)}
const btns = $$('.bl button'), fr = $('.map iframe')
function pick(i) {
  const b = BR[i]; btns.forEach((x, j) => x.setAttribute('aria-pressed', i === j))
  fr.src = 'https://maps.google.com/maps?q=' + b.ll.join(',') + '&z=16&output=embed'
  $('.mn').textContent = 'DPY ' + b.n + (i ? '' : ' · Head office'); $('.ma').textContent = b.a
  $('.dir').href = 'https://www.google.com/maps/dir/?api=1&destination=' + b.ll.join(',')
}
btns.forEach((b, i) => b.addEventListener('click', () => pick(i)))
// load the map only when the section comes near (saves data on phones)
addEventListener('load', () => new IntersectionObserver(([e], o) => { if (e.isIntersecting) { pick(0); o.disconnect() } }, { rootMargin: '200px' }).observe($('.map')))
fr.addEventListener('load', () => $('.map .ld').remove(), { once: true })
`,
}
