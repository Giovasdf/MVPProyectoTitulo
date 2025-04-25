import PocketBase from 'pocketbase'

const PB_URL = 'http://127.0.0.1:8090'
const pb = new PocketBase(PB_URL)

// Función para login de usuarios normales (no admin)
export async function loginUser(email, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password)
    return pb
  } catch (err) {
    console.error('Error de autenticación:', err)
    throw err
  }
}



// Verificar estado de autenticación
export function isLoggedIn() {
  return pb.authStore.isValid
}

// Obtener usuario actual
export function currentUser() {
  return pb.authStore.model
}

// Cerrar sesión
export function logout() {
  pb.authStore.clear()
}

// Resto de tus funciones (getPedidos, updatePedidoStatus, etc.)
export async function getPedidos() {
  try {
    const records = await pb.collection('orders').getFullList({
      sort: '-created',
    })
    return records
  } catch (err) {
    console.error('Error al obtener pedidos:', err)
    throw err
  }
}

export async function updatePedidoStatus(id, status) {
  try {
    const record = await pb.collection('orders').update(id, { status })
    return record
  } catch (err) {
    console.error('Error al actualizar pedido:', err)
    throw err
  }
}

export default pb