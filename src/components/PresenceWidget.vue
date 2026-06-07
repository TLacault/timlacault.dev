<script>
import {
  presenceState,
  startPresence,
  fmtTime,
  statusLabel as fmtStatusLabel,
  dotClass as fmtDotClass,
  githubText as fmtGithubText,
  relativeTime,
  spotifyProgress as fmtSpotifyProgress,
} from "@/stores/presence";

export default {
  name: "PresenceWidget",
  data() {
    return {
      expanded: false,
      state: presenceState,
    };
  },
  computed: {
    time() {
      return fmtTime(this.state.nowTs);
    },
    statusLabel() {
      return fmtStatusLabel(this.$t, this.state.nowTs);
    },
    dotClass() {
      return fmtDotClass(this.state.discordStatus, this.state.nowTs);
    },
    github() {
      return this.state.github;
    },
    spotify() {
      return this.state.spotify;
    },
    githubText() {
      return fmtGithubText(this.$t, this.state.github);
    },
    spotifyProgress() {
      return fmtSpotifyProgress(this.state.spotify, this.state.nowTs);
    },
  },
  mounted() {
    startPresence();
  },
  methods: {
    relative(at) {
      return relativeTime(this.$t, at, this.state.nowTs);
    },
  },
};
</script>

<template>
  <div class="presence" :class="{ 'is-expanded': expanded }">
    <Transition name="presence-pop" mode="out-in">
      <!-- ============ EXPANDED ============ -->
      <div v-if="expanded" key="expanded" class="card">
        <div class="card-head">
          <span class="tagline">
            <span class="dot live" :class="dotClass"></span>
            {{ $t("presence.label") }}
          </span>
          <button
            class="icon-btn ghost"
            :aria-label="$t('presence.collapse')"
            @click="expanded = false"
          >
            <i class="ri-arrow-down-s-line"></i>
          </button>
        </div>

        <!-- time + status -->
        <div class="row">
          <span class="row-ico grape">🍇</span>
          <div class="row-body">
            <span class="row-main">
              {{ time }}
              <span class="muted">· {{ $t("presence.bordeaux") }}</span>
            </span>
            <span class="row-sub">{{ statusLabel }}</span>
          </div>
        </div>

        <!-- github -->
        <a
          v-if="github"
          class="row link"
          :href="github.url"
          target="_blank"
          rel="noopener"
        >
          <span class="row-ico"><i class="ri-github-line"></i></span>
          <div class="row-body">
            <span class="row-main">{{ githubText }}</span>
            <span class="row-sub">{{ relative(github.at) }}</span>
          </div>
          <i class="ri-arrow-right-up-line row-go"></i>
        </a>
        <div v-else class="row">
          <span class="row-ico"><i class="ri-github-line"></i></span>
          <span class="row-main muted">{{ $t("presence.gh.none") }}</span>
        </div>

        <!-- spotify -->
        <div v-if="spotify" class="row">
          <img class="row-art" :src="spotify.art" alt="" draggable="false" />
          <div class="row-body">
            <span class="row-main">{{ spotify.song }}</span>
            <span class="row-sub">{{ spotify.artist }}</span>
            <div v-if="spotify.end" class="sp-bar">
              <div
                class="sp-fill"
                :style="{ width: spotifyProgress + '%' }"
              ></div>
            </div>
          </div>
          <i class="ri-spotify-fill sp-ico"></i>
        </div>
        <div v-else class="row">
          <span class="row-ico"><i class="ri-headphone-line"></i></span>
          <span class="row-main muted">{{ $t("presence.notListening") }}</span>
        </div>
      </div>

      <!-- ============ COLLAPSED ============ -->
      <button
        v-else
        key="collapsed"
        class="pill"
        :aria-label="$t('presence.label')"
        @click="expanded = true"
      >
        <span class="dot live" :class="dotClass"></span>
        <span class="pill-text">
          <span class="pill-time">🍇 {{ time }}</span>
          <span class="pill-sub">{{ statusLabel }}</span>
        </span>
        <span v-if="spotify" class="pill-eq" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.presence {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 900;
  font-family: "Poppins", sans-serif;
}

/* shared surface */
.card,
.pill {
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.35), 0 0 30px rgba(94, 201, 255, 0.06);
  transform-origin: bottom left;
}

/* status dot */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--text-subtle);
}
.dot.online {
  background: #3ba55d;
}
.dot.idle {
  background: #faa81a;
}
.dot.dnd {
  background: #ed4245;
}
.dot.offline {
  background: #747f8d;
}
.dot.live {
  position: relative;
}
.dot.live::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  animation: ping 2s ease-out infinite;
}
@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

/* ---------------- COLLAPSED (pill) ---------------- */
.pill {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: var(--glow-card-bg);
  text-align: left;
  max-width: min(70vw, 230px);
}
.pill-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.pill-time {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.pill-sub {
  font-size: 0.66rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pill-eq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
  margin-left: auto;
}
.pill-eq span {
  width: 3px;
  height: 50%;
  border-radius: 2px;
  background: var(--accent);
  animation: eq 0.9s ease-in-out infinite;
}
.pill-eq span:nth-child(2) {
  animation-delay: 0.2s;
}
.pill-eq span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes eq {
  0%,
  100% {
    height: 30%;
  }
  50% {
    height: 100%;
  }
}

/* ---------------- EXPANDED (card) ---------------- */
.card {
  width: min(92vw, 300px);
  padding: 1rem;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 2px 0.35rem 7.5px;
}
.tagline {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.45rem 0.4rem;
  border-radius: 12px;
}
.row.link {
  transition: background 0.2s ease;
}
.row.link:hover {
  background: rgba(94, 201, 255, 0.07);
}
.row-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 8px;
  font-size: 1.05rem;
  color: var(--text-muted);
  background: var(--glow-card-border);
}
.row-ico.grape {
  font-size: 1rem;
}
.row-art {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.row-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.row-main {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-main.muted,
.muted {
  color: var(--text-muted);
  font-weight: 400;
}
.row-sub {
  font-size: 0.68rem;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-go {
  font-size: 0.95rem;
  color: var(--text-faint);
  flex-shrink: 0;
}
.sp-ico {
  font-size: 1.15rem;
  color: #1db954;
  flex-shrink: 0;
}

/* spotify progress */
.sp-bar {
  position: relative;
  height: 3px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--glow-card-border);
  overflow: hidden;
}
.sp-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: #1db954;
}

/* icon button (collapse) */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: color 0.2s ease, background 0.2s ease, transform 0.15s ease;
}
.icon-btn:hover {
  color: var(--accent);
  background: var(--button-hover-bg);
}
.icon-btn:active {
  transform: scale(0.92);
}
.icon-btn.ghost {
  font-size: 1.2rem;
  color: var(--text-muted);
}

/* enter/exit morph */
.presence-pop-enter-active,
.presence-pop-leave-active {
  transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.presence-pop-enter-from,
.presence-pop-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(8px);
}

/* Phones: corners are taken by the radio — hide to keep them clean. */
@media (max-width: 600px) {
  .presence {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot.live::after,
  .pill-eq span {
    animation: none;
  }
  .presence-pop-enter-active,
  .presence-pop-leave-active {
    transition: opacity 0.2s ease;
  }
  .presence-pop-enter-from,
  .presence-pop-leave-to {
    transform: none;
  }
}
</style>
