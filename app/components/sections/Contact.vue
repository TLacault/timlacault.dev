<script setup lang="ts">
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import src from './Contact.vue?raw'

// ── FAQ: type a question, the closest answers surface. Nothing found → it becomes the message below.
const faq = [
  { q: 'Are you looking for an internship?', k: 'internship stage intern available availability when dates summer february hire job', a: 'Yes, two of them. A 4th-year internship of 3 to 4 months, June to September 2027, and my end-of-studies internship of 5 to 6 months, February to September 2028.' },
  { q: 'Where are you based? Remote?', k: 'where based location city bordeaux remote hybrid onsite office move relocate', a: 'Bordeaux, France. On-site in Bordeaux, hybrid, or remote all work for me.' },
  { q: 'What do you work with?', k: 'stack tech technologies languages framework vue nuxt typescript skills tools', a: 'Mostly Vue and Nuxt with TypeScript, Node, PostgreSQL, Supabase and Docker, with GSAP and three.js for motion. School added C, C++, Python, Java and OCaml.' },
  { q: 'Can you build a website for my business?', k: 'website site business shop salon restaurant freelance client quote price cost build', a: 'Yes. I have been freelancing since 2023 and build every site by hand around the business\'s real photos, prices and reviews. Tell me about yours below and I will reply with a plan and a quote.' },
  { q: "What is Mobilit'Eirb?", k: 'mobiliteirb mobilit eirb startup carbon footprint company', a: 'My startup. It measures the carbon footprint of student trips. It began as a school project I led with a team of five at ENSEIRB-MATMECA.' },
  { q: 'Which languages do you speak?', k: 'language languages speak english french japanese', a: 'French (native), English (C1), and Japanese, which I am still learning.' },
  { q: 'Where is your résumé?', k: 'resume cv curriculum pdf download', a: 'Right here: the PDF link at the bottom of this section.' },
  { q: 'How do I reach you fastest?', k: 'contact reach email phone call book meeting fast quickly', a: 'Email lacault.tim@gmail.com, call 06 52 30 05 10, or book a 30-minute call. Or use the form.' },
]
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ')
const query = ref('')
const answers = computed(() => {
  const words = norm(query.value).split(' ').filter((w) => w.length > 2)
  if (!words.length) return faq.slice(0, 3)
  return faq
    .map((f) => ({ f, score: words.filter((w) => norm(f.q + ' ' + f.k).includes(w)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.f)
})
const open = ref<string | null>(null)
watch(answers, (a) => { open.value = a[0]?.q ?? null }, { immediate: true })
function askDirectly() {
  form.message = query.value.trim()
  document.getElementById('cf-name')?.focus()
}

// ── On send, the glyphs fold into a paper crane over the form and it flies off the page.
// `fly` drives a style both renders share, so the x-ray copy flies with the surface.
const crane = ref(false)
const fly = ref(0)
function foldCrane() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  crane.value = true
  const o = { t: 0 }
  gsap.to(o, { t: 1, delay: 1.3, duration: 2.4, ease: 'power2.in', onUpdate: () => { fly.value = o.t }, onComplete: () => { crane.value = false; fly.value = 0 } })
}

// ── Contact form (EmailJS, same account and template as the previous site).
const form = reactive({ from_name: '', reply_to: '', message: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errors = reactive({ from_name: false, reply_to: false, message: false })
async function send() {
  if (status.value === 'sending') return
  errors.from_name = !form.from_name.trim()
  errors.reply_to = !/^\S+@\S+\.\S+$/.test(form.reply_to.trim())
  errors.message = !form.message.trim()
  if (errors.from_name || errors.reply_to || errors.message) return
  status.value = 'sending'
  try {
    await emailjs.send('service_hxniaw4', 'template_nn6a8mb', { ...form, subject: `timlacault.dev: message from ${form.from_name}` }, 'foVHr7K1XuV3pMbRN')
    status.value = 'sent'
    Object.assign(form, { from_name: '', reply_to: '', message: '' })
    foldCrane()
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <Blueprint :source="src" class="contact" id="contact">
    <div class="contact-inner">
      <h2 class="display title" data-field="name"><span class="line">Work</span> <span class="line">with me</span></h2>

      <div class="cols">
        <section class="faq" aria-labelledby="faq-title">
          <h3 id="faq-title">Ask me something</h3>
          <label class="sr-only" for="faq-q">Your question</label>
          <input id="faq-q" v-model="query" class="ask" type="search" placeholder="When are you available?" autocomplete="off">
          <ul v-if="answers.length" class="answers">
            <li v-for="f in answers" :key="f.q" :class="{ open: open === f.q }">
              <button type="button" :aria-expanded="open === f.q" @click="open = open === f.q ? null : f.q">{{ f.q }}</button>
              <div class="answer" :inert="open !== f.q"><p>{{ f.a }}</p></div>
            </li>
          </ul>
          <div v-else class="none">
            <p>No answer for that yet.</p>
            <button type="button" class="link" @click="askDirectly">Ask me directly</button>
          </div>
        </section>

        <form class="form" novalidate @submit.prevent="send">
          <div
            v-if="crane" class="crane" data-field="image" data-src="/img/crane.svg" data-field-priority aria-hidden="true"
            :style="{ transform: `translate(${fly * 70}vw, ${-fly * 110}vh) rotate(${-fly * 14}deg) scale(${1 - fly * 0.35})` }"
          />
          <h3>Write to me</h3>
          <div class="field">
            <label for="cf-name">Name</label>
            <input id="cf-name" v-model="form.from_name" autocomplete="name" :aria-invalid="errors.from_name">
            <p v-if="errors.from_name" class="err">Tell me who you are.</p>
          </div>
          <div class="field">
            <label for="cf-mail">Email</label>
            <input id="cf-mail" v-model="form.reply_to" type="email" autocomplete="email" :aria-invalid="errors.reply_to">
            <p v-if="errors.reply_to" class="err">I need an email address to answer you.</p>
          </div>
          <div class="field">
            <label for="cf-msg">Message</label>
            <textarea id="cf-msg" v-model="form.message" rows="5" :aria-invalid="errors.message" />
            <p v-if="errors.message" class="err">Your message is empty.</p>
          </div>
          <div class="send">
            <Magnetic class="btn" type="submit" :aria-disabled="status === 'sending'">{{ status === 'sending' ? 'Sending' : 'Send' }}</Magnetic>
            <p v-if="status === 'sent'" class="ok" role="status">Sent. I'll answer within a couple of days.</p>
            <p v-if="status === 'error'" class="err" role="alert">That didn't go through. Write to lacault.tim@gmail.com instead.</p>
          </div>
        </form>
      </div>

      <div class="reach">
        <a href="mailto:lacault.tim@gmail.com">lacault.tim@gmail.com</a>
        <a href="tel:+33652300510">06 52 30 05 10</a>
        <a href="https://cal.com/tim-lacault/30min" target="_blank" rel="noopener">Book a call</a>
        <a href="https://github.com/TLacault" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/tim-lacault" target="_blank" rel="noopener">LinkedIn</a>
        <a href="/resume_tim_lacault.pdf" download>Résumé (PDF)</a>
      </div>
    </div>
  </Blueprint>
</template>

<style scoped>
.contact-inner { padding: 18vh var(--margin) 140px; display: grid; gap: 9vh; }
.title { font-size: min(11vw, 22vh); }
.line { display: inline-block; }
:global(html.field-live .contact .title) { color: transparent; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 6vw; align-items: start; }
h3 { font-size: 15px; font-weight: 700; font-stretch: 112.5%; text-transform: uppercase; letter-spacing: .02em; margin-bottom: 20px; }

.ask, .field input, .field textarea {
  width: 100%; padding: 14px 16px; border: 1px solid var(--line); border-radius: 10px;
  background: color-mix(in oklab, var(--ink-2) 72%, transparent); color: var(--fg); font: inherit; resize: none;
  transition: border-color .2s;
}
.field textarea { resize: vertical; min-height: 140px; max-height: 360px; }
.ask:focus, .field input:focus, .field textarea:focus { outline: none; border-color: var(--accent); }
.ask::placeholder { color: var(--fg-2); }
.answers { margin: 14px 0 0; padding: 0; list-style: none; }
.answers li { border-bottom: 1px solid var(--line); }
.answers button {
  width: 100%; padding: 16px 0; border: 0; background: none; color: var(--fg); font: inherit; font-weight: 600;
  text-align: left; display: flex; justify-content: space-between; gap: 16px; cursor: pointer;
}
.answers button::after { content: '+'; color: var(--accent); transition: rotate .3s var(--ease-out); }
.answers .open button::after { rotate: 45deg; }
/* Open/close glides: the answer's row animates from 0fr to 1fr, so the list below moves with it. */
.answer { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .45s var(--ease-io), opacity .35s var(--ease-out); }
.open .answer { grid-template-rows: 1fr; opacity: 1; }
.answer p { min-height: 0; overflow: hidden; padding: 0 0 18px; color: var(--fg-2); max-width: 56ch; }
.none { margin-top: 18px; display: flex; gap: 14px; align-items: baseline; color: var(--fg-2); }
.link { border: 0; padding: 0; background: none; color: var(--accent); font: inherit; border-bottom: 1px solid currentColor; cursor: pointer; }

.form { display: grid; gap: 18px; position: relative; }
.crane { position: absolute; left: 30%; top: -14%; width: min(420px, 80vw); aspect-ratio: 400 / 280; translate: -50% -50%; pointer-events: none; }
.form h3 { margin-bottom: 2px; }
.field { display: grid; gap: 8px; }
.field label { font-size: 14px; color: var(--fg-2); }
[aria-invalid="true"] { border-color: #ff6b6b !important; }
.err { color: #ff8a8a; font-size: 14px; }
.ok { color: var(--accent); font-size: 14px; }
.send { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.btn { border: 0; cursor: pointer; }
.btn[aria-disabled="true"] { opacity: .6; pointer-events: none; }

.reach { display: flex; flex-wrap: wrap; gap: 14px 30px; }
.reach a { text-decoration: none; color: var(--fg-2); transition: color .2s; }
.reach a:hover { color: var(--fg); }
@media (max-width: 767px) {
  .cols { grid-template-columns: 1fr; gap: 64px; }
}
</style>
