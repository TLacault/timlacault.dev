<script>
import GlowButton from "@/components/ui/GlowButton.vue";

export default {
  name: "AboutSection",
  components: { GlowButton },
  data() {
    return {
      stack: [
        { name: "Vue.js", icon: "ri-vuejs-line" },
        { name: "React", icon: "ri-reactjs-line" },
        { name: "TypeScript", icon: "ri-code-s-slash-line" },
        { name: "Node.js", icon: "ri-nodejs-line" },
        { name: "Python", icon: "ri-python-line" },
        { name: "Docker", icon: "ri-server-line" },
        { name: "PostgreSQL", icon: "ri-database-2-line" },
        { name: "Git", icon: "ri-git-branch-line" },
      ],
      stats: [
        { value: "10+", label: "Projects shipped" },
        { value: "6+", label: "Years coding" },
        { value: "∞", label: "Curiosity" },
      ],
    };
  },
};
</script>

<template>
  <section class="about-section">
    <div class="about-container">
      <div class="section-header" v-reveal>
        <p class="section-label">About me</p>
        <h2 class="section-title">The person behind the code</h2>
      </div>

      <div class="bento">
        <!-- Bio card -->
        <div class="bento-card bio-card" v-reveal style="--reveal-delay: 0ms">
          <div class="card-glow"></div>
          <div class="bio-inner">
            <div class="avatar-ring">
              <div class="avatar-placeholder">TL</div>
            </div>
            <div class="bio-text">
              <h3>Hey, I'm Tim</h3>
              <p>
                Undergraduate software engineer based in
                <strong>Bordeaux, France</strong>. I love crafting slick,
                performant web experiences — from polished UIs to solid backend
                systems. Currently studying at Enseirb and building things in my
                spare time.
              </p>
            </div>
          </div>
        </div>

        <!-- Stack card -->
        <div
          class="bento-card stack-card"
          v-reveal
          style="--reveal-delay: 80ms"
        >
          <div class="card-glow"></div>
          <p class="card-label"><i class="ri-code-box-line"></i> Stack</p>
          <div class="stack-grid">
            <div v-for="tech in stack" :key="tech.name" class="stack-chip">
              <i :class="tech.icon"></i>
              <span>{{ tech.name }}</span>
            </div>
          </div>
        </div>

        <!-- Location card -->
        <div
          class="bento-card location-card"
          v-reveal
          style="--reveal-delay: 160ms"
        >
          <div class="card-glow"></div>
          <p class="card-label"><i class="ri-map-pin-line"></i> Location</p>
          <div class="location-inner">
            <div class="location-map-dot"></div>
            <div>
              <p class="location-city">Bordeaux</p>
              <p class="location-country">France 🇫🇷</p>
            </div>
          </div>
        </div>

        <!-- Availability card -->
        <div
          class="bento-card avail-card"
          v-reveal
          style="--reveal-delay: 240ms"
        >
          <div class="card-glow avail-glow"></div>
          <p class="card-label"><i class="ri-flashlight-line"></i> Status</p>
          <div class="avail-inner">
            <div class="avail-badge">
              <span class="avail-dot"></span>
              <span>Available</span>
            </div>
            <p class="avail-sub">Open to internships &amp; freelance</p>
            <GlowButton
              tag="a"
              href="https://cal.com/tim-lacault/30min"
              target="_blank"
              variant="primary"
              size="sm"
            >
              Let's talk <i class="ri-arrow-right-up-line"></i>
            </GlowButton>
          </div>
        </div>

        <!-- Stats card -->
        <div
          class="bento-card stats-card"
          v-reveal
          style="--reveal-delay: 320ms"
        >
          <div class="card-glow"></div>
          <div class="stats-row">
            <div v-for="stat in stats" :key="stat.label" class="stat">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  position: relative;
  width: 100%;
  padding: 8rem 1.5rem;
  display: flex;
  justify-content: center;
}
.about-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(47, 102, 202, 0.1),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.about-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Section header */
.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.section-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}
.section-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text);
  line-height: 1.15;
}

/* Bento grid */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1rem;
}

/* Card base */
.bento-card {
  position: relative;
  border-radius: 16px;
  padding: 1.75rem;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(16px);
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
  cursor: default;
}
.bento-card:hover {
  transform: translateY(-6px);
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
}
.bento-card:hover .card-glow {
  opacity: 0.85;
}

/* Per-card glow overlay */
.card-glow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(47, 102, 202, 0.22) 0%,
    transparent 65%
  );
  opacity: 0.04;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}
.avail-glow {
  background: radial-gradient(
    circle at 50% 0%,
    rgba(74, 222, 128, 0.2) 0%,
    transparent 65%
  );
}

.card-label {
  position: relative;
  z-index: 1;
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.4;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Bio card */
.bio-card {
  grid-column: 1 / 3;
  grid-row: 1;
}
.bio-inner {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}
.avatar-ring {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cal Sans", sans-serif;
  font-size: 1.3rem;
  color: var(--accent);
}
.bio-text h3 {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.4rem;
  color: var(--text);
  margin-bottom: 0.75rem;
}
.bio-text p {
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--text);
  opacity: 0.65;
}
.bio-text strong {
  color: var(--text);
  opacity: 1;
  font-weight: 600;
}

/* Stack card */
.stack-card {
  grid-column: 3;
  grid-row: 1 / 3;
}
.stack-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.stack-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.75;
  transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease,
    transform 0.2s ease, box-shadow 0.2s ease;
}
.stack-chip i {
  font-size: 1rem;
  color: var(--accent);
}
.stack-chip:hover {
  background: rgba(94, 201, 255, 0.07);
  border-color: rgba(94, 201, 255, 0.3);
  opacity: 1;
  transform: scale(1.04);
  box-shadow: 0 4px 16px rgba(94, 201, 255, 0.12);
}

/* Location card */
.location-card {
  grid-column: 1;
  grid-row: 2;
}
.location-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.location-map-dot {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(47, 102, 202, 0.15);
  border: 1px solid rgba(47, 102, 202, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.location-map-dot::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}
.location-city {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.25rem;
  color: var(--text);
}
.location-country {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.45;
  margin-top: 0.2rem;
}

/* Availability card */
.avail-card {
  grid-column: 2;
  grid-row: 2;
}
.avail-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.avail-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.25);
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4ade80;
  width: fit-content;
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
    box-shadow: 0 0 8px #4ade80;
  }
  50% {
    box-shadow: 0 0 3px #4ade80;
  }
}
.avail-sub {
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.45;
  line-height: 1.5;
}

/* Stats card */
.stats-card {
  grid-column: 1 / -1;
}
.stats-row {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.stat-value {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  background: linear-gradient(135deg, var(--accent), var(--primary));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1;
}
.stat-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--text);
  opacity: 0.45;
  text-align: center;
}

/* Scroll reveal */
[v-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
[v-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 900px) {
  .bento {
    grid-template-columns: 1fr 1fr;
  }
  .bio-card {
    grid-column: 1 / -1;
  }
  .stack-card {
    grid-column: 1 / -1;
    grid-row: auto;
  }
  .stack-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .location-card {
    grid-column: 1;
  }
  .avail-card {
    grid-column: 2;
  }
  .stats-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .bento {
    grid-template-columns: 1fr;
  }
  .bio-card,
  .stack-card,
  .location-card,
  .avail-card,
  .stats-card {
    grid-column: 1;
    grid-row: auto;
  }
  .bio-inner {
    flex-direction: column;
  }
  .stack-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-row {
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bento-card,
  [v-reveal] {
    transition: none;
  }
  .avail-dot {
    animation: none;
  }
}
</style>
