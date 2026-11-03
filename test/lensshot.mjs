// Screenshot the lens over a padded section (project gallery), where the circles used to split.
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => { const real = window.matchMedia.bind(window); window.matchMedia = (q) => q.includes('pointer: fine') ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : real(q) })
await p.goto('http://localhost:3300/work/badminton-records?nofield', { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 4000))
await p.evaluate(() => document.querySelector('#gallery').scrollIntoView()); await new Promise((r) => setTimeout(r, 1500))
await p.mouse.move(1000, 420); await p.mouse.move(1050, 450, { steps: 8 }); await new Promise((r) => setTimeout(r, 1200))
console.log(await p.evaluate(() => { const bp = document.querySelector('#gallery'); const cs = getComputedStyle(bp); return [cs.getPropertyValue('--lr'), cs.getPropertyValue('--cx'), cs.getPropertyValue('--sx'), document.documentElement.className] }))
await p.screenshot({ path: process.argv[2] })
await b.close()
