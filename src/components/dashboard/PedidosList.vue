<template>
  <div class="pedidos-list">
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="filters">
      <select v-model="filterStatus" @change="filterPedidos">
        <option value="all">Todos</option>
        <option value="pending">Pendientes</option>
        <option value="completed">Completados</option>
      </select>
    </div>

    <div class="pedido-card" v-for="pedido in filteredPedidos" :key="pedido.id">
      <div class="pedido-header">
        <h3>Pedido #{{ pedido.id.slice(0, 6) }}</h3>
        <span class="fecha">{{ formatDate(pedido.created) }}</span>
        <span :class="['status', pedido.status || 'pending']">
          {{ pedido.status || 'pending' }}
        </span>
      </div>

      <div class="pedido-body">
        <p><strong>Cliente:</strong> {{ pedido.name }}</p>

        <div class="productos">
          <h4>Productos:</h4>
          <ul>
            <li v-for="(item, index) in parseItems(pedido.items)" :key="index">
              {{ item.cantidad }}x {{ item.producto }}
              <span v-if="item.dosis">({{ item.dosis }})</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="pedido-actions">
        <button v-if="!pedido.status || pedido.status !== 'completed'"
          @click="$emit('actualizar-estado', pedido.id, 'completed')" class="btn-complete">
          Marcar como completado
        </button>
        <button v-else @click="$emit('actualizar-estado', pedido.id, 'pending')" class="btn-pending">
          Marcar como pendiente
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'

export default {
  props: {
    pedidos: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const filterStatus = ref('all')

    const parseItems = (items) => {
      try {
        return JSON.parse(items)
      } catch {
        return []
      }
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleString()
    }

    const filteredPedidos = computed(() => {
      if (filterStatus.value === 'all') return props.pedidos
      return props.pedidos.filter(p =>
        filterStatus.value === 'pending'
          ? !p.status || p.status !== 'completed'
          : p.status === 'completed'
      )
    })

    return {
      filterStatus,
      filteredPedidos,
      parseItems,
      formatDate
    }
  }
}
</script>

<style scoped>
.pedidos-list {
  display: grid;
  gap: 20px;
}

.pedido-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.pedido-header h3 {
  margin: 0;
  font-size: 18px;
}

.fecha {
  color: #666;
  font-size: 14px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.pedido-body {
  padding: 20px;
}

.productos {
  margin-top: 15px;
}

.productos ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.productos li {
  margin-bottom: 5px;
}

.pedido-actions {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-complete {
  background: #28a745;
  color: white;
}

.btn-pending {
  background: #ffc107;
  color: #212529;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 8px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
}

.filters {
  margin-bottom: 15px;
}

.filters select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
