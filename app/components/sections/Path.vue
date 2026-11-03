<!--
How I got here, as a git history you scroll through. A tall wrapper with a sticky stage (sticky, so the
Blueprint copy lays out identically): scrolling moves HEAD along the commits. On the left one huge word
per era is a Field shape, so the glyphs re-form at every commit; on the right the graph draws itself up
to HEAD, branches split off main and stay open, and the current commit opens. The last commit is now:
the word gives way to the portrait, drawn in glyphs.
-->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import src from './Path.vue?raw'
import type { Txt } from '~/composables/useLang'

type Lane = 0 | 1 | 2 // main, freelance, cio
const { t, L } = useLang()
const commits: { word: Txt, when: Txt, lane: Lane, msg: Txt, body: Txt }[] = [
  { word: { en: 'Scratch', fr: 'Scratch' }, when: { en: 'age 13', fr: '13 ans' }, lane: 0, msg: { en: 'init: Scratch', fr: 'init: Scratch' },
    body: { en: 'Algorithms and logic for the first time. Dragging blocks around until a cat did what I meant.', fr: "L'algorithmique et la logique pour la première fois. Déplacer des blocs jusqu'à ce qu'un chat fasse ce que je voulais." } },
  { word: { en: 'Calc', fr: 'Calc' }, when: { en: 'high school', fr: 'lycée' }, lane: 0, msg: { en: 'feat: games on a calculator', fr: 'feat: des jeux sur calculatrice' },
    body: { en: 'Coding small games while my classmates were still learning what its functions did.', fr: 'Coder des petits jeux pendant que mes camarades apprenaient encore à se servir de ses fonctions.' } },
  { word: { en: 'Web', fr: 'Web' }, when: { en: 'age 17', fr: '17 ans' }, lane: 0, msg: { en: 'feat: first website', fr: 'feat: premier site web' },
    body: { en: 'For a high-school environmental project. The moment I saw you could build anything with simple tools.', fr: "Pour un projet environnemental au lycée. Le moment où j'ai compris qu'on pouvait tout construire avec des outils simples." } },
  { word: { en: 'Epitech', fr: 'Epitech' }, when: { en: '2020', fr: '2020' }, lane: 0, msg: { en: 'Epitech', fr: 'Epitech' },
    body: { en: 'Two years of project-based IT: learning by shipping, in C and everything after.', fr: "Deux ans d'informatique par projets : apprendre en livrant, en C et tout ce qui a suivi." } },
  { word: { en: 'Car', fr: 'Auto' }, when: { en: '2021', fr: '2021' }, lane: 0, msg: { en: 'Internship at Lormauto, 5 months', fr: 'Stage chez Lormauto, 5 mois' },
    body: { en: 'A car dashboard in JavaScript and MQTT: diagnostics, multimedia, GPS and HVAC screens, and a Node-RED sensor simulator.', fr: 'Un tableau de bord de voiture en JavaScript et MQTT : écrans diagnostic, multimédia, GPS et climatisation, et un simulateur de capteurs sous Node-RED.' } },
  { word: { en: 'B.Sc', fr: 'Licence' }, when: { en: '2022', fr: '2022' }, lane: 0, msg: { en: 'Computer Science, Université de Bordeaux', fr: 'Licence informatique, Université de Bordeaux' },
    body: { en: 'Theory under the practice: algorithms, systems, languages.', fr: 'La théorie sous la pratique : algorithmes, systèmes, langages.' } },
  { word: { en: 'Clients', fr: 'Clients' }, when: { en: '2023', fr: '2023' }, lane: 1, msg: { en: 'branch freelance', fr: 'branch freelance' },
    body: { en: 'My own clients: websites for businesses, designed and built by hand. Still open.', fr: 'Mes propres clients : des sites pour des commerces, dessinés et codés à la main. Toujours ouverte.' } },
  { word: { en: 'Enseirb', fr: 'Enseirb' }, when: { en: '2024', fr: '2024' }, lane: 0, msg: { en: 'Software engineering, Bordeaux INP', fr: 'École d’ingénieurs, Bordeaux INP' },
    body: { en: "ENSEIRB-MATMECA. Where Mobilit'Eirb started, with a team of five I led.", fr: "ENSEIRB-MATMECA. Là où Mobilit'Eirb a commencé, avec une équipe de cinq que j'ai menée." } },
  { word: { en: 'CIO', fr: 'DSI' }, when: { en: '2024', fr: '2024' }, lane: 2, msg: { en: 'branch cio: Aquitaine Électronique Informatique', fr: 'branch dsi: Aquitaine Électronique Informatique' },
    body: { en: 'Running a Debian and Docker server fleet, secrets, and mail for 30+ members, and the company site in Vue 3.', fr: 'Gérer un parc de serveurs Debian et Docker, les secrets et la messagerie de plus de 30 membres, et le site de la structure en Vue 3.' } },
  { word: { en: 'Now', fr: 'Présent' }, when: { en: '2026', fr: '2026' }, lane: 0, msg: { en: 'HEAD', fr: 'HEAD' },
    body: { en: 'Looking for a 4th-year internship (June to September 2027) and my end-of-studies internship (February to September 2028).', fr: 'Je cherche un stage de 4e année (juin à septembre 2027) et mon stage de fin d’études (février à septembre 2028).' } },
]
const N = commits.length
const ROW = 64, X = [18, 54, 90] // graph geometry (px): row height, lane x
const startOf = (lane: Lane) => commits.findIndex((c) => c.lane === lane)
// Branch curves from main into their lane, then straight down to HEAD (they stay open).
const branch = (lane: Lane) => {
  const i = startOf(lane), y0 = (i - 1) * ROW + ROW / 2, y1 = i * ROW + ROW / 2
  return `M${X[0]} ${y0} C${X[0]} ${y0 + ROW * 0.6} ${X[lane]} ${y1 - ROW * 0.6} ${X[lane]} ${y1} L${X[lane]} ${(N - 1) * ROW + ROW / 2}`
}
const height = N * ROW
const drawn = (lane: Lane, p: number) => {
  const s = startOf(lane) / N
  return p < s ? 1 : 1 - (p - s) / (1 - s)
}

