<!--
Three docks along the bottom edge.
Left: a live ticker cycling through what's true right now (Bordeaux time and what that usually means,
the Spotify track, the last GitHub push) and the Lens hint; it opens /source.
Centre: the sections. Right: settings (the generative score with its volume, the ghost readers).
Phones: one Menu pill; it opens a glass sheet holding the same three docks, stacked.
-->
<script setup lang="ts">
import gsap from 'gsap'

const p = usePresence()
const { t, lang, setLang } = useLang()
const settings = useSettings()
const fine = ref(true)
const ready = ref(false) // time-dependent text: render on the client only (no hydration mismatch)
const { $go } = useNuxtApp()
const go = (e: MouseEvent, to: string) => { e.preventDefault(); menu.value = false; ($go as (t: string) => void)(to) }

// Phone menu: the docks live in a sheet behind the Menu pill. Closes on a link, Esc, a tap outside or a route change.
const menu = ref(false)
const phone = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menu.value = false })
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') menu.value = false }

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
  const mq = matchMedia('(max-width: 767px)')
  phone.value = mq.matches
  mq.onchange = (e) => { phone.value = e.matches; menu.value = false }
  addEventListener('keydown', onKey)
  ready.value = true
  timer = setInterval(() => { i.value++ }, 4500)
})
onBeforeUnmount(() => { clearInterval(timer); removeEventListener('keydown', onKey) })
</script>

<template>
  <div class="docks" :class="{ open: menu }">
    <div class="scrim" aria-hidden="true" @click="menu = false" />
    <div id="dock-panel" class="panel" :inert="phone && !menu">
    <NuxtLink to="/source" class="dock live mono" :title="t('How this site is made', 'Comment ce site est fait')" data-enter style="--d: .95s">
      <span class="pulse" aria-hidden="true" />
      <Transition name="tick" mode="out-in"><span v-if="ready" :key="current" class="tick">{{ current }}</span></Transition>
    </NuxtLink>

    <nav class="dock nav" :aria-label="t('Site', 'Site')" data-enter style="--d: .85s">
      <a href="/#work" @click="go($event, '/#work')"><Transition name="swap" mode="out-in"><span :key="lang">{{ t('Work', 'Projets') }}</span></Transition></a>
      <a href="/#path" @click="go($event, '/#path')"><Transition name="swap" mode="out-in"><span :key="lang">{{ t('Path', 'Parcours') }}</span></Transition></a>
      <NuxtLink to="/freelance" @click="menu = false">Freelance</NuxtLink>
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
        <span class="dot" /><Transition name="swap" mode="out-in"><span :key="lang">{{ t('Ghosts', 'Fantômes') }}</span></Transition>
      </button>
      <span class="sep" aria-hidden="true" />
      <div class="lang mono" role="radiogroup" :aria-label="t('Language', 'Langue')">
        <button v-for="l in (['en', 'fr'] as const)" :key="l" type="button" role="radio" :aria-checked="lang === l" @click="setLang(l)">{{ l.toUpperCase() }}</button>
      </div>
    </div>
    </div>

    <button type="button" class="burger mono" :aria-expanded="menu" aria-controls="dock-panel" data-enter style="--d: .85s" @click="menu = !menu">
      <span class="bars" aria-hidden="true"><i /><i /></span>
      <Transition name="swap" mode="out-in"><span :key="`${menu}${lang}`">{{ menu ? t('Close', 'Fermer') : 'Menu' }}</span></Transition>
    </button>
  </div>
</template>

<style scoped>
.docks {
  position: fixed; z-index: 40; left: 20px; right: 20px; bottom: 20px; pointer-events: none;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 12px;
}
/* Liquid glass (a web approximation, not Apple's material): tinted translucent fill, strong blur and
   saturation of whatever passes behind, a light top edge and a faint inner rim. Solid under
   prefers-reduced-transparency. Glass rule: fade these elements themselves, never an ancestor. */
