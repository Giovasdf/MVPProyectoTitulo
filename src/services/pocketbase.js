import PocketBase from 'pocketbase'

const PB_URL = 'http://127.0.0.1:8090'
const pb = new PocketBase(PB_URL)

export async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('gmolina.dev@gmail.com', 'anyand21.')
    return pb
  } catch (err) {
    console.error('Error de autenticación:', err)
    throw err
  }
}

export async function getPedidos() {
  try {
    const pb = await loginAdmin()
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
    const pb = await loginAdmin()
    const record = await pb.collection('orders').update(id, { status })
    return record
  } catch (err) {
    console.error('Error al actualizar pedido:', err)
    throw err
  }
}
