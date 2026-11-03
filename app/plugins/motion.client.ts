import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

// GSAP plugins + one Lenis instance driven by the GSAP ticker, so ScrollTrigger and Lenis share a frame.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const lenis = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : new Lenis({ lerp: 0.09, anchors: true })
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Triggers must be measured top to bottom (each pin pushes everything below it down), but creation
  // order isn't page order: a child component's pin is created before its page's own pins. Sort by
  // position before every refresh instead of hand-tuning refreshPriority.
  const refresh = () => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }
  requestAnimationFrame(refresh)

  // ScrollTrigger only re-measures on window resize. Anything that changes the page height
  // (an accordion opening, a filter, late fonts or images) would leave every trigger below it
  // firing early, so re-measure once the height has settled.
  let lastHeight = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  new ResizeObserver(() => {
    const h = document.body.scrollHeight
    if (h === lastHeight) return
    lastHeight = h
    clearTimeout(timer)
    timer = setTimeout(refresh, 200)
  }).observe(document.body)

  return { provide: { lenis } }
})
