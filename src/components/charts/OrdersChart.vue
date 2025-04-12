<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  props: {
    pedidos: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const prepareChartData = () => {
      // Agrupar pedidos por día
      const ordersByDay = {}

      props.pedidos.forEach(pedido => {
        const date = new Date(pedido.created).toLocaleDateString()
        ordersByDay[date] = (ordersByDay[date] || 0) + 1
      })

      const labels = Object.keys(ordersByDay)
      const data = Object.values(ordersByDay)

      return {
        labels,
        datasets: [{
          label: 'Pedidos por día',
          data,
          backgroundColor: 'rgba(13, 110, 253, 0.2)',
          borderColor: 'rgba(13, 110, 253, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      }
    }

    const initChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = chartCanvas.value.getContext('2d')
      const chartData = prepareChartData()

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    }

    onMounted(initChart)
    watch(() => props.pedidos, initChart)

    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
