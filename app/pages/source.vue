<!--
/source: how this site is made. Each part of the experience, how it works, and the honest numbers,
some of them read live from the running page (the Field's backend, glyph count, source size).
-->
<script setup lang="ts">
import src from './source.vue?raw'
import type { Txt } from '~/composables/useLang'

const { t, L } = useLang()
useHead(() => ({ title: t('How this site is made · Tim Lacault', 'Comment ce site est fait · Tim Lacault'), meta: [{ name: 'description', content: t('The glyph Field, the Lens, the score and the rest: how timlacault.dev is built.', 'Le champ de glyphes, la loupe, la musique et le reste : comment timlacault.dev est construit.') }] }))
const live = ref<string[]>([])
onMounted(() => { live.value = [...stage.log] })

const parts: { t: Txt, d: Txt }[] = [
  { t: { en: 'The Field', fr: 'Le champ' }, d: {
    en: "One full-screen canvas that never unloads. Every particle is a character taken from this site's own source files at build time. A compute shader written in TSL moves them on the GPU with three.js's WebGPU renderer, falling back to WebGL2. Headings, the loading counter's ring, Tim's portrait and the paper crane are all shapes the glyphs spring into: text is drawn into a canvas with the page's real font, images are sampled by brightness.",
    fr: "Un seul canvas plein écran qui ne se décharge jamais. Chaque particule est un caractère pris dans les fichiers source de ce site au moment du build. Un compute shader écrit en TSL les déplace sur le GPU avec le moteur WebGPU de three.js, avec un repli en WebGL2. Les titres, l'anneau du chargement, le portrait de Tim et la grue en papier sont des formes dans lesquelles les glyphes viennent se ranger : le texte est dessiné dans un canvas avec la vraie police de la page, les images sont échantillonnées selon leur luminosité." } },
  { t: { en: 'The Lens', fr: 'La loupe' }, d: {
    en: "Every section renders twice: the page you read, and an inert copy styled as its blueprint, with outlines, live element sizes and the component's real source behind it. The copy is clipped to a circle that follows the cursor and the original is masked out of it, so they always line up. Hold space and the circle opens to the whole screen.",
    fr: "Chaque section est rendue deux fois : la page que vous lisez, et une copie inerte dessinée comme son plan, avec les contours, les tailles des éléments en direct et le vrai code source du composant derrière. La copie est découpée dans un cercle qui suit le curseur et l'original est masqué dedans, donc les deux restent alignés. Maintenez espace et le cercle s'ouvre sur tout l'écran." } },
  { t: { en: 'Never still', fr: 'Jamais immobile' }, d: {
    en: 'When nobody touches anything, the page keeps living: a third of the glyphs keep re-typing, shapes breathe on a slow wave, a light reads across them every seven seconds, an invisible visitor stirs the dust, and three simulated readers wander the page.',
    fr: "Quand personne ne touche à rien, la page continue de vivre : un tiers des glyphes se réécrivent sans cesse, les formes respirent sur une onde lente, une lumière les parcourt toutes les sept secondes, un visiteur invisible remue la poussière, et trois lecteurs simulés se promènent sur la page." } },
  { t: { en: 'The score', fr: 'La musique' }, d: {
    en: 'The sound is synthesised live with Web Audio, no files: a pad of detuned triangles through a lowpass, one chord per section, scroll speed opening the filter, the held Lens sinking it an octave into a darker room, and glass pings on a pentatonic scale. Off until you turn it on.',
    fr: "Le son est synthétisé en direct avec Web Audio, sans fichier : une nappe de triangles désaccordés à travers un filtre passe-bas, un accord par section, la vitesse de défilement qui ouvre le filtre, la loupe maintenue qui fait descendre le tout d'une octave dans une pièce plus sombre, et des notes de verre sur une gamme pentatonique. Coupé tant que vous ne l'activez pas." } },
  { t: { en: 'Live', fr: 'En direct' }, d: {
    en: 'The ticker in the bottom-left dock is real: Bordeaux time, what Tim is listening to (Discord presence through Lanyard) and his latest public GitHub activity.',
    fr: "Le bandeau du dock en bas à gauche est réel : l'heure à Bordeaux, ce que Tim écoute (sa présence Discord via Lanyard) et sa dernière activité publique sur GitHub." } },
]
const stack = computed(() => [t('Nuxt 4, TypeScript, static generation', 'Nuxt 4, TypeScript, génération statique'), t('three.js WebGPURenderer + TSL compute', 'three.js WebGPURenderer + calcul TSL'), 'GSAP ScrollTrigger + Lenis', t('motion-v springs', 'ressorts motion-v'), 'Web Audio', 'Archivo, Omnibus-Type', 'Departure Mono, Helena Zhang', t('Vitest + puppeteer checks', 'Vérifications Vitest + puppeteer')])
</script>

<template>
  <div class="src-page">
    <Blueprint :source="src" id="top">
      <div class="hero">
        <NuxtLink to="/" class="back mono" data-enter style="--d: .3s">{{ t('Home', 'Accueil') }}</NuxtLink>
        <h1 class="display title" data-field="name"><span class="line">{{ t('Made of', 'Fait de') }}</span> <span class="line">{{ t('its source', 'son code') }}</span></h1>
        <ul v-if="live.length" class="live mono" data-enter style="--d: .5s">
          <li v-for="l in live" :key="l">{{ l }}</li>
        </ul>
      </div>
    </Blueprint>
    <Blueprint :source="src">
      <div class="parts">
        <section v-for="(p, k) in parts" :key="p.t.en" class="part">
          <h2><span class="mono">{{ String(k + 1).padStart(2, '0') }}</span>{{ L(p.t) }}</h2>
          <p>{{ L(p.d) }}</p>
        </section>
        <section class="part">
          <h2><span class="mono">06</span>{{ t('Built with', 'Construit avec') }}</h2>
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
