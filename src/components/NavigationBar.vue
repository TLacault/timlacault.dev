<script>
import logoBlack from "@/assets/logo_black.png";
import logoWhite from "@/assets/logo_white.png";
import { themeState, toggleTheme } from "@/stores/theme";
import {
  presenceState,
  startPresence,
  fmtTime,
  statusLabel,
  dotClass,
  githubText,
  relativeTime,
} from "@/stores/presence";

export default {
  name: "NavigationBar",
  data() {
    return {
      logoBlack,
      logoWhite,
      menuOpen: false,
      scrolled: false,
      pres: presenceState,
    };
  },
  computed: {
    theme() {
      return themeState.theme;
    },
    presTime() {
      return fmtTime(this.pres.nowTs);
    },
    presStatus() {
      return statusLabel(this.$t, this.pres.nowTs);
    },
    presDot() {
      return dotClass(this.pres.discordStatus, this.pres.nowTs);
    },
    presGithub() {
      return githubText(this.$t, this.pres.github);
    },
  },
  mounted() {
    startPresence();
    this._onScroll = () => {
      this.scrolled = window.scrollY > 30;
    };
    window.addEventListener("scroll", this._onScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this._onScroll);
  },
  methods: {
    toggleTheme(e) {
      toggleTheme(e?.currentTarget);
    },
    openPalette() {
      this.closeMenu();
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    },
    toggleLocale() {
      const next = this.$locale.locale === "en" ? "fr" : "en";
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.style.transition = "opacity 0.15s ease";
        appEl.style.opacity = "0";
      }
      setTimeout(() => {
        this.$setLocale(next);
        if (appEl) {
          appEl.style.opacity = "1";
          setTimeout(() => {
            appEl.style.transition = "";
            appEl.style.opacity = "";
          }, 200);
        }
      }, 160);
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    presRelative(at) {
      return relativeTime(this.$t, at, this.pres.nowTs);
    },
  },
};

// Cal.com embed
let Cal;
(function (C, A, L) {
  let p = function (a, ar) {
    a.q.push(ar);
  };
  let d = C.document;
  C.Cal =
    C.Cal ||
    function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () {
          p(api, arguments);
        };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  Cal = C.Cal;
})(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "30min", { origin: "https://cal.com" });
Cal.ns["30min"]("ui", {
  theme: "auto",
  cssVarsPerTheme: {
    light: { "cal-brand": "#526fff" },
    dark: { "cal-brand": "#93beff" },
  },
  hideEventTypeDetails: false,
  layout: "month_view",
});
</script>

