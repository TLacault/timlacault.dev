<!--
The Field: every glyph of the site's own source as a particle (three.js WebGPURenderer + TSL compute,
automatic WebGL2 fallback). Elements marked [data-field] are shapes: the one nearest the viewport centre
pulls particles into its form ("name" = the element's text, "image" = data-src image by brightness);
the rest drift as dust. A moving pointer drags glyphs in its wake, scroll speed stirs, glyphs grow and turn blue under the Lens. When nobody moves, shapes breathe, a third of
the glyphs keep re-typing, a light reads across the shape every 7 s, and an autopilot stirs the dust.
-->
<script setup lang="ts">
import gsap from 'gsap'
import * as THREE from 'three/webgpu'
import {
  Fn, instancedArray, instanceIndex, uniform, vec2, vec3, vec4, float, texture, uv, mix,
  smoothstep, length, hash, mx_noise_vec3, instancedBufferAttribute, floor, mod, color,
} from 'three/tsl'

const canvas = ref<HTMLCanvasElement>()
let dispose = () => {}

onMounted(async () => {
  await nextTick() // .client.vue: the template (and this ref) only exists after a tick
  const el = canvas.value!
  const q = new URLSearchParams(location.search)
  if (q.has('nofield')) { stage.progress = 1; return } // debugging: page without the Field
  // ?gl forces the WebGL2 backend (debugging, headless tests). If neither backend starts, the DOM text stays.
  const renderer = new THREE.WebGPURenderer({ canvas: el, alpha: true, antialias: false, forceWebGL: new URLSearchParams(location.search).has('gl') })
  try { await renderer.init() } catch (e) { console.warn('Field disabled:', e); stage.progress = 1; return }
  stage.progress = 0.45
  const gpu = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend === true
  const small = innerWidth < 768
  const N = Math.round((gpu ? (small ? 16000 : 40000) : (small ? 8000 : 20000))
    * (Number(q.get('n')) || 1)) // ?n=0.25 runs a quarter of the particles (slow test machines)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  stage.log.push(`renderer  ${gpu ? 'WebGPU' : 'WebGL2'}  ${N.toLocaleString('en')} glyphs`)

  let W = innerWidth, H = innerHeight
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(W, H, false)
  const camera = new THREE.OrthographicCamera(0, W, H, 0, -10, 10)
  const scene = new THREE.Scene()

  // Glyphs: the source files of this site, in order.
  await document.fonts.load('24px "Departure Mono"')
  await document.fonts.ready // text shapes must be sampled from the real font, not the fallback
  const files = import.meta.glob('../**/*.{vue,ts}', { query: '?raw', import: 'default' })
  const source = (await Promise.all(Object.values(files).map((f) => f() as Promise<string>))).join('')
  const atlas = new THREE.CanvasTexture(glyphAtlas(32))
  stage.progress = 0.7
  stage.log.push(`source    ${Object.keys(files).length} files  ${source.length.toLocaleString('en')} characters`)

  // Buffers. vec4 everywhere: avoids vec3 storage padding differences between backends.
  const r = rng(42)
  const dust = () => [r() * W, r() * H] as const
  const start = new Float32Array(N * 4)
  for (let i = 0; i < N; i++) { start[i * 4] = r() * W; start[i * 4 + 1] = -r() * H * 0.6; start[i * 4 + 3] = 1 } // below the fold: they rise in
  const tgtData = new Float32Array(N * 4)
  const pos = instancedArray(start, 'vec4')
  const vel = instancedArray(new Float32Array(N * 4), 'vec4')
  const tgt = instancedArray(tgtData, 'vec4')

  const uDt = uniform(1 / 60), uTime = uniform(0), uAgit = uniform(0)
  const uOffset = uniform(new THREE.Vector2())
  const uPointer = uniform(new THREE.Vector2(-9999, -9999))
  const uPointerVel = uniform(new THREE.Vector2())
  const uLens = uniform(new THREE.Vector3(-9999, -9999, 0))
  const uSpring = uniform(reduce ? 400 : 34)
  const uSize = uniform(small ? 6 : 7)
  const uHeld = uniform(0) // 0..1 as the Lens opens to full screen
  const uSweep = uniform(-9999) // x of the light band that reads across shapes
  const uSpin = uniform(0) // rotation (rad) of the active shape around uCenter: the loader ring orbits
  const uCenter = uniform(new THREE.Vector2())

  const update = Fn(() => {
    const p = pos.element(instanceIndex)
    const v = vel.element(instanceIndex)
    const t = tgt.element(instanceIndex)
    const seed = hash(instanceIndex)
    // Shapes breathe: a slow wave runs through them, so the page is never still.
    const wave = vec2(0, t.x.mul(0.012).add(uTime.mul(1.1)).sin().mul(3.5)).mul(t.w)
    const rel = t.xy.sub(uCenter), cs = uSpin.cos(), sn = uSpin.sin()
    const spun = vec2(rel.x.mul(cs).sub(rel.y.mul(sn)), rel.x.mul(sn).add(rel.y.mul(cs))).add(uCenter)
    const target = mix(t.xy, spun, t.w).add(uOffset.mul(t.w)).add(wave)
    const acc = target.sub(p.xy).mul(uSpring.mul(seed.mul(0.9).add(0.55))).toVar()
    // A moving pointer drags glyphs along in its wake; a resting one leaves them alone (so the Lens can magnify them).
    const near = float(1).sub(smoothstep(0.0, 150.0, length(p.xy.sub(uPointer))))
    acc.addAssign(uPointerVel.mul(near).mul(7.0))
    const n = mx_noise_vec3(vec3(p.xy.mul(0.0035), uTime.mul(0.12).add(seed.mul(9.0))))
    acc.addAssign(n.xy.mul(uAgit.mul(1400.0).add(t.w.oneMinus().mul(70.0)).add(3.0)))
    const nv = v.xy.add(acc.mul(uDt)).mul(float(reduce ? 0.6 : 0.9).pow(uDt.mul(60.0)))
    v.assign(vec4(nv, 0, 0))
    p.assign(vec4(p.xy.add(nv.mul(uDt)), 0, 1))
  })().compute(N)

  const mat = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false })
  const P = pos.toAttribute(), T = tgt.toAttribute()
  const ch0 = instancedBufferAttribute(new THREE.InstancedBufferAttribute(glyphIndices(source, N), 1))
  // A third of the glyphs keep re-typing themselves, each at its own pace: the code is never static.
  const seedR = hash(instanceIndex.add(7))
  const step = floor(uTime.mul(seedR.mul(2.5).add(0.4)).add(seedR.mul(50.0)))
  const ch = seedR.greaterThan(0.66).select(mod(ch0.add(step.mul(37.0)), float(GLYPHS.length)), ch0)
  const cell = vec2(mod(ch, ATLAS_COLS), float(ATLAS_ROWS - 1).sub(floor(ch.div(ATLAS_COLS))))
  const glyph = texture(atlas, uv().add(cell).div(vec2(ATLAS_COLS, ATLAS_ROWS))).a
  // Small lens: glyphs grow and turn blue. Held open full screen: they step back so the source reads.
  const inLens = float(1).sub(smoothstep(uLens.z.sub(18.0), uLens.z, length(P.xy.sub(uLens.xy)))).mul(uHeld.oneMinus())
  const band = float(1).sub(smoothstep(0.0, 90.0, P.x.sub(uSweep).abs())).mul(T.w) // the reading light
  mat.positionNode = vec3(P.xy, 0)
  mat.scaleNode = mix(uSize, uSize.mul(2.1), inLens).add(band.mul(2.0))
  const rest = mix(float(0.2), T.z.mul(0.85).add(0.1), T.w).add(band.mul(0.5)) // dust 0.2, shapes by their brightness
  const alpha = glyph.mul(mix(rest, 1.0, inLens)).mul(mix(1.0, 0.16, uHeld))
  mat.colorNode = vec4(mix(color('#ededea'), color('#4d7cff'), inLens.max(band.mul(0.6))), alpha)
  const sprites = new THREE.Sprite(mat)
  sprites.count = N
  sprites.frustumCulled = false
  scene.add(sprites)

  // Shapes: which [data-field] element is active, and its points (cached per size).
  const cache = new Map<string, Float32Array>()
  let active: HTMLElement | null = null
  let building = 0
  async function pointsFor(a: HTMLElement): Promise<Float32Array> {
    const b = a.getBoundingClientRect()
    const kind = a.dataset.field!
    const lines = [...a.querySelectorAll('.line')].map((l) => Math.round(l.getBoundingClientRect().width)).join(',')
    const key = `${kind}:${a.dataset.src ?? a.textContent}:${Math.round(b.width)}x${Math.round(b.height)}:${lines}`
    if (cache.has(key)) return cache.get(key)!
    const s = 0.5 // sample at half resolution, plenty for glyph-sized points
    if (kind === 'ring') { // glyphs orbiting the element (loader): an annulus, denser at the rim
      const n = Math.floor(N * 0.7), out = new Float32Array(n * 3), R = Math.min(b.width, b.height) / 2, rr = rng(3)
      for (let i = 0; i < n; i++) {
        const a = rr() * Math.PI * 2, rad = R * (0.62 + 0.38 * Math.sqrt(rr()))
        out[i * 3] = b.width / 2 + Math.cos(a) * rad; out[i * 3 + 1] = b.height / 2 + Math.sin(a) * rad; out[i * 3 + 2] = 0.35 + 0.65 * (rad / R)
      }
      cache.set(key, out)
      return out
    }
    const photo = kind === 'image'
    const img = photo
      ? await imagePixels(a.dataset.src!, Math.ceil(b.width * s), Math.ceil(b.height * s), a.dataset.fit === 'contain')
      : textPixels(a, s)
    const n = Math.floor(N * (photo ? 0.82 : 0.62))
    const pts = sampleImage(img.data, img.w, img.h, n, photo ? 1 : 0, 7)
    // [x, y, brightness] per point; brightness from the image for photos, 1 for text.
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const x = pts[i * 2]!, y = pts[i * 2 + 1]!, k = (Math.floor(y) * img.w + Math.floor(x)) * 4
      out[i * 3] = x / s - img.pad; out[i * 3 + 1] = y / s - img.pad
      out[i * 3 + 2] = photo ? Math.min(1, 0.15 + (0.2126 * img.data[k]! + 0.7152 * img.data[k + 1]! + 0.0722 * img.data[k + 2]!) / 255 * 1.1) : 1
    }
    cache.set(key, out)
    return out
  }
  async function setShape(a: HTMLElement | null) {
    const id = ++building
    const pts = a ? await pointsFor(a) : new Float32Array()
    if (id !== building) return // a newer shape won
    const n = pts.length / 3
    for (let i = 0; i < N; i++) {
      if (i < n) { tgtData[i * 4] = pts[i * 3]!; tgtData[i * 4 + 1] = -pts[i * 3 + 1]!; tgtData[i * 4 + 2] = pts[i * 3 + 2]!; tgtData[i * 4 + 3] = 1 }
      else { const [x, y] = dust(); tgtData[i * 4] = x; tgtData[i * 4 + 1] = y; tgtData[i * 4 + 2] = 0; tgtData[i * 4 + 3] = 0 }
    }
    tgt.value.array.set(tgtData)
    tgt.value.needsUpdate = true
  }
  function pickAnchor() {
    // The loader (and the contact crane) own the Field while they're up. The x-ray copy never does.
    const first = [...document.querySelectorAll<HTMLElement>('[data-field-priority]')].find((a) => !a.closest('.bp-xray'))
    if (first) return first
    let best: HTMLElement | null = null, bestD = Infinity
    for (const a of document.querySelectorAll<HTMLElement>('[data-field]')) {
      if (a.closest('.bp-xray')) continue
      const b = a.getBoundingClientRect()
      if (b.bottom < 0 || b.top > H) continue
      const d = Math.abs(b.top + b.height / 2 - H / 2)
      if (d < bestD) { bestD = d; best = a }
    }
    return best
  }

  const onResize = () => {
    W = innerWidth; H = innerHeight
    renderer.setSize(W, H, false)
    Object.assign(camera, { right: W, top: H }).updateProjectionMatrix()
    cache.clear(); active = null
  }
  addEventListener('resize', onResize)

  let agit = 0
  const frame = (time: number, dt: number) => {
    const a = pickAnchor()
    if (a !== active) { active = a; setShape(a).then(() => { if (stage.progress < 1) stage.progress = 1 }) }
    if (active) {
      const b = active.getBoundingClientRect()
      uOffset.value.set(b.left, H - b.top)
      const ring = active.dataset.field === 'ring'
      uCenter.value.set(b.width / 2, -b.height / 2)
      uSpin.value = ring && !reduce ? time * 0.35 : 0
    }
    uPointer.value.set(stage.px, H - stage.py)
    uPointerVel.value.set(stage.vx, -stage.vy)
    uLens.value.set(stage.lx, H - stage.ly, stage.lr)
    uHeld.value = Math.min(Math.max((stage.lr - 200) / (Math.hypot(W, H) - 200), 0), 1)
    // One pass of the reading light every 7 s, left to right across whatever shape is up.
    const cyc = (time % 7) / 2.2
    uSweep.value = cyc < 1 && !reduce ? -100 + cyc * (W + 200) : -9999
    agit += (Math.min(Math.abs(stage.velocity) / 40, 1) - agit) * 0.08
    uAgit.value = reduce ? 0 : agit
    uTime.value = time
    uDt.value = Math.min(dt / 1000, 1 / 30)
    try { renderer.compute(update); renderer.render(scene, camera) } catch (e) { console.error('[field] frame', e); gsap.ticker.remove(frame) }
  }
  gsap.ticker.add(frame)
  document.documentElement.classList.add('field-live')

  dispose = () => {
    gsap.ticker.remove(frame)
    removeEventListener('resize', onResize)
    document.documentElement.classList.remove('field-live')
    renderer.dispose()
  }
})

onBeforeUnmount(() => dispose())
</script>

<template>
  <canvas ref="canvas" class="field" aria-hidden="true" />
</template>

<style scoped>
.field {
  position: fixed; inset: 0; z-index: 0;
  width: 100vw; height: 100dvh;
  pointer-events: none;
}
</style>
