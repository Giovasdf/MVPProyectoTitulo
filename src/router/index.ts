import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginSection from '@/components/landing/loginSection.vue'
import TerminosCondicionesView from '@/views/TerminosCondicionesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true } // Ruta pública
    },
    {
      path: '/terminoscondiciones',
      name: 'terminoscondiciones',
      component: TerminosCondicionesView,
      meta: { public: true } // Ruta pública
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // Ruta protegida
    },
    {
      path: '/login',
      name: 'login',
      component: LoginSection,
      meta: { public: true } // Ruta pública
    },
  ],
})

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = (await import('@/stores/auth')).useAuthStore()
  await authStore.checkAuth() // Verifica el estado de autenticación

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') // Redirige a login si no está autenticado
  } else {
    next() // Continúa la navegación
  }
})

export default router