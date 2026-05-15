<script>
import GlowButton from "@/components/ui/GlowButton.vue";
export default {
  name: "ContactBanner",
  components: { GlowButton },
};
</script>

<template>
  <section class="contact-banner">
    <div class="banner-glow" aria-hidden="true"></div>

    <div class="banner-inner">
      <div class="banner-rule" v-reveal></div>

      <div class="banner-body" v-reveal style="--reveal-delay: 60ms">
        <div class="banner-text">
          <span class="banner-eyebrow">What's next</span>
          <h2 class="banner-title">Have an idea?<br />Let's make it real.</h2>
          <p class="banner-sub">
            Whether it's a full product, a single feature, or just a
            conversation — I'm always open to something interesting.
          </p>
        </div>

        <div class="banner-cta">
          <GlowButton
            tag="router-link"
            href="/contact"
            variant="primary"
            size="lg"
          >
            Let's talk
            <i class="ri-arrow-right-up-line"></i>
          </GlowButton>
          <span class="banner-avail">
            <span class="avail-dot"></span>
            Available for new projects
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-banner {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem 5rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.banner-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 60% 50%,
    rgba(47, 102, 202, 0.1) 0%,
    transparent 65%
  );
  pointer-events: none;
  filter: blur(40px);
}

.banner-inner {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.banner-rule {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--glow-card-border) 20%,
    var(--glow-card-hover-border) 50%,
    var(--glow-card-border) 80%,
    transparent
  );
}

.banner-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 560px;
}

.banner-eyebrow {
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.banner-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  color: var(--text);
  line-height: 1.1;
}

.banner-sub {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 46ch;
}

.banner-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
}

.banner-avail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4ade80;
}

.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74, 222, 128, 0.3);
  }
  50% {
    box-shadow: 0 0 3px #4ade80;
  }
}

/* Reveal */
[v-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
[v-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}
/* The rule has no translateY animation */
.banner-rule[v-reveal] {
  transform: scaleX(0.6);
  transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left;
}
.banner-rule[v-reveal].is-revealed {
  transform: scaleX(1);
}

@media (max-width: 680px) {
  .banner-body {
    flex-direction: column;
    align-items: flex-start;
  }
  .banner-cta {
    width: 100%;
  }
}
</style>
