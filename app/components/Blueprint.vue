<!--
A section that can be seen through. The slot renders twice: the surface, and an inert copy in blueprint
styling (outlines and the component's real source behind). The copy is clipped to the Lens circle and the
surface is masked out of it, using --cx/--cy/--lr set per frame by plugins/stage.client.ts.
Alignment rules (checked by test/align.mjs): the copy inherits the root's padding, so padding on a
Blueprint is safe; nothing is added to the copy's own elements, so their layout can't change. The size
labels live in a separate overlay, re-measured a few times a second while the lens is over the section.
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{ source?: string, tag?: string }>(), { tag: 'section' })
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const labels = ref<{ x: number, y: number, t: string }[]>([])

function label() {
  const r = root.value?.getBoundingClientRect()
  if (!r || !copy.value) return
  const out: typeof labels.value = []
  for (const el of copy.value.querySelectorAll<HTMLElement>('*')) {
    const b = el.getBoundingClientRect()
    if (b.width < 48 || b.height < 18 || b.bottom < 0 || b.top > innerHeight) continue
    if (getComputedStyle(el).display === 'inline') continue
    const cls = [...el.classList].find((c) => !c.startsWith('data-v'))
    out.push({ x: b.left - r.left, y: b.top - r.top, t: `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}  ${Math.round(b.width)}×${Math.round(b.height)}` })
    if (out.length > 160) break
  }
  labels.value = out
}

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  stage.blueprints.add(root.value!)
  // Only while the lens is open over this section: labels follow sticky and moving content.
  timer = setInterval(() => {
    const b = root.value!.getBoundingClientRect()
    const over = stage.lr > 1 && stage.ly + stage.lr > b.top && stage.ly - stage.lr < b.bottom
    if (over) label()
    else if (labels.value.length) labels.value = []
  }, 160)
})
onBeforeUnmount(() => { stage.blueprints.delete(root.value!); clearInterval(timer) })
</script>

<template>
  <component :is="props.tag" ref="root" class="bp">
    <div class="bp-surface"><BpScope><slot /></BpScope></div>
    <div class="bp-xray" aria-hidden="true" inert>
      <pre v-if="source" class="bp-src">{{ source }}</pre>
      <div ref="copy" class="bp-copy"><BpScope xray><slot /></BpScope></div>
      <span v-for="(l, i) in labels" :key="i" class="bp-label" :style="{ translate: `${l.x}px ${l.y}px` }">{{ l.t }}</span>
    </div>
  </component>
</template>

<style scoped>
.bp { position: relative; z-index: 1; }
.bp-surface {
  -webkit-mask-image: radial-gradient(circle var(--lr, 0px) at var(--sx, -999px) var(--sy, -999px), transparent 99%, #000 100%);
  mask-image: radial-gradient(circle var(--lr, 0px) at var(--sx, -999px) var(--sy, -999px), transparent 99%, #000 100%);
}
.bp-xray {
  position: absolute; inset: 0; overflow: clip; pointer-events: none; /* clip, not hidden: sticky children keep sticking */
  padding: inherit; /* same content box as the surface, whatever padding the section has */
  clip-path: circle(var(--lr, 0px) at var(--cx, -999px) var(--cy, -999px));
  background-image:
    linear-gradient(color-mix(in oklab, var(--accent) 9%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--accent) 9%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: var(--margin) 0;
}
.bp-src {
  position: absolute; inset: 0; margin: 0; padding: 24px var(--margin);
  font: 11px/1.45 var(--mono); color: color-mix(in oklab, var(--fg) 22%, transparent);
  white-space: pre-wrap; word-break: break-all; overflow: hidden;
  transition: color .4s var(--ease-out);
}
/* Held open: the source steps back, the layout reads on top of it. */
:global(html.lens-held .bp-src) { color: color-mix(in oklab, var(--fg) 12%, transparent); }
:global(html.lens-held .bp-xray) { background-color: color-mix(in oklab, var(--ink) 55%, transparent); }
.bp-copy { position: relative; color: var(--fg); text-shadow: 0 0 6px var(--ink), 0 0 2px var(--ink); }
.bp-copy :deep(*) { view-transition-name: none !important; } /* names must be unique on the page */
.bp-copy :deep(*) { outline: 1px solid color-mix(in oklab, var(--accent) 55%, transparent); outline-offset: -1px; }
.bp-copy :deep(img) { opacity: .18; filter: grayscale(1); }
.bp-copy :deep(.btn) { background: transparent; color: var(--accent); }
.bp-label {
  position: absolute; left: 0; top: 0; margin-top: -15px;
  padding: 1px 4px; background: var(--accent); color: var(--ink);
  font: 400 10px/1.3 var(--mono); white-space: nowrap; pointer-events: none;
}
</style>
