<!--
Three docks along the bottom edge.
Left: a live ticker cycling through what's true right now (Bordeaux time and what that usually means,
the Spotify track, the last GitHub push) and the Lens hint; it opens /source.
Centre: the sections. Right: settings (the generative score with its volume, the ghost readers).
Phones keep the centre and a compact right dock.
-->
<script setup lang="ts">
import gsap from 'gsap'

const p = usePresence()
const { t, lang } = useLang()
const settings = useSettings()
const fine = ref(true)
const ready = ref(false) // time-dependent text: render on the client only (no hydration mismatch)
const { $go } = useNuxtApp()
const go = (e: MouseEvent, to: string) => { e.preventDefault(); ($go as (t: string) => void)(to) }

const items = computed(() => {
  const l = lang.value
  const list = [`Bordeaux ${parisTime(p.now)}, ${parisStatus(p.now, l)}`]
  if (p.spotify) list.push(`${t('Listening to', 'Écoute')} ${p.spotify.song}, ${p.spotify.artist}`)
  if (p.github) list.push(`Tim ${eventText(p.github, l)}, ${ago(p.github.at, p.now, l)}`)
  list.push(fine.value ? t('Hold space to view the source', 'Maintenez espace pour voir le code') : t('Long-press to view the source', 'Appui long pour voir le code'))
  return list
})
const i = ref(0)
const current = computed(() => items.value[i.value % items.value.length]!)

// Sound: built on first click (browsers only allow audio after a gesture).
let score: ReturnType<typeof createScore> | null = null
const drive = () => score?.update(stage.velocity, stage.held, stage.section)
function toggleSound() {
  settings.sound = !settings.sound
  if (settings.sound) { score ??= createScore(); score.on(settings.volume); gsap.ticker.add(drive) }
  else { score?.off(); gsap.ticker.remove(drive) }
}
watch(() => settings.volume, (v) => score?.setVolume(v))

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches
  ready.value = true
  timer = setInterval(() => { i.value++ }, 4500)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="docks">
    <NuxtLink to="/source" class="dock live mono" :title="t('How this site is made', 'Comment ce site est fait')" data-enter style="--d: .95s">
      <span class="pulse" aria-hidden="true" />
      <Transition name="tick" mode="out-in"><span v-if="ready" :key="current" class="tick">{{ current }}</span></Transition>
    </NuxtLink>

    <nav class="dock nav" :aria-label="t('Site', 'Site')" data-enter style="--d: .85s">
      <a href="/#work" @click="go($event, '/#work')">{{ t('Work', 'Projets') }}</a>
      <a href="/#path" @click="go($event, '/#path')">{{ t('Path', 'Parcours') }}</a>
      <NuxtLink to="/freelance">Freelance</NuxtLink>
      <a href="/#contact" @click="go($event, '/#contact')">Contact</a>
    </nav>

    <div class="dock settings" role="group" :aria-label="t('Settings', 'Réglages')" data-enter style="--d: 1.05s">
      <button type="button" class="sound" :aria-pressed="settings.sound" :aria-label="settings.sound ? t('Turn the sound off', 'Couper le son') : t('Turn the sound on', 'Activer le son')" @click="toggleSound">
        <i v-for="k in 4" :key="k" :style="{ '--k': k }" />
      </button>
      <label class="volume" :class="{ open: settings.sound }">
        <span class="sr-only">{{ t('Volume', 'Volume') }}</span>
        <input v-model.number="settings.volume" type="range" min="0" max="1" step="0.01" :tabindex="settings.sound ? 0 : -1" :style="{ '--v': settings.volume }">
      </label>
      <span class="sep" aria-hidden="true" />
      <button type="button" class="toggle mono" :aria-pressed="settings.ghosts" :title="t('Other readers', 'Autres lecteurs')" @click="settings.ghosts = !settings.ghosts">
        <span class="dot" />{{ t('Ghosts', 'Fantômes') }}
      </button>
      <span class="sep" aria-hidden="true" />
      <div class="lang mono" role="radiogroup" :aria-label="t('Language', 'Langue')">
        <button v-for="l in (['en', 'fr'] as const)" :key="l" type="button" role="radio" :aria-checked="lang === l" @click="lang = l">{{ l.toUpperCase() }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docks {
  position: fixed; z-index: 40; left: 20px; right: 20px; bottom: 20px; pointer-events: none;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 12px;
}
.dock {
  pointer-events: auto; display: flex; align-items: center; gap: 18px; height: 44px; padding: 0 18px; border-radius: 999px;
  background: color-mix(in oklab, var(--ink-2) 88%, transparent); border: 1px solid var(--line);
  font-size: 14px; white-space: nowrap; text-decoration: none;
}
.nav a { text-decoration: none; }
.nav a:hover, .nav a.router-link-active { color: var(--accent); }

.live { justify-self: start; max-width: min(380px, 100%); gap: 12px; color: var(--fg-2); font-size: 12px; overflow: clip; }
.live:hover { color: var(--fg); }
.tick { display: block; overflow: hidden; text-overflow: ellipsis; }
.pulse { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2.4s var(--ease-io) infinite; }
@keyframes pulse { 50% { opacity: .35; scale: .7; } }
.tick-enter-active, .tick-leave-active { transition: opacity .35s var(--ease-out), translate .45s var(--ease-out); }
.tick-enter-from { opacity: 0; translate: 0 70%; }
.tick-leave-to { opacity: 0; translate: 0 -70%; }

.settings { justify-self: end; gap: 10px; padding: 0 8px; }
.sep { width: 1px; height: 18px; background: var(--line); }
.sound { display: flex; align-items: center; justify-content: center; gap: 2px; width: 30px; height: 30px; border: 0; border-radius: 50%; background: none; cursor: pointer; }
.sound:hover { background: var(--line); }
.sound i { width: 2px; height: 14px; border-radius: 1px; background: var(--fg-2); scale: 1 .28; transition: scale .3s var(--ease-out); }
.sound[aria-pressed="true"] i { background: var(--accent); animation: eq 1.1s var(--ease-io) infinite alternate; animation-delay: calc(var(--k) * -.27s); }
@keyframes eq { from { scale: 1 .22; } to { scale: 1 1; } }

/* The volume slider slides open next to the speaker when sound is on. */
.volume { display: grid; grid-template-columns: minmax(0, 0fr); overflow: hidden; opacity: 0; transition: grid-template-columns .45s var(--ease-io), opacity .3s; }
.volume.open { grid-template-columns: minmax(0, 1fr); opacity: 1; }
.volume input { min-width: 0; width: 88px; overflow: hidden; }
input[type=range] { appearance: none; height: 18px; background: none; cursor: pointer; }
input[type=range]::-webkit-slider-runnable-track { height: 2px; border-radius: 1px; background: linear-gradient(90deg, var(--accent) calc(var(--v) * 100%), var(--line) 0); }
input[type=range]::-moz-range-track { height: 2px; border-radius: 1px; background: linear-gradient(90deg, var(--accent) calc(var(--v) * 100%), var(--line) 0); }
input[type=range]::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; margin-top: -5px; border-radius: 50%; background: var(--fg); }
input[type=range]::-moz-range-thumb { width: 12px; height: 12px; border: 0; border-radius: 50%; background: var(--fg); }

