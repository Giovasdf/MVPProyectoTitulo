<template>
  <h1>Pedidos Pendientes</h1>
  <div class="pedidos-container">
    <div class="pedidos-header">
      <span class="badge estado-pendiente">{{ pendientes.length }} Pendientes</span>
      <span class="badge estado-procesando">{{ procesando.length }} Procesando</span>
      <span class="badge estado-completado">{{ completados.length }} Completados</span>
    </div>
    <div class="pedidos-list">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
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

const pedidos = ref<Pedido[]>([])
const modalDetalleVisible = ref(false)
const modalEstadoVisible = ref(false)
const detalleSeleccionado = ref<Pedido | null>(null)
const pedidoEditando = ref<Pedido | null>(null)

const pendientes = computed(() => pedidos.value.filter(p => p.estado === 'pendiente'))
const procesando = computed(() => pedidos.value.filter(p => p.estado === 'preparado'))
const completados = computed(() => pedidos.value.filter(p => p.estado === 'entregado'))

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

const mapPedidoData = async (record: RecordPedido): Promise<Pedido> => {
  try {
    const productos = await pb.collection('productos_pedido').getFullList({
      filter: `pedido_id="${record.id}"`,
      requestKey: `productos_${record.id}` // Clave única para cada solicitud
    })

    const items: Producto[] = productos.map((prod: RecordModel) => ({
      producto: prod['nombre_producto'],
      cantidad: prod['cantidad'],
      dosis: prod['dosis'],
      observaciones: prod['observaciones'],
      requiereReceta: prod['requiereReceta'] ?? false
    }))

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
    const sucursalId = authStore.user?.sucursal_id
    if (!sucursalId) return

    const result = await pb.collection('pedidos').getFullList({
      sort: '-created',
      expand: 'sucursal_id',
    });
    
    console.log('📦 Pedidos cargados:', result)
    
    // Procesar los pedidos en serie para evitar problemas de concurrencia
    const pedidosProcesados: Pedido[] = []
    for (const record of result) {
      try {
        const pedido = await mapPedidoData(record as RecordPedido)
        pedidosProcesados.push(pedido)
      } catch (error) {
        console.error(`Error procesando pedido ${record.id}:`, error)
      }
    }
    
    pedidos.value = pedidosProcesados
  } catch (error) {
    console.error('❌ Error al cargar pedidos:', error)
  }
}

const setupRealtime = () => {
  const sucursalId = authStore.user?.sucursal_id
  if (!sucursalId) return

  pb.collection('pedidos').subscribe('*', async (e) => {
    if (e.record.sucursal_id !== sucursalId) return

    console.log('📦 Realtime evento:', e.action, e.record)
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
      console.error('Error procesando evento realtime:', error)
    }
  })
}

const cleanupRealtime = () => {
  pb.collection('pedidos').unsubscribe('*')
}

onMounted(async () => {
  await authStore.checkAuth()
  await fetchPedidos()
  setupRealtime()
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

.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
}

.estado-pendiente {
  background: #e67e22;
  color: #fff4e6;
}

.estado-procesando {
  background: #3498db;
  color: #e6f7ff;
}

.estado-completado {
  background: #2ecc71;
  color: #e6ffe6;
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
}

.btn-detalle:hover {
  background: #5a6743;
}

.btn-detalle i {
  font-size: 0.9rem;
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
  width: 40%;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
