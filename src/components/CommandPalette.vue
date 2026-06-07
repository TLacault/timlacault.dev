<script>
import { radioState, radioControls } from "@/stores/radio";
import { themeState, toggleTheme } from "@/stores/theme";

export default {
  name: "CommandPalette",
  data() {
    return {
      open: false,
      query: "",
      selected: 0,
      prevFocus: null,
      radio: radioState,
      themeS: themeState,
    };
  },
  computed: {
    commands() {
      const t = this.$t;
      const routeName = this.$route?.name;
      const list = [];

      // --- Navigation ---
      const nav = [
        {
          id: "home",
          name: "landing",
          icon: "ri-home-4-line",
          label: t("nav.home"),
        },
        {
          id: "projects",
          name: "project",
          icon: "ri-folder-line",
          label: t("nav.projects"),
        },
        {
          id: "freelance",
          name: "freelance",
          icon: "ri-briefcase-line",
          label: t("nav.freelance"),
        },
        {
          id: "contact",
          name: "contact",
          icon: "ri-mail-line",
          label: t("nav.contact"),
        },
      ];
      nav.forEach((n) => {
        list.push({
          id: n.id,
          group: "nav",
          icon: n.icon,
          label: n.label,
          kw: "go navigate page " + n.name,
          disabled: routeName === n.name,
          run: () => this.$router.push({ name: n.name }),
        });
      });

      // --- Radio (only once the player is ready) ---
      if (this.radio.ready) {
        list.push({
          id: "play",
          group: "radio",
          icon: this.radio.playing ? "ri-pause-fill" : "ri-play-fill",
          label: this.radio.playing ? t("cmd.pause") : t("cmd.play"),
          kw: "music song audio toggle",
          keepOpen: true,
          run: () => radioControls.togglePlay(),
        });
        list.push({
          id: "next",
          group: "radio",
          icon: "ri-skip-forward-fill",
          label: t("cmd.next"),
          kw: "music skip forward",
          keepOpen: true,
          run: () => radioControls.next(),
        });
        list.push({
          id: "prev",
          group: "radio",
          icon: "ri-skip-back-fill",
          label: t("cmd.prev"),
          kw: "music previous back",
          keepOpen: true,
          run: () => radioControls.prev(),
        });
        list.push({
          id: "shuffle",
          group: "radio",
          icon: "ri-shuffle-line",
          label: this.radio.shuffle ? t("cmd.shuffleOff") : t("cmd.shuffleOn"),
          kw: "music random",
          keepOpen: true,
          run: () => radioControls.toggleShuffle(),
        });
        list.push({
          id: "loop",
          group: "radio",
          icon: "ri-repeat-line",
          label: this.radio.loop ? t("cmd.loopOff") : t("cmd.loopOn"),
          kw: "music repeat",
          keepOpen: true,
          run: () => radioControls.toggleLoop(),
        });
        list.push({
          id: "openPlayer",
          group: "radio",
          icon: "ri-fullscreen-line",
          label: t("cmd.openPlayer"),
          kw: "music expand player",
          run: () => radioControls.expand(),
        });
      }

      // --- Appearance ---
      list.push({
        id: "theme",
        group: "appearance",
        icon:
          this.themeS.theme === "dark" ? "ri-sun-fill" : "ri-moon-clear-fill",
        label:
          this.themeS.theme === "dark" ? t("cmd.lightMode") : t("cmd.darkMode"),
        kw: "theme dark light color mode appearance",
        run: (el) => toggleTheme(el),
      });
      list.push({
        id: "lang",
        group: "appearance",
        icon: "ri-translate-2",
        label:
          this.$locale.locale === "en"
            ? t("nav.switchToFr")
            : t("nav.switchToEn"),
        kw: "language locale french english francais anglais fr en",
        run: () => this.$setLocale(this.$locale.locale === "en" ? "fr" : "en"),
      });

      // --- Actions ---
      list.push({
        id: "bookCall",
        group: "actions",
        icon: "ri-calendar-event-line",
        label: t("nav.bookCall"),
        kw: "meeting schedule cal hire",
        run: () => this.$refs.calTrigger?.click(),
      });
      list.push({
        id: "email",
        group: "actions",
        icon: "ri-mail-send-line",
        label: t("cmd.email"),
        kw: "mail contact write message",
        run: () => {
          window.location.href = "mailto:lacault.tim@gmail.com";
        },
      });
      list.push({
        id: "github",
        group: "actions",
        icon: "ri-github-line",
        label: t("cmd.github"),
        kw: "code repository git social",
        run: () =>
          window.open("https://github.com/TLacault", "_blank", "noopener"),
      });
      list.push({
        id: "linkedin",
        group: "actions",
        icon: "ri-linkedin-line",
        label: t("cmd.linkedin"),
        kw: "social network profile",
        run: () =>
          window.open(
            "https://www.linkedin.com/in/tim-lacault",
            "_blank",
            // eslint-disable-next-line prettier/prettier
            "noopener",
          ),
      });
      list.push({
        id: "resume",
        group: "actions",
        icon: "ri-file-text-line",
        label: t("cmd.resume"),
        kw: "cv pdf download curriculum",
        run: () => {
          const a = document.createElement("a");
          a.href = "/resume_tim_lacault.pdf";
          a.download = "Tim_Lacault_Resume.pdf";
          a.click();
        },
      });

      return list;
    },
    filtered() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.commands;
      return this.commands.filter((c) =>
        // eslint-disable-next-line prettier/prettier
        (c.label + " " + (c.kw || "")).toLowerCase().includes(q),
      );
    },
    groups() {
      const meta = [
        { key: "nav", label: this.$t("cmd.navGroup") },
        { key: "radio", label: this.$t("cmd.radioGroup") },
        { key: "appearance", label: this.$t("cmd.appearanceGroup") },
        { key: "actions", label: this.$t("cmd.actionsGroup") },
      ];
      return meta
        .map((m) => ({
          ...m,
          items: this.filtered
            .map((c, i) => ({ cmd: c, index: i }))
            .filter((x) => x.cmd.group === m.key),
        }))
        .filter((g) => g.items.length);
    },
  },
  watch: {
    query() {
      this.selected = this.firstSelectable();
    },
    filtered() {
      const cur = this.filtered[this.selected];
      if (!cur || cur.disabled) this.selected = this.firstSelectable();
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("open-command-palette", this.openPalette);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("open-command-palette", this.openPalette);
  },
  methods: {
    onKey(e) {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        this.open ? this.close() : this.openPalette();
        return;
      }
      if (this.open && e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    },
    openPalette() {
      if (this.open) return;
      this.prevFocus = document.activeElement;
      this.query = "";
      this.selected = this.firstSelectable();
      this.open = true;
      this.$nextTick(() => this.$refs.input?.focus());
    },
    firstSelectable() {
      const i = this.filtered.findIndex((c) => !c.disabled);
      return i === -1 ? 0 : i;
    },
    close() {
      this.open = false;
      const el = this.prevFocus;
      this.prevFocus = null;
      if (el && el.focus) this.$nextTick(() => el.focus());
    },
    move(dir) {
      const len = this.filtered.length;
      if (!len) return;
      // Step over disabled items (e.g. the current route) so Enter always acts.
      let i = this.selected;
      for (let n = 0; n < len; n++) {
        i = (i + dir + len) % len;
        if (!this.filtered[i].disabled) break;
      }
      this.selected = i;
      this.$nextTick(() => {
        const row = this.$el.querySelector(`[data-idx="${this.selected}"]`);
        row?.scrollIntoView({ block: "nearest" });
      });
    },
    onInputKey(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.move(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = this.filtered[this.selected];
        const el = this.$el.querySelector(`[data-idx="${this.selected}"]`);
        if (cmd) this.runCommand(cmd, el);
      }
    },
    async runCommand(cmd, el) {
      if (!cmd || cmd.disabled) return;
      if (cmd.keepOpen) {
        cmd.run(el);
        return;
      }
      // Close first so theme View-Transition snapshots the page, not the modal.
      this.close();
      await this.$nextTick();
      cmd.run(el);
    },
  },
};
</script>

