<!--
A project's own page. The lead screenshot arrives from the home page (shared view-transition-name) and
becomes the hero; the title spells itself in glyphs; the demo video, the write-up with a sticky heading
column, every screenshot at its natural ratio, and the next project to close.
-->
<script setup lang="ts">
import src from './[slug].vue?raw'
import { projects } from '~/data/projects'

const route = useRoute()
const { t, L } = useLang()
const i = computed(() => projects.findIndex((p) => p.slug === route.params.slug))
const p = computed(() => projects[i.value])
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'No project here' })
const next = computed(() => projects[(i.value + 1) % projects.length]!)
const ytId = computed(() => p.value?.demo?.match(/v=([\w-]+)/)?.[1])
const host = computed(() => p.value?.live?.replace(/^https?:\/\//, '') ?? '')
useHead(() => ({ title: `${p.value?.title} · Tim Lacault`, meta: [{ name: 'description', content: p.value ? L(p.value.tagline) : '' }] }))

const sections = computed(() => [
  { id: 'top', label: 'Intro' },
  ...(ytId.value ? [{ id: 'demo', label: t('Demo', 'Démo') }] : []),
  { id: 'story', label: t('Story', 'Histoire') },
  { id: 'gallery', label: t('Screens', 'Écrans') },
  { id: 'next', label: t('Next', 'Suivant') },
])
</script>

<template>
  <div v-if="p" class="case">
    <Blueprint :source="src" id="top" class="case-hero">
      <div class="hero-in">
        <NuxtLink to="/#work" class="back mono" data-enter style="--d: .3s">{{ t('Back to the work', 'Retour aux projets') }}</NuxtLink>
        <p class="mono kicker" data-enter style="--d: .4s"><span>{{ L(p.kind) }}</span> {{ L(p.role) }} / {{ p.year }}</p>
        <h1 class="display title" data-field="name"><span v-for="w in p.title.split(' ')" :key="w" class="line">{{ w }}</span></h1>
        <div class="facts" data-enter style="--d: .55s">
          <p class="tagline">{{ L(p.tagline) }}</p>
          <ul class="stack mono"><li v-for="s in p.stack" :key="s">{{ s }}</li></ul>
          <div class="actions">
            <Magnetic v-if="p.live" class="btn" :href="p.live">{{ t('Visit the site', 'Voir le site') }}</Magnetic>
            <a v-if="p.demo" class="link" :href="p.demo" target="_blank" rel="noopener">{{ t('Watch on YouTube', 'Voir sur YouTube') }}</a>
          </div>
        </div>
        <figure class="frame lead">
          <div class="bar mono"><span class="dot" />{{ host }}</div>
          <img :src="p.images[0]" :alt="`${p.title}, ${t('home screen', 'accueil')}`" :style="{ viewTransitionName: `shot-${p.slug}` }">
        </figure>
      </div>
    </Blueprint>

    <Blueprint v-if="ytId" :source="src" id="demo" class="demo">
      <figure class="frame video">
        <div class="bar mono"><span class="dot" />{{ t('Demo', 'Démo') }}</div>
        <VideoEmbed :id="ytId" :title="`${p.title}, ${t('demo', 'démo')}`" />
      </figure>
    </Blueprint>

    <Blueprint :source="src" id="story" class="story">
      <div class="story-in">
      <section v-for="(s, k) in p.sections" :key="s.title.en" class="chapter">
        <h2><span class="mono">{{ String(k + 1).padStart(2, '0') }}</span>{{ L(s.title) }}</h2>
        <div class="text">
          <p v-if="s.body">{{ L(s.body) }}</p>
          <ul v-if="s.points"><li v-for="pt in s.points" :key="pt.en">{{ L(pt) }}</li></ul>
        </div>
      </section>
      </div>
    </Blueprint>

    <Blueprint :source="src" id="gallery" class="gallery">
      <h2 class="display g-title">{{ t('Screens', 'Écrans') }}</h2>
      <div class="shots">
        <figure v-for="(img, k) in p.images.slice(1)" :key="img" class="frame">
          <img :src="img" :alt="`${p.title}, ${t('screenshot', 'capture')} ${k + 2}`" loading="lazy" decoding="async">
        </figure>
      </div>
    </Blueprint>

    <Blueprint :source="src" id="next" class="next">
      <NuxtLink :to="`/work/${next.slug}`" class="next-link" :data-cursor="t('Next', 'Suivant')">
        <span class="mono">{{ t('Next project', 'Projet suivant') }}</span>
        <span class="display next-title" data-field="name"><span v-for="w in next.title.split(' ')" :key="w" class="line">{{ w }}</span></span>
      </NuxtLink>
    </Blueprint>
    <ScrollRail :key="p.slug" :sections="sections" />
  </div>
</template>

<style scoped>
.hero-in {
  min-height: 100dvh; padding: 14vh var(--margin) 10vh;
  display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 4vh; align-content: start;
}
.back { grid-column: 1 / -1; color: var(--fg-2); text-decoration: none; }
.back::before { content: '← '; color: var(--accent); }
.back:hover { color: var(--fg); }
.kicker { grid-column: 1 / -1; color: var(--fg-2); }
.kicker span { color: var(--accent); }
.title { grid-column: 1 / -1; font-size: min(8vw, 14vh); }
.line { display: inline-block; margin-right: .28em; }
:global(html.field-live .case .title), :global(html.field-live .case .next-title) { color: transparent; }
.facts { grid-column: 1 / 5; align-self: end; display: grid; gap: 20px; justify-items: start; }
.tagline { font-size: 19px; line-height: 1.45; }
.stack { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.stack li { padding: 3px 9px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg-2); font-size: 12px; }
.actions { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.link { text-decoration: none; border-bottom: 1px solid var(--accent); padding-bottom: 2px; }

.frame { margin: 0; border: 1px solid var(--line); border-radius: 14px; overflow: clip; background: var(--ink-2); }
.frame img { display: block; width: 100%; height: auto; }
.bar { display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 14px; border-bottom: 1px solid var(--line); color: var(--fg-2); font-size: 12px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.lead { grid-column: 5 / -1; box-shadow: 0 50px 110px -60px color-mix(in oklab, var(--accent) 55%, transparent); }

.demo { padding: 8vh var(--margin); }
.video { max-width: 1200px; margin-inline: auto; }

.story-in { padding: 14vh var(--margin); display: grid; gap: 14vh; }
.chapter { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; align-items: start; }
.chapter h2 {
  grid-column: 1 / 5; position: sticky; top: 14vh;
  font-size: clamp(26px, 2.6vw, 40px); font-weight: 800; font-stretch: 125%; text-transform: uppercase; line-height: 1;
}
.chapter h2 .mono { display: block; color: var(--accent); margin-bottom: 12px; font-size: 13px; }
.text { grid-column: 6 / -1; font-size: 19px; line-height: 1.6; max-width: 62ch; }
.text ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 18px; }
.text li { padding-left: 26px; position: relative; }
.text li::before { content: ''; position: absolute; left: 0; top: .72em; width: 12px; height: 1px; background: var(--accent); }

.gallery { padding: 10vh var(--margin) 14vh; }
.g-title { font-size: min(8vw, 14vh); margin-bottom: 6vh; }
.shots { columns: 2; column-gap: 24px; }
.shots .frame { break-inside: avoid; margin-bottom: 24px; }

.next { padding: 6vh var(--margin) 24vh; }
.next-link { display: grid; gap: 18px; text-decoration: none; color: var(--fg-2); }
.next-title { font-size: min(10vw, 19vh); color: var(--fg); }

@media (max-width: 767px) {
  .facts, .lead { grid-column: 1 / -1; }
  .title, .next-title { font-size: 8.6vw; }
  .next-link, .hero-in { overflow-wrap: anywhere; }
  .chapter h2 { grid-column: 1 / -1; position: static; margin-bottom: 20px; }
  .text { grid-column: 1 / -1; }
  .shots { columns: 1; }
}
</style>
