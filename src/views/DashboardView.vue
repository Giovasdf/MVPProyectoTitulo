<template>
  <div class="home-view">
    <NavBar @toggle-sidebar="toggleSidebar" />

    <div class="main-layout">
      <SideBar :visible="sidebarVisible" @select-section="setSection" />

      <div
        class="main-content"
        :class="{ 'content-expanded': !sidebarVisible }"
      >
        <div class="content-container">
          <PedidosPendientes v-if="currentSection === 'dashboard'" />
          <div v-if="currentSection === 'medicamentos'">
            <h2>Sección Medicamentos</h2>
            <p>Aquí iría el contenido de medicamentos.</p>
          </div>
          <div v-if="currentSection === 'ventas'">
            <h2>Sección Ventas</h2>
            <p>Aquí iría el contenido de ventas.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavBar from '../components/dashboard/NavBar.vue'
import SideBar from '../components/dashboard/SideBar.vue'
import PedidosPendientes from '../components/dashboard/PedidosPendientes.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    NavBar,
    SideBar,
    PedidosPendientes
  },
  setup() {
    const sidebarVisible = ref(true)
    const currentSection = ref<'dashboard' | 'medicamentos' | 'ventas'>('dashboard')

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value
    }

    const setSection = (section: string) => {
      currentSection.value = section as any
    }

    return {
      sidebarVisible,
      toggleSidebar,
      currentSection,
      setSection
    }
  }
})
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
  width: 100%;
}

/* Contenedor principal del contenido */
.main-content {
  margin-left: 250px;
  padding: 1rem;
  transition: all 0.3s ease;
  background-color: #f5f7fa;
  width: calc(100% - 250px);
  min-height: 100vh;
}

.content-expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
