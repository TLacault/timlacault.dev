<script>
export default {
  name: "FreelanceNumbers",
  data() {
    return {
      stats: [
        {
          target: 12,
          suffix: "+",
          label: "Projects delivered",
          icon: "ri-stack-line",
        },
        {
          target: 3,
          suffix: "wks",
          label: "Avg. time to launch",
          icon: "ri-timer-flash-line",
        },
        {
          target: 100,
          suffix: "%",
          label: "On-time delivery",
          icon: "ri-check-double-line",
        },
        {
          target: 5,
          suffix: "★",
          label: "Client satisfaction",
          icon: "ri-star-line",
        },
      ],
      counts: [0, 0, 0, 0],
      started: false,
    };
  },
  mounted() {
    this._observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.started) {
          this.started = true;
          this.stats.forEach((s, i) => this.countUp(i, s.target));
          this._observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    this._observer.observe(this.$el);
  },
  beforeUnmount() {
    this._observer?.disconnect();
  },
  methods: {
    countUp(index, target) {
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        this.counts[index] = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else this.counts[index] = target;
      };
      requestAnimationFrame(step);
    },
  },
};
</script>

<template>
  <section class="fl-numbers">
    <div class="numbers-row">
      <div
        v-for="(s, i) in stats"
        :key="s.label"
        class="stat-item"
        v-reveal
        :style="`--reveal-delay: ${i * 90}ms`"
      >
        <i :class="[s.icon, 'stat-icon']" aria-hidden="true"></i>
        <span class="stat-value"
          >{{ counts[i] }}<span class="stat-suffix">{{ s.suffix }}</span></span
        >
        <span class="stat-label">{{ $t(`flNumbers.stat${i}`) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fl-numbers {
  width: 100%;
  padding: 5rem 2rem;
  display: flex;
  justify-content: center;
}

.numbers-row {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-right: 1px solid var(--glow-card-border);
  position: relative;
}
.stat-item:first-child {
  border-left: 1px solid var(--glow-card-border);
}

.stat-icon {
  font-size: 1.4rem;
  color: var(--accent);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.stat-value {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2.8rem, 5vw, 4rem);
  line-height: 1;
  background: linear-gradient(135deg, var(--text) 40%, var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.6rem;
}
.stat-suffix {
  font-size: 0.65em;
  opacity: 0.8;
}

.stat-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 700px) {
  .numbers-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-item:nth-child(2) {
    border-right: none;
  }
  .stat-item:nth-child(3) {
    border-top: 1px solid var(--glow-card-border);
  }
  .stat-item:nth-child(4) {
    border-top: 1px solid var(--glow-card-border);
    border-right: none;
  }
}

@media (max-width: 420px) {
  .fl-numbers {
    padding: 3.5rem 1rem;
  }
  .stat-item {
    padding: 2rem 1rem;
  }
}
</style>
