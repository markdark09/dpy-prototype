# DPY website: moving to Laravel (plan)

Status: **plan for review, nothing built.** Written 2026-11-17, reviewed the same day against Laravel Cloud's own documentation (domains, network, pricing) and Quavora's code (see "Review findings").

## Why we are moving

Three reasons, in Mark's words of 2026-11-17:

1. **DPY's staff edit everything themselves:** products, specs, photos, blog articles, job openings and site details, from one admin, with no developer.
2. **Leads go into Quavora:** quote and service requests from the website arrive in DPY's Quavora CRM as leads, not only as emails.
3. **Our standard stack:** Makarios supports Laravel apps, so DPY's site should be one, built the way Quavora is.

What we keep from the prototype: **the design, the copy, the motion and the speed.** Nothing about the look changes. The prototype stays online at prototype.dpy-mi.workers.dev as the reference until the new site goes live.

## The setup, in one picture

```
Visitor ──> Cloudflare (DNS, cache, Turnstile) ──> Laravel Cloud, Singapore
                                                     ├─ the website (Blade pages)
                                                     ├─ /admin (Filament, DPY staff)
                                                     ├─ queue + scheduler
                                                     └─ Postgres
            Photos and CVs ──> Cloudflare R2        Email ──> Resend
            Quote and service forms ──> Quavora (new web-form intake) ──> a lead
```

## Decisions (each with my recommendation)

| # | Decision | Recommendation | Why |
|---|---|---|---|
| 1 | Where the code lives | A new repo, `markdark09/dpy-website` | Clean start; the prototype repo stays the frozen reference |
| 2 | Framework | **Laravel 13, PHP 8.3** | Same as Quavora, so one way of working, testing and deploying |
| 3 | Pages | **Blade templates** that reuse the prototype's HTML, CSS and scripts as they are | Keeps the design and speed; search engines read plain HTML best. No single-page app for a marketing site |
| 4 | Admin | **Filament 5** at `/admin` | The standard Laravel admin, already in Quavora; forms, tables, uploads and roles come built in |
| 5 | Hosting | **Laravel Cloud, Singapore**, Laravel Serverless Postgres | Mark's choice; same as Quavora's API. For the live site, neither the app nor the database scales to zero, so no visitor waits for a cold start; previews may sleep |
| 6 | Speed | Laravel Cloud's own edge network (it is Cloudflare, 335 cities) caches public pages for 60 seconds, and a page cache inside Laravel clears itself when staff save a change | Pages stay as fast as today's static ones; an edit shows within about a minute. No second Cloudflare layer needed; DPY's own Cloudflare is used only for DNS and Turnstile |
| 7 | Files | **Cloudflare R2**: photos public, CVs private | Same as Quavora. Uploads are resized to sharp WebP versions automatically (this fixes the "pictures not HD" problem for good) |
| 8 | Email | **Resend** | Already used by the prototype and Quavora |
| 9 | Spam | **Cloudflare Turnstile** on every form | Invisible to most people; checked on the server |
| 10 | Errors | **Sentry** | Same as Quavora |
| 11 | Staff sign-in | Email and password with two-factor, inside Filament | Replaces the Cloudflare Access setup the prototype needed; no Cloudflare account for HR |

## Review findings (2026-11-17)

Things a quick plan would have got wrong, found by checking Laravel Cloud's documentation and Quavora's code:

1. **Caching and forms clash in a default Laravel app.** Laravel Cloud's edge does not cache a response that sets a cookie, and Laravel puts a session cookie and a form token on every page by default. So public pages run **without sessions**, and the forms post to **stateless endpoints** (Turnstile, same-origin check, rate limit, honeypot), as the prototype's forms already do. No form token is ever in a cached page, so visitors never see "page expired".
2. **The edge cache is only cleared on deploy or by hand.** Public pages are sent with `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`: the edge keeps a page a minute, Laravel's own page cache is cleared on every save, so staff edits show within about a minute. Images and scripts have versioned names and are cached for a year.
3. **Laravel Cloud blocks `/wp-content`, `/wp-admin`, `/wp-json` and `.php` addresses at the edge** (path blocking, on by default). That is good for security, but old links to DPY's PDF catalogues under `/wp-content/uploads/` will show "not found". Plan: keep path blocking on, and give the PDFs worth keeping (HAASE catalogue, Rotex brochure, spec sheets) new addresses on the product pages. `/wp-login.php` and `/wp-admin` simply stop answering, which is fine.
4. **The firewall can block server-to-server calls that use a default library name.** The site's calls to Quavora send a clear `User-Agent: DPY-Website/1.0`.
5. **Launch must not break DPY's email.** dpymi.com.ph's DNS is already on Cloudflare and its mail runs on `mail.dpymi.com.ph`. Launch only adds Laravel Cloud's records and Resend's sending records (SPF/DKIM) beside the existing ones; the MX and mail host records are left exactly as they are, and mail delivery is tested the same day.
6. **Backups must be switched on and tested.** Quavora's notes record a database cluster with no snapshots, and Laravel Cloud's Postgres point-in-time recovery is a setting (0 to 30 days). Production gets **14 days of point-in-time recovery**, plus a **nightly export of the site's content and requests to R2** (written in PHP, so it does not depend on `pg_dump` being installed), kept 30 days, with a restore test each quarter.
7. **Sending a lead twice must not create two.** Each form submission gets an ID that travels with it to Quavora, so a retry after a timeout updates the same lead instead of adding a duplicate.
8. **Some edge features depend on the plan:** basic rate limiting needs Laravel Cloud's Growth plan or higher; bot categories need Business. The site also rate-limits forms itself, so it is protected on any plan.

