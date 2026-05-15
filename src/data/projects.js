import defaultPreview from "@/assets/projects/default.png";

export const projects = [
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
    preview: defaultPreview,
    component: () => import("@/projects/portfolio/index.vue"),
  },
  {
    id: 2,
    slug: "devshell",
    title: "DevShell",
    year: "2024",
    role: "Backend / CLI",
    status: "In Progress",
    tagline:
      "A terminal emulator in the browser with pluggable commands and session state.",
    stack: ["Node.js", "xterm.js", "WebSockets"],
    preview: defaultPreview,
    component: () => import("@/projects/devshell/index.vue"),
  },
  {
    id: 3,
    slug: "flowboard",
    title: "FlowBoard",
    year: "2024",
    role: "Frontend",
    status: "Live",
    tagline:
      "Kanban board with drag-and-drop, real-time sync, and keyboard shortcuts.",
    stack: ["React", "DnD Kit", "Supabase"],
    preview: defaultPreview,
    component: () => import("@/projects/flowboard/index.vue"),
  },
  {
    id: 4,
    slug: "netscan",
    title: "NetScan",
    year: "2023",
    role: "Systems / C",
    status: "Archived",
    tagline:
      "Lightweight network scanner written in C. Detects hosts, ports, and latency.",
    stack: ["C", "libpcap", "POSIX"],
    preview: defaultPreview,
    component: () => import("@/projects/netscan/index.vue"),
  },
];
