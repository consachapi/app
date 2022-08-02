<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>{{ this.data.data === null ? "Agregar" : "Actualizar" }} medio de verif.</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>

        <vs-divider class="mb-0"></vs-divider>

        <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

            <div class="p-6">
                <label class="text-sm opacity-75">Describe el medio de verificación</label>
                <vs-textarea class="w-full" v-model="inputVerificacion" name="verificacion" v-validate="'required'" />
                <span class="text-danger text-sm" v-show="errors.has('verificacion')">{{ errors.first('verificacion') }}</span>

                <div class="mb-4">
                    <label class="text-sm opacity-75">Fecha de Inicio</label>
                    <datepicker :disabledDates="disabledDatesInicio" :language="es" v-model="inputFechaInicio" format="dd/MM/yyyy" v-validate="'required'" name="inicio"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('inicio')">{{ errors.first('inicio') }}</span>
                </div>
                
                <div class="mb-4">
                    <label class="text-sm opacity-75">Fecha de Término</label>
                    <datepicker :disabledDates="disabledDatesFin" :language="es" v-model="inputFechaFin" format="dd/MM/yyyy" v-validate="'required'" name="fin"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('fin')">{{ errors.first('fin') }}</span>
                </div>

            </div>
        </component>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid" icon-pack="feather" color="primary" icon="icon-save">Guardar</vs-button>
            <vs-button @click="cancel" icon-pack="feather" color="danger" type="border" icon="icon-x-circle">Cancelar</vs-button>
        </div>

    </vs-sidebar>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/src/locale';
export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {}
        },
    },

    components: {
        VuePerfectScrollbar,
        Datepicker
    },

    data () {
        return {
            es: es,

            dataId: null,
            dataName: '',
            dataCategory: null,
            dataImg: null,
            dataOrder_status: 'pending',
            dataPrice: 0,

            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: .60
            },
            medidaControlId: null,
            inputVerificacion: null,
            inputFechaInicio: null,
            inputFechaFin: null,

            disabledDatesInicio: {
                to: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
                from: new Date(new Date().getFullYear(), new Date().getMonth() + 8, new Date().getDate()),
            },
            disabledDatesFin: {},

        }
    },

    computed: {
        isSidebarActiveLocal: {
            get () {
                return this.isSidebarActive
            },
            set (val) {
                if (!val) {
                    this.$emit('closeSidebar');
                }
            }
        },
        isFormValid () {
            return !this.errors.any() && this.inputVerificacion && this.inputFechaInicio && this.inputFechaFin;
        },
        scrollbarTag () { return this.$store.getters.scrollbarTag }
    },

    watch: {
        isSidebarActive (val) {
            if (!val) return
            this.medidaControlId = this.data.id;
            if (Object.entries(this.data).length === 0) {
                this.initValues();
                this.$validator.reset();
            } else {
                const { category, id, img, name, order_status, price } = JSON.parse(JSON.stringify(this.data))
                this.dataId = id
                this.dataCategory = category
                this.dataImg = img
                this.dataName = name
                this.dataOrder_status = order_status
                this.dataPrice = price
                this.initValues();
            }
            
        },

        inputFechaInicio(value){

            if(value !== null){
                this.disabledDatesFin = {
                    to: new Date(value.getFullYear(), value.getMonth(), value.getDate()),
                    from: new Date(value.getFullYear(), value.getMonth() + 7, value.getDate()),
                };
            }
        }
    },

    methods: {
        initValues () {
            if (this.data.id) return
            this.dataId = null
            this.dataName = ''
            this.dataCategory = null
            this.dataOrder_status = 'pending'
            this.dataPrice = 0
            this.dataImg = null
        },

        submitData () {
            let dayInicio = `${(this.inputFechaInicio.getDate())}`.padStart(2,'0');
            let monthInicio = `${(this.inputFechaInicio.getMonth()+1)}`.padStart(2,'0');
            let yearInicio = this.inputFechaInicio.getFullYear();

            let dayFin = `${(this.inputFechaFin.getDate())}`.padStart(2,'0');
            let monthFin = `${(this.inputFechaFin.getMonth()+1)}`.padStart(2,'0');
            let yearFin = this.inputFechaFin.getFullYear();

            const paramsData = {
                medioVerificacion: this.inputVerificacion.trim().toUpperCase(),
                medidasControl: this.medidaControlId,
                inicio: `${dayInicio}/${monthInicio}/${yearInicio}`,
                fin: `${dayFin}/${monthFin}/${yearFin}`,
                estado: 1
            }

            this.$validator.validateAll()
            .then(result => {
                if (result) {
                    this.$vs.loading();
                    this.$store.dispatch('control/saveMedioVerificacion', paramsData)
                    .then(response => {
                        this.$vs.loading.close();
                        if(response.status === 201){
                            this.showMessageSuccess('Se guardó de forma correcta');
                            this.clearForm();
                            this.$emit('closeSidebar')
                        }
                    })
                    .catch(error => {
                        this.$vs.loading.close();
                        this.showMessageError(error.response.status, error.response.data.message);
                    });
                }
            });
        },

        cancel(){
            this.clearForm();
            this.isSidebarActiveLocal = false;
        },

        clearForm(){
            this.inputVerificacion = null;
            this.inputFechaInicio = null;
            this.inputFechaFin = null;
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
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
      overflow-y: auto;
    }
}
</style>