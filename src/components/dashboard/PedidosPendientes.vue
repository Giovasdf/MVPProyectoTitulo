<template>
  <h1>Pedidos Pendientes</h1>
  <div class="pedidos-container">
    <div class="pedidos-header">
      <span class="badge">{{ pedidos.length }} Pedidos pendientes</span>
    </div>

    <div class="pedidos-list">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <div class="pedido-info">
          <span class="pedido-id">#{{ pedido.id }}</span>
          <span class="pedido-cliente">{{ pedido.cliente }}</span>
          <span class="pedido-fecha">{{ formatFecha(pedido.fecha) }}</span>
        </div>
        <div class="pedido-estado" :class="'estado-' + pedido.estado.toLowerCase()">
          {{ pedido.estado }}
        </div>
        <div class="pedido-acciones">
          <button class="btn-detalle" @click="verDetalle(pedido.id)">
  <i class="fas fa-eye"></i>
  <span class="btn-text">Ver</span>
</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Pedido {
  id: number
  cliente: string
  fecha: string
  estado: 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO'
  productos: number
  total: number
}

const pedidos = ref<Pedido[]>([
  {
    id: 1001,
    cliente: 'Clínica San Juan',
    fecha: '2023-05-15T10:30:00',
    estado: 'PENDIENTE',
    productos: 5,
    total: 125000
  },
  {
    id: 1002,
    cliente: 'Hospital Central',
    fecha: '2023-05-14T16:45:00',
    estado: 'PENDIENTE',
    productos: 3,
    total: 87500
  },
  {
    id: 1003,
    cliente: 'Farmacia Luz',
    fecha: '2023-05-14T09:15:00',
    estado: 'PENDIENTE',
    productos: 8,
    total: 215000
  }
])

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const verDetalle = (id: number) => {
  console.log('Ver detalle del pedido:', id)
  // Aquí podrías navegar a una ruta de detalle o abrir un modal
}
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
  background: #fff4e6;
  color: #e67e22;
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
/* Añade estos estilos para responsividad */
@media (max-width: 992px) {
  .pedido-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .pedido-estado {
    margin: 0;
    align-self: flex-start;
  }

  .pedido-acciones {
    align-self: flex-end;
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 576px) {
  .pedidos-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .pedido-info {
    width: 100%;
  }

  .btn-detalle .btn-text {
    display: none;
  }

  .btn-detalle {
    padding: 0.5rem;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }

  .btn-detalle i {
    margin: 0;
  }
  .btn-detalle .btn-text {
  display: none;
}

.btn-detalle {
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.btn-detalle i {
  margin: 0;
}

}
</style>
