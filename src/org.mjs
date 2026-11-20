// DPY and its branches as structured data for About and Contact, taken from the homepage's approved block in
// index.html (the one place it is written), with the live domain swapped for this site's address. So the three pages
// can never describe the company differently.
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, SITE } from '../tools/lib.mjs'

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
if (!block) throw new Error('index.html: no structured data block')
const graph = JSON.parse(block[1].split('https://www.dpymi.com.ph/').join(SITE))['@graph']

export const ORG = graph.find(n => n['@type'] === 'Organization')
export const BRANCHES_LD = graph.filter(n => n['@type'] === 'HomeAndConstructionBusiness')
// a reference to the company, for a page that is about it
export const ORG_REF = { '@id': ORG['@id'] }
