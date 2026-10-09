import { PRODUCTS, CATS, crumbsHtml, I, prodImg } from '../../tools/lib.mjs'
import { ROWS, CMP, SETS } from '../compare.mjs'

// everything the page needs about each product, drawn in the browser from the visitor's picks (?p=a,b,c or their saved list)
const DATA = Object.fromEntries(PRODUCTS.map(p => [p.slug, { n: p.name, b: p.brand, c: p.cat, t: CATS[p.cat].s + (p.sub ? ' · ' + p.sub : ''), f: p.for, i: prodImg(p), best: p.best, w: p.warranty, ...CMP[p.slug] }]))
const GROUPS = Object.entries(CATS).map(([k, c]) => [c.t.replace(/^./, x => x.toUpperCase()), PRODUCTS.filter(p => p.cat === k).map(p => [p.slug, p.name])]).filter(([, l]) => l.length)

export default {
  path: 'compare', nav: 'water-heaters',
  title: 'Compare Water Heaters Side by Side',
  desc: 'Compare up to four DPY and Gratek water heaters, heat pumps and tanks side by side: power, capacity, running cost, power supply, size and warranty.',
  crumbs: [['Water Heaters', 'water-heaters'], ['Compare']],
  css: `
.cp-sets{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:24px}
.cp-sets > span{font-size:12.5px;font-weight:700;color:var(--mute);margin-right:4px}
.cp-bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}
.cp-bar label{display:inline-flex;align-items:center;gap:10px;font-size:13.5px;font-weight:600;cursor:pointer}
.cp-bar input{width:40px;height:22px;appearance:none;-webkit-appearance:none;border-radius:999px;background:#D9E0E7;position:relative;cursor:pointer;transition:background .3s}
.cp-bar input::after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .35s var(--ease)}
.cp-bar input:checked{background:var(--ink)}.cp-bar input:checked::after{transform:translateX(18px)}
.cp-bar small{font-size:12.5px;color:var(--mute)}
.cp{position:relative;overflow-x:auto;border-radius:26px;background:#fff;box-shadow:var(--card);scrollbar-width:thin}
.cp table{border-collapse:separate;border-spacing:0;width:100%;min-width:var(--min,720px);table-layout:fixed}
.cp th,.cp td{padding:14px 16px;text-align:left;vertical-align:top;font-size:14px;line-height:1.45;border-bottom:1px solid var(--line)}
.cp tbody tr:last-child > *{border-bottom:0}
.cp tbody th{position:sticky;left:0;z-index:1;width:170px;background:#F7FAFD;font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--mute);box-shadow:1px 0 0 var(--line)}
.cp thead th{position:relative;padding:18px 16px 16px;vertical-align:bottom;background:#fff}
.cp thead th:first-child{position:sticky;left:0;z-index:2;width:170px;background:#F7FAFD;box-shadow:1px 0 0 var(--line);vertical-align:middle;font-size:12px;color:var(--mute)}
.cp td + td,.cp thead th + th{box-shadow:inset 1px 0 0 var(--line)}
.ph-c{display:grid;gap:8px}
.ph-c .pic{height:150px;display:grid;place-items:end center;border-radius:16px;background:radial-gradient(70% 70% at 50% 45%,#fff,#E9F1F8)}
.ph-c .pic img{max-height:136px;max-width:82%;width:auto;object-fit:contain;margin-bottom:6px}
.ph-c .pic span{align-self:center;font-weight:800;letter-spacing:.08em;color:#3A4655}
.ph-c small{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue)}
.ph-c a.nm{font-size:16px;font-weight:600;letter-spacing:-.02em;line-height:1.25}
.ph-c a.nm:hover{color:var(--red)}
.ph-c .acts{display:flex;gap:6px;align-items:center}
.ph-c .acts .addq{flex:1;height:36px;font-size:12px;padding:0 10px}
.rm{position:absolute;right:10px;top:10px;width:30px;height:30px;border-radius:50%;background:var(--soft);color:var(--mute);font-size:16px;line-height:1}
.rm:hover{background:#FFF0F0;color:var(--red)}
.add-c{display:grid;align-content:center;padding:14px;gap:10px;min-height:250px;text-align:center;border-radius:16px;box-shadow:inset 0 0 0 1.5px var(--line);background:repeating-linear-gradient(135deg,#FAFCFE,#FAFCFE 10px,#F4F8FB 10px,#F4F8FB 20px)}
.add-c b{font-size:14px}
.add-c select{width:100%;max-width:100%;height:40px;padding:0 10px;border-radius:12px;border:1px solid var(--line);background:#fff;font:inherit;font-size:13px}
.cp td.same{color:var(--dim)}
.cp.diff tr.same{display:none}
.cp td ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:5px}
.cp td li{font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:#F2F5F8}
.cp td .who span{display:inline-block;margin-right:4px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;background:rgba(13,104,195,.08);color:var(--blue)}
.cp td .who span.b{background:rgba(199,10,14,.07);color:var(--red)}
.cp td.dash{color:var(--dim)}
.cp tr.grp th,.cp tr.grp td{background:#F2F6FA;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--blue);padding:9px 16px}
.empty{padding:50px 20px;text-align:center}
.empty b{display:block;font-size:20px;font-weight:600;margin-bottom:6px}
.empty p{margin:0 0 18px;color:var(--mute)}
.cp-foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-top:22px;padding:20px 22px;border-radius:22px;background:var(--ice-bg)}
.cp-foot p{margin:0;font-size:14px;color:var(--ink2);max-width:520px}
.cp-note{margin:14px 0 0;font-size:12px;color:var(--mute)}
@media (max-width:640px){.cp tbody th,.cp thead th:first-child{width:104px;font-size:10.5px;padding:10px 8px}.cp th,.cp td{padding:10px;font-size:12.5px}.cp thead th{padding:40px 10px 12px}.ph-c .pic{height:96px}.ph-c .pic img{max-height:84px}.ph-c a.nm{font-size:13.5px}.ph-c .acts .addq{height:34px;padding:0 6px}.ph-c .acts .addq svg{display:none}.rm{right:6px;top:6px;width:26px;height:26px}.add-c{min-height:200px;padding:8px}.add-c b{font-size:12.5px}.ph-c .acts .addq .of{font-size:11px}}
`,
  body: R => `
<section class="phead" style="padding-bottom:44px">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Water Heaters', 'water-heaters'], ['Compare']])}
    <span class="kick">Side by side</span>
    <h1 class="thin h1">Compare Products</h1>
    <p class="lede">Pick up to four and see them side by side: power, tank size, running cost, power supply, size and warranty. Tap ${I.cmp.replace('<svg', '<svg style="display:inline;width:15px;height:15px;vertical-align:-2px"')} on any product to add it here.</p>
    <div class="cp-sets"><span>Quick compare:</span>${SETS.map(([t, l]) => `<button class="chip" type="button" data-set="${l.join(',')}">${t}</button>`).join('')}</div>
  </div>
</section>
<section class="sec" style="padding-top:40px">
  <div class="wrap">
    <div class="cp-bar"><label><input type="checkbox" class="dif"> Show only the differences</label><small class="cp-count" aria-live="polite"></small></div>
    <div class="cp" tabindex="0" role="region" aria-label="Product comparison"><noscript><div class="empty"><b>Comparing needs JavaScript</b><p>Every product page lists its full specifications.</p></div></noscript></div>
    <p class="cp-note">From DPY's product pages and the manufacturers' spec sheets. A dash means the detail isn't published yet: ask us. Your free site visit confirms the right size.</p>
    <div class="cp-foot" hidden><p><b>Want prices for these?</b> Add them all to your quote list and we'll send one written quotation.</p><a class="btn red" href="${R}contact#quote" data-quote-all>Get a quote for all ${I.arr}</a></div>
  </div>
</section>`,
  js: R => `
const D = ${JSON.stringify(DATA)}, ROWS = ${JSON.stringify(ROWS)}, GROUPS = ${JSON.stringify(GROUPS)}, MAX = DPY.compare.max
const box = $('.cp'), dif = $('.dif'), foot = $('.cp-foot'), count = $('.cp-count')
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
// the address wins (a shared link), otherwise the visitor's saved picks
const qp = (new URLSearchParams(location.search).get('p') || '').split(',').filter(s => D[s])
if (qp.length) DPY.compare.set(qp.slice(0, MAX).map(s => ({ s, n: D[s].n, i: D[s].i })))
const pick = () => DPY.compare.list().map(x => x.s).filter(s => D[s])
function setList(l) { DPY.compare.set(l.slice(0, MAX).map(s => ({ s, n: D[s].n, i: D[s].i }))) }
const picker = (taken) => '<select aria-label="Add a product to compare"><option value="">Choose a product…</option>' + GROUPS.map(([g, l]) => '<optgroup label="' + g + '">' + l.filter(([s]) => !taken.includes(s)).map(([s, n]) => '<option value="' + s + '">' + esc(n) + '</option>').join('') + '</optgroup>').join('') + '</select>'
const cell = (k, p) => {
  const v = p[k]
  if (k === 'best') return v?.length ? '<ul>' + v.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : ''
  if (k === 'f') return '<span class="who">' + (v.includes('home') ? '<span>Homes</span>' : '') + (v.includes('business') ? '<span class="b">Business</span>' : '') + '</span>'
  return v ? esc(v) : ''
}
function draw() {
  const l = pick(), slots = l.length < MAX ? [...l, ''] : l
  count.textContent = l.length ? l.length + ' of ' + MAX + ' picked' : ''
  foot.hidden = !l.length
  history.replaceState(null, '', l.length ? '?p=' + l.join(',') : location.pathname)
  if (!l.length) { box.innerHTML = '<div class="empty"><b>Nothing to compare yet</b><p>Pick a quick comparison above, choose products below, or tap the compare button on any product.</p>' + picker([]) + '</div>'; return }
  const ph = innerWidth < 640 // phones: two products side by side, the rest a swipe away
  box.style.setProperty('--min', (ph ? 104 + slots.length * 140 : 170 + slots.length * 230) + 'px')
  const head = '<thead><tr><th scope="col">' + l.length + (l.length === 1 ? ' product' : ' products') + '</th>' + slots.map(s => s ? '<th scope="col"><div class="ph-c"><div class="pic">' + (D[s].i ? '<img src="${R}' + D[s].i + '" alt="">' : '<span>' + esc(D[s].b.toUpperCase()) + '</span>') + '</div><small>' + esc(D[s].b) + '</small><a class="nm" href="${R}products/' + s + '">' + esc(D[s].n) + '</a><div class="acts"><button class="addq" type="button" data-add="' + s + '" data-name="' + esc(D[s].n) + '" data-img="' + D[s].i + '" data-cat="' + D[s].c + '" aria-pressed="false">${I.plus.replace(/"/g, '\\"')}<span class="of">Add to quote</span><span class="on">In your quote</span></button></div></div><button class="rm" type="button" data-rm-c="' + s + '" aria-label="Remove ' + esc(D[s].n) + '">×</button></th>' : '<th scope="col"><div class="add-c"><b>Add a product</b>' + picker(l) + '</div></th>').join('') + '</tr></thead>'
  const rows = [['t', 'Type'], ['f', 'For'], ...ROWS, ['w', 'Warranty'], ['best', 'Best for']]
  const body = '<tbody>' + rows.map(([k, label]) => {
    const vals = l.map(s => cell(k, D[s]))
    if (vals.every(v => !v)) return ''
    const same = l.length > 1 && vals.every(v => v === vals[0])
    return '<tr' + (same ? ' class="same"' : '') + '><th scope="row">' + label + '</th>' + vals.map(v => '<td class="' + (v ? (same ? 'same' : '') : 'dash') + '">' + (v || '–') + '</td>').join('') + (l.length < MAX ? '<td></td>' : '') + '</tr>'
  }).join('') + '</tbody>'
  box.innerHTML = '<table>' + head + body + '</table>'
  DPY.quote.sync()
}
box.addEventListener('change', e => { if (e.target.matches('select') && e.target.value) setList([...pick(), e.target.value]) })
box.addEventListener('click', e => { const r = e.target.closest('[data-rm-c]'); if (r) setList(pick().filter(s => s !== r.dataset.rmC)) })
$$('[data-set]').forEach(b => b.addEventListener('click', () => setList(b.dataset.set.split(','))))
dif.addEventListener('change', () => box.classList.toggle('diff', dif.checked))
$('[data-quote-all]').addEventListener('click', () => pick().forEach(s => DPY.quote.add(s, D[s].n, D[s].i, D[s].c)))
document.addEventListener('dpy:compare', draw)
draw()
`,
}
