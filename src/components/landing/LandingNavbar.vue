<template>
  <nav class="landing-navbar">
    <div class="navbar-container">
      <!-- Logo / Marca -->
      <a href="/" class="navbar-brand">
        🤖 <span class="brand-name">MediBot</span>
      </a>

      <!-- Menú de navegación -->
      <ul class="navbar-links">
        <li><a href="#hero" @click.prevent="scrollTo('hero')">Inicio</a></li>
        <li><a href="#why-us" @click.prevent="scrollTo('why-us')">¿Por qué elegirnos?</a></li>
        <li><a href="#features-section" @click.prevent="scrollTo('features-section')">Ventajas</a></li>
        <li><a href="#how-works" @click.prevent="scrollTo('how-works')">¿Cómo funciona?</a></li>
        <li><a href="#features" @click.prevent="scrollTo('features')">Características</a></li>
        <li><a href="#contact" @click.prevent="scrollTo('contact')">Contacto</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.landing-navbar {
  background-color: #2B6DFC;
  border-bottom: 1px solid #2B6DFC;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d9d9d9;
  text-decoration: none;
}

.brand-name {
  margin-left: 0.5rem;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.navbar-links li a {
  text-decoration: none;
  color: #eeeeee;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.navbar-links li a:hover {
  color: #6F7D54;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }
}
</style>
