<script setup lang="ts">
import src from './Work.vue?raw'
import { projects } from '~/data/projects'
</script>

<template>
  <Blueprint :source="src" class="work" id="work">
    <div class="work-inner">
      <h2 class="display">Work</h2>
      <article v-for="p in projects" :key="p.slug" class="exhibit">
        <div class="meta">
          <span class="mono muted">{{ p.year }} / {{ p.role }}</span>
          <h3 class="display">{{ p.title }}</h3>
          <p>{{ p.tagline }}</p>
          <p class="mono muted">{{ p.stack.join('  ') }}</p>
          <div class="links">
            <a v-if="p.live" :href="p.live" target="_blank" rel="noopener">Live site</a>
            <a v-if="p.demo" :href="p.demo" target="_blank" rel="noopener">Video</a>
          </div>
        </div>
        <img :src="p.images[0]" :alt="`${p.title} screenshot`" loading="lazy">
      </article>
    </div>
  </Blueprint>
</template>

<style scoped>
.work-inner { padding: 14vh var(--margin); display: grid; gap: 18vh; }
h2 { font-size: clamp(64px, 11vw, 180px); }
.exhibit { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; align-items: end; }
.meta { grid-column: 1 / 5; display: grid; gap: 14px; justify-items: start; }
.exhibit:nth-child(odd) .meta { grid-column: 9 / -1; grid-row: 1; }
.exhibit:nth-child(odd) img { grid-column: 1 / 8; grid-row: 1; }
h3 { font-size: clamp(36px, 4vw, 64px); }
img { grid-column: 6 / -1; width: 100%; display: block; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
.links { display: flex; gap: 20px; }
.links a { text-decoration: none; border-bottom: 1px solid var(--claret); padding-bottom: 2px; }
@media (max-width: 767px) {
  .exhibit .meta, .exhibit img, .exhibit:nth-child(odd) .meta, .exhibit:nth-child(odd) img { grid-column: 1 / -1; grid-row: auto; }
  .exhibit img { margin-top: 28px; }
}
</style>
