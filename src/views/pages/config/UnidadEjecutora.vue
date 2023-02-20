<template>
    <div class="data-table-list-view">
        <vx-card title="" class="mb-base" no-shadow card-border>
            <div class="flex items-end">
                <feather-icon icon="HomeIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Unidades Ejecutoras</span>
            </div>

            <vs-divider/>

            <vs-table 
            stripe 
            ref="table" 
            :data="itemsUnidadEjecutora" 
            pagination 
            :max-items="itemsPerPage" 
            search 
            noDataText="No existen datos" 
            id="div-uejecutora-with-loading" 
            class="vs-con-loading__container"
            >
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="nuevo" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsUnidadEjecutora.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsUnidadEjecutora.length }} de {{ itemsUnidadEjecutora.length }}</span>
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
                    <vs-th>CODIGO</vs-th>
                    <vs-th>UNIDAD EJECUTORA</vs-th>
                    <vs-th>ESTADO</vs-th>
                    <vs-th>ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].codigo">
                                {{ data[indextr].codigo }}
                            </vs-td>
                            <vs-td :data="data[indextr].descripcion">
                                {{ data[indextr].descripcion }}
                            </vs-td>
                            <vs-td :data="data[indextr].enabled">
                                <vs-chip transparent :color="statusColor(data[indextr].enabled)">
                                    <span class="font-medium truncate"> {{ status(data[indextr].enabled) }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <div class="vx-row-actions-button">
                                    <vx-tooltip text="Editar" position="bottom">
                                        <vs-button @click="editar(tr)" class="mr-1" color="primary" type="border" icon-pack="feather" icon="icon-edit" size="small"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-show="data[indextr].enabled" text="Bloquear" position="bottom">
                                        <vs-button @click="eliminar(tr)" class="mr-1" color="warning" type="border" icon-pack="feather" icon="icon-unlock" size="small"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-show="!data[indextr].enabled" text="Habilitar" position="bottom">
                                        <vs-button @click="habilitar(tr)" class="mr-1" color="danger" type="border" icon-pack="feather" icon="icon-lock" size="small"></vs-button>
                                    </vx-tooltip>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>
                
            </vs-table>

        </vx-card>

        <vs-popup :title="titleUnidadEjecutora" :active.sync="popupCreate">
            <div class="vx-col w-full mb-4">
                <label class="text-sm opacity-100 vs-input--label">Código*</label>
                <vs-input :readonly="readonlyCommon" class="w-full mb-4" placeholder="Codigo" v-model="inputCodigo" v-validate="'required'" name="codigo"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('codigo') }}</span>
            </div>

            <div class="vx-col w-full mb-4">
                <label class="text-sm opacity-100 vs-input--label">Unidad Ejecutora/Entidad*</label>
                <vs-input class="w-full mb-4" placeholder="Apellidos del usuario" v-model="inputDescripcion" v-validate="'required'" name="descripcion"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('descripcion') }}</span>
            </div>

            <div class="vx-col w-full md:w-1/2 mb-4">
                <label class="text-sm opacity-100 vs-input--label">Estado*</label>
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

            <div class="flex flex-wrap items-center justify-end">
                <vs-button @click="guardar" :disabled="!validateForm" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                <vs-button @click="cancelar" class="ml-4 mt-2" icon-pack="feather" icon="icon-x-circle" type="border" color="danger">Cancelar</vs-button>
            </div>
        </vs-popup>

        <modal-confirmacion :data="dataRemove" :modal.sync="popupModalConfirmacion" @updatePage="updateListPersona" @closeModal="popupModalConfirmacion=false" />

        <control-session :modal.sync="popupControlSession" @closeModal="closePopupControlSession"/>
        <control-autorizacion :modal.sync="popupControlAutorizacion" @closeModal="closePopupControlAutorizacion"/>

    </div>
</template>
<script>
import vSelect              from 'vue-select';

import ControlAutorizacion  from '../../components/ControlAutorizacion.vue';
import ControlSession       from '../../components/ControlSession.vue';
import ModalConfirmacion    from '../../components/ModalConfirmacion.vue';

