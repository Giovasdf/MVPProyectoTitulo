import { defineStore } from 'pinia'
import { loginUser, logout, isLoggedIn, currentUser, type User } from '@/services/pocketbase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    RolUsuario: null as string | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAdmin(): boolean {
      return this.RolUsuario === 'admin';
    }
  },
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        await loginUser(email, password)
        this.isAuthenticated = isLoggedIn()
        this.user = currentUser()
        this.updateRolUsuario()
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
        this.updateRolUsuario()
      }
    },
    
    updateRolUsuario() {
      if (this.user && this.user.rol) {
        this.RolUsuario = this.user.rol
      } else if (this.user && this.user.isAdmin) {
        // Compatibilidad con sistemas que usan isAdmin en lugar de rol
        this.RolUsuario = 'admin'
      } else {
        this.RolUsuario = 'user' // Rol por defecto
      }
    },
    
    logout() {
      logout()
      this.isAuthenticated = false
      this.user = null
      this.RolUsuario = null
    }
  },
  
  persist: true // Esto habilita la persistencia del store
})