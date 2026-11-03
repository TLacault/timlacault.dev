// CTAs rendered as <button> must not show the browser's default border.
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true })
const p = await b.newPage(); await p.goto('http://localhost:3300/freelance?nofield', { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 2500))
const w = await p.evaluate(() => [...document.querySelectorAll('.bp-surface button.btn')].map((e) => getComputedStyle(e).borderTopWidth))
console.log('button.btn borders', w); await b.close(); process.exit(w.every((x) => x === '0px') ? 0 : 1)
