<!--
Other "visitors": three faint cursors that read the page like people do. Each one drifts to something
on screen (a heading, a screenshot, a button), dwells, sweeps across text the way eyes do, and moves on.
Simulated on purpose (Tim, 2026-11-03: low traffic, so simulate them); nothing claims they are real
people. Desktop only, none under reduced motion. Real visitors (Supabase presence) can join later.
-->
<script setup lang="ts">
import gsap from 'gsap'

const COUNT = 3
const els = ref<HTMLElement[]>([])
const on = ref(false)
let alive = true

const TARGETS = '.bp-surface :is(h1, h2, h3, .frame, .btn, .tagline, .msg, .site, .answers button, .lede)'
function pick() {
  const list = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter((e) => {
    const b = e.getBoundingClientRect()
    return b.bottom > 60 && b.top < innerHeight - 80 && b.width > 20
  })
  return list[Math.floor(Math.random() * list.length)]
}

async function live(el: HTMLElement, k: number) {
  const pos = { x: innerWidth * (0.2 + 0.3 * k), y: innerHeight * (0.3 + 0.2 * k) }
  const set = () => { el.style.translate = `${pos.x}px ${pos.y}px` }
  set()
  await new Promise((r) => setTimeout(r, 1500 + k * 1700))
  while (alive) {
    const t = pick()
    const b = t?.getBoundingClientRect()
    const tx = b ? b.left + b.width * (0.15 + Math.random() * 0.5) : Math.random() * innerWidth
    const ty = b ? b.top + Math.min(b.height, 120) * (0.3 + Math.random() * 0.4) : Math.random() * innerHeight
    const d = Math.hypot(tx - pos.x, ty - pos.y)
    await gsap.to(pos, { x: tx, y: ty, duration: Math.min(2.6, 0.7 + d / 700), ease: 'power2.inOut', onUpdate: set })
    // Reading a line: a slow sweep to the right, then a small return.
    if (b && b.width > 200 && Math.random() < 0.6) {
      await gsap.to(pos, { x: Math.min(b.right - 10, pos.x + b.width * 0.5), duration: 1.4 + Math.random(), ease: 'none', onUpdate: set })
    }
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 3600))
  }
}

onMounted(async () => {
  await nextTick()
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  on.value = true
  await nextTick()
  els.value.forEach((el, k) => live(el, k))
})
onBeforeUnmount(() => { alive = false })
</script>

<template>
  <div v-if="on" class="ghosts" aria-hidden="true" data-enter style="--d: 2s">
    <div v-for="k in COUNT" :key="k" :ref="(el) => { if (el) els[k - 1] = el as HTMLElement }" class="ghost">
      <svg viewBox="0 0 12 16" width="12" height="16"><path d="M1 1 L1 13 L4.2 10 L6.6 15 L8.4 14.2 L6 9.4 L10.5 9.4 Z" /></svg>
    </div>
  </div>
</template>

<style scoped>
.ghosts { position: fixed; inset: 0; z-index: 30; pointer-events: none; }
.ghost { position: absolute; left: 0; top: 0; }
.ghost svg { display: block; fill: color-mix(in oklab, var(--fg) 30%, transparent); stroke: color-mix(in oklab, var(--ink) 80%, transparent); stroke-width: .8; }
.ghost:nth-child(2) svg { fill: color-mix(in oklab, var(--accent) 45%, transparent); }
</style>
