import { reactive } from "vue";

// Single source of truth for the light/dark theme so the navbar and the command
// palette stay in sync instead of duplicating the toggle logic. Mirrors the
// reactive-module pattern used in src/plugins/i18n.js.
export const themeState = reactive({
  theme: localStorage.getItem("theme") || "dark",
});

// Toggle dark/light. When an origin element is provided (the clicked button),
// animate the change with a circular View-Transition reveal centered on it.
export function toggleTheme(originEl) {
  const next = themeState.theme === "dark" ? "light" : "dark";
  themeState.theme = next;
  localStorage.setItem("theme", next);

  if (document.startViewTransition && originEl) {
    const rect = originEl.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--vt-x",
      `${Math.round(rect.left + rect.width / 2)}px`
    );
    document.documentElement.style.setProperty(
      "--vt-y",
      `${Math.round(rect.top + rect.height / 2)}px`
    );
    // Suppress element-level transitions while the overlay animates.
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
}
