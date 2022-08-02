<template>
    <div id="data-detalle-tanque-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="product-details p-6" id="item-detail-page">
                <div class="vx-row mt-2">

                    <div class="vx-col md:w-2/5 w-full flex items-center justify-center">
                        <div class="product-img-container w-3/5 mx-auto mb-10 md:mb-0">
                            <img v-if="item.id===1" src="@/assets/images/pages/isotanque.png" alt="item_data.name" class="responsive">
                            <img v-if="item.id===2" src="@/assets/images/pages/criogenico.png" alt="item_data.name" class="responsive">
                        </div>
                    </div>

                    <div class="vx-col md:w-3/5 w-full">
                        <h3>{{ item.nombre }}</h3>

                        <p class="my-2">
                            <span class="mr-2">Capacidad</span>
                            <span>máximo (m3)</span>
                        </p>
                        <p class="flex items-center flex-wrap">
                            <span class="text-2xl leading-none font-medium text-primary mr-4 mt-2">{{ item.cmax }}</span>
                            <span class="pl-4 mr-2 mt-2 border border-solid d-theme-border-grey-light border-t-0 border-b-0 border-r-0">CP</span>
                        </p>

                        <vs-divider />

                        <p>Stock de Oxígeno (m3)</p>

                        <!-- Color -->
                        <div class="vx-row">
                            <div class="vx-col w-full mb-4">
                                <span class="text-xl font-medium">{{ item.stock }}</span>
                                <div class="flex flex-wrap items-center mt-2">
                                    <div
                                        :class="{'border-transparent': item.opt_color != color}"
                                        class="color-radio rounded-full mx-1 border-2 border-solid cursor-pointer relative"
                                        :style="itemColor({color: color, style: ['borderColor']})"
                                        v-for="color in available_item_colors"
                                        :key="color"
                                        @click="item.opt_color=color">
                                        <div class="h-6 w-6 rounded-full absolute" :style="itemColor({color: color, style: ['backgroundColor']})"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="vx-col w-full">
                                <vs-progress :height="12" :percent="item.avance" :color="item.color"></vs-progress>
                            </div>
                        </div>

                        <vs-divider />

                        <div class="vx-row">

                            <div class="vx-col w-full">
                                <p class="my-2">
                                    <span>Registro de datos</span>
                                    <span class="mx-2">-</span>
                                    <span class="text-success">RECARGA Y LECTURA</span>
                                </p>
                            </div>

                            <div class="vx-col w-full">
                                <div class="flex flex-wrap items-start mb-4">
                                    <vs-button
                                        class="mr-4 mb-4"
                                        icon-pack="feather"
                                        icon="icon-battery-charging"
                                        @click="recargar(item)">
                                        Recargar
                                    </vs-button>

                                    <vs-button
                                        key="filled"
                                        class="mb-4"
                                        icon-pack="feather"
                                        icon="icon-edit"
                                        color="danger"
                                        @click="lectura(item)">
                                        Lectura
                                    </vs-button>
                                </div>
                            </div>

                        </div>

                        <div class="vx-row ml-0">
                            <div class="text-success flex flex-wrap items-center self-end border border-solid border-success py-1 px-2 rounded">
                                <span class="text-sm mr-2">Activo</span>
                                <feather-icon icon="CheckIcon" svgClasses="h-4 w-4" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </vx-card>

        <div class="vx-row">
            <div class="vx-col lg:w-1/2 w-full">
                <vx-card title="" class="mb-base" no-shadow card-border id="data-abast-list-view">
                    <div class="flex items-end">
                        <feather-icon icon="BatteryChargingIcon" class="mr-2" svgClasses="w-5 h-5" />
                        <span class="leading-none font-medium">Recarga de Oxígeno</span>
                    </div>

                    <vs-divider/>

                    <vs-table ref="table" :data="listaAbastecimiento" pagination :max-items="itemsPerPageRecarga" search>
                        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

                            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                    <span class="mr-2">{{ currentPageRecarga * itemsPerPageRecarga - (itemsPerPageRecarga - 1) }} - {{ listaAbastecimiento.length - currentPageRecarga * itemsPerPageRecarga > 0 ? currentPageRecarga * itemsPerPageRecarga : listaAbastecimiento.length }} de {{ listaAbastecimiento.length }}</span>
                                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                </div>
                                
                                <vs-dropdown-menu>
                                    <vs-dropdown-item @click="itemsPerPageRecarga=5">
                                    <span>5</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageRecarga=10">
                                    <span>10</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageRecarga=15">
                                    <span>25</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageRecarga=20">
                                    <span>50</span>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>

                        </div>

                        <template slot="thead">
                            <vs-th>TANQUE</vs-th>
                            <vs-th>CANTIDAD (m3)</vs-th>
                            <vs-th>Nro ORDEN</vs-th>
                            <vs-th>FECHA</vs-th>
                            <vs-th>ACCION</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <tbody id="div-with-loading">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].tanque.descripcion }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].cantidad }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].orden }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{data[indextr].fechaRegistro}}
                                    </vs-td>
                                    <vs-td class="whitespace-no-wrap">
                                        <feather-icon @click="eliminar(tr)" icon="Trash2Icon" svgClasses="w-5 w-5 hover:text-danger cursor-pointer" />
                                    </vs-td>
                                </vs-tr>
                            </tbody>
                        </template>

                    </vs-table>

                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <p class="truncate text-sm">
                            Mostrando registros del <strong>{{ currentPageRecarga * itemsPerPageRecarga - (itemsPerPageRecarga - 1) }}</strong> al <strong>{{ listaAbastecimiento.length - currentPageRecarga * itemsPerPageRecarga > 0 ? currentPageRecarga * itemsPerPageRecarga : listaAbastecimiento.length }}</strong> de un total de <strong>{{ listaAbastecimiento.length }}</strong> registros
                        </p>
                    </div>

                </vx-card>
            </div>

            <div class="vx-col lg:w-1/2 w-full">
                <vx-card title="" class="mb-base" no-shadow card-border id="data-abast-list-view">
                    <div class="flex items-end">
                        <feather-icon icon="FileIcon" class="mr-2" svgClasses="w-5 h-5" />
                        <span class="leading-none font-medium">Lectura de Oxígeno</span>
                    </div>

                    <vs-divider/>

                    <vs-table ref="table" :data="listaLectura" pagination :max-items="itemsPerPageLectura" search>
                        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

                            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                    <span class="mr-2">{{ currentPageLectura * itemsPerPageLectura - (itemsPerPageLectura - 1) }} - {{ listaLectura.length - currentPageLectura * itemsPerPageLectura > 0 ? currentPageLectura * itemsPerPageLectura : listaLectura.length }} de {{ listaLectura.length }}</span>
                                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                </div>
                                
                                <vs-dropdown-menu>
                                    <vs-dropdown-item @click="itemsPerPageLectura=5">
                                    <span>5</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageLectura=10">
                                    <span>10</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageLectura=15">
                                    <span>25</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPageLectura=20">
                                    <span>50</span>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>

                        </div>

                        <template slot="thead">
                            <vs-th>TANQUE</vs-th>
                            <vs-th>LECTURA (m3)</vs-th>
                            <vs-th>CONSUMO</vs-th>
                            <vs-th>FECHA</vs-th>
                            <vs-th>ACCION</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <tbody id="div-with-loading">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].tanque.descripcion }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].cantidad }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{ data[indextr].consumo }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].id">
                                        {{data[indextr].fechaRegistro}}
                                    </vs-td>
                                    <vs-td class="whitespace-no-wrap">
                                        <feather-icon @click="eliminar(tr)" icon="Trash2Icon" svgClasses="w-5 w-5 hover:text-danger cursor-pointer" />
                                    </vs-td>
                                </vs-tr>
                            </tbody>
                        </template>

                    </vs-table>

                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <p class="truncate text-sm">
                            Mostrando registros del <strong>{{ currentPageLectura * itemsPerPageLectura - (itemsPerPageLectura - 1) }}</strong> al <strong>{{ listaLectura.length - currentPageLectura * itemsPerPageLectura > 0 ? currentPageLectura * itemsPerPageLectura : listaLectura.length }}</strong> de un total de <strong>{{ listaLectura.length }}</strong> registros
                        </p>
                    </div>

                </vx-card>
            </div>

        </div>

        <vs-popup title="Recarga de Oxígeno" :active.sync="popupRacarga">
            <vx-card no-shadow card-border>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">Cantidad recarga (m3)</label>
                    <vs-input class="w-full mb-2" v-model="cantidadRecarga" placeholder="Ingrese la cantidad de recarga" v-validate="'required|decimal:2'" name="cantidad" data-vv-as="Cantidad"/>
                    <span class="text-danger text-sm"  v-show="errors.has('cantidad')">{{ errors.first('cantidad') }}</span>
                </div>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">RUC</label>
                    <vs-input class="w-full mb-2" v-model="inputRuc" placeholder="Ingrese RUC del proveedor" v-validate="'required'" name="ruc" data-vv-as="ruc"/>
                    <span class="text-danger text-sm" v-show="errors.has('ruc')">{{ errors.first('ruc') }}</span>
                </div>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">Número de Guia de Remisión</label>
                    <vs-input class="w-full mb-2" v-model="inputGuiaRemision" placeholder="Ingrese nro guia de remisión" v-validate="'required'" name="guia" data-vv-as="guia"/>
                    <span class="text-danger text-sm" v-show="errors.has('guia')">{{ errors.first('guia') }}</span>
                </div>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">Fecha de Guia de Remisión</label>
                    <datepicker class="w-full" :language="es" format="dd/MM/yyyy" v-model="inputFechaGuia" placeholder="dd/mm/yyyy" v-validate="'required'" name="fecha"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('fecha')">{{ errors.first('fecha') }}</span>
                </div>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">Orden de Compra</label>
                    <vs-input class="w-full mb-2" v-model="numOrdenRecarga" placeholder="Ingrese nro de la orden de compra" v-validate="'required'" name="orden" data-vv-as="orden"/>
                    <span class="text-danger text-sm"  v-show="errors.has('orden')">{{ errors.first('orden') }}</span>
                </div>
            </vx-card>
            <div class="vx-col w-full">
                <div class="mt-2 flex flex-wrap items-center justify-end">
                    <vs-button @click="guardarRecarga" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                    <vs-button @click="popupRacarga=false" icon-pack="feather" icon="icon-x-circle" class="ml-4 mt-2" type="border" color="danger">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>

        <vs-popup title="Lectura de Oxígeno" :active.sync="popupLectura">
            <vx-card no-shadow card-border>
                <div class="vx-col w-full">
                    <label class="text-sm opacity-100">Lectura (m3)</label>
                    <vs-input class="w-full mb-2" v-model="cantidadLectura" placeholder="Registre la lectura del tanque" v-validate="'required|decimal:2'" name="cantidad" data-vv-as="Cantidad"/>
                    <span class="text-danger text-sm"  v-show="errors.has('cantidad')">{{ errors.first('cantidad') }}</span>
                </div>
            </vx-card>
            <div class="vx-col w-full">
                <div class="mt-2 flex flex-wrap items-center justify-end">
                    <vs-button @click="guardarLectura" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                    <vs-button @click="popupLectura=false" icon-pack="feather" icon="icon-x-circle" class="ml-4 mt-2" type="border" color="danger">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
