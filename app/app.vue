<script setup lang="ts">
const { t, lang } = useLang()
useHead(() => ({
  htmlAttrs: { lang: lang.value }, // unhead owns <html lang>: set it here, not on the DOM
  title: t('Tim Lacault · Software engineer', 'Tim Lacault · Ingénieur logiciel'),
  meta: [{ name: 'description', content: t('Tim Lacault, software engineer in Bordeaux. I build websites that feel alive.', 'Tim Lacault, ingénieur logiciel à Bordeaux. Je construis des sites qui ont du vivant.') }],
}))
</script>

<template>
  <Backdrop />
  <LazyField />
  <Loader />
  <main>
    <NuxtPage />
  </main>
  <Dock />
  <Ghosts />
  <Cursor />
</template>

<style scoped>
main { position: relative; z-index: 1; }
</style>
