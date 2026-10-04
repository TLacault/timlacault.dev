<script>
export default {
  name: "ProjectCarousel",
  props: {
    images: { type: Array, required: true },
    alt: { type: String, default: "" },
  },
  data() {
    return {
      index: 0,
      ratios: {}, // image index → natural width / height, filled on load
      boxWidth: 0,
      viewportHeight: window.innerHeight,
    };
  },
  computed: {
    hasControls() {
      return this.images.length > 1;
    },
    // The frame takes the active image's own proportions. Tall images are
    // capped in height and narrowed to match, so the frame never letterboxes.
    frameStyle() {
      if (!this.boxWidth) return {};
      const ratio = this.ratios[this.index] || 16 / 9;
      const maxHeight = this.viewportHeight * 0.65;
      const width = Math.min(this.boxWidth, maxHeight * ratio);
      return { width: `${width}px`, height: `${width / ratio}px` };
    },
  },
  watch: {
    images() {
      this.index = 0;
      this.ratios = {};
    },
  },
  mounted() {
    this._onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this._onKeyDown);

    // Only the width matters, and resizing the frame changes this element's
    // height, so defer to the next frame to avoid a ResizeObserver loop.
    this._resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      requestAnimationFrame(() => {
        this.boxWidth = width;
        this.viewportHeight = window.innerHeight;
      });
    });
    this._resizeObserver.observe(this.$el);

    // Images already in the cache can finish before Vue binds @load.
    this.$el.querySelectorAll(".carousel-frame img").forEach((img, i) => {
      if (img.complete) this.onImageLoad(i, img);
    });
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this._onKeyDown);
    this._resizeObserver?.disconnect();
  },
  methods: {
    onImageLoad(i, img) {
      if (!img.naturalWidth || !img.naturalHeight) return;
      this.ratios = {
        ...this.ratios,
        [i]: img.naturalWidth / img.naturalHeight,
      };
    },
    go(i) {
      const n = this.images.length;
      this.index = (i + n) % n;
    },
    onKeyDown(e) {
      if (!this.hasControls) return;
      // Arrows typed in a modal on top (command palette) aren't for us.
      if (
        e.target instanceof Element &&
        e.target.closest('[aria-modal="true"]')
      )
        return;
      if (e.key === "ArrowLeft") this.go(this.index - 1);
      else if (e.key === "ArrowRight") this.go(this.index + 1);
    },
    onTouchStart(e) {
      this._touchX = e.touches[0].clientX;
    },
    onTouchEnd(e) {
      if (!this.hasControls) return;
      const dx = this._touchX - e.changedTouches[0].clientX;
      if (Math.abs(dx) < 30) return;
      this.go(this.index + (dx > 0 ? 1 : -1));
    },
  },
};
</script>

<template>
  <div
    class="carousel"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="carousel-frame" :style="frameStyle">
      <img
        v-for="(src, i) in images"
        :key="src"
        :src="src"
        :alt="`${alt} — ${i + 1} / ${images.length}`"
        :class="{ active: i === index }"
        :aria-hidden="i !== index"
        draggable="false"
        @load="onImageLoad(i, $event.target)"
      />

      <template v-if="hasControls">
        <button
          class="carousel-arrow prev"
          @click="go(index - 1)"
          aria-label="Previous image"
        >
          <i class="ri-arrow-left-s-line"></i>
        </button>
        <button
          class="carousel-arrow next"
          @click="go(index + 1)"
          aria-label="Next image"
        >
          <i class="ri-arrow-right-s-line"></i>
        </button>
        <span class="carousel-count"
          >{{ index + 1 }} / {{ images.length }}</span
        >
      </template>
    </div>

    <div v-if="hasControls" class="carousel-dots">
      <button
        v-for="(src, i) in images"
        :key="src"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
        :aria-label="`Image ${i + 1}`"
        :aria-current="i === index"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.carousel-frame {
  position: relative;
  /* Placeholder until the width is measured; then frameStyle sets the size. */
  width: 100%;
  aspect-ratio: 16 / 9;
  max-width: 100%;
  margin: 0 auto;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* All slides are stacked; only the active one is opaque, so a change of
   index crossfades instead of jumping. */
.carousel-frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  opacity: 0;
  transform: scale(1.015);
  transition: opacity 0.6s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.carousel-frame img.active {
  opacity: 1;
  transform: scale(1);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(13, 17, 23, 0.55);
  color: #fff;
  font-size: 1.35rem;
  cursor: pointer;
  opacity: 0;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: opacity 0.25s ease, background 0.2s ease;
}
.carousel-arrow.prev {
  left: 0.75rem;
}
.carousel-arrow.next {
  right: 0.75rem;
}
.carousel-frame:hover .carousel-arrow,
.carousel-arrow:focus-visible {
  opacity: 1;
}
.carousel-arrow:hover {
  background: rgba(13, 17, 23, 0.8);
}
/* No hover on touch screens: keep the arrows visible. */
@media (hover: none) {
  .carousel-arrow {
    opacity: 0.85;
  }
}

.carousel-count {
  position: absolute;
  bottom: 0.65rem;
  right: 0.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: rgba(13, 17, 23, 0.55);
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
}
.dot {
  width: 0.45rem;
  height: 0.45rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.2);
  cursor: pointer;
  transition: width 0.3s ease, background 0.3s ease;
}
.dot.active {
  width: 1.4rem;
  background: var(--accent);
}

[data-theme="dark"] .carousel-frame {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 0 28px rgba(94, 201, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.5);
}
[data-theme="dark"] .dot {
  background: rgba(255, 255, 255, 0.2);
}
[data-theme="dark"] .dot.active {
  background: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .carousel-frame,
  .carousel-frame img {
    transition: none;
    transform: none;
  }
}
</style>
