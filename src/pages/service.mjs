import { BRANCHES, crumbsHtml, img, I, MSGR } from '../../tools/lib.mjs'

// quick checks a customer can safely do before calling (general good practice; the 2 L/min figure is from Aquapower's spec sheet)
const CHECKS = [
  ['No hot water at all', ['Check the breaker for the heater. If it tripped, switch it back on once. If it trips again, leave it off and call us.', 'Check that the heater\'s own switch or power light is on.', 'For a storage heater, give it time: a tank takes 20 to 80 minutes to heat up from cold.']],
  ['The instant heater turns on and off', ['Open the tap a little more. Instant heaters need at least 2 liters a minute to stay on.', 'Clean the shower head and the inlet filter. Scale and dirt cut the flow.', 'If the water pressure in the building is low, a model with a built-in pump (like Gratek Aquarius) may suit you better.']],
  ['Water is only warm', ['Turn the temperature dial or thermostat up a step and wait a few minutes.', 'With an instant heater, a slower flow gives hotter water.', 'With a storage heater, you may be using more hot water than the tank holds. We can size a bigger one.']],
  ['Water leaking from the heater', ['Turn off the power to the heater first, then close its water supply valve.', 'A small drip from the relief valve can be normal while heating. Steady leaking is not.', 'Call our service team. Don\'t open the heater yourself.']],
  ['The breaker keeps tripping', ['Leave the heater switched off. Don\'t keep resetting the breaker.', 'This usually means a worn element or a wiring fault. Our technicians will test it safely.']],
]
const PM = ['Heating element and thermostat tested', 'Safety and pressure relief valves checked', 'Anode rod checked, replaced when worn', 'Tank flushed and descaled', 'Wiring, breaker and earthing checked', 'Flow and temperature measured at the taps', 'Heat pump coils, fans and refrigerant checked', 'A written report of what we found']

