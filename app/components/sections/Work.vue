<script setup lang="ts">
import src from './Work.vue?raw'
import { projects, clients } from '~/data/projects'
const { t } = useLang()
</script>

<template>
  <Blueprint :source="src" class="work" id="work">
    <WorkExhibit v-for="(p, i) in projects" :key="p.slug" :project="p" :index="i" />
    <div class="local" id="local">
      <div class="local-head">
        <h3 class="display">{{ clients.length }} {{ t('sites for local businesses', 'sites pour des commerces') }}</h3>
        <p>{{ t("Hair salons, bakeries, a boxing club, a plumber. Each one designed and built by hand, around the business's real photos, prices and reviews. They're live: open any of them.", 'Coiffeurs, boulangeries, un club de boxe, un plombier. Chacun dessiné et codé à la main, avec les vraies photos, les vrais prix et les vrais avis du commerce. Ils sont en ligne : ouvrez-les.') }}</p>
        <NuxtLink to="/freelance" class="more">{{ t('Need one for your business?', 'Un site pour votre commerce ?') }}</NuxtLink>
      </div>
      <ClientWall />
    </div>
  </Blueprint>
</template>

<style scoped>
.local { padding: 16vh 0 18vh; display: grid; gap: 7vh; }
.local-head { padding-inline: var(--margin); display: grid; gap: 22px; max-width: 1100px; }
h3 { font-size: clamp(40px, 5.6vw, 96px); }
.local-head p { font-size: 18px; max-width: 52ch; color: var(--fg-2); }
.more { justify-self: start; text-decoration: none; border-bottom: 1px solid var(--accent); padding-bottom: 2px; }
.more:hover { color: var(--accent); }
</style>
