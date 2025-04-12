<template>
  <footer class="landing-footer">
    <div class="footer-container">
      <div class="footer-brand">
        🤖 <span class="brand-text">MediBot</span>
      </div>

      <div class="footer-links">
        <a href="#features">Características</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#contact">Contacto</a>
      </div>

      <!-- Íconos sociales opcionales -->
      <!--
      <div class="footer-social">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
      </div>
      -->

      <div class="footer-copy">
        © {{ new Date().getFullYear() }} MediBot. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No se requiere lógica compleja
</script>

<style scoped>
.landing-footer {
  background-color: #2b6dfc;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-brand {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand-text {
  margin-left: 0.5rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.footer-links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.footer-links a:hover {
  text-decoration: underline;
  color: #dfefff;
}

.footer-social {
  margin-bottom: 1rem;
}

.footer-social a {
  color: white;
  margin: 0 0.5rem;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.footer-social a:hover {
  color: #dfefff;
}

.footer-copy {
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-top: 1rem;
}
</style>
