// careers/job-template.html: the shared page layout for one job opening. The Worker (worker/careers.js) answers
// /careers/<role> by filling the %%JOB_...%% places with that role (from the saved list, or src/jobs.json).
// It isn't a page anyone visits: the Worker answers /careers/job-template with a 404, and it's left out of the sitemap.
export default {
  path: 'careers/job-template', nav: 'careers', noCta: true, noSitemap: true,
  title: '%%JOB_TITLE%% | Careers at DPY Mercantile',
  desc: '%%JOB_DESC%%',
  css: `
.jp-head .h1{margin-bottom:14px}
.jp-facts{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:22px 0 0;padding:0}
.jp-facts li{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:999px;background:#fff;box-shadow:var(--card);font-size:13.5px;font-weight:600;color:var(--ink2)}
.jp-facts svg{width:14px;height:14px}
.jp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,340px);gap:56px;align-items:start}
.jp-h{margin:40px 0 12px;font-size:22px;font-weight:600;letter-spacing:-.02em}
.jp-main > .jp-h:first-child{margin-top:0}
.jp-p{margin:0 0 12px;max-width:66ch;font-size:17px;line-height:1.7;color:var(--ink2)}
.jp-list{list-style:none;margin:0;padding:0;display:grid;gap:10px;max-width:66ch}
.jp-list li{display:flex;gap:12px;font-size:16px;line-height:1.6;color:var(--ink2)}
.jp-list svg{flex:none;width:20px;height:20px;margin-top:3px;padding:3px;border-radius:50%;background:#E8F2FC;color:var(--blue)}
.jp-note{margin:36px 0 0;padding:14px 16px;border-radius:14px;background:var(--soft);font-size:14px;color:var(--mute)}
.jp-side{position:sticky;top:100px}
.jp-card{display:grid;gap:16px;padding:26px;border-radius:24px;background:#fff;box-shadow:var(--card)}
.jp-card > b{font-size:19px;font-weight:600;letter-spacing:-.02em}
.jp-card dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0;font-size:15px}
.jp-card dt{color:var(--mute)}.jp-card dd{margin:0;font-weight:600}
.jp-card .btn{justify-content:center}
.jp-card small{font-size:13px;line-height:1.55;color:var(--mute)}.jp-card small a{color:var(--ink);text-decoration:underline}
@media (max-width:980px){.jp-grid{grid-template-columns:minmax(0,1fr);gap:36px}.jp-side{position:static}}
@media (max-width:640px){.jp-p{font-size:16px}.jp-list li{font-size:15.5px}}
`,
  body: () => `%%JOB_LD%%\n%%JOB_BODY%%`,
}
