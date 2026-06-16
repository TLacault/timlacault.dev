<script>
import emailjs from "@emailjs/browser";
import GlowButton from "@/components/ui/GlowButton.vue";

// Replace these with your EmailJS credentials
const EMAILJS_SERVICE_ID = "service_hxniaw4";
const EMAILJS_TEMPLATE_ADMIN_ID = "template_nn6a8mb";
const EMAILJS_PUBLIC_KEY = "foVHr7K1XuV3pMbRN";

export default {
  name: "ContactView",
  components: { GlowButton },
  data() {
    return {
      resumePdf: "/resume_tim_lacault.pdf",
      form: {
        from_name: "",
        reply_to: "",
        subject: "",
        message: "",
      },
      status: "idle", // idle | loading | success | error
      errorKey: "",
      fieldErrors: {
        from_name: false,
        reply_to: false,
        subject: false,
        message: false,
      },
      channels: [
        {
          icon: "ri-mail-send-line",
          labelKey: "contact.emailLabel",
          value: "lacault.tim@gmail.com",
          href: "mailto:lacault.tim@gmail.com",
        },
        {
          icon: "ri-linkedin-box-line",
          labelKey: "contact.linkedinLabel",
          value: "tim-lacault",
          href: "https://www.linkedin.com/in/tim-lacault",
        },
        {
          icon: "ri-github-line",
          labelKey: "contact.githubLabel",
          value: "TLacault",
          href: "https://github.com/TLacault",
        },
        {
          icon: "ri-calendar-event-line",
          labelKey: "contact.bookCallLabel",
          value: "cal.com/tim-lacault",
          href: "https://cal.com/tim-lacault/30min",
          cal: true,
        },
      ],
    };
  },
  methods: {
    async submit() {
      if (this.status === "loading") return;
      const { from_name, reply_to, subject, message } = this.form;
      this.fieldErrors = {
        from_name: !from_name.trim(),
        reply_to: !reply_to.trim(),
        subject: !subject.trim(),
        message: !message.trim(),
      };
      if (Object.values(this.fieldErrors).some(Boolean)) return;
      this.status = "loading";
      this.errorKey = "";
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ADMIN_ID,
          { ...this.form },
          // eslint-disable-next-line prettier/prettier
          EMAILJS_PUBLIC_KEY,
        );
        this.status = "success";
        this.form = { from_name: "", reply_to: "", subject: "", message: "" };
        this.fieldErrors = {
          from_name: false,
          reply_to: false,
          subject: false,
          message: false,
        };
      } catch (err) {
        console.error("[EmailJS error]", err);
        this.status = "error";
        this.errorKey = "contact.errorDefault";
      }
    },
    reset() {
      this.status = "idle";
      this.errorKey = "";
    },
  },
};
</script>

