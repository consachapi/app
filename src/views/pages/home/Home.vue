<template>
    <div id="extra-component-chartjs-demo">
        <vx-card
            title=""
            title-color="#fff"
            card-background="linear-gradient(270deg, rgba(40,86,152,1) 24%, rgba(40,86,152,0.7833508403361344) 45%, rgba(40,86,152,1) 100%, rgba(40,86,152,0.2539390756302521) 100%)"
            content-color="#fff"
            class="mb-base">
            <div class="vx-row">
                <div class="vx-col sm:w-3/4 w-full">
                    <h3 class="mb-3 mt-4 text-white"><strong>SISTEMA DE MEDIDAS DE CONTROL Y REMEDIACION</strong></h3>
                </div>
                <div class="vx-col sm:w-1/4 w-full">
                    <div class="text-white flex flex-col justify-start items-end">
                        <img src="@/assets/images/pages/gore.png" width="120" height="50">
                    </div>
                </div>
            </div>
        </vx-card>

        <div class="vx-row">
            <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2 mb-base">
                <vx-card title="Medidas de Control">
                    <div slot="no-body">
                        <div class="vx-row text-center">
                            <div class="vx-col w-full lg:w-1/5 md:w-full sm:w-1/5 flex flex-col justify-between mb-4 lg:order-first md:order-last sm:order-first order-last">
                                <div class="lg:ml-2 lg:mt-6 md:mt-0 md:ml-0 sm:ml-2 sm:mt-6">
                                    <h1 class="font-bold text-5xl">{{ totalMedidasControl }}</h1>
                                    <small>Medios de verificación</small>
                                </div>
                            </div>
                            <div class="vx-col w-full lg:w-4/5 md:w-full sm:w-4/5 justify-center mx-auto lg:mt-0 md:mt-6 sm:mt-0 mt-6">
                                <vue-apex-charts type="radialBar" height="385" :options="medidasControlChartOptions" :series="medidasControlSeries" />
                            </div>
                        </div>
                        <div class="flex flex-row justify-between px-8 pb-4 mt-4">
                            <p class="text-center" v-for="(item, key) in dataMedidasControl" :key="key">
                                <span class="block text-primary font-medium">{{ item.label }}</span>
                                <span class="text-2xl text-dark font-semibold">{{ item.cantidad }}</span>
                            </p>
                        </div>
                    </div>
                </vx-card>
            </div>

            <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2 mb-base">
                <vx-card title="Medidas de Remediación">
                    <div slot="no-body">
                        <div class="vx-row text-center">
                            <div class="vx-col w-full lg:w-1/5 md:w-full sm:w-1/5 flex flex-col justify-between mb-4 lg:order-first md:order-last sm:order-first order-last">
                                <div class="lg:ml-2 lg:mt-6 md:mt-0 md:ml-0 sm:ml-2 sm:mt-6">
                                    <h1 class="font-bold text-5xl">{{ totalMedidasRemediacion }}</h1>
                                    <small>Medios de verificación</small>
                                </div>
                            </div>
                            <div class="vx-col w-full lg:w-4/5 md:w-full sm:w-4/5 justify-center mx-auto lg:mt-0 md:mt-6 sm:mt-0 mt-6">
                                <vue-apex-charts type="radialBar" height="385" :options="medidasRemediacionChartOptions" :series="medidasRemediacionSeries" />
                            </div>
                        </div>
                        <div class="flex flex-row justify-between px-8 pb-4 mt-4">
                            <p class="text-center" v-for="(item, key) in dataMedidasRemediacion" :key="key">
                                <span class="block text-primary font-medium">{{ item.label }}</span>
                                <span class="text-2xl text-dark font-semibold">{{ item.cantidad }}</span>
                            </p>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2 mb-base">
                <vx-card slot="no-body" class="text-center bg-danger-gradient greet-user">
                    <feather-icon icon="ServerIcon" class="p-4 mb-4 bg-danger inline-flex rounded-full text-white shadow" svgClasses="h-6 w-6"></feather-icon>
                    <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white text-sm">RIESGOS IDENTIFICADOS</p>
                    <h1 class="mb-2 text-white">{{ totalRiesgos }}</h1>
                </vx-card>
            </div>

            <div class="vx-col w-1/2 md:w-1/2 xl:w-1/2 mb-base">
                <vx-card slot="no-body" class="text-center bg-primary-gradient greet-user">
                    <feather-icon icon="ShoppingBagIcon" class="p-4 mb-4 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-6 w-6"></feather-icon>
                    <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white text-sm">DEFICIENCIAS IDENTIFICADAS</p>
                    <h1 class="mb-2 text-white">{{ totalDeficiencias }}</h1>
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
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue';

