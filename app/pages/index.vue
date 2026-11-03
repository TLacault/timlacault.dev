<script setup lang="ts">
const { t } = useLang()
const sections = computed(() => [
  { id: 'top', label: t('Intro', 'Intro') },
  { id: 'work', label: t('Work', 'Projets') },
  { id: 'local', label: t('Local businesses', 'Commerces') },
  { id: 'path', label: t('Path', 'Parcours') },
  { id: 'contact', label: t('Contact', 'Contact') },
])
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
