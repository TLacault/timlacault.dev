/* eslint-disable prettier/prettier */
import { reactive } from "vue";

// ----------------------------------------------------------------------------
// Live presence — Bordeaux local time + status, latest GitHub activity, and
// real Spotify now-playing via Lanyard (no backend / no secrets). Shared so the
// floating widget and the mobile burger menu render the same single source of
// truth (one set of timers / one WebSocket). Mirrors radio.js / theme.js.
//
// SETUP for Spotify:
//   1. Join the Lanyard Discord:  https://discord.gg/lanyard
//   2. Discord → Settings → Connections → connect Spotify
//   3. Discord → Settings → Activity Privacy → "Display current activity"
//   4. Paste your numeric Discord user ID below.
// Until DISCORD_ID is set, the Spotify row gracefully shows "not listening".
// ----------------------------------------------------------------------------
const GITHUB_USER = "TLacault";
const DISCORD_ID = "260792280368021505";

const GH_CACHE_KEY = "presence_gh_" + GITHUB_USER;
const GH_TTL = 10 * 60 * 1000; // 10 min — respects the 60 req/hr keyless limit

export const presenceState = reactive({
  nowTs: Date.now(),
  discordStatus: "",
  spotify: null,
  github: null,
});

/* ---- pure formatting helpers (views pass their own $t translator) ---- */
export function fmtTime(ts) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(ts);
}
function parisHour(ts) {
  return parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      hour12: false,
    }).format(ts),
    10,
  );
}
export function statusKey(ts) {
  const h = parisHour(ts);
  if (h < 6) return "asleep";
  if (h < 9) return "morning";
  if (h < 12) return "focus";
  if (h < 14) return "lunch";
  if (h < 18) return "building";
  if (h < 22) return "evening";
  return "latenight";
}
export function statusLabel(t, ts) {
  return t("presence.status." + statusKey(ts));
}
export function dotClass(discordStatus, ts) {
  const s = discordStatus;
  if (s === "online" || s === "idle" || s === "dnd" || s === "offline")
    return s;
  // No live Discord data → infer from local time.
  return statusKey(ts) === "asleep" ? "offline" : "online";
}
export function githubText(t, g) {
  if (!g) return t("presence.gh.none");
  let key = g.key;
  if (key === "pushed") key = g.n > 1 ? "pushedMany" : "pushedOne";
  return t("presence.gh." + key)
    .replace("{repo}", g.repo)
    .replace("{n}", g.n);
}
export function relativeTime(t, at, nowTs) {
  if (!at) return "";
  const diff = Math.max(0, nowTs - new Date(at).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return t("presence.justNow");
  let s;
  if (m < 60) s = m + "m";
  else if (m < 1440) s = Math.floor(m / 60) + "h";
  else s = Math.floor(m / 1440) + "d";
  return t("presence.ago").replace("{t}", s);
}
export function spotifyProgress(spotify, nowTs) {
  const s = spotify;
  if (!s || !s.start || !s.end) return 0;
  const p = ((nowTs - s.start) / (s.end - s.start)) * 100;
  return Math.min(100, Math.max(0, p));
}

/* ---- background data (started once, lives for the app session) ---- */
let started = false;
let hb;

export function startPresence() {
  if (started) return;
  started = true;
  setInterval(() => {
    presenceState.nowTs = Date.now();
  }, 1000);
  fetchGithub();
  setInterval(fetchGithub, GH_TTL);
  connectLanyard();
}

async function fetchGithub() {
  try {
    const cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.ts < GH_TTL) {
      presenceState.github = cached.data;
      return;
    }
  } catch (e) {
    // ignore corrupt cache
  }
  try {
    const r = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`,
    );
    if (!r.ok) return;
    const events = await r.json();
    const ev = pickEvent(events);
    presenceState.github = ev;
    localStorage.setItem(
      GH_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data: ev }),
    );
  } catch (e) {
    // network/offline — keep whatever we have
  }
}

function pickEvent(events) {
  if (!Array.isArray(events)) return null;
  const wanted = [
    "PushEvent",
    "PullRequestEvent",
    "CreateEvent",
    "ReleaseEvent",
    "WatchEvent",
  ];
  const ev = events.find((e) => wanted.includes(e.type));
  if (!ev || !ev.repo) return null;
  const repo = ev.repo.name.split("/").pop();
  const url = `https://github.com/${ev.repo.name}`;
  const at = ev.created_at;
  if (ev.type === "PushEvent") {
    return {
      key: "pushed",
      n: ev.payload?.commits?.length || ev.payload?.size || 1,
      repo,
      url,
      at,
    };
  }
  const map = {
    PullRequestEvent: "pr",
    CreateEvent: "created",
    ReleaseEvent: "released",
    WatchEvent: "starred",
  };
  return { key: map[ev.type], n: 0, repo, url, at };
}

function connectLanyard() {
  if (!DISCORD_ID || DISCORD_ID === "REPLACE_WITH_DISCORD_ID") return;
  let sock;
  try {
    sock = new WebSocket("wss://api.lanyard.rest/socket");
  } catch (e) {
    return;
  }
  sock.onmessage = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch (err) {
      return;
    }
    if (msg.op === 1) {
      clearInterval(hb);
      hb = setInterval(() => {
        if (sock.readyState === 1) sock.send(JSON.stringify({ op: 3 }));
      }, msg.d.heartbeat_interval);
      sock.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
    } else if (
      msg.op === 0 &&
      (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")
    ) {
      applyPresence(msg.d);
    }
  };
  sock.onclose = () => {
    clearInterval(hb);
    setTimeout(connectLanyard, 5000);
  };
  sock.onerror = () => sock.close();
}

function applyPresence(d) {
  if (!d) return;
  presenceState.discordStatus = d.discord_status || "offline";
  if (d.listening_to_spotify && d.spotify) {
    presenceState.spotify = {
      song: d.spotify.song,
      artist: d.spotify.artist,
      art: d.spotify.album_art_url,
      start: d.spotify.timestamps?.start || 0,
      end: d.spotify.timestamps?.end || 0,
    };
  } else {
    presenceState.spotify = null;
  }
}
