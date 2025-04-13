<!-- src/components/dashboard/PedidoDetalleModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal-content">
      <h3>Detalle del Pedido</h3>
      <p><strong>Cliente:</strong> {{ pedido?.cliente }}</p>
      <p><strong>Fecha:</strong> {{ formatFecha(pedido?.fecha || '') }}</p>
      <p><strong>Productos:</strong> {{ pedido?.items.length }}</p>
      <ul>
        <li v-for="(item, index) in pedido?.items" :key="index">
          {{ item.cantidad }}x {{ item.producto }}
          <span v-if="item.dosis">({{ item.dosis }})</span>
          <span v-if="item.requiereReceta"> - <strong>Requiere receta</strong></span>
        </li>
      </ul>
      <button class="btn-detalle" @click="$emit('cerrar')">Cerrar</button>
    </div>
  </div>
</template>

  <script lang="ts" setup>
  import { defineProps } from 'vue'
  
  interface Producto {
    producto: string
    cantidad: number
    dosis: string
    requiereReceta: boolean
  }
  
  interface Pedido {
    id: string
    cliente: string
    fecha: string
    items: Producto[]
    estado: string
  }
  
  const props = defineProps<{
    pedido: Pedido | null
  }>()
  
  const formatFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
    text-align: left;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .modal-content h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  .modal-content p {
    margin: 0.5rem 0;
    color: #34495e;
    font-size: 0.95rem;
  }
  
  .modal-content ul {
    margin-top: 0.5rem;
    padding-left: 1.25rem;
  }
  
  .modal-content li {
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-size: 0.95rem;
  }
  
  .btn-detalle {
    background: #6F7D54;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 1rem;
    transition: background 0.2s ease;
  }
  
  .btn-detalle:hover {
    background: #5a6743;
  }
  </style>
  
  