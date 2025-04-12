<template>
  <!-- Sección de características -->
  <section id="features-section" class="features-section">
    <!-- Capa oscura transparente sobre la imagen -->
    <div class="features-overlay"></div>

    <div class="features-content">
      <h2>¿Qué puede hacer MediBot?</h2>
      <ul class="features-list">
        <li>🤖 Atención automatizada por WhatsApp</li>
        <li>📦 Gestión de pedidos con IA</li>
        <li>📊 Dashboard en tiempo real</li>
        <li>🔐 Seguro, privado y fácil de usar</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  position: relative;
  background: url('@/assets/img/ia.jpg') no-repeat center top;
  background-size: cover;
  background-position: center 30%; /* <- Esto baja la imagen */
  padding: 3rem 1rem;
  text-align: center;
  color: #ffffff;
  overflow: hidden;
}


/* Capa de color al frente */
.features-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:#6f7d549f; /* Azul oscuro con transparencia */
  z-index: 1;
}

/* Contenido por encima del fondo + overlay */
.features-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
}

.features-section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-size: 1.1rem;
  color: #f1f1f1;
}
</style>
