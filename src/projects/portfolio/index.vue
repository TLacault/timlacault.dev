<script>
export default { name: "ProjectPortfolio" };
</script>

<template>
  <div class="proj-content">
    <section class="proj-section">
      <h2>Overview</h2>
      <p>
        My personal corner of the internet — a place to showcase projects,
        thoughts, and skills. Built entirely from scratch with Vue 3 using the
        Options API, emphasising component isolation and a clean design system.
      </p>
    </section>

    <section class="proj-section">
      <h2>Goals</h2>
      <ul>
        <li>Design a distinctive dark-glow aesthetic without a UI framework</li>
        <li>Achieve silky smooth scrolling with a speed-up curve (Lenis)</li>
        <li>Build every animation in pure CSS — no GSAP, no Motion</li>
        <li>Full light/dark theme support via CSS custom properties</li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>Architecture</h2>
      <p>
        Sections are isolated Vue components mounted in views. Global state is
        minimal — just the theme preference persisted to
        <code>localStorage</code>. Scroll-reveal is handled by a global
        <code>v-reveal</code> directive backed by
        <code>IntersectionObserver</code>.
      </p>
    </section>

    <section class="proj-section">
      <h2>Key Challenges</h2>
      <ul>
        <li>
          Light/dark theme without class duplication — solved with semantic CSS
          tokens (<code>--text-muted</code>, <code>--glow-card-bg</code>, etc.)
        </li>
        <li>
          Terminal popup spring animation — achieved with a single
          <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code> transform
        </li>
        <li>
          Lenis + Vue router — scroll instance created once in App and destroyed
          on unmount to avoid ghost RAF loops
        </li>
      </ul>
    </section>

    <section class="proj-section">
      <h2>What's next</h2>
      <p>
        A blog section for writing about things I learn, a freelance case study
        page, and eventually a CMS so I stop shipping code to update text.
      </p>
    </section>
  </div>
</template>
