<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
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
      // Contar pedidos por estado
      const statusCount = {
        completed: 0,
        pending: 0
      }

      props.pedidos.forEach(pedido => {
        if (pedido.status === 'completed') {
          statusCount.completed++
        } else {
          statusCount.pending++
        }
      })

      return {
        labels: ['Completados', 'Pendientes'],
        datasets: [{
          data: [statusCount.completed, statusCount.pending],
          backgroundColor: [
            'rgba(40, 167, 69, 0.7)',  // Verde para completados
            'rgba(255, 193, 7, 0.7)'   // Amarillo para pendientes
          ],
          borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(255, 193, 7, 1)'
          ],
          borderWidth: 1
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
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || ''
                  const value = context.raw || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = Math.round((value / total) * 100)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          },
          cutout: '70%'
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
  width: 100% !important;
  height: 250px !important;
}
</style>
