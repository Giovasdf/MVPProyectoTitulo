<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>Cambiar estado del pedido</h3>
        <select v-model="estadoSeleccionado" class="select-estado">
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="PROCESANDO">PROCESANDO</option>
          <option value="COMPLETADO">COMPLETADO</option>
        </select>
        <div style="margin-top: 1rem">
          <button class="btn-guardar" @click="guardar">Guardar</button>
          <button class="btn-cerrar" @click="$emit('cerrar')">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, defineEmits } from 'vue'
  import PocketBase from 'pocketbase'
  
  const pb = new PocketBase('http://127.0.0.1:8090')
  
  const props = defineProps<{
    pedidoId: string
    estadoActual: string
  }>()
  
  const emit = defineEmits<{
    (e: 'cerrar'): void
    (e: 'estadoActualizado', nuevoEstado: string): void
  }>()
  
  const estadoSeleccionado = ref(props.estadoActual)
  
  const guardar = async () => {
    try {
      await pb.collection('orders').update(props.pedidoId, {
        estado: estadoSeleccionado.value
      })
      emit('estadoActualizado', estadoSeleccionado.value)
      emit('cerrar')
    } catch (error) {
      console.error('❌ Error actualizando estado:', error)
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .select-estado {
    width: 100%;
    padding: 0.5rem;
    margin-top: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
  
  .btn-cerrar,
  .btn-guardar {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }
  
  .btn-cerrar {
    background: #ccc;
    color: #333;
  }
  
  .btn-guardar {
    background: #6F7D54;
    color: white;
    margin-right: 0.5rem;
  }
  </style>
  