<template>
    <div class="dashboard-panel">
      <h2>Bienvenido a MediBot</h2>
  
      <div class="kpi-container">
        <div class="kpi-card">
          <h3>Total Pedidos</h3>
          <p>{{ totalPedidos }}</p>
        </div>
        <div class="kpi-card">
          <h3>Pendientes</h3>
          <p>{{ pendientes }}</p>
        </div>
        <div class="kpi-card">
          <h3>Entregados</h3>
          <p>{{ entregados }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'
  
  const pb = new PocketBase('http://127.0.0.1:8090')
  
  const totalPedidos = ref(0)
  const pendientes = ref(0)
  const entregados = ref(0)
  
  const cargarKpis = async () => {
    try {
      const pedidos = await pb.collection('orders').getFullList({ sort: '-created' })
      totalPedidos.value = pedidos.length
      pendientes.value = pedidos.filter(p => p.estado === 'pendiente').length
      entregados.value = pedidos.filter(p => p.estado === 'entregado').length
    } catch (err) {
      console.error('Error al cargar KPIs:', err)
    }
  }
  
  onMounted(cargarKpis)
  </script>
  
  <style scoped>
  .dashboard-panel {
    padding: 1rem;
  }
  
  .kpi-container {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  
  .kpi-card {
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    min-width: 200px;
    flex: 1;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .kpi-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #2b6efd;
  }
  
  .kpi-card p {
    font-size: 1.75rem;
    font-weight: bold;
    color: #333;
  }
  </style>
  