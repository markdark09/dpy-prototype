// The blog: /blog (every article, with topic filters) and /blog/<article>. Articles live in src/articles.mjs.
import { PRODUCTS, card, crumbsHtml, img, I, SITE } from '../../tools/lib.mjs'
import { ARTICLES, CATS, esc, inline, minutes, dateText, sorted, bodyHtml } from '../articles.mjs'

const list = sorted()
// heading anchors; one that would start with a digit ("1. The water...") gets a letter first, so it also works as a CSS selector
const slugId = s => { const x = s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); return /^[0-9]/.test(x) ? 'n' + x : x }
const NOTE = 'These articles are samples written for this prototype, from facts already on the site. DPY\'s team reviews them before launch.'

// a card for the list, the homepage and "More articles"; cover photos fill the frame, product shots sit on a soft stage
export function articleCard(a, R, { h = 'h3', big = false } = {}) {
  return `<article class="bc${big ? ' big' : ''}" data-cat="${a.cat}" data-r>
  <a class="bc-pic${a.fit === 'contain' ? ' fit' : ''}" href="${R}blog/${a.slug}" tabindex="-1" aria-hidden="true">${img(R, a.img, '', ' loading="lazy"', big ? '(max-width:980px) 100vw, 640px' : '(max-width:640px) 100vw, 400px')}</a>
  <div class="bc-tx"><p class="bc-meta"><span class="bc-cat">${CATS[a.cat]}</span><span>${dateText(a.date)}</span><span>${minutes(a)} min read</span></p>
  <${h}><a href="${R}blog/${a.slug}">${esc(a.title)}</a></${h}><p class="bc-ex">${esc(a.excerpt)}</p>${big ? `<a class="link" href="${R}blog/${a.slug}">Read the article ${I.arr}</a>` : ''}</div>
</article>`
}
export const CARD_CSS = `
.bc{display:flex;flex-direction:column;border-radius:24px;background:#fff;box-shadow:var(--card);overflow:hidden;transition:transform .5s var(--ease),box-shadow .5s}
.bc:hover{transform:translateY(-4px);box-shadow:var(--sh)}
.bc-pic{display:block;aspect-ratio:16/10;overflow:hidden;background:#E6EFF8}
.bc-pic img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.bc:hover .bc-pic img{transform:scale(1.04)}
.bc-pic.fit{display:grid;place-items:center;padding:18px;background:radial-gradient(80% 80% at 50% 40%,#fff,#E6EFF8)}
.bc-pic.fit img{width:auto;height:auto;max-width:70%;max-height:100%;object-fit:contain}
.bc-tx{display:flex;flex-direction:column;gap:10px;padding:20px 22px 24px}
.bc-meta{display:flex;flex-wrap:wrap;gap:4px 12px;margin:0;font-size:13px;color:var(--mute)}
.bc-cat{font-weight:700;color:var(--blue)}
.bc h2,.bc h3{margin:0;font-size:19px;font-weight:600;letter-spacing:-.02em;line-height:1.3}
.bc h2 a,.bc h3 a{color:inherit}.bc h2 a:hover,.bc h3 a:hover{text-decoration:underline;text-underline-offset:3px}
.bc-ex{margin:0;font-size:15px;line-height:1.55;color:var(--ink2)}
.bc.big{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
.bc.big .bc-pic{aspect-ratio:auto;min-height:340px}
.bc.big .bc-tx{justify-content:center;gap:14px;padding:36px 40px}
.bc.big h2{font-size:clamp(24px,2.4vw,32px);font-weight:500;letter-spacing:-.03em;line-height:1.15}
.bc.big .bc-ex{font-size:16.5px}
.bc.big .link{align-self:flex-start}
@media (max-width:980px){.bc.big{grid-template-columns:minmax(0,1fr)}.bc.big .bc-pic{min-height:0;aspect-ratio:16/9}.bc.big .bc-tx{padding:24px 22px 28px}}
`

