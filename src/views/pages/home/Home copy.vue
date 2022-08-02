<template>
    <div id="extra-component-chartjs-demo">
        <div class="vx-row">
            <div class="vx-col w-1/2 md:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="EyeIcon"
                  statistic="256"
                  statisticTitle="ALMACEN FARMACIA" />
            </div>

            <div class="vx-col w-1/2 md:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="MessageSquareIcon"
                  statisticTitle="ISOTANQUE"
                  statistic="145 m3"
                  color="success" />
            </div>

            <div class="vx-col w-1/2 md:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="ShoppingBagIcon"
                  statistic="26"
                  statisticTitle="TANQUE CR."
                  color="warning" />
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/2">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="CpuIcon"
                  icon-right
                  statistic="256"
                  statisticTitle="CAMAS LIBRES" />
            </div>

            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/2">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="ServerIcon"
                  icon-right
                  statistic="145"
                  statisticTitle="CAMAS OCUPADAS"
                  color="success" />
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2">
                <chartjs-line-chart></chartjs-line-chart>
            </div>
            <div class="vx-col w-full md:w-1/2">
                <chartjs-bar-chart></chartjs-bar-chart>
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full mb-base">
                <vx-card title="Abastecimiento de Cama y Oxigeno" action-buttons @refresh="closeCardAnimationDemo">
                <table style="width:100%" class="border-collapse">
                    <tr>
                        <th class="p-2 border border-solid d-theme-border-grey-light">AREAS</th>
                        <th class="p-2 border border-solid d-theme-border-grey-light text-center">CAMAS OCUPADAS</th>
                        <th class="p-2 border border-solid d-theme-border-grey-light">CAMAS LIBRES</th>
                        <th class="p-2 border border-solid d-theme-border-grey-light">CON OXIGENO GASEOSO</th>
                        <th class="p-2 border border-solid d-theme-border-grey-light">CON OXIGENO LIQUIDO</th>
                        <th class="p-2 border border-solid d-theme-border-grey-light">SIN OXIGENO</th>
                    </tr>
                    <tr>
                        <td class="p-2 border border-solid d-theme-border-grey-light">HOSPITALIZACION</td>
                        <td class="border border-solid d-theme-border-grey-light text-center">50</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">20</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">15</td>
                    </tr>
                    <tr>
                        <td class="p-2 border border-solid d-theme-border-grey-light">URGENCIAS/EMERGENCIA</td>
                        <td class="border border-solid d-theme-border-grey-light text-center">20</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">20</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">15</td>
                    </tr>
                    <tr>
                        <td class="p-2 border border-solid d-theme-border-grey-light">CENTRO QUIRURGICO</td>
                        <td class="border border-solid d-theme-border-grey-light text-center">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">20</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">30</td>
                        <td class="p-2 border border-solid d-theme-border-grey-light">15</td>
                    </tr>
                </table>
                </vx-card>
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2 mb-base">
                <vx-card title="ISOTANQUE">
                    <template slot="no-body">
                        <div class="mt-10">
                            <vue-apex-charts
                              type="radialBar"
                              height="240"
                              :options="analyticsData.goalOverviewRadialBar.chartOptions"
                              :series="goalOverview.series" />
                        </div>
                    </template>

                    <div
                      v-if="goalOverview.analyticsData"
                      class="flex justify-between text-center mt-4"
                      slot="no-body-bottom">

                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <p class="mt-4">Capacidad</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview.analyticsData.completed }}</p>
                        </div>
                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0">
                            <p class="mt-4">Stock</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview.analyticsData.inProgress }}</p>
                        </div>
                    </div>
                </vx-card>
            </div>
            <div class="vx-col w-full md:w-1/2 mb-base">
                <vx-card title="TANQUE CRIOGENICO">
                    <template slot="no-body">
                        <div class="mt-10">
                            <vue-apex-charts
                              type="radialBar"
                              height="240"
                              :options="analyticsData.goalOverviewRadialBar.chartOptions"
                              :series="goalOverview2.series" />
                        </div>
                    </template>

                    <div
                      v-if="goalOverview2.analyticsData"
                      class="flex justify-between text-center mt-4"
                      slot="no-body-bottom">

                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <p class="mt-4">Capacidad</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview2.analyticsData.completed }}</p>
                        </div>
                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0">
                            <p class="mt-4">Stock</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview2.analyticsData.inProgress }}</p>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>

    </div>
</template>
<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';
import ChartjsLineChart from './components/ChartjsLineChart.vue';
import ChartjsBarChart from './components/ChartBarChart.vue';
import VueApexCharts from 'vue-apexcharts';

import analyticsData from './components/analyticsData.js';

export default {
    components: {
        StatisticsCardLine,
        ChartjsLineChart,
        ChartjsBarChart,
        VueApexCharts
    },

    data(){
        return {
            goalOverview: {
                analyticsData: {
                    completed: 15000,
                    inProgress: 14540
                },
                series: [96]
            },

            goalOverview2: {
                analyticsData: {
                    completed: 9764,
                    inProgress: 100
                },
                series: [7]
            },

            browserStatistics: [
                {
                    comparedResult: "800",
                    id: 1,
                    name: "HOSPITALIZACION",
                    ratio: 73,
                },
            ],

            analyticsData
        }
    },

    methods: {
        closeCardAnimationDemo (card) {
            card.removeRefreshAnimation(3000)
        }
    }
}
</script>