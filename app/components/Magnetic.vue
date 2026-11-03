<!--
kind: button
energy: lively
cost: js-light (motion-v)
interaction: hover
mood: any
Pulls toward the pointer with a spring, the label moves further than the shell for depth.
-->
<script setup lang="ts">
import { motion, useSpring } from 'motion-v'

const props = withDefaults(defineProps<{ href?: string; strength?: number; type?: 'submit' | 'button' }>(), { href: '#', strength: 0.35 })
// Internal routes go through the router (keeps the Field and the page transition), hashes and URLs stay native.
function click(e: MouseEvent) {
  if (props.href.startsWith('/') && !props.href.startsWith('//')) { e.preventDefault(); navigateTo(props.href) }
}
const spring = { stiffness: 220, damping: 16, mass: 0.6 }
const x = useSpring(0, spring)
const y = useSpring(0, spring)
const lx = useSpring(0, spring)
const ly = useSpring(0, spring)

function move(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  x.set(dx * props.strength)
  y.set(dy * props.strength)
  lx.set(dx * props.strength * 0.5)
  ly.set(dy * props.strength * 0.5)
}
function reset() {
  for (const v of [x, y, lx, ly]) v.set(0)
}
</script>

<template>
  <motion.button v-if="type" :type="type" :style="{ x, y }" :while-press="{ scale: 0.94 }" class="magnetic" @pointermove="move" @pointerleave="reset">
    <motion.span :style="{ x: lx, y: ly }" class="magnetic-label">
      <slot />
    </motion.span>
  </motion.button>
  <motion.a v-else :href="href" :style="{ x, y }" :while-press="{ scale: 0.94 }" class="magnetic" @click="click" @pointermove="move" @pointerleave="reset">
    <motion.span :style="{ x: lx, y: ly }" class="magnetic-label">
      <slot />
    </motion.span>
  </motion.a>
</template>

<style scoped>
.magnetic { display: inline-grid; place-items: center; }
.magnetic-label { display: block; }
</style>
