import { describe, expect, it } from 'vitest'
import { GLYPHS, glyphIndices, sampleImage } from './shapes'

function img(w: number, h: number, paint: (x: number, y: number) => [number, number]) {
  const d = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [lum, a] = paint(x, y), i = (y * w + x) * 4
    d[i] = d[i + 1] = d[i + 2] = lum; d[i + 3] = a
  }
  return d
}

describe('sampleImage', () => {
  it('only lands on opaque pixels', () => {
    const d = img(10, 10, (x) => [255, x < 5 ? 0 : 255])
    const pts = sampleImage(d, 10, 10, 500)
    for (let i = 0; i < pts.length; i += 2) expect(pts[i]).toBeGreaterThanOrEqual(5)
  })

  it('weights by brightness when lum = 1', () => {
    const d = img(2, 1, (x) => [x === 0 ? 255 : 0, 255])
    const pts = sampleImage(d, 2, 1, 2000, 1)
    let left = 0
    for (let i = 0; i < pts.length; i += 2) if (pts[i]! < 1) left++
    expect(left / 2000).toBeGreaterThan(0.85) // 1.12 vs 0.12 weight
  })

  it('is deterministic per seed and returns zeros for an empty image', () => {
    const d = img(8, 8, () => [255, 255])
    expect(sampleImage(d, 8, 8, 20, 0, 7)).toEqual(sampleImage(d, 8, 8, 20, 0, 7))
    expect([...sampleImage(img(4, 4, () => [0, 0]), 4, 4, 3)]).toEqual([0, 0, 0, 0, 0, 0])
  })
})

describe('glyphIndices', () => {
  it('skips whitespace, maps to the atlas and repeats', () => {
    const out = glyphIndices('a b\n', 5)
    expect([...out]).toEqual([GLYPHS.indexOf('a'), GLYPHS.indexOf('b'), GLYPHS.indexOf('a'), GLYPHS.indexOf('b'), GLYPHS.indexOf('a')])
  })
})
