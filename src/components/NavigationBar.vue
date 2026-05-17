<script>
export default {
  name: "NavigationBar",
  data() {
    return {
      theme: localStorage.getItem("theme") || "dark",
      menuOpen: false,
      scrolled: false,
    };
  },
  mounted() {
    document.documentElement.setAttribute("data-theme", this.theme);
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
      const next = this.theme === "dark" ? "light" : "dark";
      this.theme = next;
      localStorage.setItem("theme", next);

      if (document.startViewTransition && e?.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        document.documentElement.style.setProperty(
          "--vt-x",
          `${Math.round(rect.left + rect.width / 2)}px`
        );
        document.documentElement.style.setProperty(
          "--vt-y",
          `${Math.round(rect.top + rect.height / 2)}px`
        );
        // Suppress element-level transitions while the overlay animates
        document.documentElement.classList.add("vt-running");
        const t = document.startViewTransition(() => {
          document.documentElement.setAttribute("data-theme", next);
        });
        t.finished.finally(() => {
          document.documentElement.classList.remove("vt-running");
        });
      } else {
        document.documentElement.setAttribute("data-theme", next);
      }
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
    <!-- Logo -->
    <router-link to="/" class="logo" @click="closeMenu">
      <span class="logo-text">Tim</span>
    </router-link>

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

    <!-- Mobile right: lang + theme + burger -->
    <div class="mobile-right">
      <button
        class="lang-toggle block-btn"
        @click="toggleLocale"
        :aria-label="
          $locale.locale === 'en' ? $t('nav.switchToFr') : $t('nav.switchToEn')
        "
      >
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
    </div>
  </Transition>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
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

.logo {
  display: flex;
  align-items: center;
  z-index: 1;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
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

/* Responsive breakpoint */
@media (max-width: 768px) {
  .nav-links,
  .nav-right {
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
</style>
