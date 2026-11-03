<template>
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
