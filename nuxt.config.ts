export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['motion-v/nuxt'],
  css: [
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
      // html.fonts once Archivo and Departure Mono faces have actually loaded (polled: asking fonts.load() before the
      // stylesheet is parsed resolves at once). The loader waits for it (gate in main.css), so its text never flips
      // from the fallback font to Archivo in front of you. Gives up after 3 s.
      script: [{ innerHTML: "var h=document.documentElement;h.classList.add('loading','reveal');setTimeout(function(){h.classList.remove('loading')},9000);var t0=Date.now();(function f(){var a=false,d=false;if(document.fonts)document.fonts.forEach(function(x){if(x.status!=='loaded')return;if(x.family.indexOf('Archivo')>-1)a=true;if(x.family.indexOf('Departure')>-1)d=true});if((a&&d)||Date.now()-t0>3000)h.classList.add('fonts');else setTimeout(f,30)})()" }],
      // Fonts are declared here, in a static <style> in the head, not through CSS modules: in dev, Vite
      // re-injects module CSS on hydration and the faces re-register for a frame (the loader's 000 blinked).
      style: [{ innerHTML: "@font-face{font-family: 'Archivo Variable'; font-style: normal; font-display: swap; font-weight: 100 900; font-stretch: 62% 125%; src: url(/fonts/archivo-latin-ext-wdth-normal.woff2) format('woff2-variations'); unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}@font-face{font-family: 'Archivo Variable'; font-style: normal; font-display: swap; font-weight: 100 900; font-stretch: 62% 125%; src: url(/fonts/archivo-latin-wdth-normal.woff2) format('woff2-variations'); unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}@font-face{font-family: 'Archivo Variable'; font-style: italic; font-display: swap; font-weight: 100 900; font-stretch: 62% 125%; src: url(/fonts/archivo-latin-ext-wdth-italic.woff2) format('woff2-variations'); unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}@font-face{font-family: 'Archivo Variable'; font-style: italic; font-display: swap; font-weight: 100 900; font-stretch: 62% 125%; src: url(/fonts/archivo-latin-wdth-italic.woff2) format('woff2-variations'); unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}@font-face{font-family:'Departure Mono';src:url(/fonts/DepartureMono.woff2) format('woff2');font-display:swap}" }],
      link: [
        { rel: 'preload', href: '/fonts/archivo-latin-wdth-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/DepartureMono.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
    },
  },
  vite: { optimizeDeps: { include: ['three/webgpu', 'three/tsl'] } },
})
