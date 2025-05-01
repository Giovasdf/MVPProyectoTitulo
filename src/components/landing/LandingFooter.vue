<template>
  <footer class="landing-footer">
    <div class="footer-container">
      <!-- Logo + Marca -->
      <div class="footer-brand">
        <img src="@/assets/img/LogoMediBot2.png" alt="Logo MediBot" class="footer-logo" />
        <span class="brand-text">MediBot</span>
      </div>

      <!-- Enlaces principales con scroll -->
      <div class="footer-links">
        <a href="#hero" @click.prevent="scrollTo('hero')">Inicio</a>
        <a href="#why-us" @click.prevent="scrollTo('why-us')">¿Por qué elegirnos?</a>
        <a href="#features-section" @click.prevent="scrollTo('features-section')">Ventajas</a>
        <a href="#how-works" @click.prevent="scrollTo('how-works')">¿Cómo funciona?</a>
        <a href="#contact" @click.prevent="scrollTo('contact')">Contacto</a>
      </div>

      <!-- Enlaces sociales opcionales -->
      <div class="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener">📘</a>
        <a href="https://instagram.com" target="_blank" rel="noopener">📸</a>
        <a href="https://twitter.com" target="_blank" rel="noopener">🐦</a>
      </div>

      <!-- Copyright -->
      <div class="footer-copy">
        © {{ new Date().getFullYear() }} MediBot. Todos los derechos reservados.
      </div>
    </div>
  </footer>
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
.landing-footer {
  background-color: #2B6DFC;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.footer-logo {
  height: 40px;
  margin-right: 0.5rem;
}

.brand-text {
  font-size: 1.5rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
}

.footer-links a:hover {
  text-decoration: underline;
  color: #dfefff;
}

.footer-social {
  margin-bottom: 1rem;
}

.footer-social a {
  font-size: 1.5rem;
  margin: 0 0.5rem;
  color: white;
  transition: color 0.3s ease;
}

.footer-social a:hover {
  color: #dfefff;
}

.footer-copy {
  font-size: 0.9rem;
  color: #e0e0e0;
}
</style>
