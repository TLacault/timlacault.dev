<script>
import { projects } from "@/data/projects.js";

export default {
  name: "ProjectView",
  data() {
    return {
      projects,
      activeIndex: 0,
      popup: null,
      popupComponent: null,
      popupVisible: false,
      popupMounted: false,
      busy: false, // throttle between snaps
    };
  },
  mounted() {
    this._onWheel = this.onWheel.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onTouchStart = this.onTouchStart.bind(this);
    this._onTouchEnd = this.onTouchEnd.bind(this);

    // Capture phase so we fire before Lenis bubble listeners
    document.addEventListener("wheel", this._onWheel, {
      passive: false,
      capture: true,
    });
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("touchstart", this._onTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", this._onTouchEnd, { passive: true });
  },
  beforeUnmount() {
    document.removeEventListener("wheel", this._onWheel, { capture: true });
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("touchstart", this._onTouchStart);
    document.removeEventListener("touchend", this._onTouchEnd);
    document.body.style.overflow = "";
  },
  methods: {
    /* ── Scroll / input interception ─────────────────────────── */
    isSceneActive() {
      const scene = this.$refs.scene;
      if (!scene) return false;
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, vh);
      const visible = Math.max(0, visibleBottom - visibleTop);
      // Only intercept when ≥80% of the scene is filling the viewport
      return visible / (rect.bottom - rect.top) >= 0.8;
    },

    onWheel(e) {
      if (this.popup) return; // let the popup body scroll natively
      if (!this.isSceneActive()) return;
      const n = this.projects.length;
      const down = e.deltaY > 0;
      const up = e.deltaY < 0;

      if (down && this.activeIndex < n - 1) {
        e.preventDefault();
        e.stopPropagation();
        this.advance(1);
      } else if (up && this.activeIndex > 0) {
        e.preventDefault();
        e.stopPropagation();
        this.advance(-1);
      }
      // At boundaries → let the event propagate (Lenis handles page scroll)
    },

    onKeyDown(e) {
      if (!this.isSceneActive()) return;
      const n = this.projects.length;
      if (
        (e.key === "ArrowDown" || e.key === "PageDown") &&
        this.activeIndex < n - 1
      ) {
        e.preventDefault();
        this.advance(1);
      } else if (
        (e.key === "ArrowUp" || e.key === "PageUp") &&
        this.activeIndex > 0
      ) {
        e.preventDefault();
        this.advance(-1);
      }
    },

    onTouchStart(e) {
      this._touchY = e.touches[0].clientY;
    },
    onTouchEnd(e) {
      if (!this.isSceneActive()) return;
      const dy = this._touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 35) return;
      const n = this.projects.length;
      if (dy > 0 && this.activeIndex < n - 1) this.advance(1);
      else if (dy < 0 && this.activeIndex > 0) this.advance(-1);
    },

    advance(dir) {
      if (this.busy) return;
      this.busy = true;
      this.activeIndex = Math.max(
        0,
        Math.min(this.projects.length - 1, this.activeIndex + dir)
      );
      // Throttle matches CSS transition duration (550ms)
      setTimeout(() => {
        this.busy = false;
      }, 550);
    },

    /* ── Rail click ──────────────────────────────────────────── */
    selectProject(i) {
      if (this.busy) return;
      if (i === this.activeIndex) return;
      this.busy = true;
      this.activeIndex = i;
      setTimeout(() => {
        this.busy = false;
      }, 550);
    },

    /* ── Card style (snap, no fade) ─────────────────────────── */
    cardStyle(i) {
      const offset = i - this.activeIndex;
      return {
        transform: `translate(calc(-50% + ${offset * 115}%), -50%)`,
        pointerEvents: offset === 0 ? "auto" : "none",
        zIndex: offset === 0 ? 10 : 1,
      };
    },

    /* ── Popup ───────────────────────────────────────────────── */
    async openProject(project) {
      if (this.popup) return;
      this.popup = project;
      this.popupComponent = null;
      this.popupMounted = false;
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
      try {
        const mod = await project.component();
        this.popupComponent = mod.default;
      } catch {
        this.popupComponent = null;
      }
      this.$nextTick(() => {
        this.popupMounted = true;
        setTimeout(() => {
          this.popupVisible = true;
        }, 20);
      });
    },
    closePopup() {
      this.popupVisible = false;
      setTimeout(() => {
        this.popup = null;
        this.popupComponent = null;
        this.popupMounted = false;
        document.body.style.overflow = "";
        window.__lenis?.start();
      }, 360);
    },
    statusClass(s) {
      if (s === "Live") return "status-live";
      if (s === "In Progress") return "status-wip";
      return "status-arch";
    },
  },
};
</script>

