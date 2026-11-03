import { describe, expect, it } from 'vitest'
import { ago, describeEvent, parisStatus } from './usePresence'

describe('presence helpers', () => {
  it('describes the latest relevant GitHub event', () => {
    const ev = describeEvent([
      { type: 'WatchEvent', repo: { name: 'x/starred' }, created_at: '2026-11-03T10:00:00Z' },
      { type: 'PushEvent', repo: { name: 'TLacault/timlacault.dev' }, created_at: '2026-11-03T09:00:00Z', payload: { size: 3 } },
    ])
    expect(ev).toEqual({ text: 'pushed 3 commits to timlacault.dev', url: 'https://github.com/TLacault/timlacault.dev', at: '2026-11-03T09:00:00Z' })
    expect(describeEvent([{ type: 'WatchEvent', repo: { name: 'a/b' }, created_at: '' }])).toBeNull()
  })

  it('formats relative time', () => {
    const now = Date.parse('2026-11-03T12:00:00Z')
    expect(ago('2026-11-03T11:59:40Z', now)).toBe('just now')
    expect(ago('2026-11-03T11:15:00Z', now)).toBe('45m ago')
    expect(ago('2026-11-03T07:00:00Z', now)).toBe('5h ago')
    expect(ago('2026-11-01T12:00:00Z', now)).toBe('2d ago')
  })

  it('reads the hour in Paris, not the machine timezone', () => {
    expect(parisStatus(Date.parse('2026-11-03T22:30:00Z'))).toBe('late-night coding') // 23:30 in Paris
    expect(parisStatus(Date.parse('2026-11-03T03:00:00Z'))).toBe('probably asleep')
  })
})
