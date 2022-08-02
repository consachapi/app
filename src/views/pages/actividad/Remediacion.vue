<template>
    <div id="data-medio-verificacion-remediacion-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="BellIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Medios de Verificación</span>
            </div>

            <vs-divider/>
           
            <vs-table stripe ref="table" :data="itemsVerificacionRemediacion" pagination :max-items="itemsPerPage" search>
                
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsVerificacionRemediacion.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsVerificacionRemediacion.length }} de {{ itemsVerificacionRemediacion.length }}</span>
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
                    <vs-th class="">MEDIOS DE VERIFICACION</vs-th>
                    <vs-th class="">ORGANO RESPONSABLE</vs-th>
                    <vs-th class="">DESDE</vs-th>
                    <vs-th class="">HASTA</vs-th>
                    <vs-th class="">MEDIDAD DE REMEDIACION</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].medioVerificacion">
                                {{data[indextr].medioVerificacion}}
                            </vs-td>
                            <vs-td :data="data[indextr].oficinas">
                                {{ data[indextr].oficinas.map(e=>e.abreviatura).join(', ') }}
                            </vs-td>
                            <vs-td :data="data[indextr].inicio">
                                {{ data[indextr].inicio }}
                            </vs-td>
                            <vs-td :data="data[indextr].fin">
                                {{ data[indextr].fin }}
                            </vs-td>
                            <vs-td :data="data[indextr].medidasRemediacion">
                                {{ data[indextr].medidasRemediacion.remediacion }}
                            </vs-td>
                            <vs-td :data="data[indextr].estado">
                                <vs-chip transparent :color="statusColor(data[indextr].estado)">
                                    <span class="font-medium truncate"> {{ data[indextr].estado }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <div @click="verActividades(tr)" class="btn-add-new p-2 mb-2 mt-2 cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                                    <feather-icon icon="ClipboardIcon" svgClasses="h-5 w-5" />
                                    <span class="ml-2 text-base text-primary">Registrar</span>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsVerificacionRemediacion.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsVerificacionRemediacion.length }}</strong> de un total de <strong>{{ itemsVerificacionRemediacion.length }}</strong> registros
                </p>
            </div>

        </vx-card>

    </div>
</template>
<script>3
import vSelect from 'vue-select';
export default {
    data(){
        return {
            itemsVerificacionRemediacion: [],
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

    mounted () {
        this.isMounted = true;

        this.getMediosVerficacion();
    },

    methods: {
        getMediosVerficacion(){
            this.$vs.loading();
            this.$store.dispatch('remediacion/fecthMedioVerficacionByUsuario')
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsVerificacionRemediacion = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        verActividades(tr){
            this.$router.push({
				name: 'app-medidas-cremediacion-mremediacion-actividad',
                params: { id: tr.id}
			}).catch(() => {});
        },

        statusColor(status) {
            if (status === 'PENDIENTE') return 'primary'
            if (status === 'EN_PROCESO') return 'warning'
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
#data-medio-verificacion-remediacion-view {
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