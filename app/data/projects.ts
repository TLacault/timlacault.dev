import type { Txt } from '~/composables/useLang'

export interface Project {
  slug: string
  title: string
  year: string
  role: Txt
  kind: Txt
  tagline: Txt
  stack: string[]
  live?: string
  demo?: string
  images: string[]
  sections: { title: Txt, body?: Txt, points?: Txt[] }[]
}

const shots = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/shots/${slug}/${String(i + 1).padStart(2, '0')}.webp`)

export const projects: Project[] = [
  {
    slug: 'badminton-records',
    title: 'Badminton Records',
    year: '2026',
    role: { en: 'Full-stack', fr: 'Full-stack' },
    kind: { en: 'Side project', fr: 'Projet perso' },
    tagline: { en: 'Match archive for my badminton club: rally-by-rally tagging, a live scoreboard over YouTube, and an ffmpeg highlight cutter.', fr: 'Les archives des matchs de mon club de badminton : chaque échange annoté, un score en direct par-dessus YouTube, et des résumés montés avec ffmpeg.' },
    stack: ['Nuxt 4', 'Supabase', 'Tailwind', 'ffmpeg'],
    live: 'https://badminton-records.vercel.app',
    demo: 'https://www.youtube.com/watch?v=sbGkDmcfCKE',
    images: shots('badminton-records', 8),
    sections: [
      { title: { en: 'Overview', fr: 'En bref' }, body: {
        en: 'A match archive for U.S. Talence Badminton, the club I play at. We film our games and post them on YouTube. This site turns those videos into matches you can browse: every rally is tagged, the score sits on top of the video, and the best points can be cut into a highlight film.',
        fr: "Les archives des matchs de l'U.S. Talence Badminton, mon club. On filme nos matchs et on les publie sur YouTube. Ce site transforme ces vidéos en matchs qu'on peut parcourir : chaque échange est annoté, le score s'affiche par-dessus la vidéo, et les meilleurs points peuvent être montés en résumé." } },
      { title: { en: 'What it does', fr: 'Ce que ça fait' }, points: [
        { en: "Imports the club's YouTube uploads as matches. Re-running the import is safe and never overwrites a match that's already been tagged.", fr: "Importe les vidéos YouTube du club comme des matchs. On peut relancer l'import sans risque : un match déjà annoté n'est jamais écrasé." },
        { en: 'A keyboard-driven tagger for logging a match rally by rally. Every key can be rebound, and it handles AZERTY layouts properly.', fr: "Un outil d'annotation au clavier pour saisir un match échange par échange. Chaque touche se reconfigure, et l'AZERTY est bien géré." },
        { en: "A scoreboard drawn over the video that follows playback, so it never shows a score the viewer hasn't reached yet.", fr: "Un tableau de score dessiné sur la vidéo qui suit la lecture : il n'affiche jamais un score que le spectateur n'a pas encore vu." },
        { en: "Player lookup against the French federation's public records, widening its search from our roster to the club to all of France.", fr: "Une recherche de joueurs dans les données publiques de la fédération, qui s'élargit de notre effectif au club puis à toute la France." },
        { en: 'Reel: turns starred rallies into a highlight film, with a soundtrack trimmed to its loudest section, rendered by ffmpeg.', fr: "Reel : transforme les échanges favoris en film de résumé, avec une musique coupée sur son passage le plus fort, le tout rendu par ffmpeg." },
      ] },
      { title: { en: 'Architecture', fr: 'Architecture' }, body: {
        en: 'Nuxt 4 with Supabase for auth and Postgres, styled with Tailwind 4. The scoring engine and the reel model live in shared/ as plain TypeScript with no framework code, so Vitest tests them without a browser or a database. The reel is a single ReelProject object: the preview, the saved .reel file and the render request all read it, so what you preview is exactly what gets rendered.',
        fr: "Nuxt 4 avec Supabase pour l'authentification et Postgres, stylé avec Tailwind 4. Le moteur de score et le modèle du reel vivent dans shared/ en TypeScript pur, sans framework, donc Vitest les teste sans navigateur ni base de données. Le reel est un seul objet ReelProject : l'aperçu, le fichier .reel et la demande de rendu lisent tous le même, donc ce qu'on prévisualise est exactement ce qui est rendu." } },
      { title: { en: 'The hard parts', fr: 'Les parties difficiles' }, points: [
        { en: "YouTube's fullscreen button only fullscreens the iframe and leaves the scoreboard behind. A fullscreenchange handler moves fullscreen to the wrapper around the video instead.", fr: "Le plein écran de YouTube n'agrandit que l'iframe et laisse le score derrière. Un gestionnaire fullscreenchange bascule le plein écran sur le conteneur de la vidéo." },
        { en: 'ffmpeg filter graphs fail late and with vague errors. The arguments are built by a pure function and checked in unit tests before anything is spawned.', fr: "Les graphes de filtres ffmpeg échouent tard et avec des erreurs vagues. Les arguments sont construits par une fonction pure et vérifiés par des tests avant de lancer quoi que ce soit." },
        { en: "Long downloads and renders run as background jobs the browser polls, so reloading the page doesn't kill an eleven-minute export.", fr: "Les longs téléchargements et rendus tournent en tâches de fond que le navigateur interroge : recharger la page ne tue pas un export de onze minutes." },
        { en: 'The palette has only two colours, club crimson and ink, and still passes contrast checks in light and dark themes.', fr: "La palette n'a que deux couleurs, le rouge du club et l'encre, et passe quand même les contrôles de contraste en thème clair comme sombre." },
      ] },
    ],
  },
  {
    slug: 'mobilit-eirb',
    title: "Mobilit'Eirb",
    year: '2026',
    role: { en: 'Founder', fr: 'Fondateur' },
    kind: { en: 'Startup', fr: 'Startup' },
    tagline: { en: 'My startup. It measures the carbon footprint of student trips, and began as a school project I led with a team of five at ENSEIRB-MATMECA.', fr: "Ma startup. Elle mesure l'empreinte carbone des mobilités étudiantes, et a commencé comme un projet d'école que j'ai mené avec une équipe de cinq à l'ENSEIRB-MATMECA." },
    stack: ['Nuxt', 'Express', 'PostgreSQL', 'Docker'],
    live: 'https://mobilit.eirb.fr',
    demo: 'https://www.youtube.com/watch?v=1fIJ63elEfI',
    images: shots('mobilit-eirb', 7),
    sections: [
      { title: { en: 'Overview', fr: 'En bref' }, body: {
        en: 'Students record the trips of their mobility period abroad (a semester, an internship) and the app works out the carbon footprint of each leg. They can compare alternative routes, and the school gets aggregated data for its annual carbon report. It started as my end-of-year project at ENSEIRB-MATMECA, built by a team of five, and became my startup.',
        fr: "Les étudiants saisissent les trajets de leur mobilité à l'étranger (un semestre, un stage) et l'application calcule l'empreinte carbone de chaque étape. Ils peuvent comparer d'autres itinéraires, et l'école récupère des données agrégées pour son bilan carbone annuel. C'est parti de mon projet de fin d'année à l'ENSEIRB-MATMECA, construit à cinq, et c'est devenu ma startup." } },
      { title: { en: 'My role', fr: 'Mon rôle' }, body: {
        en: 'I led the project and wrote most of the commits. I set up the architecture, the Docker environment and the CI/CD pipeline, and built features across the frontend and the API.',
        fr: "J'ai mené le projet et écrit la plupart des commits. J'ai posé l'architecture, l'environnement Docker et la chaîne CI/CD, et développé des fonctionnalités côté front comme côté API." } },
      { title: { en: 'Architecture', fr: 'Architecture' }, body: {
        en: "Three Docker services: a Nuxt frontend served by Nginx, an Express REST API using Prisma, and PostgreSQL with PostGIS. On every push to main, GitHub Actions builds the images and pushes them to the school's registry. Sign-in goes through the school's identity provider with OpenID Connect, so the app never stores a password.",
        fr: "Trois services Docker : un front Nuxt servi par Nginx, une API REST Express avec Prisma, et PostgreSQL avec PostGIS. À chaque push sur main, GitHub Actions construit les images et les pousse sur le registre de l'école. La connexion passe par le fournisseur d'identité de l'école en OpenID Connect : l'application ne stocke jamais de mot de passe." } },
      { title: { en: 'How emissions are computed', fr: 'Comment les émissions sont calculées' }, points: [
        { en: 'Distance and duration come from the Google Routes API for road and transit, and from the haversine formula for flights.', fr: "Distances et durées viennent de l'API Google Routes pour la route et les transports en commun, et de la formule de haversine pour l'avion." },
        { en: "Emissions come from ADEME's Impact CO2 API, which uses the official French emission factors (Base Carbone).", fr: "Les émissions viennent de l'API Impact CO2 de l'ADEME, qui utilise les facteurs d'émission officiels français (Base Carbone)." },
        { en: "Results are stored and only recalculated when a step's endpoints or transport mode change, which keeps Google API usage within its quota.", fr: "Les résultats sont stockés et recalculés seulement quand les extrémités ou le mode de transport d'une étape changent, ce qui garde l'usage de l'API Google dans son quota." },
        { en: 'Mobilities export as JSON, CSV, or a styled PDF.', fr: 'Les mobilités s’exportent en JSON, en CSV ou en PDF mis en page.' },
      ] },
      { title: { en: 'The hard parts', fr: 'Les parties difficiles' }, points: [
        { en: "SSR inside Docker: the frontend container couldn't reach the backend at localhost, so the app moved to client-side rendering.", fr: "Le SSR dans Docker : le conteneur du front ne joignait pas le back sur localhost, donc l'application est passée en rendu côté client." },
        { en: "Google Routes doesn't always honour the requested transit mode. allowedTravelModes is restricted and distance checks catch absurd results.", fr: "Google Routes ne respecte pas toujours le mode de transport demandé. allowedTravelModes est restreint et des contrôles de distance attrapent les résultats absurdes." },
        { en: "A column added after deployment: queries fall back to running without it, so environments that hadn't migrated kept working.", fr: "Une colonne ajoutée après le déploiement : les requêtes se rabattent sur une version sans elle, donc les environnements pas encore migrés ont continué de marcher." },
      ] },
    ],
  },
]

// Sites built for local businesses (web_agency/clients), hero screenshots in /clients/<slug>.webp.
const clientList: { slug: string, name: string, trade: Txt }[] = [
  { slug: 'latelier-de-christophe', name: "L'Atelier de Christophe", trade: { en: 'Hair salon', fr: 'Coiffeur' } },
  { slug: 'bikindoor', name: "Bik'Indoor", trade: { en: 'Indoor cycling', fr: 'Vélo indoor' } },
  { slug: 'chez-agathe', name: 'Chez Agathe', trade: { en: 'Brasserie', fr: 'Brasserie' } },
  { slug: 'lbc-boxing', name: 'Legacy Boxing Club', trade: { en: 'Boxing club', fr: 'Club de boxe' } },
  { slug: 'fournil-de-birdy', name: 'Le Fournil de Birdy', trade: { en: 'Bakery', fr: 'Boulangerie' } },
  { slug: 'le-de-cafeine', name: 'Le Dé Caféine', trade: { en: 'Board-game café', fr: 'Bar à jeux' } },
  { slug: 'nguyen-nails', name: 'Nguyen Nails', trade: { en: 'Nail salon', fr: 'Onglerie' } },
  { slug: 'gmb-thermique', name: 'GMB Thermique', trade: { en: 'Plumbing and heating', fr: 'Plomberie, chauffage' } },
  { slug: 'la-terrasse-doree', name: 'La Terrasse Dorée', trade: { en: 'Restaurant', fr: 'Restaurant' } },
  { slug: 'mon-barbier-2', name: 'Mon Barbier', trade: { en: 'Barber', fr: 'Barbier' } },
  { slug: 'institut-sahyla-studio', name: 'Sahyla Studio', trade: { en: 'Beauty institute', fr: 'Institut de beauté' } },
  { slug: 'vintage-grillades', name: 'Vintage Grillades', trade: { en: 'Grill', fr: 'Grill' } },
  { slug: 'au-137-coiffeur-barbier', name: 'Au 137', trade: { en: 'Barber', fr: 'Barbier' } },
  { slug: 'mlx-training-club', name: 'MLX Training Club', trade: { en: 'Gym', fr: 'Salle de sport' } },
  { slug: 'fournil-de-pacaris', name: 'Le Fournil de Pacaris', trade: { en: 'Bakery', fr: 'Boulangerie' } },
  { slug: 'coiffeur-instinctif', name: "Instinc'tif", trade: { en: 'Hair salon', fr: 'Coiffeur' } },
  { slug: 'restaurant-nem-mekong', name: 'Nem Mékong', trade: { en: 'Restaurant', fr: 'Restaurant' } },
  { slug: 'tpt-plomberie', name: 'TPT Plomberie', trade: { en: 'Plumber', fr: 'Plombier' } },
  { slug: 'la-ferme-du-compostelle', name: 'La Ferme du Compostelle', trade: { en: 'Restaurant', fr: 'Restaurant' } },
  { slug: 'see-you', name: 'See You', trade: { en: 'Restaurant', fr: 'Restaurant' } },
  { slug: 'hair-look-coiffure-coiffeur', name: 'Hair Look', trade: { en: 'Hair salon', fr: 'Coiffeur' } },
  { slug: 'osmose-by-leonie', name: 'Osmose by Léonie', trade: { en: 'Beauty institute', fr: 'Institut de beauté' } },
  { slug: 'sur-le-pouce-le', name: 'Sur le Pouce', trade: { en: 'Snack bar', fr: 'Snack' } },
  { slug: 'univ-hair-yoelis', name: "L'Univ'Hair", trade: { en: 'Hair salon', fr: 'Coiffeur' } },
  { slug: 'l-instant-c', name: "L'Instant C", trade: { en: 'Hair salon', fr: 'Coiffeur' } },
]

// Live on Vercel (Tim, 2026-11-03: these stay up). Two projects got a suffixed domain.
const domains: Record<string, string> = { 'nguyen-nails': 'nguyen-nails-lemon', 'see-you': 'see-you-three' }
export const clients = clientList.map((c) => ({ ...c, url: `https://${domains[c.slug] ?? c.slug}.vercel.app` }))
