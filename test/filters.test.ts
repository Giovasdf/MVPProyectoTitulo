// tests/filters.test.ts
import { describe, it, expect } from 'vitest'

describe('Filtro de pedidos', () => {
  it('filtra por estado correctamente', () => {
    const pedidos = [
      { id: 1, estado: 'pendiente' },
      { id: 2, estado: 'entregado' },
    ]
    const resultado = pedidos.filter(p => p.estado === 'pendiente')
    expect(resultado.length).toBe(1)
    expect(resultado[0].estado).toBe('pendiente')
  })
})