<template>
  <nav class="slide-in" :class="{ 'menu-open': menuOpen, scrolled: scrolled }">
    <!-- Left: logo + command palette -->
    <div class="nav-left">
      <router-link to="/" class="logo" @click="closeMenu">
        <img
          :src="theme === 'dark' ? logoWhite : logoBlack"
          class="logo-img"
          alt=""
          aria-hidden="true"
        />
        <span class="logo-text">Tim</span>
      </router-link>
      <button
        class="cmdk-btn block-btn"
        @click="openPalette"
        :aria-label="$t('cmd.open')"
      >
        <i class="ri-search-line"></i>
        <span class="cmdk-hint"><kbd>⌘</kbd><kbd>K</kbd></span>
      </button>
    </div>

    <!-- Desktop nav links -->
    <div class="nav-links">
      <router-link class="block-btn" to="/">{{ $t("nav.home") }}</router-link>
      <router-link class="block-btn" to="/project">{{
        $t("nav.projects")
      }}</router-link>
      <router-link class="block-btn" to="/freelance">{{
        $t("nav.freelance")
      }}</router-link>
      <router-link class="block-btn" to="/contact">{{
        $t("nav.contact")
      }}</router-link>
    </div>

    <!-- Desktop right -->
    <div class="nav-right">
      <div
        class="call-btn block-btn"
        data-cal-link="tim-lacault/30min"
        data-cal-namespace="30min"
        data-cal-config='{"layout":"month_view","theme":"auto"}'
      >
        <span>{{ $t("nav.bookCall") }}</span>
        <i class="ri-calendar-event-line"></i>
      </div>
      <button
        class="lang-toggle block-btn"
        @click="toggleLocale"
        :aria-label="
          $locale.locale === 'en' ? $t('nav.switchToFr') : $t('nav.switchToEn')
        "
      >
        <i class="ri-translate-2"></i>
        <span class="lang-label">{{
          $locale.locale === "en" ? "FR" : "EN"
        }}</span>
      </button>
      <button
        class="theme-toggle block-btn"
        @click="toggleTheme"
        :aria-label="
          theme === 'dark' ? $t('nav.switchToLight') : $t('nav.switchToDark')
        "
      >
        <i v-if="theme === 'dark'" class="ri-moon-clear-fill"></i>
        <i v-else class="ri-sun-fill"></i>
      </button>
    </div>

    <!-- Mobile right: search + lang + theme + burger -->
    <div class="mobile-right">
      <button
        class="cmdk-toggle block-btn"
        @click="openPalette"
        :aria-label="$t('cmd.open')"
      >
        <i class="ri-search-line"></i>
      </button>
      <button
        class="lang-toggle block-btn"
        @click="toggleLocale"
        :aria-label="
          $locale.locale === 'en' ? $t('nav.switchToFr') : $t('nav.switchToEn')
        "
      >
        <i class="ri-translate-2"></i>
        <span class="lang-label">{{
          $locale.locale === "en" ? "FR" : "EN"
        }}</span>
      </button>
      <button
        class="theme-toggle block-btn"
        @click="toggleTheme"
        :aria-label="
          theme === 'dark' ? $t('nav.switchToLight') : $t('nav.switchToDark')
        "
      >
        <i v-if="theme === 'dark'" class="ri-moon-clear-fill"></i>
        <i v-else class="ri-sun-fill"></i>
      </button>
      <button
        class="burger block-btn"
        @click="toggleMenu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="menuOpen"
      >
        <span class="burger-line" :class="{ open: menuOpen }"></span>
        <span class="burger-line" :class="{ open: menuOpen }"></span>
        <span class="burger-line" :class="{ open: menuOpen }"></span>
      </button>
    </div>
  </nav>

  <!-- Mobile menu panel -->
  <Transition name="mobile-menu">
    <div v-if="menuOpen" class="mobile-menu-panel" @click.self="closeMenu">
      <div class="mobile-menu-inner">
        <router-link class="mobile-link" to="/" @click="closeMenu">
          <i class="ri-home-4-line"></i>
          <span>{{ $t("nav.home") }}</span>
        </router-link>
        <router-link class="mobile-link" to="/project" @click="closeMenu">
          <i class="ri-folder-line"></i>
          <span>{{ $t("nav.projects") }}</span>
        </router-link>
        <router-link class="mobile-link" to="/freelance" @click="closeMenu">
          <i class="ri-briefcase-line"></i>
          <span>{{ $t("nav.freelance") }}</span>
        </router-link>
        <router-link class="mobile-link" to="/contact" @click="closeMenu">
          <i class="ri-mail-line"></i>
          <span>{{ $t("nav.contact") }}</span>
        </router-link>
        <div class="mobile-menu-footer">
          <div
            class="mobile-call-btn"
            data-cal-link="tim-lacault/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view","theme":"auto"}'
            @click="closeMenu"
          >
            <i class="ri-calendar-event-line"></i>
            <span>{{ $t("nav.bookCall") }}</span>
          </div>
        </div>
      </div>

      <!-- Live presence — separate island beneath the menu -->
      <div class="mobile-presence">
        <div class="mp-head">
          <span class="dot live" :class="presDot"></span>
          <span>{{ $t("presence.label") }}</span>
        </div>

        <div class="mp-row">
          <span class="mp-ico grape">🍇</span>
          <div class="mp-body">
            <span class="mp-main">
              {{ presTime }}
              <span class="mp-muted">· {{ $t("presence.bordeaux") }}</span>
            </span>
            <span class="mp-sub">{{ presStatus }}</span>
          </div>
        </div>

        <a
          v-if="pres.github"
          class="mp-row link"
          :href="pres.github.url"
          target="_blank"
          rel="noopener"
          @click="closeMenu"
        >
          <span class="mp-ico"><i class="ri-github-line"></i></span>
          <div class="mp-body">
            <span class="mp-main">{{ presGithub }}</span>
            <span class="mp-sub">{{ presRelative(pres.github.at) }}</span>
          </div>
          <i class="ri-arrow-right-up-line mp-go"></i>
        </a>

        <div v-if="pres.spotify" class="mp-row">
          <img class="mp-art" :src="pres.spotify.art" alt="" />
          <div class="mp-body">
            <span class="mp-main">{{ pres.spotify.song }}</span>
            <span class="mp-sub">{{ pres.spotify.artist }}</span>
          </div>
          <i class="ri-spotify-fill mp-sp"></i>
        </div>
        <div v-else class="mp-row">
          <span class="mp-ico"><i class="ri-headphone-line"></i></span>
          <span class="mp-main mp-muted">{{
            $t("presence.notListening")
          }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  /* 3 balanced zones: side columns are equal (1fr) so the center links pill
     stays perfectly centered and can never be overlapped by either side. */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 90vw;
  max-width: 1100px;
  margin-top: 24px;
  z-index: 200;
  opacity: 0;
  animation-delay: 0.5s;
  border-radius: 18px;
  padding: 6px 10px;
  border: 1px solid transparent;
}