// ---------- the listing: numbered pages, 6 articles each (page 1 also has the newest article featured above them) ----------
// /blog, /blog/page/2 ...  and per topic: /blog/topic/guides, /blog/topic/guides/page/2 ...  Plain links, so every page
// works without JavaScript and search engines can follow them.
export const PER = 6
const LIST_CSS = CARD_CSS + `
.bl-feat{margin-top:44px}
.bl-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 20px;margin-bottom:24px}
.bl-bar .tabs{margin-top:0;margin-bottom:0}
/* later pages and topics: a shorter head, straight to the articles */
.phead.bl-sm{padding-bottom:28px}.bl-sm + .sec{padding-top:40px}
.chip[aria-current="page"]{background:var(--ink);color:#fff;box-shadow:none}
.bl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.bl-pages{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:40px 0 0}
.bl-pages a,.bl-pages span{display:inline-grid;place-items:center;min-width:44px;height:44px;padding:0 14px;border-radius:999px;font-size:14.5px;font-weight:600}
.bl-pages a{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line);transition:background .25s,box-shadow .25s}
.bl-pages a:hover{background:var(--soft);box-shadow:inset 0 0 0 1px #C9D4E1}
.bl-pages [aria-current="page"]{background:var(--ink);color:#fff;box-shadow:none}
.bl-pages .off{color:#9AA5B1;box-shadow:inset 0 0 0 1px var(--line)}
.bl-pages .nx{display:inline-flex;gap:8px}.bl-pages .nx svg{width:16px;height:16px}.bl-pages .pv svg{transform:scaleX(-1)}
.bl-count{margin:16px 0 0;font-size:14px;color:var(--mute);text-align:center}
.bl-note{margin:30px 0 0;font-size:14px;color:var(--mute);text-align:center}
@media (max-width:980px){.bl-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.bl-grid{grid-template-columns:minmax(0,1fr)}.bl-pages .nx .t{display:none}}
`
const topicPath = (cat, n = 1) => 'blog' + (cat ? '/topic/' + cat : '') + (n > 1 ? '/page/' + n : '')
function listPage(cat, n, items, pages, featured) {
  const label = cat ? CATS[cat] : ''
  const path = topicPath(cat, n), first = !cat && n === 1
  const crumbs = [['Blog', first ? '' : 'blog'], ...(cat ? [[label, n > 1 ? topicPath(cat) : '']] : []), ...(n > 1 ? [['Page ' + n, '']] : [])]
  const crumbList = crumbs.map(([t, u], i) => i === crumbs.length - 1 ? [t] : [t, u])
  const counts = Object.fromEntries(Object.keys(CATS).map(k => [k, list.filter(x => x.cat === k).length]))
  return {
    path, nav: 'blog',
    title: first ? 'Blog: Hot Water Guides & News' : `${label || 'Blog'}${n > 1 ? ', page ' + n : ''}: Hot Water Guides & News`,
    desc: cat ? `${label} articles from DPY Mercantile: practical advice on water heaters and hot water systems in the Philippines.` : 'Practical guides on choosing, running and looking after water heaters and central hot water systems in the Philippines, from DPY Mercantile.',
    crumbs: crumbList,
    css: LIST_CSS,
    body: R => `
<section class="phead${featured ? '' : ' bl-sm'}">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, crumbList)}
    <span class="kick">Blog${cat ? ' · ' + label : ''}</span><h1 class="thin h1">${first ? 'Hot Water<br>Guides &amp; News' : cat ? esc(label) : 'All Articles'}${n > 1 ? `<br><small style="font-size:.5em">Page ${n} of ${pages}</small>` : ''}</h1>
    ${n > 1 ? '' : `<p class="lede">${cat ? `${counts[cat]} ${counts[cat] === 1 ? 'article' : 'articles'} on ${esc(label.toLowerCase())}, newest first.` : 'Practical guides on choosing, running and looking after water heaters and hot water systems, from the team that installs and services them.'}</p>`}
    ${featured ? `<div class="bl-feat">${articleCard(featured, R, { h: 'h2', big: true })}</div>` : ''}
  </div>
</section>

<section class="sec" id="articles" aria-labelledby="blT">
  <div class="wrap">
    <div class="bl-bar"><h2 class="thin h2" id="blT">${first ? 'Latest Articles' : 'Articles'}</h2>
      <ul class="tabs" aria-label="Topics"><li><a class="chip" href="${R}blog"${cat ? '' : ' aria-current="page"'}>All <small>${list.length}</small></a></li>${Object.entries(CATS).filter(([k]) => counts[k]).map(([k, t]) => `<li><a class="chip" href="${R}${topicPath(k)}"${cat === k ? ' aria-current="page"' : ''}>${t} <small>${counts[k]}</small></a></li>`).join('')}</ul></div>
    <div class="bl-grid">${items.map(x => articleCard(x, R)).join('')}</div>
    ${pages > 1 ? `<nav class="bl-pages" aria-label="Pages">${n > 1 ? `<a class="nx pv" href="${R}${topicPath(cat, n - 1)}" rel="prev">${I.arr}<span class="t">Newer</span></a>` : `<span class="nx pv off" aria-hidden="true">${I.arr}<span class="t">Newer</span></span>`}${Array.from({ length: pages }, (_, i) => i + 1).map(k => k === n ? `<span aria-current="page">${k}</span>` : `<a href="${R}${topicPath(cat, k)}" aria-label="Page ${k}">${k}</a>`).join('')}${n < pages ? `<a class="nx" href="${R}${topicPath(cat, n + 1)}" rel="next"><span class="t">Older</span>${I.arr}</a>` : `<span class="nx off" aria-hidden="true"><span class="t">Older</span>${I.arr}</span>`}</nav>
    <p class="bl-count">Page ${n} of ${pages}</p>` : ''}
    <p class="bl-note">${NOTE}</p>
  </div>
</section>`,
  }
}
function listPages(cat) {
  const all = cat ? list.filter(x => x.cat === cat) : list
  const featured = cat ? null : all[0], rest = cat ? all : all.slice(1)
  const pages = Math.max(1, Math.ceil(rest.length / PER))
  return Array.from({ length: pages }, (_, i) => listPage(cat, i + 1, rest.slice(i * PER, (i + 1) * PER), pages, i === 0 ? featured : null))
}