export default {
  path: 'service', nav: 'service',
  title: 'Water Heater Repair, Installation & Maintenance',
  desc: 'Book a water heater repair, installation or preventive maintenance visit with DPY Mercantile. Quick checks to try first, and service teams in Manila, Boracay, Iloilo, Cebu and Davao.',
  crumbs: [['Service']],
  css: `
.sv-head{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(24px,5vw,72px);align-items:center}
.sv-photo{position:relative;border-radius:28px;overflow:hidden;aspect-ratio:4/3.2;box-shadow:var(--sh)}
.sv-photo img{width:100%;height:100%;object-fit:cover}
.sv-photo .badge{position:absolute;left:16px;bottom:16px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:16px;background:rgba(255,255,255,.95);font-size:13px;font-weight:600;box-shadow:var(--sh-s)}
.sv-photo .badge i{width:10px;height:10px;border-radius:50%;background:#2BD46A;box-shadow:0 0 0 4px rgba(43,212,106,.2)}
/* three ways in */
.ways{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:-40px;position:relative;z-index:2}
.way{display:flex;flex-direction:column;gap:6px;padding:22px;border-radius:24px;background:#fff;box-shadow:0 30px 60px -40px rgba(1,30,70,.5);transition:transform .6s var(--ease)}
.way:hover{transform:translateY(-5px)}
.way .ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;margin-bottom:8px;color:#fff;background:linear-gradient(135deg,var(--blue),var(--navy))}
.way:nth-child(2) .ic{background:linear-gradient(135deg,#FF8A3D,var(--red))}
.way:nth-child(3) .ic{background:linear-gradient(135deg,#2BB673,#167A42)}
.way .ic svg{width:22px;height:22px}
.way b{font-size:18px;font-weight:600;letter-spacing:-.02em}
.way span{font-size:13.5px;color:var(--mute);line-height:1.5}
.way em{margin-top:auto;padding-top:12px;font-style:normal;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:6px}
.way em svg{width:14px;height:14px}
/* quick checks */
.checks{display:grid;gap:10px}
.checks details{border-radius:18px;background:#fff;box-shadow:var(--card);overflow:hidden}
.checks summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;font-size:15.5px;font-weight:600;cursor:pointer;list-style:none}
.checks summary::-webkit-details-marker{display:none}
.checks summary::after{content:"";flex:none;width:28px;height:28px;border-radius:50%;background:var(--soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%230E1116' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/14px no-repeat;transition:transform .4s var(--ease)}
.checks details[open] summary::after{transform:rotate(180deg)}
.checks ol{margin:0;padding:0 20px 20px 42px;display:grid;gap:8px;font-size:14px;color:var(--ink2)}
.ck-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(24px,5vw,64px);align-items:start}
.safe{margin-top:22px;padding:16px 18px;border-radius:16px;background:#FFF4E5;color:#7A4A00;font-size:13.5px;line-height:1.5}
.safe b{color:#5A3500}
/* maintenance */
.pm{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,64px);align-items:center}
.pm ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pm li{display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:16px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font-size:13.5px;line-height:1.45}
.pm li svg{flex:none;width:18px;height:18px;padding:3px;border-radius:50%;background:#2BB673;color:#fff}
.pm .why{display:grid;gap:14px;margin-top:22px}
.pm .why div{display:flex;gap:14px;align-items:baseline}
.pm .why b{font-size:28px;font-weight:300;letter-spacing:-.03em;color:#fff;min-width:64px}
.pm .why span{font-size:14px;color:#9DB0C6}
/* warranty */
.war{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.war div{padding:22px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.war b{display:block;font-size:17px;font-weight:600;margin-bottom:6px}
.war p{margin:0;font-size:14px;color:var(--mute);line-height:1.55}
/* booking */
.book{display:grid;grid-template-columns:.8fr 1.2fr;border-radius:30px;overflow:hidden;background:#fff;box-shadow:0 40px 80px -50px rgba(1,30,70,.5)}
.book-side{padding:40px 36px;color:#fff;background:radial-gradient(90% 70% at 0% 0%,rgba(43,182,115,.35),transparent 60%),linear-gradient(160deg,#0D3A73,#0A1830)}
.book-side h2{margin:0}
.book-side p{color:#A9C2DE;font-size:14.5px;margin:14px 0 22px}
.book-side ul{list-style:none;margin:0 0 24px;padding:0;display:grid;gap:10px;font-size:14px}
.book-side li{display:flex;gap:10px;align-items:center}
.book-side li svg{width:16px;height:16px;color:#7CE0A8}
.book-side .call{display:block;font-size:20px;font-weight:600;margin-top:2px}
.book-side small{color:#9DB0C6;font-size:12.5px}
.book .form{position:relative;padding:36px}
@media (max-width:980px){.sv-head,.ck-grid,.pm,.book{grid-template-columns:1fr}.ways{grid-template-columns:1fr;margin-top:0}.war{grid-template-columns:1fr}}
@media (max-width:640px){.pm ul{grid-template-columns:1fr}.book-side,.book .form{padding:26px 22px}}
`,
  body: R => `
<section class="phead">
  <span class="glow"></span>
  <div class="wrap sv-head">
    <div>
      ${crumbsHtml(R, [['Service']])}
      <span class="kick">Service &amp; repairs</span>
      <h1 class="thin h1">We Keep the<br>Hot Water Running</h1>
      <p class="lede">Repairs, installation and preventive maintenance for every brand we sell, from our service teams in Manila, Boracay, Iloilo, Cebu and Davao.</p>
      <div class="ph-acts"><a class="btn red" href="#book">Book a service visit ${I.arr}</a><a class="btn ghost" href="#checks">Try these quick checks first</a></div>
    </div>
    <div class="sv-photo">${img(R, 'assets/img/technician.webp', 'A DPY technician servicing a water heater', ' fetchpriority="high"', '(max-width:980px) 100vw, 560px')}<span class="badge"><i></i>Service Mon–Sat, 8 AM – 5 PM</span></div>
  </div>
</section>

<section class="sec tight" style="padding-top:0;background:var(--ice-bg)">
  <div class="wrap ways">
    <a class="way" href="#book" data-svc="Repair" data-r><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg></span><b>Repair</b><span>No hot water, leaks, tripping breakers or strange noises. We diagnose and fix it, with genuine spare parts.</span><em>Book a repair ${I.arr}</em></a>
    <a class="way" href="#book" data-svc="Installation" data-r><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 6v4M9 18h6"/></svg></span><b>Installation</b><span>New heater or a replacement. We size it, install it, test it and register the warranty.</span><em>Book an installation ${I.arr}</em></a>
    <a class="way" href="#book" data-svc="Preventive maintenance" data-r><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4M16 2v4M3 9h18"/><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8.5 15l2.5 2.5 4.5-5"/></svg></span><b>Maintenance</b><span>A yearly check that catches problems early and keeps your heater safe and efficient.</span><em>Schedule maintenance ${I.arr}</em></a>
  </div>
</section>

<section class="sec" id="checks" aria-labelledby="ckT">
  <div class="wrap ck-grid">
    <div>
      <span class="kick">Before you call</span>
      <h2 class="thin h2" id="ckT">Quick Checks<br>You Can Try</h2>
      <p class="lede" style="margin-top:14px">Many problems have a simple cause. These checks are safe to do yourself. If they don't fix it, book a visit and we'll take it from there.</p>
      <p class="safe"><b>Safety first:</b> switch off the heater's breaker before touching anything, and never open the heater's cover. Leave repairs inside the unit to our technicians.</p>
    </div>
    <div class="checks">${CHECKS.map(([q, a], i) => `<details${i ? '' : ' open'} data-r><summary>${q}</summary><ol>${a.map(x => `<li>${x}</li>`).join('')}</ol></details>`).join('')}</div>
  </div>
</section>

<section class="sec dark" aria-labelledby="pmT">
  <div class="wrap pm">
    <div>
      <span class="kick">Preventive maintenance</span>
      <h2 class="thin h2" id="pmT">A Yearly Check<br>Saves the Big Repair</h2>
      <p class="lede" style="margin-top:14px">Scale, worn anode rods and tired valves build up slowly. A maintenance visit catches them before they cost you a heater, or a hotel morning without hot water.</p>
      <div class="why"><div><b>Safer</b><span>Valves and wiring tested, so the heater can't overheat.</span></div><div><b>Cheaper</b><span>A descaled element heats faster and uses less power.</span></div><div><b>Longer</b><span>A fresh anode rod protects the tank from rusting through.</span></div></div>
    </div>
    <ul>${PM.map(x => `<li data-r>${I.ck}${x}</li>`).join('')}</ul>
  </div>
</section>

<section class="sec soft" aria-labelledby="waT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Warranty</span><h2 class="thin h2" id="waT">Covered and<br>Registered for You</h2></div><p class="lede">We register the warranty when we install, so you never have to look for a receipt.</p></div>
    <div class="war">
      <div data-r><b>Instant water heaters</b><p>Aquapower and Gratek Aquarius: 5 years on the heating element and 1 year on parts.</p></div>
      <div data-r><b>Storage heaters, heat pumps &amp; solar</b><p>Covered by each manufacturer's warranty. We'll give you the terms in writing with your quotation.</p></div>
      <div data-r><b>Our installation work</b><p>Every installation is tested and commissioned on the day. If something's not right, we come back.</p></div>
    </div>
  </div>
</section>

<section class="sec" id="book" aria-labelledby="bkT">
  <div class="wrap">
    <div class="book">
      <div class="book-side">
        <span class="kick" style="color:#9FE3BE">Book a visit</span>
        <h2 class="thin h2 on-dark" id="bkT">Tell Us What's<br>Going On</h2>
        <p>Send the details and our service team will call you to confirm a time. For anything urgent, call us directly.</p>
        <ul><li>${I.ck}All brands we sell, in or out of warranty</li><li>${I.ck}Genuine spare parts</li><li>${I.ck}Homes, hotels, hospitals and businesses</li></ul>
        <small>Customer service</small><a class="call" href="tel:+639564160815">0956 416 0815</a>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:18px">${MSGR}</div>
      </div>
      <form class="form" data-mail="service@dpymi.com.ph" data-subject="Service request" novalidate>
        <div class="full"><span class="lb" id="svT">What do you need?</span><div class="qchips" role="group" aria-labelledby="svT" data-group="Service"><label><input type="radio" name="service" value="Repair" checked><span>Repair</span></label><label><input type="radio" name="service" value="Installation"><span>Installation</span></label><label><input type="radio" name="service" value="Preventive maintenance"><span>Maintenance</span></label><label><input type="radio" name="service" value="Other"><span>Something else</span></label></div></div>
        <div><label for="sN">Full name <i>*</i></label><input id="sN" name="fullname" autocomplete="name" required></div>
        <div><label for="sP">Mobile number <i>*</i></label><input id="sP" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09XX XXX XXXX" required></div>
        <div class="full"><label for="sA">Address or area <i>*</i></label><input id="sA" name="address" autocomplete="street-address" placeholder="Building, street, city" required></div>
        <div><label for="sB">Brand</label><select id="sB" name="brand"><option value="">Not sure</option>${['Aquapower', 'Gratek Aquarius', 'Rheem', 'Everhot', '5 Star', 'Deron', 'HAASE', 'Champion', 'Other brand'].map(b => `<option>${b}</option>`).join('')}</select></div>
        <div><label for="sT">Type of heater</label><select id="sT" name="type"><option value="">Not sure</option><option>Instant</option><option>Storage</option><option>Heat pump</option><option>Solar</option><option>Central system</option></select></div>
        <div><label for="sR">Nearest branch</label><select id="sR" name="branch">${BRANCHES.map(b => `<option>${b.n}</option>`).join('')}<option>Other area</option></select></div>
        <div><label for="sD">Preferred day</label><input id="sD" name="date" type="date"></div>
        <div class="full"><label for="sM">What's happening?</label><textarea id="sM" name="msg" placeholder="e.g. No hot water since yesterday, the breaker trips when the heater turns on."></textarea></div>
        <label class="ok"><input type="checkbox" name="consent" required><span>I agree that DPY may contact me about this request and use these details as described in the <a href="${R}privacy">privacy notice</a>.</span></label>
        <div class="f-sub"><small>Sent to our service team at service@dpymi.com.ph.</small><button class="btn red" type="submit">Send my request ${I.arr}</button></div>
        <div class="f-done" role="status"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><h3>Thank you<span class="who"></span>!</h3><p>Your email app has opened with your request. Press send, and our service team will call you to confirm a visit.</p><button class="btn ghost again" type="button">Edit my request</button></div>
      </form>
    </div>
  </div>
</section>`,
  js: `
// the three cards pre-pick the service type in the form
$$('[data-svc]').forEach(a => a.addEventListener('click', () => { const r = $('input[name=service][value="' + a.dataset.svc + '"]'); if (r) r.checked = true; setTimeout(() => $('#sN').focus({ preventScroll: true }), RM ? 0 : 1100) }))
const t = new Date(); t.setDate(t.getDate() + 1); $('#sD').min = t.toISOString().slice(0, 10)
`,
}
