<template>
    <div>
        <vs-popup title="Advertencia" button-close-hidden @close="closePopup" :active.sync="modalLocal" background-color-popup="#e8f2ff">
            <div class="flex flex-wrap items-center justify-center">
                <strong class="text-danger text-sm">LA SESIÓN HA EXPIRADO</strong>
            </div>
            <div class="flex flex-wrap items-center justify-center">
                <p class="text-sm text-danger opacity-100">Vuelve a iniciar.</p>
            </div>
            <vs-divider border-style="dotted" color="primary" />
            <div class="vx-col w-full mt-6">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="closeModal" color="danger" icon-pack="feather" icon="icon-thumbs-up" class="mb-2">Aceptar</vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</template>
<script>
export default {
    name: 'control-session',

    props: {
        modal: { type: Boolean, required: false }
    },

    computed: {
        modalLocal: {
            get: function() {
                return this.modal
            },
            set: function(value) {
                //this.$emit('listchange', value)
            }
        },

    },

    methods: {
        closeModal(){
            this.modalLocal = false;
            this.$emit('closeModal');
        },

        closePopup(value){
            if (!value) this.modalLocal = true;
        },

    }
}
</script>