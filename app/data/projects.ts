export interface Project {
  slug: string
  title: string
  year: string
  role: string
  tagline: string
  stack: string[]
  live?: string
  demo?: string
  images: string[]
}

const shots = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/work/${slug}/${String(i + 1).padStart(2, '0')}.webp`)

export const projects: Project[] = [
  {
    slug: 'badminton-records',
    title: 'Badminton Records',
    year: '2026',
    role: 'Full-stack',
    tagline: 'Match archive for my badminton club: rally-by-rally tagging, a live scoreboard over YouTube, and an ffmpeg highlight cutter.',
    stack: ['Nuxt 4', 'Supabase', 'Tailwind', 'ffmpeg'],
    live: 'https://badminton-records.vercel.app',
    demo: 'https://www.youtube.com/watch?v=sbGkDmcfCKE',
    images: shots('badminton-records', 8),
  },
  {
    slug: 'mobilit-eirb',
    title: "Mobilit'Eirb",
    year: '2026',
    role: 'Lead, full-stack',
    tagline: 'A carbon footprint calculator for student mobility trips, built by a team of five I led at ENSEIRB-MATMECA.',
    stack: ['Nuxt', 'Express', 'PostgreSQL', 'Docker'],
    live: 'https://mobilit.eirb.fr',
    demo: 'https://www.youtube.com/watch?v=1fIJ63elEfI',
    images: shots('mobilit-eirb', 7),
  },
  {
    slug: 'portfolio',
    title: 'This site',
    year: '2026',
    role: 'Everything',
    tagline: 'Made of its own source code. Hold space to look inside.',
    stack: ['Nuxt 4', 'three.js WebGPU', 'GSAP', 'TSL'],
    live: 'https://timlacault.dev',
    images: shots('portfolio', 9),
  },
]