.dock {
  pointer-events: auto; position: relative; display: flex; align-items: center; gap: 18px; height: 48px; padding: 0 20px; border-radius: 999px;
  font-size: 14px; white-space: nowrap; text-decoration: none; isolation: isolate;
  background:
    linear-gradient(135deg, rgb(255 255 255 / .1), rgb(255 255 255 / .02) 45%, rgb(255 255 255 / .06)),
    color-mix(in oklab, var(--ink-2) 42%, transparent);
  border: 1px solid rgb(255 255 255 / .12);
  -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .16), inset 0 -1px 0 rgb(255 255 255 / .04),
    0 18px 50px -22px rgb(0 0 0 / .7), 0 0 0 .5px rgb(0 0 0 / .4);
}
.dock::before { /* the specular sweep across the top of the glass */
  content: ''; position: absolute; inset: 1px; border-radius: inherit; pointer-events: none; z-index: -1;
  background: radial-gradient(120% 90% at 20% -30%, rgb(255 255 255 / .14), transparent 55%);
}
@media (prefers-reduced-transparency: reduce) {
  .dock { background: var(--ink-2); -webkit-backdrop-filter: none; backdrop-filter: none; }
}
.nav { gap: 30px; padding: 0 30px; height: 52px; font-size: 15px; }
.nav span { display: inline-block; }
.swap-enter-active, .swap-leave-active { transition: opacity .25s var(--ease-out), translate .3s var(--ease-out), filter .3s; }
.swap-enter-from { opacity: 0; translate: 0 6px; filter: blur(4px); }
.swap-leave-to { opacity: 0; translate: 0 -6px; filter: blur(4px); }
.nav a { text-decoration: none; }
.nav a:hover, .nav a.router-link-active { color: var(--accent); }

.live { justify-self: start; max-width: min(380px, 100%); gap: 12px; color: var(--fg); font-size: 12px; overflow: clip; }
.live:hover { color: var(--accent); }
.tick { display: block; overflow: hidden; text-overflow: ellipsis; }
.pulse { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2.4s var(--ease-io) infinite; }
@keyframes pulse { 50% { opacity: .35; scale: .7; } }
.tick-enter-active, .tick-leave-active { transition: opacity .35s var(--ease-out), translate .45s var(--ease-out); }
.tick-enter-from { opacity: 0; translate: 0 70%; }
.tick-leave-to { opacity: 0; translate: 0 -70%; }

.settings { justify-self: end; gap: 10px; padding: 0 8px; }
.sep { width: 1px; height: 18px; background: rgb(255 255 255 / .16); }
.sound { display: flex; align-items: center; justify-content: center; gap: 2px; width: 30px; height: 30px; border: 0; border-radius: 50%; background: none; cursor: pointer; }
.sound:hover { background: var(--line); }
.sound i { width: 2px; height: 14px; border-radius: 1px; background: var(--fg); scale: 1 .28; transition: scale .3s var(--ease-out); }
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

.toggle { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; border: 0; border-radius: 999px; background: none; color: var(--fg); font-size: 12px; cursor: pointer; }
.toggle:hover { background: rgb(255 255 255 / .1); }
.toggle .dot { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--fg); transition: background .25s, border-color .25s; }
.toggle[aria-pressed="true"] { color: var(--fg); }
.toggle[aria-pressed="true"] .dot { background: var(--accent); border-color: var(--accent); }
.lang { display: flex; gap: 2px; }
.lang button { height: 28px; padding: 0 8px; border: 0; border-radius: 999px; background: none; color: var(--fg); font: inherit; font-size: 12px; cursor: pointer; transition: background .25s, color .25s; }
.lang button:hover { background: rgb(255 255 255 / .1); }
.lang button[aria-checked="true"] { background: var(--accent); color: var(--ink); }

/* Desktop: the panel wrapper is transparent to the grid; the Menu pill and scrim don't exist. */
.panel { display: contents; }
.burger, .scrim { display: none; }

@media (max-width: 1100px) { .live { display: none; } .docks { grid-template-columns: 1fr auto; } .nav { justify-self: start; } }

/* Phones: a Menu pill bottom-centre. It opens a glass sheet that grows out of it, holding the
   sections as big links, the settings, then the live ticker. Only the sheet is glass. */
