// Picks the language (saved choice, else the browser's) once the English static HTML has hydrated:
// switching before hydration would mismatch it. The switch happens under the loader, out of sight.
// <html lang> is set by useHead in app.vue.
export default defineNuxtPlugin((nuxt) => {
  const { lang } = useLang()
  nuxt.hook('app:mounted', () => {
    let saved: string | null = null
    try { saved = localStorage.getItem('tl-lang') } catch {}
    lang.value = saved === 'fr' || saved === 'en' ? saved : navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
    watch(lang, (l) => { try { localStorage.setItem('tl-lang', l) } catch {} })
  })
})
