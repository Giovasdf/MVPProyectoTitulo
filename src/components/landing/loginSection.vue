<template>
  <div class="login-page">
    <LandingNavbar />

    <section class="login-section">
      <div class="login-container">
        <!-- Logo arriba del título -->
        <img src="@/assets/img/LogoMediBot.png" alt="Logo MediBot" class="login-logo" />

        <h2 class="login-title">Iniciar sesión</h2>

        <form class="login-form" @submit.prevent="handleLogin">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
          />
          <input 
            v-model="password" 
            type="password" 
            placeholder="Contraseña" 
            required 
          />
          <button type="submit" :disabled="authStore.loading">
            {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
          </button>
        </form>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <p class="login-note">¿No tienes cuenta? Contáctanos para activarla.</p>
      </div>
    </section>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-page {
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: #f4f7fb;
  min-height: 100vh;
}

/* Sección */
.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
}

/* Caja del formulario */
.login-container {
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

/* Logo encima del formulario */
.login-logo {
  width: 300px;
  margin-bottom: 1rem;
}

/* Título */
.login-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2B6DFC;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.login-form button {
  background-color: #2B6DFC;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-form button:hover {
  background-color: #1a52c5;
}

.login-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Mensaje de error */
.error-message {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Nota debajo */
.login-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}
</style>