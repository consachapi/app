<template>
    <div id="ecommerce-checkout-demo">
        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="ServerIcon"
                  icon-right
                  :statistic="stockIsotanque"
                  statisticTitle="STOCK ISOTANQUE" 
                  color="success" />
            </div>

            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="CpuIcon"
                  icon-right
                  :statistic="stockTanqueCriogenico"
                  statisticTitle="STOCK T. CRIOGENICO"
                  color="danger" />
            </div>

            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3">
                <statistics-card-line
                  hideChart
                  class="mb-base"
                  icon="ActivityIcon"
                  icon-right
                  :statistic="stockTotal"
                  statisticTitle="STOCK TOTAL"
                  color="warning" />
            </div>

        </div>


        <div class="vx-row">
            <div class="vx-col w-full relative">
                
                <div class="items-list-view" v-for="(item, index) in tanqueItems" :key="index">
                    <vx-card class="list-view-item overflow-hidden mb-base">
                        <template slot="no-body">
                            <div class="vx-row item-details no-gutter">

                                <div class="vx-col sm:w-1/4 w-full item-img-container bg-white flex items-center justify-center cursor-pointer" @click="showTanque(item)">
                                    <img v-if="item.id===1" src="@/assets/images/pages/isotanque.png" class="grid-view-img p-4">
                                    <img v-if="item.id===2" src="@/assets/images/pages/criogenico.png" class="grid-view-img p-4">
                                </div>

                                <div class="vx-col sm:w-1/2">
                                    <div class="p-4 pt-6">
                                        <slot name="item-meta">
                                            <h6 class="item-name font-semibold mb-1 hover:text-primary cursor-pointer" @click="showTanque(item)">{{ item.nombre }}</h6>
                                            <p class="text-sm mb-4">CP <span class="font-semibold cursor-pointer">{{ item.cp }}</span></p>
                                            <p class="item-description text-sm">Capacidad Maximo</p>
                                            <p class="font-medium text-grey">{{ item.cmax }} m3</p>
                                            <p class="text-success font-medium mt-4">Oxígeno disponible</p>
                                            <div class="vx-col w-full">
                                                <vs-progress :height="8" :percent="item.avance" :color="item.color"></vs-progress>
                                            </div>
                                        </slot>
                                    </div>
                                </div>

                                <div class="vx-col sm:w-1/4 w-full flex items-center sm:border border-0 border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0">

                                    <div class="p-4 flex flex-col w-full">

                                        <div class="text-success flex self-end border border-solid border-success py-1 px-2 rounded">
                                            <span class="text-sm mr-1">Activo</span>
                                            <feather-icon icon="CheckIcon" svgClasses="h-4 w-4" />
                                        </div>

                                        <div class="my-6">
                                            <h5 class="font-bold text-center">{{ item.abastecimiento - item.consumo }}</h5>
                                            <span class="text-grey flex items-start justify-center mt-1">
                                                <feather-icon icon="FileIcon" svgClasses="w-4 h-4" />
                                                <span class="text-sm ml-2">Stock (m3)</span>
                                            </span>
                                        </div>

                                        <div class="item-view-secondary-action-btn bg-primary p-3 rounded-lg flex flex-grow items-center justify-center text-white cursor-pointer" @click="showTanque(item)">
                                            <feather-icon icon="EyeIcon" :svgClasses="[{'text-white fill-current': isInWishList(item)}, 'h-4 w-4']" />
                                            <span class="text-sm font-semibold ml-2">Ver</span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </template>
                    </vx-card>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';
export default {
    components: {
        StatisticsCardLine
    },
    data(){
        return {
            tanqueItems: [],

            stockIsotanque: 0,
            stockTanqueCriogenico: 0,
            stockTotal: 0,
        }
    },

    created(){
        this.getTanques();
    },

    methods: {
        getTanques(){
            this.$vs.loading();
            this.$store.dispatch('abastecimiento/fetchTanque')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    data.forEach(element => {
                        const porcent = (element.stock * 100) / element.cmax;
                        if(element.id === 1){
                            this.stockIsotanque = element.stock;
                        } else {
                            this.stockTanqueCriogenico = element.stock;
                        }

                        const item = {
                            id: element.id,
                            cp: element.cp,
                            nombre: element.nombre,
                            cmax: element.cmax,
                            cmin: element.cmin,
                            abastecimiento: element.abastecimiento,
                            consumo: element.consumo,
                            stock: element.stock,
                            avance: porcent,
                            color: porcent > 40 ? 'success' : porcent < 20 ? 'danger' : 'warning',
                        }
                        this.tanqueItems.push(item);
                    });
                    this.stockTotal = this.stockIsotanque + this.stockTanqueCriogenico;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        isInWishList(item){
        },

        showTanque(item){
            this.$router.push({
				name: 'app-abastecimiento-tanque-detalle',
				params: { id: item.id}
			}).catch(() => {})
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
                this.popupEliminarPersonal = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupPaciente = false;
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
<style lang="scss" scoped>
#ecommerce-checkout-demo {
    .item-view-primary-action-btn {
        color: #2c2c2c !important;
        background-color: #f6f6f6;
    }

    .item-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
    }

    .vue-form-wizard {
        padding-bottom: 0;

        ::v-deep .wizard-header {
            padding: 0;
        }

        ::v-deep .wizard-tab-content {
            padding-right: 0;
            padding-left: 0;
            padding-bottom: 0;

            .wizard-tab-container{
              margin-bottom: 0 !important;
            }
        }
    }
}

.list-view-item {
    .item-name, .item-description {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .item-name {
        -webkit-line-clamp: 2;
    }

    .item-description {
        -webkit-line-clamp: 5;
    }

    .grid-view-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        transition: .35s;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 4px 25px 0px rgba(0,0,0,.25);

        .grid-view-img{
            opacity: 0.9;
        }
    }
}
</style>