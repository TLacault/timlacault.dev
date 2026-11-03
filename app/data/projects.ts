export interface Project {
  slug: string
  title: string
  year: string
  role: string
  kind: string
  tagline: string
  stack: string[]
  live?: string
  demo?: string
  images: string[]
  sections: { title: string, body?: string, points?: string[] }[]
}

const shots = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/work/${slug}/${String(i + 1).padStart(2, '0')}.webp`)

export const projects: Project[] = [
  {
    slug: 'badminton-records',
    title: 'Badminton Records',
    year: '2026',
    role: 'Full-stack',
    kind: 'Side project',
    tagline: 'Match archive for my badminton club: rally-by-rally tagging, a live scoreboard over YouTube, and an ffmpeg highlight cutter.',
    stack: ['Nuxt 4', 'Supabase', 'Tailwind', 'ffmpeg'],
    live: 'https://badminton-records.vercel.app',
    demo: 'https://www.youtube.com/watch?v=sbGkDmcfCKE',
    images: shots('badminton-records', 8),
    sections: [
      { title: 'Overview', body: 'A match archive for U.S. Talence Badminton, the club I play at. We film our games and post them on YouTube. This site turns those videos into matches you can browse: every rally is tagged, the score sits on top of the video, and the best points can be cut into a highlight film.' },
      { title: 'What it does', points: [
        "Imports the club's YouTube uploads as matches. Re-running the import is safe and never overwrites a match that's already been tagged.",
        'A keyboard-driven tagger for logging a match rally by rally. Every key can be rebound, and it handles AZERTY layouts properly.',
        "A scoreboard drawn over the video that follows playback, so it never shows a score the viewer hasn't reached yet.",
        "Player lookup against the French federation's public records, widening its search from our roster to the club to all of France.",
        'Reel: turns starred rallies into a highlight film, with a soundtrack trimmed to its loudest section, rendered by ffmpeg.',
      ] },
      { title: 'Architecture', body: 'Nuxt 4 with Supabase for auth and Postgres, styled with Tailwind 4. The scoring engine and the reel model live in shared/ as plain TypeScript with no framework code, so Vitest tests them without a browser or a database. The reel is a single ReelProject object: the preview, the saved .reel file and the render request all read it, so what you preview is exactly what gets rendered.' },
      { title: 'The hard parts', points: [
        "YouTube's fullscreen button only fullscreens the iframe and leaves the scoreboard behind. A fullscreenchange handler moves fullscreen to the wrapper around the video instead.",
        'ffmpeg filter graphs fail late and with vague errors. The arguments are built by a pure function and checked in unit tests before anything is spawned.',
        "Long downloads and renders run as background jobs the browser polls, so reloading the page doesn't kill an eleven-minute export.",
        'The palette has only two colours, club crimson and ink, and still passes contrast checks in light and dark themes.',
      ] },
    ],
  },
  {
    slug: 'mobilit-eirb',
    title: "Mobilit'Eirb",
    year: '2026',
    role: 'Founder',
    kind: 'Startup',
    tagline: 'My startup. It measures the carbon footprint of student trips, and began as a school project I led with a team of five at ENSEIRB-MATMECA.',
    stack: ['Nuxt', 'Express', 'PostgreSQL', 'Docker'],
    live: 'https://mobilit.eirb.fr',
    demo: 'https://www.youtube.com/watch?v=1fIJ63elEfI',
    images: shots('mobilit-eirb', 7),
    sections: [
      { title: 'Overview', body: 'Students record the trips of their mobility period abroad (a semester, an internship) and the app works out the carbon footprint of each leg. They can compare alternative routes, and the school gets aggregated data for its annual carbon report. It started as my end-of-year project at ENSEIRB-MATMECA, built by a team of five, and became my startup.' },
      { title: 'My role', body: 'I led the project and wrote most of the commits. I set up the architecture, the Docker environment and the CI/CD pipeline, and built features across the frontend and the API.' },
      { title: 'Architecture', body: "Three Docker services: a Nuxt frontend served by Nginx, an Express REST API using Prisma, and PostgreSQL with PostGIS. On every push to main, GitHub Actions builds the images and pushes them to the school's registry. Sign-in goes through the school's identity provider with OpenID Connect, so the app never stores a password." },
      { title: 'How emissions are computed', points: [
        'Distance and duration come from the Google Routes API for road and transit, and from the haversine formula for flights.',
        "Emissions come from ADEME's Impact CO2 API, which uses the official French emission factors (Base Carbone).",
        "Results are stored and only recalculated when a step's endpoints or transport mode change, which keeps Google API usage within its quota.",
        'Mobilities export as JSON, CSV, or a styled PDF.',
      ] },
      { title: 'The hard parts', points: [
        "SSR inside Docker: the frontend container couldn't reach the backend at localhost, so the app moved to client-side rendering.",
        "Google Routes doesn't always honour the requested transit mode. allowedTravelModes is restricted and distance checks catch absurd results.",
        "A column added after deployment: queries fall back to running without it, so environments that hadn't migrated kept working.",
      ] },
    ],
  },
]

// Sites built for local businesses (web_agency/clients), hero screenshots in /clients/<slug>.webp.
const clientList: { slug: string, name: string, trade: string }[] = [
  { slug: 'latelier-de-christophe', name: "L'Atelier de Christophe", trade: 'Hair salon' },
  { slug: 'bikindoor', name: "Bik'Indoor", trade: 'Indoor cycling' },
  { slug: 'chez-agathe', name: 'Chez Agathe', trade: 'Brasserie' },
  { slug: 'lbc-boxing', name: 'Legacy Boxing Club', trade: 'Boxing club' },
  { slug: 'fournil-de-birdy', name: 'Le Fournil de Birdy', trade: 'Bakery' },
  { slug: 'le-de-cafeine', name: 'Le Dé Caféine', trade: 'Board-game café' },
  { slug: 'nguyen-nails', name: 'Nguyen Nails', trade: 'Nail salon' },
  { slug: 'gmb-thermique', name: 'GMB Thermique', trade: 'Plumbing and heating' },
  { slug: 'la-terrasse-doree', name: 'La Terrasse Dorée', trade: 'Restaurant' },
  { slug: 'mon-barbier-2', name: 'Mon Barbier', trade: 'Barber' },
  { slug: 'institut-sahyla-studio', name: 'Sahyla Studio', trade: 'Beauty institute' },
  { slug: 'vintage-grillades', name: 'Vintage Grillades', trade: 'Grill' },
  { slug: 'au-137-coiffeur-barbier', name: 'Au 137', trade: 'Barber' },
  { slug: 'mlx-training-club', name: 'MLX Training Club', trade: 'Gym' },
  { slug: 'fournil-de-pacaris', name: 'Le Fournil de Pacaris', trade: 'Bakery' },
  { slug: 'coiffeur-instinctif', name: "Instinc'tif", trade: 'Hair salon' },
  { slug: 'restaurant-nem-mekong', name: 'Nem Mékong', trade: 'Restaurant' },
  { slug: 'tpt-plomberie', name: 'TPT Plomberie', trade: 'Plumber' },
  { slug: 'la-ferme-du-compostelle', name: 'La Ferme du Compostelle', trade: 'Restaurant' },
  { slug: 'see-you', name: 'See You', trade: 'Restaurant' },
  { slug: 'hair-look-coiffure-coiffeur', name: 'Hair Look', trade: 'Hair salon' },
  { slug: 'osmose-by-leonie', name: 'Osmose by Léonie', trade: 'Beauty institute' },
  { slug: 'sur-le-pouce-le', name: 'Sur le Pouce', trade: 'Snack bar' },
  { slug: 'univ-hair-yoelis', name: "L'Univ'Hair", trade: 'Hair salon' },
  { slug: 'l-instant-c', name: "L'Instant C", trade: 'Hair salon' },
]

// Live on Vercel (Tim, 2026-11-03: these stay up). Two projects got a suffixed domain.
const domains: Record<string, string> = { 'nguyen-nails': 'nguyen-nails-lemon', 'see-you': 'see-you-three' }
export const clients = clientList.map((c) => ({ ...c, url: `https://${domains[c.slug] ?? c.slug}.vercel.app` }))
