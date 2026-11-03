// Lists elements wider than the viewport (sideways scroll hunting).
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true })
const p = await b.newPage(); if (process.env.LANG_FR) await p.evaluateOnNewDocument(() => localStorage.setItem('tl-lang', 'fr')); await p.setViewport({ width: +(process.argv[2] ?? 1440), height: 900 })
await p.goto('http://localhost:3300' + (process.argv[3] ?? '/') + '?nofield', { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 3000))
console.log(await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, ...[...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.track')).slice(0, 8).map((e) => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right))]))
await b.close()
