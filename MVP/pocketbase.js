const PocketBase = require('pocketbase/cjs');

// Configuración directa (reemplaza con tus credenciales reales)
const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'gmolina.dev@gmail.com'; // Reemplaza con tu email de admin real
const ADMIN_PASSWORD = 'anyand21.'; // Reemplaza con tu contraseña real

async function authAsAdmin() {
  const pb = new PocketBase(PB_URL);
  
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    return pb;
  } catch (err) {
    console.error('❌ Error de autenticación:', err.message);
    throw new Error('Error de autenticación con PocketBase');
  }
}

async function enviarPedido(name, items) {
  let pb;
  
  try {
    // 1. Validar datos de entrada
    if (!name || typeof name !== 'string') {
      throw new Error('Nombre no válido');
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Lista de productos no válida');
    }

    // 2. Autenticar
    pb = await authAsAdmin();
    
    // 3. Preparar datos para PocketBase
    const data = {
      name,
      items: JSON.stringify(items.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad || 1,
        dosis: item.dosis || '',
        requiereReceta: item.requiereReceta || false
      }))),
      prescription: null
    };

    // 4. Enviar a PocketBase
    const record = await pb.collection('orders').create(data);
    console.log('✅ Pedido registrado con ID:', record.id);
    return record;
    
  } catch (err) {
    console.error('❌ Error en enviarPedido:', err.message);
    throw new Error('Error al registrar el pedido. Por favor, inténtalo nuevamente.');
  } finally {
    if (pb) pb.authStore.clear();
  }
}

module.exports = { enviarPedido };