<template>
  <div class="contact-page">
    <span class="page-glow" aria-hidden="true"></span>

    <div class="contact-container">
      <!-- Header -->
      <div class="contact-header" v-reveal>
        <p class="section-label">{{ $t("contact.label") }}</p>
        <h1 class="contact-title">{{ $t("contact.title") }}</h1>
        <p class="contact-sub">{{ $t("contact.sub") }}</p>
      </div>

      <!-- Hire me banner -->
      <div class="hire-banner" v-reveal style="--reveal-delay: 0ms">
        <div class="hire-banner-left">
          <span class="hire-label">
            <span class="hire-dot"></span>
            {{ $t("contact.hireLabel") }}
          </span>
          <h2 class="hire-title">{{ $t("contact.hireTitle") }}</h2>
          <p class="hire-sub">{{ $t("contact.hireSub") }}</p>
        </div>
        <div class="hire-badges">
          <span class="hire-badge hire-badge--primary">
            <i class="ri-briefcase-line"></i>
            {{ $t("contact.hireBadge1") }}
          </span>
          <span class="hire-badge hire-badge--secondary">
            <i class="ri-flashlight-line"></i>
            {{ $t("contact.hireBadge2") }}
          </span>
        </div>
      </div>

      <!-- Resume download banner -->
      <a
        :href="resumePdf"
        download="Tim_Lacault_Resume.pdf"
        class="resume-banner"
        v-reveal
        style="--reveal-delay: 0ms"
      >
        <div class="resume-banner-left">
          <i class="ri-file-pdf-2-line"></i>
          <div class="resume-banner-text">
            <span class="resume-banner-title">{{
              $t("contact.resumeTitle")
            }}</span>
            <span class="resume-banner-sub">{{ $t("contact.resumeSub") }}</span>
          </div>
        </div>
        <div class="resume-banner-right">
          <span>{{ $t("contact.resumeDownload") }}</span>
          <i class="ri-download-2-line"></i>
        </div>
      </a>

      <div class="contact-body">
        <!-- Sidebar -->
        <aside class="contact-aside" v-reveal style="--reveal-delay: 80ms">
          <p class="body-section-title">{{ $t("contact.channelsTitle") }}</p>
          <div class="channel-list">
            <a
              v-for="ch in channels"
              :key="ch.label"
              :href="ch.href"
              target="_blank"
              rel="noopener noreferrer"
              :data-cal-link="ch.cal ? 'tim-lacault/30min' : undefined"
              :data-cal-namespace="ch.cal ? '30min' : undefined"
              :data-cal-config="
                ch.cal
                  ? '{&quot;layout&quot;:&quot;month_view&quot;}'
                  : undefined
              "
              class="channel-card"
            >
              <span class="channel-icon">
                <i :class="ch.icon"></i>
              </span>
              <span class="channel-info">
                <span class="channel-label">{{ $t(ch.labelKey) }}</span>
                <span class="channel-value">{{ ch.value }}</span>
              </span>
              <i class="ri-arrow-right-up-line channel-arrow"></i>
            </a>
          </div>

          <div class="availability-note">
            <span class="avail-dot"></span>
            <span>{{ $t("contact.avail") }}</span>
          </div>
        </aside>

        <!-- Form -->
        <div class="form-col">
          <p class="body-section-title" style="margin-bottom: 1rem">
            {{ $t("contact.formTitle") }}
          </p>
          <div class="form-wrap" v-reveal style="--reveal-delay: 160ms">
            <!-- Success state -->
            <Transition name="fade">
              <div v-if="status === 'success'" class="form-feedback success">
                <div class="feedback-icon">
                  <i class="ri-check-line"></i>
                </div>
                <h3>{{ $t("contact.successTitle") }}</h3>
                <p>{{ $t("contact.successSub") }}</p>
                <GlowButton variant="ghost" size="sm" @click="reset">
                  {{ $t("contact.successAnother") }}
                </GlowButton>
              </div>

              <form
                v-else
                class="contact-form"
                @submit.prevent="submit"
                novalidate
              >
                <div class="form-row">
                  <div
                    class="field"
                    :class="{ 'field--error': fieldErrors.from_name }"
                  >
                    <label for="from_name">{{ $t("contact.nameLabel") }}</label>
                    <input
                      id="from_name"
                      v-model="form.from_name"
                      type="text"
                      name="from_name"
                      :placeholder="$t('contact.namePlaceholder')"
                      autocomplete="name"
                      @input="fieldErrors.from_name = false"
                    />
                    <span v-if="fieldErrors.from_name" class="field-error-msg"
                      >Required</span
                    >
                  </div>
                  <div
                    class="field"
                    :class="{ 'field--error': fieldErrors.reply_to }"
                  >
                    <label for="reply_to">{{ $t("contact.emailLabel") }}</label>
                    <input
                      id="reply_to"
                      v-model="form.reply_to"
                      type="email"
                      name="reply_to"
                      placeholder="your@email.com"
                      autocomplete="email"
                      @input="fieldErrors.reply_to = false"
                    />
                    <span v-if="fieldErrors.reply_to" class="field-error-msg"
                      >Required</span
                    >
                  </div>
                </div>

                <div
                  class="field"
                  :class="{ 'field--error': fieldErrors.subject }"
                >
                  <label for="subject">{{ $t("contact.subjectLabel") }}</label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    name="subject"
                    :placeholder="$t('contact.subjectPlaceholder')"
                    @input="fieldErrors.subject = false"
                  />
                  <span v-if="fieldErrors.subject" class="field-error-msg"
                    >Required</span
                  >
                </div>

                <div
                  class="field"
                  :class="{ 'field--error': fieldErrors.message }"
                >
                  <label for="message">{{ $t("contact.messageLabel") }}</label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    name="message"
                    rows="6"
                    :placeholder="$t('contact.messagePlaceholder')"
                    @input="fieldErrors.message = false"
                  ></textarea>
                  <span v-if="fieldErrors.message" class="field-error-msg"
                    >Required</span
                  >
                </div>

                <div v-if="status === 'error'" class="error-msg" role="alert">
                  <i class="ri-error-warning-line"></i>
                  <span>{{ $t(errorKey) }}</span>
                </div>

                <GlowButton
                  tag="button"
                  type="submit"
                  variant="primary"
                  size="lg"
                  :disabled="status === 'loading'"
                >
                  <template v-if="status === 'loading'">
                    <i class="ri-loader-4-line spinning"></i>
                    {{ $t("contact.sending") }}
                  </template>
                  <template v-else>
                    {{ $t("contact.submitBtn") }}
                    <i class="ri-send-plane-line"></i>
                  </template>
                </GlowButton>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 8rem 1.5rem 4rem;
  overflow: hidden;
}

.page-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(47, 102, 202, 0.14),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
}

.contact-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Header */
.contact-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 560px;
}
.section-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}
.contact-title {
  font-family: "Cal Sans", sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  color: var(--text);
  line-height: 1.1;
}
.contact-sub {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--text);
  opacity: 0.5;
  white-space: pre-line;
}

/* Layout */
.contact-body {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 2rem;
  align-items: start;
}

