<template>
  <div class="modal-overlay" data-cy="modal-overlay">
    <div class="modal-content" data-cy="modal-content">
      <h3>Cambiar estado del pedido</h3>
      <select v-model="estadoSeleccionado" class="select-estado" data-cy="select-estado">
        <option value="pendiente">Pendiente</option>
        <option value="preparado">Preparado</option>
        <option value="entregado">Entregado</option>
      </select>

      <div style="margin-top: 1rem">
        <button class="btn-guardar" @click="guardar" data-cy="btn-guardar">Guardar</button>
        <button class="btn-cerrar" @click="$emit('cerrar')" data-cy="btn-cerrar">Cancelar</button>
      </div>
    </div>
  </div>
</template>



<script lang="ts" setup>
import { ref } from 'vue'
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://database-mvp-production.up.railway.app')

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
    if (!pb.authStore.isValid) {
      throw new Error('Debes iniciar sesión para realizar esta acción')
    }

    const estadosValidos = ['pendiente', 'preparado', 'entregado']
    if (!estadosValidos.includes(estadoSeleccionado.value)) {
      throw new Error('Estado no válido')
    }

    // Obtener el registro actual para conservar los campos requeridos
    const recordActual = await pb.collection('pedidos').getOne(props.pedidoId)

    const data = {
      ...recordActual,
      estado: estadoSeleccionado.value,
      updated: new Date().toISOString()
    }

    // Eliminar campos no permitidos por el API de PocketBase
    delete data.id
    delete data.created
    delete data.collectionId
    delete data.collectionName
    delete data.expand

    console.log('Intentando actualizar con:', { id: props.pedidoId, data })

    const record = await pb.collection('pedidos').update(props.pedidoId, data)
    console.log('Actualización exitosa:', record)

    emit('estadoActualizado', estadoSeleccionado.value)
    emit('cerrar')
  } catch (error: any) {
    console.error('Error completo:', error)
    alert(`Error al actualizar el estado: ${error.message}`)

    if (error.data) {
      console.error('Detalles del error:', error.data)
    }
  }
}
</script>


<!-- Tus estilos se mantienen igual -->
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.select-estado {
  width: 100%;
  padding: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-guardar,
.btn-cerrar {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-guardar {
  background-color: #6F7D54;
  color: white;
}

.btn-cerrar {
  background-color: #f1f1f1;
  color: #333;
}
</style>