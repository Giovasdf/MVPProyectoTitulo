<template>
  <div class="usuarios-admin">
    <h2>Gestión de Usuarios</h2>

    <form @submit.prevent="modoEdicion ? actualizarUsuario() : crearUsuario()" class="usuario-form">
      <input v-model="formulario.nombre" placeholder="Nombre" required />
      <input v-model="formulario.email" placeholder="Email" type="email" required :disabled="modoEdicion" /> <select
        v-model="formulario.rol">
        <option value="admin">Admin</option>
        <option value="operador">Operador</option>
      </select>
      <input v-model="formulario.password" placeholder="Contraseña" type="password" :required="!modoEdicion"
        :disabled="modoEdicion" />
      <div class="form-actions">
        <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Agregar' }}</button>
        <button v-if="modoEdicion" @click="cancelarEdicion" type="button" class="btn-cancel">Cancelar</button>
      </div>
    </form>

    <div v-if="cargando" class="cargando">Cargando usuarios...</div>


    <div v-else class="table-container">
      <table class="usuario-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.rol }}</td>
            <td class="actions">
              <button @click="editarUsuario(usuario)" class="btn-edit">Editar</button>
              <button @click="confirmarEliminacion(usuario)" class="btn-delete">Eliminar</button>
              <button @click="solicitarResetPassword(usuario.email)" class="btn-reset">Reset Pass</button>
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

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
  sucursal_id: string
}

// Datos
const usuarios = ref<Usuario[]>([])
const formulario = ref({
  id: '',
  nombre: '',
  email: '',
  rol: 'operador',
  password: '',
  sucursal_id: ''
})
const modoEdicion = ref(false)
const cargando = ref(true)

// Cargar usuarios y obtener sucursal del admin
const cargarUsuarios = async () => {
  try {
    cargando.value = true

    // Verificar autenticación
    if (!pb.authStore.isValid || !pb.authStore.model) {
      throw new Error('No autenticado o sesión expirada')
    }

    // Obtener sucursal_id del admin actual
    const adminData = pb.authStore.model
    formulario.value.sucursal_id = adminData.sucursal_id

    if (!formulario.value.sucursal_id) {
      throw new Error('Admin no tiene sucursal asignada')
    }

    // Cargar usuarios de la misma sucursal
    const records = await pb.collection('users').getFullList({
      filter: `sucursal_id = "${formulario.value.sucursal_id}"`,
      sort: '-created'
    })
    console.log('Usuarios cargados:', records)
    // Mapear los datos a nuestra interfaz
    usuarios.value = records.map(record => ({
      id: record.id,
      nombre: record.nombre || 'Sin nombre',
      email: record.email,
      rol: record.rol || 'operador',
      sucursal_id: record.sucursal_id
    }))

  } catch (error) {
    console.error('Error cargando usuarios:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudieron cargar los usuarios',
      confirmButtonColor: '#2B6EFD'
    })
  } finally {
    cargando.value = false
  }
}

