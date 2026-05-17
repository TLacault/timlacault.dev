<script>
// Replace with real testimonials before going live.
export default {
  name: "FreelanceTestimonials",
  data() {
    return {
      row1: [
        {
          quote:
            "Tim delivered our dashboard in under 3 weeks. The code quality blew our senior devs away.",
          name: "Alexandre M.",
          role: "CTO",
          company: "Iterative",
        },
        {
          quote:
            "From first call to launch, Tim understood exactly what we needed. Shipped clean and on time.",
          name: "Sophie D.",
          role: "Founder",
          company: "LaunchKit",
        },
        {
          quote:
            "The design system Tim built saved us months of work. Every component is documented and reusable.",
          name: "Marc L.",
          role: "Lead Designer",
          company: "Atelier",
        },
        {
          quote:
            "Fast, reliable, communicates clearly. Tim is the freelancer you wish you'd hired from day one.",
          name: "Julie R.",
          role: "Product Manager",
          company: "Nexio",
        },
      ],
      row2: [
        {
          quote:
            "We had a rough MVP and Tim turned it into something we're proud to demo to investors.",
          name: "Théo B.",
          role: "Co-founder",
          company: "Flowlab",
        },
        {
          quote:
            "Responsive, thorough, and delivers what he promises. We'll definitely work with Tim again.",
          name: "Emma V.",
          role: "Head of Engineering",
          company: "Stripe",
        },
        {
          quote:
            "Tim took our idea and made it real in 2 weeks. The UX was exactly what we envisioned.",
          name: "Laura C.",
          role: "CEO",
          company: "Seedling",
        },
        {
          quote:
            "Not just a dev — Tim thinks like a product person. Helped us cut scope and ship faster.",
          name: "Ryan K.",
          role: "Startup Founder",
          company: "BuildFast",
        },
      ],
    };
  },
};
</script>

<template>
  <section class="fl-testimonials">
    <div class="section-header" v-reveal>
      <p class="section-label">Social proof</p>
      <h2 class="section-title">What clients say</h2>
    </div>

    <!-- Row 1: left → right -->
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee-track track-fwd">
        <div
          v-for="(t, i) in [...row1, ...row1]"
          :key="'r1-' + i"
          class="t-card"
        >
          <p class="t-quote">"{{ t.quote }}"</p>
          <div class="t-footer">
            <span class="t-avatar">{{
              t.name
                .split(" ")
                .map((w) => w[0])
                .join("")
            }}</span>
            <div class="t-meta">
              <span class="t-name">{{ t.name }}</span>
              <span class="t-role">{{ t.role }} · {{ t.company }}</span>
            </div>
            <span class="t-stars" aria-hidden="true">★★★★★</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: right → left -->
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee-track track-rev">
        <div
          v-for="(t, i) in [...row2, ...row2]"
          :key="'r2-' + i"
          class="t-card"
        >
          <p class="t-quote">"{{ t.quote }}"</p>
          <div class="t-footer">
            <span class="t-avatar">{{
              t.name
                .split(" ")
                .map((w) => w[0])
                .join("")
            }}</span>
            <div class="t-meta">
              <span class="t-name">{{ t.name }}</span>
              <span class="t-role">{{ t.role }} · {{ t.company }}</span>
            </div>
            <span class="t-stars" aria-hidden="true">★★★★★</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-testimonials {
  width: 100%;
  padding: 8rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  overflow: hidden;
  position: relative;
}
.fl-testimonials::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(94, 201, 255, 0.05),
    transparent 70%
  );
  pointer-events: none;
}

/* Section header */
.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 2rem;
  width: 100%;
  max-width: 1100px;
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

/* Marquee wrapper */
.marquee-wrap {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}
.marquee-wrap:hover .marquee-track {
  animation-play-state: paused;
}

/* Marquee track */
.marquee-track {
  display: flex;
  width: max-content;
  gap: 1.25rem;
  padding: 0.5rem 0;
}
.track-fwd {
  animation: marquee-left 32s linear infinite;
}
.track-rev {
  animation: marquee-left 28s linear infinite reverse;
}
@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Card */
.t-card {
  flex-shrink: 0;
  width: 320px;
  padding: 1.5rem;
  border-radius: 16px;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.t-card:hover {
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
}

.t-quote {
  font-family: "Poppins", sans-serif;
  font-size: 0.87rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--text);
  opacity: 0.75;
  flex: 1;
}

.t-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.t-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(47, 102, 202, 0.5),
    rgba(94, 201, 255, 0.3)
  );
  border: 1px solid rgba(94, 201, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cal Sans", sans-serif;
  font-size: 0.75rem;
  color: var(--accent);
  flex-shrink: 0;
}

.t-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}
.t-name {
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
}
.t-role {
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t-stars {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: #fbbf24;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .fl-testimonials {
    padding: 5rem 0;
  }
  .t-card {
    width: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
