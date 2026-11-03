import gsap from 'gsap'
import type Lenis from 'lenis'

// Pointer, Lens spring, idle autopilot and the CSS variables every <Blueprint> reads.
// Runs after motion.client.ts (alphabetical).
export default defineNuxtPlugin((nuxt) => {
  const lenis = nuxt.$lenis as Lenis | null
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const root = document.documentElement
  const REST = fine ? 64 : 0
  stage.lrRest = REST

  const full = () => Math.hypot(innerWidth, innerHeight)
  const lens = { x: -9999, y: -9999, r: 0 }
  const toX = gsap.quickTo(lens, 'x', { duration: 0.35, ease: 'power3' })
  const toY = gsap.quickTo(lens, 'y', { duration: 0.35, ease: 'power3' })
  const toR = gsap.quickTo(lens, 'r', { duration: 0.6, ease: 'power3.inOut' })
  const radius = () => toR(stage.held ? full() : stage.lrRest)

  // Real pointer. The Field reads stage.px/py/vx/vy, which the autopilot below takes over when idle.
  const real = { x: -9999, y: -9999 }
  let lastInput = performance.now()
  let lastMove = 0
  addEventListener('pointermove', (e) => {
    const now = performance.now(), dt = Math.max(now - lastMove, 8) / 1000
    if (lastMove && real.x > -9000) {
      stage.vx += ((e.clientX - real.x) / dt - stage.vx) * 0.5
      stage.vy += ((e.clientY - real.y) / dt - stage.vy) * 0.5
    }
    lastMove = lastInput = now
    real.x = stage.px = e.clientX; real.y = stage.py = e.clientY
    // Over something clickable the lens closes, so links and buttons read normally under the cursor.
    const hot = (e.target as Element).closest?.('a, button, input, textarea, label, [data-cursor]')
    const rest = hot ? 0 : REST
    if (rest !== stage.lrRest) { stage.lrRest = rest; radius() }
    if (lens.x < -9000) { lens.x = e.clientX; lens.y = e.clientY; radius() } // first move: no fly-in from the corner
    toX(e.clientX); toY(e.clientY)
  }, { passive: true })
  document.addEventListener('pointerleave', () => { real.x = real.y = -9999; if (!stage.held) toR(0) })
  document.addEventListener('pointerenter', radius)
  addEventListener('scroll', () => { lastInput = performance.now() }, { passive: true })

  const typing = (t: EventTarget | null) => t instanceof HTMLElement && t.closest('input, textarea, [contenteditable]')
  addEventListener('keydown', (e) => {
    lastInput = performance.now()
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
      lastInput = performance.now()
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

  // Idle autopilot: after 2.5 s without input an invisible "visitor" wanders the screen on a smooth
  // Lissajous path and stirs the Field, so the page never freezes. Real input takes over instantly.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let auto = 0 // 0..1 blend
  gsap.ticker.add((time, dtMs) => {
    const idle = !reduce && performance.now() - lastInput > 2500
    auto += ((idle ? 1 : 0) - auto) * (idle ? 0.01 : 0.2)
    stage.idle = auto
    if (auto > 0.001) {
      const W = innerWidth, H = innerHeight, t = time * 0.18
      const ax = W * (0.5 + 0.38 * Math.sin(t * 1.3) * Math.cos(t * 0.37))
      const ay = H * (0.45 + 0.3 * Math.sin(t * 0.9 + 1.7))
      const bx = real.x > -9000 ? real.x : ax, by = real.y > -9000 ? real.y : ay
      const nx = bx + (ax - bx) * auto, ny = by + (ay - by) * auto
      const dt = Math.max(dtMs, 8) / 1000
      if (stage.px > -9000) { stage.vx += ((nx - stage.px) / dt - stage.vx) * 0.2; stage.vy += ((ny - stage.py) / dt - stage.vy) * 0.2 }
      stage.px = nx; stage.py = ny
    }
  })

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
