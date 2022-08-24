<template>
    <div>
        <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" />
        <vx-card no-shadow card-border id="div-detalle-persona-with-loading" class="mt-base vs-con-loading__container">
            <div class="flex items-end">
                <feather-icon :icon="iconTitle" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">{{ title }}</span>
            </div>

            <vs-divider/>

            <vx-card
                title="Medida de Control"
                title-color="success"
                :subtitle="medidaControl"
                subtitle-color="primary"
                class="mb-6">

                <div class="flex flex-wrap items-center justify-start">
                    <div>
                        <small><strong class="font-bold">Producto:</strong> {{ titleProducto }}</small>
                        <span class="text-grey flex items-start justify-start mt-0">
                            <small><strong class="font-bold">Riesgo:</strong><span class="text-sm ml-5">{{ titleRiesgo }}</span></small>
                        </span>
                    </div>
                    <div class="vs-spacer"></div>
                    <vs-button @click="agregar" icon-pack="feather" color="success" icon="icon-check-square"  class="mt-2">Agregar</vs-button>
                </div>
            </vx-card>

            <ais-instant-search :search-client="searchClient" index-name="instant_search" id="algolia-instant-search-demo">
                <ais-hits>
                    <div class="items-grid-view vx-row match-height">
                        <div class="vx-col lg:w-1/3 sm:w-1/2 w-full" v-for="item in items" :key="item.id">
                            <item-grid-view :item="item" @editar-cverificacion="editaControlVerificacion" @actualizar-cverificacion="actualizarMedidaControl">
                                <template slot="action-buttons">
                                    <div class="flex flex-wrap">
                                        <div
                                            class="item-view-primary-action-btn p-3 flex flex-grow items-center justify-center text-primary cursor-pointer"
                                            @click="asignar(item)">
                                            <feather-icon icon="CheckCircleIcon" svgClasses="h-4 w-4" />
                                            <span class="text-sm font-semibold ml-2">Asignar</span>
                                        </div>
                                        <div
                                            class="item-view-secondary-action-btn p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                            @click="mostrar(item)">
                                            <feather-icon icon="EyeIcon" svgClasses="h-4 w-4" />
                                            <span class="text-sm font-semibold ml-2">Ver</span>
                                        </div>
                                    </div>
                                </template>
                            </item-grid-view>
                        </div>

                    </div>
                </ais-hits>
            </ais-instant-search>

            <div class="vx-col w-full mt-2">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="regresar" icon-pack="feather" color="danger" icon="icon-rotate-ccw"  class="ml-4 mt-2">Regresar</vs-button>
                </div>
            </div>

        </vx-card>

        <vs-popup title="Responsables y Actividades/Tareas" :active.sync="popupAsignacion" id="id-popup-asignacion">
            <vx-card class="mb-4" no-shadow card-border>

                <div class="mb-4">
                    <label class="text-sm opacity-75">Organo o Unidad Orgánica Responsable</label>
                    <v-select multiple :options="itemsOficina" v-model="selectedOficina" :clearable="false" :closeOnSelect="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="producto">
                        <template v-slot:no-options="{ searching }">
                            <template v-if="searching">
                                No se encontraron resultados
                            </template>
                            <span v-else style="opacity: 0.5">No existen resultados</span>
                        </template>
                    </v-select>
                    <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
                </div>

                <div class="vx-col w-full mb-base">
                    <div class="flex flex-wrap items-center justify-end">
                        <vs-button @click="asignarResponsable" icon-pack="feather" color="primary" icon="icon-user-check" class="ml-auto mt-2">Asignar</vs-button>
                    </div>
                </div>

                <vs-divider color="primary"><strong class="text-primary"> Actividades del Medio de Verificación </strong></vs-divider>

                <p class="mb-2">Plazo de implementación desde el <small class="text-danger font-bold"> {{ fechaInicio }}</small> al <small class="text-danger font-bold">{{ fechaTermino }}</small>.</p>

                <div class="vx-row mb-4">
                    <div class="vx-col w-full md:w-1/2">
                        <div class="mb-2">
                            <vs-input class="w-full" v-model="inputActividadDetalle" placeholder="Describe la actividad" v-validate="'required'" name="actividad" />
                            <span class="text-danger text-sm" v-show="errors.has('actividad')">{{ errors.first('actividad') }}</span>
                        </div>
                    </div>
                    <div class="vx-col w-full md:w-1/2">
                        <div class="vx-row">
                            <div class="vx-col w-full md:w-1/2">
                                <div class="mb-2">
                                    <datepicker :language="es" v-model="inputFechaLimite" format="dd/MM/yyyy" placeholder="dd/mm/yyyy" v-validate="'required'" name="fecha"></datepicker>
                                    <span class="text-danger text-sm" v-show="errors.has('fecha')">{{ errors.first('fecha') }}</span>
                                </div>
                            </div>
                            <div class="vx-col w-full md:w-1/2">
                                <div class="mb-2">
                                    <vs-button @click="agregarActividad" ref="loadableButton" id="button-with-loading" class="vs-con-loading__container" icon-pack="feather" icon="icon-plus-square" type="border" color="success">
                                        Agregar
                                    </vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <vs-table stripe ref="table" :data="itemsActividades">
                    <template slot="thead">
                        <vs-th class="">Actividad</vs-th>
                        <vs-th class="">Fecha Límite</vs-th>
                        <vs-th class="">Estado</vs-th>
                        <vs-th class="">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <tbody>
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].id">
                                    {{data[indextr].actividad}}
                                </vs-td>
                                <vs-td :data="data[indextr].fecha">
                                    {{data[indextr].fecha}}
                                </vs-td>
                                <vs-td :data="data[indextr].estado">
                                    <vs-chip transparent :color="statusColor(data[indextr].estado)">
                                        <span class="font-medium truncate"> {{ data[indextr].estado }}</span>
                                    </vs-chip>
                                </vs-td>
                                <vs-td class="whitespace-no-wrap">
                                    <feather-icon @click="eliminar(tr)" icon="Trash2Icon" svgClasses="w-5 w-5 hover:text-danger cursor-pointer" />
                                </vs-td>
                            </vs-tr>
                        </tbody>
                    </template>
                </vs-table>


            </vx-card>

            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="cancelar" icon-pack="feather" color="danger" type="border" icon="icon-thumbs-up" class="ml-4 mt-2">Aceptar</vs-button>
                </div>
            </div>

            <vs-popup title="Confirmar" :active.sync="popupEliminar">
                <p>¿Esta seguro de eliminar el registro?</p>
                <div class="mt-8">
                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <vs-button @click="eliminarActividad" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
                        <vs-button @click="popupEliminar=false" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-2">Cancelar</vs-button>
                    </div>
                </div> 
            </vs-popup>

        </vs-popup>

    </div>
