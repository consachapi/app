<template>
    <div>
        <vx-card class="mt-base" no-shadow card-border id="data-asignacion-list-view">
            <div class="flex items-end mb-2">
                <feather-icon icon="UsersIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Usuarios Asistenciales</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsUsuarioAsistencial" pagination :max-items="itemsPerPage" search id="div-asignacion-with-loading" class="vs-con-loading__container">
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsUsuarioAsistencial.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsUsuarioAsistencial.length }} de {{ itemsUsuarioAsistencial.length }}</span>
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
                    <vs-th class="">USUARIO</vs-th>
                    <vs-th class="">NOMBRES</vs-th>
                    <vs-th class="">APELLIDOS</vs-th>
                    <vs-th class="">AREA/OFICINA</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].ndocumento">
                                <router-link :to="'/app/acceso/persona/detalle/'+data[indextr].ndocumento" @click.stop.prevent class="text-inherit hover:text-primary">
                                    <strong>{{ data[indextr].ndocumento }}</strong>
                                </router-link>
                            </vs-td>
                            <vs-td :data="data[indextr].nombres">
                                {{data[indextr].nombres}}
                            </vs-td>
                            <vs-td :data="data[indextr].apellidos">
                                {{data[indextr].apellidos}}
                            </vs-td>
                            <vs-td :data="data[indextr].area">
                                {{data[indextr].area}}
                            </vs-td>
                            <vs-td :data="data[indextr].active">
                                <vs-chip transparent :color="getOrderStatusColor(data[indextr].active)">
                                    <span class="font-medium truncate"> {{ data[indextr].active ? 'Activo' : 'Bloqueado' }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <servicio-asignacion :dataUser="tr"/>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsUsuarioAsistencial.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsUsuarioAsistencial.length }}</strong> de un total de <strong>{{ itemsUsuarioAsistencial.length }}</strong> registros
                </p>
            </div>

        </vx-card>
    </div>
</template>
<script>
import ServicioAsignacion from './components/ServicioAsignacion.vue';
export default {
    data(){
        return {
            itemsUsuarioAsistencial: [],
            itemsPerPage: 10,
            isMounted: false,


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
    },

    mounted () {
        this.isMounted = true;
        this.getUsersAsistencials();
    },


    methods: {

        getUsersAsistencials(){
            this.$vs.loading({
                container: '#div-asignacion-with-loading',
                scale: 0.7
            });
            this.$store.dispatch('acceso/fetchUsersAsist')
            .then(response => {
                this.$vs.loading.close('#div-asignacion-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.itemsUsuarioAsistencial = response.data;
                }
			})
			.catch(error => {
                this.$vs.loading.close('#div-asignacion-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
			});
        },

        getOrderStatusColor (status) {
            if (status) return 'success'
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
        ServicioAsignacion
    }

}
</script>
<style lang="scss">
#data-asignacion-list-view {
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

#modal-asignacion-servicio {
    .vs-popup {
        transition: all .2s;
        z-index: 100;
        width: 1000px;
        margin: 10px;
        max-width: calc(100% - 30px);
        max-height: calc(100% - 30px);
        border-radius: 6px;
    }
    .vs-popup--background{
        width: 40000px;
        height: 40000px;
    } 
}
</style>