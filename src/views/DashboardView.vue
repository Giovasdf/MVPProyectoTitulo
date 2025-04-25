<template>
  <div class="dashboard-view">
    <NavBar @toggle-sidebar="toggleSidebar" />

    <SideBar
      v-model:visible="sidebarVisible"
      v-model:currentSection="currentSection"
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import NavBar from '../components/dashboard/NavBar.vue';
import SideBar from '../components/dashboard/SideBar.vue';
import Dashboard from '../components/dashboard/Dashboard.vue';
import PedidosPendientes from '../components/dashboard/PedidosPendientes.vue';
import SucursalesAdmin from '../components/dashboard/SucursalesAdmin.vue';
import UsuariosAdmin from '../components/dashboard/UsuariosAdmin.vue';
import QrConfig from '../components/dashboard/QrConfig.vue';

export default defineComponent({
  name: 'DashboardView',
  components: { NavBar, SideBar },
  setup() {
    const sidebarVisible = ref(true);
    const currentSection = ref('dashboard');
    const isMobile = ref(window.innerWidth < 768);

    const checkScreen = () => {
      isMobile.value = window.innerWidth < 768;
      if (isMobile.value) sidebarVisible.value = false;
      else sidebarVisible.value = true;
    };

    onMounted(() => {
      window.addEventListener('resize', checkScreen);
      checkScreen();
    });
    onBeforeUnmount(() => window.removeEventListener('resize', checkScreen));

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value;
    };

    const currentComponent = computed(() => {
      switch (currentSection.value) {
        case 'pedidos': return PedidosPendientes;
        case 'sucursales': return SucursalesAdmin;
        case 'usuarios': return UsuariosAdmin;
        case 'configuracion': return QrConfig;
        default: return Dashboard;
      }
    });

    return { sidebarVisible, currentSection, toggleSidebar, isMobile, currentComponent };
  },
});
</script>

<style scoped>
.dashboard-view { display: flex; flex-direction: column; min-height: 100vh; }
.main-content {
  margin-top: 60px;
  margin-left: 250px;
  padding: 1rem;
  transition: margin-left 0.3s;
}
.main-content.collapsed { margin-left: 70px; }
.content-container {
  max-width: 1200px; margin: 0 auto;
  padding: 1.5rem; background: #fff;
  border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 0.5rem; }
  .content-container { padding: 1rem; border-radius: 0; }
}
</style>