export default {
    components: {
        StatisticsCardLine,
        ChartjsLineChart,
        ChartjsBarChart,
        VueApexCharts,
        ChangeTimeDurationDropdown
    },

    data(){
        return {
            totalRiesgos: 0,
            totalDeficiencias: 0,

            totalMedidasControl: 0,
            totalMedidasRemediacion: 0,

            dataMedidasControl: [],
            dataMedidasRemediacion: [],

            medidasControlSeries: [],
            medidasControlChartOptions: {},

            medidasRemediacionSeries: [],
            medidasRemediacionChartOptions: {},
        }
    },

    mounted(){
       /* this.getDashboardMedidasControl();
        this.getDashboardMedidasRemediacion();
        this.getRiesgoDeficienciaTotal();*/
    },

    methods: {
        getDashboardMedidasControl(){
            this.$vs.loading();
            this.$http.dashboardMedidaControl()
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    const data = response.data;
                    this.dataMedidasControl = [
                        {label: 'Ejecutados', cantidad: data.ejecutado},
                        {label: 'Por ejecutar', cantidad: data.pendiente},
                    ];
                    this.totalMedidasControl = data.total;
                    let ejecucion = Number((data.ejecutado * 100) / data.total).toFixed(2);
                    this.medidasControlSeries = [ ejecucion ];
                    this.medidasControlChartOptions = {
                        plotOptions: {
                            radialBar: {
                                size: 158,
                                offsetY: -30,
                                startAngle: -150,
                                endAngle: 150,
                                hollow: {
                                    size: '65%'
                                },
                                track: {
                                    background: 'rgba(0,0,0,0)',
                                    strokeWidth: '100%'
                                },
                                dataLabels: {
                                    value: {
                                        offsetY: 30,
                                        color: '#1A77D6',
                                        fontSize: '2rem'
                                    }
                                }
                            }
                        },
                        colors: ['#2AE34F'],
                        fill: {
                            type: 'gradient',
                            gradient: {
                                enabled: true,
                                shade: 'dark',
                                type: 'horizontal',
                                shadeIntensity: 0.5,
                                gradientToColors: ['#2A95E3'],
                                inverseColors: true,
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100]
                            }
                        },
                        stroke: {
                            dashArray: 8
                        },
                        chart: {
                            sparkline: {

                            }
                        },
                        labels: ['Ejecutados']
                    }
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getDashboardMedidasRemediacion(){
            this.$vs.loading();
            this.$http.dashboardMedidaRemediacion()
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    const data = response.data;
                    this.dataMedidasRemediacion = [
                        {label: 'Ejecutados', cantidad: data.ejecutado},
                        {label: 'Por ejecutar', cantidad: data.pendiente},
                    ];
                    this.totalMedidasRemediacion = data.total;
                    let ejecucion = Number((data.ejecutado * 100) / data.total).toFixed(2);
                    this.medidasRemediacionSeries = [ ejecucion ];
                    this.medidasRemediacionChartOptions = {
                        plotOptions: {
                            radialBar: {
                                size: 158,
                                offsetY: -30,
                                startAngle: -150,
                                endAngle: 150,
                                hollow: {
                                    size: '65%'
                                },
                                track: {
                                    background: 'rgba(0,0,0,0)',
                                    strokeWidth: '100%'
                                },
                                dataLabels: {
                                    value: {
                                        offsetY: 30,
                                        color: '#1A77D6',
                                        fontSize: '2rem'
                                    }
                                }
                            }
                        },
                        colors: ['#E71313'],
                        fill: {
                            type: 'gradient',
                            gradient: {
                                enabled: true,
                                shade: 'dark',
                                type: 'horizontal',
                                shadeIntensity: 0.5,
                                gradientToColors: ['#1373E7'],
                                inverseColors: true,
                                opacityFrom: 1,
                                opacityTo: 1,
                                stops: [0, 100]
                            }
                        },
                        stroke: {
                            dashArray: 8
                        },
                        chart: {
                            sparkline: {

                            }
                        },
                        labels: ['Ejecutados']
                    }
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getRiesgoDeficienciaTotal(){
            this.$vs.loading();
            this.$http.dashboardRiesgoDeficienciaTotal()
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    const data = response.data;
                    this.totalRiesgos = data.riesgo;
                    this.totalDeficiencias = data.deficiencia;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        showMessageAlert(message){
            this.$vs.notify({
                title: 'Aviso',
                text: message,
                position:'top-center',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            });
        },

        showMessageSuccess(message){
            this.$vs.notify({
                title: 'Información',
                text: message,
                position:'top-right',
                iconPack: 'feather',
                icon: 'icon-check',
                color: 'success'
            });
        },

        showMessageError(status, message){
            if(status === 400 || status === 409){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            }
            if(status === 401){
                this.popupDeficiencia = false;
                this.popupEliminar = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupDeficiencia = false;
                this.popupEliminar = false;
                this.$vs.notify({
                    title: 'ACCESO DENEGADO',
                    text: 'No tiene permisos para esta proceso.',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }
            if(status === 404){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            }
            if(status === 417){
                this.$vs.notify({
                    title: 'ALERTA',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }

            if(status === 500){
                this.$vs.notify({
                    title: 'ERROR',
                    text: 'Ups!!!. Ocurrio un error. Vuelve a intentarlo.',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    color: 'danger'
                });
            }
        },
    }
}
</script>