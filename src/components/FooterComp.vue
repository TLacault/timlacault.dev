<script>
export default {
  name: "FooterComp",
  data() {
    return {
      year: new Date().getFullYear(),
      links: [
        { label: "Home", to: "/" },
        { label: "Projects", to: "/project" },
        { label: "Freelance", to: "/freelance" },
        { label: "Contact", to: "/contact" },
      ],
      socials: [
        {
          icon: "ri-github-line",
          href: "https://github.com/TLacault",
          label: "GitHub",
        },
        {
          icon: "ri-linkedin-line",
          href: "https://www.linkedin.com/in/tim-lacault",
          label: "LinkedIn",
        },
        {
          icon: "ri-mail-line",
          href: "mailto:lacault.tim@gmail.com",
          label: "Email",
        },
      ],
    };
  },
};
</script>

<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">Tim</router-link>
          <p class="footer-tagline">
            Building things for the web, one line at a time.
          </p>
        </div>

        <nav class="footer-nav" aria-label="Footer navigation">
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="footer-link"
            >{{ link.label }}</router-link
          >
        </nav>

        <div class="footer-socials">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            :aria-label="s.label"
            class="footer-social"
            target="_blank"
            rel="noopener"
          >
            <i :class="s.icon"></i>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-divider"></div>
        <div class="footer-meta">
          <span>© {{ year }} Tim Lacault</span>
          <span class="footer-sep">·</span>
          <span>Made with Vue 3</span>
          <span class="footer-sep">·</span>
          <span>Bordeaux, France</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem 2rem;
  margin-top: 4rem;
}

.footer-inner {
  width: 100%;
  max-width: 1100px;
  border-radius: 20px;
  padding: 2.5rem 2.5rem 2rem;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  backdrop-filter: blur(16px);
  box-shadow: 0 -1px 0 rgba(94, 201, 255, 0.06) inset;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

/* Brand */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.footer-logo {
  font-family: "Cal Sans", sans-serif;
  font-size: 1.75rem;
  color: var(--text);
  letter-spacing: 1px;
  transition: color 0.2s ease;
}
.footer-logo:hover {
  color: var(--accent);
}
.footer-tagline {
  font-family: "Poppins", sans-serif;
  font-size: 0.82rem;
  color: var(--text);
  opacity: 0.4;
  max-width: 220px;
  line-height: 1.5;
}

/* Nav */
.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.footer-link {
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.5;
  transition: opacity 0.2s ease, color 0.2s ease;
}
.footer-link:hover {
  opacity: 1;
  color: var(--accent);
}

/* Socials */
.footer-socials {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
}
.footer-social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  font-size: 1.15rem;
  color: var(--text);
  opacity: 0.45;
  background: var(--glow-card-bg);
  border: 1px solid var(--glow-card-border);
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease,
    box-shadow 0.2s ease, transform 0.2s ease;
}
.footer-social:hover {
  opacity: 1;
  color: var(--accent);
  border-color: rgba(94, 201, 255, 0.35);
  box-shadow: 0 4px 16px rgba(94, 201, 255, 0.12);
  transform: translateY(-2px);
}

/* Bottom row */
.footer-bottom {
  margin-top: 2rem;
}
.footer-divider {
  height: 1px;
  background: var(--glow-card-border);
  margin-bottom: 1.25rem;
}
.footer-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-family: "Poppins", sans-serif;
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.35;
}
.footer-sep {
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 600px) {
  .footer-inner {
    padding: 2rem 1.5rem 1.5rem;
  }
  .footer-top {
    flex-direction: column;
    gap: 1.5rem;
  }
  .footer-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
  }
}
</style>
