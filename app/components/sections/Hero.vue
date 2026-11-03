<script setup lang="ts">
import src from './Hero.vue?raw'
const { t } = useLang()
</script>

<template>
  <Blueprint :source="src" class="hero" id="top">
    <div class="hero-grid">
      <h1 class="display name" data-field="name">
        <span class="line">Tim</span>
        <span class="line">Lacault</span>
      </h1>
      <a class="cue mono" href="#work" data-enter style="--d: .75s">
        <span class="cue-line" aria-hidden="true" />
        {{ t('Scroll to see the work', 'Défilez pour voir le travail') }}
      </a>
      <div class="hero-side">
        <p class="lede" data-enter style="--d: .35s">{{ t('Software engineer in Bordeaux. I build websites that feel alive.', 'Ingénieur logiciel à Bordeaux. Je construis des sites qui ont du vivant.') }}</p>
        <div data-enter style="--d: .55s"><Magnetic class="btn" href="#contact">{{ t('Work with me', 'Travaillons ensemble') }}</Magnetic></div>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
/* Name sized by both axes so it never pushes the CTA under the dock, whatever the window. */
.hero-grid {
  min-height: 100dvh;
  padding: clamp(72px, 13vh, 140px) var(--margin) 112px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr auto;
  column-gap: 24px;
}
.name { grid-column: 1 / -1; font-size: min(13.6vw, 25vh); transition: color .8s var(--ease-out); }
.line { display: block; }
.line + .line { padding-left: .9em; }
:global(html.field-live .hero .name) { color: transparent; }
.hero-side { grid-column: 8 / -1; grid-row: 3; display: grid; gap: 24px; justify-items: start; align-self: end; }
.lede { font-size: clamp(19px, 1.6vw, 25px); line-height: 1.3; max-width: 24ch; }
.cue {
  grid-column: 1 / 5; grid-row: 3; align-self: end;
  display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--fg-2);
}
.cue:hover { color: var(--fg); }
.cue-line { position: relative; width: 1px; height: 44px; background: var(--line); overflow: hidden; }
.cue-line::after {
  content: ''; position: absolute; left: 0; top: 0; width: 1px; height: 14px; background: var(--accent);
  animation: drop 1.8s var(--ease-io) infinite;
}
@keyframes drop { from { translate: 0 -14px; } to { translate: 0 44px; } }
@media (max-width: 767px) {
  .name { font-size: 15.5vw; }
  .line + .line { padding-left: 0; }
  .hero-side { grid-column: 1 / -1; grid-row: 2; align-self: end; }
  .cue { grid-column: 1 / -1; margin-top: 40px; }
}
</style>
