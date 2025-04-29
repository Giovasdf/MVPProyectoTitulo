<template>
  <div class="qr-container">
    <div class="qr-header">
      <h2 class="text-header">Conexión WhatsApp</h2>
      <div class="status-container">
        <span class="estado-label" :class="'estado-' + estado.toLowerCase()">
          {{ estadoTexto }}
        </span>
        <span class="telefono-label" v-if="telefono">Teléfono: {{ telefono }}</span>
        <span class="telefono-label" v-else>Teléfono: No asignado</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando configuración de WhatsApp...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <svg class="error-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
      </svg>
      <p class="error-message">{{ error }}</p>
      <button @click="loadVinculo" class="retry-button">Reintentar</button>
    </div>

    <div v-else-if="qrUrl" class="qr-content">
      <img :src="qrUrl" alt="Código QR de WhatsApp" class="qr-image" />
      <p class="qr-instructions">
        Escanea este código con WhatsApp en tu teléfono para vincular la sucursal
      </p>
    </div>

    <div v-else class="no-qr-state">
      <svg class="no-qr-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
      </svg>
      <p v-if="estado === 'listo'">✅ Conexión establecida correctamente</p>
      <p v-else-if="estado === 'desconectado'">🔴 No hay conexión activa</p>
      <p v-else>Esperando código QR para vincular...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PocketBase from 'pocketbase'
import { useAuthStore } from '@/stores/auth'

const pb = new PocketBase('http://127.0.0.1:8090')
const authStore = useAuthStore()

const qrUrl = ref('')
const estado = ref('desconectado')
const telefono = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const estadoTexto = computed(() => {
  const estados: Record<string, string> = {
    esperando: 'Esperando escaneo',
    listo: 'Conectado',
    desconectado: 'Desconectado',
    reconectando: 'Reconectando'
  }
  return estados[estado.value.toLowerCase()] || estado.value
})

const updateVinculoData = (record: any) => {
  if (record?.qr_code) {
    qrUrl.value = pb.files.getUrl(record, record.qr_code, {
      thumb: '300x300'
    })
  } else {
    qrUrl.value = ''
  }

  estado.value = record?.estado || 'desconectado'
  telefono.value = record?.telefono || ''
}

const loadVinculo = async () => {
  try {
    const sucursalId = authStore.user?.sucursal_id
    if (!sucursalId) throw new Error('No se ha proporcionado un ID de sucursal válido')

    isLoading.value = true
    error.value = null

    const vinculo = await pb.collection('vinculos_sucursal').getFirstListItem(`sucursal_id="${sucursalId}"`, {
      expand: 'sucursal_id'
    })
    updateVinculoData(vinculo)

  } catch (err: any) {
    console.error('❌ Error al cargar vínculo:', err)

    error.value =
      err?.status === 404
        ? 'No se encontró la configuración de WhatsApp para esta sucursal'
        : 'Error al cargar la configuración de WhatsApp'

    qrUrl.value = ''
    estado.value = 'desconectado'
    telefono.value = ''
  } finally {
    isLoading.value = false
  }
}

onMounted(loadVinculo)
</script>

<style scoped>
.qr-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #eaeaea;
}

.qr-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.text-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.status-container {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.estado-label {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.telefono-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.estado-esperando {
  background-color: #fff4e6;
  color: #e67e22;
}

.estado-listo {
  background-color: #eafaf1;
  color: #27ae60;
}

.estado-desconectado {
  background-color: #fdecea;
  color: #c0392b;
}

.estado-reconectando {
  background-color: #e3f2fd;
  color: #2980b9;
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.qr-instructions {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 1.5rem 0;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #c0392b;
}

.error-message {
  color: #c0392b;
  text-align: center;
  font-size: 0.95rem;
  max-width: 80%;
}

.no-qr-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 1.5rem 0;
}

.no-qr-icon {
  width: 48px;
  height: 48px;
  color: #7f8c8d;
}

.retry-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.retry-button:hover {
  background-color: #2980b9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>