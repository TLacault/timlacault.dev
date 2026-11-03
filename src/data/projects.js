import defaultPreview from "@/assets/projects/default.png";

// Every image under assets/projects/<slug>/ belongs to that project's gallery.
const imageContext = require.context(
  "@/assets/projects",
  true,
  // eslint-disable-next-line prettier/prettier
  /^\.\/[^/]+\/.+\.(png|jpe?g|webp|gif|avif|svg)$/i,
);

function imagesFor(slug) {
  const prefix = `./${slug}/`;
  const keys = imageContext
    .keys()
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return keys.length ? keys.map(imageContext) : [defaultPreview];
}

const entries = [
  {
    id: 5,
    slug: "badminton-records",
    title: "Badminton Records",
    year: "2026",
    role: "Full-stack",
    status: "In Progress",
    tagline:
      "Match archive for my badminton club: rally-by-rally tagging, a live scoreboard over YouTube, and an ffmpeg highlight cutter.",
    stack: ["Nuxt 4", "Supabase", "Tailwind", "ffmpeg"],
    live: "https://badminton-records.vercel.app",
    demo: "https://www.youtube.com/watch?v=sbGkDmcfCKE",
    component: () => import("@/projects/badminton-records/index.vue"),
  },
  {
    id: 6,
    slug: "mobilit-eirb",
    title: "Mobilit'Eirb",
    year: "2026",
    role: "Lead / Full-stack",
    status: "Live",
    tagline:
      "School project: a carbon footprint calculator for student mobility trips, built by a team of five at ENSEIRB-MATMECA.",
    stack: ["Nuxt", "Express", "PostgreSQL", "Docker"],
    live: "https://mobilit.eirb.fr",
    demo: "https://www.youtube.com/watch?v=1fIJ63elEfI",
    component: () => import("@/projects/mobilit-eirb/index.vue"),
  },
  {
    id: 1,
    slug: "portfolio",
    title: "Portfolio",
    year: "2025",
    role: "Full-stack",
    status: "Live",
    tagline:
      "This very website — built with Vue 3, smooth scroll, and a lot of glow.",
    stack: ["Vue 3", "CSS", "Lenis"],
    live: "https://timlacault.dev",
    component: () => import("@/projects/portfolio/index.vue"),
  },
];

// `images` is the gallery (alphabetical, default image when the folder is
// empty); `preview` is its first image, used on the card. Optional `live` is
// the deployed site's URL and `demo` a YouTube URL; both show as buttons under
// the gallery, and `demo` is also the gallery's first slide (the card keeps
// `preview`).
export const projects = entries.map((p) => {
  const images = imagesFor(p.slug);
  return { ...p, images, preview: images[0] };
});
