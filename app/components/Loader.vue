<!--
Loading screen, first load only. A DOM counter runs 000 → 100, never faster than ~2 s and never ahead
of real loading (fonts, the 3D chunk, the renderer, the source glyphs). Meanwhile the Field's glyphs
orbit it as a ring (data-field="ring", priority). At 100 the number lifts away, the loader lets go of
the Field so the glyphs fly into the page's first shape, and elements marked [data-enter] stagger in.
-->
<script setup lang="ts">
import gsap from 'gsap'
import type Lenis from 'lenis'

const show = ref(true)
const leaving = ref(false)
const shown = ref(0)
const lines = ref<string[]>([])
const MIN = 2.2 // seconds: the count is a moment, not a flicker

onMounted(() => {
  const lenis = useNuxtApp().$lenis as Lenis | null
  lenis?.stop()
  scrollTo(0, 0)
  const t0 = performance.now()
  let fonts = false
  document.fonts.ready.then(() => { fonts = true; stage.log.unshift('fonts     Archivo, Departure Mono') })

  let n = 0
  const tick = () => {
    const t = (performance.now() - t0) / 1000
    // Time cap eases out, so the last stretch slows down and lands instead of slamming into 100.
    const cap = 100 * (1 - Math.pow(1 - Math.min(t / MIN, 1), 2.2))
    const real = (fonts ? 30 : 0) + stage.progress * 70
    const target = t > 9 ? 100 : Math.min(cap, real)
    n += Math.max(0, target - n) * 0.12
    if (target >= 100 && n > 99.4) n = 100
    shown.value = Math.floor(n)
    if (stage.log.length !== lines.value.length) lines.value = [...stage.log]
    if (n >= 100) finish()
  }
  gsap.ticker.add(tick)

  let done = false
  function finish() {
    if (done) return
    done = true
    gsap.ticker.remove(tick)
    setTimeout(() => {
      leaving.value = true // number lifts away, log fades
      setTimeout(() => {
        show.value = false // the Field is free: glyphs fly from the ring into the page
        document.documentElement.classList.remove('loading')
        lenis?.start()
      }, 420)
    }, 250)
  }
})
</script>

<template>
  <div v-if="show" class="loader" :class="{ leaving }" aria-hidden="true">
    <div class="center" data-field="ring" data-field-priority>
      <p class="count display"><span>{{ String(shown).padStart(3, '0') }}</span></p>
    </div>
    <ol class="log mono">
      <li v-for="l in lines" :key="l">{{ l }}</li>
    </ol>
    <p class="who mono">Tim Lacault <span>/</span> portfolio 2026</p>
  </div>
</template>

<style scoped>
.loader { position: fixed; inset: 0; z-index: 60; pointer-events: none; }
.center {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  width: min(54vw, 60vh); aspect-ratio: 1; display: grid; place-items: center;
}
.count { font-size: min(13vw, 17vh); font-variant-numeric: tabular-nums; overflow: clip; line-height: 1; padding-block: .06em; opacity: 0; transition: opacity .5s var(--ease-out); }
:global(html.fonts .loader .count) { opacity: 1; }
.count span { display: block; transition: translate .5s var(--ease-io), opacity .4s var(--ease-out); }
.leaving .count span { translate: 0 -110%; opacity: 0; }
.log, .who { position: absolute; bottom: 32px; margin: 0; padding: 0; list-style: none; color: var(--fg-2); transition: opacity .35s; }
.log { left: var(--margin); white-space: pre; }
.who { right: var(--margin); }
.who span { color: var(--accent); }
.log li { animation: in .35s var(--ease-out) both; }
@keyframes in { from { opacity: 0; translate: 0 6px; } }
.leaving .log, .leaving .who { opacity: 0; }
@media (max-width: 767px) { .who { display: none; } }
</style>

<style>
/* Page under the loader: hidden, then [data-enter] elements rise in one after another (--d = delay). */
html.loading main { visibility: hidden; }
[data-enter] { transition: opacity .9s var(--ease-out) var(--d, 0s), translate 1.1s var(--ease-out) var(--d, 0s); }
html.loading [data-enter] { opacity: 0; translate: 0 22px; }
</style>