<template>
  <div class="projects-page">
    <div ref="scene" class="proj-scene">
      <div class="proj-stage">
        <!-- Left rail -->
        <aside class="proj-rail">
          <div class="rail-head">
            <p class="rail-label">Work</p>
            <h1 class="rail-title">Selected<br />Projects</h1>
          </div>

          <div class="rail-list">
            <span
              class="rail-indicator"
              :style="{ transform: `translateY(${activeIndex * 72}px)` }"
            ></span>
            <button
              v-for="(p, i) in projects"
              :key="p.id"
              class="rail-item"
              :class="{ active: activeIndex === i }"
              @click="selectProject(i)"
            >
              <span class="rail-num">{{ String(i + 1).padStart(2, "0") }}</span>
              <span class="rail-name">{{ p.title }}</span>
            </button>
          </div>

          <div class="rail-footer">
            <div class="scroll-hint" :class="{ hidden: activeIndex > 0 }">
              <i class="ri-arrow-down-line"></i>
              <span>Scroll</span>
            </div>
            <div
              class="exit-hint"
              :class="{ visible: activeIndex === projects.length - 1 }"
            >
              <i class="ri-arrow-down-line"></i>
              <span>Continue</span>
            </div>
          </div>
        </aside>

        <!-- Cards viewport -->
        <div class="cards-viewport">
          <span class="stage-glow" aria-hidden="true"></span>

          <div
            v-for="(p, i) in projects"
            :key="p.id"
            class="proj-card"
            :style="cardStyle(i)"
            @click="activeIndex === i && openProject(p)"
          >
            <div class="card-inner" :class="{ 'is-active': activeIndex === i }">
              <!-- Preview image -->
              <div class="card-preview">
                <img :src="p.preview" alt="" draggable="false" />
              </div>

              <!-- Status badge -->
              <span :class="['card-status', statusClass(p.status)]">{{
                p.status
              }}</span>

              <!-- Body -->
              <div class="card-body">
                <h2 class="card-title">{{ p.title }}</h2>
                <p class="card-tagline">{{ p.tagline }}</p>
              </div>

              <!-- Footer -->
              <div class="card-foot">
                <div class="card-meta">
                  <span>{{ p.role }}</span>
                  <span class="meta-dot">·</span>
                  <span>{{ p.year }}</span>
                </div>
                <div class="card-stack">
                  <span v-for="s in p.stack" :key="s" class="chip">{{
                    s
                  }}</span>
                </div>
              </div>

              <div class="card-open-hint">
                <i class="ri-terminal-window-line"></i>
                <span>Open</span>
                <i class="ri-arrow-right-line"></i>
              </div>
            </div>
          </div>

          <!-- Progress index -->
          <div class="progress-bar">
            <button
              v-for="(p, i) in projects"
              :key="p.id"
              class="pdot"
              :class="{ active: activeIndex === i }"
              @click="selectProject(i)"
              :aria-label="p.title"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Terminal popup -->
  <Teleport to="body">
    <div
      v-if="popupMounted"
      class="terminal-overlay"
      :class="{ visible: popupVisible }"
      @click.self="closePopup"
    >
      <div class="terminal-window" :class="{ open: popupVisible }">
        <div class="term-bar">
          <div class="term-controls">
            <button
              class="term-ctrl ctrl-close"
              @click="closePopup"
              aria-label="Close"
            >
              <i class="ri-close-line"></i>
            </button>
            <span class="term-ctrl ctrl-min"></span>
            <span class="term-ctrl ctrl-max"></span>
          </div>
          <span class="term-title">
            <i class="ri-terminal-box-line"></i>
            {{ popup?.title ?? "" }}
          </span>
          <div class="term-meta">
            <span>{{ popup?.year }}</span>
            <span class="term-sep">·</span>
            <span>{{ popup?.role }}</span>
          </div>
        </div>

        <div class="term-prompt">
          <span class="prompt-user">tim</span><span class="prompt-at">@</span
          ><span class="prompt-host">portfolio</span
          ><span class="prompt-sep">:</span
          ><span class="prompt-dir">~/projects/{{ popup?.slug }}</span
          ><span class="prompt-dollar">$</span>
          <span class="prompt-cmd">cat README.md</span>
          <span class="prompt-cursor"></span>
        </div>

        <div class="term-body">
          <div class="term-preview-banner" v-if="popup?.preview">
            <img :src="popup.preview" :alt="popup?.title" draggable="false" />
          </div>
          <component :is="popupComponent" v-if="popupComponent" />
          <div v-else class="term-loading">
            <i class="ri-loader-4-line spinning"></i>
            <span>Loading module…</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Page ────────────────────────────────────────────────────── */
.projects-page {
  width: 100%;
}

/* ── Scene: fills viewport below nav ─────────────────────────── */
.proj-scene {
  width: 100%;
  height: calc(100dvh - 80px);
  position: relative;
}

