export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['motion-v/nuxt'],
  css: [
    '@fontsource-variable/mona-sans/wdth.css',
    '@fontsource-variable/mona-sans/wdth-italic.css',
    'lenis/dist/lenis.css',
    '~/assets/css/main.css',
  ],
  experimental: { viewTransition: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Tim Lacault · Software engineer',
      meta: [
        { name: 'description', content: 'Tim Lacault, software engineer in Bordeaux. I build websites that feel alive.' },
        { name: 'theme-color', content: '#0D0D0F' },
      ],
      link: [{ rel: 'preload', href: '/fonts/DepartureMono.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    },
  },
  vite: { optimizeDeps: { include: ['three/webgpu', 'three/tsl'] } },
})
