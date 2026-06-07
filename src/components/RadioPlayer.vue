<script>
// Auto-load every track in src/assets/radio (mp3 + matching cover image).
// Webpack require.context resolves these at build time.
function loadTracks() {
  const ctx = require.context(
    "../assets/radio",
    false,
    // eslint-disable-next-line prettier/prettier
    /\.(mp3|webp|png|jpe?g)$/,
  );
  const byBase = {};
  ctx.keys().forEach((key) => {
    const file = key.replace(/^\.\//, "");
    const base = file.replace(/\.[^.]+$/, "");
    const ext = file.split(".").pop().toLowerCase();
    byBase[base] = byBase[base] || {};
    if (ext === "mp3") byBase[base].audio = ctx(key);
    else byBase[base].cover = ctx(key);
  });

  return Object.entries(byBase)
    .filter(([, v]) => v.audio)
    .map(([base, v]) => {
      const clean = base.replace(/_/g, " ").trim();
      const parts = clean.split(/\s+-\s+/);
      let artist = "";
      let title = clean;
      if (parts.length >= 2) {
        artist = parts[0];
        title = parts.slice(1).join(" - ");
      }
      return { title, artist, audio: v.audio, cover: v.cover || null };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default {
  name: "RadioPlayer",
  data() {
    return {
      tracks: loadTracks(),
      index: 0,
      playing: false,
      expanded: false,
      currentTime: 0,
      duration: 0,
      dragging: false,
      dragRatio: 0,
      volume: 0.8,
      lastVolume: 0.8,
      volDragging: false,
      shuffle: false,
      loop: false,
    };
  },
  computed: {
    current() {
      return this.tracks[this.index] || null;
    },
    progress() {
      if (this.dragging) return this.dragRatio * 100;
      if (!this.duration) return 0;
      return (this.currentTime / this.duration) * 100;
    },
    volIcon() {
      if (this.volume === 0) return "ri-volume-mute-line";
      if (this.volume < 0.5) return "ri-volume-down-line";
      return "ri-volume-up-line";
    },
  },
  mounted() {
    this.applyVolume();
  },
  beforeUnmount() {
    window.removeEventListener("pointermove", this.onDragMove);
    window.removeEventListener("pointerup", this.onDragEnd);
    window.removeEventListener("pointermove", this.onVolMove);
    window.removeEventListener("pointerup", this.onVolEnd);
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    },
    togglePlay() {
      this.playing ? this.pause() : this.play();
    },
    play() {
      const a = this.$refs.audio;
      if (!a) return;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      this.playing = true;
    },
    pause() {
      this.$refs.audio?.pause();
      this.playing = false;
    },
    goTo(i, autoplay = true) {
      const len = this.tracks.length;
      if (!len) return;
      this.index = (i + len) % len;
      this.currentTime = 0;
      this.duration = 0;
      this.$nextTick(() => {
        const a = this.$refs.audio;
        if (!a) return;
        a.load();
        if (autoplay || this.playing) this.play();
      });
    },
    randomIndex() {
      const len = this.tracks.length;
      if (len <= 1) return this.index;
      let i = this.index;
      while (i === this.index) i = Math.floor(Math.random() * len);
      return i;
    },
    next() {
      this.goTo(this.shuffle ? this.randomIndex() : this.index + 1);
    },
    prev() {
      // Restart current track if we're past 3s, otherwise go to previous.
      if (this.currentTime > 3) {
        const a = this.$refs.audio;
        if (a) a.currentTime = 0;
        return;
      }
      this.goTo(this.shuffle ? this.randomIndex() : this.index - 1);
    },
    toggleShuffle() {
      this.shuffle = !this.shuffle;
    },
    toggleLoop() {
      this.loop = !this.loop;
    },
    onLoadedMeta() {
      this.duration = this.$refs.audio?.duration || 0;
    },
    onTimeUpdate() {
      if (this.dragging) return;
      this.currentTime = this.$refs.audio?.currentTime || 0;
    },
    onEnded() {
      // Repeat-one takes priority over shuffle / advancing.
      if (this.loop) {
        const a = this.$refs.audio;
        if (a) {
          a.currentTime = 0;
          this.play();
        }
        return;
      }
      this.next();
    },
    // --- Draggable progress cursor (pointer = mouse + touch) ---
    onDragStart(e) {
      this.dragging = true;
      this.updateRatio(e);
      window.addEventListener("pointermove", this.onDragMove);
      window.addEventListener("pointerup", this.onDragEnd);
    },
    onDragMove(e) {
      if (this.dragging) this.updateRatio(e);
    },
    onDragEnd(e) {
      if (!this.dragging) return;
      this.updateRatio(e);
      const a = this.$refs.audio;
      if (a && this.duration) a.currentTime = this.dragRatio * this.duration;
      this.dragging = false;
      window.removeEventListener("pointermove", this.onDragMove);
      window.removeEventListener("pointerup", this.onDragEnd);
    },
    updateRatio(e) {
      const bar = this.$refs.bar;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      ratio = Math.min(1, Math.max(0, ratio));
      this.dragRatio = ratio;
      this.currentTime = ratio * this.duration;
    },
    // --- Volume control (draggable, pointer = mouse + touch) ---
    applyVolume() {
      const a = this.$refs.audio;
      if (a) a.volume = this.volume;
    },
    setVol(v) {
      this.volume = Math.min(1, Math.max(0, v));
      this.applyVolume();
    },
    toggleMute() {
      if (this.volume > 0) {
        this.lastVolume = this.volume;
        this.setVol(0);
      } else {
        this.setVol(this.lastVolume || 0.8);
      }
    },
    onVolStart(e) {
      this.volDragging = true;
      this.updateVol(e);
      window.addEventListener("pointermove", this.onVolMove);
      window.addEventListener("pointerup", this.onVolEnd);
    },
    onVolMove(e) {
      if (this.volDragging) this.updateVol(e);
    },
    onVolEnd(e) {
      if (!this.volDragging) return;
      this.updateVol(e);
      this.volDragging = false;
      window.removeEventListener("pointermove", this.onVolMove);
      window.removeEventListener("pointerup", this.onVolEnd);
    },
    updateVol(e) {
      const bar = this.$refs.volBar;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      this.setVol(ratio);
    },
    fmt(sec) {
      if (!sec || isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    },
  },
};
</script>

<template>
  <div v-if="current" class="radio" :class="{ 'is-expanded': expanded }">
    <audio
      ref="audio"
      :src="current.audio"
      preload="metadata"
      @loadedmetadata="onLoadedMeta"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    ></audio>

    <Transition name="radio-pop" mode="out-in">
      <!-- ============ EXPANDED ============ -->
      <div v-if="expanded" key="expanded" class="card">
        <div class="card-head">
          <span class="tagline">
            <i class="ri-music-2-line"></i>
            Stuff I listen to when I code
          </span>
          <button
            class="icon-btn ghost"
            aria-label="Collapse player"
            @click="toggleExpand"
          >
            <i class="ri-arrow-down-s-line"></i>
          </button>
        </div>

        <div class="cover-wrap">
          <img
            v-if="current.cover"
            :src="current.cover"
            :alt="current.title"
            class="cover"
            draggable="false"
          />
          <div v-else class="cover cover-fallback" aria-hidden="true">
            <i class="ri-music-2-line"></i>
          </div>
          <div v-if="playing" class="eq eq-lg" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <div class="meta">
          <span class="title" :title="current.title">{{ current.title }}</span>
          <span v-if="current.artist" class="artist">{{ current.artist }}</span>
        </div>

        <div class="seek">
          <span class="time">{{ fmt(currentTime) }}</span>
          <div
            ref="bar"
            class="bar"
            role="slider"
            aria-label="Seek"
            :aria-valuenow="Math.round(progress)"
            aria-valuemin="0"
            aria-valuemax="100"
            @pointerdown="onDragStart"
          >
            <div class="bar-fill" :style="{ width: progress + '%' }"></div>
            <div class="bar-thumb" :style="{ left: progress + '%' }"></div>
          </div>
          <span class="time">{{ fmt(duration) }}</span>
        </div>

        <div class="controls">
          <button
            class="icon-btn small"
            :class="{ active: shuffle }"
            aria-label="Shuffle"
            :aria-pressed="shuffle"
            @click="toggleShuffle"
          >
            <i class="ri-shuffle-line"></i>
          </button>
          <button class="icon-btn" aria-label="Previous track" @click="prev">
            <i class="ri-skip-back-fill"></i>
          </button>
          <button
            class="icon-btn play"
            :aria-label="playing ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <i :class="playing ? 'ri-pause-fill' : 'ri-play-fill'"></i>
          </button>
          <button class="icon-btn" aria-label="Next track" @click="next">
            <i class="ri-skip-forward-fill"></i>
          </button>
          <button
            class="icon-btn small"
            :class="{ active: loop }"
            aria-label="Repeat current track"
            :aria-pressed="loop"
            @click="toggleLoop"
          >
            <i class="ri-repeat-line"></i>
          </button>
        </div>

        <div class="volume">
          <button
            class="icon-btn ghost vol-btn"
            :aria-label="volume === 0 ? 'Unmute' : 'Mute'"
            @click="toggleMute"
          >
            <i :class="volIcon"></i>
          </button>
          <div
            ref="volBar"
            class="bar vol-bar"
            role="slider"
            aria-label="Volume"
            :aria-valuenow="Math.round(volume * 100)"
            aria-valuemin="0"
            aria-valuemax="100"
            @pointerdown="onVolStart"
          >
            <div class="bar-fill" :style="{ width: volume * 100 + '%' }"></div>
            <div class="bar-thumb" :style="{ left: volume * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- ============ SHRUNK ============ -->
      <div v-else key="collapsed" class="pill">
        <button
          class="pill-main"
          aria-label="Expand player"
          @click="toggleExpand"
        >
          <span class="pill-cover">
            <img
              v-if="current.cover"
              :src="current.cover"
              :alt="current.title"
              draggable="false"
            />
            <i v-else class="ri-music-2-line"></i>
            <span v-if="playing" class="eq eq-sm" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
          </span>
          <span class="pill-meta">
            <span class="pill-title">{{ current.title }}</span>
            <span class="pill-sub">{{ current.artist || "now playing" }}</span>
          </span>
        </button>
        <button
          class="icon-btn play sm"
          :aria-label="playing ? 'Pause' : 'Play'"
          @click="togglePlay"
        >
          <i :class="playing ? 'ri-pause-fill' : 'ri-play-fill'"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.radio {
  position: fixed;
  right: 1.25rem;
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
  transform-origin: bottom right;
}

/* ---------------- SHRUNK (pill) ---------------- */
.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem 0.4rem 0.4rem;
  border-radius: 999px;
  max-width: min(78vw, 300px);
}
.pill-main {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: transparent;
  padding: 0;
  min-width: 0;
  flex: 1;
}
.pill-cover {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  animation: spin 9s linear infinite;
}
.pill-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pill-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}
.pill-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.pill-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* ---------------- EXPANDED (card) ---------------- */
.card {
  width: min(92vw, 320px);
  padding: 1rem;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.tagline {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--text-muted);
}

.cover-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--accent));
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.title {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.1rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* seek */
.seek {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.time {
  font-size: 0.68rem;
  color: var(--text-subtle);
  font-variant-numeric: tabular-nums;
  min-width: 30px;
  text-align: center;
}
.bar {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--glow-card-border);
  cursor: pointer;
  touch-action: none;
}
.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  /* override global `* { transition: all }` so fill tracks the cursor instantly */
  transition: none;
}
.bar-thumb {
  position: absolute;
  top: 50%;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(94, 201, 255, 0.6);
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease;
}
.bar:hover .bar-thumb,
.bar:active .bar-thumb {
  transform: translate(-50%, -50%) scale(1.25);
}

