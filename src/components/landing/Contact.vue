<template>
  <section id="contact" class="section-container">
    <h2 class="section-title">Contáctanos</h2>
    <form class="contact-form" @submit.prevent="enviar">
      <input type="text" placeholder="Tu nombre" required />
      <input type="email" placeholder="Tu correo electrónico" required />
      <textarea rows="4" placeholder="Escribe tu mensaje..." required></textarea>
      <button type="submit">Enviar mensaje</button>
    </form>
  </section>
</template>

<script setup lang="ts">
const enviar = () => {
  alert('Mensaje enviado. Pronto te contactaremos.')
}
</script>

<style scoped>
.section-container {
  background-color: #ffffff;
  padding: 3rem 1rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #2b6dfc;
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
  background-color: #2b6dfc;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.contact-form button:hover {
  background-color: #1a52c5;
}
</style>
