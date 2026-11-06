// npm run test:pages: runs every check in this folder against the local site and reports one result.
// If nothing answers at BASE (default http://localhost:8787), it starts `wrangler dev` for the run and stops it after.
// Options: ONLY=forms,careers to run some checks; SHOTS=/some/folder to save screenshots; BASE=https://... for another copy.
// First time on a machine: `npx playwright install chromium` (and `npx playwright install-deps chromium` on Linux, needs sudo).
import { spawn } from 'node:child_process'
import path from 'node:path'
import { ROOT, BASE } from './lib.mjs'

const ALL = ['server', 'pages', 'forms', 'careers', 'design', 'motion']
const only = (process.env.ONLY || '').split(',').map(s => s.trim()).filter(Boolean)
const checks = only.length ? ALL.filter(c => only.includes(c)) : ALL

const up = () => fetch(BASE + '/', { redirect: 'manual' }).then(r => r.status < 500).catch(() => false)
let server = null
if (!(await up())) {
  if (!/^http:\/\/(localhost|127\.0\.0\.1):8787$/.test(BASE)) { console.error(`Nothing answers at ${BASE}.`); process.exit(1) }
  console.log('Starting wrangler dev for this run...')
  server = spawn('npx', ['wrangler', 'dev', '--port', '8787', '--live-reload=false'], { cwd: ROOT, stdio: 'ignore', detached: true })
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise(r => setTimeout(r, 1000))
  if (!(await up())) { console.error('wrangler dev did not start within 60 s.'); process.kill(-server.pid); process.exit(1) }
}

const results = []
for (const name of checks) {
  console.log(`\n== ${name}`)
  const started = Date.now()
  const code = await new Promise(res => {
    const c = spawn(process.execPath, [path.join(ROOT, 'tools/test', name + '.mjs')], { stdio: ['ignore', 'pipe', 'inherit'], env: process.env })
    c.stdout.on('data', d => {
      // passing lines are kept quiet; failures, skips and the summary are shown
      for (const line of d.toString().split('\n')) if (line && !line.startsWith('ok  ')) console.log(line)
    })
    c.on('close', res)
  })
  results.push({ name, ok: code === 0, s: Math.round((Date.now() - started) / 1000) })
}
if (server) process.kill(-server.pid)

console.log('\n' + results.map(r => `${r.ok ? 'pass' : 'FAIL'}  ${r.name} (${r.s} s)`).join('\n'))
process.exit(results.every(r => r.ok) ? 0 : 1)
