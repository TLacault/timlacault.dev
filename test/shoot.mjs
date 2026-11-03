// Renders the site in system Chrome, logs console errors, screenshots key moments.
// usage: node test/shoot.mjs [url] [outdir] [width]
// Default flags put headless Chrome on the real GPU (ANGLE GL-EGL), WebGL backend via `?gl`. Without a GPU use
// CHROME_ARGS='--use-angle=swiftshader --enable-unsafe-swiftshader' and `?gl&n=0.3` so the sim can settle.
import puppeteer from 'puppeteer-core'
const [url = 'http://localhost:3300/?gl&n=0.3', out = '/tmp', width = '1440'] = process.argv.slice(2)
const w = +width, h = w > 800 ? 900 : 844
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: true,
  args: (process.env.CHROME_ARGS ?? '--use-gl=angle --use-angle=gl-egl --ignore-gpu-blocklist').split(' '),
})
const page = await browser.newPage()
if (process.env.LANG_FR) await page.evaluateOnNewDocument(() => localStorage.setItem('tl-lang', 'fr'))
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
page.on('console', (m) => ['error', 'warn'].includes(m.type()) && console.log(`[${m.type()}]`, m.text().slice(0, 300)))
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
if (w > 800) await page.evaluateOnNewDocument(() => {
  const real = window.matchMedia.bind(window)
  window.matchMedia = (q) => q.includes('pointer: fine') ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : real(q)
})
await page.goto(url, { waitUntil: 'load' })
for (const t of [600, 1300, 2000, 2700, 3400]) { await wait(t - (t > 600 ? 700 : 0)); await page.screenshot({ path: `${out}/0-loader-${t}.png` }) }
await wait(5000)
await page.screenshot({ path: `${out}/1-hero.png` })
await page.mouse.move(w * 0.3, h * 0.3); await page.mouse.move(w * 0.32, h * 0.32, { steps: 10 })
await wait(1500)
await page.screenshot({ path: `${out}/2-lens.png` })
await page.keyboard.down('Space'); await wait(1500)
await page.screenshot({ path: `${out}/3-held.png` })
await page.keyboard.up('Space')
const shot = async (name, fn) => { await page.evaluate(fn); await wait(6000); await page.screenshot({ path: `${out}/${name}.png` }) }
await shot('4-work', () => document.querySelector('.exhibit').scrollIntoView())
await shot('5-local', () => document.querySelector('#local').scrollIntoView())
await shot('6-path', () => scrollTo(0, document.querySelector('#path .wrap').getBoundingClientRect().top + scrollY + innerHeight * 1.2))
await shot('6b-path-end', () => { const w = document.querySelector('#path .wrap').getBoundingClientRect(); scrollTo(0, w.top + scrollY + w.height - innerHeight - 10) })
await shot('7-contact', () => document.querySelector('#contact').scrollIntoView())
await page.goto(url.replace(/\/(\?|$)/, '/work/badminton-records$1'), { waitUntil: 'load' }); await wait(7000)
await page.screenshot({ path: `${out}/8-case.png` })
await shot('9-case-story', () => document.querySelector('#story').scrollIntoView())
await shot('9b-case-gallery', () => document.querySelector('#gallery').scrollIntoView())
await shot('9c-case-next', () => document.querySelector('#next').scrollIntoView())
for (const [name, path] of [['10-freelance', '/freelance'], ['11-source', '/source']]) {
  await page.goto(url.replace(/\/(\?|$)/, path + '$1'), { waitUntil: 'load' }); await wait(6000)
  await page.screenshot({ path: `${out}/${name}.png` })
}
console.log('classes', await page.evaluate(() => document.documentElement.className), 'scrollW', await page.evaluate(() => document.documentElement.scrollWidth))
await browser.close()