const wrap = ref<HTMLElement>()
const active = ref(0)
const progress = ref(0)
const last = computed(() => active.value === N - 1)
let st: ScrollTrigger | undefined
onMounted(() => {
  st = ScrollTrigger.create({
    trigger: wrap.value!, start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => { progress.value = s.progress; active.value = Math.min(N - 1, Math.floor(s.progress * N * 0.999)) },
  })
})
onBeforeUnmount(() => st?.kill())
</script>

<template>
  <Blueprint :source="src" class="path" id="path">
    <div ref="wrap" class="wrap" :style="{ '--n': N }">
      <div class="stage">
        <div class="left">
          <p v-reveal class="mono eyebrow">{{ t('How I got here', 'Mon parcours') }} <b>{{ L(commits[active]!.when) }}</b></p>
          <div class="word-box">
            <p v-if="!last" :key="L(commits[active]!.word)" class="display word" data-field="name"><span class="line">{{ L(commits[active]!.word) }}</span></p>
            <div v-else class="portrait" data-field="image" data-src="/img/tim-field.webp">
              <img src="/img/tim-field.webp" alt="Tim Lacault" width="900" height="854">
            </div>
          </div>
          <p class="quote" :class="{ on: last }">{{ t('I always thought the way you can create and solve problems with simple tools was beautiful.', 'J’ai toujours trouvé beau qu’on puisse créer et résoudre des problèmes avec des outils simples.') }}</p>
        </div>

        <div class="log" :style="{ '--a': active, '--n': N }">
          <div v-reveal="1" class="scroller">
            <svg class="graph" :viewBox="`0 0 108 ${height}`" width="108" :height="height" aria-hidden="true">
              <path class="rail" :d="`M${X[0]} ${ROW / 2} L${X[0]} ${height - ROW / 2}`" />
              <path class="rail" :d="branch(1)" />
              <path class="rail" :d="branch(2)" />
              <path class="drawn" pathLength="1" :d="`M${X[0]} ${ROW / 2} L${X[0]} ${height - ROW / 2}`" :style="{ strokeDashoffset: 1 - progress }" />
              <path class="drawn" pathLength="1" :d="branch(1)" :style="{ strokeDashoffset: drawn(1, progress) }" />
              <path class="drawn" pathLength="1" :d="branch(2)" :style="{ strokeDashoffset: drawn(2, progress) }" />
              <circle
                v-for="(c, i) in commits" :key="i" :cx="X[c.lane]" :cy="i * ROW + ROW / 2" :r="i === active ? 7 : 4.5"
                :class="{ done: i <= active, head: i === active }"
              />
            </svg>
            <ol class="rows">
              <li v-for="(c, i) in commits" :key="i" :class="{ on: i === active, past: i < active }" :style="{ height: `${ROW}px`, paddingLeft: `${X[c.lane]! + 26}px` }">
                <span class="mono when">{{ L(c.when) }}</span>
                <span class="msg">{{ L(c.msg) }}</span>
              </li>
            </ol>
          </div>
          <p :key="active" class="body">{{ L(commits[active]!.body) }}</p>
        </div>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
