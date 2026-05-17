<script>
export default {
  name: "TeaseSection",
};
</script>

<template>
  <section class="tease-section">
    <div class="tease-container">
      <div class="tease-header" v-reveal>
        <p class="section-label">{{ $t("tease.label") }}</p>
        <h2 class="section-title">{{ $t("tease.title") }}</h2>
      </div>

      <div class="tease-grid">
        <!-- Projects card -->
        <router-link
          to="/project"
          class="tease-card projects-card"
          v-reveal
          style="--reveal-delay: 60ms"
        >
          <div class="card-bg-grid" aria-hidden="true">
            <span v-for="n in 9" :key="n" class="grid-cell"></span>
          </div>
          <div class="card-content">
            <span class="card-kicker">{{ $t("tease.projectsKicker") }}</span>
            <h3 class="card-title">{{ $t("tease.projectsTitle") }}</h3>
            <p class="card-desc">{{ $t("tease.projectsDesc") }}</p>
          </div>
          <div class="card-cta">
            <span>{{ $t("tease.projectsCta") }}</span>
            <i class="ri-arrow-right-line"></i>
          </div>
          <div class="card-glow-overlay"></div>
        </router-link>

        <!-- Freelance card -->
        <router-link
          to="/freelance"
          class="tease-card freelance-card"
          v-reveal
          style="--reveal-delay: 140ms"
        >
          <div class="card-content">
            <span class="card-kicker">{{ $t("tease.freelanceKicker") }}</span>
            <h3 class="card-title">{{ $t("tease.freelanceTitle") }}</h3>
            <p class="card-desc">{{ $t("tease.freelanceDesc") }}</p>
          </div>
          <div class="card-cta">
            <span>{{ $t("tease.freelanceCta") }}</span>
            <i class="ri-arrow-right-line"></i>
          </div>
          <div class="avail-pill">
            <span class="avail-dot"></span>{{ $t("tease.freelanceAvail") }}
          </div>
          <div class="card-glow-overlay freelance-glow"></div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tease-section {
  width: 100%;
  padding: 6rem 1.5rem;
  display: flex;
  justify-content: center;
}

.tease-container {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.tease-header {
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

/* Cards grid */
.tease-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1rem;
  align-items: stretch;
}

/* Base card */
.tease-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--glow-card-border);
  background: var(--glow-card-bg);
  backdrop-filter: blur(16px);
  overflow: hidden;
  text-decoration: none;
  min-height: 320px;
  transition: border-color 0.35s ease,
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
  cursor: pointer;
}
.tease-card:hover {
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
  transform: translateY(-6px);
}
.tease-card:hover .card-glow-overlay {
  opacity: 1;
}
.tease-card:hover .card-cta i {
  transform: translateX(4px);
}

/* Glow overlay */
.card-glow-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 110%,
    rgba(47, 102, 202, 0.18) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.freelance-glow {
  background: radial-gradient(
    ellipse at 50% 110%,
    rgba(94, 201, 255, 0.14) 0%,
    transparent 65%
  );
}

/* Decorative grid (projects card) */
.card-bg-grid {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  opacity: 0.12;
  transition: opacity 0.3s ease;
}
.projects-card:hover .card-bg-grid {
  opacity: 0.22;
}
.grid-cell {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--primary);
}
.grid-cell:nth-child(3n) {
  background: var(--accent);
}
.grid-cell:nth-child(5) {
  background: rgba(114, 119, 255, 0.6);
}

/* Content */
.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.card-kicker {
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}
.card-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: var(--text);
  line-height: 1.1;
}
.card-desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 36ch;
}

/* CTA row */
.card-cta {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
}
.card-cta i {
  transition: transform 0.25s ease;
}

/* Availability pill (freelance) */
.avail-pill {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #4ade80;
  z-index: 1;
}
.avail-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 6px #4ade80;
  }
  50% {
    box-shadow: 0 0 2px #4ade80;
  }
}

/* Reveal */
[v-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
[v-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 680px) {
  .tease-grid {
    grid-template-columns: 1fr;
  }
  .tease-card {
    min-height: 260px;
  }
}
</style>
