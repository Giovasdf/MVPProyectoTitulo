import { defineStore } from 'pinia'
import { loginUser, logout, isLoggedIn, currentUser, type User } from '@/services/pocketbase'

interface AuthUser extends User {
  sucursal_id?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    RolUsuario: null as string | null,
    sucursalId: null as string | null, // Nuevo estado para sucursal_id
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAdmin(): boolean {
      return this.RolUsuario === 'admin'
    },
    currentSucursalId(): string | null {
      return this.sucursalId
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
        this.updateUserData() // Cambiado de updateRolUsuario
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
        this.updateUserData() // Cambiado de updateRolUsuario
      }
    },
    
    updateUserData() {
      if (this.user) {
        // Actualizar rol
        if (this.user.rol) {
          this.RolUsuario = this.user.rol
        } else if (this.user.isAdmin) {
          this.RolUsuario = 'admin'
        } else {
          this.RolUsuario = 'user'
        }
        
        // Actualizar sucursal_id
        if (this.user.sucursal_id) {
          this.sucursalId = this.user.sucursal_id
        } else if (this.user.expand?.sucursal_id?.id) {
          // Si está expandido el relation
          this.sucursalId = this.user.expand.sucursal_id.id
        } else {
          this.sucursalId = null
        }
      } else {
        this.RolUsuario = null
        this.sucursalId = null
      }
    },
    
    logout() {
      logout()
      this.isAuthenticated = false
      this.user = null
      this.RolUsuario = null
      this.sucursalId = null
    }
  },
  
  persist: {
    paths: ['user', 'isAuthenticated', 'RolUsuario', 'sucursalId'] // Persistir solo lo necesario
  }
})