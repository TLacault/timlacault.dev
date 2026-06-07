import { reactive } from "vue";

// Shared bridge so other components (e.g. the command palette) can read and
// control the radio without owning its state. RadioPlayer mirrors its local
// state into `radioState` and registers its bound methods into `radioControls`
// on mount. Mirrors the reactive-module pattern used in src/plugins/i18n.js.
export const radioState = reactive({
  ready: false,
  playing: false,
  title: "",
  artist: "",
  shuffle: false,
  loop: false,
});

// No-op defaults until RadioPlayer registers the real (bound) methods.
export const radioControls = {
  togglePlay() {},
  next() {},
  prev() {},
  toggleShuffle() {},
  toggleLoop() {},
  expand() {},
};
