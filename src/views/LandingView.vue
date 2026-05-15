<script>
import HeroSection from "@/components/sections/HeroSection.vue";
import AboutSection from "@/components/sections/AboutSection.vue";
import TeaseSection from "@/components/sections/TeaseSection.vue";
import ContactBanner from "@/components/sections/ContactBanner.vue";

export default {
  name: "LandingView",
  components: { HeroSection, AboutSection, TeaseSection, ContactBanner },
};
</script>

<template>
  <HeroSection />
  <AboutSection />
  <TeaseSection />
  <ContactBanner />
</template>