<template>
  <Transition name="cmdk">
    <div
      v-if="open"
      class="cmdk-overlay"
      @click.self="close"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('cmd.open')"
    >
      <div class="cmdk">
        <div class="cmdk-search">
          <i class="ri-search-line"></i>
          <input
            ref="input"
            v-model="query"
            type="text"
            class="cmdk-input"
            :placeholder="$t('cmd.placeholder')"
            :aria-label="$t('cmd.placeholder')"
            autocomplete="off"
            spellcheck="false"
            @keydown="onInputKey"
          />
          <kbd class="cmdk-esc">esc</kbd>
        </div>

        <div
          v-if="radio.ready && radio.title"
          class="cmdk-nowplaying"
          aria-hidden="true"
        >
          <span class="np-eq" :class="{ playing: radio.playing }">
            <span></span><span></span><span></span>
          </span>
          <span class="np-text">
            <span class="np-label">{{ $t("cmd.nowPlaying") }}</span>
            <span class="np-track">
              {{ radio.title
              }}<template v-if="radio.artist"> — {{ radio.artist }}</template>
            </span>
          </span>
        </div>

        <div class="cmdk-list" role="listbox" data-lenis-prevent>
          <p v-if="!filtered.length" class="cmdk-empty">
            {{ $t("cmd.empty") }}
          </p>

          <div v-for="g in groups" :key="g.key" class="cmdk-group">
            <p class="cmdk-group-label">{{ g.label }}</p>
            <button
              v-for="x in g.items"
              :key="x.cmd.id"
              :data-idx="x.index"
              class="cmdk-item"
              :class="{
                selected: x.index === selected,
                disabled: x.cmd.disabled,
              }"
              role="option"
              :aria-selected="x.index === selected"
              :disabled="x.cmd.disabled"
              @mousemove="selected = x.index"
              @click="runCommand(x.cmd, $event.currentTarget)"
            >
              <i :class="x.cmd.icon"></i>
              <span class="cmdk-item-label">{{ x.cmd.label }}</span>
              <i
                v-if="x.cmd.disabled"
                class="ri-check-line cmdk-item-current"
              ></i>
              <i v-else class="ri-corner-down-left-line cmdk-item-enter"></i>
            </button>
          </div>
        </div>

        <div class="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> {{ $t("cmd.hintNav") }}</span>
          <span><kbd>↵</kbd> {{ $t("cmd.hintSelect") }}</span>
          <span><kbd>esc</kbd> {{ $t("cmd.hintClose") }}</span>
        </div>

        <!-- Hidden Cal.com trigger: reuses the embed initialized in NavigationBar -->
        <span
          ref="calTrigger"
          class="cmdk-cal-trigger"
          data-cal-link="tim-lacault/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","theme":"auto"}'
          aria-hidden="true"
        ></span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cmdk-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 14vh 1rem 1rem;
  background: rgba(3, 6, 12, 0.5);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.cmdk {
  width: min(92vw, 560px);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(94, 201, 255, 0.08),
    0 0 0 1px rgba(94, 201, 255, 0.06) inset;
}

