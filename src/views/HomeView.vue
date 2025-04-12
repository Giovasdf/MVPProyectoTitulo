<template>
  <div class="home-view">
    <LandingNavbar />

    <HeroSection />
    <WhyUs />
    <FeaturesSection />
    <HowWorks />
    <ContactSection />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import WhyUs from '@/components/landing/WhyUs.vue'
import ContactSection from '@/components/landing/ContactSection.vue'
import HowWorks from '@/components/landing/HowWorks.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
</script>

<style scoped>
.home-view {
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

</style>
