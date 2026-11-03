<!--
A section that can be seen through. The slot renders twice: the surface, and an inert copy in blueprint
styling (outlines, element labels with live sizes, the component's real source behind). The copy is
clipped to the Lens circle and the surface is masked out of it, using --cx/--cy/--lr set per frame by
plugins/stage.client.ts. Same DOM, same layout, so the two always line up.
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{ source?: string, tag?: string }>(), { tag: 'section' })
const root = ref<HTMLElement>()
const copy = ref<HTMLElement>()

// Label every visible block in the copy with "tag.class  w×h", re-measured on resize.
function label() {
  for (const el of copy.value?.querySelectorAll<HTMLElement>('*') ?? []) {
    const cs = getComputedStyle(el)
    const b = el.getBoundingClientRect()
    if (cs.display === 'inline' || b.width < 48 || b.height < 18) { el.removeAttribute('data-bp'); continue }
    const cls = [...el.classList].find((c) => !c.startsWith('data-v'))
    el.dataset.bp = `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}  ${Math.round(b.width)}×${Math.round(b.height)}`
  }
}

let ro: ResizeObserver | undefined
onMounted(() => {
  stage.blueprints.add(root.value!)
  ro = new ResizeObserver(label)
  ro.observe(root.value!)
  document.fonts.ready.then(label)
})
onBeforeUnmount(() => { stage.blueprints.delete(root.value!); ro?.disconnect() })
</script>

<template>
  <component :is="props.tag" ref="root" class="bp">
    <div class="bp-surface"><slot /></div>
    <div class="bp-xray" aria-hidden="true" inert>
      <pre v-if="source" class="bp-src">{{ source }}</pre>
      <div ref="copy" class="bp-copy"><slot /></div>
    </div>
  </component>
</template>

<style scoped>
.bp { position: relative; z-index: 1; }
.bp-surface {
  -webkit-mask-image: radial-gradient(circle var(--lr, 0px) at var(--cx, -999px) var(--cy, -999px), transparent 99%, #000 100%);
  mask-image: radial-gradient(circle var(--lr, 0px) at var(--cx, -999px) var(--cy, -999px), transparent 99%, #000 100%);
}
.bp-xray {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  clip-path: circle(var(--lr, 0px) at var(--cx, -999px) var(--cy, -999px));
  background-image:
    linear-gradient(color-mix(in oklab, var(--claret) 9%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--claret) 9%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: var(--margin) 0;
}
.bp-src {
  position: absolute; inset: 0; margin: 0; padding: 24px var(--margin);
  font: 11px/1.45 var(--mono); color: color-mix(in oklab, var(--fg) 16%, transparent);
  white-space: pre-wrap; word-break: break-all; overflow: hidden;
}
.bp-copy { position: relative; color: color-mix(in oklab, var(--fg) 82%, transparent); }
.bp-copy :deep(*) { outline: 1px solid color-mix(in oklab, var(--claret) 42%, transparent); outline-offset: -1px; }
.bp-copy :deep([data-bp]) { position: relative; }
.bp-copy :deep([data-bp])::before {
  content: attr(data-bp);
  position: absolute; left: 0; top: 0; transform: translateY(-100%);
  padding: 1px 4px; background: var(--claret); color: var(--ink);
  font: 400 10px/1.3 var(--mono); letter-spacing: 0; font-stretch: 100%; white-space: nowrap;
}
.bp-copy :deep(img) { opacity: .18; filter: grayscale(1); }
.bp-copy :deep(.btn) { background: transparent; color: var(--claret); }
</style>
