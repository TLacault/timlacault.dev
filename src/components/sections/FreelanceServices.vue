<script>
export default {
  name: "FreelanceServices",
  data() {
    return {
      services: [
        {
          icon: "ri-window-line",
          title: "Web Applications",
          desc: "From SaaS dashboards to internal tools, I build scalable applications that grow with your business. Full-stack, tested, and ready for production.",
          chips: ["Vue.js", "React", "Node.js", "PostgreSQL", "Docker"],
        },
        {
          icon: "ri-paint-brush-line",
          title: "Design & UI",
          desc: "Pixel-perfect interfaces with motion, depth, and character. I translate your brand into a digital experience people remember and keep coming back to.",
          chips: ["Figma", "Tailwind", "CSS / Motion", "Responsive"],
        },
        {
          icon: "ri-rocket-line",
          title: "Rapid Prototyping",
          desc: "Got an idea but not sure it'll work? I build a functional prototype in days so you can validate with real users before committing to a full build.",
          chips: ["MVP", "User testing", "Agile", "Iterate fast"],
        },
      ],
    };
  },
};
</script>

<template>
  <section class="fl-services">
    <div class="services-inner">
      <div class="section-header" v-reveal>
        <p class="section-label">{{ $t("flServices.label") }}</p>
        <h2 class="section-title">{{ $t("flServices.title") }}</h2>
      </div>

      <div class="services-grid">
        <div
          v-for="(s, i) in services"
          :key="s.title"
          class="service-card"
          v-reveal
          :style="`--reveal-delay: ${i * 110}ms`"
        >
          <div class="card-glow"></div>

          <div class="service-icon-wrap" aria-hidden="true">
            <i :class="[s.icon, 'service-icon']"></i>
          </div>

          <h3 class="service-title">{{ $t(`flServices.s${i}Title`) }}</h3>
          <p class="service-desc">{{ $t(`flServices.s${i}Desc`) }}</p>

          <div class="service-divider" aria-hidden="true"></div>

          <div class="service-chips">
            <span v-for="c in s.chips" :key="c" class="chip">{{ c }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-services {
  width: 100%;
  padding: 8rem 2rem;
  display: flex;
  justify-content: center;
  position: relative;
}

.services-inner {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
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

/* Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* Card */
.service-card {
  position: relative;
  border-radius: 18px;
  padding: 2rem;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(16px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease, box-shadow 0.35s ease;
  cursor: default;
}
.service-card:hover {
  transform: translateY(-6px);
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
}
.service-card:hover .card-glow {
  opacity: 0.8;
}
.service-card:hover .service-chips {
  opacity: 1;
  transform: translateY(0);
}

/* Glow overlay */
.card-glow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(47, 102, 202, 0.2),
    transparent 65%
  );
  opacity: 0.04;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

/* Icon */
.service-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(47, 102, 202, 0.12);
  border: 1px solid rgba(94, 201, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.service-icon {
  font-size: 1.4rem;
  color: var(--accent);
}

/* Text */
.service-title {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.4rem;
  color: var(--text);
  line-height: 1.2;
}
.service-desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.75;
  color: var(--text-muted);
  flex: 1;
}

/* Divider */
.service-divider {
  height: 1px;
  background: linear-gradient(to right, var(--glow-card-border), transparent);
}

/* Chips — revealed on hover */
.service-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.chip {
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  background: rgba(47, 102, 202, 0.08);
  border: 1px solid rgba(94, 201, 255, 0.16);
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent);
}

/* Responsive */
@media (max-width: 900px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
  .service-card:last-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 560px) {
  .fl-services {
    padding: 5rem 1.25rem;
  }
  .services-grid {
    grid-template-columns: 1fr;
  }
  .service-card:last-child {
    grid-column: auto;
  }
  /* always show chips on mobile (no hover) */
  .service-chips {
    opacity: 1;
    transform: none;
  }
}
</style>
