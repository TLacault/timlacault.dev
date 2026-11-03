// Two languages, no i18n framework: text lives next to where it's used as `t(en, fr)`, or as
// `{ en, fr }` in data read with `L()`. The choice is remembered; first visit follows the browser.
// The static HTML is English; the stored choice applies on load, under the loader.
export type Lang = 'en' | 'fr'
export type Txt = { en: string, fr: string }

export function useLang() {
  const lang = useState<Lang>('lang', () => 'en')
  const t = (en: string, fr: string) => (lang.value === 'fr' ? fr : en)
  const L = (x: Txt) => x[lang.value]
  /**
   * Switch with a transition: the page blurs out of one language and into the other (View Transitions,
   * styles in main.css under html.lang-vt); the glyph headings then re-form into the new words.
   * Instant where View Transitions or motion aren't available.
   */
  async function setLang(l: Lang) {
    if (l === lang.value) return
    const d = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } }
    if (!d.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { lang.value = l; return }
    const html = document.documentElement
    html.classList.add('lang-vt')
    const vt = d.startViewTransition(async () => { lang.value = l; await nextTick() })
    vt.finished.finally(() => html.classList.remove('lang-vt'))
  }
  return { lang, t, L, setLang }
}
