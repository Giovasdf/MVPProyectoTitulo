<template>
  <div class="sucursal-admin">
    <h2>Gestión de Sucursales</h2>
    
    <!-- Formulario para crear/editar -->
    <form @submit.prevent="guardarSucursal" class="sucursal-form">
      <input v-model="formulario.direccion" placeholder="Dirección de la sucursal" required />
      <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Agregar' }}</button>
      <button v-if="modoEdicion" @click="cancelarEdicion" type="button">Cancelar</button>
    </form>

    <!-- Tabla de sucursales -->
    <div class="table-container">
      <table class="sucursal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dirección</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sucursal in sucursales" :key="sucursal.id">
            <td>{{ sucursal.id }}</td>
            <td>{{ sucursal.direccion }}</td>
            <td>{{ formatFecha(sucursal.created) }}</td>
            <td class="actions">
              <button @click="editarSucursal(sucursal)" class="btn-edit">Editar</button>
              <button @click="confirmarEliminacion(sucursal)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import PocketBase from 'pocketbase'
import Swal from 'sweetalert2'

const pb = new PocketBase('https://database-mvp-production.up.railway.app')

interface Sucursal {
  id: string
  direccion: string
  farmacia_id: string
  created: string
}

// Datos
const sucursales = ref<Sucursal[]>([])
const farmaciaId = 'xlzhm57qj28o616' // ID fijo de farmacia

// Estado del formulario
const formulario = ref({
  id: '',
  direccion: ''
})

// Estados de la UI
const modoEdicion = ref(false)
const cargando = ref(false)

// Formatear fecha
const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar sucursales
const cargarSucursales = async () => {
  try {
    cargando.value = true
    sucursales.value = await pb.collection('sucursales').getFullList<Sucursal>({
      filter: `farmacia_id="${farmaciaId}"`,
      sort: '-created'
    })
  } catch (error) {
    console.error('Error cargando sucursales:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las sucursales',
      confirmButtonColor: '#2B6EFD'
    })
  } finally {
    cargando.value = false
  }
}

// Guardar (crear o actualizar)
const guardarSucursal = async () => {
  try {
    cargando.value = true
    
    if (modoEdicion.value) {
      // Confirmar actualización
      const result = await Swal.fire({
        title: '¿Actualizar sucursal?',
        text: "¿Estás seguro de que deseas actualizar esta sucursal?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2B6EFD',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      })
      
      if (!result.isConfirmed) {
        cargando.value = false
        return
      }
      
      // Actualizar sucursal existente
      await pb.collection('sucursales').update(formulario.value.id, {
        direccion: formulario.value.direccion
      })
      
      await Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'La sucursal ha sido actualizada',
        confirmButtonColor: '#2B6EFD',
        timer: 1500
      })
    } else {
      // Crear nueva sucursal
      await pb.collection('sucursales').create({
        direccion: formulario.value.direccion,
        farmacia_id: farmaciaId
      })
      
      await Swal.fire({
        icon: 'success',
        title: '¡Creado!',
        text: 'Nueva sucursal agregada',
        confirmButtonColor: '#2B6EFD',
        timer: 1500
      })
    }
    
    resetearFormulario()
    await cargarSucursales()
  } catch (error) {
    console.error('Error guardando sucursal:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la sucursal',
      confirmButtonColor: '#2B6EFD'
    })
  } finally {
    cargando.value = false
  }
}

// Editar sucursal
const editarSucursal = (sucursal: Sucursal) => {
  formulario.value = {
    id: sucursal.id,
    direccion: sucursal.direccion
  }
  modoEdicion.value = true
}

// Cancelar edición
const cancelarEdicion = () => {
  resetearFormulario()
}

// Confirmar eliminación
const confirmarEliminacion = async (sucursal: Sucursal) => {
  const result = await Swal.fire({
    title: '¿Eliminar sucursal?',
    html: `¿Estás seguro de que deseas eliminar la sucursal en <b>${sucursal.direccion}</b>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    await eliminarSucursal(sucursal.id)
  }
}

// Eliminar sucursal
const eliminarSucursal = async (id: string) => {
  try {
    cargando.value = true
    await pb.collection('sucursales').delete(id)
    
    await Swal.fire({
      icon: 'success',
      title: '¡Eliminado!',
      text: 'La sucursal ha sido eliminada',
      confirmButtonColor: '#2B6EFD',
      timer: 1500
    })
    
    await cargarSucursales()
  } catch (error) {
    console.error('Error eliminando sucursal:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la sucursal',
      confirmButtonColor: '#2B6EFD'
    })
  } finally {
    cargando.value = false
  }
}

// Resetear formulario
const resetearFormulario = () => {
  formulario.value = {
    id: '',
    direccion: ''
  }
  modoEdicion.value = false
}

// Cargar datos iniciales
onMounted(() => {
  cargarSucursales()
})
</script>

<style scoped>
.sucursal-admin {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.sucursal-form {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.sucursal-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.sucursal-form button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.sucursal-form button[type="submit"] {
  background-color: #2B6EFD;
  color: white;
}

.sucursal-form button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sucursal-table {
  width: 100%;
  border-collapse: collapse;
}

.sucursal-table th,
.sucursal-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.sucursal-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.sucursal-table tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background-color: #ffc107;
  color: #212529;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .sucursal-form {
    flex-direction: column;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>