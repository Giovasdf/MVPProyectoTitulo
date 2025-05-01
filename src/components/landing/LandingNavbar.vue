<template>
  <nav class="landing-navbar">
    <div class="navbar-container">
      <!-- Logo + texto -->
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/img/LogoMediBot2.png" alt="Logo MediBot" class="brand-logo" />
      </router-link>

      <!-- Menú de navegación versión Desktop -->
      <ul class="navbar-links desktop">
        <li><a href="#" @click.prevent="handleNavClick('hero')">Inicio</a></li>
        <li><a href="#" @click.prevent="handleNavClick('why-us')">¿Por qué elegirnos?</a></li>
        <li><a href="#" @click.prevent="handleNavClick('features-section')">Ventajas</a></li>
        <li><a href="#" @click.prevent="handleNavClick('how-works')">¿Cómo funciona?</a></li>
        <li><a href="#" @click.prevent="handleNavClick('contact')">Contacto</a></li>
      </ul>

      <!-- Botón de login versión Desktop -->
      <router-link :to="{ name: 'login' }" class="login-button desktop">Iniciar sesión</router-link>

      <!-- Botón Hamburger versión Mobile -->
      <button class="hamburger mobile" @click="toggleMobileMenu">
        <span class="hamburger-icon"></span>
      </button>
    </div>

    <!-- Menú Mobile -->
    <div v-if="menuOpen" class="mobile-menu mobile">
      <ul>
        <li><a href="#" @click.prevent="handleMobileNavClick('hero')">Inicio</a></li>
        <li><a href="#" @click.prevent="handleMobileNavClick('why-us')">¿Por qué elegirnos?</a></li>
        <li><a href="#" @click.prevent="handleMobileNavClick('features-section')">Ventajas</a></li>
        <li><a href="#" @click.prevent="handleMobileNavClick('how-works')">¿Cómo funciona?</a></li>
        <li><a href="#" @click.prevent="handleMobileNavClick('contact')">Contacto</a></li>
        <li>
          <router-link :to="{ name: 'login' }" class="mobile-login" @click="toggleMobileMenu">
            Iniciar sesión
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

const toggleMobileMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleNavClick = (sectionId: string) => {
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

const handleMobileNavClick = (sectionId: string) => {
  toggleMobileMenu()
  handleNavClick(sectionId)
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
/* Tus estilos existentes se mantienen igual */
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
  text-decoration: none;
}

.brand-logo {
  height: 80px;
  width: auto;
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
  color: #143479;
  text-decoration: underline;
}

.login-button {
  margin-left: 1.5rem;
  padding: 0.5rem 1.25rem;
  border: 2px solid white;
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: white;
  color: #2B6DFC;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
}

.hamburger-icon {
  width: 24px;
  height: 2px;
  background-color: white;
  display: block;
  position: relative;
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  width: 24px;
  height: 2px;
  background-color: white;
  position: absolute;
  left: 0;
  transition: all 0.3s ease;
}

.hamburger-icon::before {
  top: -6px;
}

.hamburger-icon::after {
  top: 6px;
}

.mobile-menu {
  background-color: #2B6DFC;
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  z-index: 99;
  border-top: 1px solid #2B6DFC;
}

.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
}

.mobile-menu ul li {
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-menu ul li a {
  text-decoration: none;
  color: #eeeeee;
  font-weight: 500;
  font-size: 1rem;
  display: block;
}

.mobile-login {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 25px;
  text-align: center;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.mobile-login:hover {
  background-color: white;
  color: #2B6DFC;
}

.desktop {
  display: flex;
}

.mobile {
  display: none;
}

@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }
}
</style>