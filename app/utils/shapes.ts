// Turning things (text, a photo, the site's source) into data for the Field.
// The pure part (sampling, glyph indices) is tested in shapes.test.ts; the canvas helpers need a browser.

export const GLYPHS = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).join('') // '!'..'~'
export const ATLAS_COLS = 16
export const ATLAS_ROWS = Math.ceil(GLYPHS.length / ATLAS_COLS)

/** Mulberry32: a seeded RNG so a shape always samples the same points (no flicker between rebuilds). */
export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Picks `n` points from an RGBA image, each pixel's chance proportional to its weight
 * (alpha × a brightness term). Returns [x0, y0, x1, y1, ...] in image pixels, jittered inside the pixel.
 * `lum` 0 = alpha only (text), 1 = brightness decides fully (a photo).
 */
export function sampleImage(data: Uint8ClampedArray, w: number, h: number, n: number, lum = 0, seed = 1): Float32Array {
  const cdf = new Float32Array(w * h)
  let total = 0
  for (let i = 0; i < w * h; i++) {
    const a = data[i * 4 + 3]! / 255
    const l = (0.2126 * data[i * 4]! + 0.7152 * data[i * 4 + 1]! + 0.0722 * data[i * 4 + 2]!) / 255
    total += a > 0.35 ? a * (1 - lum + lum * (0.12 + l)) : 0
    cdf[i] = total
  }
  const out = new Float32Array(n * 2)
  if (total === 0) return out
  const r = rng(seed)
  for (let k = 0; k < n; k++) {
    const target = r() * total
    let lo = 0, hi = cdf.length - 1
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid]! < target) lo = mid + 1; else hi = mid }
    out[k * 2] = (lo % w) + r()
    out[k * 2 + 1] = Math.floor(lo / w) + r()
  }
  return out
}

/** Atlas index for every particle, read from source text in order, skipping whitespace; repeats to fill `n`. */
export function glyphIndices(source: string, n: number): Float32Array {
  const idx: number[] = []
  for (const ch of source) { const i = GLYPHS.indexOf(ch); if (i >= 0) idx.push(i) }
  if (!idx.length) idx.push(0)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = idx[i % idx.length]!
  return out
}

/** Glyph atlas: GLYPHS in Departure Mono, white on transparent, ATLAS_COLS per row. */
export function glyphAtlas(cell = 32): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = ATLAS_COLS * cell
  c.height = ATLAS_ROWS * cell
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.font = `${Math.round(cell * 0.75)}px "Departure Mono"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ;[...GLYPHS].forEach((g, i) => ctx.fillText(g, (i % ATLAS_COLS + 0.5) * cell, (Math.floor(i / ATLAS_COLS) + 0.5) * cell))
  return c
}

/**
 * Pixels of an element's text, drawn with its own computed font, line by line (one `.line` child per line).
 * Display type overflows its tight line box, so the canvas gets `pad` CSS px of room on every side.
 */
export function textPixels(el: HTMLElement, scale: number, pad = 40): { data: Uint8ClampedArray, w: number, h: number, pad: number } {
  const box = el.getBoundingClientRect()
  const w = Math.ceil((box.width + pad * 2) * scale), h = Math.ceil((box.height + pad * 2) * scale)
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const lines = el.querySelectorAll<HTMLElement>('.line')
  for (const line of lines.length ? [...lines] : [el]) {
    const cs = getComputedStyle(line)
    const r = line.getBoundingClientRect()
    const size = parseFloat(cs.fontSize) * scale
    ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`
    ctx.fontStretch = 'semi-expanded' // = font-stretch 112.5% on .display
    ctx.letterSpacing = `${parseFloat(cs.letterSpacing || '0') * scale}px`
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#fff'
    // CSS puts the font's ascent+descent box in the middle of the line box; the baseline follows.
    const text = (line.textContent || '').trim()
    const m = ctx.measureText(text)
    const y = (r.top - box.top + pad + r.height / 2) * scale + (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2
    const x = (r.left - box.left + pad + parseFloat(cs.paddingLeft)) * scale
    ctx.fillText(text, x, y)
  }
  return { data: ctx.getImageData(0, 0, w, h).data, w, h, pad }
}

/** Pixels of an image fitted (cover) into w × h. */
export async function imagePixels(src: string, w: number, h: number) {
  const img = new Image()
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const s = Math.max(w / img.width, h / img.height)
  ctx.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s)
  return { data: ctx.getImageData(0, 0, w, h).data, w, h, pad: 0 }
}
