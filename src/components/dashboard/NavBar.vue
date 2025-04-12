<template>
  <nav class="navbar">
    <div class="navbar-container">
      <button class="navbar-toggler" @click="toggleSidebar">
        <span class="toggler-icon"></span>
      </button>

      <a class="navbar-brand" href="#">
        <span class="brand-icon">💊</span>
        <span class="brand-text">Farmacia Dashboard</span>
      </a>
    </div>
  </nav>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>

<style scoped>
.navbar {
  background-color: #0d6efd;
  color: #fff;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.navbar-container {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  width: 100%;
}

/* Elimina el centrado en desktop */
@media (min-width: 992px) {
  .navbar-container {
    max-width: none;
    margin: 0;
  }
}

.navbar-toggler {
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  margin-right: 1rem;
  padding: 0.5rem;
}

.toggler-icon {
  width: 24px;
  height: 2px;
  background-color: #fff;
  display: block;
  position: relative;
}

.toggler-icon::before,
.toggler-icon::after {
  content: '';
  width: 24px;
  height: 2px;
  background-color: #fff;
  position: absolute;
  left: 0;
  transition: all 0.3s ease;
}

.toggler-icon::before {
  top: -6px;
}

.toggler-icon::after {
  top: 6px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.brand-text {
  font-weight: 600;
  font-size: 1.2rem;
  color: #fff;
}
</style>
