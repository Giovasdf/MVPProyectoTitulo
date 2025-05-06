<template>
  <h1>Pedidos Pendientes</h1>
  <div class="pedidos-container">
    <!-- Filtros -->
    <div class="filtros-container">
      <div class="filtro-group">
        <label for="filtro-cliente">Filtrar por cliente:</label>
        <input id="filtro-cliente" v-model="filtroCliente" type="text" placeholder="Nombre del cliente"
          @input="aplicarFiltros">
      </div>

      <div class="filtro-group">
        <label for="filtro-estado">Filtrar por estado:</label>
        <select id="filtro-estado" v-model="filtroEstado" @change="aplicarFiltros">
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparando">Preparando</option>
          <option value="entregado">Entregado</option>
        </select>
      </div>

      <div class="filtro-group">
        <label for="orden-fecha">Ordenar por fecha:</label>
        <select id="orden-fecha" v-model="ordenFecha" @change="aplicarFiltros">
          <option value="-created">Más recientes primero</option>
          <option value="created">Más antiguos primero</option>
        </select>
      </div>
    </div>

    <div class="pedidos-header">
      <span class="badge estado-pendiente">{{ pendientes.length }} Pendientes</span>
      <span class="badge estado-preparando">{{ preparando.length }} Preparando</span>
      <span class="badge estado-entregado">{{ entregados.length }} Entregados</span>
    </div>

    <div class="pedidos-list" data-testid="lista-pedidos">
      <div v-for="pedido in pedidosFiltrados" :key="pedido.id" class="pedido-card">
        <div class="pedido-info">
          <span class="pedido-id">#{{ pedido.id }}</span>
          <span class="pedido-cliente">{{ pedido.cliente }}</span>
          <span class="pedido-fecha">{{ formatFecha(pedido.fecha) }}</span>
        </div>
        <div class="pedido-estado" :class="`estado-${pedido.estado}`">
          {{ pedido.estado }}
        </div>
        <div class="pedido-acciones">
          <button class="btn-detalle" @click="abrirDetalle(pedido)">
            <i class="fas fa-eye"></i>
            <span class="btn-text">Ver</span>
          </button>
          <button class="btn-detalle" @click="abrirCambioEstado(pedido)">
            <i class="fas fa-sync-alt"></i>
            <span class="btn-text">Cambiar estado</span>
          </button>
        </div>
      </div>

      <div v-if="pedidosFiltrados.length === 0 && !cargando" class="sin-resultados">
        No se encontraron pedidos con los filtros aplicados
      </div>
      <div v-if="cargando" class="sin-resultados">
        Cargando pedidos...
      </div>
    </div>
  </div>

  <PedidoDetalleModal v-if="modalDetalleVisible" :pedido="detalleSeleccionado" @cerrar="modalDetalleVisible = false" />

  <CambiarEstadoModal v-if="modalEstadoVisible && pedidoEditando" :pedido-id="pedidoEditando.id"
    :estado-actual="pedidoEditando.estado" @cerrar="modalEstadoVisible = false" @estadoActualizado="actualizarEstado" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'
import PedidoDetalleModal from './PedidoDetalleModal.vue'
import CambiarEstadoModal from './CambiarEstadoModal.vue'
import { useAuthStore } from '@/stores/auth'

const pb = new PocketBase('https://database-mvp-production.up.railway.app')
const authStore = useAuthStore()

// Interfaces
interface Producto {
  producto: string
  cantidad: number
  dosis: string
  observaciones: string
  requiereReceta: boolean
}

interface Pedido {
  id: string
  cliente: string
  fecha: string
  items: Producto[]
  estado: string
}

interface RecordPedido extends RecordModel {
  id: string
  nombre_cliente: string
  created: string
  estado?: string
  sucursal_id: string
}

// Refs
const pedidos = ref<Pedido[]>([])
const modalDetalleVisible = ref(false)
const modalEstadoVisible = ref(false)
const detalleSeleccionado = ref<Pedido | null>(null)
const pedidoEditando = ref<Pedido | null>(null)
const filtroCliente = ref('')
const filtroEstado = ref('')
const ordenFecha = ref('-created')
const cargando = ref(true)
const todosLosPedidos = ref<Pedido[]>([])


// Computed
const pendientes = computed(() => pedidos.value.filter(p => p.estado === 'pendiente'))
const preparando = computed(() => pedidos.value.filter(p => p.estado === 'preparando'))
const entregados = computed(() => pedidos.value.filter(p => p.estado === 'entregado'))

const pedidosFiltrados = computed(() => {
  return todosLosPedidos.value
    .filter(pedido => {
      const coincideCliente = pedido.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase())
      const coincideEstado = !filtroEstado.value || pedido.estado === filtroEstado.value
      return coincideCliente && coincideEstado
    })
    .sort((a, b) => {
      return ordenFecha.value === '-created'
        ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        : new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    })
})


