<template>
    <div id="data-medidas-riesgo-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="CheckIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Riesgos Identificados</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsRiesgo" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="nuevoRiesgo" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsRiesgo.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsRiesgo.length }} de {{ itemsRiesgo.length }}</span>
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
                    <vs-th class="">RIESGO</vs-th>
                    <vs-th class="">PRODUCTO</vs-th>
                    <vs-th class="">PROBABILIDAD</vs-th>
                    <vs-th class="">IMPACTO</vs-th>
                    <vs-th class="">VALOR</vs-th>
                    <vs-th class="">NIVEL</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].riesgo">
                                {{data[indextr].riesgo}}
                            </vs-td>
                            <vs-td :data="data[indextr].producto">
                                {{ data[indextr].producto.descripcion }}
                            </vs-td>
                            <vs-td :data="data[indextr].probabilidad">
                                {{data[indextr].probabilidad}}
                            </vs-td>
                            <vs-td :data="data[indextr].impacto">
                                {{data[indextr].impacto}}
                            </vs-td>
                            <vs-td :data="data[indextr].valor">
                                {{data[indextr].valor}}
                            </vs-td>
                            <vs-td :data="data[indextr].nivel">
                                <vs-chip :color="statusColorRiesgo(data[indextr].valor)">
                                    <span class="font-medium truncate"> {{ data[indextr].nivel }}</span>
                                </vs-chip>
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
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsRiesgo.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsRiesgo.length }}</strong> de un total de <strong>{{ itemsRiesgo.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup title="Riesgo Identificado" :active.sync="popupRiesgo">
            <vx-card class="mb-4" no-shadow card-border>
                <div class="mb-2">
                    <label class="text-sm opacity-75">Producto</label>
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

                <div class="vx-row">
                    <div class="vx-col w-full">
                        <label class="text-sm opacity-75">Describe el Riesgo Identificado</label>
                        <vs-textarea class="w-full" v-model="inputRiesgo" name="riesgo"/>
                        <span class="text-danger text-sm" v-show="errors.has('riesgo')">{{ errors.first('riesgo') }}</span>
                    </div>
                </div>

                <label class="text-sm opacity-75">Probabilidad del Riesgo</label>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioProbabilidad" vs-value="BAJA">Baja</vs-radio>
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioProbabilidad" vs-value="MEDIA" color="success">Media</vs-radio>
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioProbabilidad" vs-value="ALTA" color="danger">Alta</vs-radio>       
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioProbabilidad" vs-value="MUY_ALTA" color="warning">Muy Alta</vs-radio>
                    </div>
                </div>

                <label class="text-sm opacity-75">Impacto del Riesgo</label>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioImpacto" vs-value="IBAJA">Baja</vs-radio>
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioImpacto" vs-value="IMEDIA" color="success">Media</vs-radio>
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioImpacto" vs-value="IALTA" color="danger">Alta</vs-radio>       
                    </div>
                    <div class="vx-col w-full md:w-1/4">
                        <vs-radio v-model="radioImpacto" vs-value="IMUY_ALTA" color="warning">Muy Alta</vs-radio>
                    </div>
                </div>

                <div class="vx-row mb-2">
                    <div class="vx-col w-full md:w-1/2">
                        <label class="text-sm opacity-75">Valor del Riesgo</label>
                        <vs-input class="w-full" readonly v-model="inputValor" v-validate="'required'" name="valor" placeholder=""/>
                        <span class="text-danger text-sm" v-show="errors.has('valor')">{{ errors.first('valor') }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2">
                        <label class="text-sm opacity-75">Nivel del Riesgo</label>
                        <vs-input class="w-full" readonly v-model="inputNivel" v-validate="'required'" name="nivel" placeholder=""/>
                        <span class="text-danger text-sm" v-show="errors.has('nivel')">{{ errors.first('nivel') }}</span>
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
                
                <div v-if="showAlert" class="mb-6">
                    <vs-chip transparent color="danger"><strong>¡Priorizar Riesgo! </strong></vs-chip>
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
                    <vs-button @click="eliminarRiesgo" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
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
            itemsRiesgo: [],
            itemsPerPage: 10,
            isMounted: false,

            popupRiesgo: false,
            itemsProducto: [],
            itemsEstado: [{ value: 0, label: 'ANULADO' }, { value: 1, label: 'ACTIVO' }, { value: 2, label: 'COMPLETADO' }],

            selectedProducto: null,
            inputRiesgo: null,
            selectedEstado: {value: 1, label: 'ACTIVO'},

            riesgoId: null,
            popupEliminar: null,

            radioProbabilidad: null,
            radioImpacto: null,
            inputValor: null,
            inputNivel: null,

            showAlert: false,
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
            return !this.errors.any() && this.selectedProducto !== null && this.inputRiesgo !== null && this.radioProbabilidad !== null && this.radioImpacto !== null;
        }
    },

    mounted () {
        this.isMounted = true;
        this.getRiesgos();
    },

    watch: {
        radioProbabilidad(value){
            this.calculeRiesgo(value);
        },
        radioImpacto(value){
            this.calculeRiesgo(value);
        }
    },

    methods: {
        getRiesgos(){
            this.$vs.loading();
            this.$store.dispatch('control/fetchRiesgos')
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

        getProductos(){
            this.$vs.loading();
            this.$store.dispatch('control/fetchSeleccionarProductos')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsProducto = response.data;
                    this.popupRiesgo = true;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        nuevoRiesgo(){
            this.getProductos();
        },

        editar(tr){
            this.$vs.loading();
            this.$store.dispatch('control/showRiesgo', tr.id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;

                    this.riesgoId = data.id;
                    this.inputRiesgo = data.riesgo;
                    this.radioProbabilidad = data.probabilidad;
                    this.inputValor = data.valor;
                    this.inputNivel = data.nivel;
                    this.selectedProducto = { value: data.producto.id, label: data.producto.descripcion };
                    if(data.impacto === 'BAJA'){
                        this.radioImpacto = 'IBAJA';
                    }
                    if(data.impacto === 'MEDIA'){
                        this.radioImpacto = 'IMEDIA';
                    }
                    if(data.impacto === 'ALTA'){
                        this.radioImpacto = 'IALTA';
                    }
                    if(data.impacto === 'MUY_ALTA'){
                        this.radioImpacto = 'IMUY_ALTA';
                    }
                    this.getProductos();
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
            this.riesgoId = tr.id;
            this.popupEliminar = true;
        },

        guardar(){
            if(this.selectedProducto === null || this.inputRiesgo === null){
                this.showMessageAlert('Los campos son obligatorios.');
                return;
            }

            const probab = ( value ) => {
                if(value === 'BAJA'){
                    return 4;
                }
                if(value === 'MEDIA'){
                    return 6;
                }
                if(value === 'ALTA'){
                    return 8;
                }
                if(value === 'MUY_ALTA'){
                    return 10;
                }
            }

            const impac = ( value ) => {
                if(value === 'IBAJA'){
                    return 4;
                }
                if(value === 'IMEDIA'){
                    return 6;
                }
                if(value === 'IALTA'){
                    return 8;
                }
                if(value === 'IMUY_ALTA'){
                    return 10;
                }
            }

            const paramsData = {
                riesgo: this.inputRiesgo.trim().toUpperCase(),
                producto: { id: this.selectedProducto.value , descripcion: this.selectedProducto.label },
                probabilidad: probab(this.radioProbabilidad),
                impacto: impac(this.radioImpacto),
                estado: this.selectedEstado.value
            }

            if(this.riesgoId === null){
                this.$vs.loading();
                this.$store.dispatch('control/saveRiesgo', paramsData)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 201){
                        this.showMessageSuccess('Se guardó de forma correcta');
                        this.popupRiesgo = false;
                        this.clearForms();
                        this.getRiesgos();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                const payload = {
                    id: this.riesgoId,
                    data: paramsData
                }
                this.$vs.loading();
                this.$store.dispatch('control/updateRiesgo', payload)
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 200){
                        this.showMessageSuccess('Se actualizó de forma correcta.');
                        this.popupRiesgo = false;
                        this.clearForms();
                        this.getRiesgos();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            }
        },

        eliminarRiesgo(){
            if(this.riesgoId === null){
                this.showMessageAlert('Seleccione el riesgo para eliminar.');
                return;
            }
            this.$vs.loading();
            this.$store.dispatch('control/deleteRiesgo', this.riesgoId)
            .then(response => {
                this.$vs.loading.close();
                this.showMessageSuccess('Se enuló de forma correcta');
                this.popupEliminar = false;
                this.riesgoId = null;
                this.getRiesgos();
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        cancelar(){
            this.popupRiesgo = false;
            this.clearForms();
        },

        clearForms(){
            this.selectedProducto = null;
            this.inputRiesgo = null;
            this.radioProbabilidad = null;
            this.radioImpacto = null;
            this.inputValor = null;
            this.inputNivel = null;
            this.selectedEstado = { value: 1, label: 'ACTIVO' };
        },

        calculeRiesgo(value){
            if(this.radioProbabilidad === null){
                return;
            }
            if(this.radioImpacto === null){
                return;
            }
            
            let probabilidad = 4;
            let impacto = 4;
            switch(this.radioProbabilidad){
                case 'BAJA':
                    probabilidad = 4;
                    break;
                case 'MEDIA':
                    probabilidad = 6;
                    break;
                case 'ALTA':
                    probabilidad = 8;
                    break;
                case 'MUY_ALTA':
                    probabilidad = 10;
                    break;
            }

            switch(this.radioImpacto){
                case 'IBAJA':
                    impacto = 4;
                    break;
                case 'IMEDIA':
                    impacto = 6;
                    break;
                case 'IALTA':
                    impacto = 8;
                    break;
                case 'IMUY_ALTA':
                    impacto = 10;
                    break;
            }
            const nivel = probabilidad * impacto;
            this.inputValor = nivel;
            if(nivel >= 16 && nivel <= 24){
                this.showAlert = false;
                this.inputNivel = 'RB';
            }
            if(nivel >= 32 && nivel <= 40){
                this.showAlert = true;
                this.inputNivel = 'RM';
            }
            if(nivel >= 48 && nivel <= 64){
                this.showAlert = true;
                this.inputNivel = 'RA';
            }
            if(nivel >= 80 && nivel <= 100){
                this.showAlert = true;
                this.inputNivel = 'RMA';
            }
        },

        statusColor(status) {
            if (status === 'ANULADO') return 'danger'
            if (status === 'ACTIVO') return 'success'
            return 'primary'
        },

        statusColorRiesgo(status) {
            if (status >= 32) return 'danger'
            return 'rgb(153, 230, 255)'
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
                this.popupEliminar = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupRiesgo = false;
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
#data-medidas-riesgo-view {
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