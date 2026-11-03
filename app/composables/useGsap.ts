import gsap from 'gsap'
import type { Ref } from 'vue'

/**
 * Runs `setup` after mount inside a gsap.matchMedia scoped to `scope`, reverts everything on unmount.
 * Inside setup, wrap motion in `mm.add(MOTION_OK, () => { ... })` so reduced-motion users get the static page.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/**
 * Scroll reveal window: tied to scroll position (scrubbed), so the motion plays while the element
 * travels up the lower half of the screen and is always finished by the time it reaches the middle,
 * whatever the scroll speed. Spread it into a scrollTrigger: `{ trigger: el, ...REVEAL }`.
 * clamp() keeps both ends inside the real scroll range: without it, anything near the page bottom
 * (a footer grid) ends past max scroll and never finishes. Override `end` with clamp() too.
 */
export const REVEAL = { start: 'clamp(top 85%)', end: 'clamp(center 50%)', scrub: 0.5 } as const

export function useGsap(scope: Ref<HTMLElement | null | undefined>, setup: (mm: gsap.MatchMedia) => void) {
  let mm: gsap.MatchMedia | undefined
  onMounted(() => {
    mm = gsap.matchMedia(scope.value ?? undefined)
    setup(mm)
  })
  onBeforeUnmount(() => mm?.revert())
}
