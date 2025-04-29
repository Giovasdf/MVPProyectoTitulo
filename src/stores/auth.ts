import { defineStore } from 'pinia'
import { loginUser, logout as logoutService, isLoggedIn, currentUser, type User } from '@/services/pocketbase'

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
        throw err
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

      this.RolUsuario = this.user.rol || null
      this.sucursalId =
        this.user.sucursal_id ||
        this.user.expand?.sucursal_id?.id ||
        null
    },

    async logout() {
      try {
        await logoutService()
        this.$reset()
      } catch (err) {
        console.error('Logout error:', err)
        throw err
      }
    }
  },

  persist: true // Ahora solo debes colocar persist: true si estás usando el plugin
})