/* ── Stage: full-height flex row ─────────────────────────────── */
.proj-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  position: relative;
}

/* ── Left rail ───────────────────────────────────────────────── */
.proj-rail {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 2rem;
  border-right: 1px solid var(--glow-card-border);
  background: var(--background);
  position: relative;
  z-index: 10;
}

.rail-head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.rail-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}
.rail-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  color: var(--text);
  line-height: 1.2;
}

.rail-list {
  position: relative;
  display: flex;
  flex-direction: column;
}
.rail-indicator {
  position: absolute;
  left: -2px;
  top: 10px;
  width: 2px;
  height: 52px;
  background: linear-gradient(to bottom, var(--primary), var(--accent));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(94, 201, 255, 0.5);
  transition: transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.rail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  height: 72px;
  transition: background 0.2s ease;
}
.rail-item:hover {
  background: rgba(255, 255, 255, 0.04);
}
.rail-num {
  font-family: "Poppins", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-faint);
  flex-shrink: 0;
  transition: color 0.25s ease;
}
.rail-name {
  font-family: "Poppins", sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.38;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.25s ease;
}
.rail-item.active .rail-num {
  color: var(--accent);
}
.rail-item.active .rail-name {
  opacity: 1;
}

.rail-footer {
  position: relative;
  height: 28px;
}
.scroll-hint,
.exit-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: opacity 0.4s ease;
}
.scroll-hint {
  color: var(--text-faint);
  opacity: 1;
}
.scroll-hint.hidden {
  opacity: 0;
}
.scroll-hint i {
  animation: bounce-down 1.4s ease-in-out infinite alternate;
}
.exit-hint {
  color: var(--accent);
  opacity: 0;
}
.exit-hint.visible {
  opacity: 1;
}
.exit-hint i {
  animation: bounce-down 1.4s ease-in-out infinite alternate;
}
@keyframes bounce-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(4px);
  }
}

/* ── Cards viewport: overlays full stage so card centers at true 50vw */
.cards-viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none; /* rail stays interactive above */
}

.stage-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(47, 102, 202, 0.07),
    transparent 65%
  );
  pointer-events: none;
  filter: blur(40px);
}

/* ── Cards ───────────────────────────────────────────────────── */
.proj-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(580px, 80vw);
  pointer-events: auto; /* restore inside pointer-events:none viewport */
  /* Spring snap: no opacity, transform only */
  transition: transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1);
  will-change: transform;
  cursor: pointer;
}

.card-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  border-radius: 20px;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(18px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
/* Blue accent top-line */
.card-inner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(94, 201, 255, 0.45),
    transparent
  );
  z-index: 3;
  opacity: 0.7;
  transition: opacity 0.3s ease, left 0.3s ease, right 0.3s ease;
}
.card-inner.is-active:hover::before {
  opacity: 1;
  left: 5%;
  right: 5%;
}
.card-inner.is-active:hover {
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
}
.card-inner.is-active:hover .card-open-hint {
  opacity: 1;
  transform: translateY(0);
}
.card-inner.is-active:hover .card-open-hint i.ri-arrow-right-line {
  transform: translateX(4px);
}

/* Preview area — full image, no crop */
.card-preview {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  border-radius: 18px 18px 0 0;
  overflow: hidden;
  background: rgba(8, 13, 25, 0.6);
  border-bottom: 1px solid var(--glow-card-border);
}
.card-preview img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}
.card-inner.is-active:hover .card-preview img {
  transform: scale(1.02);
}

/* Status badge: absolute over preview */
.card-status {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.28rem 0.75rem;
  border-radius: 999px;
  z-index: 2;
}
.status-live {
  background: rgba(74, 222, 128, 0.15);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
}
.status-wip {
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}
.status-arch {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 2rem 0;
}
.card-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  color: var(--text);
  line-height: 1.1;
}
.card-tagline {
  font-family: "Poppins", sans-serif;
  font-size: 0.92rem;
  font-weight: 400;
  line-height: 1.75;
  color: var(--text-muted);
}

.card-foot {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 2rem 2rem;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-subtle);
}
.meta-dot {
  opacity: 0.5;
}
.card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.chip {
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  background: rgba(47, 102, 202, 0.08);
  border: 1px solid rgba(94, 201, 255, 0.16);
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent);
}

.card-open-hint {
  position: absolute;
  bottom: 1.75rem;
  right: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 3;
}
.card-open-hint i.ri-arrow-right-line {
  transition: transform 0.25s ease;
}

