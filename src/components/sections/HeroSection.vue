<script>
import GlowButton from "@/components/ui/GlowButton.vue";

export default {
  name: "HeroSection",
  components: { GlowButton },
  data() {
    return {
      first: "Tim".split(""),
      last: "Lacault".split(""),
    };
  },
  mounted() {
    this.setupBounce();
  },
  methods: {
    setupBounce() {
      const spans = this.$el.querySelectorAll(".name-letter");
      spans.forEach((el) => {
        let active = false;
        el.addEventListener("mouseenter", () => {
          if (active) return;
          active = true;
          el.classList.add("bounce");
          setTimeout(() => {
            el.classList.remove("bounce");
            active = false;
          }, 600);
        });
      });
    },
  },
};
</script>

<template>
  <section class="hero-section">
    <span class="glow glow-1" aria-hidden="true"></span>
    <span class="glow glow-2" aria-hidden="true"></span>
    <span class="glow glow-3" aria-hidden="true"></span>

    <div class="hero-inner">
      <div class="badge slide-up" style="--delay: 0s">
        <span class="badge__dot"></span>
        <span>Open to work &amp; projects</span>
      </div>

      <div class="title slide-up" style="--delay: 0.1s">
        <h2>Hey, I'm</h2>
        <h1>
          <span
            v-for="(l, i) in first"
            :key="'f' + i"
            class="name-letter"
            :style="{ animationDelay: `${0.1 * i}s` }"
            >{{ l }}</span
          ><span class="name-gap"></span
          ><span
            v-for="(l, i) in last"
            :key="'l' + i"
            class="name-letter"
            :style="{ animationDelay: `${0.1 * (first.length + i)}s` }"
            >{{ l }}</span
          >
        </h1>
        <h3>
          Undergraduate <span>Software Engineer</span> and
          <span>Web Freelance</span> based in Bordeaux 🍇
        </h3>
      </div>

      <div class="cta-row slide-up" style="--delay: 0.3s">
        <GlowButton
          tag="router-link"
          href="/project"
          variant="primary"
          size="lg"
        >
          View Projects
          <i class="ri-arrow-right-line"></i>
        </GlowButton>
        <GlowButton
          tag="a"
          href="https://cal.com/tim-lacault/30min"
          target="_blank"
          variant="ghost"
          size="lg"
        >
          Book a Call
          <i class="ri-calendar-event-line"></i>
        </GlowButton>
      </div>

      <div class="socials slide-up" style="--delay: 0.45s">
        <a
          href="https://github.com/TLacault"
          target="_blank"
          rel="noopener"
          class="social-link"
          aria-label="GitHub"
        >
          <i class="ri-github-line"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/tim-lacault"
          target="_blank"
          rel="noopener"
          class="social-link"
          aria-label="LinkedIn"
        >
          <i class="ri-linkedin-line"></i>
        </a>
        <a
          href="mailto:lacault.tim@gmail.com"
          class="social-link"
          aria-label="Email"
        >
          <i class="ri-mail-line"></i>
        </a>
      </div>
    </div>

    <div class="scroll-cue slide-up" style="--delay: 0.7s" aria-hidden="true">
      <span class="scroll-label">scroll</span>
      <div class="scroll-mouse">
        <span class="scroll-wheel"></span>
      </div>
      <div class="scroll-chevrons">
        <span class="scroll-chv chv-1"></span>
        <span class="scroll-chv chv-2"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
}

/* Glows */
.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.glow-1 {
  width: 650px;
  height: 650px;
  top: -220px;
  left: -180px;
  background: radial-gradient(
    circle,
    rgba(114, 119, 255, 0.18),
    transparent 70%
  );
  filter: blur(70px);
  animation: drift 14s ease-in-out infinite alternate;
}
.glow-2 {
  width: 750px;
  height: 750px;
  top: -130px;
  right: -220px;
  background: radial-gradient(circle, rgba(0, 89, 255, 0.15), transparent 70%);
  filter: blur(90px);
  animation: drift 18s ease-in-out infinite alternate-reverse;
}
.glow-3 {
  width: 450px;
  height: 450px;
  bottom: -80px;
  left: 50%;
  margin-left: -225px;
  background: radial-gradient(
    circle,
    rgba(70, 227, 255, 0.12),
    transparent 70%
  );
  filter: blur(70px);
  animation: drift 11s ease-in-out infinite alternate;
}

@keyframes drift {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(40px, 25px);
  }
}

