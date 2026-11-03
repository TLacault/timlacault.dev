<!--
/freelance, in French: for Bordeaux businesses. The offer, how it goes, the 25 sites already built
(they're live), and the three ways to start.
-->
<script setup lang="ts">
import src from './freelance.vue?raw'
import { clients } from '~/data/projects'

useHead({
  htmlAttrs: { lang: 'fr' },
  title: 'Sites pour commerces et artisans · Tim Lacault',
  meta: [{ name: 'description', content: 'Je conçois et je code des sites pour les commerces et les artisans de Bordeaux. Vos vraies photos, vos vrais prix, vos vrais avis.' }],
})
const offer = [
  { t: 'Fait à la main', d: 'Pas de modèle acheté : chaque site est dessiné et codé pour votre métier et votre quartier.' },
  { t: 'Votre vrai contenu', d: 'Vos photos, vos tarifs, vos horaires et vos avis, repris de votre page de réservation ou de Google.' },
  { t: 'Pensé pour le téléphone', d: 'Vos clients vous trouvent sur mobile. Réserver, appeler ou venir se fait en un geste.' },
  { t: 'Une démo avant de signer', d: 'Vous voyez votre site en ligne, avec votre contenu, avant de vous engager.' },
]
const steps = [
  { t: 'Je regarde votre activité', d: 'Votre page actuelle, vos avis, vos concurrents, ce que vos clients cherchent.' },
  { t: 'Je construis une démo', d: 'Un vrai site en ligne, avec vos photos et vos prix, que vous pouvez ouvrir sur votre téléphone.' },
  { t: 'On ajuste ensemble', d: 'Textes, couleurs, sections : on corrige jusqu’à ce que ce soit vous.' },
  { t: 'Mise en ligne', d: 'Sur votre nom de domaine, prêt à recevoir vos clients.' },
]
onMounted(useCal)
const sections = [
  { id: 'top', label: 'Offre' },
  { id: 'how', label: 'Méthode' },
  { id: 'sites', label: 'Réalisations' },
  { id: 'start', label: 'Contact' },
]
</script>

<template>
  <div class="fl">
    <Blueprint :source="src" id="top">
      <div class="hero">
        <p class="mono kicker" data-enter style="--d: .3s"><span>Freelance</span> Bordeaux et ailleurs</p>
        <h1 class="display title" data-field="name"><span class="line">Votre site,</span> <span class="line">fait main</span></h1>
        <div class="hero-side" data-enter style="--d: .5s">
          <p class="lede">Je conçois et je code des sites pour les commerces et les artisans. Vos vraies photos, vos vrais prix, vos vrais avis.</p>
          <Magnetic class="btn" type="button" v-bind="calAttrs">Réserver un appel</Magnetic>
        </div>
      </div>
      <ul class="offer">
        <li v-for="(o, k) in offer" :key="o.t"><span class="mono">{{ String(k + 1).padStart(2, '0') }}</span><h2>{{ o.t }}</h2><p>{{ o.d }}</p></li>
      </ul>
    </Blueprint>

    <Blueprint :source="src" id="how">
      <div class="how">
        <h2 class="display h">Comment ça se passe</h2>
        <ol>
          <li v-for="s in steps" :key="s.t"><h3>{{ s.t }}</h3><p>{{ s.d }}</p></li>
        </ol>
      </div>
    </Blueprint>

    <Blueprint :source="src" id="sites">
      <div class="sites">
        <h2 class="display h">{{ clients.length }} sites déjà en ligne</h2>
        <p class="sub">Coiffeurs, boulangeries, restaurants, un club de boxe, un plombier. Ouvrez-les : ils sont en ligne.</p>
      </div>
      <ClientWall />
    </Blueprint>

    <Blueprint :source="src" id="start">
      <div class="start">
        <h2 class="display title" data-field="name"><span class="line">Parlons</span> <span class="line">de votre</span> <span class="line">commerce</span></h2>
        <div class="ways">
          <button type="button" v-bind="calAttrs" data-cursor="Réserver"><span class="mono">Appel de 30 min</span>Réserver un créneau</button>
          <a href="tel:+33652300510" data-cursor="Appeler"><span class="mono">Téléphone</span>06 52 30 05 10</a>
          <a href="mailto:lacault.tim@gmail.com" data-cursor="Écrire"><span class="mono">E-mail</span>lacault.tim@gmail.com</a>
        </div>
      </div>
    </Blueprint>
    <ScrollRail :sections="sections" />
  </div>
</template>

<style scoped>
.hero {
  min-height: 92dvh; padding: clamp(72px, 13vh, 140px) var(--margin) 6vh;
  display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto auto 1fr; column-gap: 24px; row-gap: 3vh;
}
.kicker { grid-column: 1 / -1; color: var(--fg-2); }
.kicker span { color: var(--accent); margin-right: 10px; }
.title { grid-column: 1 / -1; font-size: min(9vw, 17vh); }
.line { display: inline-block; margin-right: .26em; }
:global(html.field-live .fl .title) { color: transparent; }
.hero-side { grid-column: 8 / -1; align-self: end; display: grid; gap: 24px; justify-items: start; }
.lede { font-size: clamp(19px, 1.6vw, 24px); line-height: 1.35; }
.offer { margin: 0; padding: 4vh var(--margin) 14vh; list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.offer li { border-top: 1px solid var(--line); padding-top: 22px; display: grid; gap: 12px; align-content: start; }
.offer .mono { color: var(--accent); }
.offer h2 { font-size: 20px; font-weight: 800; font-stretch: 112.5%; }
.offer p { color: var(--fg-2); }
.h { font-size: min(6.4vw, 12vh); }
.how { padding: 12vh var(--margin); display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 6vh; }
.how .h { grid-column: 1 / 7; }
.how ol { grid-column: 7 / -1; margin: 0; padding: 0; list-style: none; counter-reset: s; display: grid; gap: 40px; }
.how li { counter-increment: s; display: grid; grid-template-columns: 56px 1fr; column-gap: 12px; row-gap: 8px; }
.how li::before { content: counter(s, decimal-leading-zero); grid-row: span 2; font: 13px var(--mono); color: var(--accent); padding-top: 6px; }
.how h3 { font-size: 22px; font-weight: 700; }
.how p { color: var(--fg-2); max-width: 46ch; }
.sites { padding: 12vh var(--margin) 6vh; display: grid; gap: 20px; }
.sub { color: var(--fg-2); font-size: 18px; max-width: 52ch; }
.start { padding: 18vh var(--margin) 22vh; display: grid; gap: 9vh; }
.start .title { font-size: min(8vw, 15vh); }
.ways { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ways :is(a, button) { display: grid; text-align: left; background: none; color: inherit; font-family: inherit; cursor: pointer; gap: 10px; padding: 26px; border: 1px solid var(--line); border-radius: 14px; text-decoration: none; font-size: 20px; font-weight: 600; transition: border-color .3s, translate .5s var(--ease-out); }
.ways :is(a, button):hover { border-color: var(--accent); translate: 0 -4px; }
.ways .mono { color: var(--fg-2); font-weight: 400; }
@media (max-width: 767px) {
  .title, .start .title { font-size: 10.5vw; }
  .hero-side, .how .h, .how ol { grid-column: 1 / -1; }
  .offer, .ways { grid-template-columns: 1fr; }
}
</style>
