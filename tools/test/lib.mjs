// Shared helpers for the browser checks in tools/test. Each check file is a plain script:
// it prints one line per check ("ok" or "FAIL") and ends with "all ok" or "N FAILED", exiting 1 on failure.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, webkit } from 'playwright'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const BASE = (process.env.BASE || 'http://localhost:8787').replace(/\/$/, '')
// screenshots go here when SHOTS is set (a folder path); nothing is written otherwise
export const SHOTS = process.env.SHOTS || ''
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true })
export { chromium, webkit }

// every page in the generated sitemap, as a path ("/", "/water-heaters", ...)
export const sitemapPaths = () =>
  [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)

export const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
export const TABLET = { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true }
export const DESKTOP = { viewport: { width: 1440, height: 900 } }

let fails = 0, count = 0
export function check(name, ok, info) {
  count++
  if (!ok) fails++
  const extra = info === undefined ? '' : ' ' + (typeof info === 'string' ? info : JSON.stringify(info)).slice(0, 300)
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : extra}`)
  return ok
}
export function done(browser) {
  console.log(fails ? `${fails} FAILED (of ${count})` : `all ok (${count} checks)`)
  return (browser ? browser.close() : Promise.resolve()).then(() => process.exit(fails ? 1 : 0))
}

// a page that records script errors; scrolling through it triggers the scroll-in animations
export async function open(ctx, url, { wait = 600 } = {}) {
  const p = await ctx.newPage()
  p.errors = []
  p.on('pageerror', e => p.errors.push(e.message))
  p.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|Failed to load resource/.test(m.text())) p.errors.push(m.text()) })
  const res = await p.goto(BASE + url, { waitUntil: 'load' })
  p.status = res ? res.status() : 0
  if (wait) await p.waitForTimeout(wait)
  return p
}
export const revealAll = p => p.evaluate(() => document.querySelectorAll('[data-r]').forEach(e => e.classList.add('in')))
export const scrollTo = (p, sel, block = 'center') =>
  p.evaluate(([s, b]) => document.querySelector(s)?.scrollIntoView({ block: b }), [sel, block]).then(() => p.waitForTimeout(700))
export const shot = (p, name, opts = {}) => SHOTS ? p.screenshot({ path: path.join(SHOTS, name + '.png'), ...opts }) : null
