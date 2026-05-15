import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.directive("reveal", {
  mounted(el) {
    const delay = el.style.getPropertyValue("--reveal-delay") || "0ms";
    el.style.setProperty("--reveal-delay", delay);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
  },
});

app.use(router).mount("#app");