## What DPY's staff will be able to edit

| Area | What they can change | Who |
|---|---|---|
| Products | Name, brand, type, description, key figures, "best for", features, warranty, photos, related products, which "How it works" drawing it uses, published or hidden | Editor, Admin |
| Specs | Spec tables per product (columns, rows, notes), or the "ask for the sheet" note | Editor, Admin |
| Blog | Articles with cover photo, topic, body, related products; draft, scheduled or published; preview before publishing | Editor, Admin |
| Careers | Job openings, as in the prototype's admin (add, edit, close, reorder) | HR, Admin |
| Applications | Received job applications with the CV, and their status | HR, Admin |
| Requests | Every quote and service request received, and whether it reached Quavora | Sales, Admin |
| Site details | Phone numbers, emails, hours, social links, branches (now Manila, Cebu, Davao) | Admin |
| Clients and reviews | Client logos for the walls, and real reviews to replace the samples | Editor, Admin |

Stays in code (on purpose): the homepage motion, the "How it works" drawings (staff pick the kind, the drawing adapts), and the layout. Every change by staff is logged with who and when.

## Admin UX: the standard it has to meet

The admin is used by sales and HR staff, not developers, so it must be hard to break the site with it:

- **Live preview:** editing a product or article shows the real page beside the form, updating as you type, before anything is published.
- **The design's limits are the form's limits:** a title that would wrap badly, a fifth "How it works" step, or a missing photo description is caught with a plain message and a character counter, not discovered on the live site.
- **Photos:** drag and drop, crop and focal point, a description required (for accessibility and Google), automatic sharp WebP versions in every size, and a warning when a photo is too small to look sharp.
- **Safe addresses:** a page's address is set once; if staff change it later, the old one redirects automatically.
- **Draft, schedule, publish, hide**, with a history of changes and one-click restore; a warning before leaving unsaved changes.
- **Order by dragging** (products in a category, job openings, client logos).
- **A dashboard that answers "what needs me today":** new requests and applications, anything that failed to reach Quavora, and articles scheduled this week.
- **Phone-friendly**, with search and filters on every list, and two-factor sign-in for Admins.

## Public site: what "advanced" means here

- **Everything the prototype does stays:** the motion, How it works diagrams, the savings calculator, the quote list, compare, the quiz, the assistant, careers and the blog.
- **New:** search across products and articles; real reviews and project photos from the admin; spec sheets as downloadable PDFs.
- **Measured, not claimed:** Lighthouse 95+ on every page type (100 where the prototype has 100), page paint under 2.5 s on a mid-range phone, no layout shift, WCAG 2.2 AA, and the browser tests at phone, tablet and desktop sizes.
- **Privacy built in:** visitor details only where they are needed; requests kept 24 months and applications 12 months, then deleted automatically; consent recorded with each form; data stays in Singapore.
- **Analytics without cookies:** Cloudflare Web Analytics (free), plus form counts by page in the admin, so DPY sees which pages bring requests.

## Forms and Quavora

Every form submission is **saved in the website's database first**, so nothing is ever lost. Then, in the background, with retries:

1. **An email** goes to sales@, support@ or careers@ (as today).
2. **Quote and service requests go to Quavora** as leads: a quote becomes a sales lead and a service request becomes a Service lead (the kind from Quavora plan 1), with Source "Website" and the visitor's details and message. If Quavora is down, the site keeps the request and sends it when Quavora is back. The admin shows each request's status.
3. **Job applications stay on the website** (admin plus email to careers@). Quavora's HR is not in DPY's subscription.

