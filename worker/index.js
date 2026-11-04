/* DPY website Worker.
   Everything is the static site (env.ASSETS) except POST /api/send, which emails a quote or service request
   to DPY's team through Resend. Settings are listed at the top of send.js. */
import { send } from './send.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/send') return send(request, env)
    return env.ASSETS.fetch(request)
  },
}
