<script setup lang="ts">
import src from './Contact.vue?raw'
</script>

<template>
  <Blueprint :source="src" class="contact" id="contact">
    <div class="contact-inner">
      <h2 class="display">Work with me</h2>
      <div class="cols">
        <div>
          <p class="mono muted">Internships</p>
          <p>4th-year internship, 3 to 4 months, June to September.</p>
          <p>End-of-studies internship, 5 to 6 months, February to September.</p>
        </div>
        <div>
          <p class="mono muted">Freelance</p>
          <p>Websites for businesses in Bordeaux and beyond.</p>
        </div>
        <div class="reach">
          <a class="mail" href="mailto:lacault.tim@gmail.com">lacault.tim@gmail.com</a>
          <a href="tel:+33652300510">06 52 30 05 10</a>
          <a href="https://github.com/TLacault" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/tim-lacault" target="_blank" rel="noopener">LinkedIn</a>
          <a href="/resume_tim_lacault.pdf" download>Résumé (PDF)</a>
        </div>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
.contact-inner { min-height: 100dvh; padding: 18vh var(--margin) 22vh; display: grid; align-content: space-between; gap: 10vh; }
h2 { font-size: clamp(64px, 12vw, 200px); }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.cols p + p { margin-top: 10px; }
.reach { display: grid; gap: 8px; justify-items: start; }
.reach a { text-decoration: none; }
.reach a:hover { color: var(--claret); }
.mail { font-size: 22px; font-weight: 560; border-bottom: 1px solid var(--claret); }
@media (max-width: 767px) { .cols { grid-template-columns: 1fr; gap: 40px; } }
</style>
