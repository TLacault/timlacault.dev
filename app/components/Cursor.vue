<!--
kind: cursor
energy: lively
cost: gsap
interaction: pointer
mood: tech, luxury, editorial
Custom cursor: a dot that trails the pointer, grows into a colour-inverting disc on links (content stays readable),
shows an accent label bubble for [data-cursor="Label"].
Fine pointers only; touch keeps the native behaviour.
-->
<script setup lang="ts">
import gsap from 'gsap'

const root = ref<HTMLElement>()
const label = ref('')
const state = ref<'' | 'link' | 'label'>('')
const active = ref(false)
// The blend mode sits on the fixed root: a fixed element is its own stacking context, so a blend
// set on a child only blends with the empty root and paints an opaque disc over the content.
let cleanup = () => {}

onMounted(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  active.value = true
  document.documentElement.classList.add('has-cursor')
  const el = root.value!
  const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
  const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })

  let hidden = false
  const move = (e: PointerEvent) => {
    if (hidden) enter()
    x(e.clientX)
    y(e.clientY)
    const t = (e.target as Element).closest?.('[data-cursor], a, button')
    label.value = t?.getAttribute('data-cursor') ?? ''
    state.value = !t ? '' : label.value ? 'label' : 'link'
  }
  function leave() { hidden = true; gsap.to(el, { autoAlpha: 0, duration: 0.2 }) }
  function enter() { hidden = false; gsap.to(el, { autoAlpha: 1, duration: 0.2 }) }
  // An iframe (a YouTube player, a map) swallows pointer events: the page sees a mouseout with no
  // relatedTarget and nothing after it. Hide the cursor there instead of leaving it stuck on the edge;
  // the next pointermove back in the page brings it back.
  const out = (e: MouseEvent) => { if (!e.relatedTarget) leave() }
  addEventListener('pointermove', move)
  document.addEventListener('pointerleave', leave)
  document.addEventListener('pointerenter', enter)
  document.addEventListener('mouseout', out)
  cleanup = () => {
    document.removeEventListener('mouseout', out)
    removeEventListener('pointermove', move)
    document.removeEventListener('pointerleave', leave)
    document.removeEventListener('pointerenter', enter)
    document.documentElement.classList.remove('has-cursor')
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div v-show="active" ref="root" class="cursor-root" :class="state !== 'label' && 'blend'" aria-hidden="true">
    <div class="fx-cursor" :class="state && `is-${state}`">
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.cursor-root { position: fixed; left: 0; top: 0; z-index: 100; pointer-events: none; }
.cursor-root.blend { mix-blend-mode: difference; }
.fx-cursor {
  display: grid;
  place-items: center;
  width: 12px;
  height: 12px;
  translate: -50% -50%;
  border-radius: 999px;
  background: #fff; /* white + difference = exact colour inversion of whatever is under it */
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s;
}
.fx-cursor span {
  font: 400 11px/1 var(--mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--on-accent, var(--ink)); /* pages with a dark accent set --on-accent */
  opacity: 0;
  transition: opacity 0.2s;
}
.fx-cursor.is-link { width: 56px; height: 56px; }
.fx-cursor.is-label { width: 92px; height: 92px; background: var(--accent); }
.fx-cursor.is-label span { opacity: 1; }
</style>