**Quavora needs one new, general feature for this: Web form intake.** Today a lead can only be created by a signed-in user. Following the standing rule that Quavora is for every workspace, not one client:

- Any workspace Admin can create a "web form": it gets a secret key, a lead kind, a source, and who it is assigned to.
- A website posts to `POST /api/v1/web-forms/{form}/submissions` with that key (server to server only; never in the browser).
- Quavora checks the key, limits the rate, removes duplicates by phone or email within a short time, creates the lead with an activity note, and tells the assignee.
- Workspace isolation, roles and tests follow Quavora's usual rules. It is its own plan and PR in the Quavora repo (PRs to `dev`), before the DPY site connects to it.

## Addresses and search

- **Same addresses as the prototype** (`/products/rheem`, `/blog/...`, `/careers/...`), so no link changes.
- **Every redirect from the old WordPress site** carries over (48 old addresses, 99 rules; stored in the database, editable by Admin).
- The sitemap, structured data for Google (products, articles, jobs, the three branches) and share previews are generated from the database.
- `noindex` until launch day; then indexing on, the sitemap sent to Search Console.

## Testing

- **Pest** (Laravel's test runner) for the server: forms, Quavora sending and retries, admin permissions, caching, redirects. The prototype's 29 unit tests are rewritten in Pest first.
- **The prototype's browser test suite runs against the Laravel site** (it already takes a `BASE` address). Its several hundred checks across pages, links, forms, careers, design and motion are the proof that the Laravel site matches the prototype, page by page.
- Lighthouse on the main pages must match the prototype (100 performance on product and careers pages).

## Moving the content

An import command fills the database from the prototype's own files, so nothing is retyped: 24 products and their specs, 11 articles, 6 job openings, branches, clients, redirects and site details.

## Phases

Each phase is a branch and a PR to `main`, checked before the next starts.

| Phase | What | Done when |
|---|---|---|
| 0. Setup | Repo, Laravel 13, CI (Pint, PHPStan, Pest, the browser suite), Laravel Cloud project (Singapore) with Postgres, R2, Resend, Sentry, Turnstile keys, nightly backup to R2 | A "hello" page deploys from `main`, and a backup restores |
| 1. Public site | Blade layout and every page, data from the database (imported), page cache | The prototype's browser tests pass against it |
| 2. Admin | Filament: products, specs, photos, blog, careers, site details, clients; roles and change log | DPY's staff can change each item and see it live within seconds |
| 3. Forms | Saved first, then email; Turnstile; applications with CVs in R2 | Each form tested through every outcome |
| 4. Quavora | Web form intake in Quavora (its own PR), then the website sends to it | A test quote and service request appear in a test workspace as leads |
| 5. Polish | Speed, accessibility, security review, SEO checks | Lighthouse and browser tests match the prototype |
| 6. Launch | DPY review on the Laravel Cloud address, staff training, the new records in DPY's Cloudflare (mail records untouched), Search Console | The live domain serves the new site; old addresses redirect; DPY's email still arrives |

Rollback at launch: point the domain back. The old WordPress site stays untouched until DPY signs off.

## What is needed from others

- **DPY:** who gets admin access and which role (Admin, Editor, HR, Sales); the content still owed (product photos, job details, review of the sample articles, real reviews); access to dpymi.com.ph's DNS for launch.
- **Mark:** approve this plan; create the Laravel Cloud project and add the billing; say whether Quavora's Web form intake goes in now.

## Costs to confirm

Laravel Cloud is billed as a plan plus usage (compute, Postgres, bandwidth). The current plan names and prices differ between Laravel's pages, so the exact monthly figure is confirmed on cloud.laravel.com/docs/pricing when the project is created. R2, Resend and Turnstile stay on their free tiers at DPY's volume.

## What is still not certain

- **Exact monthly cost:** confirmed when the project is created (Laravel's pages show different plan names and prices).
- **Who has DPY's Cloudflare login:** dpymi.com.ph's DNS is already on Cloudflare (checked 2026-11-17: nameservers bayan and sofia.ns.cloudflare.com; mail on mail.dpymi.com.ph). Launch is adding the records Laravel Cloud shows in that account; no DNS move, and the mail records are not touched.
- **Preview sites per PR:** Laravel Cloud offers them on every plan (unlimited on Growth and Business; one preview automation on Starter), each with its own database that sleeps when idle. Used for every PR.

## Open questions

1. Repo name: `dpy-website`? (recommended)
2. Does Quavora's Web form intake go first, or does the site launch with email only and connect to Quavora after? (Recommended: build it in Phase 4 as planned, so leads arrive in Quavora from day one.)
3. Who at DPY is Admin?