.wrap { height: calc(var(--n) * 55vh + 100dvh); }
.stage {
  position: sticky; top: 0; height: 100dvh; overflow: clip;
  padding: clamp(72px, 12vh, 120px) var(--margin) 120px;
  display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; align-items: center;
}
.left { grid-column: 1 / 7; display: grid; gap: 4vh; align-content: center; }
.eyebrow { color: var(--fg-2); }
.eyebrow b { font-weight: 400; color: var(--accent); margin-left: 12px; }
.word-box { height: min(40vh, 27vw); display: grid; align-items: center; }
/* Sized so the longest era word (7 letters, expanded) stays in its six columns, clear of the timeline. */
.word { font-size: min(7.2vw, 20vh); white-space: nowrap; animation: rise .5s var(--ease-out); }
@keyframes rise { from { opacity: 0; translate: 0 10px; } }
:global(html.field-live .path .word) { color: transparent; }
.portrait { height: min(40vh, 27vw); width: auto; aspect-ratio: 900 / 854; }
.portrait img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .8s var(--ease-out); }
:global(html.field-live .path .bp-surface .portrait img) { opacity: 0; }
.quote { font-size: 21px; line-height: 1.4; font-style: italic; max-width: 34ch; opacity: 0; translate: 0 12px; transition: opacity .7s var(--ease-out), translate .8s var(--ease-out); }
.quote.on { opacity: 1; translate: 0 0; }

/* The timeline sits on its own dark scrim with a halo on the text, so glyphs drifting behind never wash it out. */
.log {
  grid-column: 8 / -1; display: grid; gap: 28px; align-content: center; position: relative; isolation: isolate;
  text-shadow: 0 0 10px var(--ink), 0 0 3px var(--ink);
}
.log::before {
  content: ''; position: absolute; inset: -12% -18% -12% -10%; z-index: -1; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in oklab, var(--ink) 92%, transparent), color-mix(in oklab, var(--ink) 70%, transparent) 60%, transparent);
}
/* --v rows visible; HEAD stays in the middle row until the list runs out. */
.scroller { --v: 6; position: relative; height: calc(64px * var(--v)); overflow: clip; }
.graph, .rows { position: absolute; left: 0; top: 0; translate: 0 calc(-64px * clamp(0, var(--a) - round(down, var(--v) / 2, 1), var(--n) - var(--v))); transition: translate .7s var(--ease-io); }
.rows { right: 0; margin: 0; padding: 0; list-style: none; }
.rows li { display: flex; align-items: center; gap: 16px; color: var(--fg-2); opacity: .6; transition: opacity .4s, color .4s; }
.rows li.past { opacity: .9; }
.rows li.on { opacity: 1; color: var(--fg); }
.when { width: 64px; flex: none; font-size: 12px; }
.on .when { color: var(--accent); }
.msg { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.on .msg { font-weight: 700; }
.rail { fill: none; stroke: color-mix(in oklab, var(--fg) 22%, transparent); stroke-width: 2; }
.drawn { fill: none; stroke: var(--accent); stroke-width: 2; stroke-dasharray: 1; }
circle { fill: var(--ink); stroke: var(--fg-2); stroke-width: 1.5; transition: r .3s var(--ease-out), fill .3s, stroke .3s; }
circle.done { fill: var(--accent); stroke: var(--accent); }
circle.head { filter: drop-shadow(0 0 8px var(--accent)); }
.body { font-size: 17px; line-height: 1.5; color: var(--fg-2); max-width: 46ch; min-height: 3lh; animation: rise .5s var(--ease-out); }

@media (max-width: 767px) {
  .wrap { height: calc(var(--n) * 45vh + 100dvh); }
  .stage { align-content: start; padding-top: 10vh; row-gap: 3vh; }
  .left { grid-column: 1 / -1; gap: 2vh; }
  .word-box { height: 16vh; }
  .word { font-size: 12vw; }
  .quote { display: none; }
  .log { grid-column: 1 / -1; }
  .scroller { --v: 4; }
  .msg { font-size: 14px; }
}
</style>
