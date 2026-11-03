<!--
Loading screen. The counter is a Field shape (data-field-priority), so it's drawn in glyphs once the
Field is up; the log prints the real loading steps. When everything is in, the counter's glyphs fly
off to form the name and the page fades in underneath.
-->
<script setup lang="ts">
import gsap from 'gsap'
import type Lenis from 'lenis'

const show = ref(true)
const leaving = ref(false)
const shown = ref(0)
const lines = ref<string[]>([])
const pad = (n: number) => String(n).padStart(3, '0')

onMounted(() => {
  const lenis = useNuxtApp().$lenis as Lenis | null
  lenis?.stop()
  const t0 = performance.now()
  let fonts = false
  document.fonts.ready.then(() => { fonts = true; stage.log.unshift('fonts     Archivo, Departure Mono') })

  const tick = () => {
    const elapsed = (performance.now() - t0) / 1000
    // Real progress, but never faster than a short beat per step, and creeping while the 3D chunk downloads.
    const target = Math.min(100, Math.max(stage.progress * 100, Math.min(elapsed * 14, 40)) * (fonts ? 1 : 0.6))
    const next = Math.min(target, shown.value + Math.ceil(Math.random() * 9))
    if (next > shown.value && Math.random() < 0.25) shown.value = Math.round(next)
    if (stage.log.length !== lines.value.length) lines.value = [...stage.log]
    if ((shown.value >= 100 && elapsed > 1.4) || elapsed > 8) finish()
  }
  gsap.ticker.add(tick)

  let done = false
  function finish() {
    if (done) return
    done = true
    shown.value = 100
    gsap.ticker.remove(tick)
    setTimeout(() => {
      leaving.value = true
      document.documentElement.classList.remove('loading')
      lenis?.start()
      setTimeout(() => { show.value = false }, 250) // counter leaves the Field → glyphs fly to the next shape
    }, 450)
  }
})
</script>

<template>
  <div v-if="show" class="loader" :class="{ leaving }" aria-hidden="true">
    <p class="count display" data-field="name" data-field-priority><span class="line">{{ pad(shown) }}</span></p>
    <ol class="log mono">
      <li v-for="l in lines" :key="l">{{ l }}</li>
    </ol>
    <p class="who mono">Tim Lacault / portfolio 2026</p>
  </div>
</template>

<style scoped>
.loader { position: fixed; inset: 0; z-index: 60; pointer-events: none; }
.count {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  font-size: min(26vw, 34vh); font-variant-numeric: tabular-nums;
}
:global(html.field-live .loader .count) { color: transparent; }
.log, .who { position: absolute; bottom: 32px; margin: 0; padding: 0; list-style: none; color: var(--fg-2); }
.log { left: var(--margin); white-space: pre; }
.who { right: var(--margin); }
.log li { animation: in .3s var(--ease-out) both; }
@keyframes in { from { opacity: 0; translate: 0 6px; } }
.leaving .log, .leaving .who { opacity: 0; transition: opacity .3s; }
</style>