/* volume */
.volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.15rem;
}
.vol-btn {
  width: 30px;
  height: 30px;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.vol-bar {
  height: 5px;
}

/* controls */
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding-top: 0.15rem;
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text);
  font-size: 1.4rem;
  width: 40px;
  height: 40px;
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
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  color: var(--text-muted);
}
/* shuffle / loop toggles */
.icon-btn.small {
  position: relative;
  width: 34px;
  height: 34px;
  font-size: 1.15rem;
  color: var(--text-muted);
}
.icon-btn.small.active {
  color: var(--accent);
}
.icon-btn.small.active::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}
.icon-btn.play {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  width: 52px;
  height: 52px;
  font-size: 1.8rem;
  box-shadow: 0 6px 20px rgba(47, 102, 202, 0.4);
}
.icon-btn.play:hover {
  color: #fff;
  filter: brightness(1.08);
}
.icon-btn.play.sm {
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: none;
}

/* equalizer */
.eq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}
.eq span {
  width: 3px;
  background: #fff;
  border-radius: 2px;
  animation: bounce 0.9s ease-in-out infinite;
}
.eq span:nth-child(2) {
  animation-delay: 0.2s;
}
.eq span:nth-child(3) {
  animation-delay: 0.4s;
}
.eq span:nth-child(4) {
  animation-delay: 0.6s;
}
.eq-sm {
  position: absolute;
  inset: 0;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}
.eq-sm span {
  height: 10px;
}
.eq-lg {
  position: absolute;
  bottom: 10px;
  left: 12px;
  padding: 5px 7px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
}
.eq-lg span {
  height: 14px;
}
@keyframes bounce {
  0%,
  100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* enter/exit morph */
.radio-pop-enter-active,
.radio-pop-leave-active {
  transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.radio-pop-enter-from,
.radio-pop-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(8px);
}

@media (max-width: 600px) {
  .radio {
    right: 0.85rem;
    bottom: 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pill-cover,
  .eq span {
    animation: none;
  }
  .radio-pop-enter-active,
  .radio-pop-leave-active {
    transition: opacity 0.2s ease;
  }
  .radio-pop-enter-from,
  .radio-pop-leave-to {
    transform: none;
  }
}
</style>
