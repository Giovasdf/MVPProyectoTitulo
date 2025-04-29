import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginSection from '@/components/landing/loginSection.vue'

// Define el base path según el entorno
const basePath = import.meta.env.PROD ? '/MVPProyectoTitulo/' : '/'

const router = createRouter({
  history: createWebHistory(basePath),  // Usa el base path definido
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginSection,
      meta: { public: true }
    },
  ],
})

// Guard de navegación (mejorado)
router.beforeEach(async (to, from, next) => {
  const authStore = (await import('@/stores/auth')).useAuthStore()
  
  try {
    await authStore.checkAuth()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
    
    // Evitar bucle infinito en redirecciones
    if (to.name === 'login' && authStore.isAuthenticated) {
      return next(from.fullPath || { name: 'dashboard' })
    }
    
    next()
  } catch (error) {
    console.error('Error en navegación:', error)
    next('/')
  }
})

export default router