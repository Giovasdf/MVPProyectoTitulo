<template>
  <section id="hero" class="hero-section">
    <!-- Capa oscura sobre la imagen -->
    <div class="overlay"></div>

    <div class="hero-content">
      <h1 class="hero-title animate-pulse-once">Automatiza tu farmacia con MediBot</h1>
      <p class="hero-subtitle animate-pulse-once">Recibe pedidos por WhatsApp, usa inteligencia artificial y gestiona todo desde un solo lugar.</p>
      <a href="#contact" class="btn-primary">Solicita una demo</a>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  background: url('@/assets/img/hero.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 4rem 1rem;
  overflow: hidden;
}

/* Capa de color al frente con transparencia */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #5470a792;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #f1f1f1;
}

.btn-primary {
  display: inline-block;
  background-color: #ffffff;
  color: #2b6efd;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background-color: #e6e6e6;
}

/* Pulse: una sola vez */
@keyframes pulse-once {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.85;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-once {
  animation: pulse-once 1.6s ease-in-out 1;
  animation-fill-mode: both;
}
</style>
