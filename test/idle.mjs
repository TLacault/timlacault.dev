// Is the page alive with no input? Two frames 600 ms apart after 5 s idle must differ.
import puppeteer from 'puppeteer-core'
const out = process.argv[2]
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'] })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 })
await p.goto('http://localhost:3300/?gl', { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 9000))
await p.screenshot({ path: `${out}/idle-a.png` })
await new Promise((r) => setTimeout(r, 600))
await p.screenshot({ path: `${out}/idle-b.png` })
await b.close()