@media (max-width: 767px) {
  .docks { left: 12px; right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .burger {
    pointer-events: auto; display: flex; align-items: center; gap: 12px; height: 48px; padding: 0 22px 0 18px; border-radius: 999px;
    border: 1px solid rgb(255 255 255 / .14); color: var(--fg); font-size: 13px; letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
    background: color-mix(in oklab, var(--ink-2) 55%, transparent);
    -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / .16), 0 18px 50px -22px rgb(0 0 0 / .7);
    -webkit-tap-highlight-color: transparent;
    transition: scale .16s var(--ease-out), opacity .9s var(--ease-out) var(--d), translate 1.1s var(--ease-out) var(--d);
  }
  .burger:active { scale: .96; }
  .burger > span:last-child { display: inline-block; min-width: 6ch; }
  .bars { position: relative; width: 16px; height: 10px; }
  .bars i { position: absolute; left: 0; right: 0; height: 1.5px; border-radius: 1px; background: currentColor; transition: translate .4s var(--ease-io), rotate .4s var(--ease-io); }
  .bars i:first-child { top: 0; }
  .bars i:last-child { bottom: 0; }
  .open .bars i:first-child { translate: 0 4.25px; rotate: 45deg; }
  .open .bars i:last-child { translate: 0 -4.25px; rotate: -45deg; }

  .scrim { display: block; position: fixed; inset: 0; z-index: -1; background: rgb(3 5 12 / .55); opacity: 0; transition: opacity .4s var(--ease-out); }
  .open .scrim { pointer-events: auto; opacity: 1; }

  .panel {
    display: flex; flex-direction: column; width: 100%; max-height: calc(100dvh - 100px); overflow: auto; padding: 10px; border-radius: 28px;
    background: linear-gradient(160deg, rgb(255 255 255 / .1), rgb(255 255 255 / .02) 50%), color-mix(in oklab, var(--ink-2) 62%, transparent);
    border: 1px solid rgb(255 255 255 / .12);
    -webkit-backdrop-filter: blur(28px) saturate(180%); backdrop-filter: blur(28px) saturate(180%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / .16), 0 30px 80px -30px rgb(0 0 0 / .8);
    transform-origin: 50% 100%; opacity: 0; scale: .6 .2; translate: 0 40px; filter: blur(8px);
    transition: opacity .25s var(--ease-out), scale .35s var(--ease-io), translate .35s var(--ease-io), filter .3s;
  }
  .open .panel { pointer-events: auto; opacity: 1; scale: 1; translate: 0; filter: none; transition: opacity .3s var(--ease-out), scale .55s var(--ease-out), translate .55s var(--ease-out), filter .4s; }
  @media (prefers-reduced-transparency: reduce) { .panel { background: var(--ink-2); -webkit-backdrop-filter: none; backdrop-filter: none; } }

  /* Inside the sheet the docks are plain rows (only the sheet is glass), and they stagger in. */
  .panel > .dock {
    background: none; border: 0; box-shadow: none; -webkit-backdrop-filter: none; backdrop-filter: none; height: auto; border-radius: 18px;
    opacity: 0; translate: 0 14px; transition: opacity .2s, translate .2s;
  }
  .panel > .dock::before { display: none; }
  .open .panel > .dock { opacity: 1; translate: 0; transition: opacity .45s var(--ease-out) var(--i), translate .55s var(--ease-out) var(--i); }
  .nav { order: 1; --i: .08s; flex-direction: column; align-items: stretch; gap: 0; padding: 4px 6px 10px; }
  .nav a { display: block; padding: 12px 10px; font-size: 32px; font-weight: 700; font-stretch: 112.5%; letter-spacing: -.01em; text-transform: uppercase; line-height: 1; }
  .nav a + a { border-top: 1px solid rgb(255 255 255 / .08); }
  .settings { order: 2; --i: .16s; gap: 6px; justify-content: space-between; padding: 10px 8px; background: rgb(255 255 255 / .05) !important; }
  .volume input { width: 70px; }
  .live { order: 3; --i: .22s; display: flex; max-width: none; padding: 14px 12px 6px; white-space: normal; }
  .tick { white-space: nowrap; }
}
@media (max-width: 767px) and (prefers-reduced-motion: reduce) {
  .panel, .open .panel { scale: 1; translate: 0; filter: none; }
  .panel > .dock, .open .panel > .dock { translate: 0; }
}
</style>
