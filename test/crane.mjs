// Contact form → crane, with EmailJS intercepted (no real email is sent).
import puppeteer from 'puppeteer-core'
const out = process.argv[2] ?? '/tmp'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'] })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
await p.setRequestInterception(true)
p.on('request', (r) => r.url().includes('emailjs.com') ? (r.method() === 'OPTIONS' ? r.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST' } }) : r.respond({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: 'OK' })) : r.continue())
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await p.goto('http://localhost:3300/?gl', { waitUntil: 'load' }); await wait(5000)
await p.evaluate(() => document.querySelector('.bp-surface .form').scrollIntoView({ block: 'center' })); await wait(2500)
await p.type('#cf-name', 'Test'); await p.type('#cf-mail', 'test@example.com'); await p.type('#cf-msg', 'Hello')
await p.click('.bp-surface .form button[type=submit]')
await wait(1200); await p.screenshot({ path: `${out}/crane-1.png` })
await wait(1400); await p.screenshot({ path: `${out}/crane-2.png` })
console.log(await p.evaluate(() => document.querySelector('.bp-surface .ok')?.textContent))
await b.close()
