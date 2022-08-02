<template>
    <div id="data-medidas-control-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="CpuIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Medidas de Control</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsMedidasControl" pagination :max-items="itemsPerPage" search noDataText="No existen datos">
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="nuevoMedidaControl" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsMedidasControl.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsMedidasControl.length }} de {{ itemsMedidasControl.length }}</span>
                            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                        </div>
                        
                        <vs-dropdown-menu>
                            <vs-dropdown-item @click="itemsPerPage=5">
                            <span>5</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=10">
                            <span>10</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=25">
                            <span>25</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=50">
                            <span>50</span>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>

                </div>

                <template slot="thead">
                    <vs-th class="">MEDIDA DE CONTROL</vs-th>
                    <vs-th class="">RIESGO</vs-th>
                    <vs-th class="">NIVEL RIESGO</vs-th>
                    <vs-th class="">PRODUCTO</vs-th>
                    <vs-th class="">PERIODO</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].mcontrol">
                                {{data[indextr].mcontrol}}
                            </vs-td>
                            <vs-td :data="data[indextr].riesgo">
                                {{ data[indextr].riesgo.riesgo }}
                            </vs-td>
                            <vs-td :data="data[indextr].riesgo">
                                <vs-chip :color="statusColorRiesgo(data[indextr].riesgo.nivel)">
                                    <span class="font-medium truncate"> {{ data[indextr].riesgo.nivel }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td :data="data[indextr].riesgo">
                                {{ data[indextr].riesgo.producto.descripcion }}
                            </vs-td>
                            <vs-td :data="data[indextr].riesgo">
                                {{data[indextr].riesgo.periodo}}
                            </vs-td>
                            <vs-td :data="data[indextr].estado">
                                <vs-chip transparent :color="statusColor(data[indextr].estado)">
                                    <span class="font-medium truncate"> {{ data[indextr].estado }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <div class="vx-row-actions">
                                    <vs-button @click="editar(tr)" class="mr-1" color="success" type="filled" icon-pack="feather" icon="icon-edit" size="small"></vs-button>
                                    <vs-button @click="medidas(tr)" class="mr-1" color="rgb(62, 201, 214)" type="filled" icon-pack="feather" icon="icon-check-circle" size="small"></vs-button>
                                    <vs-button @click="eliminar(tr)" color="danger" type="filled" icon-pack="feather" icon="icon-trash-2" size="small"></vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsMedidasControl.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsMedidasControl.length }}</strong> de un total de <strong>{{ itemsMedidasControl.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup title="Medida de Control" :active.sync="popupMedidadControl">
            <vx-card class="mb-4" no-shadow card-border>
                <div class="mb-2">
                    <label class="text-sm opacity-75">Producto Priorizado</label>
                    <v-select :options="itemsProducto" v-model="selectedProducto" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="producto">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
                </div>

                <div class="mb-2">
                    <label class="text-sm opacity-75">Riesgos Identificados</label>
                    <v-select :options="itemsRiesgo" v-model="selectedRiesgo" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="riesgo">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('riesgo')">{{ errors.first('riesgo') }}</span>
                </div>

                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label class="text-sm opacity-75">Describe la medida de control</label>
                        <vs-textarea class="w-full" v-model="inputMedidaControl" name="medida"/>
                        <span class="text-danger text-sm" v-show="errors.has('medida')">{{ errors.first('medida') }}</span>
                    </div>
                </div>
                
                <div class="mb-2">
                    <label class="text-sm opacity-75">Estado</label>
                    <v-select :options="itemsEstado" v-model="selectedEstado" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="cargo">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('estado')">{{ errors.first('estado') }}</span>
                </div>

            </vx-card>
            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="guardar" :disabled="!validateForm" icon-pack="feather" color="primary" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                    <vs-button @click="cancelar" icon-pack="feather" color="danger" type="border" icon="icon-x-circle"  class="ml-4 mt-2">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>

        <vs-popup title="Confirmar" :active.sync="popupEliminar">
            <p>¿Esta seguro de eliminar el registro?</p>
            <div class="mt-8">
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-button @click="eliminarMedida" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
                    <vs-button @click="popupEliminar=false" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-2">Cancelar</vs-button>
                </div>
            </div> 
        </vs-popup>

    </div>
</template>
<script>
import vSelect from 'vue-select';
export default {
    data(){
        return {
            itemsMedidasControl: [],
            itemsPerPage: 10,
            isMounted: false,

            itemsProducto: [],
            itemsRiesgo: [],

            itemsEstado: [{value: 0, label: 'ANULADO'}, {value: 1, label: 'ACTIVO'}, {value: 2, label: 'COMPLETADO'}],

            selectedProducto: null,
            selectedRiesgo: null,
            inputMedidaControl: null,
            selectedEstado: {value: 1, label: 'ACTIVO'},

            medidaControlId: null,
            popupMedidadControl: false,
            popupEliminar: null
        }
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },

        validateForm(){
            return !this.errors.any() && this.selectedProducto !== null && this.selectedRiesgo !== null && this.inputMedidaControl !== null;
        }
    },

    mounted () {
        this.isMounted = true;
        this.getMedidasControl();
    },

    watch: {
        selectedProducto(item){
            if(item !== null){
                this.getRiesgos(item.value);
            }
        }
    },

    methods: {
        getMedidasControl(){
            this.$vs.loading();
            this.$store.dispatch('control/fecthMedidaControl')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsMedidasControl = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getProductos(){
            this.$vs.loading();
            this.$store.dispatch('control/fetchSeleccionarProductos')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsProducto = response.data;
                    this.popupMedidadControl = true;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getRiesgos(value){
            this.$vs.loading();
            this.$store.dispatch('control/fetchRiesgosByProducto', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsRiesgo = response.data;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        nuevoMedidaControl(){
            this.getProductos();
        },

        editar(tr){
            this.$vs.loading();
            this.$store.dispatch('control/findMedidaControlById', tr.id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.getProductos();
                    this.medidaControlId = data.id;
                    this.inputMedidaControl = data.mcontrol;
                    this.selectedProducto = { value: data.riesgo.producto.id, label: data.riesgo.producto.descripcion };
                    this.selectedRiesgo = { value: data.riesgo.id, label: data.riesgo.riesgo };
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});

        },

        medidas(tr){
            if(tr === null){
                this.showMessageAlert('Seleccione la medida de control.');
                return;
            }

            if(tr.riesgo.nivel === 'RB'){
                this.showMessageAlert('La medida de control tiene un Riesgo Bajo.');
                return;
            }

            this.$router.push({
				name: 'app-medidas-control-detalle-verificacion',
                params: { id: tr.id}
			}).catch(() => {});
        },

        eliminar(tr){
            if(tr.estado !== 'ACTIVO'){
                return;
            }
            this.medidaControlId = tr.id;
            this.popupEliminar = true;
        },

        guardar(){
            if(this.selectedProducto === null || this.selectedRiesgo === null || this.inputMedidaControl === null){
                this.showMessageAlert('Los campos son obligatorios.');
                return;
            }

            const paramsData = {
                riesgo: { id: this.selectedRiesgo.value , descripcion: this.selectedRiesgo.label },
                mcontrol: this.inputMedidaControl.trim().toUpperCase(),
                estado: this.selectedEstado.value
            }

            if(this.medidaControlId === null){
                this.$vs.loading();
                this.$store.dispatch('control/saveMedidaControl', paramsData)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 201){
                        this.showMessageSuccess('Se guardó de forma correcta');
                        this.popupMedidadControl = false;
                        this.clearForms();
                        this.getMedidasControl();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                const payload = {
                    id: this.medidaControlId,
                    data: paramsData
                }

                this.$vs.loading();
                this.$store.dispatch('control/updateMedidaControl', payload)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 200){
                        this.showMessageSuccess('Se actualizó de forma correcta');
                        this.popupMedidadControl = false;
                        this.clearForms();
                        this.getMedidasControl();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            }

        },

        eliminarMedida(){
            if(this.medidaControlId === null){
                this.showMessageAlert('Seleccione la medida de control para eliminar.');
                return;
            }
            this.$vs.loading();
            this.$store.dispatch('control/deleteMedidaControl', this.medidaControlId)
            .then(response => {
                this.$vs.loading.close();
                this.showMessageSuccess('Se enuló de forma correcta');
                this.popupEliminar = false;
                this.medidaControlId = null;
                this.getMedidasControl();
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        cancelar(){
            this.popupMedidadControl = false;
            this.clearForms();
        },

        clearForms(){
            this.selectedProducto = null;
            this.selectedRiesgo = null;
            this.inputMedidaControl = null;
            this.selectedEstado = { value: 1, label: 'ACTIVO' };
        },

        statusColor(status) {
            if (status === 'ANULADO') return 'danger'
            if (status === 'ACTIVO') return 'success'
            return 'primary'
        },

        statusColorRiesgo(nivel) {
            if (nivel === 'RM') return 'success'
            if (nivel === 'RA') return 'warning'
            if (nivel === 'RMA') return 'danger'
            return 'primary'
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
                this.popupRiesgo = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupPaciente = false;
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

    },

    components: {
        vSelect
    }

}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/_variables.scss";
#data-medidas-control-view {
.vs-con-table {
    @media (max-width: 689px) {
        .vs-table--search {
            margin-left: 0;
            max-width: unset;
            width: 100%;

            .vs-table--search-input {
                width: 100%;
            }
        }
    }

    @media (max-width: 461px) {
        .items-per-page-handler {
            display: none;
        }
    }

    @media (max-width: 341px) {
        .data-list-btn-container {
            width: 100%;

            .dd-actions,
            .btn-add-new {
                width: 100%;
                margin-right: 0 !important;
            }
        }
    }

    .vs-table--header {
        display: flex;
        flex-wrap: wrap;
        margin-left: 0.0rem;
        margin-right: 0.0rem;
        > span {
            display: flex;
            flex-grow: 1;
        }

        .vs-table--search{
            padding-top: 0;

            .vs-table--search-input {
                padding: 1.0rem 2.5rem;
                font-size: 1rem;

                &+i {
                    left: 1rem;
                }

                &:focus+i {
                    left: 1rem;
                }
            }
        }
    }

    .vs-table {
        font-size: 0.88rem;
        font-weight: 400;
        tr {
            box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
            td {
                padding: 10;
            }
            td.td-check {
               padding: 20px !important;
            }
        }
    }

    .vs-table--thead{
        th {
            padding: 10;
            background: #d9d8d8;
      
            &:first-child{
                border-top-left-radius: .3rem;
                border-bottom-left-radius: .3rem;
            }
            &:last-child{
                border-top-right-radius: .3rem;
                border-bottom-right-radius: .3rem;
            }
            .vs-table-text{
                text-transform: uppercase;
                font-weight: 600;
            }
        }
        th.td-check{
            padding: 0 15px !important;
        }
        tr{
            background: none;
            box-shadow: none;
        }
    }

    .vs-table--pagination {
        justify-content: center;
    }
  }
}

#item-detail-page {
  .color-radio {
    height: 2.28rem;
    width: 2.28rem;

    > div {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .item-features {
    background-color: #f7f7f7;

    .theme-dark & {
      background-color: $theme-dark-secondary-bg;
    }
  }

  .product-sales-meta-list {
    .vs-list--icon {
      padding-left: 0;
    }
  }

  .related-product-swiper {
      // padding-right: 2rem;
      // padding-left: 2rem;

    .swiper-wrapper {
      padding-bottom: 2rem;

      > .swiper-slide {
        background-color: #f7f7f7;
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.1), 0 5px 12px 0 rgba(0,0,0,0.08) !important;

        .theme-dark & {
          background-color: $theme-light-dark-bg;
        }
      }
    }

    .swiper-button-next,
    .swiper-button-prev {
      transform: scale(.5);
      filter: hue-rotate(40deg);
    }

    .swiper-button-next {
      right: 0
    }

    .swiper-button-prev {
      left: 0;
    }
  }
}

.vx-row-actions {
  display: flex;
  flex-wrap: nowrap;
  margin: 0 -1rem;

  & > .vx-col {
    padding: 0 1rem;
  }

  &.match-height>.vx-col {
    display: flex;
  }

  &.no-gutter {
    margin: 0;

    & > .vx-col {
      padding: 0;
    }
  }
}
</style>