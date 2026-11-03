<!--
Replaces the native scrollbar (hidden on purpose, Tim 2026-11-03). A thin rail on the right edge: one tick
per section (click to go there), a blue thumb you can drag, and the current section's name and progress
beside it. Keeps what a scrollbar is for (where am I, how much is left, drag to jump) in the site's own language.
-->
<script setup lang="ts">
import gsap from 'gsap'
import type Lenis from 'lenis'

const props = defineProps<{ sections: { id: string, label: string }[] }>()
const rail = ref<HTMLElement>()
const thumb = ref<HTMLElement>()
const progress = ref(0)
const current = ref(props.sections[0]?.label ?? '')
const ticks = ref<number[]>([])
let lenis: Lenis | null = null

const maxScroll = () => document.documentElement.scrollHeight - innerHeight
function measure() {
  const max = maxScroll()
  ticks.value = props.sections.map((s) => {
    const el = document.getElementById(s.id)
    return el && max > 0 ? Math.min(1, (el.getBoundingClientRect().top + scrollY) / max) : 0
  })
}
function go(i: number) {
  const el = document.getElementById(props.sections[i]!.id)
  if (el) lenis ? lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
}

// Drag the thumb (or press anywhere on the rail) to scrub the page.
function scrubFrom(e: PointerEvent) {
  const b = rail.value!.getBoundingClientRect()
  const set = (y: number) => {
    const p = Math.min(1, Math.max(0, (y - b.top) / b.height))
    lenis ? lenis.scrollTo(p * maxScroll(), { immediate: true }) : scrollTo(0, p * maxScroll())
  }
  set(e.clientY)
  const move = (ev: PointerEvent) => set(ev.clientY)
  const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up) }
  addEventListener('pointermove', move)
  addEventListener('pointerup', up)
}

const tick = () => {
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, maxScroll())))
  progress.value = Math.round(p * 100)
  if (thumb.value) thumb.value.style.translate = `0 ${p * (rail.value?.clientHeight ?? 0)}px`
  let label = props.sections[0]?.label ?? ''
  ticks.value.forEach((t, i) => { if (p >= t - 0.02) label = props.sections[i]!.label })
  current.value = label
}

let ro: ResizeObserver | undefined
onMounted(() => {
  lenis = useNuxtApp().$lenis as Lenis | null
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(document.body)
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => { gsap.ticker.remove(tick); ro?.disconnect() })
</script>

<template>
  <nav class="rail-wrap" aria-label="Page sections" data-enter style="--d: 1.05s">
    <div ref="rail" class="rail" @pointerdown.prevent="scrubFrom">
      <button
        v-for="(s, i) in sections" :key="s.id" class="tick" :style="{ top: `${(ticks[i] ?? 0) * 100}%` }"
        :aria-label="`Go to ${s.label}`" @pointerdown.stop @click="go(i)"
      >
        <span class="mono">{{ s.label }}</span>
      </button>
      <div ref="thumb" class="thumb">
        <span class="mono now">{{ current }} <b>{{ String(progress).padStart(2, '0') }}</b></span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.rail-wrap { position: fixed; z-index: 40; right: 22px; top: 50%; transform: translateY(-50%); }
.rail { position: relative; width: 14px; height: min(38vh, 320px); cursor: ns-resize; touch-action: none; }
.rail::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--line); }
.tick {
  position: absolute; left: 0; width: 14px; height: 9px; translate: 0 -50%;
  padding: 0; border: 0; background: none; cursor: pointer;
}
.tick::before { content: ''; position: absolute; left: 3px; right: 3px; top: 4px; height: 1px; background: var(--fg-2); }
.tick span {
  position: absolute; right: 22px; top: 50%; translate: 0 -50%; white-space: nowrap;
  color: var(--fg-2); font-size: 11px; opacity: 0; transition: opacity .25s;
}
.rail:hover .tick span { opacity: 1; }
.tick:hover span { color: var(--fg); }
.thumb { position: absolute; left: 5px; top: 0; width: 4px; height: 26px; margin-top: -13px; background: var(--accent); border-radius: 2px; pointer-events: none; }
.now { position: absolute; right: 18px; top: 50%; translate: 0 -50%; white-space: nowrap; font-size: 11px; color: var(--fg); transition: opacity .25s; }
.now b { font-weight: 400; color: var(--accent); }
.rail:hover .now { opacity: 0; }
@media (max-width: 767px) { .rail-wrap { right: 6px; } .now, .tick, .rail::before { display: none; } }
</style>
