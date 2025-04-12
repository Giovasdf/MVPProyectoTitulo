<template>
  <section id="contact" class="section-container">
    <div class="overlay"></div>

    <div class="contact-content">
      <h2 class="section-title">Contáctanos</h2>
      <form class="contact-form" @submit.prevent="enviar">
        <input type="text" placeholder="Tu nombre" required />
        <input type="email" placeholder="Tu correo electrónico" required />
        <textarea rows="4" placeholder="Escribe tu mensaje..." required></textarea>
        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const enviar = () => {
  alert('Mensaje enviado. Pronto te contactaremos.')
}
</script>

<style scoped>
.section-container {
  position: relative;
  background: url('@/assets/img/contact.jpg') no-repeat center center;
  background-size: cover;
  padding: 4rem 1rem;
  text-align: center;
  overflow: hidden;
}

/* Capa oscura encima */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #5470a792;
  z-index: 1;
}

.contact-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.contact-form input,
.contact-form textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.contact-form button {
  background-color: #ffffff;
  color: #2b6dfc;
  border: none;
  padding: 0.75rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.contact-form button:hover {
  background-color: #e0e0e0;
}
</style>
