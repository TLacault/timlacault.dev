// Visitor settings (settings dock): sound, volume, ghost readers. Remembered per browser, never required.
const KEY = 'tl-settings'
const state = reactive({ sound: false, volume: 0.35, ghosts: true })
let loaded = false

export function useSettings() {
  if (import.meta.client && !loaded) {
    loaded = true
    try { Object.assign(state, { ...JSON.parse(localStorage.getItem(KEY) || '{}'), sound: false }) } catch {} // sound always starts off
    watch(state, (s) => { try { localStorage.setItem(KEY, JSON.stringify({ volume: s.volume, ghosts: s.ghosts })) } catch {} })
  }
  return state
}
