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

const index = {
  path: 'blog', nav: 'blog',
  title: 'Blog: Hot Water Guides & News',
  desc: 'Practical guides on choosing, running and looking after water heaters and central hot water systems in the Philippines, from DPY Mercantile.',
  crumbs: [['Blog']],
  css: CARD_CSS + `
.bl-feat{margin-top:44px}
.bl-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:22px}
.bl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.bl-grid .bc[hidden]{display:none}
.bl-note{margin:30px 0 0;font-size:14px;color:var(--mute);text-align:center}
@media (max-width:980px){.bl-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.bl-grid{grid-template-columns:minmax(0,1fr)}}
`,
  body: R => `
<section class="phead">
  <span class="glow"></span>
  <div class="wrap">
    ${crumbsHtml(R, [['Blog']])}
    <span class="kick">Blog</span><h1 class="thin h1">Hot Water<br>Guides &amp; News</h1>
    <p class="lede">Practical guides on choosing, running and looking after water heaters and hot water systems, from the team that installs and services them.</p>
    <div class="bl-feat">${articleCard(list[0], R, { h: 'h2', big: true })}</div>
  </div>
</section>

<section class="sec" aria-labelledby="blT">
  <div class="wrap">
    <div class="bl-bar"><h2 class="thin h2" id="blT">All Articles</h2>
      <ul class="tabs" aria-label="Filter articles by topic"><li><button class="chip" type="button" data-f="" aria-pressed="true">All <small>${list.length - 1}</small></button></li>${Object.entries(CATS).map(([k, t]) => { const n = list.slice(1).filter(a => a.cat === k).length; return n ? `<li><button class="chip" type="button" data-f="${k}" aria-pressed="false">${t} <small>${n}</small></button></li>` : '' }).join('')}</ul></div>
    <div class="bl-grid">${list.slice(1).map(a => articleCard(a, R)).join('')}</div>
    <p class="bl-note">${NOTE}</p>
  </div>
</section>`,
  js: `
// topic filters (also from ?topic= in the address, so a topic can be linked)
const F = $$('[data-f]'), C = $$('.bl-grid .bc')
const pick = k => { F.forEach(b => b.setAttribute('aria-pressed', b.dataset.f === k)); C.forEach(c => { c.hidden = !!k && c.dataset.cat !== k; c.classList.add('in') }) }
F.forEach(b => b.addEventListener('click', () => { pick(b.dataset.f); const u = new URL(location.href); b.dataset.f ? u.searchParams.set('topic', b.dataset.f) : u.searchParams.delete('topic'); history.replaceState(null, '', u) }))
const want = new URLSearchParams(location.search).get('topic'); if (want && F.some(b => b.dataset.f === want)) pick(want)
`,
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

export default [index, ...ARTICLES.map(articlePage)]
