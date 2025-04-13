<template>
  <div class="sidebar" :class="{ 'sidebar-hidden': !visible }">
    <div class="sidebar-menu">
      <div class="menu-header" v-if="visible">Menú</div>
      <nav class="menu-nav">
        <a class="menu-item" @click="select('dashboard')">
          <span class="menu-icon">
            <i class="fas fa-chart-line"></i>
          </span>
          <span class="menu-text" v-if="visible">Dashboard</span>
          <span class="menu-tooltip" v-if="!visible">
            <span class="tooltip-text">Dashboard</span>
          </span>
        </a>

        <a class="menu-item" @click="select('medicamentos')">
          <span class="menu-icon">
            <i class="fas fa-pills"></i>
          </span>
          <span class="menu-text" v-if="visible">Medicamentos</span>
          <span class="menu-tooltip" v-if="!visible">
            <span class="tooltip-text">Medicamentos</span>
          </span>
        </a>

        <a class="menu-item" @click="select('ventas')">
          <span class="menu-icon">
            <i class="fas fa-shopping-cart"></i>
          </span>
          <span class="menu-text" v-if="visible">Ventas</span>
          <span class="menu-tooltip" v-if="!visible">
            <span class="tooltip-text">Ventas</span>
          </span>
        </a>

        <a class="menu-item" @click="select('configuracion')">
          <span class="menu-icon">
            <i class="fas fa-cog"></i>
          </span>
          <span class="menu-text" v-if="visible">Configuración</span>
          <span class="menu-tooltip" v-if="!visible">
            <span class="tooltip-text">Configuración</span>
          </span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  (e: 'select-section', section: string): void
}>()

const select = (section: string) => {
  emit('select-section', section)
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #2B6EFD;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  transition: all 0.3s ease;
  padding-top: 60px;
  overflow: hidden;
}

.sidebar-hidden {
  width: 70px;
}

.sidebar-menu {
  padding: 1rem;
}

.menu-header {
  font-weight: 600;
  font-size: 1rem;
  color: #eeeded;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eeeded;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #eeeded;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.menu-text {
  font-size: 0.95rem;
}

.sidebar-hidden .menu-text,
.sidebar-hidden .menu-header {
  display: none;
}

.sidebar-hidden .menu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.menu-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

.menu-tooltip .tooltip-text {
  background-color: #6F7D54;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  white-space: nowrap;
  font-size: 0.85rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}

.menu-tooltip .tooltip-text::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #6F7D54;
}

.sidebar-hidden .menu-item:hover .menu-tooltip {
  opacity: 1;
  visibility: visible;
  margin-left: 15px;
}

.sidebar-hidden .menu-item:hover .menu-icon {
  background-color: #6F7D54;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  color: white;
}
</style>
