<template>
    <div>
        <div @click="openPopupAsignacionServicio" class="btn-add-new p-2 mb-2 mt-2 cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
			<feather-icon icon="EditIcon" svgClasses="h-4 w-4" />
			<span class="ml-2 text-base text-primary">Asignar</span>
		</div>

        <vs-popup v-if="dataUser" title="Asignación de Servicio" :active.sync="popupAsignacionServicio">
            <ag-grid-vue
                ref="agGridTable"
                :gridOptions="gridOptions"
                class="ag-theme-material w-100 my-4 ag-grid-table"
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                :rowData="itemsServicio"
                rowSelection="multiple"
                :suppressRowClickSelection="true"
                colResizeDefault="shift"
                :animateRows="true"
                :floatingFilter="true"
                :pagination="true"
                :isRowSelectable="isRowSelectable"
                :suppressPaginationPanel="true"
                :enableRtl="$vs.rtl">
            </ag-grid-vue>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-start">
                <div class="mb-4 rounded-lg flex items-center justify-center text-lg font-medium text-base">
                    <p class="truncate text-sm">
                        Mostrando registro del <strong>{{ currentPage * paginationPageSize - (paginationPageSize - 1) }}</strong> al <strong>{{ itemsServicio.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : itemsServicio.length }}</strong> de un total de <strong>{{ itemsServicio.length }}</strong> registros
                    </p>
				</div>
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-pagination
                    :total="totalPages"
                    :max="10"
                    v-model="currentPage" />
				</div>
            </div>

            <vs-divider/>

            <div class="vx-row">
				<div class="vx-col w-full">
					<div class="mt-2 flex flex-wrap items-center justify-end">
						<vs-button @click="guardar" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                        <vs-button @click="popupAsignacionServicio=false" class="ml-4 mt-2" icon-pack="feather" icon="icon-x-circle" type="border" color="danger">Cancelar</vs-button>
					</div>
				</div>
			</div>

        </vs-popup>
    </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
export default {
    props: {
        dataUser: {
            type: Object,
            required: false,
        }
    },

    data(){
        return {
            popupAsignacionServicio: false,
            ndocumento: null,

            itemsServicio: [],

            gridApi: null,
            gridOptions: {},
            defaultColDef: {
                sortable: true,
                resizable: true,
                suppressMenu: true
            },
            isRowSelectable: null,
            columnDefs: [
                {
                    headerName: 'Código',
                    field: 'codigo',
                    width: 150,
                    filter: true,
                    checkboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    headerCheckboxSelection: true,
                }, {
                    headerName: 'Servicio',
                    field: 'descripcion',
                    tooltipField: 'descripcion',
                    filter: true,
                    width: 250,
                },
                {
                    headerName: 'Area',
                    field: 'area',
                    filter: true,
                    width: 150
                },
            ],
        }
    },

    computed: {
        paginationPageSize () {
            if (this.gridApi) return this.gridApi.paginationGetPageSize()
            else return 10
        },

        totalPages () {
            if (this.gridApi) return this.gridApi.paginationGetTotalPages()
            else return 0
        },

        currentPage: {
            get () {
                if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
                else return 1
            },
            set (val) {
                this.gridApi.paginationGoToPage(val - 1)
            }
        }
    },

    mounted(){
        this.gridApi = this.gridOptions.api;
        if (this.$vs.rtl) {
            const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
            header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
        }
    },

    beforeMount(){
        this.isRowSelectable = (rowNode) => {
            rowNode.setSelected(rowNode.data.asignado);
            return true;
        };
        
    },

    methods: {
        openPopupAsignacionServicio(){
            if(!this.dataUser.active){
                this.showMessageAlert('El usuario estpa bloqueado.');
                return;
            }
            this.ndocumento = this.dataUser.ndocumento;
            this.getServicioAsignado();
        },

        getServicioAsignado(){
            this.$vs.loading();
            this.$store.dispatch('acceso/fetchAsignacionServicioByPersona', this.ndocumento)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsServicio = response.data;
                    this.popupAsignacionServicio = true;
                }
			})
			.catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        guardar(){
            const asignados = [];
            this.gridApi.forEachNode((node) => {
                if(node.isSelected()){
                    asignados.push(node.data);
                }
            });
            if(asignados.length === 0){
                this.showMessageAlert("Seleccione al menos un servicio.");
                return;
            }
            
            const payload = {
                ndocumento: this.ndocumento,
                asignados: asignados
            }
            this.$vs.loading();
            this.$store.dispatch('acceso/asignacionServicioByPersona', payload)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 201){
                    this.showMessageSuccess('Se asignó de forma correcta.');
                    this.popupAsignacionServicio = false;
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
    },

    components: {
        AgGridVue
    }
}
</script>