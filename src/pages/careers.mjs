import { crumbsHtml, img, I } from '../../tools/lib.mjs'

// openings as listed on dpymi.com.ph/careers; the one-line role summaries are general descriptions (to confirm with DPY's HR)
const JOBS = [
  ['Sales Engineer', 'Manila', 'Visit sites, size hot water systems and prepare quotations for hotels, hospitals and buildings.'],
  ['Sales Executive', 'Manila', 'Look after homeowners, developers and retail clients, from first inquiry to installation.'],
  ['Accounting Staff', 'Manila', 'Keep our books, billing and payments accurate and on time.'],
  ['Aircon Technician', 'Manila', 'Install and service heat pumps and refrigeration-based systems on site.'],
  ['Sales Engineer', 'Cebu', 'Grow our Visayas projects: site visits, system sizing and quotations.'],
  ['Sales Executive', 'Cebu', 'Serve homes and businesses across Cebu, from inquiry to after-sales.'],
]
export default {
  path: 'careers', nav: 'about',
  title: 'Careers at DPY Mercantile',
  desc: 'Join DPY Mercantile Inc. Openings for sales engineers, sales executives, accounting staff and technicians in Manila and Cebu.',
  crumbs: [['About', 'about'], ['Careers']],
  css: `
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.why div{padding:24px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.why b{display:block;font-size:17px;font-weight:600;margin-bottom:6px}
.why p{margin:0;font-size:14px;color:var(--mute);line-height:1.55}
.jobs{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.job{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:center;padding:20px 22px;border-radius:20px;background:#fff;box-shadow:var(--card);transition:transform .5s var(--ease)}
.job:hover{transform:translateX(4px)}
.job b{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}
.job p{margin:4px 0 0;font-size:13.5px;color:var(--mute)}
.job .loc{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px;background:var(--soft)}
.job .loc svg{width:14px;height:14px}
.apply{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;margin-top:30px;padding:30px;border-radius:26px;color:#fff;background:linear-gradient(120deg,#0D3A73,#0A1830)}
.apply b{display:block;font-size:22px;font-weight:600}
.apply p{margin:6px 0 0;color:#A9C2DE;font-size:14.5px}
@media (max-width:980px){.why{grid-template-columns:1fr}}
@media (max-width:640px){.job{grid-template-columns:1fr;gap:10px}.job .loc{justify-self:start}.apply{grid-template-columns:1fr}}
`,
  body: R => `
<section class="phead">
  <span class="glow warm"></span>
  <div class="wrap ph-grid">
    <div>${crumbsHtml(R, [['About', 'about'], ['Careers']])}<span class="kick">Careers</span><h1 class="thin h1">Discover<br>Your Potential</h1><p class="lede">We see our people as our most valuable asset. We train you, give you room to grow, and make you part of a reliable, professional team.</p><div class="ph-acts"><a class="btn red" href="#roles">See open roles ${I.arr}</a></div></div>
    <ul class="ph-stats"><li><b>${JOBS.length}</b><small>Open roles</small></li><li><b>2</b><small>Cities hiring</small></li><li><b>5</b><small>Core values</small></li></ul>
  </div>
</section>

<section class="sec" aria-labelledby="wyT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Why DPY</span><h2 class="thin h2" id="wyT">Grow With a Team<br>That Grows Its People</h2></div></div>
    <div class="why">
      <div data-r><b>Learn on real projects</b><p>Hotels, hospitals and homes across the country, with brands from Germany, Australia and beyond.</p></div>
      <div data-r><b>Training and growth</b><p>We train our people and give them chances to learn and move up as the company grows.</p></div>
      <div data-r><b>Values we live by</b><p>Professionalism, respect, integrity, zeal and excellence: for our customers, our suppliers and our staff.</p></div>
    </div>
  </div>
</section>

<section class="sec soft" id="roles" aria-labelledby="roT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Open roles</span><h2 class="thin h2" id="roT">We're Hiring</h2></div><p class="lede">Send your CV and the role you're applying for. We'll be in touch if your experience fits.</p></div>
    <ul class="jobs">${JOBS.map(([t, l, d]) => `<li class="job" data-r><div><b>${t}</b><p>${d}</p></div><span class="loc">${I.pin}${l}</span><a class="btn sm" href="mailto:careers@dpymi.com.ph?subject=${encodeURIComponent('Application: ' + t + ' (' + l + ')')}">Apply ${I.arr}</a></li>`).join('')}</ul>
    <div class="apply" data-r><div><b>Don't see your role?</b><p>Send your CV anyway. We keep good people in mind for the next opening.</p></div><a class="btn white" href="mailto:careers@dpymi.com.ph?subject=Application">careers@dpymi.com.ph</a></div>
  </div>
</section>`,
}
