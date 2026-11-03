// Records the first seconds of a load as frames (CDP screencast) to catch blinks.
import puppeteer from 'puppeteer-core'
import { writeFileSync, mkdirSync } from 'node:fs'
const out = process.argv[2]; mkdirSync(out, { recursive: true })
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'] })
const p = await b.newPage(); await p.setViewport({ width: 960, height: 600 })
const s = await p.createCDPSession()
let n = 0; const t0 = Date.now()
s.on('Page.screencastFrame', async (f) => {
  writeFileSync(`${out}/f${String(n++).padStart(3, '0')}-${Date.now() - t0}.jpg`, Buffer.from(f.data, 'base64'))
  await s.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {})
})
await s.send('Page.startScreencast', { format: 'jpeg', quality: 60, everyNthFrame: 1 })
await p.goto(process.argv[3] ?? 'http://localhost:3300/?gl', { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 2500))
await s.send('Page.stopScreencast'); await b.close()
console.log(n, 'frames')
