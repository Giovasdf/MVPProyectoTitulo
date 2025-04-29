import { defineStore } from 'pinia'
import { loginUser, logout, isLoggedIn, currentUser, type User } from '@/services/pocketbase'

// Extiende la interfaz User de PocketBase con campos adicionales
interface AuthUser extends User {
  rol?: string
  sucursal_id?: string
  expand?: {
    sucursal_id?: {
      id: string
      nombre?: string
    }
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    RolUsuario: null as string | null,
    sucursalId: null as string | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAdmin(): boolean {
      return this.RolUsuario === 'admin'
    },
    currentSucursalId(): string | null {
      return this.sucursalId
    },
    // Getter para obtener el nombre de la sucursal si está expandido
    sucursalNombre(): string | null {
      return this.user?.expand?.sucursal_id?.nombre || null
    }
  },
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const authData = await loginUser(email, password)
        this.isAuthenticated = isLoggedIn()
        this.user = currentUser()
        this.updateUserData()
        return authData
      } catch (err) {
        console.error('Login error:', err)
        this.error = err instanceof Error ? err.message : 'Credenciales incorrectas'
        throw err // Re-lanzar el error para manejo en componentes
      } finally {
        this.loading = false
      }
    },
    
    async checkAuth() {
      try {
        this.isAuthenticated = isLoggedIn()
        if (this.isAuthenticated) {
          this.user = currentUser()
          this.updateUserData()
        }
        return this.isAuthenticated
      } catch (err) {
        console.error('Auth check error:', err)
        this.isAuthenticated = false
        return false
      }
    },
    
    updateUserData() {
      if (!this.user) {
        this.RolUsuario = null
        this.sucursalId = null
        return
      }

      // Manejo del rol
      this.RolUsuario = this.user.rol || 
                       (this.user.isAdmin ? 'admin' : 'user') || 
                       null

      // Manejo de la sucursal (directa o relación expandida)
      this.sucursalId = this.user.sucursal_id || 
                        this.user.expand?.sucursal_id?.id || 
                        null
    },
    
    async logout() {
      try {
        await logout()
        this.$reset() // Resetea todo el estado
      } catch (err) {
        console.error('Logout error:', err)
        throw err
      }
    }
  },
  
  persist: {
    key: 'auth-store', // Clave única para localStorage
    paths: [
      'user', 
      'isAuthenticated', 
      'RolUsuario', 
      'sucursalId'
    ],
    // Opcional: Usar sessionStorage en lugar de localStorage
    // storage: sessionStorage
  }
})