</template>
<script>
import { AisHits, AisInstantSearch } from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import ItemGridView from './components/ItemGridView.vue';
import vSelect from 'vue-select';
import DataViewSidebar from './components/DataViewSidebar.vue';
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/src/locale';
export default {
    components: {
        ItemGridView,
        vSelect,
        AisInstantSearch,
        AisHits,
        DataViewSidebar,
        Datepicker
    },

    data(){
        return {
            title: 'Medio de Verificación',
            iconTitle: 'CheckSquareIcon',
            es: es,

            medidaControlId: null,
            medidaControl: '',
            titleProducto: '',
            titleRiesgo: '',

            items: [],
            itemsPerPage: 10,
            isMounted: false,

            searchClient: algoliasearch(
                'latency',
                '6be0576ff61c053d5f9a3225e2a90f76'
            ),

            addNewDataSidebar: false,
            sidebarData: {},

            popupAsignacion: false,
            popupEliminar: false,

            itemsOficina: [],

            inputDocumento: null,
            inputNombre: null,
            selectedOficina: [],
            itemsActividades: [],

            fechaInicio: null,
            fechaTermino: null,

            inputActividadDetalle: null,
            inputFechaLimite: null,

            medioVerificacionId: null,
            actividadId: null
        }
    },

    created(){
        this.parametro = this.$route.params.id;
        this.getMedidaControl(this.parametro);
        this.getMedioVerificacion(this.parametro);
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },
    },

    mounted () {
        this.isMounted = true
    },

    methods: {
        getMedidaControl(value){
            this.$vs.loading();
            this.$store.dispatch('control/findMedidaControlById', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.medidaControlId = data.id;
                    this.medidaControl = data.mcontrol;
                    this.titleProducto = data.riesgo.producto.descripcion;
                    this.titleRiesgo = data.riesgo.riesgo
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getMedioVerificacion(value){
            this.$vs.loading();
            this.$store.dispatch('control/fecthMedioVerificacionByMedidaControl', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.items = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getOficina(){
            this.$vs.loading();
            this.$http.seleccionarOficina()
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    this.itemsOficina = response.data;
                } else {
                    this.itemsOficina = [];
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        agregar(){
            this.sidebarData = {
                id: this.medidaControlId,
                data: null
            }
            this.toggleDataSidebar(true)
        },

        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val;
            if(!val){
                this.getMedioVerificacion(this.medidaControlId);
            }
        },

        regresar(){
            this.$router.push({
				name: 'app-medidas-control-detalle'
			}).catch(() => {});
        },

        editaControlVerificacion(value){
            console.log('AAA=' + value);
            this.sidebarData = {
                id: this.medidaControlId,
                data: null
            }
            this.toggleDataSidebar(true)
        },

        asignar(item){
            this.medioVerificacionId = item.id;
            this.getOficina();
            if(item.oficinas.length !==0 ){
                this.selectedOficina = [];
                item.oficinas.forEach(element => {
                    const item = {
                        value: element.id,
                        label: element.descripcion
                    };

                    this.selectedOficina.push(item);
                });
            } else {
                this.selectedOficina = [];
            };

            this.fechaInicio = item.inicio;
            this.fechaTermino = item.fin;

            this.getActividades(item.id);
            this.popupAsignacion = true;
        },

        mostrar(item){
            this.$router.push({
				name: 'app-medidas-cremediacion-mcontrol-actividad',
                params: { id: item.id}
			}).catch(() => {});
        },

        asignarResponsable(){
            if(this.medidaControlId === null){
                this.showMessageAlert('Seleccione el medio de verificación');
                return;
            }

            if(this.selectedOficina.length === 0){
                this.showMessageAlert('Seleccione el responsable');
                return;
            }

            let dataOficinas = [];
            this.selectedOficina.forEach(element => {
                const item = {
                    id: element.value,
                    descripcion: element.label
                };

                dataOficinas.push(item);
            });

            const payload = {
                id: this.medioVerificacionId,
                oficinas: dataOficinas
            }

            this.$vs.loading();
            this.$store.dispatch('control/saveOficinasMedioVerificacion', payload)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 201){
                    this.showMessageSuccess('Se asignó de forma correcta.');
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });

        },

        cancelar(){
            this.popupAsignacion = false;
            this.getMedioVerificacion(this.parametro);
        },

        getActividades(value){
            this.$vs.loading();
            this.$store.dispatch('control/fetchActividadMedioVerificacion', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsActividades = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        agregarActividad(){
            if(this.inputActividadDetalle === null || this.inputFechaLimite === null){
                this.showMessageAlert('Ingrese la actividad y la fecha de entrega.');
                return;
            }

            let dayFin = `${(this.inputFechaLimite.getDate())}`.padStart(2,'0');
            let monthFin = `${(this.inputFechaLimite.getMonth()+1)}`.padStart(2,'0');
            let yearFin = this.inputFechaLimite.getFullYear();

            const payload = {
                id: this.medioVerificacionId,
                data: {
                    actividad: this.inputActividadDetalle.trim().toUpperCase(),
                    fecha: `${ dayFin }/${ monthFin }/${ yearFin }`,
                    estado: 1
                }
            }

            this.$vs.loading();
            this.$store.dispatch('control/saveActividadMedioVerificacion', payload)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 201){
                    this.showMessageSuccess('Se agregó la actividad.');
                    this.getActividades(this.medioVerificacionId);
                    this.inputActividadDetalle = null;
                    this.inputFechaLimite = null;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        eliminar(tr){
            this.actividadId = tr.id;
            this.popupEliminar = true;
        },

        eliminarActividad(){
            this.$vs.loading();
            this.$store.dispatch('control/deleteActividadControl', this.actividadId)
            .then(response => {
                this.$vs.loading.close();
                this.popupEliminar = false;
                this.getActividades(this.medioVerificacionId);
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        actualizarMedidaControl(){
            this.getMedioVerificacion(this.medidaControlId);
        },

        statusColor(status) {
            if (status === 'PENDIENTE') return 'primary'
            if (status === 'COMPLETADO') return 'success'
            return 'danger'
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
                this.popupAsignacion = false;
                this.addNewDataSidebar = false;
                this.popupEliminar = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupAsignacion = false;
                this.addNewDataSidebar = false;
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
<style lang="scss">
#algolia-instant-search-demo {
  .algolia-header {
    .algolia-filters-label {
      width: calc(260px + 2.4rem);
    }
  }

  #algolia-content-container {

    .vs-sidebar {
      position: relative;
      float: left;
    }
  }

  .algolia-search-input-right-aligned-icon {
    padding: 1rem 1.5rem;
  }

  .algolia-price-slider {
    min-width: unset;
  }

  .item-view-primary-action-btn {
    color: #285698 !important;
    background-color: #c4daf3;
    min-width: 50%;
  }

  .item-view-secondary-action-btn {
      background-color: #6687b6;
    min-width: 50%;
  }
}

.theme-dark {
  #algolia-instant-search-demo {
    #algolia-content-container {
      .vs-sidebar {
        background-color: #10163a;
      }
    }
  }
}

@media (min-width: 992px) {
  .vs-sidebar-rounded {
    .vs-sidebar {
      border-radius: .5rem;
    }

    .vs-sidebar--items {
      border-radius: .5rem;
    }
  }
}

@media (max-width: 992px) {
  #algolia-content-container {
    .vs-sidebar {
      position: absolute !important;
      float: none !important;
    }
  }
}

#id-popup-asignacion {
    .vs-popup {
        width: 700px;
    }
    .vs-con-table {
        .vs-table--thead {
            th {
                background: #d9d8d8;
            }
        }
    }
}

</style>