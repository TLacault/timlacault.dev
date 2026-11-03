// Cal.com booking as a popup over the page (Tim, 2026-11-03), not a trip to cal.com.
// The official embed snippet, loaded on first use; any element with data-cal-link opens the modal.
// Without JS the buttons do nothing harmful and the email/phone links remain.
export const CAL_LINK = 'tim-lacault/30min'
const NS = '30min'
let loaded = false

export function useCal() {
  if (import.meta.server || loaded) return
  loaded = true
  const w = window as any
  ;(function (C: any, A: string, L: string) {
    const p = (a: any, ar: any) => { a.q.push(ar) }
    const d = C.document
    C.Cal = C.Cal || function (...args: any[]) {
      const cal = C.Cal
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true }
      if (args[0] === L) {
        const api: any = function (...a: any[]) { p(api, a) }
        const namespace = args[1]
        api.q = api.q || []
        if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], args); p(cal, ['initNamespace', namespace]) }
        else p(cal, args)
        return
      }
      p(cal, args)
    }
  })(w, 'https://app.cal.com/embed/embed.js', 'init')
  w.Cal('init', NS, { origin: 'https://cal.com' })
  w.Cal.ns[NS]('ui', { theme: 'dark', cssVarsPerTheme: { dark: { 'cal-brand': '#4d7cff' } }, hideEventTypeDetails: false, layout: 'month_view' })
}

export const calAttrs = { 'data-cal-link': CAL_LINK, 'data-cal-namespace': NS, 'data-cal-config': '{"layout":"month_view","theme":"dark"}' }
