<!--
Other "readers": three glyph comets wandering the page like people do. Each drifts to something on
screen (a heading, a screenshot, a button), dwells, sweeps across text the way eyes do, and moves on,
leaving a short tail of code glyphs and a blueprint-style tag naming what it's looking at.
Simulated on purpose (Tim, 2026-11-03: low traffic); nothing claims they are real people.
Desktop only, off under reduced motion, and switchable in the settings dock.
-->
<script setup lang="ts">
import gsap from 'gsap'

const COUNT = 3, TAIL = 9
const settings = useSettings()
const fine = ref(false)
const on = computed(() => fine.value && settings.ghosts)
const GLYPHS = '{}<>/=;:()[]*+#&$%'
type Ghost = { x: number, y: number, trail: { x: number, y: number, c: string }[], tag: string }
const ghosts = reactive<Ghost[]>([])
let alive = true

const TARGETS = '.bp-surface :is(h1, h2, h3, .frame, .btn, .tagline, .msg, .site, .answers button, .lede, .stack)'
function pick() {
  const list = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter((e) => {
    const b = e.getBoundingClientRect()
    return b.bottom > 60 && b.top < innerHeight - 80 && b.width > 20
  })
  return list[Math.floor(Math.random() * list.length)]
}
const tagOf = (e?: HTMLElement) => e ? `${e.tagName.toLowerCase()}${e.classList[0] && !e.classList[0].startsWith('data-v') ? '.' + e.classList[0] : ''}` : ''

async function live(g: Ghost, k: number) {
  await new Promise((r) => setTimeout(r, 1200 + k * 1500))
  while (alive) {
    if (!on.value) { await new Promise((r) => setTimeout(r, 1000)); continue }
    const t = pick()
    const b = t?.getBoundingClientRect()
    const tx = b ? b.left + b.width * (0.15 + Math.random() * 0.5) : Math.random() * innerWidth
    const ty = b ? b.top + Math.min(b.height, 120) * (0.3 + Math.random() * 0.4) : Math.random() * innerHeight
    g.tag = ''
    await gsap.to(g, { x: tx, y: ty, duration: Math.min(2.6, 0.8 + Math.hypot(tx - g.x, ty - g.y) / 650), ease: 'power2.inOut' })
    g.tag = tagOf(t)
    if (b && b.width > 200 && Math.random() < 0.6) {
      await gsap.to(g, { x: Math.min(b.right - 10, g.x + b.width * 0.5), duration: 1.4 + Math.random(), ease: 'none' })
    }
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 3600))
  }
}

// The tail: every few frames each ghost drops a glyph where it was; old ones fade out.
let frame = 0
const tick = () => {
  if (++frame % 3) return
  for (const g of ghosts) {
    const last = g.trail[0]
    if (!last || Math.hypot(last.x - g.x, last.y - g.y) > 6) g.trail.unshift({ x: g.x, y: g.y, c: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]! })
    else g.trail.pop()
    if (g.trail.length > TAIL) g.trail.length = TAIL
  }
}

onMounted(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  fine.value = true
  for (let k = 0; k < COUNT; k++) {
    const g = reactive<Ghost>({ x: innerWidth * (0.2 + 0.3 * k), y: innerHeight * (0.3 + 0.2 * k), trail: [], tag: '' })
    ghosts.push(g)
    live(g, k)
  }
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => { alive = false; gsap.ticker.remove(tick) })
</script>

<template>
  <div v-if="on" class="ghosts" aria-hidden="true" data-enter style="--d: 2s">
    <div v-for="(g, k) in ghosts" :key="k" class="ghost" :class="`g${k}`">
      <span v-for="(t, i) in g.trail" :key="i" class="glyph" :style="{ translate: `${t.x}px ${t.y}px`, opacity: 0.55 * (1 - i / 9), scale: 1 - i * 0.06 }">{{ t.c }}</span>
      <span class="head" :style="{ translate: `${g.x}px ${g.y}px` }">
        <i />
        <Transition name="tag"><b v-if="g.tag" class="tag">{{ g.tag }}</b></Transition>
      </span>
    </div>
  </div>
</template>

<style scoped>
.ghosts { position: fixed; inset: 0; z-index: 30; pointer-events: none; }
.ghost { --c: var(--accent); }
.ghost.g1 { --c: color-mix(in oklab, var(--fg) 70%, transparent); }
.glyph, .head { position: absolute; left: 0; top: 0; }
.glyph { font: 11px/1 var(--mono); color: var(--c); margin: -6px 0 0 -3px; }
.head i { display: block; width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 3px color-mix(in oklab, var(--ink) 70%, transparent), 0 0 14px var(--c); }
.tag {
  position: absolute; left: 10px; top: 6px; padding: 1px 5px; border-radius: 3px;
  background: color-mix(in oklab, var(--ink-2) 85%, transparent); border: 1px solid color-mix(in oklab, var(--c) 50%, transparent);
  font: 400 10px/1.4 var(--mono); color: var(--c); white-space: nowrap;
}
.tag-enter-active, .tag-leave-active { transition: opacity .3s, translate .3s var(--ease-out); }
.tag-enter-from, .tag-leave-to { opacity: 0; translate: -4px 0; }
</style>
