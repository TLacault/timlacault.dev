<script>
export default {
  name: "NavigationBar",
  data() {
    return {
      theme: localStorage.getItem("theme") || "dark",
    };
  },
  mounted() {
    document.documentElement.setAttribute("data-theme", this.theme);
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme);
    },
  },
  computed: {
    calConfig() {
      return {
        layout: "month_view",
        theme: this.theme,
      };
    },
  },
};

// Callendar
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
  <nav class="slide-in">
    <router-link to="/" class="logo">
      <!-- <div class="img-container">
        <img src="@/assets/logo_white.png" alt="Logo" v-if="theme === 'dark'" />
        <img src="@/assets/logo_black.png" alt="Logo" v-else />
      </div> -->
      <span class="logo-text">Tim</span>
    </router-link>

    <div class="nav-links block">
      <router-link class="block-btn" to="/">Home</router-link>
      <router-link class="block-btn" to="/project">Projects</router-link>
      <router-link class="block-btn" to="/freelance">Freelance</router-link>
      <router-link class="block-btn" to="/contact">Contact</router-link>
    </div>

    <div class="nav-right">
      <div class="call block">
        <div
          class="call-btn block-btn"
          data-cal-link="tim-lacault/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","theme":"auto"}'
        >
          <p>Book a Call</p>
          <i class="ri-calendar-event-line"></i>
        </div>
      </div>
      <button class="theme-toggle block" @click="toggleTheme">
        <span v-if="theme === 'dark'"><i class="ri-moon-clear-fill"></i></span>
        <span v-else><i class="ri-sun-fill"></i></span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90vw;
  margin-top: 40px;

  opacity: 0;
  animation-delay: 0.5s;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;

  /* & .img-container {
    width: 30px;
    aspect-ratio: 1;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  } */

  & .logo-text {
    font-family: "Cal Sans", sans-serif;
    font-size: 2rem;
    letter-spacing: 1px;
    margin-top: 1px;

    /* border-radius: 5px; */
    /* background: linear-gradient(40deg, var(--primary), var(--text));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;

    transition: all 0.3s ease-in-out;
    &:hover {
      text-shadow: -2px 0px 5px var(--primary), 2px 0px 5px var(--text);
    } */
  }
}

.nav-links {
  position: absolute;
  display: flex;
  left: 50%;
  transform: translateX(-50%);

  & a.router-link-exact-active {
    background-color: var(--primary);
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;

  & .call-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  & .theme-toggle {
    padding: 10px;
    font-size: 1.4rem;

    &:hover {
      background-color: var(--text);
      color: var(--background);
      border-radius: 10px;
    }
  }
}
</style>
