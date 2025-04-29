<template>
    <div class="sucursal-admin">
      <h2>Gestión de Sucursales</h2>
      <form @submit.prevent="crearSucursal" class="sucursal-form">
        <input v-model="nuevaDireccion" placeholder="Dirección de la sucursal" required />
        <button type="submit">Agregar</button>
      </form>
  
      <ul class="sucursal-lista">
        <li v-for="sucursal in sucursales" :key="sucursal.id" class="sucursal-item">
          {{ sucursal.direccion }}
          <button @click="eliminarSucursal(sucursal.id)">Eliminar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  
  const pb = new PocketBase('https://database-mvp-production.up.railway.app')
  
  interface Sucursal {
    id: string
    direccion: string
    farmacia_id: string
    fecha_creacion: string
  }
  
  const sucursales = ref<Sucursal[]>([])
  const nuevaDireccion = ref('')
  const farmaciaId = 'tu-farmacia-id-aqui' // Reemplaza con tu lógica real
  
  const cargarSucursales = async () => {
    sucursales.value = await pb.collection('sucursales').getFullList<Sucursal>({
      filter: `farmacia_id="${farmaciaId}"`,
      sort: '-fecha_creacion'
    })
  }
  
  const crearSucursal = async () => {
    await pb.collection('sucursales').create({
      direccion: nuevaDireccion.value,
      farmacia_id: farmaciaId
    })
    nuevaDireccion.value = ''
    await cargarSucursales()
  }
  
  const eliminarSucursal = async (id: string) => {
    await pb.collection('sucursales').delete(id)
    await cargarSucursales()
  }
  
  onMounted(() => {
    cargarSucursales()
  })
  </script>
  
  <style scoped>
  .sucursal-admin {
    padding: 1rem;
  }
  
  .sucursal-form {
    display: flex;
    gap: 10px;
    margin-bottom: 1rem;
  }
  
  .sucursal-form input {
    flex: 1;
    padding: 8px;
  }
  
  .sucursal-form button {
    padding: 8px 12px;
    background-color: #2B6EFD;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .sucursal-lista {
    list-style: none;
    padding: 0;
  }
  
  .sucursal-item {
    display: flex;
    justify-content: space-between;
    background: #f1f1f1;
    margin-bottom: 6px;
    padding: 8px;
    border-radius: 4px;
  }
  
  .sucursal-item button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  