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
  github: { kind: 'push' | 'pr' | 'create' | 'release', n: number, repo: string, url: string, at: string } | null
}
const state = reactive<Presence>({ now: Date.now(), spotify: null, github: null })
let started = false

export const parisTime = (ts: number) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false }).format(ts)

const STATUS = [
  [6, 'probably asleep', 'sûrement en train de dormir'], [9, 'easing into the day', 'démarre la journée'], [12, 'deep work', 'concentré'],
  [14, 'lunch break', 'pause déjeuner'], [18, 'building things', 'en train de construire'], [22, 'side projects', 'projets perso'], [24, 'late-night coding', 'code tard le soir'],
] as const
export function parisStatus(ts: number, lang: 'en' | 'fr' = 'en') {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', hour12: false }).format(ts))
  const s = STATUS.find(([max]) => h < max)!
  return lang === 'fr' ? s[2] : s[1]
}

export function ago(at: string, now: number, lang: 'en' | 'fr' = 'en') {
  const m = Math.floor(Math.max(0, now - new Date(at).getTime()) / 60000)
  const v = m < 60 ? `${m} min` : m < 1440 ? `${Math.floor(m / 60)} h` : `${Math.floor(m / 1440)} ${lang === 'fr' ? 'j' : 'd'}`
  if (m < 1) return lang === 'fr' ? "à l'instant" : 'just now'
  return lang === 'fr' ? `il y a ${v}` : `${v.replace(' min', 'm').replace(' h', 'h').replace(' d', 'd')} ago`
}

/** One line about a GitHub event, in either language. */
export function eventText(g: NonNullable<Presence['github']>, lang: 'en' | 'fr' = 'en') {
  const s = g.n > 1 ? 's' : ''
  return lang === 'fr'
    ? { push: `a poussé ${g.n} commit${s} sur ${g.repo}`, pr: `a ouvert une PR sur ${g.repo}`, create: `a créé ${g.repo}`, release: `a publié une version de ${g.repo}` }[g.kind]
    : { push: `pushed ${g.n} commit${s} to ${g.repo}`, pr: `opened a PR in ${g.repo}`, create: `created ${g.repo}`, release: `shipped a release of ${g.repo}` }[g.kind]
}

type GhEvent = { type: string, repo: { name: string }, created_at: string, payload?: { size?: number, commits?: unknown[] } }
export function describeEvent(events: GhEvent[]): Presence['github'] {
  const ev = events.find((e) => ['PushEvent', 'PullRequestEvent', 'CreateEvent', 'ReleaseEvent'].includes(e.type))
  if (!ev) return null
  const kind = ({ PushEvent: 'push', PullRequestEvent: 'pr', CreateEvent: 'create', ReleaseEvent: 'release' } as const)[ev.type as 'PushEvent']
  return { kind, n: ev.payload?.size ?? ev.payload?.commits?.length ?? 1, repo: ev.repo.name.split('/').pop()!, url: `https://github.com/${ev.repo.name}`, at: ev.created_at }
}

async function fetchGithub() {
  const key = `presence_gh2_${GITHUB_USER}` // v2: structured event
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
