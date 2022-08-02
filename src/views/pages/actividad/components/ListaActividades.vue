<template>
    <ul class="vx-timeline">
        <li v-for="item in data" :key="item.title">
            <div @click="show(item)" class="timeline-icon cursor-pointer" :class="`bg-${item.color}`">
                <feather-icon :icon="item.icon" svgClasses="text-white stroke-current w-5 h-5" />
            </div>
            <div class="timeline-info">
                <p class="font-semibold">{{ item.title }}</p>
                <span class="activity-desc">{{ item.desc }}</span>
            </div>
            <p class="font-semibold"><small class="text-grey activity-e-time">{{ item.time }}</small></p>
            <div class="flex justify-between items-center">
                <div v-bind:class="[ statusColor(item.estado) , statusColorBorder(item.estado) , 'border border-solid flex py-1 px-4 rounded']">
                    <span class="text-sm mr-1">{{ item.estado }}</span>
                </div>
            </div>

        </li>
    </ul>
</template>

<script>
export default {
    name: "lista-actividades",
    props: {
        data: {
            type: Array,
            required: true
        }
    },

    methods: {
        show(item){
            this.$emit('showActividad', item);
        },

        statusColor(status) {
            if (status === 'PENDIENTE') return 'text-primary'
            if (status === 'ANULADO') return 'text-danger'
            if (status === 'COMPLETADO') return 'text-success'
            return 'text-warning'
        },

        statusColorBorder(status) {
            if (status === 'PENDIENTE') return 'border-primary'
            if (status === 'ANULADO') return 'border-danger'
            if (status === 'COMPLETADO') return 'border-success'
            return 'border-warning'
        },
    }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>