// Métodos
const formatFecha = (fecha: string): string =>
  new Date(fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

const abrirDetalle = (pedido: Pedido) => {
  detalleSeleccionado.value = pedido
  modalDetalleVisible.value = true
}

const abrirCambioEstado = (pedido: Pedido) => {
  pedidoEditando.value = pedido
  modalEstadoVisible.value = true
}

const actualizarEstado = (nuevoEstado: string) => {
  if (!pedidoEditando.value) return
  const index = pedidos.value.findIndex(p => p.id === pedidoEditando.value?.id)
  if (index !== -1) pedidos.value[index].estado = nuevoEstado
}

const aplicarFiltros = async () => {
  try {
    cargando.value = true
    const sucursalId = authStore.user?.sucursal_id
    if (!sucursalId) return

    let filter = `sucursal_id = "${sucursalId}"`

    if (filtroEstado.value) {
      filter += ` && estado = "${filtroEstado.value}"`
    }

    if (filtroCliente.value) {
      filter += ` && nombre_cliente ~ "${filtroCliente.value}"`
    }

    const result = await pb.collection('pedidos').getFullList({
      sort: ordenFecha.value,
      filter: filter,
      expand: 'sucursal_id',
    })

    const pedidosProcesados: Pedido[] = []
    for (const record of result) {
      try {
        const pedido = await mapPedidoData(record as RecordPedido)
        pedidosProcesados.push(pedido)
      } catch (error) {
        console.error(`Error preparando pedido ${record.id}:`, error)
      }
    }

    pedidos.value = pedidosProcesados
  } catch (error) {
    console.error('❌ Error al filtrar pedidos:', error)
  } finally {
    cargando.value = false
  }
}

const mapPedidoData = async (record: RecordPedido): Promise<Pedido> => {
  try {
    // Obtener productos del pedido si es necesario
    let items: Producto[] = []

    if (record.resultado_json && Array.isArray(record.resultado_json)) {
      // Usar datos de resultado_json si están disponibles
      items = record.resultado_json.map((prod: any) => ({
        producto: prod.nombre_producto || 'Producto desconocido',
        cantidad: prod.cantidad || 1,
        dosis: prod.dosis || '',
        observaciones: prod.observaciones || '',
        requiereReceta: prod.requiereReceta || false
      }))
    } else {
      // Consultar productos_pedido si no hay datos en resultado_json
      const productos = await pb.collection('productos_pedido').getFullList({
        filter: `pedido_id ~ "${record.id}"`,
        requestKey: `productos_${record.id}`
      })

      items = productos.map((prod: any) => ({
        producto: prod.nombre_producto,
        cantidad: prod.cantidad,
        dosis: prod.dosis,
        observaciones: prod.observaciones,
        requiereReceta: prod.requiereReceta ?? false
      }))
    }

    return {
      id: record.id,
      cliente: record.nombre_cliente,
      fecha: record.created,
      items,
      estado: record.estado || 'pendiente'
    }
  } catch (error) {
    console.error(`Error al mapear pedido ${record.id}:`, error)
    return {
      id: record.id,
      cliente: record.nombre_cliente,
      fecha: record.created,
      items: [],
      estado: record.estado || 'pendiente'
    }
  }
}

const fetchPedidos = async () => {
  try {
    cargando.value = true
    const sucursalId = authStore.user?.sucursal_id
    if (!sucursalId) return

    const result = await pb.collection('pedidos').getFullList({
    })

    const pedidosProcesados: Pedido[] = []
    for (const record of result) {
      try {
        const pedido = await mapPedidoData(record as RecordPedido)
        pedidosProcesados.push(pedido)
      } catch (error) {
        console.error(`Error preparando pedido ${record.id}:`, error)
      }
    }

    pedidos.value = pedidosProcesados

    pedidos.value = pedidosProcesados
    todosLosPedidos.value = pedidosProcesados
    console.log('Pedidos cargados:', pedidos.value)
  } catch (error) {
    console.error('❌ Error al cargar pedidos:', error)
  } finally {
    cargando.value = false
  }

}

const setupRealtime = () => {
  const sucursalId = authStore.user?.sucursal_id
  if (!sucursalId) return

  pb.collection('pedidos').subscribe('*', async (e) => {
    if (e.record.sucursal_id !== sucursalId) return

    try {
      const nuevoPedido = await mapPedidoData(e.record as RecordPedido)
      const index = pedidos.value.findIndex(p => p.id === nuevoPedido.id)

      switch (e.action) {
        case 'create':
          pedidos.value.unshift(nuevoPedido)
          break
        case 'update':
          if (index !== -1) pedidos.value.splice(index, 1, nuevoPedido)
          else pedidos.value.unshift(nuevoPedido)
          break
        case 'delete':
          if (index !== -1) pedidos.value.splice(index, 1)
          break
      }
    } catch (error) {
      console.error('Error preparando evento realtime:', error)
    }
  })
}

const cleanupRealtime = () => {
  pb.collection('pedidos').unsubscribe('*')
}

onMounted(async () => {
  try {
    await authStore.checkAuth()
    await fetchPedidos()
    setupRealtime()
  } catch (error) {
    console.error('Error en onMounted:', error)
    cargando.value = false
  }
})

onBeforeUnmount(() => {
  cleanupRealtime()
})
</script>

<style scoped>
.text-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.pedidos-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin: 1rem;
}

.pedidos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.pedidos-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #546FA7;
}

.badge {
  background: #ff4757;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.estado-pendiente {
  background: #e67e22;
}

.estado-preparando {
  background: #3498db;
}

.estado-entregado {
  background: #2ecc71;
}

.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 200px;
}

.pedido-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.pedido-card:hover {
  background: #f1f1f1;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pedido-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pedido-id {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.pedido-cliente {
  font-size: 1rem;
  color: #34495e;
  font-weight: 500;
}

.pedido-fecha {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.pedido-estado {
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 1.5rem;
  color: white;
  text-transform: capitalize;
}

.pedido-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-detalle {
  background: #6F7D54;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-detalle:hover {
  background: #5a6743;
}

.btn-detalle i {
  font-size: 0.9rem;
}

/* Filtros */
.filtros-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
}

.filtro-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

.filtro-group input,
.filtro-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
}

/* Estados */
.sin-resultados {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 1rem;
}

/* Modal */
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filtro-group {
    min-width: 100%;
  }

  .pedido-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .pedido-estado {
    margin: 0;
    align-self: flex-start;
  }

  .pedido-acciones {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>