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
      <div class="kpi-card" v-if="userStore.user?.rol === 'admin'">
        <h3>Sucursales Activas</h3>
        <p>{{ sucursalesActivas }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { pb } from '@/services/pocketbase' // Importación corregida

const authStore = useAuthStore()
const userStore = useAuthStore()

const totalPedidos = ref(0)
const pendientes = ref(0)
const entregados = ref(0)
const sucursalesActivas = ref(0)

const cargarKpis = async () => {
  try {
    const filter = userStore.user?.rol === 'admin' 
      ? '' 
      : `sucursal_id = "${userStore.user?.sucursal_id}"`
    
    const pedidos = await pb.collection('pedidos').getFullList({ 
      sort: '-created',
      filter
    })

    totalPedidos.value = pedidos.length
    pendientes.value = pedidos.filter(p => p.estado === 'pendiente').length
    entregados.value = pedidos.filter(p => p.estado === 'entregado').length

    if (userStore.user?.rol === 'admin') {
      const sucursales = await pb.collection('sucursales').getFullList()
      sucursalesActivas.value = sucursales.length
    }
  } catch (err) {
    console.error('Error al cargar KPIs:', err)
  }
}

onMounted(() => {
  authStore.checkAuth().then(cargarKpis)
})
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
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-3px);
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

@media (max-width: 768px) {
  .kpi-card {
    min-width: 100%;
  }
}
</style>