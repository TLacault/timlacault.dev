<!--
One project on the home page: its title as a Field shape, the facts, and the lead screenshot in a frame
at its natural ratio. The frame and the button open the project's own page, where the screenshot
continues as the page's hero (shared view-transition-name).
-->
<script setup lang="ts">
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project, index: number }>()
const to = `/work/${props.project.slug}`
const host = props.project.live?.replace(/^https?:\/\//, '') ?? ''
</script>

<template>
  <article class="exhibit" :class="{ flip: index % 2 }">
    <header class="head">
      <p class="mono kicker"><span>{{ String(index + 1).padStart(2, '0') }}</span> {{ project.kind }} / {{ project.role }} / {{ project.year }}</p>
      <h3 class="display title" data-field="name">
        <span v-for="w in project.title.split(' ')" :key="w" class="line">{{ w }}</span>
      </h3>
    </header>
    <div class="meta">
      <p class="tagline">{{ project.tagline }}</p>
      <ul class="stack mono"><li v-for="s in project.stack" :key="s">{{ s }}</li></ul>
      <Magnetic class="btn" :href="to">See the project</Magnetic>
    </div>
    <NuxtLink :to="to" class="frame" data-cursor="Open" :aria-label="`Open ${project.title}`">
      <div class="bar mono"><span class="dot" /><span>{{ host }}</span></div>
      <img :src="project.images[0]" :alt="`${project.title}, home screen`" :style="{ viewTransitionName: `shot-${project.slug}` }" loading="lazy" decoding="async">
    </NuxtLink>
  </article>
</template>

<style scoped>
.exhibit {
  padding: 16vh var(--margin) 6vh;
  display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 5vh; align-items: end;
}
.head { grid-column: 1 / -1; }
.kicker { color: var(--fg-2); margin-bottom: 14px; }
.kicker span { color: var(--accent); }
.title { font-size: min(8.4vw, 15vh); }
.line { display: inline-block; margin-right: .28em; }
:global(html.field-live .exhibit .title) { color: transparent; }
.flip .head { text-align: right; }
.flip .line { margin: 0 0 0 .28em; }

.meta { grid-column: 1 / 5; display: grid; gap: 20px; justify-items: start; }
.tagline { font-size: 18px; line-height: 1.45; max-width: 34ch; }
.stack { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.stack li { padding: 3px 9px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg-2); font-size: 12px; }

.frame {
  grid-column: 5 / -1; display: block; text-decoration: none;
  border: 1px solid var(--line); border-radius: 14px; overflow: clip; background: var(--ink-2);
  box-shadow: 0 40px 90px -50px color-mix(in oklab, var(--accent) 45%, transparent);
  transition: border-color .3s, translate .6s var(--ease-out);
}
.frame:hover { border-color: color-mix(in oklab, var(--accent) 60%, var(--line)); translate: 0 -6px; }
.flip .meta { grid-column: 9 / -1; grid-row: 2; }
.flip .frame { grid-column: 1 / 9; grid-row: 2; }
.bar { display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 14px; border-bottom: 1px solid var(--line); color: var(--fg-2); font-size: 12px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
img { display: block; width: 100%; height: auto; } /* natural ratio: the frame fits the image, nothing cropped */

@media (max-width: 767px) {
  .exhibit { padding-top: 12vh; }
  .title { font-size: 9.4vw; }
  .flip .head { text-align: left; }
  .meta, .frame, .flip .meta, .flip .frame { grid-column: 1 / -1; grid-row: auto; }
}
</style>
