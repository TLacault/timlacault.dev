<script setup lang="ts">
const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'local', label: 'Local businesses' },
  { id: 'path', label: 'Path' },
  { id: 'contact', label: 'Contact' },
]
</script>

<template>
  <div>
    <SectionsHero />
    <SectionsWork />
    <SectionsPath />
    <SectionsContact />
    <ScrollRail :sections="sections" />
  </div>
</template>
