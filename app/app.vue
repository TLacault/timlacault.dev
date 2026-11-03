<script setup lang="ts">
const fine = ref(true)
onMounted(() => { fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches })
const { $go } = useNuxtApp()
const go = (e: MouseEvent, to: string) => { e.preventDefault(); ($go as (t: string) => void)(to) }
</script>

<template>
  <LazyField />
  <Loader />
  <main>
    <NuxtPage />
  </main>
  <nav class="dock" aria-label="Site" data-enter style="--d: .9s">
    <span class="mono hint">{{ fine ? 'hold space · view source' : 'long-press · view source' }}</span>
    <a href="/#work" @click="go($event, '/#work')">Work</a>
    <a href="/#path" @click="go($event, '/#path')">Path</a>
    <a href="/#contact" @click="go($event, '/#contact')">Contact</a>
  </nav>
  <Cursor />
</template>

<style scoped>
main { position: relative; z-index: 1; }
.dock {
  position: fixed; z-index: 40; left: 50%; bottom: 20px; margin-left: -1px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 20px;
  height: 44px; padding: 0 20px; border-radius: 999px;
  background: color-mix(in oklab, var(--ink-2) 88%, transparent); border: 1px solid var(--line);
  font-size: 14px; white-space: nowrap;
}
.dock a { text-decoration: none; }
.dock a:hover { color: var(--accent); }
.hint { color: var(--fg-2); font-size: 12px; }
@media (max-width: 767px) { .hint { display: none; } }
</style>
