<!--
The one piece of chrome. Left: a live ticker that cycles through what's true right now (Bordeaux time
and what that usually means, the Spotify track, the last GitHub push) and the Lens hint, which opens
/source. Middle: the sections. Right: the generative score toggle (off by default).
-->
<script setup lang="ts">
import gsap from 'gsap'

const p = usePresence()
const fine = ref(true)
const ready = ref(false) // time-dependent text: render on the client only (no hydration mismatch)
const { $go } = useNuxtApp()
const go = (e: MouseEvent, to: string) => { e.preventDefault(); ($go as (t: string) => void)(to) }

const items = computed(() => {
  const list = [`Bordeaux ${parisTime(p.now)}, ${parisStatus(p.now)}`]
  if (p.spotify) list.push(`Listening to ${p.spotify.song}, ${p.spotify.artist}`)
  if (p.github) list.push(`Tim ${p.github.text}, ${ago(p.github.at, p.now)}`)
  list.push(fine.value ? 'Hold space to view the source' : 'Long-press to view the source')
  return list
})
const i = ref(0)
const current = computed(() => items.value[i.value % items.value.length]!)

// Sound: built on first click (browsers only allow audio after a gesture).
const sound = ref(false)
let score: ReturnType<typeof createScore> | null = null
const drive = () => score?.update(stage.velocity, stage.held, stage.section)
function toggleSound() {
  sound.value = !sound.value
  if (sound.value) { score ??= createScore(); score.on(); gsap.ticker.add(drive) }
  else { score?.off(); gsap.ticker.remove(drive) }
}

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches
  ready.value = true
  timer = setInterval(() => { i.value++ }, 4500)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <nav class="dock" aria-label="Site" data-enter style="--d: .9s">
    <NuxtLink to="/source" class="ticker mono" aria-live="off" title="How this site is made">
      <Transition name="tick" mode="out-in"><span v-if="ready" :key="current">{{ current }}</span></Transition>
    </NuxtLink>
    <span class="sep" aria-hidden="true" />
    <a href="/#work" @click="go($event, '/#work')">Work</a>
    <a href="/#path" @click="go($event, '/#path')">Path</a>
    <NuxtLink to="/freelance">Freelance</NuxtLink>
    <a href="/#contact" @click="go($event, '/#contact')">Contact</a>
    <button type="button" class="sound" :aria-pressed="sound" :aria-label="sound ? 'Turn the sound off' : 'Turn the sound on'" @click="toggleSound">
      <i v-for="k in 4" :key="k" :style="{ '--k': k }" />
    </button>
  </nav>
</template>

<style scoped>
.dock {
  position: fixed; z-index: 40; left: 50%; bottom: 20px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 20px;
  height: 44px; padding: 0 8px 0 18px; border-radius: 999px;
  background: color-mix(in oklab, var(--ink-2) 88%, transparent); border: 1px solid var(--line);
  font-size: 14px; white-space: nowrap;
}
.dock a { text-decoration: none; }
.dock > a:hover, .dock > a.router-link-active:not(.ticker) { color: var(--accent); }
.ticker { width: 300px; overflow: clip; color: var(--fg-2); font-size: 12px; }
.ticker span { display: block; overflow: hidden; text-overflow: ellipsis; }
.ticker:hover { color: var(--fg); }
.sep { width: 1px; height: 18px; background: var(--line); }
.tick-enter-active, .tick-leave-active { transition: opacity .35s var(--ease-out), translate .45s var(--ease-out); }
.tick-enter-from { opacity: 0; translate: 0 70%; }
.tick-leave-to { opacity: 0; translate: 0 -70%; }

.sound { display: flex; align-items: center; justify-content: center; gap: 2px; width: 30px; height: 30px; border: 0; border-radius: 50%; background: none; cursor: pointer; }
.sound:hover { background: var(--line); }
.sound i { width: 2px; height: 4px; border-radius: 1px; background: var(--fg-2); transition: height .3s var(--ease-out); }
.sound[aria-pressed="true"] i { background: var(--accent); animation: eq 1.1s var(--ease-io) infinite alternate; animation-delay: calc(var(--k) * -.27s); }
@keyframes eq { from { height: 3px; } to { height: 14px; } }
@media (max-width: 767px) { .ticker, .sep { display: none; } .dock { padding-left: 18px; } }
</style>
