// Generative ambient score, synthesised live with Web Audio: no files, no licences.
// A slow pad (detuned triangle pairs through a lowpass) changes chord with the page section,
// scroll speed opens the filter, holding the Lens open sinks it an octave into a darker, wetter
// room (going inside the page), and sparse glass "pings" fall
// on a pentatonic scale. Built on first toggle (a user gesture), then faded in and out.

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)
// Voicings in D minor territory, one per section id (ScrollRail ids; unknown ids keep the current chord).
const DM9 = [50, 57, 60, 64, 69], BB = [46, 53, 57, 62, 69], F = [41, 53, 57, 60, 64], GM9 = [43, 50, 58, 62, 65], ASUS = [45, 52, 57, 59, 64]
const CHORDS: Record<string, number[]> = {
  top: DM9, work: BB, local: F, path: GM9, contact: ASUS, // home
  demo: BB, story: GM9, gallery: F, next: ASUS, // project pages
  how: BB, sites: F, start: ASUS, // freelance
}
const PENTA = [74, 76, 77, 81, 84, 86, 88]

export function createScore() {
  const ctx = new AudioContext()
  const master = ctx.createGain(); master.gain.value = 0
  const comp = ctx.createDynamicsCompressor()
  master.connect(comp).connect(ctx.destination)

  // Reverb: a few seconds of decaying stereo noise as the impulse response.
  const verb = ctx.createConvolver()
  const len = ctx.sampleRate * 4, ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3 }
  verb.buffer = ir
  const wet = ctx.createGain(); wet.gain.value = 0.55
  verb.connect(wet).connect(master)

  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 520; filter.Q.value = 0.7
  const pad = ctx.createGain(); pad.gain.value = 0.11
  filter.connect(pad); pad.connect(master); pad.connect(verb)
  // Slow breathing on the pad level.
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07
  const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.035
  lfo.connect(lfoAmt).connect(pad.gain); lfo.start()

  const SPREAD = [-7, 7] // cents: the two triangles of each voice beat slowly against each other
  const voices = DM9.map((n) => SPREAD.map((cents) => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(n); o.detune.value = cents
    o.connect(filter); o.start(); return o
  }))
  // A sine sub an octave under the root, only heard while the Lens is held.
  const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = hz(DM9[0]! - 12)
  const subGain = ctx.createGain(); subGain.gain.value = 0
  sub.connect(subGain).connect(pad); sub.start()

  let chord = 'top'
  function setChord(label: string) {
    const notes = CHORDS[label]
    if (!notes || label === chord) return
    chord = label
    voices.forEach((pair, i) => pair.forEach((o) => o.frequency.setTargetAtTime(hz(notes[i]!), ctx.currentTime, 1.2)))
    sub.frequency.setTargetAtTime(hz(notes[0]! - 12), ctx.currentTime, 1.2)
  }

  function ping() {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime
    o.type = 'sine'; o.frequency.value = hz(PENTA[Math.floor(Math.random() * PENTA.length)]!)
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
    o.connect(g); g.connect(verb); g.connect(master)
    o.start(t); o.stop(t + 2.5)
  }
  let pingTimer: ReturnType<typeof setTimeout> | undefined
  const schedule = () => { pingTimer = setTimeout(() => { ping(); schedule() }, 1800 + Math.random() * 4200) }

  // Per frame: scroll speed opens the filter; holding the Lens sinks everything an octave, closes
  // the filter, brings in the sub and pushes the reverb (a slow glide in and out, never a jump).
  let deep = false
  function update(velocity: number, held: boolean, section: string) {
    const t = ctx.currentTime
    filter.frequency.setTargetAtTime(held ? 260 : 520 + Math.min(Math.abs(velocity) * 60, 2200), t, held ? 0.5 : 0.25)
    if (held !== deep) {
      deep = held
      voices.forEach((pair) => pair.forEach((o, k) => o.detune.setTargetAtTime(SPREAD[k]! + (held ? -1200 : 0), t, 0.45)))
      subGain.gain.setTargetAtTime(held ? 0.5 : 0, t, 0.6)
      wet.gain.setTargetAtTime(held ? 0.95 : 0.55, t, 0.6)
    }
    setChord(section)
  }

  // Volume 0..1 from the settings dock, on a perceptual curve; 0.35 (the default) is quiet background.
  let volume = 0.35, playing = false
  const level = () => volume * volume * 1.2
  return {
    on(v = volume) { volume = v; playing = true; ctx.resume(); master.gain.setTargetAtTime(level(), ctx.currentTime, 1.5); clearTimeout(pingTimer); schedule() },
    setVolume(v: number) { volume = v; if (playing) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.1) },
    off() { playing = false; master.gain.setTargetAtTime(0, ctx.currentTime, 0.5); clearTimeout(pingTimer) },
    update,
  }
}
