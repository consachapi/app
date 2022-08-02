<template>
    <vx-card class="grid-view-item mb-base overflow-hidden" v-on="$listeners">
        <template slot="no-body">
            <div class="item-img-container bg-white h-32 flex justify-center items-center mb-4 mt-4 cursor-pointer" @click="navigate_to_detail_view">
                <small class="grid-view-img px-4 text-primary">{{ item.medioVerificacion }}</small>
            </div>
            <div class="item-details px-4">
                <div class="flex justify-between items-center">
                    <div v-bind:class="[ statusColor(item.estado), statusColorBorder(item.estado), 'border border-solid flex py-1 px-2 rounded']">
                        <span v-bind:class="[ statusColor(item.estado) , 'text-sm mr-1']">{{ item.estado }}</span>
                        <feather-icon icon="CheckCircleIcon" svgClasses="h-4 w-4" />
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
        navigate_to_detail_view () {
            this.$emit('editar-cverificacion', this.item.id);
        },

        statusColor(status) {
            if (status === 'PENDIENTE') return 'text-primary'
            if (status === 'EN_PROCESO') return 'text-warning'
            if (status === 'COMPLETADO') return 'text-success'
            return 'text-danger'
        },

        statusColorBorder(status) {
            if (status === 'PENDIENTE') return 'border-primary'
            if (status === 'EN_PROCESO') return 'border-warning'
            if (status === 'COMPLETADO') return 'border-success'
            return 'border-danger'
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