/* Search row */
.cmdk-search {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--glow-card-border);
}
.cmdk-search > i {
  font-size: 1.2rem;
  color: var(--accent);
  flex-shrink: 0;
}
.cmdk-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  min-width: 0;
}
.cmdk-input::placeholder {
  color: var(--text-subtle);
}
.cmdk-esc {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 5px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

/* Now playing strip */
.cmdk-nowplaying {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  background: rgba(94, 201, 255, 0.05);
  border-bottom: 1px solid var(--glow-card-border);
}
.np-eq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
  flex-shrink: 0;
}
.np-eq span {
  width: 3px;
  height: 40%;
  border-radius: 2px;
  background: var(--accent);
}
.np-eq.playing span {
  animation: np-bounce 0.9s ease-in-out infinite;
}
.np-eq.playing span:nth-child(2) {
  animation-delay: 0.2s;
}
.np-eq.playing span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes np-bounce {
  0%,
  100% {
    height: 30%;
  }
  50% {
    height: 100%;
  }
}
.np-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.np-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  font-weight: 600;
}
.np-track {
  font-size: 0.8rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* List */
.cmdk-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.4rem;
  scrollbar-width: none;
}
.cmdk-list::-webkit-scrollbar {
  display: none;
}
.cmdk-empty {
  padding: 1.6rem;
  text-align: center;
  color: var(--text-subtle);
  font-size: 0.9rem;
}
.cmdk-group {
  padding: 0.25rem 0;
}
.cmdk-group-label {
  padding: 0.4rem 0.6rem 0.3rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}
