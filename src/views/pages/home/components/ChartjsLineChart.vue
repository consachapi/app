<template>
    <vx-card title="Consumo por Area" class="mb-base">
        <div class="mt-5">
            <chartjs-component-line-chart :height="250" :data="data" :options="options"></chartjs-component-line-chart>
        </div>
    </vx-card>
</template>
<script>
import ChartjsComponentLineChart from './ChartjsComponentLineChart.vue';

export default {
  data () {
    return {
      data: {
        labels: ['21-SET', '22-SET', '23-SET', '24-SET', '25-SET', '26-SET', '27-SET', '28-SET', '29-SET'],
        datasets: [
          {
            data: [120, 114, 106, 106, 135, 156, 133, 221, 205],
            label: 'HOSP',
            borderColor: '#7367F0',
            fill: false
          }, {
            data: [60, 75, 35, 12, 82, 30, 78, 45, 90],
            label: 'URGENCIAS/EMER',
            borderColor: '#28C76F',
            fill: false
          }, {
            data: [10, 20, 25, 78, 21, 45, 78, 54, 53],
            label: 'CENTRO QX',
            borderColor: '#EA5455',
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Variación de Consumo por Area'
        }
      }
    }
  },
  components: {
    ChartjsComponentLineChart
  }
}
</script>