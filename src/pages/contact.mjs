import { BRANCHES, PRODUCTS, crumbsHtml, I, MSGR, img, prodImg, BRMAP, BRMAP_CSS } from '../../tools/lib.mjs'

const INTEREST = [['instant', 'Instant'], ['storage', 'Storage'], ['heatpump', 'Heat pump'], ['solar', 'Solar'], ['tank', 'Tanks & pumps'], ['unsure', 'Not sure yet']]
export default {
  path: 'contact', nav: 'contact',
  title: 'Contact Us, Get a Free Quote & Find a Branch',
  desc: 'Get a free water heater quote from DPY Mercantile, call or message our sales and service teams, or visit a branch in Manila, Boracay, Iloilo, Cebu or Davao.',
  crumbs: [['Contact']],
  noCta: true,
  scripts: ['assets/js/branches.js'],
  css: `
/* ways to reach us: one row of cards */
.ch{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ch b{overflow-wrap:anywhere}
.ch a,.ch div.c{display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:20px;background:#fff;box-shadow:var(--card);transition:transform .5s var(--ease)}
.ch a:hover{transform:translateX(4px)}
.ch i{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--ink)}
.ch i svg{width:17px;height:17px}
.ch small{display:block;font-size:13px;color:var(--mute)}
.ch b{display:block;font-size:16px;font-weight:600;letter-spacing:-.01em}
.ch b a{color:inherit}.ch b a:hover{color:var(--red)}
.ch .msgs{display:flex;gap:8px;flex-wrap:wrap}
.ch .hrs{grid-column:1/-1;font-size:14px;color:var(--mute);padding:4px 4px 0}
/* the quote panel: the same two-panel form as the homepage and the Service page, in the sales red */
.qp{display:grid;grid-template-columns:.8fr 1.2fr;border-radius:30px;background:#fff;box-shadow:0 40px 80px -50px rgba(1,30,70,.5);overflow:hidden;overflow:clip}
.qp-side{position:relative;padding:44px 38px;color:#fff;background:radial-gradient(90% 70% at 0% 0%,#E3262B 0%,rgba(227,38,43,0) 60%),linear-gradient(160deg,#C70A0E 0%,#7A0F2E 45%,#0A1830 100%);overflow:hidden}
.qp-side::after{content:"";position:absolute;right:-90px;bottom:-90px;width:300px;height:300px;border-radius:50%;border:1px solid rgba(255,255,255,.14);box-shadow:0 0 0 40px rgba(255,255,255,.03),0 0 0 80px rgba(255,255,255,.02);pointer-events:none}
.qp-side .kick{color:#FFC9C2}
.qp-side h2{margin:0;font-size:clamp(2rem,3.2vw,2.7rem);font-weight:300;letter-spacing:-.035em;line-height:1.08}
.qp-side h2 b{font-weight:600}
.qp-side > p{margin:14px 0 26px;font-size:15px;line-height:1.55;color:rgba(255,255,255,.85);max-width:380px}
.qp-pro{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.qp-pro li{display:flex;gap:12px;align-items:flex-start;font-size:14px;line-height:1.45}
.qp-pro li::before{content:"";flex:none;width:22px;height:22px;margin-top:-1px;border-radius:50%;background:rgba(255,255,255,.16) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'%3E%3Cpath d='M6.5 11.3l3 3 6-6.6' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/22px no-repeat}
.qp-pro b{display:block;font-weight:600}
.qp-pro span{color:rgba(255,255,255,.75)}
.qp-call{position:relative;z-index:1;display:flex;align-items:center;gap:12px;margin-top:28px;padding-top:22px;border-top:1px solid rgba(255,255,255,.16);font-size:13px;color:rgba(255,255,255,.8)}
.qp-call i{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--red)}
.qp-call i svg{width:18px;height:18px}
.qp-call .nums{display:block;color:#fff;font-size:18px;font-weight:600;letter-spacing:-.01em}
.qp-call a{color:#fff}.qp-call a:hover{text-decoration:underline}
.qp-msg{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
.qp-main{position:relative;min-width:0}
.qp .ql{margin:30px 34px 0}
.qp .form{padding:30px 34px 34px}
${BRMAP_CSS}
@media (max-width:980px){.qp{grid-template-columns:1fr}.qp-side{padding:34px 26px}.ch{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.ch{grid-template-columns:1fr}.qp .ql{margin:18px 16px 0}.qp .form{padding:20px 22px 26px}}
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

<section class="sec tight" aria-label="Ways to reach us" style="padding-top:30px;background:linear-gradient(180deg,var(--ice-bg),#fff 420px)">
  <div class="wrap">
    <div class="ch">
      <a href="tel:+639564160815"><i>${I.tel}</i><span><small>Customer service &amp; repairs</small><b>0956 416 0815</b></span></a>
      <a href="tel:+63279560521"><i>${I.tel}</i><span><small>Head office telefax</small><b>(02) 7956 0521</b></span></a>
      <a href="mailto:sales@dpymi.com.ph?subject=Quote%20request"><i>${I.mail}</i><span><small>Quotes &amp; projects</small><b>sales@dpymi.com.ph</b></span></a>
      <a href="mailto:service@dpymi.com.ph?subject=Service%20request"><i>${I.mail}</i><span><small>Repairs &amp; maintenance</small><b>service@dpymi.com.ph</b></span></a>
      <p class="hrs">${I.clock.replace('<svg', '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px;margin-right:6px"')}Monday to Saturday, 8:00 AM to 5:00 PM</p>
    </div>
  </div>
</section>

<section class="sec" id="quote" aria-labelledby="qpT" style="padding-top:20px">
  <div class="wrap">
    <div class="qp" data-r>
      <div class="qp-side">
        <span class="kick">Free quote</span>
        <h2 id="qpT">Request a<br><b>free quote</b></h2>
        <p>Tell us about your building. We'll recommend the right system, visit if needed, and send a written quotation. No cost, no obligation.</p>
        <ul class="qp-pro">
          <li><div><b>Free site visit &amp; sizing</b><span>Our team checks your space and hot water needs</span></div></li>
          <li><div><b>Written quotation</b><span>Units, installation and parts, itemized</span></div></li>
          <li><div><b>Supplied, installed &amp; serviced</b><span>One team from quote to after-sales</span></div></li>
        </ul>
        <div class="qp-call"><i>${I.tel}</i><div>Prefer to talk? Call or text<span class="nums"><a href="tel:+639338672954">0933 867 2954</a> / <a href="tel:+639152453528">0915 245 3528</a></span></div></div>
        <div class="qp-msg">${MSGR}</div>
      </div>
      <div class="qp-main">
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
  </div>
</section>

<section class="sec soft" id="branches" aria-labelledby="brT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Branches</span><h2 class="thin h2" id="brT">Visit a Branch<br>Near You</h2></div><p class="lede">Five branches from Luzon to Mindanao, each with its own sales and service team. Pick one to fly in and see the office from the street.</p></div>
    ${BRMAP}
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
if (qs.get('type') === 'project') { form.msg.placeholder = 'Tell us about the project: building type, number of rooms or floors, and your timeline.'; $('.qp-side h2').innerHTML = 'Book a free<br><b>site survey</b>' }


`,
}
