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
  },
]

// Sites built for local businesses (web_agency/clients), hero screenshots in /clients/<slug>.webp.
export const clients: { slug: string, name: string, trade: string }[] = [
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
