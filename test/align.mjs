// The Lens only works if the x-ray copy lines up with the page: compare every element in each
// Blueprint's surface with its twin in the copy. usage: node test/align.mjs [path...]
import puppeteer from 'puppeteer-core'
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/work/badminton-records', '/freelance', '/source']
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
let bad = 0
for (const path of paths) {
  await p.goto(`http://localhost:3300${path}?nofield`, { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 2500))
  const res = await p.evaluate(() => [...document.querySelectorAll('.bp')].map((bp) => {
    const a = [...bp.querySelectorAll(':scope > .bp-surface *')], c = [...bp.querySelectorAll(':scope > .bp-xray .bp-copy *')]
    let worst = 0, at = ''
    a.forEach((el, i) => {
      const r1 = el.getBoundingClientRect(), r2 = c[i]?.getBoundingClientRect()
      if (!r2) return
      const d = Math.max(Math.abs(r1.left - r2.left), Math.abs(r1.top - r2.top))
      if (d > worst) { worst = d; at = el.tagName + '.' + [...el.classList].join('.') }
    })
    return { id: bp.id || bp.className, n: a.length, copy: c.length, worst: Math.round(worst), at }
  }))
  for (const r of res) { if (r.worst > 1 || r.n !== r.copy) bad++; console.log(path.padEnd(26), (r.worst > 1 || r.n !== r.copy ? 'MISALIGNED' : 'ok').padEnd(11), r.id.padEnd(24), r.worst + 'px', r.at, r.n !== r.copy ? `(${r.n} vs ${r.copy} elements)` : '') }
}
await b.close()
process.exit(bad ? 1 : 0)