/* ── Progress dots (sticky index below card area) ───────────── */
.progress-bar {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 5;
  pointer-events: auto;
}
.pdot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: var(--text);
  opacity: 0.2;
  cursor: pointer;
  padding: 0;
  transition: width 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease,
    background 0.3s ease;
}
.pdot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--accent);
  opacity: 1;
  box-shadow: 0 0 8px rgba(94, 201, 255, 0.45);
}

/* ── Terminal overlay ────────────────────────────────────────── */
.terminal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  transition: background 0.35s ease, backdrop-filter 0.35s ease;
  padding: 1rem;
}
.terminal-overlay.visible {
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(10px);
}

.terminal-window {
  width: 100%;
  max-width: 880px;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.04) inset;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.terminal-window.open {
  opacity: 1;
  transform: scale(1);
}

.term-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.25rem;
  background: #eef2f7;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  flex-shrink: 0;
}
.term-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}
.term-ctrl {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  flex-shrink: 0;
}
.ctrl-close {
  background: #ff5f57;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: transparent;
  cursor: pointer;
  transition: color 0.15s ease, filter 0.15s ease;
}
.ctrl-close:hover {
  color: rgba(0, 0, 0, 0.65);
  filter: brightness(1.15);
}
.ctrl-min {
  background: #febc2e;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.ctrl-max {
  background: #28c840;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.term-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.6);
}
.term-title i {
  font-size: 0.9rem;
  color: var(--primary);
}
.term-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  color: rgba(15, 23, 42, 0.35);
  flex-shrink: 0;
}
.term-sep {
  opacity: 0.5;
}

.term-prompt {
  padding: 0.9rem 1.5rem 0.6rem;
  font-family: "Poppins", monospace;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.prompt-user {
  color: #16a34a;
  font-weight: 600;
}
.prompt-at {
  color: rgba(15, 23, 42, 0.3);
}
.prompt-host {
  color: #2563eb;
  font-weight: 600;
}
.prompt-sep {
  color: rgba(15, 23, 42, 0.3);
}
.prompt-dir {
  color: #7c3aed;
}
.prompt-dollar {
  color: rgba(15, 23, 42, 0.4);
  margin: 0 0.45rem;
}
.prompt-cmd {
  color: rgba(15, 23, 42, 0.65);
}
.prompt-cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: rgba(37, 99, 235, 0.6);
  border-radius: 1px;
  margin-left: 4px;
  animation: blink 1.1s step-end infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.term-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}
.term-body::-webkit-scrollbar {
  width: 4px;
}
.term-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
}

.term-preview-banner {
  padding: 1.5rem 1.75rem 1rem;
  background: #eef2f7;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}
.term-preview-banner img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.term-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(15, 23, 42, 0.35);
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  padding: 2rem;
}
.spinning {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Project content (rendered inside terminal body) ─────────── */
:deep(.proj-content) {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  padding: 1.75rem;
}
:deep(.proj-section) {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
:deep(.proj-section h2) {
  font-family: "Poppins", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
}
:deep(.proj-section p),
:deep(.proj-section li) {
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(15, 23, 42, 0.7);
}
:deep(.proj-section ul) {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
:deep(.proj-section li::before) {
  content: "›";
  color: var(--primary);
  margin-right: 0.5rem;
  font-weight: 700;
}
:deep(.proj-section code) {
  font-family: "Poppins", monospace;
  font-size: 0.82rem;
  background: rgba(37, 99, 235, 0.07);
  border: 1px solid rgba(37, 99, 235, 0.15);
  color: #2563eb;
  padding: 0.1em 0.4em;
  border-radius: 4px;
}

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 800px) {
  .proj-rail {
    width: 200px;
    padding: 1.75rem 1.25rem;
  }
}

@media (max-width: 600px) {
  .proj-stage {
    flex-direction: column;
  }
  .proj-scene {
    height: calc(100dvh - 70px);
  }
  .proj-rail {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-right: none;
    border-bottom: 1px solid var(--glow-card-border);
    flex-shrink: 0;
    height: auto;
  }
  .rail-head {
    flex-direction: row;
    align-items: baseline;
    gap: 0.5rem;
  }
  .rail-title {
    font-size: 1rem;
    br {
      display: none;
    }
  }
  .rail-list {
    flex-direction: row;
    flex: 0;
    gap: 0;
  }
  .rail-indicator {
    display: none;
  }
  .rail-item {
    height: auto;
    padding: 0.4rem 0.6rem;
    gap: 4px;
    flex-direction: column;
    align-items: flex-start;
  }
  .rail-name {
    font-size: 0.7rem;
  }
  .rail-footer {
    display: none;
  }
  .proj-card {
    width: min(400px, 92vw);
  }
  .card-body {
    padding: 0 1.25rem;
  }
  .card-foot {
    padding: 0 1.25rem 1.25rem;
  }
  .terminal-window {
    max-height: 92vh;
  }
}
</style>
