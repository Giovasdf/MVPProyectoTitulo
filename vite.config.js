import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: {
          // Separa estos paquetes en chunks individuales
          vue: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})