const axios = require('axios');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

async function parsePedido(nombre, texto) {
  const prompt = `
Analiza el siguiente pedido de farmacia y conviértelo en un JSON válido con este formato:

[
  { 
    "producto": "nombre del producto",
    "cantidad": número,
    "dosis": "formato opcional",
    "requiereReceta": boolean
  }
]

Reglas:
1. "producto" debe ser el nombre genérico del medicamento
2. "cantidad" debe ser un número (1 si no se especifica)
3. "dosis" es opcional (ej: "500mg", "10ml")
4. "requiereReceta" debe ser true para medicamentos controlados

Pedido:
"${texto.trim()}"

Devuelve SOLO el JSON, sin comentarios ni texto adicional.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const contenido = response.data.choices[0]?.message?.content;
    if (!contenido) throw new Error('No se recibió respuesta de la IA');

    // Limpiar y extraer el JSON
    const jsonStr = contenido
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    console.log('Respuesta de la IA:', jsonStr); // Para depuración

    const productos = JSON.parse(jsonStr);

    // Validar la estructura
    if (!Array.isArray(productos)) {
      throw new Error('La respuesta no es un array');
    }

    for (const item of productos) {
      if (!item.producto || typeof item.producto !== 'string') {
        throw new Error('Estructura de producto inválida');
      }
    }

    return { nombre, productos };
  } catch (err) {
    console.error('Error en parsePedido:', err);
    throw new Error('No pude procesar el pedido. Por favor, especifica los productos más claramente.');
  }
}

module.exports = { parsePedido };