<!--
Two rows of framed client sites drifting in opposite directions. Scrolling pushes them (speed and
direction follow the scroll); hovering settles the wall. Each tile opens the live site. The offset
lives at module level so the Blueprint copy and the surface move as one.
-->
<script lang="ts">
import gsap from 'gsap'
const motion = { x: 0, hover: false, users: 0 }
let speed = 0
const tick = (_t: number, dt: number) => {
  const target = motion.hover ? 0 : 30 + Math.min(Math.abs(stage.velocity) * 40, 1600)
  speed += (target * Math.sign(stage.velocity || 1) - speed) * 0.06
  motion.x += speed * dt / 1000
}
</script>

<script setup lang="ts">
import { clients } from '~/data/projects'

const { t, L } = useLang()
const half = Math.ceil(clients.length / 2)
const rows = [clients.slice(0, half), clients.slice(half)]
const tracks = ref<HTMLElement[]>([])
const reduce = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches

const place = () => {
  tracks.value.forEach((t, i) => {
    const w = t.scrollWidth / 2 // each row is rendered twice for the loop
    const x = ((motion.x % w) + w) % w
    t.style.translate = `${i ? x - w : -x}px 0`
  })
}
onMounted(() => {
  if (!motion.users++) gsap.ticker.add(tick)
  if (!reduce) gsap.ticker.add(place)
})
onBeforeUnmount(() => {
  gsap.ticker.remove(place)
  if (!--motion.users) gsap.ticker.remove(tick)
})
</script>

<template>
  <div class="wall" @pointerenter="motion.hover = true" @pointerleave="motion.hover = false">
    <div v-for="(row, r) in rows" :key="r" class="row">
      <ul :ref="(el) => { if (el) tracks[r] = el as HTMLElement }" class="track">
        <li v-for="(c, i) in [...row, ...row]" :key="i" :aria-hidden="i >= row.length">
          <a class="site" :href="c.url" target="_blank" rel="noopener" :data-cursor="t('Visit', 'Visiter')" :tabindex="i >= row.length ? -1 : undefined">
            <div class="bar mono"><span class="dot" />{{ c.name }}<span class="trade">{{ L(c.trade) }}</span></div>
            <img :src="`/clients/${c.slug}.webp`" :alt="`${t('Website of', 'Site de')} ${c.name}`" loading="lazy" decoding="async" width="960" height="540">
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.wall { display: grid; gap: 20px; overflow: clip; padding-block: 8px; min-width: 0; }
.row { min-width: 0; overflow: clip; } /* grid items default to min-width: auto, which would widen the page */
.track { display: flex; gap: 20px; width: max-content; margin: 0; padding: 0; list-style: none; will-change: translate; }
.site { display: block; width: clamp(260px, 27vw, 460px); border: 1px solid var(--line); border-radius: 12px; overflow: clip; background: var(--ink-2); text-decoration: none; transition: border-color .3s, translate .5s var(--ease-out); }
.site:hover { border-color: var(--accent); translate: 0 -4px; }
.bar { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 11px; color: var(--fg); white-space: nowrap; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex: none; }
.trade { margin-left: auto; color: var(--fg-2); }
img { display: block; width: 100%; height: auto; }
@media (prefers-reduced-motion: reduce) { .wall { overflow-x: auto; } }
</style>
