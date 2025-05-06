import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CambiarEstadoModal from '@/components/CambiarEstadoModal.vue'
import PocketBase from 'pocketbase'

vi.mock('pocketbase', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      authStore: { isValid: true },
      collection: () => ({
        update: vi.fn().mockResolvedValue({ id: '123', estado: 'entregado' }),
      }),
    })),
  }
})

describe('CambiarEstadoModal.vue', () => {
  const pedidoId = '123'
  const estadoActual = 'pendiente'

  it('muestra el estado actual por defecto', () => {
    const wrapper = mount(CambiarEstadoModal, {
      props: { pedidoId, estadoActual },
    })
    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe(estadoActual)
  })

  it('emite eventos al guardar correctamente', async () => {
    const wrapper = mount(CambiarEstadoModal, {
      props: { pedidoId, estadoActual },
    })

    await wrapper.find('select').setValue('entregado')
    await wrapper.find('.btn-guardar').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('estadoActualizado')
    expect(wrapper.emitted()).toHaveProperty('cerrar')
    expect(wrapper.emitted('estadoActualizado')?.[0]).toEqual(['entregado'])
  })

  it('muestra alerta si no hay autenticación', async () => {
    // Mock no autenticado
    const mockPb = new PocketBase('')
    mockPb.authStore.isValid = false

    const wrapper = mount(CambiarEstadoModal, {
      props: { pedidoId, estadoActual },
    })

    window.alert = vi.fn()

    await wrapper.find('.btn-guardar').trigger('click')

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Debes iniciar sesión'))
  })
})
