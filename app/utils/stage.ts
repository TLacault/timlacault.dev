// Per-frame shared state between the pointer, the Lens and the Field. Plain object on purpose:
// it changes every frame and nothing should re-render because of it.
export const stage = {
  px: -9999, py: -9999, // pointer, CSS px from viewport top-left
  vx: 0, vy: 0, // pointer velocity, px/s, smoothed
  lx: -9999, ly: -9999, lr: 0, // lens centre + radius after the spring
  lrRest: 0, // radius when not held: 64 on fine pointers, 0 on touch until a long-press
  held: false, // Space / long-press: lens opens to full screen
  velocity: 0, // Lenis velocity, px per frame
  blueprints: new Set<HTMLElement>(),
}
