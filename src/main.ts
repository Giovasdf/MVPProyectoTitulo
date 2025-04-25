import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Añade esta línea
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // Añade esta línea

const app = createApp(App)

app.use(pinia) // Esto ya lo tenías
app.use(router)

app.mount('#app')