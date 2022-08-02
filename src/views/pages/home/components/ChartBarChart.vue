<template>
    <vx-card title="STOCK" class="mb-base">
        <div class="mt-5">
            <chartjs-component-bar-chart :height="250" :data="data" :options="options"></chartjs-component-bar-chart>
        </div>
    </vx-card>
</template>
<script>
import ChartjsComponentBarChart from './ChartjsComponentBarChart.vue'
export default {
  data () {
    return {
      data: {
        labels: ['BALONES', 'ISOTANTE', 'TANQUE CR.'],
        datasets: [
          {
            label: 'Stock (m^3)',
            // backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            backgroundColor: ['#7367F0', '#28C76F', '#EA5455'],
            data: [2478, 5267, 3562]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'STOCK DE OXIGENO (M^3)'
        }
      }
    }
  },
  components: {
    ChartjsComponentBarChart
  }
}
</script>