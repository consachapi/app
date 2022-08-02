<template>
    <div>
        <vx-card class="mb-base" no-shadow card-border>

            <div class="flex items-end mb-2">
                <feather-icon icon="CpuIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">{{ titleMedioVerificacion }}</span>
            </div>

            <vs-divider/>

            <div class="vx-row">
                <div class="vx-col w-full md:w-3/4">
                    <span class="text-primary flex items-start justify-start mb-4">
                        <small><span class="text-sm">{{ medioVerificacionDetalle }}</span></small>
                    </span>
                    <div class="flex mb-4">
                        <vs-chip transparent color="success">
                            <p class="text-sm opacity-75 font-bold" style="text-align: left;">Fecha de inicio: <span class="font-medium text-sm leading-none">{{ fechaInicio }}</span></p>
                        </vs-chip>
                        <vs-chip transparent color="success" class="ml-base">
                            <p class="text-sm opacity-75 font-bold" style="text-align: left;">Fecha de término: <span class="font-medium text-sm leading-none">{{ fechaTermino }}</span></p>
                        </vs-chip>
                    </div>
                </div>
                <div class="vx-col w-full md:w-1/4">
                    <div class="flex flex-wrap items-center justify-end mb-4">
                        <vs-button @click="regresar" icon-pack="feather" color="danger" icon="icon-rotate-ccw"  class="mt-2">Regresar</vs-button>
                    </div>
                </div>
            </div>
 
        </vx-card>

        <div class="vx-row">

            <div class="vx-col w-full md:w-1/3">
                <vx-card class="mb-base" no-shadow card-border>
                    <div class="flex items-end mb-2">
                        <feather-icon icon="ActivityIcon" class="mr-2" svgClasses="w-5 h-5" />
                        <span class="leading-none font-medium">Actividades</span>
                    </div>

                    <vs-divider/>

                    <lista-actividades :data="timelineData" @showActividad="showDocumentos" />
                </vx-card>
            </div>

            <div class="vx-col w-full md:w-2/3 data-list-container" id="data-documents-list-view">
                <vx-card class="mb-base" no-shadow card-border>
                    <div class="flex items-end mb-2">
                        <feather-icon icon="FolderIcon" class="mr-2" svgClasses="w-5 h-5" />
                        <span class="leading-none font-medium">{{ titleActividad }}</span>
                    </div>

                    <vs-divider/>

                    <vs-table ref="table" v-model="selected" :data="itemsTareas" pagination :max-items="itemsPerPage" search>
                        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">    
                            <div v-if="!isCompletado" class="flex flex-wrap-reverse items-center data-list-btn-container">
                                <div @click="addDocumento" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                                    <feather-icon icon="UploadIcon" svgClasses="h-4 w-4" />
                                    <span class="ml-2 text-base text-primary">Agregar</span>
                                </div>
                            </div>

                            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsTareas.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsTareas.length }} de {{ itemsTareas.length }}</span>
                                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                </div>
                                <vs-dropdown-menu>

                                    <vs-dropdown-item @click="itemsPerPage=5">
                                    <span>5</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPage=10">
                                    <span>10</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPage=15">
                                    <span>15</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="itemsPerPage=20">
                                    <span>20</span>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>

                        </div>

                        <template slot="thead">
                            <vs-th class="">NOMBRE DEL DOCUMENTO</vs-th>
                            <vs-th class="">ULTIMA MODIFICACION</vs-th>
                            <vs-th class="">ORGANO RESPONSABLE</vs-th>
                            <vs-th class="">PERSONA RESPONSABLE</vs-th>
                            <vs-th class="">ACCIONES</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <tbody>
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                                    <vs-td :data="data[indextr].nombreAchivo">
                                        {{data[indextr].nombreAchivo}}
                                    </vs-td>
                                    <vs-td :data="data[indextr].fechaRegistro">
                                        {{data[indextr].fechaRegistro}}
                                    </vs-td>
                                    <vs-td :data="data[indextr].responsable">
                                        {{data[indextr].responsable.area.descripcion}}
                                    </vs-td>
                                    <vs-td :data="data[indextr].responsable">
                                        {{ data[indextr].responsable.nombres + ' ' + data[indextr].responsable.apellidos }}
                                    </vs-td>
                                    <vs-td class="whitespace-no-wrap">
                                        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mt-4 mr-4 items-per-page-handler">
                                            <feather-icon icon="MoreVerticalIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" />
                                            <vs-dropdown-menu>
                                                <vs-dropdown-item @click="openPopupVerDocumento(tr)">
                                                    <span class="flex items-center">
                                                        <feather-icon icon="EyeIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                        <span>Ver</span>
                                                    </span>
                                                </vs-dropdown-item>

                                                <vs-dropdown-item>
                                                    <span class="flex items-center">
                                                        <feather-icon icon="InfoIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                        <span>Info</span>
                                                    </span>
                                                </vs-dropdown-item>

                                                <vs-dropdown-item>
                                                    <span class="flex items-center">
                                                        <feather-icon icon="EditIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                        <span>Renombrar</span>
                                                    </span>
                                                </vs-dropdown-item>

                                                <vs-dropdown-item divider @click="eliminar(tr)">
                                                    <span class="flex items-center">
                                                        <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                        <span>Eliminar</span>
                                                    </span>
                                                </vs-dropdown-item>
                                            </vs-dropdown-menu>
                                        </vs-dropdown>
                                    </vs-td>
                                </vs-tr>
                            </tbody>
                        </template>

                    </vs-table>

                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <p class="truncate text-sm">
                            Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsTareas.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsTareas.length }}</strong> de un total de <strong>{{ itemsTareas.length }}</strong> registros
                        </p>
                    </div>

                    <div v-if="!isCompletado" class="flex flex-wrap items-center justify-start mb-4">
                        <vs-button @click="finalizar" icon-pack="feather" color="success" icon="icon-check"  class="mt-2">Finalizar {{ titleButton }}</vs-button>
                    </div>

                </vx-card>
            </div>
        </div>

        <vs-popup title="Subir documento" :active.sync="popupSubirArchivo">
            <vx-card class="mb-base" no-shadow card-border>
                <vs-upload 
                    text="Agregar documento" 
                    fileName='file' 
                    :action="upload"
                    :headers="headers"
                    @on-success="successUpload"
                    @on-error="errorUpload"
                    accept=".pdf"
                />
            </vx-card>
            <vs-divider/>
            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <vs-button @click="popupSubirArchivo=false" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-4 mr-4">Cancelar</vs-button>
            </div>
        </vs-popup>

        <vs-popup title="Documento" :active.sync="popupVerDocumento">
            <div style="border-radius:5px; border:1px solid #d5dbe0" class="mb-6">
                <embed :src="pdf" frameborder="0" width="100%" height="500px" type="application/pdf">
            </div>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <vs-button @click="popupVerDocumento=false" icon-pack="feather" icon="icon-check" color="primary" class="mb-2">Aceptar</vs-button>
            </div>
        </vs-popup>

        <vs-popup title="Confirmar" :active.sync="popupEliminar">
            <p>¿Esta seguro de eliminar el registro?</p>
            <div class="mt-8">
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-button @click="eliminarDocumento" icon-pack="feather" icon="icon-check" color="danger" class="mb-2">Aceptar</vs-button>
                    <vs-button @click="popupEliminar=false" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-2">Cancelar</vs-button>
                </div>
            </div> 
        </vs-popup>

    </div>
