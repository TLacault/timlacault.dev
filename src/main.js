import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const REVEAL_DURATION = 900;
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

app.directive("reveal", {
  mounted(el) {
    // Read delay set via inline --reveal-delay custom property
    const delay = el.style.getPropertyValue("--reveal-delay") || "0ms";
    const d = `${REVEAL_DURATION}ms`;
    const e = REVEAL_EASE;

    // Apply initial hidden state via inline styles so they cannot be overridden
    // by any component-level CSS rule regardless of specificity or source order.
    el.style.opacity = "0";
    el.style.transform = "translateY(22px)";
    el.style.filter = "blur(5px)";
    el.style.transition = [
      `opacity ${d} ${e} ${delay}`,
      `transform ${d} ${e} ${delay}`,
      `filter ${d} ${e} ${delay}`,
    ].join(", ");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.filter = "blur(0px)";

          // After the animation finishes, remove inline styles so CSS hover
          // transitions (transform, box-shadow, etc.) work normally again.
          let done = false;
          const cleanup = () => {
            if (done) return;
            done = true;
            el.style.removeProperty("opacity");
            el.style.removeProperty("transform");
            el.style.removeProperty("filter");
            el.style.removeProperty("transition");
            el.removeEventListener("transitionend", onEnd);
          };
          const onEnd = (evt) => {
            if (evt.propertyName === "opacity") cleanup();
          };
          el.addEventListener("transitionend", onEnd);
          // Fallback if transitionend never fires (reduced-motion, tab hidden…)
          setTimeout(cleanup, REVEAL_DURATION + (parseFloat(delay) || 0) + 150);

          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -18% 0px" }
    );
    observer.observe(el);
  },
});

app.use(router).mount("#app");