/* Aside */
.contact-aside {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.channel-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.channel-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(12px);
  text-decoration: none;
  transition: border-color 0.25s ease, background 0.25s ease,
    transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.channel-card:hover {
  text-decoration: none;
  border-color: var(--glow-card-hover-border);
  box-shadow: var(--glow-card-hover-shadow);
  transform: translateX(4px);
}
.channel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(47, 102, 202, 0.12);
  border: 1px solid rgba(47, 102, 202, 0.2);
  color: var(--accent);
  font-size: 1.2rem;
  flex-shrink: 0;
}
.channel-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.channel-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.4;
}
.channel-value {
  font-family: "Poppins", sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.85;
}
.channel-arrow {
  font-size: 1rem;
  color: var(--text);
  opacity: 0.25;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.channel-card:hover .channel-arrow {
  opacity: 0.7;
  transform: translate(2px, -2px);
}

.availability-note {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.05);
  border: 1px solid rgba(74, 222, 128, 0.15);
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4ade80;
}
.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74, 222, 128, 0.3);
  }
  50% {
    box-shadow: 0 0 3px #4ade80;
  }
}

/* Form */
.form-col {
  display: flex;
  flex-direction: column;
}

.form-wrap {
  border-radius: 20px;
  padding: 2rem;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.field label {
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text);
  opacity: 0.5;
}
.field input,
.field textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glow-card-border);
  color: var(--text);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  resize: none;
}
.field input::placeholder,
.field textarea::placeholder {
  color: var(--text);
  opacity: 0.25;
}
.field input:focus,
.field textarea:focus {
  border-color: rgba(94, 201, 255, 0.4);
  box-shadow: 0 0 0 3px rgba(94, 201, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
}

/* Field error */
.field--error input,
.field--error textarea {
  border-color: rgba(239, 68, 68, 0.45);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.06);
}
.field-error-msg {
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: #f87171;
  margin-top: -0.1rem;
}

/* Send error */
.error-msg {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.07);
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  color: #f87171;
  line-height: 1.5;
}
.error-msg i {
  font-size: 1rem;
  margin-top: 1px;
  flex-shrink: 0;
}

/* Spinning loader */
.spinning {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Success */
.form-feedback {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}
.feedback-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #4ade80;
}
.form-feedback h3 {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.5rem;
  color: var(--text);
}
.form-feedback p {
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.5;
}

/* Reveal */
[v-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
[v-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Resume banner */
.resume-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.75rem;
  margin-top: -1.5rem;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(47, 102, 202, 0.08),
    rgba(94, 201, 255, 0.05)
  );
  border: 1px solid rgba(94, 201, 255, 0.14);
  backdrop-filter: blur(10px);
  text-decoration: none;
  cursor: pointer;
}
.resume-banner:hover {
  border-color: rgba(94, 201, 255, 0.28);
  background: linear-gradient(
    135deg,
    rgba(47, 102, 202, 0.13),
    rgba(94, 201, 255, 0.08)
  );
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(47, 102, 202, 0.14);
}
.resume-banner-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.resume-banner-left > i {
  font-size: 2.2rem;
  color: var(--accent);
  opacity: 0.75;
  flex-shrink: 0;
}
.resume-banner-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.resume-banner-title {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.1rem;
  color: var(--text);
}
.resume-banner-sub {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.resume-banner-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}
.resume-banner:hover .resume-banner-right {
  gap: 0.75rem;
}
.resume-banner-right i {
  font-size: 1rem;
}
.resume-banner:hover .resume-banner-right i {
  transform: translateY(2px);
}

/* Body section titles */
.body-section-title {
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.35;
}

/* Hire banner */
.hire-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.75rem 2rem;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(47, 102, 202, 0.06) 0%,
    rgba(94, 201, 255, 0.04) 100%
  );
  border: 1px solid rgba(47, 102, 202, 0.14);
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
}
.hire-banner-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.hire-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4ade80;
}
.hire-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}
.hire-title {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.5rem;
  color: var(--text);
  line-height: 1.15;
}
.hire-sub {
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-muted);
}
.hire-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}
.hire-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 20px;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.hire-badge--primary {
  background: rgba(47, 102, 202, 0.1);
  border: 1px solid rgba(47, 102, 202, 0.22);
  color: var(--primary);
}
.hire-badge--secondary {
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

/* Light theme overrides */
:global([data-theme="light"]) .field input,
:global([data-theme="light"]) .field textarea {
  background: rgba(255, 255, 255, 0.6);
}

/* Hire + resume banners: the blue-tinted gradient reads poorly on the light
   page — give them the standard white "block" surface instead. */
:root[data-theme="light"] .hire-banner,
:root[data-theme="light"] .resume-banner {
  background: rgba(255, 255, 255, 0.85);
  border-color: var(--block-border);
  box-shadow: var(--block-shadow);
}
:root[data-theme="light"] .hire-banner:hover,
:root[data-theme="light"] .resume-banner:hover {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(53, 107, 208, 0.3);
}
/* Pale greens/cyans → darker tones for contrast on white. */
:root[data-theme="light"] .hire-label,
:root[data-theme="light"] .hire-badge--secondary {
  color: #15803d;
}
:root[data-theme="light"] .resume-banner-left > i,
:root[data-theme="light"] .resume-banner-right {
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .contact-body {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-page {
    padding: 7rem 1.25rem 3rem;
  }
  .resume-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .resume-banner-right {
    align-self: flex-end;
  }
  .hire-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .hire-badges {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
