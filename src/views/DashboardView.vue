<template>
  <div class="dashboard-view">
    <NavBar @toggle-sidebar="toggleSidebar" />

    <SideBar
      v-model:visible="sidebarVisible"
      v-model:current-section="currentSection"
    />

    <div
      class="main-content"
      :class="{ 'collapsed': !sidebarVisible && !isMobile }"
    >
      <div class="content-container">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '@/components/dashboard/NavBar.vue'
import SideBar from '@/components/dashboard/SideBar.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import PedidosPendientes from '@/components/dashboard/PedidosPendientes.vue'
import SucursalesAdmin from '@/components/dashboard/SucursalesAdmin.vue'
import UsuariosAdmin from '@/components/dashboard/UsuariosAdmin.vue'
import QrConfig from '@/components/dashboard/QrConfig.vue'

type DashboardSection = 
  | 'dashboard' 
  | 'pedidos' 
  | 'sucursales' 
  | 'usuarios' 
  | 'configuracion'

const sidebarVisible = ref(true)
const currentSection = ref<DashboardSection>('dashboard')
const isMobile = ref(false)

// Component mapping for better type safety
const sectionComponents = {
  dashboard: Dashboard,
  pedidos: PedidosPendientes,
  sucursales: SucursalesAdmin,
  usuarios: UsuariosAdmin,
  configuracion: QrConfig
} as const

const currentComponent = computed(() => {
  return sectionComponents[currentSection.value] || Dashboard
})

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768
  sidebarVisible.value = !isMobile.value
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// Event listeners
onMounted(() => {
  window.addEventListener('resize', checkScreen)
  checkScreen() // Initial check
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  margin-top: 60px;
  margin-left: 250px;
  padding: 1rem;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
}

.main-content.collapsed {
  margin-left: 70px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 0.5rem;
  }
  
  .main-content.collapsed {
    margin-left: 0;
  }

  .content-container {
    padding: 1rem;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>