.cmdk-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.7rem;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  text-align: left;
  transition: background 0.12s ease, color 0.12s ease;
}
.cmdk-item > i:first-child {
  font-size: 1.15rem;
  color: var(--text-muted);
  flex-shrink: 0;
  width: 22px;
  text-align: center;
}
.cmdk-item-label {
  flex: 1;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cmdk-item-enter {
  font-size: 0.95rem;
  color: var(--text-faint);
  opacity: 0;
  transition: opacity 0.12s ease;
}
.cmdk-item-current {
  font-size: 0.95rem;
  color: var(--accent);
}
.cmdk-item.selected {
  background: rgba(94, 201, 255, 0.1);
  color: var(--text);
}
.cmdk-item.selected > i:first-child {
  color: var(--accent);
}
.cmdk-item.selected .cmdk-item-enter {
  opacity: 1;
}
.cmdk-item.disabled {
  opacity: 0.55;
  cursor: default;
}

/* Footer */
.cmdk-foot {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem;
  border-top: 1px solid var(--glow-card-border);
  font-size: 0.68rem;
  color: var(--text-subtle);
}
.cmdk-foot kbd {
  font-family: "Poppins", sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 5px;
  margin-right: 3px;
  border-radius: 4px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.cmdk-cal-trigger {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Transition */
.cmdk-enter-active {
  transition: opacity 0.2s ease;
}
.cmdk-leave-active {
  transition: opacity 0.15s ease;
}
.cmdk-enter-active .cmdk {
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.26s ease;
}
.cmdk-leave-active .cmdk {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.cmdk-enter-from,
.cmdk-leave-to {
  opacity: 0;
}
.cmdk-enter-from .cmdk,
.cmdk-leave-to .cmdk {
  opacity: 0;
  transform: scale(0.97) translateY(-8px);
}

@media (max-width: 600px) {
  .cmdk-overlay {
    padding: 8vh 0.75rem 0.75rem;
  }
  .cmdk-foot {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cmdk-enter-active .cmdk,
  .cmdk-leave-active .cmdk {
    transition: opacity 0.15s ease;
  }
  .cmdk-enter-from .cmdk,
  .cmdk-leave-to .cmdk {
    transform: none;
  }
  .np-eq.playing span {
    animation: none;
  }
}
</style>

<style>
/* Light-theme tweaks for kbd chips (unscoped: reads data-theme on <html>) */
[data-theme="light"] .cmdk-esc,
[data-theme="light"] .cmdk-foot kbd {
  background: rgba(53, 107, 208, 0.06);
  border-color: rgba(53, 107, 208, 0.16);
}
[data-theme="light"] .cmdk-overlay {
  background: rgba(180, 200, 230, 0.4);
}
</style>
