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
  path: 'careers', nav: 'careers',
  title: 'Careers at DPY Mercantile',
  desc: 'Join DPY Mercantile Inc. Openings for sales engineers, sales executives, accounting staff and technicians in Manila and Cebu.',
  crumbs: [['Careers']],
  css: `
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.why div{padding:24px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.why b{display:block;font-size:17px;font-weight:600;margin-bottom:6px}
.why p{margin:0;font-size:14px;color:var(--mute);line-height:1.55}
.jobs{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.job{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:center;padding:20px 22px;border-radius:20px;background:#fff;box-shadow:var(--card);transition:transform .5s var(--ease)}
.job:hover{transform:translateX(4px)}
.job b{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}
.job p{margin:4px 0 0;font-size:14.5px;color:var(--mute)}
.job .loc{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px;background:var(--soft)}
.job .loc svg{width:14px;height:14px}
.apply{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;margin-top:30px;padding:30px;border-radius:26px;color:#fff;background:linear-gradient(120deg,#0D3A73,#0A1830)}
.apply b{display:block;font-size:22px;font-weight:600}
.apply p{margin:6px 0 0;color:#A9C2DE;font-size:14.5px}
/* applying: the same card as Service's booking form */
.ap{display:grid;grid-template-columns:.8fr 1.2fr;border-radius:30px;overflow:hidden;overflow:clip;background:#fff;box-shadow:0 40px 80px -50px rgba(1,30,70,.5)}
.ap-side{padding:40px 36px;color:#fff;background:radial-gradient(90% 70% at 0% 0%,rgba(13,104,195,.45),transparent 60%),linear-gradient(160deg,#0D3A73,#0A1830)}
.ap-side h2{margin:0}
.ap-side p{color:#A9C2DE;font-size:14.5px;margin:14px 0 22px}
.ap-side ul{list-style:none;margin:0 0 24px;padding:0;display:grid;gap:10px;font-size:14px}
.ap-side li{display:flex;gap:10px;align-items:center}
.ap-side li svg{width:16px;height:16px;color:#7CC4FF}
.ap-side small{color:#9DB0C6;font-size:13.5px}.ap-side small a{color:#fff;text-decoration:underline;text-underline-offset:2px}
.ap .form{position:relative;padding:36px}
/* the CV picker: the real file input covers the box (so a click or a dropped file both work), styled like the other fields */
.drop{position:relative;display:flex;align-items:center;gap:14px;min-height:72px;padding:12px 14px;border-radius:14px;border:1.5px dashed #C9D4E1;background:#F8FAFC;cursor:pointer;transition:border-color .25s,background .25s,box-shadow .25s}
.form .drop{display:flex;margin:0;font-weight:400}
.form .drop input{position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;opacity:0;cursor:pointer}
.drop .ic{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#fff;color:var(--blue);box-shadow:0 0 0 1px var(--line)}
.drop .ic svg{width:20px;height:20px}
.drop .t{flex:1;min-width:0;display:grid;gap:2px}
.drop .t b{font-size:14px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.drop .t small{font-size:13px;color:var(--mute)}
.drop .pick{flex:none;font-size:13px;font-weight:600;color:var(--blue)}
.drop:hover,.drop.over{border-color:var(--blue);background:#F1F7FE}
.drop:focus-within{border-color:var(--blue);background:#fff;box-shadow:0 0 0 4px rgba(13,104,195,.1)}
.drop.has{border-style:solid;border-color:#9FD8B8;background:#F3FBF6}.drop.has .ic{color:#1E9E55}
.drop.bad,.drop:has(input.bad){border-color:var(--red);background:#FFF6F6}
@media (max-width:980px){.why,.ap{grid-template-columns:1fr}}
@media (max-width:640px){.job{grid-template-columns:1fr;gap:10px}.job .loc{justify-self:start}.apply{grid-template-columns:1fr}.ap-side,.ap .form{padding:26px 22px}.drop .pick{display:none}}
`,
  body: R => `
<section class="phead">
  <span class="glow warm"></span>
  <div class="wrap ph-grid">
    <div>${crumbsHtml(R, [['Careers']])}<span class="kick">Careers</span><h1 class="thin h1">Discover<br>Your Potential</h1><p class="lede">We see our people as our most valuable asset. We train you, give you room to grow, and make you part of a reliable, professional team.</p><div class="ph-acts"><a class="btn red" href="#roles">See open roles ${I.arr}</a><a class="btn ghost" href="#apply" data-role="">Apply now</a></div></div>
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
    <div class="sec-head"><div><span class="kick">Open roles</span><h2 class="thin h2" id="roT">We're Hiring</h2></div><p class="lede">Pick a role, attach your CV and send it from this page. We'll be in touch if your experience fits.</p></div>
    <ul class="jobs">${JOBS.map(([t, l, d]) => `<li class="job" data-r><div><b>${t}</b><p>${d}</p></div><span class="loc">${I.pin}${l}</span><a class="btn sm" href="#apply" data-role="${t} (${l})" aria-label="Apply for ${t}, ${l}">Apply ${I.arr}</a></li>`).join('')}</ul>
    <div class="apply" data-r><div><b>Don't see your role?</b><p>Send your CV anyway. We keep good people in mind for the next opening.</p></div><a class="btn white" href="#apply" data-role="Open application">Send an open application ${I.arr}</a></div>
  </div>
</section>

<section class="sec" id="apply" aria-labelledby="apT">
  <div class="wrap">
    <div class="ap" data-r>
      <div class="ap-side">
        <span class="kick" style="color:#7CC4FF">Apply</span><h2 class="thin h2 on-dark" id="apT">Send Your<br>Application</h2>
        <p>Choose the role, attach your CV and tell us a little about yourself. It goes straight to our hiring team.</p>
        <ul><li>${I.ck}PDF or Word, up to 5 MB</li><li>${I.ck}We reply if your experience fits</li><li>${I.ck}<span>Used only for hiring, as the <a href="${R}privacy#jobs" style="color:#fff;text-decoration:underline">privacy notice</a> says</span></li></ul>
        <small>Prefer email? Send your CV to <a href="mailto:careers@dpymi.com.ph">careers@dpymi.com.ph</a>.</small>
      </div>
      <form class="form" data-mail="careers@dpymi.com.ph" data-subject="Job application" data-kind="careers" novalidate>
        <div class="full"><label for="cR">Role <i>*</i></label><select id="cR" name="role" required><option value="">Choose a role</option>${JOBS.map(([t, l]) => `<option>${t} (${l})</option>`).join('')}<option>Open application</option></select></div>
        <div><label for="cN">Full name <i>*</i></label><input id="cN" name="fullname" autocomplete="name" required></div>
        <div><label for="cP">Mobile number <i>*</i></label><input id="cP" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09XX XXX XXXX" required></div>
        <div><label for="cE">Email <i>*</i></label><input id="cE" name="email" type="email" autocomplete="email" placeholder="you@email.com" required></div>
        <div><label for="cC">City you live in</label><input id="cC" name="city" autocomplete="address-level2" placeholder="e.g. Pasig, Cebu City"></div>
        <div class="full"><span class="lb">CV <i style="font-style:normal;color:var(--red)">*</i></span><label class="drop" for="cV"><input id="cV" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required aria-describedby="cvH"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 17v-6M9.5 13.5 12 11l2.5 2.5"/></svg></span><span class="t"><b>Attach your CV</b><small id="cvH">PDF or Word, up to 5 MB. Tap or drop the file here.</small></span><span class="pick">Choose file</span></label></div>
        <div class="full"><label for="cM">Anything we should know?</label><textarea id="cM" name="msg" placeholder="Your experience, when you could start, or a link to your portfolio."></textarea></div>
        <label class="ok"><input type="checkbox" name="consent" required><span>I agree that DPY may use these details and my CV to consider me for this and similar roles, as described in the <a href="${R}privacy#jobs">privacy notice</a>.</span></label>
        <div class="f-sub"><small>Sent to our hiring team at careers@dpymi.com.ph.</small><button class="btn red" type="submit">Send my application ${I.arr}</button></div>
        <div class="f-done" role="status"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><h3>Thank you<span class="who"></span>!</h3><p>Your email app has opened with your application. Attach your CV to the email, then press send.</p><button class="btn ghost again" type="button">Edit my application</button></div>
      </form>
    </div>
  </div>
</section>`,
  js: `
// Apply buttons: pick that role in the form, then go to it
$$('a[data-role]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault()
  if (a.dataset.role) $('#cR').value = a.dataset.role
  DPY.go('#apply'); setTimeout(() => $(a.dataset.role ? '#cN' : '#cR').focus({ preventScroll: true }), RM ? 0 : 900)
}))
// the CV box shows the chosen file
const drop = $('.drop'), cv = $('#cV'), cvT = $('.drop .t b'), cvS = $('.drop .t small'), cvP = $('.drop .pick'), cvHint = cvS.textContent
const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'
cv.addEventListener('change', () => {
  const f = cv.files[0]; drop.classList.toggle('has', !!f); drop.classList.remove('bad')
  cvT.textContent = f ? f.name : 'Attach your CV'; cvS.textContent = f ? kb(f.size) + (f.size > 5242880 ? ': too large, please send one under 5 MB' : '') : cvHint; cvP.textContent = f ? 'Change' : 'Choose file'
})
;['dragenter', 'dragover'].forEach(t => cv.addEventListener(t, () => drop.classList.add('over')))
;['dragleave', 'drop'].forEach(t => cv.addEventListener(t, () => drop.classList.remove('over')))
`,
}