nav.scrolled {
  background: rgba(5, 9, 15, 0.68);
  border-color: rgba(94, 201, 255, 0.07);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
  margin-top: 10px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: start;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
}
.logo-img {
  height: 26px;
  width: auto;
  display: block;
  object-fit: contain;
}
.logo-text {
  font-family: "Cal Sans", sans-serif;
  font-size: 2rem;
  letter-spacing: 1px;
  color: var(--text);
}

/* Shared pill style — desktop nav groups + mobile right */
.nav-links,
.nav-right,
.mobile-right {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  outline: 1px solid rgba(94, 201, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(94, 201, 255, 0.05) inset;
  backdrop-filter: blur(12px);
}
.nav-links {
  justify-self: center;
}
.nav-right {
  justify-self: end;
}
.nav-links .block-btn,
.nav-right .block-btn,
.mobile-right .block-btn {
  font-family: "Poppins", sans-serif;
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.55;
  border-radius: 8px;
  padding: 0.45rem 1.1rem;
  transition: opacity 0.2s ease, background 0.22s ease, box-shadow 0.22s ease,
    color 0.2s ease;
}
.nav-links .block-btn:hover,
.nav-right .block-btn:hover,
.mobile-right .block-btn:hover {
  opacity: 1;
  background: rgba(94, 201, 255, 0.07);
  box-shadow: 0 0 0 1px rgba(94, 201, 255, 0.1);
}

/* Mobile-right buttons: icon-only, compact square */
.mobile-right .block-btn {
  padding: 0.45rem 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-links a.router-link-exact-active {
  background: rgba(47, 102, 202, 0.22);
  border: 1px solid rgba(94, 201, 255, 0.2);
  color: var(--accent);
  opacity: 1;
  box-shadow: 0 0 14px rgba(94, 201, 255, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
}

.call-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.call-btn i {
  font-size: 0.95rem;
}
.theme-toggle,
.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 1.05rem;
  color: var(--text);
  opacity: 0.55;
}
.theme-toggle:hover,
.lang-toggle:hover {
  opacity: 1;
  color: var(--accent);
}

.lang-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

/* ⌘K command-palette trigger — standalone search pill beside the logo */
.cmdk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.7rem;
  border-radius: 10px;
  font-family: "Poppins", sans-serif;
  color: var(--text);
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.04);
  outline: 1px solid rgba(94, 201, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(94, 201, 255, 0.05) inset;
  backdrop-filter: blur(12px);
  transition: opacity 0.2s ease, background 0.22s ease, color 0.2s ease,
    box-shadow 0.22s ease;
}
.cmdk-btn:hover {
  opacity: 1;
  color: var(--accent);
  background: rgba(94, 201, 255, 0.07);
  box-shadow: 0 0 0 1px rgba(94, 201, 255, 0.12);
}
.cmdk-btn i {
  font-size: 1rem;
}
.cmdk-hint {
  display: flex;
  gap: 2px;
}
.cmdk-hint kbd {
  font-family: "Poppins", sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  padding: 3px 4px;
  min-width: 16px;
  text-align: center;
  border-radius: 4px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.cmdk-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: var(--text);
  opacity: 0.55;
}
.cmdk-toggle:hover {
  opacity: 1;
  color: var(--accent);
}

/* Burger button */
.mobile-right {
  display: none;
}
.burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  cursor: pointer;
}
.burger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--text);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease,
    width 0.3s ease;
}
.burger-line.open:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.burger-line.open:nth-child(2) {
  opacity: 0;
  width: 0;
}
.burger-line.open:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile menu panel */
.mobile-menu-panel {
  position: fixed;
  inset: 0;
  top: 80px;
  z-index: 150;
  padding: 0 5vw;
  pointer-events: none;
}
.mobile-menu-inner {
  pointer-events: all;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(5, 9, 15, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(94, 201, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(244, 246, 250, 0.7);
  transition: background 0.2s ease, color 0.2s ease;
}
.mobile-link i {
  font-size: 1.2rem;
  color: var(--accent);
  opacity: 0.7;
}
.mobile-link:hover,
.mobile-link.router-link-exact-active {
  background: rgba(94, 201, 255, 0.07);
  color: var(--text);
}
.mobile-link.router-link-exact-active i {
  opacity: 1;
}
.mobile-menu-footer {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

/* Live presence — detached island beneath the burger menu */
.mobile-presence {
  pointer-events: all;
  margin-top: 0.6rem;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(5, 9, 15, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(94, 201, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.mp-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.25rem 0.35rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}
.mp-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.25rem;
  border-radius: 10px;
  font-family: "Poppins", sans-serif;
}
.mp-row.link {
  transition: background 0.2s ease;
}
.mp-row.link:active {
  background: rgba(94, 201, 255, 0.08);
}
.mp-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  font-size: 1.05rem;
  color: var(--text-muted);
  background: var(--glow-card-border);
}
.mp-art {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.mp-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.mp-main {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mp-muted {
  color: var(--text-muted);
  font-weight: 400;
}
.mp-sub {
  font-size: 0.7rem;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mp-go {
  font-size: 0.95rem;
  color: var(--text-faint);
  flex-shrink: 0;
}
.mp-sp {
  font-size: 1.15rem;
  color: #1db954;
  flex-shrink: 0;
}
/* live status dot (matches the floating widget) */
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
.mobile-call-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-call-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Menu transition */
.mobile-menu-enter-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Responsive breakpoint — collapse to the burger menu while there's still room,
   so the full desktop nav never gets cramped. */
@media (max-width: 900px) {
  nav {
    display: flex;
    justify-content: space-between;
  }
  .nav-links,
  .nav-right,
  .cmdk-btn {
    display: none;
  }
  .mobile-right {
    display: flex;
  }
  /* burger lines need to be visible inside the pill button */
  .burger {
    width: 36px;
    height: 34px;
    padding: 0.45rem 0.55rem;
  }
}
</style>

<style>
/* Scrolled nav — light theme */
[data-theme="light"] nav.scrolled {
  background: rgba(240, 244, 250, 0.82);
  border-color: rgba(53, 107, 208, 0.1);
  box-shadow: 0 4px 32px rgba(53, 107, 208, 0.1);
}

/* Nav — light theme overrides */
[data-theme="light"] .nav-links,
[data-theme="light"] .nav-right,
[data-theme="light"] .mobile-right {
  background: rgba(255, 255, 255, 0.7);
  outline: 1px solid rgba(53, 107, 208, 0.14);
  box-shadow: 0 4px 20px rgba(53, 107, 208, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
}
[data-theme="light"] .nav-links .block-btn,
[data-theme="light"] .nav-right .block-btn,
[data-theme="light"] .mobile-right .block-btn {
  color: rgba(5, 7, 10, 0.7);
}
[data-theme="light"] .nav-links .block-btn:hover,
[data-theme="light"] .nav-right .block-btn:hover,
[data-theme="light"] .mobile-right .block-btn:hover {
  background: rgba(53, 107, 208, 0.07);
  box-shadow: 0 0 0 1px rgba(53, 107, 208, 0.12);
  color: rgb(5, 7, 10);
}
[data-theme="light"] .nav-links a.router-link-exact-active {
  background: rgba(53, 107, 208, 0.12);
  border: 1px solid rgba(53, 107, 208, 0.22);
  color: var(--primary);
  box-shadow: 0 0 12px rgba(53, 107, 208, 0.1);
}

/* ⌘K hint — light theme */
[data-theme="light"] .cmdk-hint kbd {
  background: rgba(53, 107, 208, 0.06);
  border-color: rgba(53, 107, 208, 0.16);
}
[data-theme="light"] .cmdk-btn {
  background: rgba(255, 255, 255, 0.7);
  outline: 1px solid rgba(53, 107, 208, 0.14);
  box-shadow: 0 4px 20px rgba(53, 107, 208, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
}
[data-theme="light"] .cmdk-btn:hover {
  background: rgba(53, 107, 208, 0.07);
  box-shadow: 0 0 0 1px rgba(53, 107, 208, 0.12);
}

/* Mobile menu — light theme */
[data-theme="light"] .mobile-menu-inner {
  background: rgba(240, 244, 252, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
[data-theme="light"] .mobile-link {
  color: rgba(5, 7, 10, 0.7);
}
[data-theme="light"] .mobile-link:hover,
[data-theme="light"] .mobile-link.router-link-exact-active {
  background: rgba(53, 107, 208, 0.08);
  color: rgb(5, 7, 10);
}
[data-theme="light"] .mobile-menu-footer {
  border-top-color: rgba(0, 0, 0, 0.08);
}
[data-theme="light"] .mobile-presence {
  background: rgba(240, 244, 252, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .dot.live::after {
    animation: none;
  }
}
</style>
