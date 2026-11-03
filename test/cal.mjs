// "Réserver un créneau" opens the Cal.com popup over the page (no navigation).
import puppeteer from 'puppeteer-core'
const out = process.argv[2] ?? '/tmp'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await p.goto('http://localhost:3300/freelance?nofield', { waitUntil: 'load' }); await wait(4000)
await p.evaluate(() => document.querySelector('#start').scrollIntoView()); await wait(1500)
await p.click('.bp-surface .ways button')
await wait(6000)
console.log('url', p.url())
console.log('modal', await p.evaluate(() => {
  const m = document.querySelector('cal-modal-box')
  const f = m?.shadowRoot?.querySelector('iframe') ?? document.querySelector('iframe[src*="cal.com"]')
  return { box: !!m, iframe: f?.src?.slice(0, 60) ?? null }
}))
await p.screenshot({ path: `${out}/cal.png` })
await b.close()
