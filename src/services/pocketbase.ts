import PocketBase from 'pocketbase'

const PB_URL = 'https://database-mvp-production.up.railway.app'
export const pb = new PocketBase(PB_URL)

// Tipos para TypeScript
export interface User {
  id: string
  email: string
  nombre?: string
  rol?: string
  sucursal_id?: string
  [key: string]: any
}

// Función para login con expansión de sucursal_id si es necesario
export async function loginUser(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(
      email,
      password,
      { expand: 'sucursal_id' }
    )
    return authData
  } catch (err) {
    console.error('Error de autenticación:', err)
    throw err
  }
}

// Verificar estado de autenticación
export function isLoggedIn(): boolean {
  return pb.authStore.isValid
}

// Obtener usuario actual
export function currentUser(): User | null {
  return pb.authStore.model as User | null
}

// Cerrar sesión
export function logout(): void {
  pb.authStore.clear()
}

// Obtener lista de pedidos
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

// Actualizar estado de un pedido
export async function updatePedidoStatus(id: string, status: string) {
  try {
    const record = await pb.collection('orders').update(id, { status })
    return record
  } catch (err) {
    console.error('Error al actualizar pedido:', err)
    throw err
  }
}

export default pb
