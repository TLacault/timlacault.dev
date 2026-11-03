<!--
/freelance, in French: for Bordeaux businesses. The offer, how it goes, the 25 sites already built
(they're live), and the three ways to start.
-->
<script setup lang="ts">
import src from './freelance.vue?raw'
import { clients } from '~/data/projects'
import type { Txt } from '~/composables/useLang'

const { t, L } = useLang()
useHead(() => ({
  title: t('Websites for local businesses · Tim Lacault', 'Sites pour commerces et artisans · Tim Lacault'),
  meta: [{ name: 'description', content: t('I design and build websites for shops and trades in Bordeaux. Your real photos, prices and reviews.', 'Je conçois et je code des sites pour les commerces et les artisans de Bordeaux. Vos vraies photos, vos vrais prix, vos vrais avis.') }],
}))
const offer: { t: Txt, d: Txt }[] = [
  { t: { en: 'Built by hand', fr: 'Fait à la main' }, d: { en: 'No bought template: every site is designed and coded for your trade and your neighbourhood.', fr: 'Pas de modèle acheté : chaque site est dessiné et codé pour votre métier et votre quartier.' } },
  { t: { en: 'Your real content', fr: 'Votre vrai contenu' }, d: { en: 'Your photos, prices, opening hours and reviews, taken from your booking page or Google.', fr: 'Vos photos, vos tarifs, vos horaires et vos avis, repris de votre page de réservation ou de Google.' } },
  { t: { en: 'Made for phones', fr: 'Pensé pour le téléphone' }, d: { en: 'Your customers find you on their phone. Booking, calling or getting directions takes one tap.', fr: 'Vos clients vous trouvent sur mobile. Réserver, appeler ou venir se fait en un geste.' } },
  { t: { en: 'A demo before you sign', fr: 'Une démo avant de signer' }, d: { en: 'You see your site online, with your content, before you commit to anything.', fr: 'Vous voyez votre site en ligne, avec votre contenu, avant de vous engager.' } },
]
const steps: { t: Txt, d: Txt }[] = [
  { t: { en: 'I look at your business', fr: 'Je regarde votre activité' }, d: { en: 'Your current page, your reviews, your competitors, what your customers search for.', fr: 'Votre page actuelle, vos avis, vos concurrents, ce que vos clients cherchent.' } },
  { t: { en: 'I build a demo', fr: 'Je construis une démo' }, d: { en: 'A real site online, with your photos and prices, that you can open on your phone.', fr: 'Un vrai site en ligne, avec vos photos et vos prix, que vous pouvez ouvrir sur votre téléphone.' } },
  { t: { en: 'We adjust it together', fr: 'On ajuste ensemble' }, d: { en: 'Words, colours, sections: we change it until it feels like you.', fr: 'Textes, couleurs, sections : on corrige jusqu’à ce que ce soit vous.' } },
  { t: { en: 'It goes live', fr: 'Mise en ligne' }, d: { en: 'On your own domain, ready for your customers.', fr: 'Sur votre nom de domaine, prêt à recevoir vos clients.' } },
]
onMounted(useCal)
const sections = computed(() => [
  { id: 'top', label: t('Offer', 'Offre') },
  { id: 'how', label: t('How it goes', 'Méthode') },
  { id: 'sites', label: t('Sites', 'Réalisations') },
  { id: 'start', label: 'Contact' },
])
</script>

<template>
  <div class="fl">
    <Blueprint :source="src" id="top">
      <div class="hero">
        <p class="mono kicker" data-enter style="--d: .3s"><span>Freelance</span> {{ t('Bordeaux and beyond', 'Bordeaux et ailleurs') }}</p>
        <h1 class="display title" data-field="name"><span class="line">{{ t('Your site,', 'Votre site,') }}</span> <span class="line">{{ t('by hand', 'fait main') }}</span></h1>
        <div class="hero-side" data-enter style="--d: .5s">
          <p class="lede">{{ t('I design and build websites for shops and trades. Your real photos, your real prices, your real reviews.', 'Je conçois et je code des sites pour les commerces et les artisans. Vos vraies photos, vos vrais prix, vos vrais avis.') }}</p>
          <Magnetic class="btn" type="button" v-bind="calAttrs">{{ t('Book a call', 'Réserver un appel') }}</Magnetic>
        </div>
      </div>
      <ul class="offer">
        <li v-for="(o, k) in offer" :key="o.t.en" v-reveal="k"><span class="mono">{{ String(k + 1).padStart(2, '0') }}</span><h2>{{ L(o.t) }}</h2><p>{{ L(o.d) }}</p></li>
      </ul>
    </Blueprint>

    <Blueprint :source="src" id="how">
      <div class="how">
        <h2 v-reveal class="display h">{{ t('How it goes', 'Comment ça se passe') }}</h2>
        <ol>
          <li v-for="(s, k) in steps" :key="s.t.en" v-reveal="k + 1"><h3>{{ L(s.t) }}</h3><p>{{ L(s.d) }}</p></li>
        </ol>
      </div>
    </Blueprint>

    <Blueprint :source="src" id="sites">
      <div class="sites">
        <h2 v-reveal class="display h">{{ clients.length }} {{ t('sites already live', 'sites déjà en ligne') }}</h2>
        <p v-reveal="1" class="sub">{{ t('Hair salons, bakeries, restaurants, a boxing club, a plumber. Open them: they are live.', 'Coiffeurs, boulangeries, restaurants, un club de boxe, un plombier. Ouvrez-les : ils sont en ligne.') }}</p>
      </div>
      <ClientWall />
    </Blueprint>

    <Blueprint :source="src" id="start">
      <div class="start">
        <h2 class="display title" data-field="name"><span class="line">{{ t('Let’s talk', 'Parlons') }}</span> <span class="line">{{ t('about your', 'de votre') }}</span> <span class="line">{{ t('business', 'commerce') }}</span></h2>
        <div v-reveal class="ways">
          <button type="button" v-bind="calAttrs" :data-cursor="t('Book', 'Réserver')"><span class="mono">{{ t('30-minute call', 'Appel de 30 min') }}</span>{{ t('Pick a time', 'Réserver un créneau') }}</button>
          <a href="tel:+33652300510" :data-cursor="t('Call', 'Appeler')"><span class="mono">{{ t('Phone', 'Téléphone') }}</span>06 52 30 05 10</a>
          <a href="mailto:lacault.tim@gmail.com" :data-cursor="t('Write', 'Écrire')"><span class="mono">E-mail</span>lacault.tim@gmail.com</a>
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
