import { defineStore } from 'pinia'
import { loginUser, logout, isLoggedIn, currentUser, type User } from '@/services/pocketbase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        await loginUser(email, password)
        this.isAuthenticated = isLoggedIn()
        this.user = currentUser()
        return true
      } catch (err) {
        console.error('Login error:', err)
        this.error = 'Credenciales incorrectas'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async checkAuth() {
      this.isAuthenticated = isLoggedIn()
      if (this.isAuthenticated) {
        this.user = currentUser()
      }
    },
    
    logout() {
      logout()
      this.isAuthenticated = false
      this.user = null
    }
  },
  
  persist: true // Esto habilita la persistencia del store
})