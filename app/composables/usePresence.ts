import { reactive } from 'vue'
// Live presence, ported from the previous site: Bordeaux time and what that usually means, the
// Spotify track via Lanyard (Discord presence, no backend), and the latest public GitHub event.
// One shared state, started once, client only.
const GITHUB_USER = 'TLacault'
const DISCORD_ID = '260792280368021505'
const GH_TTL = 10 * 60 * 1000 // keyless GitHub API: 60 requests/hour

export interface Presence {
  now: number
  spotify: { song: string, artist: string, art: string } | null
  github: { text: string, url: string, at: string } | null
}
const state = reactive<Presence>({ now: Date.now(), spotify: null, github: null })
let started = false

export const parisTime = (ts: number) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false }).format(ts)

export function parisStatus(ts: number) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false }).format(ts))
  if (h < 6) return 'probably asleep'
  if (h < 9) return 'easing into the day'
  if (h < 12) return 'deep work'
  if (h < 14) return 'lunch break'
  if (h < 18) return 'building things'
  if (h < 22) return 'side projects'
  return 'late-night coding'
}

export function ago(at: string, now: number) {
  const m = Math.floor(Math.max(0, now - new Date(at).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m / 60)}h ago`
  return `${Math.floor(m / 1440)}d ago`
}

type GhEvent = { type: string, repo: { name: string }, created_at: string, payload?: { size?: number, commits?: unknown[] } }
export function describeEvent(events: GhEvent[]): Presence['github'] {
  const ev = events.find((e) => ['PushEvent', 'PullRequestEvent', 'CreateEvent', 'ReleaseEvent'].includes(e.type))
  if (!ev) return null
  const repo = ev.repo.name.split('/').pop()
  const n = ev.payload?.size ?? ev.payload?.commits?.length ?? 1
  const text = {
    PushEvent: `pushed ${n} commit${n > 1 ? 's' : ''} to ${repo}`,
    PullRequestEvent: `opened a PR in ${repo}`,
    CreateEvent: `created ${repo}`,
    ReleaseEvent: `shipped a release of ${repo}`,
  }[ev.type]!
  return { text, url: `https://github.com/${ev.repo.name}`, at: ev.created_at }
}

async function fetchGithub() {
  const key = `presence_gh_${GITHUB_USER}`
  try {
    const c = JSON.parse(localStorage.getItem(key) || 'null')
    if (c && Date.now() - c.ts < GH_TTL) { state.github = c.data; return }
  } catch {}
  try {
    const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`)
    if (!r.ok) return
    state.github = describeEvent(await r.json())
    try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: state.github })) } catch {}
  } catch {}
}

function lanyard() {
  let hb: ReturnType<typeof setInterval> | undefined
  const sock = new WebSocket('wss://api.lanyard.rest/socket')
  sock.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.op === 1) {
      hb = setInterval(() => sock.readyState === 1 && sock.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval)
      sock.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }))
    } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
      const s = msg.d?.listening_to_spotify && msg.d.spotify
      state.spotify = s ? { song: s.song, artist: s.artist, art: s.album_art_url } : null
    }
  }
  sock.onclose = () => { clearInterval(hb); setTimeout(lanyard, 8000) }
  sock.onerror = () => sock.close()
}

export function usePresence() {
  if (import.meta.client && !started) {
    started = true
    setInterval(() => { state.now = Date.now() }, 15000)
    fetchGithub()
    setInterval(fetchGithub, GH_TTL)
    try { lanyard() } catch {}
  }
  return state
}
