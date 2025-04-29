<template>
    <div class="home-view">
      <LandingNavbar />
        <HeroSection />
      <LandingFooter />
    </div>
  </template>
  
  <script setup lang="ts">
  import LandingNavbar from '@/components/landing/LandingNavbar.vue'
  import HeroSection from '@/components/terminosCondiciones/heroSection.vue'
  import LandingFooter from '@/components/landing/LandingFooter.vue'
  </script>
  
  <style scoped>
  .home-view {
    font-family: 'Segoe UI', Roboto, sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
  
  </style>
  