<!--
YouTube demo as a facade: the video's own thumbnail with a play button and a "Play" cursor. The player
(youtube-nocookie) only loads on click and starts playing, so nothing from YouTube loads before the
visitor asks for it, and the custom cursor keeps working over the thumbnail (an iframe swallows it).
In the Blueprint copy it renders the same cover, inert: same layout, never a second player.
-->
<script setup lang="ts">
const props = defineProps<{ id: string, title: string }>()
const xray = inject('xray', false)
const { t } = useLang()
const playing = ref(false)
const thumb = computed(() => `https://i.ytimg.com/vi/${props.id}/maxresdefault.jpg`)
</script>

<template>
  <div class="embed">
    <div v-if="xray" class="facade"><img :src="thumb" alt="" loading="lazy" decoding="async"><span class="play"><i /></span></div>
    <iframe
      v-else-if="playing" :src="`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`" :title="title"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    />
    <button v-else type="button" class="facade" :data-cursor="t('Play', 'Lire')" :aria-label="`${t('Play', 'Lire')}: ${title}`" @click="playing = true">
      <img :src="thumb" alt="" loading="lazy" decoding="async" @error="($event.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`">
      <span class="play" aria-hidden="true"><i /></span>
    </button>
  </div>
</template>

<style scoped>
.embed { aspect-ratio: 16 / 9; position: relative; }
iframe, .facade { display: block; width: 100%; height: 100%; border: 0; }
.facade { position: relative; padding: 0; background: var(--ink); cursor: pointer; overflow: clip; }
.facade img { width: 100%; height: 100%; object-fit: cover; opacity: .82; transition: opacity .4s var(--ease-out), scale .8s var(--ease-out); }
.facade:hover img { opacity: 1; scale: 1.02; }
.play {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center;
  background: color-mix(in oklab, var(--ink) 45%, transparent); border: 1px solid color-mix(in oklab, var(--fg) 30%, transparent);
  -webkit-backdrop-filter: blur(12px) saturate(150%); backdrop-filter: blur(12px) saturate(150%);
  transition: scale .4s var(--ease-out), background .3s;
}
.facade:hover .play { scale: 1.08; background: var(--accent); }
.play i { width: 0; height: 0; margin-left: 5px; border-left: 20px solid var(--fg); border-top: 12px solid transparent; border-bottom: 12px solid transparent; }
.facade:hover .play i { border-left-color: var(--ink); }
</style>
