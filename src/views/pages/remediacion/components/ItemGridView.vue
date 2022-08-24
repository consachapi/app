<template>
    <vx-card class="grid-view-item mb-base overflow-hidden" v-on="$listeners">
        <template slot="no-body">
            <div class="item-img-container bg-white h-32 flex justify-center items-center mb-4 mt-4 cursor-pointer" @click="navigate_to_detail_view">
                <small class="grid-view-img px-4 text-primary">{{ item.medioVerificacion }}</small>
            </div>
            <div class="item-details px-4">
                <div class="flex justify-between items-center cursor-pointer" @click="cambiar(item)">
                    <div v-bind:class="[ statusColor(item.estado), statusColorBorder(item.estado), 'border border-solid flex py-1 px-2 rounded']">
                        <span v-bind:class="[ statusColor(item.estado) , 'text-sm mr-1']">{{ item.estado }}</span>
                        <feather-icon v-if="item.estado==='COMPLETADO'" icon="CheckCircleIcon" svgClasses="h-4 w-4" />
                        <feather-icon v-if="item.estado!=='COMPLETADO'" icon="CalendarIcon" svgClasses="h-4 w-4" />
                    </div>
                </div>

                <div class="my-4">
                    <h6 v-if="item.oficinas.length===0" class="truncate font-semibold mb-1 text-danger cursor-pointer">{{ "Sin responsable" }}</h6>
                    <h6 v-if="item.oficinas.length > 0" class="truncate font-semibold mb-1 hover:text-primary cursor-pointer">{{ item.oficinas.map(e=>e.abreviatura).join(', ') }}</h6>
                    <div class="flex justify-between items-center">
                    <p class="item-description truncate text-grey text-sm">{{ item.inicio }}</p>
                    <p class="item-description truncate text-grey text-sm">{{ item.fin }}</p>
                    </div>
                </div>

            </div>
            <slot name="action-buttons" />
        </template>
    </vx-card>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },

    data(){
        return {

        }
    },

    methods: {
        cambiar(item){
            this.cambiarEstado(item.id);
        },

        cambiarEstado(value){
            this.$vs.loading();
            this.$store.dispatch('remediacion/cambiarEstadoMedidaRemediacion', value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.showMessageSuccess('Se guardó de forma correcta');
                    this.$emit('actualizar-rverificacion')
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        navigate_to_detail_view () {
            this.$emit('editar-rverificacion', this.item.id);
        },

        statusColor(status) {
            if (status === 'PENDIENTE') return 'text-danger'
            if (status === 'EN_PROCESO') return 'text-warning'
            if (status === 'COMPLETADO') return 'text-success'
            return 'text-primary'
        },

        statusColorBorder(status) {
            if (status === 'PENDIENTE') return 'border-danger'
            if (status === 'EN_PROCESO') return 'border-warning'
            if (status === 'COMPLETADO') return 'border-success'
            return 'border-primary'
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
    }
}
</script>
<style lang="scss" scoped>
.grid-view-item {
    //background-color: #edebeb;
    .grid-view-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        transition: .35s;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 4px 25px 0px rgba(0,0,0,.25);

        .grid-view-img{
            opacity: 0.9;
        }
    }
}
</style>