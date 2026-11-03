<!--
A screenshot, nearly fullscreen. Opens by growing from the thumbnail that was clicked (FLIP with GSAP),
closes back into it; ←/→ step through the set, Esc or a click outside closes, focus moves in and back.
Scroll is held while it's open. Fixed layer under the custom cursor (z 90 < 100) so the cursor stays.
-->
<script setup lang="ts">
import gsap from 'gsap'
import type Lenis from 'lenis'

const props = defineProps<{ images: string[], title: string }>()
const index = defineModel<number | null>('index', { default: null })
const { t } = useLang()
const img = ref<HTMLImageElement>()
const closeBtn = ref<HTMLButtonElement>()
let from: Element | null = null // thumbnail it opened from, to fly back into
let lastFocus: Element | null = null
let lenis: Lenis | null = null
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** Transform that puts the big image exactly over `el` (FLIP "first"). */
function overThumb(el: Element) {
  const a = el.getBoundingClientRect(), b = img.value!.getBoundingClientRect()
  return { x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2), scale: a.width / b.width }
}

async function open(i: number, thumb: Element | null) {
  from = thumb; lastFocus = document.activeElement
  index.value = i
  lenis = useNuxtApp().$lenis as Lenis | null
  lenis?.stop()
  await nextTick()
  await img.value!.decode().catch(() => {})
  closeBtn.value?.focus({ preventScroll: true })
  if (reduce() || !from) return
  gsap.fromTo(img.value!, { ...overThumb(from), borderRadius: 6 }, { x: 0, y: 0, scale: 1, borderRadius: 10, duration: 0.7, ease: 'expo.out' })
}

function close() {
  if (index.value === null) return
  const done = () => { index.value = null; lenis?.start(); (lastFocus as HTMLElement | null)?.focus?.({ preventScroll: true }) }
  const thumb = from
  if (reduce() || !thumb || !img.value) return done()
  gsap.to('.lb-chrome', { autoAlpha: 0, duration: 0.2 })
  gsap.to(img.value, { ...overThumb(thumb), borderRadius: 6, duration: 0.5, ease: 'expo.inOut', onComplete: done })
}

function step(d: number) {
  if (index.value === null) return
  index.value = (index.value + d + props.images.length) % props.images.length
  from = document.querySelectorAll('.bp-surface .shots .frame')[index.value - 1] ?? null // back into the right thumbnail
  if (!reduce() && img.value) gsap.fromTo(img.value, { autoAlpha: 0, x: 24 * d }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' })
}

function key(e: KeyboardEvent) {
  if (index.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}
onMounted(() => addEventListener('keydown', key))
onBeforeUnmount(() => { removeEventListener('keydown', key); if (index.value !== null) lenis?.start() })
defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div v-if="index !== null" class="lb" role="dialog" aria-modal="true" :aria-label="`${title}, ${t('screenshot', 'capture')} ${index + 1}`" @click.self="close">
        <img ref="img" :src="images[index]" :alt="`${title}, ${t('screenshot', 'capture')} ${index + 1}`" class="lb-img" @click="close">
        <div class="lb-chrome">
          <p class="count mono">{{ index + 1 }} / {{ images.length }}</p>
          <button ref="closeBtn" type="button" class="close" :data-cursor="t('Close', 'Fermer')" :aria-label="t('Close', 'Fermer')" @click="close"><i /><i /></button>
          <button type="button" class="nav prev" :aria-label="t('Previous', 'Précédente')" @click="step(-1)">←</button>
          <button type="button" class="nav next" :aria-label="t('Next', 'Suivante')" @click="step(1)">→</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb {
  position: fixed; inset: 0; z-index: 90; display: grid; place-items: center;
  background: color-mix(in oklab, var(--ink) 78%, transparent);
  -webkit-backdrop-filter: blur(18px) saturate(140%); backdrop-filter: blur(18px) saturate(140%);
}
.lb-img {
  max-width: 92vw; max-height: 86vh; width: auto; height: auto; border-radius: 10px;
  box-shadow: 0 40px 120px -30px color-mix(in oklab, var(--accent) 40%, transparent); cursor: zoom-out;
}
.count { position: fixed; left: 28px; top: 24px; color: var(--fg-2); }
.close { position: fixed; right: 22px; top: 18px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: color-mix(in oklab, var(--ink-2) 70%, transparent); cursor: pointer; display: grid; place-items: center; }
.close i { position: absolute; width: 16px; height: 1.5px; background: var(--fg); rotate: 45deg; }
.close i + i { rotate: -45deg; }
.nav { position: fixed; top: 50%; translate: 0 -50%; width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--line); background: color-mix(in oklab, var(--ink-2) 70%, transparent); color: var(--fg); font: 18px var(--sans); cursor: pointer; }
.nav:hover, .close:hover { border-color: var(--accent); }
.prev { left: 20px; } .next { right: 20px; }
/* The scrim is glass: fade its tint and blur, never its opacity (Chrome would drop the blur mid-fade). */
.lb-enter-active, .lb-leave-active { transition: background-color .4s var(--ease-out), backdrop-filter .4s var(--ease-out), -webkit-backdrop-filter .4s var(--ease-out); }
.lb-enter-from, .lb-leave-to { background-color: transparent; -webkit-backdrop-filter: blur(0); backdrop-filter: blur(0); }
@media (max-width: 767px) { .nav { top: auto; bottom: 24px; translate: 0; } }
</style>
