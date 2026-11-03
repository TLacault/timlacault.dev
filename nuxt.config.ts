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
      // html.fonts once an Archivo face has actually loaded (polled: asking fonts.load() before the
      // stylesheet is parsed resolves at once). The loader counter waits for it, so it never flips
      // from the fallback font to Archivo in front of you. Gives up after 3 s.
      script: [{ innerHTML: "var h=document.documentElement;h.classList.add('loading');setTimeout(function(){h.classList.remove('loading')},9000);var t0=Date.now();(function f(){var ok=false;if(document.fonts)document.fonts.forEach(function(x){if(x.family.indexOf('Archivo')>-1&&x.status==='loaded')ok=true});if(ok||Date.now()-t0>3000)h.classList.add('fonts');else setTimeout(f,30)})()" }],
      link: [{ rel: 'preload', href: '/fonts/DepartureMono.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    },
  },
  vite: { optimizeDeps: { include: ['three/webgpu', 'three/tsl'] } },
})
