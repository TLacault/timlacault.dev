import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

// GSAP plugins + one Lenis instance driven by the GSAP ticker, so ScrollTrigger and Lenis share a frame.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  ScrollTrigger.clearScrollMemory('manual') // the router owns scroll position between pages

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

  // Pages: land at the top (or on the #section asked for) and re-measure every trigger.
  const nuxt = useNuxtApp()
  nuxt.hook('page:finish', () => {
    const hash = location.hash
    requestAnimationFrame(() => {
      // Refresh first: ScrollTrigger.refresh() restores the scroll position it saw before, which would
      // throw the new page back to the old page's offset.
      refresh()
      const el = hash && document.querySelector(hash)
      if (el) lenis ? lenis.scrollTo(el as HTMLElement, { immediate: true, force: true }) : el.scrollIntoView()
      else lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0)
    })
  })

  // go('/#work') from anywhere: smooth scroll when already on that page, route + jump otherwise.
  const go = (to: string) => {
    const [path, hash] = to.split('#')
    if ((path || '/') === location.pathname && hash) {
      const el = document.getElementById(hash)
      if (el) lenis ? lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
    } else navigateTo(to)
  }

  return { provide: { lenis, go } }
})
