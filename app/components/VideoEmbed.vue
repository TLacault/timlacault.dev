<!-- YouTube (no-cookie) embed. In the Blueprint copy it renders an empty box of the same size: no second player. -->
<script setup lang="ts">
defineProps<{ id: string, title: string }>()
const xray = inject('xray', false)
</script>

<template>
  <div class="embed">
    <div v-if="xray" class="ph" />
    <iframe
      v-else :src="`https://www.youtube-nocookie.com/embed/${id}?rel=0`" :title="title" loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    />
  </div>
</template>

<style scoped>
.embed { aspect-ratio: 16 / 9; }
iframe, .ph { display: block; width: 100%; height: 100%; border: 0; }
</style>
