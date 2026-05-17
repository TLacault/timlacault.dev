<script>
import FreelanceHero from "@/components/sections/FreelanceHero.vue";
import FreelanceNumbers from "@/components/sections/FreelanceNumbers.vue";
import FreelanceServices from "@/components/sections/FreelanceServices.vue";
import FreelanceProcess from "@/components/sections/FreelanceProcess.vue";
import FreelanceTestimonials from "@/components/sections/FreelanceTestimonials.vue";
import FreelanceCta from "@/components/sections/FreelanceCta.vue";

export default {
  name: "FreelanceView",
  components: {
    FreelanceHero,
    FreelanceNumbers,
    FreelanceServices,
    FreelanceProcess,
    FreelanceTestimonials,
    FreelanceCta,
  },
};
</script>

<template>
  <FreelanceHero />
  <FreelanceNumbers />
  <FreelanceServices />
  <FreelanceProcess />
  <FreelanceTestimonials />
  <FreelanceCta />
</template>
