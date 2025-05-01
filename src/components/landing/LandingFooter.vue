<template>
  <footer class="landing-footer">
    <div class="footer-container">
      <!-- Logo + Marca -->
      <div class="footer-brand">
        <router-link to="/" class="brand-link">
          <img src="@/assets/img/LogoMediBot2.png" alt="Logo MediBot" class="footer-logo" />
          <span class="brand-text">MediBot</span>
        </router-link>
      </div>

      <!-- Enlaces principales con scroll -->
      <div class="footer-links">
        <a href="#" @click.prevent="handleFooterLink('hero')">Inicio</a>
        <a href="#" @click.prevent="handleFooterLink('why-us')">¿Por qué elegirnos?</a>
        <a href="#" @click.prevent="handleFooterLink('features-section')">Ventajas</a>
        <a href="#" @click.prevent="handleFooterLink('how-works')">¿Cómo funciona?</a>
        <a href="#" @click.prevent="handleFooterLink('contact')">Contacto</a>
      </div>

      <!-- Copyright -->
      <div class="footer-copy">
        © {{ new Date().getFullYear() }} MediBot. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleFooterLink = (sectionId: string) => {
  if (route.path !== '/') {
    // Si no estamos en la página de inicio, navegamos primero
    router.push('/').then(() => {
      // Usamos setTimeout para asegurarnos que la página ha cargado
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    })
  } else {
    // Si ya estamos en la página de inicio, hacemos scroll directamente
    scrollToSection(sectionId)
  }
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    
    // Actualizar la URL sin recargar la página
    history.pushState(null, '', `#${id}`)
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

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
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

.footer-copy {
  font-size: 0.9rem;
  color: #e0e0e0;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-brand {
    margin-bottom: 1.5rem;
  }
  
  .footer-copy {
    margin-top: 1.5rem;
  }
}
</style>