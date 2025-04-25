<template>
    <div class="usuarios-admin">
      <h2>Gestión de Usuarios</h2>
  
      <form @submit.prevent="crearUsuario" class="usuario-form">
        <input v-model="nombre" placeholder="Nombre" required />
        <input v-model="email" placeholder="Email" type="email" required />
        <select v-model="rol">
          <option value="admin">Admin</option>
          <option value="operador">Operador</option>
        </select>
        <input v-model="password" placeholder="Contraseña" type="password" required />
        <button type="submit">Agregar</button>
      </form>
  
      <ul class="usuario-lista">
        <li v-for="usuario in usuarios" :key="usuario.id" class="usuario-item">
          {{ usuario.nombre }} - {{ usuario.email }} - {{ usuario.rol }}
          <button @click="eliminarUsuario(usuario.id)">Eliminar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  
  const pb = new PocketBase('http://127.0.0.1:8090')
  
  interface Usuario {
    id: string
    nombre: string
    email: string
    rol: string
    sucursal_id: string
  }
  
  const usuarios = ref<Usuario[]>([])
  const nombre = ref('')
  const email = ref('')
  const password = ref('')
  const rol = ref('admin')
  const sucursalId = 'tu-sucursal-id-aqui' // Reemplaza con tu lógica real
  
  const cargarUsuarios = async () => {
    usuarios.value = await pb.collection('usuarios').getFullList<Usuario>({
      filter: `sucursal_id="${sucursalId}"`,
      sort: '-fecha_creacion'
    })
  }
  
  const crearUsuario = async () => {
    await pb.collection('usuarios').create({
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: rol.value,
      sucursal_id: sucursalId
    })
    nombre.value = ''
    email.value = ''
    password.value = ''
    rol.value = 'admin'
    await cargarUsuarios()
  }
  
  const eliminarUsuario = async (id: string) => {
    await pb.collection('usuarios').delete(id)
    await cargarUsuarios()
  }
  
  onMounted(() => {
    cargarUsuarios()
  })
  </script>
  
  <style scoped>
  .usuarios-admin {
    padding: 1rem;
  }
  
  .usuario-form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  
  .usuario-form input,
  .usuario-form select {
    padding: 8px;
    flex: 1 1 200px;
  }
  
  .usuario-form button {
    padding: 8px 12px;
    background-color: #2B6EFD;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .usuario-lista {
    list-style: none;
    padding: 0;
  }
  
  .usuario-item {
    display: flex;
    justify-content: space-between;
    background: #f1f1f1;
    margin-bottom: 6px;
    padding: 8px;
    border-radius: 4px;
  }
  
  .usuario-item button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  