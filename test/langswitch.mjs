// Switch EN → FR on the contact section: frames of the transition, then the glyph title must re-form
// into the French words without any scrolling.
import puppeteer from 'puppeteer-core'
import { writeFileSync, mkdirSync } from 'node:fs'
const out = process.argv[2]; mkdirSync(out, { recursive: true })
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'] })
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 800 })
await p.evaluateOnNewDocument(() => localStorage.setItem('tl-lang', 'en'))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await p.goto(process.argv[3] ?? 'http://localhost:3300/?gl', { waitUntil: 'load' }); await wait(5000)
await p.evaluate(() => document.querySelector('#contact').scrollIntoView()); await wait(3000)
await p.screenshot({ path: `${out}/before.png` })
const s = await p.createCDPSession(); let n = 0; const t0 = Date.now()
s.on('Page.screencastFrame', async (f) => { writeFileSync(`${out}/t${String(n++).padStart(3, '0')}-${Date.now() - t0}.jpg`, Buffer.from(f.data, 'base64')); await s.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}) })
await s.send('Page.startScreencast', { format: 'jpeg', quality: 50 })
await p.evaluate(() => [...document.querySelectorAll('.lang button')].find((x) => x.textContent === 'FR').click())
await wait(1200); await s.send('Page.stopScreencast')
await wait(2500)
await p.screenshot({ path: `${out}/after.png` })
console.log(n, 'frames', await p.evaluate(() => [document.documentElement.lang, document.querySelector('.bp-surface .contact .title, .contact .bp-surface .title')?.textContent?.trim()]))
await b.close()
