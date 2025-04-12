<template>
  <section id="how-works" class="section-container dark">
    <h2 class="section-title">¿Cómo funciona MediBot?</h2>
    <div class="pasos-grid">
      <div class="paso">
        <span class="numero">1</span>
        <p>El cliente escribe por WhatsApp.</p>
      </div>
      <div class="paso">
        <span class="numero">2</span>
        <p>MediBot interpreta el pedido con IA.</p>
      </div>
      <div class="paso">
        <span class="numero">3</span>
        <p>El pedido se guarda automáticamente.</p>
      </div>
      <div class="paso">
        <span class="numero">4</span>
        <p>La farmacia confirma y gestiona el stock.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container.dark {
  background-color: #f0f4ff;
  padding: 3rem 1rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #2b6dfc;
  margin-bottom: 2rem;
}

.pasos-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 900px;
  margin: 0 auto;
}

.paso {
  background-color: white;
  border: 2px solid #2b6dfc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.numero {
  display: inline-block;
  background-color: #2b6dfc;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  line-height: 32px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
</style>
