const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { parsePedido } = require('./ia-parser');
const { enviarPedido } = require('./pocketbase');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Cliente de WhatsApp listo');
});

let estado = {};
let esperandoProductos = {};

client.on('message', async msg => {
  const chatId = msg.from;
  const texto = msg.body.trim().toLowerCase();

  if (!estado[chatId]) {
    estado[chatId] = 'inicio';
    await msg.reply('Hola 👋, ¿deseas hacer un pedido o contactar con una persona?\n\nEscribe *"pedido"* para comenzar.');
    return;
  }

  switch (estado[chatId]) {
    case 'inicio':
      if (texto.includes('pedido')) {
        estado[chatId] = 'esperando_nombre';
        await msg.reply('¿Cuál es el nombre de la persona que retirará el pedido?');
      } else {
        await msg.reply('👌 Entendido. Si deseas hacer un pedido, solo escribe *"pedido"*.');
      }
      break;

    case 'esperando_nombre':
      esperandoProductos[chatId] = { nombre: msg.body.trim() };
      estado[chatId] = 'esperando_productos';
      await msg.reply(`Perfecto *${esperandoProductos[chatId].nombre}*, por favor escribe el listado de productos que deseas.\n\nEjemplo:\n\n"2 paracetamol 500mg\n1 ibuprofeno 400mg\n1 jarabe para la tos"`);
      break;

    case 'esperando_productos':
      await msg.reply('🧠 Analizando el pedido... Por favor espera.');
      try {
        const nombre = esperandoProductos[chatId].nombre;
        const { productos } = await parsePedido(nombre, msg.body);

        if (!Array.isArray(productos) || productos.length === 0) {
          throw new Error('No se encontraron productos válidos');
        }

        // Generar resumen
        let resumen = `🧾 *Resumen del pedido para:* ${nombre}\n\n`;
        let requiereReceta = false;
        let totalProductos = 0;

        for (const item of productos) {
          const cantidad = item.cantidad || 1;
          totalProductos += cantidad;
          const dosis = item.dosis ? ` (${item.dosis})` : '';
          const receta = item.requiereReceta ? ' 📝' : '';
          if (item.requiereReceta) requiereReceta = true;

          resumen += `• ${cantidad}x ${item.producto}${dosis}${receta}\n`;
        }

        resumen += `\n🛍️ *Total productos:* ${totalProductos}`;
        resumen += '\n\n🕐 Un asistente de la farmacia te confirmará pronto si está todo disponible.';
        if (requiereReceta) {
          resumen += '\n\n📄 *Recuerda:* Los productos marcados con 📝 requieren receta médica.';
        }

        await msg.reply(resumen);

        // Enviar a PocketBase
        await enviarPedido(nombre, productos);

      } catch (err) {
        console.error('❌ Error al procesar pedido:', err);
        await msg.reply('❌ No pude entender el pedido. Por favor, escribe los productos nuevamente en formato claro. Ejemplo:\n\n"2 paracetamol 500mg\n1 ibuprofeno 400mg\n1 jarabe para la tos"');
      } finally {
        delete estado[chatId];
        delete esperandoProductos[chatId];
      }
      break;

    default:
      await msg.reply('😅 Algo salió mal. Escribe *"pedido"* para comenzar de nuevo.');
      delete estado[chatId];
      delete esperandoProductos[chatId];
      break;
  }
});

client.initialize();