</template>
<script>
import ListaActividades from './components/ListaActividades.vue';
import { apiUrl } from '@/constants/config';
export default {
    components: {
        ListaActividades
    },

    data(){
        return {
            titleMedioVerificacion: 'Medio de Verificación',
            medioVerificacionId: null,
            medidaRemediacion: null,
            medioVerificacionDetalle: null,
            fechaInicio: null,
            fechaTermino: null,


            timelineData: [],

            itemsTareas: [],
            itemsPerPage: 10,
            isMounted: false,

            titleActividad: 'Documentos',
            titleButton: 'Actividad',
            actividadRemediacionId: null,
            isCompletado: false,

            selected: [],
            popupSubirArchivo: false,
            popupVerDocumento: false,
            popupEliminar: false,

            upload: apiUrl + '/documento/remediacion/upload',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },

            pdf: null,
            idDocumentoRemediacion: null,
        }
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },
    },

    created(){
        this.parametro = this.$route.params.id;
        this.getMedioVerificacion(this.parametro);
        this.getActividadesRemediacion(this.parametro);
    },

    mounted () {
        this.isMounted = true;
    },

    methods: {
        getMedioVerificacion(value){
            this.$vs.loading();
            this.$store.dispatch('remediacion/findMedioVerificacionById', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.medioVerificacionId = data.id;
                    this.medidaRemediacion = data.medidasRemediacion.remediacion;
                    this.medioVerificacionDetalle = data.medioVerificacion;
                    this.fechaInicio = data.inicio;
                    this.fechaTermino = data.fin;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getActividadesRemediacion(value){
            const colors = ['primary', 'warning', 'danger', 'success', 'dark'];
            const icons = ['PlusIcon', 'MailIcon', 'UsersIcon', 'LayoutIcon', 'TvIcon'];

            this.$vs.loading();
            this.$store.dispatch('remediacion/fetchActividadMedioVerificacion', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.timelineData = [];
                    const data = response.data;
                    let k = 0;
                    data.forEach((element, index) => {
                        k = k === 5 ? 0 : k;
                        const item = {
                            id: element.id,
                            color: colors[k],
                            icon: icons[k],
                            title: 'Actividad ' + (index + 1),
                            desc: element.actividad,
                            time: element.fecha,
                            estado: element.estado
                        };
                        this.timelineData.push(item);
                        k++;
                    });
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        regresar(){
            this.$router.push({
				name: 'app-medidas-cremediacion-mcontrol'
			}).catch(() => {});
        },

        showDocumentos(item){
            this.actividadRemediacionId = item.id;
            this.titleActividad = item.desc;
            this.titleButton = item.title;
            this.isCompletado = item.estado === 'COMPLETADO' ? true : false;
            this.getDocumentosRemediacion(item.id);
        },

        finalizar(){
            if(this.actividadRemediacionId === null){
                this.showMessageAlert('Seleccione la actividad.');
                return;
            }

            if(this.itemsTareas.length === 0){
                this.showMessageAlert('Al menos debe tener algun documento.');
                return;
            }

            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: '¿Esta seguro de finalizar la actividad?',
                acceptText: 'Si',
                cancelText: 'No',
                accept: this.completar
            });
        },

        completar(){
            this.$vs.loading();
            this.$store.dispatch('remediacion/finalizeActividadRemediacion', this.actividadRemediacionId)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.showMessageSuccess('Actividad finalizada de forma correcta.');
                    this.getActividadesRemediacion(this.medioVerificacionId);
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        addDocumento(){
            if(this.actividadRemediacionId === null){
                this.showMessageAlert('Seleccione la actividad.');
                return;
            }

            if(this.isCompletado){
                this.showMessageAlert('La actividad ya esta completado o finalizado.');
                return;
            } 

            this.popupSubirArchivo = true;
            this.upload = this.upload + '/' + this.actividadRemediacionId;
        },

        getDocumentosRemediacion(value){
            this.$vs.loading();
            this.$store.dispatch('ractividad/fetchDocumentosRemediacionByActividadRemediacion', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsTareas = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        eliminar(tr){
            this.idDocumentoRemediacion = tr.id;
            this.popupEliminar = true;
        },

        eliminarDocumento(){
            if(this.idDocumentoRemediacion === null){
                this.showMessageAlert('Seleccione el documento para eliminar.');
                return;
            }
            this.$vs.loading();
            this.$store.dispatch('ractividad/deleteDocumentoRemediacion', this.idDocumentoRemediacion)
            .then(response => {
                this.$vs.loading.close();
                this.showMessageSuccess('Se eliminó de forma correcta.');
                this.popupEliminar = false;
                this.idDocumentoRemediacion = null;
                this.getDocumentosRemediacion(this.actividadRemediacionId);
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        successUpload(event){
            this.showMessageSuccess('Se agregó el documento de forma correcta.');
            this.popupSubirArchivo = false;
            this.getDocumentosRemediacion(this.actividadRemediacionId);
        },

        errorUpload(event){
            const resp = JSON.parse(event.currentTarget.response);
            this.showMessageError(resp.status, resp.message);
        },

        openPopupVerDocumento(tr){
            this.$vs.loading();
            this.$store.dispatch('ractividad/showDocumentoRemediacion', tr.archivo)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    var byteCharacters = atob(data);
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    var byteArray = new Uint8Array(byteNumbers);
                    var blob = new Blob([byteArray], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(blob);
                    this.pdf = fileURL;
                    
                    this.popupVerDocumento  = true;
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
    }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/_variables.scss";
#data-documents-list-view {
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

    .product-name {
        max-width: 23rem;
    }

    .vs-table--header {
        display: flex;
        flex-wrap: wrap;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
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
        border-collapse: separate;
        border-spacing: 0 1.3rem;
        padding: 0 1rem;

        tr{
            box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
            td{
                padding: 20px;
                &:first-child{
                border-top-left-radius: .5rem;
                border-bottom-left-radius: .5rem;
                }
                &:last-child{
                border-top-right-radius: .5rem;
                border-bottom-right-radius: .5rem;
                }
            }
            td.td-check{
               padding: 20px !important;
            }
        }
    }

    .vs-table--thead{
        th {
            padding-top: 0;
            padding-bottom: 0;

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
#data-verificacion-tareas-view {
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
</style>