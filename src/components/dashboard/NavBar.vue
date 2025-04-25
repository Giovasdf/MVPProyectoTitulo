<template>
  <nav class="navbar" role="banner">
    <div class="navbar-container">
      <button
        class="navbar-toggler"
        @click="$emit('toggle-sidebar')"
        aria-label="Abrir o cerrar menú"
      >
        <i class="fas fa-bars"></i>
      </button>
      <div class="navbar-brand" aria-label="Inicio">
        <span class="brand-icon">💊</span>
        <span class="brand-text">Farmacia Dashboard</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  background: #0d6efd; color: #fff;
  padding: 0.75rem 1rem; z-index: 1100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.navbar-container { display: flex; align-items: center; max-width: 1200px; margin: 0 auto; }
.navbar-toggler {
  background: none; border: none; color: inherit;
  font-size: 1.25rem; margin-right: 1rem;
  width: 40px; height: 40px; cursor: pointer;
}

.brand-icon { font-size: 1.5rem; margin-right: 0.5rem; }
.brand-text { font-weight: bold; font-size: 1.2rem; }
</style>