</template>
<script>
import vSelect from 'vue-select';
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/src/locale';
export default {
    components: {
        vSelect,
        StatisticsCardLine,
        Datepicker
    },

    data(){
        return {
            es: es,
            
            listaAbastecimiento: [],
            listaLectura: [],
            tanque: null,

            cantidadRecarga: null,
            inputRuc: null,
            inputGuiaRemision: null,
            inputFechaGuia: null,
            numOrdenRecarga: null,

            cantidadLectura: null,

            itemsPerPageRecarga: 10,
            itemsPerPageLectura: 10,
            isMountedRecarga: false,
            isMountedLectura: false,


            backgroundLoading:'primary',
            colorLoading:'#fff',

            item: {},
            available_item_colors: ['#28C76F', '#FF9F43', '#EA5455'],
            popupRacarga: false,
            popupLectura: false
        }
    },

    computed: {
        currentPageRecarga () {
            if (this.isMountedRecarga) {
                return this.$refs.table.currentx
            }
            return 0
        },

        currentPageLectura () {
            if (this.isMountedLectura) {
                return this.$refs.table.currentx
            }
            return 0
        },

        validateForm() {
            return !this.errors.any() && this.tanque !== null && this.cantidad !== 0 && this.numOrden !== null;
        },

        itemColor () {
            return (obj) => {
                const style_obj = {}
                obj.style.forEach(p => { style_obj[p] = obj.color })
                return style_obj
            }
        },
    },

    created(){
        this.parametro = this.$route.params.id;
        this.getTanqueById(this.parametro);
        this.tanque = this.parametro;
        
    },

    mounted () {
        this.isMountedRecarga = true;
        this.isMountedLectura = true;
        this.getAbastecimientoPorTanque(this.tanque);
        this.getLecturaPorTanque(this.tanque);
    },

    methods: {
        getTanqueById(id){
            this.$vs.loading();
            this.$store.dispatch('abastecimiento/fetchTanqueById', id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    const porcent = (data.stock * 100) / data.cmax;
                    this.item = {
                        id: data.id,
                        cp: data.cp,
                        nombre: data.nombre,
                        cmax: data.cmax,
                        cmin: data.cmin,
                        abastecimiento: data.abastecimiento,
                        consumo: data.consumo,
                        stock: data.stock,
                        avance: porcent,
                        color: porcent > 40 ? 'success' : porcent < 20 ? 'danger' : 'warning',
                        opt_color: porcent > 40 ? '#28C76F' : porcent < 20 ? '#EA5455' : '#FF9F43',
                    }
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getAbastecimientoPorTanque(idTanque){
            this.$vs.loading({
                container: '#div-with-loading',
                scale: 0.6
            });
            this.$store.dispatch('abastecimiento/fetchAbastecimientoPorTanque', idTanque)
            .then(response => {
                this.$vs.loading.close('#div-with-loading > .con-vs-loading')
                if(response.status == 200){
                    this.listaAbastecimiento = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getLecturaPorTanque(idTanque){
            this.$vs.loading();
            this.$store.dispatch('abastecimiento/fetchLecturaPorTanque', idTanque)
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 200){
                    this.listaLectura = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        recargar(item){
            this.popupRacarga = true;
            this.tanque = item.id;
        },

        guardarRecarga(){
            if(this.tanque === null || this.cantidadRecarga === null || this.numOrdenRecarga === null){
                this.showMessageAlert('Los campos son obligatorios.');
                return;
            }

            let day = `${(this.inputFechaGuia.getDate())}`.padStart(2, '0');
            let month = `${(this.inputFechaGuia.getMonth() + 1)}`.padStart(2, '0');
            let year = this.inputFechaGuia.getFullYear();

            const dataParams = {
                tanque: { id: this.tanque, descripcion: '' },
                cantidad: this.cantidadRecarga,
                ruc: this.inputRuc,
                guia: this.inputGuiaRemision,
                fecha: `${day}/${month}/${year}`,
                orden: this.numOrdenRecarga
            }
            this.$vs.loading();
            this.$store.dispatch('abastecimiento/saveAbastecimientoPorTanque', dataParams)
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 201){
                    this.showMessageSuccess('Se guardó de forma correcta.');
                }
                this.getAbastecimientoPorTanque(this.tanque);
                this.getTanqueById(this.tanque);
                this.cantidadRecarga = null;
                this.numOrdenRecarga = null;
                this.popupRacarga = false;
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        lectura(item){
            this.popupLectura = true;
            this.tanque = item.id;
        },

        guardarLectura(){
            if(this.tanque === null || this.cantidadLectura === null){
                this.showMessageAlert('Los campos son obligatorios.');
                return;
            }
            const dataParams = {
                tanque: { id: this.tanque, descripcion: '' },
                cantidad: this.cantidadLectura,
            }
            this.$vs.loading();
            this.$store.dispatch('abastecimiento/saveLecturaPorTanque', dataParams)
            .then(response => {
                this.$vs.loading.close();
                if(response.status == 201){
                    this.showMessageSuccess('Se guardó de forma correcta.');
                }
                this.getLecturaPorTanque(this.tanque);
                this.getTanqueById(this.tanque);
                this.cantidadLectura = null;
                this.popupLectura = false;
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        eliminar(data){

        },

        
        resetForm(){
            this.cantidad = 0;
            this.numOrden = null;
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
<style lang="scss">
@import "@/assets/scss/vuexy/_variables.scss";
#data-detalle-tanque-view {
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