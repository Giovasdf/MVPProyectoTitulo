<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'
import { Chart, type ChartItem, type ChartData, type ChartOptions } from 'chart.js/auto'

// Define la interfaz para los pedidos
interface Pedido {
  id: string
  created: string | Date
  // Agrega otras propiedades necesarias
}

// Props con tipado fuerte
const props = defineProps({
  pedidos: {
    type: Array as PropType<Pedido[]>,
    required: true,
    default: () => []
  }
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart<'line'> | null>(null)

// Prepara los datos para el gráfico
const prepareChartData = (): ChartData<'line'> => {
  const ordersByDay: Record<string, number> = {}

  props.pedidos.forEach((pedido) => {
    const date = new Date(pedido.created).toLocaleDateString()
    ordersByDay[date] = (ordersByDay[date] || 0) + 1
  })

  return {
    labels: Object.keys(ordersByDay),
    datasets: [{
      label: 'Pedidos por día',
      data: Object.values(ordersByDay),
      backgroundColor: 'rgba(13, 110, 253, 0.2)',
      borderColor: 'rgba(13, 110, 253, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  }
}

// Opciones del gráfico
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} pedidos`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      },
      title: {
        display: true,
        text: 'Número de pedidos'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Fecha'
      }
    }
  }
}

// Inicializa o actualiza el gráfico
const initChart = () => {
  if (!chartCanvas.value) return

  // Destruir instancia anterior si existe
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  // Crear nueva instancia del gráfico
  chartInstance.value = new Chart(
    chartCanvas.value as ChartItem,
    {
      type: 'line',
      data: prepareChartData(),
      options: chartOptions
    }
  )
}

// Lifecycle hooks
onMounted(() => {
  initChart()
})

watch(
  () => props.pedidos,
  (newPedidos) => {
    if (newPedidos.length > 0) {
      initChart()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>