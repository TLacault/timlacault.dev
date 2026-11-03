<script setup lang="ts">
import src from './Hero.vue?raw'
</script>

<template>
  <Blueprint :source="src" class="hero">
    <div class="hero-grid">
      <h1 class="display name" data-field="name">
        <span class="line">Tim</span>
        <span class="line">Lacault</span>
      </h1>
      <div class="hero-side">
        <p class="lede">Software engineer in Bordeaux. I build websites that feel alive.</p>
        <a class="btn" href="#contact">Work with me</a>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
.hero-grid {
  min-height: 100dvh;
  padding: 14vh var(--margin) 18vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 24px;
  align-content: space-between;
}
.name {
  grid-column: 1 / -1;
  font-size: clamp(88px, 17vw, 300px);
  transition: color .8s var(--ease-out);
}
.line { display: block; }
.line + .line { padding-left: 1.1em; }
:global(html.field-live .hero .name) { color: transparent; }
.hero-side {
  grid-column: 8 / -1;
  display: grid; gap: 28px; justify-items: start;
}
.lede { font-size: clamp(20px, 1.7vw, 26px); line-height: 1.3; max-width: 22ch; font-stretch: 105%; }
@media (max-width: 767px) {
  .hero-grid { padding-top: 18vh; }
  .hero-side { grid-column: 1 / -1; margin-top: 12vh; }
  .line + .line { padding-left: .4em; }
}
</style>
