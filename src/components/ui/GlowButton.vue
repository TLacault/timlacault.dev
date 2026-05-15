<script>
export default {
  name: "GlowButton",
  props: {
    tag: { type: String, default: "button" },
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    href: { type: String, default: null },
    target: { type: String, default: null },
  },
  emits: ["click"],
  computed: {
    resolvedTag() {
      return this.href ? "a" : this.tag;
    },
    attrs() {
      if (this.href) return { href: this.href, target: this.target };
      return {};
    },
  },
};
</script>

<template>
  <component
    :is="resolvedTag"
    v-bind="attrs"
    class="glow-btn"
    :class="[`glow-btn--${variant}`, `glow-btn--${size}`]"
    @click="$emit('click', $event)"
  >
    <span class="glow-btn__shimmer" aria-hidden="true"></span>
    <span class="glow-btn__content">
      <slot />
    </span>
  </component>
</template>

<style scoped>
.glow-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: none;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: 10px;
  text-decoration: none;
  isolation: isolate;
  transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.glow-btn--primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: #fff;
}
.glow-btn--primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 40px rgba(47, 102, 202, 0.55),
    0 0 0 1px rgba(94, 201, 255, 0.25);
}
.glow-btn--primary:active {
  transform: scale(0.96);
  transition: transform 0.1s ease;
}

.glow-btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}
.glow-btn--ghost:hover {
  background: rgba(94, 201, 255, 0.07);
  color: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(94, 201, 255, 0.5),
    0 0 24px rgba(94, 201, 255, 0.18);
  transform: translateY(-3px);
}
.glow-btn--ghost:active {
  transform: scale(0.96);
  transition: transform 0.1s ease;
}

.glow-btn--sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.825rem;
}
.glow-btn--md {
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
}
.glow-btn--lg {
  padding: 0.9rem 2.5rem;
  font-size: 1.05rem;
}

/* Shimmer sweep on rollover */
.glow-btn__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 80%
  );
  transform: translateX(-120%) skewX(-10deg);
  transition: none;
  pointer-events: none;
}
.glow-btn:hover .glow-btn__shimmer {
  transform: translateX(120%) skewX(-10deg);
  transition: transform 0.55s ease;
}

.glow-btn__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .glow-btn {
    transition: none;
  }
  .glow-btn__shimmer {
    display: none;
  }
}
</style>
