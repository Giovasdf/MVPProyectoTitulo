<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
