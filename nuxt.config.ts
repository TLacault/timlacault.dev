export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['motion-v/nuxt'],
  css: [
    '@fontsource-variable/archivo/wdth.css',
    '@fontsource-variable/archivo/wdth-italic.css',
    'lenis/dist/lenis.css',
    '~/assets/css/main.css',
  ],
  experimental: { viewTransition: true },
  app: {
    head: {
      title: 'Tim Lacault · Software engineer',
      meta: [
        { name: 'description', content: 'Tim Lacault, software engineer in Bordeaux. I build websites that feel alive.' },
        { name: 'theme-color', content: '#0D0D0F' },
      ],
      // Hide the page under the loader before first paint; give up after 9 s whatever happens.
      script: [{ innerHTML: "document.documentElement.classList.add('loading');setTimeout(function(){document.documentElement.classList.remove('loading')},9000)" }],
      link: [{ rel: 'preload', href: '/fonts/DepartureMono.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    },
  },
  vite: { optimizeDeps: { include: ['three/webgpu', 'three/tsl'] } },
})