function articlePage(a) {
  const heads = a.body.filter(([k]) => k === 'h').map(([, v]) => v)
  const rel = a.related.map(s => PRODUCTS.find(p => p.slug === s)).filter(Boolean)
  const more = list.filter(x => x !== a).sort((x, y) => (y.cat === a.cat) - (x.cat === a.cat)).slice(0, 3)
  return {
    path: 'blog/' + a.slug, nav: 'blog',
    title: a.title, desc: a.excerpt, ogImage: a.img,
    crumbs: [['Blog', 'blog'], [a.title]],
    ld: [{ '@type': 'BlogPosting', headline: a.title, description: a.excerpt, datePublished: a.date, image: SITE + a.img, url: SITE + 'blog/' + a.slug, author: { '@type': 'Organization', name: 'DPY Mercantile Inc.' }, publisher: { '@type': 'Organization', name: 'DPY Mercantile Inc.', logo: { '@type': 'ImageObject', url: SITE + 'assets/brand/dpy-logo.png' } } }],
    css: CARD_CSS + `
.ar-head .h1{max-width:900px;font-size:clamp(34px,4.4vw,58px)}
.ar-meta{display:flex;flex-wrap:wrap;gap:6px 18px;margin:18px 0 0;padding:0;list-style:none;font-size:14px;color:var(--mute)}
.ar-meta b{color:var(--ink);font-weight:600}
.ar-cover{margin:36px 0 0;border-radius:28px;overflow:hidden;aspect-ratio:21/9;background:#E6EFF8;box-shadow:var(--sh)}
.ar-cover img{width:100%;height:100%;object-fit:cover}
.ar-cover.fit{display:grid;place-items:center;padding:28px;background:radial-gradient(80% 80% at 50% 40%,#fff,#E6EFF8)}
.ar-cover.fit img{width:auto;height:auto;max-height:100%;max-width:60%;object-fit:contain}
.ar-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:64px;align-items:start}
.ar-body{max-width:700px;font-size:17.5px;line-height:1.75;color:var(--ink2)}
.ar-body > p:first-child{font-size:20px;line-height:1.65;color:var(--ink)}
.ar-body p{margin:0 0 18px}
.ar-body h2{margin:40px 0 12px;font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.25;color:var(--ink);scroll-margin-top:90px}
.ar-body ul,.ar-body ol{margin:0 0 20px;padding-left:22px}
.ar-body li{margin:0 0 8px;padding-left:4px}
.ar-body li::marker{color:var(--blue);font-weight:700}
.ar-body b{color:var(--ink);font-weight:600}
.ar-body a{color:var(--blue);text-decoration:underline;text-underline-offset:3px}
.ar-tip{margin:28px 0;padding:20px 22px;border-radius:18px;background:#EAF2FA;border-left:4px solid var(--blue)}
.ar-tip b{display:block;margin-bottom:4px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--blue)}
.ar-tip p{margin:0;font-size:16.5px;color:var(--ink)}
.ar-nums{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:8px 0 24px}
.ar-nums div{padding:18px;border-radius:18px;background:#fff;box-shadow:var(--card)}
.ar-nums div:last-child{background:var(--ink);color:#fff}
.ar-nums b{display:block;font-size:26px;font-weight:600;letter-spacing:-.03em;color:inherit}
.ar-nums span{display:block;margin-top:4px;font-size:14px;line-height:1.4;color:var(--mute)}
.ar-nums div:last-child span{color:#B4C3D4}
.ar-note{margin:36px 0 0;padding:14px 16px;border-radius:14px;background:var(--soft);font-size:14px;line-height:1.55;color:var(--mute)}
.ar-side{position:sticky;top:96px;display:grid;gap:16px}
.ar-toc,.ar-ask{padding:22px;border-radius:22px;background:#fff;box-shadow:var(--card)}
.ar-toc b,.ar-ask b{display:block;margin-bottom:10px;font-size:15px;font-weight:600}
.ar-toc ol{margin:0;padding-left:18px;font-size:14.5px;line-height:1.45}
.ar-toc li{margin:0 0 8px}.ar-toc a{color:var(--ink2)}.ar-toc a:hover{color:var(--blue);text-decoration:underline}
.ar-ask{background:var(--ink);color:#fff}
.ar-ask p{margin:0 0 16px;font-size:14.5px;line-height:1.55;color:#B4C3D4}
.ar-ask .btn{width:100%}
.ar-rel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
/* on narrow screens the contents list would come after the article, so only the engineer box stays */
@media (max-width:980px){.ar-grid{grid-template-columns:minmax(0,1fr);gap:28px}.ar-side{position:static;grid-template-columns:minmax(0,1fr);max-width:700px}.ar-toc{display:none}.ar-cover{aspect-ratio:16/9}.ar-rel{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.ar-body{font-size:16.5px}.ar-body > p:first-child{font-size:18px}.ar-body h2{font-size:22px}.ar-side{grid-template-columns:minmax(0,1fr)}.ar-nums{grid-template-columns:minmax(0,1fr)}.ar-rel{grid-template-columns:minmax(0,1fr)}.ar-cover{border-radius:20px}}
`,
    body: R => {
      let n = 0
      const html = bodyHtml(a, R).replace(/<h2>/g, () => `<h2 id="${slugId(heads[n++] || 'part')}">`)
      return `
<section class="phead ar-head">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Blog', 'blog'], [a.title]])}
    <span class="kick">${CATS[a.cat]}</span><h1 class="thin h1">${esc(a.title)}</h1>
    <p class="lede">${esc(a.excerpt)}</p>
    <ul class="ar-meta"><li><b>${dateText(a.date)}</b></li><li>${minutes(a)} min read</li><li>By DPY's technical team</li></ul>
    <figure class="ar-cover${a.fit === 'contain' ? ' fit' : ''}">${img(R, a.img, a.alt, ' fetchpriority="high"', '(max-width:1240px) 100vw, 1240px')}</figure>
  </div>
</section>

<section class="sec" aria-label="Article">
  <div class="wrap ar-grid">
    <div class="ar-body">
${html}
      <p class="ar-note">${NOTE}</p>
    </div>
    <aside class="ar-side">
      ${heads.length > 1 ? `<nav class="ar-toc" aria-label="In this article"><b>In this article</b><ol>${heads.map(h => `<li><a href="#${slugId(h)}">${inline(h, R).replace(/<[^>]+>/g, '')}</a></li>`).join('')}</ol></nav>` : ''}
      <div class="ar-ask"><b>Talk to an engineer</b><p>Tell us about your home or building, and we'll recommend the right system after a free site visit.</p><a class="btn red" href="${R}contact#quote">Get a free quote ${I.arr}</a></div>
    </aside>
  </div>
</section>
${rel.length ? `
<section class="sec soft" aria-labelledby="rpT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Mentioned in this article</span><h2 class="thin h2" id="rpT">Related Products</h2></div><a class="link" href="${R}water-heaters">All products ${I.arr}</a></div>
    <div class="grid ar-rel">${rel.map(p => card(p, R)).join('')}</div>
  </div>
</section>` : ''}
<section class="sec" aria-labelledby="maT">
  <div class="wrap">
    <div class="sec-head"><div><span class="kick">Keep reading</span><h2 class="thin h2" id="maT">More Articles</h2></div><a class="link" href="${R}blog">All articles ${I.arr}</a></div>
    <div class="ar-rel">${more.map(x => articleCard(x, R)).join('')}</div>
  </div>
</section>`
    },
  }
}

export default [...listPages(''), ...Object.keys(CATS).filter(k => list.some(x => x.cat === k)).flatMap(listPages), ...ARTICLES.map(articlePage)]
