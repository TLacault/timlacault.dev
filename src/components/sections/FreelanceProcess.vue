<script>
export default {
  name: "FreelanceProcess",
  data() {
    return {
      steps: [
        {
          icon: "ri-chat-3-line",
          title: "Discovery",
          desc: "30 min call to understand your goals, constraints, and vision. I ask the questions others skip.",
        },
        {
          icon: "ri-file-text-line",
          title: "Proposal",
          desc: "A detailed scope, timeline, and fixed quote. You know exactly what you're getting before signing.",
        },
        {
          icon: "ri-pen-nib-line",
          title: "Design sprint",
          desc: "Wireframes and hi-fi mockups first. You approve the look before a single line of code is written.",
        },
        {
          icon: "ri-code-s-slash-line",
          title: "Development",
          desc: "Clean, documented code. Weekly updates, a staging URL, and no radio silence.",
        },
        {
          icon: "ri-rocket-2-line",
          title: "Launch",
          desc: "Deploy to production, handoff docs, and post-launch support. I stay reachable after we ship.",
        },
      ],
    };
  },
};
</script>

<template>
  <section class="fl-process">
    <div class="process-inner">
      <div class="section-header" v-reveal>
        <p class="section-label">{{ $t("flProcess.label") }}</p>
        <h2 class="section-title">
          {{ $t("flProcess.titleLine1") }}<br />{{ $t("flProcess.titleLine2") }}
        </h2>
      </div>

      <div class="process-track" v-reveal style="--reveal-delay: 150ms">
        <div class="process-line" aria-hidden="true"></div>

        <div v-for="(step, i) in steps" :key="step.title" class="process-step">
          <div class="step-top">
            <div class="step-badge">{{ i + 1 }}</div>
          </div>
          <div class="step-content">
            <i :class="[step.icon, 'step-icon']" aria-hidden="true"></i>
            <h3 class="step-title">{{ $t(`flProcess.step${i}Title`) }}</h3>
            <p class="step-desc">{{ $t(`flProcess.step${i}Desc`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-process {
  width: 100%;
  padding: 8rem 2rem;
  display: flex;
  justify-content: center;
  position: relative;
}
.fl-process::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(47, 102, 202, 0.08),
    transparent 70%
  );
  pointer-events: none;
}

.process-inner {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 4rem;
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
  line-height: 1.2;
}

/* Process track */
.process-track {
  position: relative;
  display: flex;
  gap: 0;
}

/* Connecting gradient line — horizontal, through badge centers */
.process-line {
  position: absolute;
  top: 23px; /* center of 48px badge */
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(94, 201, 255, 0.28) 15%,
    rgba(94, 201, 255, 0.28) 85%,
    transparent
  );
  pointer-events: none;
}

/* Each step */
.process-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.75rem;
  text-align: center;
  cursor: default;
}

.step-top {
  margin-bottom: 1.5rem;
}

.step-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--background);
  border: 1.5px solid var(--glow-card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cal Sans", sans-serif;
  font-size: 1.1rem;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease,
    background 0.3s ease;
}
.process-step:hover .step-badge {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(94, 201, 255, 0.2),
    0 0 0 5px rgba(94, 201, 255, 0.06);
  color: var(--accent);
  background: rgba(94, 201, 255, 0.04);
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.step-icon {
  font-size: 1.25rem;
  color: var(--text-subtle);
  transition: color 0.3s ease;
}
.process-step:hover .step-icon {
  color: var(--accent);
}

.step-title {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.1rem;
  color: var(--text);
  line-height: 1.2;
}

.step-desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.65;
  color: var(--text-subtle);
  transition: color 0.3s ease;
}
.process-step:hover .step-desc {
  color: var(--text-muted);
}

/* Responsive — vertical stack */
@media (max-width: 800px) {
  .process-track {
    flex-direction: column;
    gap: 0;
    padding-left: 1.5rem;
  }
  .process-line {
    top: 24px;
    left: 23px;
    right: auto;
    width: 1px;
    height: calc(100% - 48px);
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(94, 201, 255, 0.28) 10%,
      rgba(94, 201, 255, 0.28) 90%,
      transparent
    );
  }
  .process-step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    padding: 0 0 2.5rem 0;
    gap: 1.5rem;
  }
  .process-step:last-child {
    padding-bottom: 0;
  }
  .step-top {
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .step-content {
    align-items: flex-start;
  }
}
@media (max-width: 480px) {
  .fl-process {
    padding: 5rem 1.25rem;
  }
}
</style>
