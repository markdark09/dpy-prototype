/* DPY website Worker.
   Everything is the static site (env.ASSETS), except:
     POST /api/send              emails a quote, service request or job application through Resend (send.js)
     /careers, /careers/<role>   the openings, from the list HR saves on the admin page (careers.js)
     /sitemap.xml                with the current openings (careers.js)
     /admin, /api/admin/*        the private admin page for job openings, behind Cloudflare Access (admin.js)
   wrangler.jsonc's run_worker_first lists these paths; every other address is served straight from the files. */
import { send } from './send.js'
import { careers, sitemap } from './careers.js'
import { adminPage, adminApi } from './admin.js'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/send') return send(request, env)
    if (pathname === '/api/admin/jobs') return adminApi(request, env)
    if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminPage(request, env)
    if (pathname === '/careers' || pathname === '/careers.html' || pathname.startsWith('/careers/')) return careers(request, env)
    if (pathname === '/sitemap.xml') return sitemap(request, env)
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 })
    return env.ASSETS.fetch(request)
  },
}