/* Inner */
.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
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
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.03em;
}
.badge__dot {
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

/* Title — restored original style */
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.title h2 {
  font-family: "Cal Sans", sans-serif;
  font-size: 2.5rem;
  color: var(--text);
  opacity: 0.8;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(4.5rem, 11vw, 8.5rem);
  line-height: 1;
  user-select: none;
}

.name-letter {
  display: inline-block;
  background: linear-gradient(0deg, var(--primary) 30%, var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  font-weight: 700;
  color: transparent;
  cursor: default;
  will-change: transform;
  animation: float 6s ease-in-out infinite;
}

/* .name-letter.bounce {
  animation: letter-bounce 0.6s ease both;
} */

.name-gap {
  display: inline-block;
  width: 0.3em;
}

@keyframes float {
  0%,
  40% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
    filter: drop-shadow(0 0 8px var(--accent));
  }
  60%,
  100% {
    transform: translateY(0);
  }
}

@keyframes letter-bounce {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  20% {
    transform: translateY(-18px) rotate(-4deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
  75% {
    transform: translateY(-12px) rotate(-2deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.title h3 {
  font-family: "Poppins", sans-serif;
  font-size: clamp(0.95rem, 2vw, 1.2rem);
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
.title h3 span {
  color: var(--accent);
  font-weight: 500;
}

/* CTAs */
.cta-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Socials */
.socials {
  display: flex;
  gap: 1rem;
}
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--text-subtle);
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease,
    transform 0.25s ease, box-shadow 0.25s ease;
}
.social-link:hover {
  color: var(--accent);
  background: rgba(94, 201, 255, 0.08);
  border-color: rgba(94, 201, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(94, 201, 255, 0.2);
}

/* Scroll cue */
.scroll-cue {
  position: absolute;
  bottom: 2.5rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scroll-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-faint);
  animation: scroll-label-breathe 3s ease-in-out infinite;
}

@keyframes scroll-label-breathe {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.85;
  }
}

.scroll-mouse {
  width: 22px;
  height: 36px;
  border: 1.5px solid rgba(94, 201, 255, 0.22);
  border-radius: 11px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
  position: relative;
  animation: scroll-mouse-glow 3s ease-in-out infinite;
}

@keyframes scroll-mouse-glow {
  0%,
  100% {
    border-color: rgba(94, 201, 255, 0.18);
    box-shadow: none;
  }
  50% {
    border-color: rgba(94, 201, 255, 0.42);
    box-shadow: 0 0 14px rgba(94, 201, 255, 0.1);
  }
}

.scroll-wheel {
  width: 3px;
  height: 7px;
  background: var(--accent);
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(94, 201, 255, 0.7);
  animation: scroll-wheel-drop 2.4s cubic-bezier(0.33, 0.9, 0.66, 1) infinite;
}

@keyframes scroll-wheel-drop {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  45% {
    transform: translateY(10px);
    opacity: 0.25;
  }
  60% {
    opacity: 0;
    transform: translateY(10px);
  }
  61% {
    transform: translateY(0);
    opacity: 0;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.scroll-chevrons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.scroll-chv {
  display: block;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid rgba(94, 201, 255, 0.5);
  border-bottom: 1.5px solid rgba(94, 201, 255, 0.5);
  transform: rotate(45deg);
  opacity: 0;
}

.scroll-chv.chv-1 {
  animation: scroll-chv-pulse 2.4s ease-in-out 0.1s infinite;
}
.scroll-chv.chv-2 {
  animation: scroll-chv-pulse 2.4s ease-in-out 0.35s infinite;
}

@keyframes scroll-chv-pulse {
  0%,
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(-1px, -1px);
  }
  40%,
  60% {
    opacity: 0.55;
    transform: rotate(45deg) translate(2px, 2px);
  }
}

/* Entry animations */
.slide-up {
  opacity: 0;
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
@media (max-width: 480px) {
  .hero-inner {
    padding: 0 1.5rem;
    gap: 1.75rem;
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

/* Light theme adjustments */
:global([data-theme="light"]) .glow-1 {
  background: radial-gradient(
    circle,
    rgba(114, 119, 255, 0.15),
    transparent 68%
  );
}
:global([data-theme="light"]) .glow-2 {
  background: radial-gradient(
    circle,
    rgba(53, 107, 208, 0.12),
    transparent 68%
  );
}
:global([data-theme="light"]) .glow-3 {
  background: radial-gradient(circle, rgba(85, 180, 221, 0.1), transparent 68%);
}
:global([data-theme="light"]) .badge {
  border-color: rgba(53, 107, 208, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .name-letter,
  .scroll-cue i {
    animation: none;
  }
  .slide-up {
    animation: none;
    opacity: 1;
  }
}
</style>
