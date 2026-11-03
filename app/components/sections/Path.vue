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

type Lane = 0 | 1 | 2 // main, freelance, cio
const commits: { word: string, when: string, lane: Lane, msg: string, body: string }[] = [
  { word: 'Scratch', when: 'age 13', lane: 0, msg: 'init: Scratch', body: 'Algorithms and logic for the first time. Dragging blocks around until a cat did what I meant.' },
  { word: 'Calc', when: 'school', lane: 0, msg: 'feat: games on a calculator', body: 'Coding small games while my classmates were still learning what its functions did.' },
  { word: 'Web', when: 'age 17', lane: 0, msg: 'feat: first website', body: 'For a high-school environmental project. The moment I saw you could build anything with simple tools.' },
  { word: 'Epitech', when: '2020', lane: 0, msg: 'Epitech', body: 'Two years of project-based IT: learning by shipping, in C and everything after.' },
  { word: 'Car', when: '2021', lane: 0, msg: 'Internship at Lormauto, 5 months', body: 'A car dashboard in JavaScript and MQTT: diagnostics, multimedia, GPS and HVAC screens, and a Node-RED sensor simulator.' },
  { word: 'B.Sc', when: '2022', lane: 0, msg: 'Computer Science, Université de Bordeaux', body: 'Theory under the practice: algorithms, systems, languages.' },
  { word: 'Clients', when: '2023', lane: 1, msg: 'branch freelance', body: 'My own clients: websites for businesses, designed and built by hand. Still open.' },
  { word: 'Enseirb', when: '2024', lane: 0, msg: 'Software engineering, Bordeaux INP', body: "ENSEIRB-MATMECA. Where Mobilit'Eirb started, with a team of five I led." },
  { word: 'CIO', when: '2024', lane: 2, msg: 'branch cio: Aquitaine Électronique Informatique', body: 'Running a Debian and Docker server fleet, secrets, and mail for 30+ members, and the company site in Vue 3.' },
  { word: 'Now', when: '2026', lane: 0, msg: 'HEAD', body: 'Looking for a 4th-year internship (June to September 2027) and my end-of-studies internship (February to September 2028).' },
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
          <p class="mono eyebrow">How I got here <b>{{ commits[active]!.when }}</b></p>
          <div class="word-box">
            <p v-if="!last" :key="commits[active]!.word" class="display word" data-field="name"><span class="line">{{ commits[active]!.word }}</span></p>
            <div v-else class="portrait" data-field="image" data-src="/img/tim-field.webp">
              <img src="/img/tim-field.webp" alt="Tim Lacault" width="900" height="854">
            </div>
          </div>
          <p class="quote" :class="{ on: last }">I always thought the way you can create and solve problems with simple tools was beautiful.</p>
        </div>

        <div class="log" :style="{ '--shift': `${-Math.min(N - 6, Math.max(0, active - 3)) * ROW}px` }">
          <div class="scroller">
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
                <span class="mono when">{{ c.when }}</span>
                <span class="msg">{{ c.msg }}</span>
              </li>
            </ol>
          </div>
          <p :key="active" class="body">{{ commits[active]!.body }}</p>
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
.word { font-size: min(11vw, 22vh); animation: rise .5s var(--ease-out); }
@keyframes rise { from { opacity: 0; translate: 0 10px; } }
:global(html.field-live .path .word) { color: transparent; }
.portrait { height: min(40vh, 27vw); width: auto; aspect-ratio: 900 / 854; }
.portrait img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .8s var(--ease-out); }
:global(html.field-live .path .bp-surface .portrait img) { opacity: 0; }
.quote { font-size: 21px; line-height: 1.4; font-style: italic; max-width: 34ch; opacity: 0; translate: 0 12px; transition: opacity .7s var(--ease-out), translate .8s var(--ease-out); }
.quote.on { opacity: 1; translate: 0 0; }

.log { grid-column: 8 / -1; display: grid; gap: 28px; align-content: center; }
.scroller { position: relative; height: calc(64px * 6); overflow: clip; }
.graph, .rows { position: absolute; left: 0; top: 0; translate: 0 var(--shift); transition: translate .7s var(--ease-io); }
.rows { right: 0; margin: 0; padding: 0; list-style: none; }
.rows li { display: flex; align-items: center; gap: 16px; color: var(--fg-2); opacity: .45; transition: opacity .4s, color .4s; }
.rows li.past { opacity: .75; }
.rows li.on { opacity: 1; color: var(--fg); }
.when { width: 64px; flex: none; font-size: 12px; }
.on .when { color: var(--accent); }
.msg { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.on .msg { font-weight: 700; }
.rail { fill: none; stroke: var(--line); stroke-width: 2; }
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
  .word { font-size: 13vw; }
  .quote { display: none; }
  .log { grid-column: 1 / -1; }
  .scroller { height: calc(64px * 4); }
  .msg { font-size: 14px; }
}
</style>
