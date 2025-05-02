<template>
  <div
    class="sidebar"
    :class="{
      'sidebar-collapsed': !visible && !isMobile,
      'sidebar-hidden': isMobile && !visible
    }"
    role="navigation"
    aria-label="Menú de navegación"
  >
    <div class="sidebar-menu">
      <div class="menu-header" v-if="visible || isMobile">Menú</div>
      <nav class="menu-nav">
        <button
          v-for="item in filteredItems"
          :key="item.section"
          class="menu-item"
          :class="{ active: current === item.section }"
          @click="select(item.section)"
          :aria-label="item.label"
        >
          <i :class="item.icon" class="menu-icon"></i>
          <span class="menu-text" v-show="visible">{{ item.label }}</span>
          <span class="menu-tooltip" v-if="!visible">{{ item.label }}</span>
        </button>
        <button
          class="menu-item logout-item"
          @click="handleLogout"
          aria-label="Cerrar sesión"
        >
          <i class="fas fa-sign-out-alt menu-icon"></i>
          <span class="menu-text" v-show="visible">Cerrar sesión</span>
          <span class="menu-tooltip" v-if="!visible">Cerrar sesión</span>
        </button>
      </nav>
       
    </div>
  </div>

  <!-- Overlay para móviles -->
  <div class="sidebar-overlay" v-if="isMobile && visible" @click="closeSidebar"></div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ visible: boolean; currentSection: string }>();
const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'update:currentSection', section: string): void;
}>();

const router = useRouter();
const isMobile = ref(window.innerWidth < 768);
const current = ref(props.currentSection);
const authStore = useAuthStore();

const items = [
  { 
    section: 'dashboard', 
    label: 'Dashboard', 
    icon: 'fas fa-chart-line',
    requiresAdmin: false
  },
  { 
    section: 'pedidos', 
    label: 'Pedidos', 
    icon: 'fas fa-notes-medical',
    requiresAdmin: false
  },
  { 
    section: 'sucursales', 
    label: 'Sucursales', 
    icon: 'fas fa-store-alt',
    requiresAdmin: true
  },
  { 
    section: 'usuarios', 
    label: 'Usuarios', 
    icon: 'fas fa-users-cog',
    requiresAdmin: true
  },
];

// Filtra los elementos del menú según el rol del usuario
const filteredItems = computed(() => {
  return items.filter(item => {
    // Si el elemento requiere privilegios de admin, verificar el rol del usuario
    if (item.requiresAdmin) {
      return authStore.RolUsuario === 'admin';
    }
    // Si no requiere privilegios de admin, mostrar siempre
    return true;
  });
});

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    emit('update:visible', false);
  }
};

onMounted(() => {
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

watch(() => props.currentSection, v => (current.value = v));

const select = (section: string) => {
  current.value = section;
  emit('update:currentSection', section);
  if (isMobile.value) closeSidebar();
};

const closeSidebar = () => {
  emit('update:visible', false);
};

const handleLogout = async () => {
  try {
    authStore.logout();
    router.push('/login');
    if (isMobile.value) closeSidebar();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  background: #0d6efd;
  color: #fff;
  padding-top: 60px;
  transition: width 0.3s, transform 0.3s;
  z-index: 1000;
}
.sidebar-collapsed { width: 70px; }
.sidebar:not(.sidebar-collapsed) { width: 250px; }
.sidebar-hidden { transform: translateX(-100%); }

.sidebar-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); z-index: 900;
}

.sidebar-menu { display: flex; flex-direction: column; height: 100%; padding: 1rem; }
.menu-header { font-weight: bold; margin-bottom: 1rem; }

.menu-nav { flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.menu-item {
  display: flex; align-items: center;
  background: none; border: none; width: 100%;
  padding: 0.75rem; border-radius: 4px; cursor: pointer;
  position: relative; color: #fff; text-align: left;
  transition: background 0.2s;
}
.menu-item:hover { background: rgba(255,255,255,0.1); }
.menu-item.active { background: rgba(255,255,255,0.3); }

.menu-icon { width: 24px; text-align: center; margin-right: 0.75rem; }
.menu-text { white-space: nowrap; }
.logout-container { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1rem; }
.logout-item:hover { background: rgba(255,0,0,0.2); }

.menu-tooltip {
  position: absolute; left: 100%; top: 50%;
  transform: translateY(-50%); background: #333; color: #fff;
  padding: 0.5rem; border-radius: 4px; white-space: nowrap;
  opacity: 0; pointer-events: none; transition: opacity 0.2s; margin-left: 8px;
}
.menu-item:hover .menu-tooltip { opacity: 1; }
</style>