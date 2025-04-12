<template>
  <section id="why-us" class="porque-section">
    <h2 class="section-title">¿Por qué elegir MediBot?</h2>
    <div class="icon-grid">
      <div class="icon-box">
        <div class="icon-circle">
          <i class="fas fa-robot"></i>
        </div>
        <p>Automatización Inteligente</p>
      </div>
      <div class="icon-box">
        <div class="icon-circle">
          <i class="fas fa-shield-alt"></i>
        </div>
        <p>Seguridad y Privacidad</p>
      </div>
      <div class="icon-box">
        <div class="icon-circle">
          <i class="fas fa-headset"></i>
        </div>
        <p>Soporte Personalizado</p>
      </div>
      <div class="icon-box">
        <div class="icon-circle">
          <i class="fas fa-chart-line"></i>
        </div>
        <p>Análisis en Tiempo Real</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No requiere lógica aún
</script>

<style scoped>
.porque-section {
  background-color: #f9f9f9;
  padding: 3rem 1rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2b6dfc;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background-color: #ffffff;
  border: 3px solid #2b6dfc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #2b6dfc;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.icon-circle:hover {
  transform: scale(1.1);
}

.icon-box p {
  font-size: 1rem;
  color: #333;
}
</style>
