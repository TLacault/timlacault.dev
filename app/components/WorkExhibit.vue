<!--
One project, one viewport. A tall wrapper with a sticky stage: scrolling through the wrapper steps
through the screenshots in the frame. Sticky (not a GSAP pin) so the Blueprint copy lays out the same.
The title is a Field shape: the glyphs spell it while the exhibit is centred.
-->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project, index: number }>()
const wrap = ref<HTMLElement>()
const active = ref(0)
const host = computed(() => props.project.live?.replace(/^https?:\/\//, '') ?? '')
let st: ScrollTrigger | undefined

onMounted(() => {
  st = ScrollTrigger.create({
    trigger: wrap.value!, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => { active.value = Math.min(props.project.images.length - 1, Math.floor(self.progress * props.project.images.length)) },
  })
})
onBeforeUnmount(() => st?.kill())
</script>

<template>
  <article ref="wrap" class="exhibit" :style="{ '--n': project.images.length }">
    <div class="stage">
      <header class="head">
        <p class="mono kicker"><span>{{ String(index + 1).padStart(2, '0') }}</span> {{ project.kind }} / {{ project.role }} / {{ project.year }}</p>
        <h3 class="display title" data-field="name">
          <span v-for="w in project.title.split(' ')" :key="w" class="line">{{ w }}</span>
        </h3>
      </header>
      <div class="meta">
        <p class="tagline">{{ project.tagline }}</p>
        <ul class="stack mono"><li v-for="s in project.stack" :key="s">{{ s }}</li></ul>
        <div class="links">
          <a v-if="project.live" :href="project.live" target="_blank" rel="noopener">Live site</a>
          <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener">Watch the demo</a>
        </div>
      </div>
      <figure class="frame">
        <div class="bar mono"><span class="dot" /><span class="url">{{ host }}</span><span class="count">{{ active + 1 }} of {{ project.images.length }}</span></div>
        <div class="screen">
          <img
            v-for="(src, i) in project.images" :key="src" :src="src" :class="{ on: i === active }"
            :alt="`${project.title}, screenshot ${i + 1}`" loading="lazy" decoding="async"
          >
        </div>
      </figure>
    </div>
  </article>
</template>

<style scoped>
.exhibit { height: calc(100dvh + var(--n) * 45vh); }
.stage {
  position: sticky; top: 0; height: 100dvh;
  padding: clamp(64px, 11vh, 120px) var(--margin) clamp(112px, 14vh, 140px);
  display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto 1fr; column-gap: 24px; row-gap: 4vh;
}
.head { grid-column: 1 / -1; }
.kicker { color: var(--fg-2); margin-bottom: 14px; }
.kicker span { color: var(--accent); }
.title { font-size: min(8.4vw, 15vh); }
.line { display: inline-block; margin-right: .28em; }
:global(html.field-live .exhibit .title) { color: transparent; }
.meta { grid-column: 1 / 5; align-self: end; display: grid; gap: 18px; justify-items: start; }
.tagline { font-size: 18px; line-height: 1.45; max-width: 34ch; }
.stack { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.stack li { padding: 3px 9px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg-2); font-size: 12px; }
.links { display: flex; gap: 22px; }
.links a { text-decoration: none; border-bottom: 1px solid var(--accent); padding-bottom: 2px; }
.links a:hover { color: var(--accent); }

.frame {
  grid-column: 5 / -1; align-self: end; margin: 0; min-height: 0; height: 100%; max-height: 62vh;
  display: grid; grid-template-rows: auto 1fr;
  border: 1px solid var(--line); border-radius: 14px; overflow: clip;
  background: var(--ink-2);
  box-shadow: 0 40px 80px -40px color-mix(in oklab, var(--accent) 35%, transparent);
}
.bar { display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 14px; border-bottom: 1px solid var(--line); color: var(--fg-2); font-size: 12px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.count { margin-left: auto; }
.screen { position: relative; min-height: 0; }
/* contain: screenshots are never cropped, whatever their ratio (phone shots included) */
.screen img {
  position: absolute; inset: 12px; width: calc(100% - 24px); height: calc(100% - 24px);
  object-fit: contain; border-radius: 6px;
  opacity: 0; scale: .985; transition: opacity .5s var(--ease-out), scale .7s var(--ease-out);
}
.screen img.on { opacity: 1; scale: 1; }

@media (max-width: 767px) {
  .exhibit { height: auto; }
  .stage { position: relative; height: auto; display: flex; flex-direction: column; gap: 28px; padding-block: 12vh; }
  .title { font-size: 9.4vw; }
  .frame { height: auto; max-height: none; }
  .screen { aspect-ratio: 16 / 10; }
}
</style>
