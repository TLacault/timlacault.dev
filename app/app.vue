<script setup lang="ts">
const fine = ref(true)
onMounted(() => { fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches })

const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'local', label: 'Local businesses' },
  { id: 'path', label: 'Path' },
  { id: 'contact', label: 'Contact' },
]
</script>

<template>
  <LazyField />
  <Loader />
  <main>
    <SectionsHero />
    <SectionsWork />
    <SectionsPath />
    <SectionsContact />
  </main>
  <ScrollRail :sections="sections" />
  <nav class="dock" aria-label="Site">
    <span class="mono hint">{{ fine ? 'hold space · view source' : 'long-press · view source' }}</span>
    <a href="#work">Work</a>
    <a href="#path">Path</a>
    <a href="#contact">Contact</a>
  </nav>
  <Cursor />
</template>

<style scoped>
main { position: relative; z-index: 1; }
.dock {
  position: fixed; z-index: 40; left: 50%; bottom: 20px; transform: translateX(-50%);
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

<style>
/* Under the loader: the page waits, then fades in as the loader's glyphs fly off to form the name. */
main, .dock, .rail-wrap { transition: opacity .9s var(--ease-out) .15s; }
html.loading :is(main, .dock, .rail-wrap) { opacity: 0; }
</style>
