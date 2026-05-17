<script>
import GlowButton from "@/components/ui/GlowButton.vue";

export default {
  name: "FreelanceHero",
  components: { GlowButton },
  data() {
    return {
      tickers: [
        "Startups",
        "SaaS",
        "Agencies",
        "E-commerce",
        "Open Source",
        "MVPs",
        "Dashboards",
        "Design Systems",
        "Web Apps",
        "Prototypes",
      ],
    };
  },
};
</script>

<template>
  <section class="fl-hero">
    <span class="glow g1" aria-hidden="true"></span>
    <span class="glow g2" aria-hidden="true"></span>
    <span class="glow g3" aria-hidden="true"></span>

    <div class="fl-inner">
      <div class="badge slide-up" style="--delay: 0s">
        <span class="badge-dot"></span>
        <span>{{ $t("flHero.badge") }}</span>
      </div>

      <h1 class="slide-up" style="--delay: 0.1s">
        {{ $t("flHero.titleLine1") }}<br />{{ $t("flHero.titleLine2")
        }}<em>{{ $t("flHero.titleEm") }}</em>
      </h1>

      <p class="tagline slide-up" style="--delay: 0.22s">
        {{ $t("flHero.tagline1") }}
        <br class="br-desk" />{{ $t("flHero.tagline2") }}
      </p>

      <div class="cta-row slide-up" style="--delay: 0.34s">
        <GlowButton
          tag="a"
          href="https://cal.com/tim-lacault/30min"
          target="_blank"
          variant="primary"
          size="lg"
        >
          {{ $t("flHero.bookCall") }}
          <i class="ri-calendar-event-line"></i>
        </GlowButton>
        <GlowButton
          tag="a"
          href="mailto:lacault.tim@gmail.com"
          variant="ghost"
          size="lg"
        >
          {{ $t("flHero.sendBrief") }}
          <i class="ri-arrow-right-line"></i>
        </GlowButton>
      </div>
    </div>

    <div class="ticker slide-up" style="--delay: 0.5s" aria-hidden="true">
      <div class="ticker-track">
        <span
          v-for="(t, i) in [...tickers, ...tickers]"
          :key="i"
          class="ticker-item"
          >{{ t }}<span class="sep">·</span></span
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-hero {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: 5rem;
}

/* Glows */
.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.g1 {
  width: 700px;
  height: 700px;
  top: -200px;
  left: -200px;
  background: radial-gradient(
    circle,
    rgba(114, 119, 255, 0.16),
    transparent 70%
  );
  filter: blur(80px);
  animation: drift 16s ease-in-out infinite alternate;
}
.g2 {
  width: 800px;
  height: 800px;
  top: -100px;
  right: -250px;
  background: radial-gradient(circle, rgba(0, 89, 255, 0.13), transparent 70%);
  filter: blur(100px);
  animation: drift 20s ease-in-out infinite alternate-reverse;
}
.g3 {
  width: 500px;
  height: 500px;
  bottom: -100px;
  left: 50%;
  margin-left: -250px;
  background: radial-gradient(circle, rgba(70, 227, 255, 0.1), transparent 70%);
  filter: blur(80px);
  animation: drift 13s ease-in-out infinite alternate;
}
@keyframes drift {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(40px, 30px);
  }
}

/* Content */
.fl-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  padding: 0 1.5rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: var(--glow-card-bg);
  border: 1px solid rgba(94, 201, 255, 0.3);
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80, 0 0 20px rgba(74, 222, 128, 0.4);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 10px #4ade80, 0 0 20px rgba(74, 222, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 4px #4ade80;
  }
}

/* Headline */
h1 {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(3rem, 7vw, 6.5rem);
  color: var(--text);
  line-height: 1.08;
  max-width: 880px;
}
h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Tagline */
.tagline {
  font-family: "Poppins", sans-serif;
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 520px;
}

/* CTAs */
.cta-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Ticker */
.ticker {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 12%,
    black 88%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 12%,
    black 88%,
    transparent
  );
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 24s linear infinite;
}
.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0.25rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
  white-space: nowrap;
}
.sep {
  color: var(--accent);
  opacity: 0.45;
}
@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Entry animations */
.slide-up {
  opacity: 0;
  animation: slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(28px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Responsive */
.br-desk {
  display: block;
}

@media (max-width: 600px) {
  .fl-hero {
    gap: 3rem;
  }
  .fl-inner {
    padding: 5rem 1.5rem 2rem;
  }
  .br-desk {
    display: none;
  }
  .cta-row {
    flex-direction: column;
    width: 100%;
  }
  .cta-row :deep(.glow-btn) {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .ticker-track {
    animation: none;
  }
  .slide-up {
    animation: none;
    opacity: 1;
  }
  .badge-dot {
    animation: none;
  }
}
</style>
