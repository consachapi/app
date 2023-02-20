<template>
    <div>
        <vs-popup title="Confirmación" button-close-hidden @close="closePopup" :active.sync="modalLocal">
            <p>{{ data.title }}</p>

            <div class="mt-8">
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-button @click="eliminarRegistro" class="mb-2" icon-pack="feather" icon="icon-check" color="danger">Aceptar</vs-button>
                    <vs-button @click="closeModal" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-2">Cancelar</vs-button>
                </div>
            </div> 
        </vs-popup>

        <control-session :modal.sync="popupControlSession" @closeModal="closePopupControlSession"/>
        <control-autorizacion :modal.sync="popupControlAutorizacion" @closeModal="closePopupControlAutorizacion"/>
    </div>
</template>
<script>
import ControlSession from './ControlSession.vue';
import ControlAutorizacion from './ControlAutorizacion.vue';
export default {
    props: {
        data: { type: Object, required: true },
        modal: { type: Boolean, required: true, }
    },

    components: {
        ControlSession,
        ControlAutorizacion,
    },

    data(){
        return {
            backgroundLoading:'primary',
            colorLoading:'#fff',
            popupControlSession: false,
            popupControlAutorizacion: false
        }
    },

    computed: {
        modalLocal: {
            get: function() {
                return this.modal
            },
            set: function(value) {
  
            }
        }
    },

    methods: {
        eliminarRegistro(){
            this.$vs.loading({
                scale: 0.7,
            });
            //console.log(this.data.method);
            this.$store.dispatch(this.data.method, this.data.id)
            .then(response => {
                this.$vs.loading.close();
                this.modalLocal = false;
                this.$emit('updatePage');
                this.showMessageAlert(this.data.message, '');
            })
            .catch(error => {
                this.$vs.loading.close()
                this.showMessageError(error.status, 'success');
            });
        },

        closeModal(){
            this.modalLocal = false;
            this.$emit('closeModal');
        },

        closePopup(value){
            if (!value) this.modalLocal = true;
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

    }
}
</script>