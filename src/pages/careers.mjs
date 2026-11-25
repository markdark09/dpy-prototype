import { crumbsHtml, img, I } from '../../tools/lib.mjs'
import { listHtml, optionsHtml, stats } from '../jobs.mjs'
import JOBS from '../jobs.json' with { type: 'json' }

// openings come from src/jobs.json (the openings listed on dpymi.com.ph/careers; their details are samples, to confirm with DPY's HR).
// Once HR saves positions on the admin page, the Worker swaps the parts between the <!--jobs:...--> markers for the saved list.
const STATS = stats(JOBS)
export default {
  path: 'careers', nav: 'careers', noCta: true,
  title: 'Careers at DPY Mercantile',
  desc: 'Join DPY Mercantile Inc. Openings for sales engineers, sales executives, accounting staff and technicians in Manila and Cebu.',
  crumbs: [['Careers']],
  css: `
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.why div{padding:24px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.why b{display:block;font-size:17px;font-weight:600;margin-bottom:6px}
.why p{margin:0;font-size:14px;color:var(--mute);line-height:1.55}
.jobs{list-style:none;margin:0;padding:0;display:grid;gap:10px}
/* a role: the whole card opens it (its title is the link, stretched over the card), with one quiet arrow */
.job{position:relative;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;padding:20px 22px;border-radius:20px;background:#fff;box-shadow:var(--card);transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.job[hidden]{display:none}
.job b a{color:inherit}
.job b a::after{content:"";position:absolute;inset:0;border-radius:inherit}
.job b a:focus-visible{outline:none}
.job:has(b a:focus-visible){outline:2px solid var(--blue);outline-offset:3px}
.job:hover{transform:translateY(-2px);box-shadow:0 18px 36px -22px rgba(1,30,70,.45),var(--card)}
.job:active{transform:scale(.995)}
.job.none{grid-template-columns:1fr}.job.none:hover{transform:none;box-shadow:var(--card)}
.job b{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}
.job-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px;font-size:13px;font-weight:600;color:var(--ink2)}
.job-meta svg{width:14px;height:14px;flex:none;color:var(--blue)}
.job-meta i{font-style:normal;color:var(--mute)}
.job p{margin:6px 0 0;font-size:14.5px;line-height:1.5;color:var(--mute)}
.job-go{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--soft);color:var(--ink);transition:background-color .3s,color .3s,transform .4s var(--ease)}
.job-go svg{width:16px;height:16px}
.job:hover .job-go{background:var(--ink);color:#fff;transform:translateX(3px)}
/* the city filter, built by the page script from the roles listed (so its counts always match), when they are in more than one city */
.job-filter{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}
.job-filter button{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border:0;border-radius:999px;background:#fff;box-shadow:0 0 0 1px var(--line);font:600 14px var(--font);color:var(--ink);cursor:pointer;transition:background-color .25s,color .25s,box-shadow .25s}
.job-filter button span{font-size:12px;font-weight:700;color:var(--mute);transition:color .25s}
.job-filter button:hover{box-shadow:0 0 0 1px var(--ink)}
.job-filter button:active{transform:scale(.97)}
.job-filter button[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.job-filter button[aria-pressed="true"] span{color:rgba(255,255,255,.72)}
.job-filter button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.job,.job-go,.job-filter button{transition:none}.job:hover,.job:hover .job-go{transform:none}}
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
@media (max-width:640px){.job{gap:12px;padding:18px;align-items:start}.job-go{width:36px;height:36px}.job-go svg{width:14px;height:14px}.job-filter button{flex:1 1 auto;justify-content:center}.apply{grid-template-columns:1fr}.ap-side,.ap .form{padding:26px 22px}.drop .pick{display:none}}
`,
  body: R => `
<section class="phead">
  <span class="glow warm"></span>
  <div class="wrap ph-grid">
    <div>${crumbsHtml(R, [['Careers']])}<span class="kick">Careers</span><h1 class="thin h1">Discover<br>Your Potential</h1><p class="lede">We see our people as our most valuable asset. We train you, give you room to grow, and make you part of a reliable, professional team.</p><div class="ph-acts"><a class="btn red" href="#roles">See open roles ${I.arr}</a><a class="btn ghost" href="#apply" data-role="">Apply now</a></div></div>
    <ul class="ph-stats"><li><b><!--jobs:open-->${STATS.open}<!--/jobs:open--></b><small>Open roles</small></li><li><b><!--jobs:cities-->${STATS.cities}<!--/jobs:cities--></b><small>Cities hiring</small></li><li><b>5</b><small>Core values</small></li></ul>
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
    <div class="sec-head"><div><span class="kick">Open roles</span><h2 class="thin h2" id="roT">We're Hiring</h2></div><p class="lede">Open a role to see what it involves, then apply from this page with your CV. We'll be in touch if your experience fits.</p></div>
    <div class="job-filter" role="group" aria-label="Show roles in" hidden></div><p class="vh" id="jobsShown" aria-live="polite"></p>
    <ul class="jobs"><!--jobs:list-->${listHtml(JOBS, R)}<!--/jobs:list--></ul>
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
        <div class="full"><label for="cR">Role <i>*</i></label><select id="cR" name="role" required><option value="">Choose a role</option><!--jobs:options-->${optionsHtml(JOBS)}<!--/jobs:options--><option data-slug="open">Open application</option></select></div>
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
// arriving from a role's own page (?role=its-address): that role is already picked in the form
{
  const want = new URLSearchParams(location.search).get('role'), opt = want && $('#cR option[data-slug="' + CSS.escape(want) + '"]')
  if (opt) { opt.selected = true; if (location.hash === '#apply') setTimeout(() => $('#cN').focus({ preventScroll: true }), RM ? 0 : 900) }
}
// roles by city: chips built from the roles listed (so their counts always match the list), shown only when the roles
// are in more than one city; the choice stays in the address (?city=Cebu), so a city's roles can be shared as a link
{
  const jobs = $$('.jobs .job[data-city]'), box = $('.job-filter'), live = $('#jobsShown')
  const cities = [...jobs.reduce((m, j) => m.set(j.dataset.city, (m.get(j.dataset.city) || 0) + 1), new Map())].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  if (box && cities.length > 1) {
    const chip = (city, n, name) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.city = city; b.append(name + ' '); const s = document.createElement('span'); s.textContent = n; b.append(s); return b }
    box.append(chip('', jobs.length, 'All'), ...cities.map(([c, n]) => chip(c, n, c)))
    const chips = $$('button', box)
    const pick = (city, push) => {
      chips.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.city === city)))
      let n = 0; jobs.forEach(j => { j.hidden = !!city && j.dataset.city !== city; if (!j.hidden) n++ })
      if (!push) return
      if (live) live.textContent = n + (n === 1 ? ' role' : ' roles') + (city ? ' in ' + city : '')
      const u = new URL(location); city ? u.searchParams.set('city', city) : u.searchParams.delete('city'); history.replaceState(null, '', u)
    }
    chips.forEach(b => b.addEventListener('click', () => pick(b.dataset.city, true)))
    const want = new URLSearchParams(location.search).get('city')
    pick(cities.some(([c]) => c === want) ? want : '', false)
    box.hidden = false
  }
}
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
