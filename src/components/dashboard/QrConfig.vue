<template>
    <div class="qr-container">
      <div class="qr-header">
        <h2 class="text-header">Conexión WhatsApp</h2>
        <span class="estado-label" :class="'estado-' + estado">{{ estado }}</span>
      </div>
  
      <div v-if="qrUrl" class="qr-content">
        <img :src="qrUrl" alt="Código QR de WhatsApp" class="qr-image" />
      </div>
      <div v-else class="qr-placeholder">
        <p>Esperando código QR...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import PocketBase, { RecordModel } from 'pocketbase'
  
  const pb = new PocketBase('http://127.0.0.1:8090')
  const CONFIG_ID = 'uq3q1h75ji646xl'
  
  const qrUrl = ref('')
  const estado = ref('desconectado')
  
  const updateQrData = (record: RecordModel) => {
    if (record.qr_code) {
      qrUrl.value = pb.files.getUrl(record, record.qr_code)
    } else {
      qrUrl.value = ''
    }
  
    estado.value = record.estado || 'desconectado'
  }
  
  onMounted(async () => {
    try {
      await pb.collection('whatsapp_configs').subscribe(CONFIG_ID, (e) => {
        updateQrData(e.record)
      })
  
      const config = await pb.collection('whatsapp_configs').getOne(CONFIG_ID)
      updateQrData(config)
    } catch (err) {
      console.error('❌ Error al cargar o suscribirse al QR:', err)
    }
  })
  
  onBeforeUnmount(() => {
    pb.collection('whatsapp_configs').unsubscribe(CONFIG_ID)
  })
  </script>
  
  <style scoped>
  .qr-container {
    background: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    max-width: 400px;
  }
  
  .qr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  
  .text-header {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .estado-label {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    text-transform: uppercase;
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
  
  .qr-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .qr-image {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  }
  
  .qr-placeholder {
    text-align: center;
    font-size: 0.95rem;
    color: #7f8c8d;
  }
  </style>
  