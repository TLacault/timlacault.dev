import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/LandingView.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingView,
  },
  {
    path: "/project",
    name: "project",
    component: () => import("../views/ProjectView.vue"),
  },
  {
    path: "/freelance",
    name: "freelance",
    component: () => import("../views/FreelanceView.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach(() => {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
});

export default router;
