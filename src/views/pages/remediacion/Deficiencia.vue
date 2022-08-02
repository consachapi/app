<template>
    <div id="data-medidas-producto-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="FileTextIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Deficiencias del Sistema de Control Interno</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsDeficiencias" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="addNewDeficiencia" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsDeficiencias.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsDeficiencias.length }} de {{ itemsDeficiencias.length }}</span>
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
                    <vs-th class="">DEFICIENCIA</vs-th>
                    <vs-th class="">EJE</vs-th>
                    <vs-th class="">COMPONENTE</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].id">
                                {{ data[indextr].deficiencia }}
                            </vs-td>
                            <vs-td :data="data[indextr].componente">
                                {{ data[indextr].componente.eje.descripcion }}
                            </vs-td>
                            <vs-td :data="data[indextr].componente">
                                {{ data[indextr].componente.descripcion }}
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
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsDeficiencias.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsDeficiencias.length }}</strong> de un total de <strong>{{ itemsDeficiencias.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup title="Deficiencia del SCI" :active.sync="popupDeficiencia">
            <vx-card class="mb-4" no-shadow card-border>
                <div class="vx-col w-full mb-2">
                    <label class="text-sm opacity-75">Eje</label>
                    <v-select :options="itemsEje" v-model="selectedEje" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="eje">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('eje')">{{ errors.first('eje') }}</span>
                </div>

                <div class="vx-col w-full mb-2">
                    <label class="text-sm opacity-75">Componente</label>
                    <v-select :options="itemsComponente" v-model="selectedComponente" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="componente">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('componente')">{{ errors.first('componente') }}</span>
                </div>

                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label class="text-sm opacity-75">Deficiencia del SCI</label>
                        <vs-textarea class="w-full" v-model="inputDeficiencia" name="deficiencia"/>
                        <span class="text-danger text-sm"  v-show="errors.has('deficiencia')">{{ errors.first('deficiencia') }}</span>
                    </div>
                </div>

                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label class="text-sm opacity-75">Comentario/Observación</label>
                        <vs-textarea class="w-full" v-model="inputObservacion" name="observacion"/>
                        <span class="text-danger text-sm"  v-show="errors.has('observacion')">{{ errors.first('observacion') }}</span>
                    </div>
                </div>
                
                <div class="mb-2">
                    <label class="text-sm opacity-75">Estado</label>
                    <v-select :options="itemsEstado" v-model="selectedEstado" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="estado">
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
                    <vs-button @click="eliminarDeficiencia" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
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
            itemsDeficiencias: [],
            itemsPerPage: 10,
            isMounted: false,

            selectedEje: null,
            selectedComponente: null,
            inputDeficiencia: null,
            inputObservacion: null,
            selectedEstado: {value: 1, label: 'ACTIVO'},

            itemsEje: [],
            itemsComponente: [],
            itemsEstado: [{value: 0, label: 'ANULADO'}, {value: 1, label: 'ACTIVO'}, {value: 2, label: 'COMPLETADO'}],

            popupDeficiencia: false,
            popupEliminar: false,

            deficienciaId: null,
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
            return !this.errors.any() && this.inputDeficiencia !== null && this.selectedComponente !== null;
        },
        
    },

    watch: {
        selectedEje(value){
            if(value !== null){
                this.getComponentes(value.value);
            }
        }
    },

    created(){
        this.getDeficiencias();
    },

    mounted () {
        this.isMounted = true
    },
    
    methods: {
        getDeficiencias(){
            this.$vs.loading();
            this.$store.dispatch('remediacion/fetchDeficiencia')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsDeficiencias = response.data;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        getEjes(){
            this.$vs.loading();
            this.$http.seleccionarEje()
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    this.itemsEje = response.data;
                } else {
                    this.itemsEje = [];
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getComponentes(value){
            this.$vs.loading();
            this.$http.seleccionarComponentePorEje(value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    this.itemsComponente = response.data;
                } else {
                    this.itemsComponente = [];
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        addNewDeficiencia(){
            this.getEjes();
            this.popupDeficiencia = true;
            this.clearForm();
        },

        guardar(){
            const params = {
                deficiencia: this.inputDeficiencia.trim().toUpperCase(),
                componente: this.selectedComponente.value,
                observacion: this.inputObservacion === null ? null : this.inputObservacion.trim().toUpperCase(),
                estado: this.selectedEstado.value
            }

            if(this.deficienciaId === null){
                this.$vs.loading();
                this.$store.dispatch('remediacion/saveDeficiencia', params)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 201){
                        this.showMessageSuccess('Se guardó de forma correcta.');
                    }
                    this.clearForm();
                    this.getDeficiencias();
                    this.popupDeficiencia = false;
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                const payload = {
                    id: this.deficienciaId,
                    data: params
                }

                this.$vs.loading();
                this.$store.dispatch('remediacion/updateDeficiencia', payload)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 200){
                        this.showMessageSuccess('Se actualizó de forma correcta.');

                        this.popupDeficiencia = false;
                        this.clearForm();
                        this.getDeficiencias();
                    }
                    
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                }); 
            }

        },

        cancelar(){
            this.popupDeficiencia = false;
            this.clearForm();
        },

        clearForm(){
            this.deficienciaId = null;
            this.selectedEje = null;
            this.selectedComponente = null;
            this.inputDeficiencia = null;
            this.inputObservacion = null;
            this.selectedEstado = {value: 1, label: 'ACTIVO'}
        },

        editar(tr){
            this.getEjes();

            this.$vs.loading();
            this.$store.dispatch('remediacion/showDeficiencia', tr.id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.deficienciaId = data.id;
                    this.selectedComponente = { value: data.componente.id, label: data.componente.descripcion };
                    this.selectedEje = { value: data.componente.eje.id, label: data.componente.eje.descripcion };
                    this.inputDeficiencia = data.deficiencia;
                    this.inputObservacion = data.observacion;
                    this.popupDeficiencia = true;
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
            this.deficienciaId = tr.id;
            this.popupEliminar = true;
        },

        eliminarDeficiencia(){
            if(this.deficienciaId === null){
                this.showMessageAlert('Seleccione el deficiencia del SCI.');
                return;
            }
            this.$vs.loading();
            this.$store.dispatch('remediacion/deleteDeficiencia', this.deficienciaId)
            .then(response => {
                this.$vs.loading.close();
                this.popupEliminar = false;
                this.clearForm();
                this.getDeficiencias();
                this.showMessageSuccess('Anulado de forma correcta.');
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