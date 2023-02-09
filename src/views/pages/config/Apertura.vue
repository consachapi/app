<template>
    <div id="table-apertura-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="KeyIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Año de Ejecución de Medidas de Control</span>
            </div>

            <vs-divider />

            <vs-table stripe ref="table" :data="itemsApertura" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="newApertura" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsApertura.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsApertura.length }} de {{ itemsApertura.length }}</span>
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
                    <vs-th>Periodo</vs-th>
                    <vs-th>Ejecutora</vs-th>
                    <vs-th>PIA</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsApertura.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsApertura.length }}</strong> de un total de <strong>{{ itemsApertura.length }}</strong> registros
                </p>
            </div>

        </vx-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            itemsApertura: [],
            itemsPerPage: 10,
            isMounted: false,
        }
    },

    computed: {
        currentPage() {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },

        validateForm(){},
    },

    created(){

    },

    mounted(){
        this.isMounted = true;
    },

    methods: {
        newApertura(){}
    }

}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/_variables.scss";
#table-apertura-view {
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