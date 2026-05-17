<script>
import GlowButton from "@/components/ui/GlowButton.vue";

export default {
  name: "FreelanceCta",
  components: { GlowButton },
  data() {
    return {
      buildIdx: 0,
      buildShown: true,
    };
  },
  computed: {
    buildItems() {
      return this.$ta("flCta.buildItems");
    },
  },
  mounted() {
    this._rotator = setInterval(() => {
      this.buildShown = false;
      setTimeout(() => {
        this.buildIdx = (this.buildIdx + 1) % this.buildItems.length;
        this.buildShown = true;
      }, 350);
    }, 2800);
  },
  beforeUnmount() {
    clearInterval(this._rotator);
  },
};
</script>

<template>
  <section class="fl-cta">
    <span class="cta-glow g1" aria-hidden="true"></span>
    <span class="cta-glow g2" aria-hidden="true"></span>

    <div class="cta-inner">
      <!-- Left column -->
      <div class="cta-left" v-reveal>
        <p class="section-label">{{ $t("flCta.label") }}</p>
        <h2 class="cta-title">
          {{ $t("flCta.titleLine1") }}<br />{{ $t("flCta.titleLine2")
          }}<em>{{ $t("flCta.titleEm") }}</em>
        </h2>
        <p class="cta-sub">{{ $t("flCta.sub") }}</p>

        <div class="avail-pill">
          <span class="avail-dot"></span>
          <span>{{ $t("flCta.avail") }}</span>
        </div>

        <div class="cta-actions">
          <GlowButton
            tag="a"
            href="https://cal.com/tim-lacault/30min"
            target="_blank"
            variant="primary"
            size="lg"
          >
            {{ $t("flCta.bookCall") }}
            <i class="ri-calendar-event-line"></i>
          </GlowButton>
          <a href="mailto:lacault.tim@gmail.com" class="email-link">
            lacault.tim@gmail.com
            <i class="ri-arrow-right-up-line"></i>
          </a>
        </div>
      </div>

      <!-- Right column -->
      <div
        class="cta-right"
        aria-hidden="true"
        v-reveal
        style="--reveal-delay: 180ms"
      >
        <p class="build-label">{{ $t("flCta.buildLabel") }}</p>
        <div class="build-rotator">
          <span class="build-word" :class="{ shown: buildShown }">
            {{ buildItems[buildIdx] }}
          </span>
        </div>
        <p class="build-sub">{{ $t("flCta.buildSub") }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-cta {
  position: relative;
  width: 100%;
  padding: 8rem 2rem 10rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

/* Background glows */
.cta-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.g1 {
  width: 600px;
  height: 600px;
  top: -100px;
  right: -100px;
  background: radial-gradient(
    circle,
    rgba(47, 102, 202, 0.14),
    transparent 70%
  );
  filter: blur(80px);
}
.g2 {
  width: 500px;
  height: 500px;
  bottom: -80px;
  left: -80px;
  background: radial-gradient(
    circle,
    rgba(94, 201, 255, 0.08),
    transparent 70%
  );
  filter: blur(80px);
}

.cta-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  gap: 4rem;
}

/* Left */
.cta-left {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.section-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.cta-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 3.75rem);
  color: var(--text);
  line-height: 1.1;
}
.cta-title em {
  font-style: normal;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.cta-sub {
  font-family: "Poppins", sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 420px;
}

/* Availability pill */
.avail-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.25);
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4ade80;
  width: fit-content;
}
.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74, 222, 128, 0.4);
  animation: pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74, 222, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 3px #4ade80;
  }
}

/* Actions */
.cta-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.email-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: transparent;
  transition: color 0.25s ease, text-decoration-color 0.25s ease;
}
.email-link:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}
.email-link i {
  font-size: 0.85rem;
}

/* Right — rotating build word */
.cta-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.build-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.build-rotator {
  min-height: clamp(3.5rem, 6vw, 5.5rem);
  display: flex;
  align-items: center;
}

.build-word {
  display: block;
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  line-height: 1.1;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.build-word.shown {
  opacity: 1;
  transform: translateY(0);
}

.build-sub {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: var(--text-faint);
}

/* Responsive */
@media (max-width: 800px) {
  .cta-inner {
    flex-direction: column;
    gap: 3rem;
  }
  .cta-right {
    align-items: center;
    text-align: center;
    width: 100%;
  }
  .build-rotator {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .fl-cta {
    padding: 5rem 1.25rem 7rem;
  }
  .cta-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avail-dot {
    animation: none;
  }
  .build-word {
    transition: none;
  }
}
</style>
