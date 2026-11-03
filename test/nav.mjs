// Home → project (click the frame) → back via the dock's "Work": URL, scroll target, errors, Field alive.
import puppeteer from 'puppeteer-core'
const out = process.argv[2] ?? '/tmp'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'] })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
const errs = []
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await p.goto('http://localhost:3300/?gl', { waitUntil: 'load' }); await wait(5000)
await p.evaluate(() => document.querySelector('.bp-surface .exhibit').scrollIntoView()); await wait(1500)
await p.click('.bp-surface .exhibit .frame'); await wait(4000)
console.log('after click', p.url(), await p.evaluate(() => [scrollY, document.querySelector('.loader') ? 'loader!' : 'no loader', document.documentElement.className]))
await p.screenshot({ path: `${out}/nav-case.png` })
await p.evaluate(() => [...document.querySelectorAll('.dock a')].find((a) => a.textContent === 'Work').click()); await wait(4000)
console.log('after dock', p.url(), await p.evaluate(() => [Math.round(document.getElementById('work').getBoundingClientRect().top), scrollY]))
await p.screenshot({ path: `${out}/nav-back.png` })
console.log('errors', errs)
await b.close()
