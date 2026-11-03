// Two languages, no i18n framework: text lives next to where it's used as `t(en, fr)`, or as
// `{ en, fr }` in data read with `L()`. The choice is remembered; first visit follows the browser.
// The static HTML is English; the stored choice applies on load, under the loader.
export type Lang = 'en' | 'fr'
export type Txt = { en: string, fr: string }

export function useLang() {
  const lang = useState<Lang>('lang', () => 'en')
  const t = (en: string, fr: string) => (lang.value === 'fr' ? fr : en)
  const L = (x: Txt) => x[lang.value]
  return { lang, t, L }
}
