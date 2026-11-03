<!--
/source: how this site is made. Each part of the experience, how it works, and the honest numbers,
some of them read live from the running page (the Field's backend, glyph count, source size).
-->
<script setup lang="ts">
import src from './source.vue?raw'

useHead({ title: 'How this site is made · Tim Lacault', meta: [{ name: 'description', content: 'The glyph Field, the Lens, the score and the rest: how timlacault.dev is built.' }] })
const live = ref<string[]>([])
onMounted(() => { live.value = [...stage.log] })

const parts = [
  { t: 'The Field', d: "One full-screen canvas that never unloads. Every particle is a character taken from this site's own source files at build time. A compute shader written in TSL moves them on the GPU with three.js's WebGPU renderer, falling back to WebGL2. Headings, your loading counter, Tim's portrait and the paper crane are all shapes the glyphs spring into: text is drawn into a canvas with the page's real font, images are sampled by brightness." },
  { t: 'The Lens', d: 'Every section renders twice: the page you read, and an inert copy styled as its blueprint, with outlines, live element sizes and the component\'s real source behind it. The copy is clipped to a circle that follows the cursor, the original is masked out of it, so they always line up. Hold space and the circle opens to the whole screen.' },
  { t: 'Never still', d: 'When nobody touches anything, the page keeps living: a third of the glyphs keep re-typing, shapes breathe on a slow wave, a light reads across them every seven seconds, an invisible visitor stirs the dust, and three simulated readers wander the page.' },
  { t: 'The score', d: 'The sound is synthesised live with Web Audio, no files: a pad of detuned triangles through a lowpass, one chord per section, scroll speed opening the filter, the held Lens adding a fifth, and glass pings on a pentatonic scale. Off until you turn it on.' },
  { t: 'Live', d: 'The ticker in the dock is real: Bordeaux time, what Tim is listening to (Discord presence through Lanyard) and his latest public GitHub activity.' },
]
const stack = ['Nuxt 4, TypeScript, static generation', 'three.js WebGPURenderer + TSL compute', 'GSAP ScrollTrigger + Lenis', 'motion-v springs', 'Web Audio', 'Archivo by Omnibus-Type', 'Departure Mono by Helena Zhang', 'Vitest + puppeteer checks']
</script>

<template>
  <div class="src-page">
    <Blueprint :source="src" id="top">
      <div class="hero">
        <NuxtLink to="/" class="back mono" data-enter style="--d: .3s">Home</NuxtLink>
        <h1 class="display title" data-field="name"><span class="line">Made of</span> <span class="line">its source</span></h1>
        <ul v-if="live.length" class="live mono" data-enter style="--d: .5s">
          <li v-for="l in live" :key="l">{{ l }}</li>
        </ul>
      </div>
    </Blueprint>
    <Blueprint :source="src">
      <div class="parts">
        <section v-for="(p, k) in parts" :key="p.t" class="part">
          <h2><span class="mono">{{ String(k + 1).padStart(2, '0') }}</span>{{ p.t }}</h2>
          <p>{{ p.d }}</p>
        </section>
        <section class="part">
          <h2><span class="mono">06</span>Built with</h2>
          <ul class="stack"><li v-for="s in stack" :key="s">{{ s }}</li></ul>
        </section>
      </div>
    </Blueprint>
  </div>
</template>

<style scoped>
.hero { min-height: 80dvh; padding: 14vh var(--margin) 8vh; display: grid; align-content: start; gap: 5vh; }
.back { color: var(--fg-2); text-decoration: none; }
.back::before { content: '← '; color: var(--accent); }
.title { font-size: min(10vw, 19vh); }
.line { display: inline-block; margin-right: .26em; }
:global(html.field-live .src-page .title) { color: transparent; }
.live { margin: 0; padding: 0; list-style: none; color: var(--fg-2); white-space: pre; }
.parts { padding: 6vh var(--margin) 24vh; display: grid; gap: 10vh; }
.part { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; }
.part h2 { grid-column: 1 / 5; font-size: clamp(24px, 2.4vw, 36px); font-weight: 800; font-stretch: 125%; text-transform: uppercase; line-height: 1; }
.part h2 .mono { display: block; color: var(--accent); font-size: 13px; margin-bottom: 12px; }
.part p, .stack { grid-column: 6 / -1; font-size: 19px; line-height: 1.6; max-width: 62ch; }
.stack { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.stack li::before { content: '/ '; color: var(--accent); }
@media (max-width: 767px) {
  .title { font-size: 11vw; }
  .part h2, .part p, .stack { grid-column: 1 / -1; }
  .part h2 { margin-bottom: 16px; }
}
</style>
