import gsap from 'gsap'
import type Lenis from 'lenis'

// Pointer, Lens spring and the CSS variables every <Blueprint> reads. Runs after motion.client.ts (alphabetical).
export default defineNuxtPlugin((nuxt) => {
  const lenis = nuxt.$lenis as Lenis | null
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const root = document.documentElement
  stage.lrRest = fine ? 64 : 0

  const full = () => Math.hypot(innerWidth, innerHeight)
  const lens = { x: -9999, y: -9999, r: 0 }
  const toX = gsap.quickTo(lens, 'x', { duration: 0.35, ease: 'power3' })
  const toY = gsap.quickTo(lens, 'y', { duration: 0.35, ease: 'power3' })
  const toR = gsap.quickTo(lens, 'r', { duration: 0.6, ease: 'power3.inOut' })
  const radius = () => toR(stage.held ? full() : stage.lrRest)

  let lastMove = 0
  addEventListener('pointermove', (e) => {
    const now = performance.now(), dt = Math.max(now - lastMove, 8) / 1000
    if (lastMove && stage.px > -9000) { stage.vx += ((e.clientX - stage.px) / dt - stage.vx) * 0.5; stage.vy += ((e.clientY - stage.py) / dt - stage.vy) * 0.5 }
    lastMove = now
    stage.px = e.clientX; stage.py = e.clientY
    if (lens.x < -9000) { lens.x = e.clientX; lens.y = e.clientY; radius() } // first move: no fly-in from the corner
    toX(e.clientX); toY(e.clientY)
  }, { passive: true })
  document.addEventListener('pointerleave', () => { stage.px = stage.py = -9999; if (!stage.held) toR(0) })
  document.addEventListener('pointerenter', radius)

  const typing = (t: EventTarget | null) => t instanceof HTMLElement && t.closest('input, textarea, [contenteditable]')
  addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || typing(e.target)) return
    e.preventDefault()
    if (e.repeat || stage.held) return
    stage.held = true; root.classList.add('lens-held'); radius()
  })
  addEventListener('keyup', (e) => {
    if (e.code !== 'Space' || !stage.held) return
    stage.held = false; root.classList.remove('lens-held'); radius()
  })

  // Touch: long-press opens a lens under the finger, dragging moves it, lifting closes it.
  if (!fine) {
    let timer: ReturnType<typeof setTimeout> | undefined
    let on = false
    addEventListener('touchstart', (e) => {
      const t = e.touches[0]!
      timer = setTimeout(() => { on = true; lens.x = t.clientX; lens.y = t.clientY - 70; toX(lens.x); toY(lens.y); stage.lrRest = 92; radius() }, 380)
    }, { passive: true })
    addEventListener('touchmove', (e) => {
      if (!on) return clearTimeout(timer)
      e.preventDefault()
      const t = e.touches[0]!
      toX(t.clientX); toY(t.clientY - 70) // lens sits above the finger so it isn't hidden by it
    }, { passive: false })
    addEventListener('touchend', () => { clearTimeout(timer); if (on) { on = false; stage.lrRest = 0; radius() } })
  }

  gsap.ticker.add(() => {
    stage.lx = lens.x; stage.ly = lens.y; stage.lr = lens.r
    stage.velocity = lenis?.velocity ?? 0
    stage.vx *= 0.85; stage.vy *= 0.85 // the wake fades once the pointer stops
    for (const el of stage.blueprints) {
      const b = el.getBoundingClientRect()
      if (b.bottom < -lens.r || b.top > innerHeight + lens.r) continue
      el.style.setProperty('--cx', `${lens.x - b.left}px`)
      el.style.setProperty('--cy', `${lens.y - b.top}px`)
      el.style.setProperty('--lr', `${lens.r}px`)
    }
  })
})