.toggle { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; border: 0; border-radius: 999px; background: none; color: var(--fg-2); font-size: 12px; cursor: pointer; }
.toggle:hover { background: var(--line); color: var(--fg); }
.toggle .dot { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--fg-2); transition: background .25s, border-color .25s; }
.toggle[aria-pressed="true"] { color: var(--fg); }
.toggle[aria-pressed="true"] .dot { background: var(--accent); border-color: var(--accent); }
.lang { display: flex; gap: 2px; }
.lang button { height: 28px; padding: 0 8px; border: 0; border-radius: 999px; background: none; color: var(--fg-2); font: inherit; font-size: 12px; cursor: pointer; transition: background .25s, color .25s; }
.lang button:hover { color: var(--fg); }
.lang button[aria-checked="true"] { background: var(--accent); color: var(--ink); }

@media (max-width: 1100px) { .live { display: none; } .docks { grid-template-columns: 1fr auto; } .nav { justify-self: start; } }
@media (max-width: 767px) {
  .docks { left: 12px; right: 12px; bottom: 12px; grid-template-columns: 1fr; justify-items: center; gap: 8px; }
  .settings { grid-row: 1; justify-self: end; height: 38px; } /* settings sit above the nav: side by side they don't fit */
  .nav { gap: 14px; padding: 0 14px; font-size: 13px; }
  .toggle, .sep, .volume { display: none; }
  .settings .lang { display: flex; }
}
</style>
