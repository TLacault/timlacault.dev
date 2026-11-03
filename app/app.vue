<script setup lang="ts">
const fine = ref(true)
onMounted(() => { fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches })
</script>

<template>
  <LazyField />
  <main>
    <SectionsHero />
    <SectionsWork />
    <SectionsPath />
    <SectionsContact />
  </main>
  <nav class="dock" aria-label="Site">
    <span class="mono hint">{{ fine ? 'hold space · view source' : 'long-press · view source' }}</span>
    <a href="#work">Work</a>
    <a href="#path">Path</a>
    <a href="#contact">Contact</a>
  </nav>
</template>

<style scoped>
main { position: relative; z-index: 1; }
.dock {
  position: fixed; z-index: 40; left: 50%; bottom: 20px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 20px;
  height: 48px; padding: 0 22px; border-radius: 999px;
  background: color-mix(in oklab, var(--ink-2) 88%, transparent); border: 1px solid var(--line);
  font-size: 15px; white-space: nowrap;
}
.dock a { text-decoration: none; }
.dock a:hover { color: var(--claret); }
.hint { color: var(--fg-2); font-size: 12px; }
@media (max-width: 767px) { .hint { display: none; } }
</style>
