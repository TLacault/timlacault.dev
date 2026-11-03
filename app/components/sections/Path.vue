<script setup lang="ts">
import src from './Path.vue?raw'

// main = me. Newest first, like `git log`.
const commits = [
  { year: '2024', branch: 'cio', msg: 'CIO of Aquitaine Électronique Informatique', body: 'Debian and Docker server fleet, VaultWarden, mail for 30+ members, and the company site in Vue 3.' },
  { year: '2024', branch: 'main', msg: 'Software engineering at Bordeaux INP, Enseirb-Matmeca', body: 'Led a team of five on Mobiliteirb.' },
  { year: '2023', branch: 'freelance', msg: 'Freelance web developer', body: 'About ten hand-built sites shipped, still open.' },
  { year: '2022', branch: 'main', msg: 'B.Sc. Computer Science, Université de Bordeaux', body: '' },
  { year: '2021', branch: 'main', msg: 'Five-month full-stack internship at Lormauto', body: 'A car dashboard in JavaScript and MQTT: diagnostics, multimedia, GPS and HVAC screens.' },
  { year: '2020', branch: 'main', msg: 'Epitech', body: '' },
  { year: '17', branch: 'main', msg: 'First website, for a high-school environmental project', body: '' },
  { year: '13', branch: 'main', msg: 'Games on a calculator', body: 'While my classmates were still learning what its functions did.' },
  { year: '13', branch: 'main', msg: 'init: Scratch', body: 'Algorithms and logic, for the first time.' },
]
</script>

<template>
  <Blueprint :source="src" class="path" id="path">
    <div class="path-grid">
      <div class="portrait" data-field="image" data-src="/img/tim-field.webp">
        <img src="/img/tim-field.webp" alt="Tim Lacault" width="900" height="854" loading="lazy">
      </div>
      <div class="log">
        <h2 class="display">How I got here</h2>
        <p class="quote">I always thought the way you can create and solve problems with simple tools was beautiful.</p>
        <ol>
          <li v-for="(c, i) in commits" :key="i" :class="c.branch">
            <span class="mono when">{{ c.year.length > 2 ? c.year : `age ${c.year}` }}</span>
            <span class="mono branch">{{ c.branch }}</span>
            <strong>{{ c.msg }}</strong>
            <span v-if="c.body" class="muted body">{{ c.body }}</span>
          </li>
        </ol>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
.path-grid {
  padding: 18vh var(--margin);
  display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; align-items: start;
}
.portrait { grid-column: 1 / 6; position: sticky; top: 10vh; aspect-ratio: 900 / 854; }
.portrait img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .8s var(--ease-out); }
:global(html.field-live .bp-surface .portrait img) { opacity: 0; }
.log { grid-column: 7 / -1; }
h2 { font-size: clamp(48px, 6vw, 96px); }
.quote { margin: 32px 0 56px; font-size: 22px; line-height: 1.35; font-style: italic; max-width: 32ch; }
ol { list-style: none; margin: 0; padding: 0 0 0 28px; border-left: 1px solid var(--line); display: grid; gap: 30px; }
li { position: relative; display: grid; grid-template-columns: 80px 1fr; column-gap: 16px; row-gap: 4px; }
li::before {
  content: ''; position: absolute; left: -33px; top: 7px;
  width: 9px; height: 9px; border-radius: 50%; background: var(--ink); border: 1px solid var(--fg-2);
}
li.main::before { background: var(--accent); border-color: var(--accent); }
.when { color: var(--fg-2); }
.branch { grid-column: 1; grid-row: 2; color: var(--accent); }
strong { font-weight: 560; grid-column: 2; grid-row: 1; }
.body { grid-column: 2; font-size: 15px; }
@media (max-width: 767px) {
  .portrait { grid-column: 2 / 12; position: relative; top: 0; margin-bottom: 64px; }
  .log { grid-column: 1 / -1; }
}
</style>
