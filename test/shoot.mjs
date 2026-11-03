// Renders the site in system Chrome, logs console errors, screenshots key moments.
// usage: node test/shoot.mjs [url] [outdir] [width]
import puppeteer from 'puppeteer-core'
const [url = 'http://localhost:3300', out = '/tmp', width = '1440'] = process.argv.slice(2)
const w = +width, h = w > 800 ? 900 : 844
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: (process.env.CHROME_ARGS ?? '--enable-unsafe-webgpu').split(' '),
})
const page = await browser.newPage()
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
page.on('console', (m) => ['error', 'warn'].includes(m.type()) && console.log(`[${m.type()}]`, m.text().slice(0, 300)))
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.evaluateOnNewDocument(() => {
  const real = window.matchMedia.bind(window)
  window.matchMedia = (q) => q.includes('pointer: fine') ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : real(q)
})
await page.goto(url, { waitUntil: 'load' })
console.log('gpu', await page.evaluate(() => !!navigator.gpu && !!(navigator.gpu.requestAdapter && 1)))
await new Promise((r) => setTimeout(r, 9000))
await page.screenshot({ path: `${out}/1-hero.png` })
await page.mouse.move(w * 0.3, h * 0.3); await page.mouse.move(w * 0.32, h * 0.32, { steps: 10 })
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: `${out}/2-lens.png` })
await page.keyboard.down('Space'); await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${out}/3-held.png` })
await page.keyboard.up('Space')
await page.evaluate(() => document.querySelector('#path').scrollIntoView())
await new Promise((r) => setTimeout(r, 9000))
await page.screenshot({ path: `${out}/4-path.png` })
console.log('live', await page.evaluate(() => document.documentElement.className))
await browser.close()
