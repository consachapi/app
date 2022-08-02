<template>
    <div id="data-medidas-producto-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="FileTextIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Productos Priorizados</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsProducto" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="addNewProducto" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsProducto.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsProducto.length }} de {{ itemsProducto.length }}</span>
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
                    <vs-th class="">PRODUCTO</vs-th>
                    <vs-th class="">PRESUPUESTO</vs-th>
                    <vs-th class="">PORCENTAJE</vs-th>
                    <vs-th class="">PERIODO</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].id">
                                {{data[indextr].descripcion}}
                            </vs-td>
                            <vs-td :data="data[indextr].presupuesto">
                                {{data[indextr].presupuesto}}
                            </vs-td>
                            <vs-td :data="data[indextr].porcentaje">
                                {{data[indextr].porcentaje}}
                            </vs-td>
                            <vs-td :data="data[indextr].periodo">
                                {{data[indextr].periodo}}
                            </vs-td>
                            <vs-td :data="data[indextr].estado">
                                <vs-chip transparent :color="statusColor(data[indextr].estado)">
                                    <span class="font-medium truncate"> {{ data[indextr].estado }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <feather-icon @click="editar(tr)" icon="Edit3Icon" svgClasses="w-5 h-5 mr-4 hover:text-primary stroke-current cursor-pointer" />
                                <feather-icon @click="eliminar(tr)" icon="Trash2Icon" svgClasses="w-5 w-5 hover:text-danger cursor-pointer" />
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsProducto.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsProducto.length }}</strong> de un total de <strong>{{ itemsProducto.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup title="Nuevo Producto Priorizado" :active.sync="popupProducto">
            <div class="mb-2">
                <p>Presupuesto Institucional Modificado:</p>
                <strong><h4 class="text-primary">{{ presupuestoEntidadFormat }}</h4></strong>
            </div>
            <vx-card class="mb-4" no-shadow card-border>
                <div class="vx-col w-full mb-2">
                    <label class="text-sm opacity-75">Descripción del producto priorizado</label>
                    <vs-input class="w-full" v-model="inputProducto" v-validate="'required'" name="producto" placeholder="Ingrese Producto"/>
                    <span class="text-danger text-sm" v-show="errors.has('producto')">{{ errors.first('producto') }}</span>
                </div>
                <div class="vx-row mb-2">
                    <div class="vx-col w-full md:w-2/3">
                        <label class="text-sm opacity-75">Presupuesto asignado</label>
                        <vs-input class="w-full" v-model="inputPresupuesto" v-on:keyup="calcularPorcentaje" v-validate="'required|decimal'" name="presupuesto" placeholder="Ingrese presupuesto"/>
                        <span class="text-danger text-sm" v-show="errors.has('presupuesto')">{{ errors.first('presupuesto') }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/3">
                        <label class="text-sm opacity-75">Porcentaje</label>
                        <vs-input class="w-full" readonly v-model="inputPorcentaje" v-validate="'required|decimal'" name="porcentaje" placeholder=""/>
                        <span class="text-danger text-sm" v-show="errors.has('porcentaje')">{{ errors.first('porcentaje') }}</span>
                    </div>
                </div>

                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label class="text-sm opacity-75">Comentario</label>
                        <vs-textarea class="w-full" v-model="inputObservacion" name="observacion"/>
                        <span class="text-danger text-sm"  v-show="errors.has('observacion')">{{ errors.first('observacion') }}</span>
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
                    <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
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
                    <vs-button @click="eliminarProducto" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
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
            itemsProducto: [],
            itemsPerPage: 10,
            isMounted: false,

            inputProducto: null,
            inputPresupuesto: null,
            inputObservacion: null,
            itemsEstado: [{value: 0, label: 'ANULADO'}, {value: 1, label: 'ACTIVO'}, {value: 2, label: 'COMPLETADO'}],
            selectedEstado: {value: 1, label: 'ACTIVO'},

            inputPorcentaje: null,

            popupProducto: false,
            popupEliminar: false,

            productoId: null,
            presupuestoEntidad: null,
            presupuestoEntidadFormat: null
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
            return !this.errors.any() && this.inputProducto !== null && this.inputPresupuesto !== null;
        }
    },

    created(){
        this.presupuestoEntidad = this.$store.state.pim;
        this.presupuestoEntidadFormat = this.formatNumber(this.presupuestoEntidad);
        this.getProductos();
    },

    mounted () {
        this.isMounted = true
    },
    
    methods: {
        getProductos(){
            this.$vs.loading();
            this.$store.dispatch('control/fetchProductos')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsProducto = response.data;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        calcularPorcentaje(){
            let porcent = this.inputPresupuesto === null || this.inputPresupuesto === '' ? 0.00 : this.inputPresupuesto * 100 / this.presupuestoEntidad;
            this.inputPorcentaje = porcent.toFixed(2);
        },

        addNewProducto(){
            this.popupProducto = true;
        },

        guardar(){
            const params = {
                descripcion: this.inputProducto.trim().toUpperCase(),
                presupuesto: this.inputPresupuesto,
                observacion: this.inputObservacion === null ? null : this.inputObservacion.trim().toUpperCase(),
                estado: this.selectedEstado.value
            }

            if(this.productoId === null){
                this.$vs.loading();
                this.$store.dispatch('control/saveProducto', params)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 201){
                        this.showMessageSuccess('Se guardó de forma correcta');
                    }
                    this.popupProducto = false;
                    this.clearForm();
                    this.getProductos();
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                const paramsData = {
                    id: this.productoId,
                    data: params
                }

                this.$vs.loading();
                this.$store.dispatch('control/editProducto', paramsData)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 200){
                        this.showMessageSuccess('Se actualizó de forma correcta.');;
                    }
                    this.popupProducto = false;
                    this.clearForm();
                    this.getProductos();
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                }); 
            }

        },

        cancelar(){
            this.popupProducto = false;
            this.clearForm();
        },

        clearForm(){
            this.inputProducto = null;
            this.inputPresupuesto = null;
            this.inputPorcentaje = null;
            this.inputObservacion = null;
            this.selectedEstado = {value: 1, label: 'ACTIVO'}
        },

        editar(tr){
            this.$vs.loading();
            this.$store.dispatch('control/showProducto', tr.id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.productoId = data.id;
                    this.inputProducto = data.descripcion;
                    this.inputPresupuesto = data.presupuesto;
                    this.inputPorcentaje = data.porcentaje;
                    this.inputObservacion = data.observacion;
                    this.popupProducto = true;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        eliminar(tr){
            if(tr.estado !== 'ACTIVO'){
                return;
            }
            this.productoId = tr.id;
            this.popupEliminar = true;
        },

        eliminarProducto(){
            if(this.productoId === null){
                this.showMessageAlert('Seleccione el producto priorizado');
                return;
            }
            this.$vs.loading();
            this.$store.dispatch('control/deleteProducto', this.productoId)
            .then(response => {
                this.$vs.loading.close();
                this.popupEliminar = false;
                this.productoId = null;
                this.getProductos();
                this.showMessageSuccess('Eliminado de forma correcta.');
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        statusColor(status) {
            if (status === 'ANULADO') return 'danger'
            if (status === 'ACTIVO') return 'success'
            return 'primary'
        },

        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
                this.popupProducto = false;
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
   
    },
    components: {
        vSelect
    },
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/_variables.scss";
#data-medidas-producto-view {
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
</style>