// Crear usuario
const crearUsuario = async () => {
  try {
    if (!formulario.value.sucursal_id) {
      throw new Error('No se ha establecido la sucursal')
    }

    const result = await Swal.fire({
      title: '¿Crear usuario?',
      text: `Se creará un nuevo usuario con rol ${formulario.value.rol}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2B6EFD',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    // Crear el usuario en la colección correcta
    await pb.collection('users').create({
      nombre: formulario.value.nombre,
      email: formulario.value.email,
      password: formulario.value.password,
      passwordConfirm: formulario.value.password,
      rol: formulario.value.rol,
      sucursal_id: formulario.value.sucursal_id,
      emailVisibility: true,

    })

    await Swal.fire({
      icon: 'success',
      title: '¡Usuario creado!',
      text: 'El nuevo usuario ha sido registrado',
      confirmButtonColor: '#2B6EFD',
      timer: 1500
    })

    resetearFormulario()
    await cargarUsuarios()
  } catch (error) {
    console.error('Error creando usuario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo crear el usuario',
      confirmButtonColor: '#2B6EFD'
    })
  }
}

// Editar usuario
const editarUsuario = (usuario: Usuario) => {
  formulario.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    password: '', // La contraseña no se precarga por seguridad
    sucursal_id: usuario.sucursal_id
  }
  modoEdicion.value = true
}

// Actualizar usuario
// Método para solicitar reset de contraseña
const solicitarResetPassword = async (email: string) => {
  try {
    const result = await Swal.fire({
      title: '¿Resetear contraseña?',
      text: `Se enviará un enlace de recuperación a ${email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2B6EFD',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    await pb.collection('users').requestPasswordReset(email)
    
    await Swal.fire({
      icon: 'success',
      title: '¡Enlace enviado!',
      text: 'Se ha enviado un correo con instrucciones para resetear la contraseña',
      confirmButtonColor: '#2B6EFD'
    })
  } catch (error) {
    console.error('Error solicitando reset de contraseña:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el enlace de recuperación',
      confirmButtonColor: '#2B6EFD'
    })
  }
}

// Modificar el método actualizarUsuario para no enviar password
const actualizarUsuario = async () => {
  try {
    const result = await Swal.fire({
      title: '¿Actualizar usuario?',
      text: `Se actualizará el usuario ${formulario.value.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2B6EFD',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    // Preparar datos para actualización (sin password)
    const updateData = {
      nombre: formulario.value.nombre,
      rol: formulario.value.rol
      // Email y password no se incluyen
    }

    await pb.collection('users').update(formulario.value.id, updateData)

    await Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'El usuario ha sido actualizado',
      confirmButtonColor: '#2B6EFD',
      timer: 1500
    })

    resetearFormulario()
    await cargarUsuarios()
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo actualizar el usuario',
      confirmButtonColor: '#2B6EFD'
    })
  }
}
// Eliminar usuario
const confirmarEliminacion = async (usuario: Usuario) => {
  try {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      html: `¿Estás seguro de eliminar a <b>${usuario.nombre}</b> (${usuario.email})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    await pb.collection('users').delete(usuario.id)

    await Swal.fire({
      icon: 'success',
      title: '¡Eliminado!',
      text: 'El usuario ha sido eliminado',
      confirmButtonColor: '#2B6EFD',
      timer: 1500
    })

    await cargarUsuarios()
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el usuario',
      confirmButtonColor: '#2B6EFD'
    })
  }
}

// Cancelar edición
const cancelarEdicion = () => {
  resetearFormulario()
}

// Resetear formulario
const resetearFormulario = () => {
  formulario.value = {
    id: '',
    nombre: '',
    email: '',
    rol: 'operador',
    password: '',
    sucursal_id: formulario.value.sucursal_id // Mantener la sucursal_id
  }
  modoEdicion.value = false
}

// Cargar datos iniciales
onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
.usuarios-admin {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.usuario-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.usuario-form input,
.usuario-form select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.usuario-form input:disabled {
  background-color: #f0f0f0;
  color: #666;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.usuario-form button {
  padding: 12px 20px;
  background-color: #2B6EFD;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
}

.btn-cancel {
  background-color: #6c757d !important;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.usuario-table {
  width: 100%;
  border-collapse: collapse;
}

.usuario-table th,
.usuario-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.usuario-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.usuario-table tr:hover {
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
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.cargando {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}
/* Estilo para el botón de reset */
.btn-reset {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
}

.btn-reset:hover {
  background-color: #5a6268;
}

/* Estilo para campos deshabilitados */
.usuario-form input:disabled {
  background-color: #f0f0f0;
  color: #666;
  cursor: not-allowed;
  border: 1px solid #ddd;
}
/* Responsive */
@media (max-width: 768px) {
  .usuario-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete,
  .usuario-form button {
    width: 100%;
  }
}
</style>