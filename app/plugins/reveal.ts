// v-reveal: the element rises in, unblurring, the first time it enters the viewport.
// v-reveal="i" staggers siblings by i × 70 ms. It runs on the Web Animations API with `transform`, so it
// never clobbers an element's own CSS transitions or its `translate` hover lift. Hidden before that by
// html.reveal (set in the head script) so nothing flashes; reduced motion just shows it.
export default defineNuxtPlugin((nuxt) => {
  let io: IntersectionObserver | undefined
  const still = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches
  const show = (el: HTMLElement) => {
    el.dataset.shown = ''
    if (still) return
    el.animate(
      [{ opacity: 0, transform: 'translateY(32px) scale(.985)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'none' }],
      { duration: 1000, delay: Number(el.dataset.reveal || 0) * 70, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' },
    )
  }
  nuxt.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: (b) => ({ 'data-reveal': b.value ?? '' }),
    mounted(el, b) {
      el.dataset.reveal = String(b.value ?? '')
      io ??= new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { io!.unobserve(e.target); show(e.target as HTMLElement) }
      }, { rootMargin: '0px 0px -8% 0px' })
      io.observe(el)
    },
    unmounted: (el) => io?.unobserve(el),
  })
})
