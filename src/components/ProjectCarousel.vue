<script>
export default {
  name: "ProjectCarousel",
  props: {
    images: { type: Array, required: true },
    alt: { type: String, default: "" },
    // Optional YouTube embed URL, shown as the first slide.
    video: { type: String, default: null },
  },
  data() {
    return {
      index: 0,
      ratios: {}, // slide index → natural width / height, filled on load
      boxWidth: 0,
      viewportHeight: window.innerHeight,
    };
  },
  computed: {
    // The video (if any) comes first; image slides follow in gallery order.
    slides() {
      const images = this.images.map((src) => ({ type: "image", src }));
      return this.video
        ? [{ type: "video", src: this.video }, ...images]
        : images;
    },
    hasControls() {
      return this.slides.length > 1;
    },
    isVideo() {
      return this.slides[this.index]?.type === "video";
    },
    frameWidth() {
      const ratio = this.ratios[this.index] || 16 / 9;
      const maxHeight = this.viewportHeight * 0.65;
      return Math.min(this.boxWidth, maxHeight * ratio);
    },
    // The frame takes the active image's own proportions. Tall images are
    // capped in height and narrowed to match, so the frame never letterboxes.
    frameStyle() {
      if (!this.boxWidth) return {};
      const ratio = this.ratios[this.index] || 16 / 9;
      const width = this.frameWidth;
      return { width: `${width}px`, height: `${width / ratio}px` };
    },
    // Click zones run from the carousel's outer edge (which never moves) to a
    // little inside the frame, so prev/next stay put while the frame resizes.
    // Over the video they stop at the frame edge so its controls stay usable.
    zoneStyle() {
      if (!this.boxWidth) return {};
      const gutter = (this.boxWidth - this.frameWidth) / 2;
      const inset = this.isVideo ? 0 : Math.min(96, this.frameWidth * 0.2);
      return { width: `${Math.max(gutter + inset, 48)}px` };
    },
  },
  watch: {
    slides() {
      this.index = 0;
      this.ratios = this.video ? { 0: 16 / 9 } : {};
    },
    index(_, prev) {
      // Leaving the video slide pauses it rather than letting it play unseen.
      if (this.slides[prev]?.type !== "video") return;
      this.$refs.video?.[0]?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
        "*"
      );
    },
  },
  created() {
    if (this.video) this.ratios = { 0: 16 / 9 };
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
    this.$el.querySelectorAll(".carousel-frame img").forEach((img) => {
      if (img.complete) this.onImageLoad(Number(img.dataset.slide), img);
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
      const n = this.slides.length;
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
    <div class="carousel-stage">
      <div class="carousel-frame" :style="frameStyle">
        <template v-for="(slide, i) in slides" :key="slide.src">
          <iframe
            v-if="slide.type === 'video'"
            ref="video"
            :src="slide.src"
            :title="`${alt} demo`"
            :class="{ active: i === index }"
            :aria-hidden="i !== index"
            :tabindex="i === index ? 0 : -1"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowfullscreen
          ></iframe>
          <img
            v-else
            :src="slide.src"
            :alt="`${alt} — ${i + 1} / ${slides.length}`"
            :data-slide="i"
            :class="{ active: i === index }"
            :aria-hidden="i !== index"
            draggable="false"
            @load="onImageLoad(i, $event.target)"
          />
        </template>

        <span v-if="hasControls" class="carousel-count"
          >{{ index + 1 }} / {{ slides.length }}</span
        >
      </div>

      <template v-if="hasControls">
        <button
          class="carousel-zone prev"
          :class="{ video: isVideo }"
          :style="zoneStyle"
          @click="go(index - 1)"
          aria-label="Previous slide"
        >
          <span class="carousel-arrow"
            ><i class="ri-arrow-left-s-line"></i
          ></span>
        </button>
        <button
          class="carousel-zone next"
          :class="{ video: isVideo }"
          :style="zoneStyle"
          @click="go(index + 1)"
          aria-label="Next slide"
        >
          <span class="carousel-arrow"
            ><i class="ri-arrow-right-s-line"></i
          ></span>
        </button>
      </template>
    </div>

    <div v-if="hasControls" class="carousel-dots">
      <button
        v-for="(slide, i) in slides"
        :key="slide.src"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
        :aria-label="slide.type === 'video' ? 'Demo video' : `Slide ${i + 1}`"
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

/* Full-width box the frame is centred in; the click zones hang off its edges,
   which don't move when the frame resizes. */
.carousel-stage {
  position: relative;
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
.carousel-frame img,
.carousel-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border: 0;
  opacity: 0;
  transform: scale(1.015);
  transition: opacity 0.6s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.carousel-frame img.active,
.carousel-frame iframe.active {
  opacity: 1;
  transform: scale(1);
}
.carousel-frame iframe {
  background: #000;
  pointer-events: none;
}
.carousel-frame iframe.active {
  pointer-events: auto;
}

.carousel-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.carousel-zone.prev {
  left: 0;
  justify-content: flex-start;
}
.carousel-zone.next {
  right: 0;
  justify-content: flex-end;
}
/* Clear of YouTube's title bar and control bar. */
.carousel-zone.video {
  top: 3.5rem;
  bottom: 3.5rem;
}
.carousel-zone:focus-visible {
  outline: none;
}

.carousel-arrow {
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(13, 17, 23, 0.55);
  color: #fff;
  font-size: 1.35rem;
  opacity: 0;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: opacity 0.25s ease, background 0.2s ease;
}
.carousel-stage:hover .carousel-arrow,
.carousel-zone:focus-visible .carousel-arrow {
  opacity: 1;
}
.carousel-zone:hover .carousel-arrow {
  background: rgba(13, 17, 23, 0.8);
}
.carousel-zone:focus-visible .carousel-arrow {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/* No hover on touch screens: keep the arrows visible. */
@media (hover: none) {
  .carousel-arrow {
    opacity: 0.85;
  }
}

.carousel-count {
  position: absolute;
  z-index: 3;
  pointer-events: none;
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
