<!--
The background: a slow blue mesh gradient behind everything (Paper Shaders), the one from the library's
Night Shift demo and The Grid's wallpaper, tinted from the site's blue and kept very dark so the glyphs
and text stay the brightest things on screen. Still under reduced motion, paused while the tab is
hidden, rendered at ~1.4 MP at most (it's a soft gradient).
-->
<script setup lang="ts">
import { ShaderFitOptions, ShaderMount, getShaderColorFromString, meshGradientFragmentShader } from '@paper-design/shaders'

const el = ref<HTMLElement>()
let mount: ShaderMount | undefined
// Near-black blues, two of them lit by the accent (#4d7cff).
const COLORS = ['#05070d', '#0b1530', '#070a14', '#16285c', '#0a1022']
const speed = () => (matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden ? 0 : 0.34)
const onVisibility = () => mount?.setSpeed(speed())

onMounted(async () => {
  await nextTick() // .client.vue: the ref exists after a tick
  mount = new ShaderMount(el.value!, meshGradientFragmentShader, {
    u_colors: COLORS.map((c) => getShaderColorFromString(c)), u_colorsCount: COLORS.length,
    u_distortion: 0.8, u_swirl: 0.3, u_grainMixer: 0.1, u_grainOverlay: 0.1,
    u_fit: ShaderFitOptions.cover, u_scale: 1, u_rotation: 0, u_originX: 0.5, u_originY: 0.5,
    u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0,
  }, undefined, speed(), 0, 1, 1600 * 900)
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => { document.removeEventListener('visibilitychange', onVisibility); mount?.dispose() })
</script>

<template>
  <div ref="el" class="backdrop" aria-hidden="true" />
</template>

<style scoped>
.backdrop { position: fixed; inset: 0; z-index: -1; pointer-events: none; animation: light 2.4s var(--ease-out) both; }
@keyframes light { from { opacity: 0; } }
</style>