export default {
    data(){
        return {
            itemsUnidadEjecutora    : [],
            itemsPerPage            : 10,
            isMounted               : false,

            popupCreate             : false,
            titleUnidadEjecutora    : 'Crear Unidad Ejecutora',
            readonlyCommon          : false,
            idUnidadEjecutora       : null,
            inputCodigo             : null,
            inputDescripcion        : null,
            selectedEstado          : { value: 1, label: 'Activo'},
            itemsEstado             : [ { value: 1, label: 'Activo'}, { value: 2, label: 'Bloqueado'} ],

            dataRemove              : {},
            popupModalConfirmacion    : false,

            backgroundLoading       :'primary',
            colorLoading            :'#fff',
            popupControlSession     : false,
            popupControlAutorizacion: false
        }
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },

        validateForm () {
            return !this.errors.any()
            && this.inputCodigo     !== null
            && this.inputDescripcion!== null 
            && this.selectedEstado  !== null;
        },
    },

    created(){},

    mounted(){
        this.isMounted = true;
        this.getAll();
    },

    methods: {
        
        nuevo(){
            this.errors.clear();
            this.$validator.reset();
            this.clearForm();
            this.titleUnidadEjecutora = 'Crear Unidad Ejecutora';
            this.popupCreate = true;
        },

        editar(tr){
            this.find(tr.codigo);
        },

        eliminar(tr){
            if(!tr.enabled){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'warning',
                    title: `Aviso`,
                    text: 'La Unidad Ejecutora ya está inactivo',
                    acceptText: 'Aceptar',
                });
                return;
            }

            this.dataRemove = {
                id: tr.codigo,
                method: 'config/disabled',
                title: `¿Esta seguro de bloquear a ${ tr.codigo + ' ' + tr.descripcion }?`,
                message: 'Unidad Ejecutora bloqueado de forma correcta.'
            },

            this.popupModalConfirmacion = true;
        },

        habilitar(tr){
            if(tr.enabled){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'warning',
                    title: `Aviso`,
                    text: 'La Unidad Ejecutora ya está habilitado',
                    acceptText: 'Aceptar',
                });
                return;
            }

            this.dataRemove = {
                id: tr.codigo,
                method: 'config/enabled',
                title: `¿Esta seguro de hablitar a ${ tr.codigo + ' ' + tr.descripcion }?`,
                message: 'Unidad Ejecutora habilitado de forma correcta.'
            },

            this.popupModalConfirmacion = true;
        },

        guardar(){
            const params = {
                codigo: this.inputCodigo.trim().toUpperCase(),
                descripcion: this.inputDescripcion.trim().toUpperCase(),
                enabled: this.selectedEstado.value === 1 ? true : false
            }
            if(this.idUnidadEjecutora === null){
                this.add(params);
            } else {
                const payload = {
                    id: this.idUnidadEjecutora,
                    data: {
                        codigo: this.inputCodigo.trim().toUpperCase(),
                        descripcion: this.inputDescripcion.trim().toUpperCase(),
                        enabled: this.selectedEstado.value === 1 ? true : false
                    }
                }
                this.update(payload);
            }
        },

        cancelar(){
            this.popupCreate = false;
        },

        changeValues(data){
            this.idUnidadEjecutora = data.codigo;
            this.readonlyCommon = true;
            this.inputCodigo = data.codigo;
            this.inputDescripcion = data.descripcion;
            this.selectedEstado = data.enabled ? { value: 1, label: 'Activo'} : { value: 2, label: 'Bloqueado', };
        },

        acceptDialog(){
            this.getAll();
        },

        updateListPersona(){
            this.popupModalConfirmacion = false;
            this.getAll();
        },

        add(values){
            this.$vs.loading();
            this.$store.dispatch('config/create', values)
            .then(response => {
                this.$vs.loading.close();
                this.popupCreate = false;
                this.itemsUnidadEjecutora.push(response);
                this.$vs.dialog({
                    color: 'success',
                    title: `Mensaje`,
                    text: 'Unidad Ejecutora o Entidad creado de forma correcta.',
                    acceptText: 'Ok',
                });
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.status, error.message);
            });
        },

        update(values){
            this.$vs.loading();
            this.$store.dispatch('config/update', values)
            .then( response => {
                this.$vs.loading.close();
                this.popupCreate = false;
                this.$vs.dialog({
                    color: 'success',
                    title: `Mensaje`,
                    text: `Unidad Ejecutora o Entidad ${ response.codigo } actualizado de forma correcta.`,
                    acceptText: 'Ok',
                    accept: this.acceptDialog
                });
            })
            .catch( error => {
                this.$vs.loading.close();
                this.showMessageError(error.status, error.message);
            });
        },

        find(value){
            this.$vs.loading();
            this.$store.dispatch('config/find', value)
            .then( response => {
                this.$vs.loading.close();
                this.titleUnidadEjecutora = 'Editar Unidad Ejecutora';
                this.changeValues(response);
                this.popupCreate = true;
            })
            .catch( error => {
                this.$vs.loading.close();
                this.showMessageError(error.status, error.message);
            });
        },

        getAll(){
            this.$vs.loading();
            this.$store.dispatch('config/fetchAll')
            .then(response => {
                this.$vs.loading.close();
                this.itemsUnidadEjecutora = response;
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.status, error.message);
			});
        },

        clearForm(){
            this.idUnidadEjecutora = null;
            this.inputCodigo = null;
            this.inputDescripcion = null;
            this.selectedEstado = null;
        },

        statusColor(status){
            return status ? "success" : "danger"
        },

        status(status){
            return status ? "Activo" : "Bloqueado"
        },

        showMessageAlert(message, type){
            this.$vs.notify({
                title: type === 'alert' ? 'Aviso' : 'Información',
                text: message,
                position: type === 'alert' ? 'top-center' : 'top-right',
                iconPack: 'feather',
                icon: type === 'alert' ? 'icon-alert-circle' : 'icon-check',
                color: type === 'alert' ? 'danger' : 'success'
            });
        },
        
        showMessageError(status, message){
            if(status === 401){
                this.popupControlSession = true;
                return;
            }

            if(status === 403){
                this.popupControlAutorizacion = true;
                return;
            }

            this.$vs.dialog({
                type: 'alert',
                color: 'warning',
                title: `Aviso`,
                text: message,
                acceptText: 'Aceptar',
            });
        },

        closePopupControlSession(){
            this.popupCreate = false,
            this.popupModalConfirmacion = false;

            this.popupControlSession = false;
            this.$store.dispatch("auth/logout")
            .then(response => {
                this.$vs.notify({
                    title: 'Información',
                    text: response.message,
                    position:'top-right',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    color: 'success'
                });
            });
        },

        closePopupControlAutorizacion(){
            this.popupControlAutorizacion = false;
        },

    },

    components: {
        ControlAutorizacion,
        ControlSession,
        ModalConfirmacion,

        vSelect
    },
}
</script>
<style lang="scss">
@import "@/views/style/tables.scss";
@import "@/views/style/actions.scss";
</style>