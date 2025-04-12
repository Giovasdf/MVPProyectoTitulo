<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Cliente</th>
          <th scope="col">Productos</th>
          <th scope="col">Fecha</th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidos" :key="pedido.id">
          <td class="text-muted">#{{ pedido.id.slice(0, 6) }}</td>
          <td>{{ pedido.name }}</td>
          <td>
            <span class="badge bg-light text-dark">
              {{ getProductCount(pedido.items) }} productos
            </span>
          </td>
          <td>{{ formatDate(pedido.created) }}</td>
          <td>
            <span :class="['badge', getStatusClass(pedido.status)]">
              {{ pedido.status || 'pending' }}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-primary">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    pedidos: {
      type: Array,
      required: true
    }
  },
  methods: {
    getProductCount(items) {
      try {
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        return parsedItems.length;
      } catch (e) {
        console.error("Error parsing items:", e);
        return 0;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString()
    },
    getStatusClass(status) {
      return {
        'pending': 'bg-warning text-dark',
        'completed': 'bg-success text-white'
      }[status || 'pending']
    }
  }
}
</script>

<style scoped>
.table {
  font-size: 0.9rem;
}
</style>
