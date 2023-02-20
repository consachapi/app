<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">

                    <div class="vx-row no-gutter justify-center items-center">

                        <div class="vx-col hidden lg:block lg:w-1/2">
                            <img src="@/assets/images/pages/logo_oficial.png" width="450" alt="login" class="mx-auto">
                            <small class="float-right mr-8">Versión {{ titleVersion }}</small>
                        </div>

                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                            <div class="p-8 login-tabs-container">

                                <div class="vx-card__title mb-4">
                                    <h4 class="mb-4">Bienvenido</h4>
                                    <p>Inicie sesión con su cuenta.</p>
                                </div>

                                <div>
                                    <vs-input
                                        name="usuario"
                                        icon-no-border
                                        icon="icon icon-user"
                                        icon-pack="feather"
                                        label-placeholder="Usuario"
                                        v-model="usuario"
                                        class="w-full"/>

                                    <vs-input
                                        type="password"
                                        name="password"
                                        v-validate="'required|min:4|max:20'"
                                        icon-no-border
                                        icon="icon icon-lock"
                                        icon-pack="feather"
                                        label-placeholder="Password"
                                        v-model="password"
                                        v-on:keyup.enter="initSession"
                                        class="w-full mt-6" />
                                        
                                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                    <div class="flex flex-wrap justify-between my-5">
                                        <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Recordarme</vs-checkbox>
                                        <router-link to="">¿Perdiste tu contraseña?</router-link>
                                    </div>

                                    <vs-button class="float-right mb-6" :disabled="!validateForm" @click="initSession">Ingresar</vs-button>

                                    <vs-divider icon-pack="feather" icon="icon-star" position="center" color="primary"></vs-divider>

                                    <div class="social-login-buttons flex flex-wrap items-center mt-4">
                                        <p>
                                            <span>&copy;</span>
                                            <span>{{ new Date().getFullYear() }}, </span>
                                            <a href="https://www.gob.pe/regioncusco" target="_blank" rel="nofollow">Gobierno Regional de Cusco.</a>
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>

        <vs-popup title="Bienvenido" :active.sync="popupVerificacionEjecutora" button-close-hidden @close="closePopup" @click="true">
            <div class="flex flex-wrap items-center justify-center">
                <strong>{{ nombresUsuario }}</strong>
            </div>

            <div class="vx-row mt-2 mb-2">
                <div class="vx-col mb-4 w-full">
                    <label class="text-sm opacity-75">Seleccione Unidad Ejecutora:</label>
                    <v-select :options="itemsUnidadEjectora" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="selectedUnidadEjecutora" class="md:mb-0 mt-2"/>
                </div>
            </div>

            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="aceptar" class="ml-auto">Aceptar</vs-button>
                    <vs-button @click="cancelar" class="ml-4" type="border" color="primary">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
</template>

<script>
import { appName, appVersion } from '@/environment/env.js';
import vSelect from 'vue-select';

export default {
    components: {
        vSelect
    },

    data() {
        return {
            titleApp: appName,
            titleVersion: appVersion,
            usuario: "",
            password: "",
            checkbox_remember_me: false,

            dataAuth: null,

            popupVerificacionEjecutora: false,
            nombresUsuario: null,
            selectedUnidadEjecutora: null,
            itemsUnidadEjectora: [],
        }
    },

    computed: {
        validateForm(){
            return !this.errors.any() && this.usuario !== '' && this.password !== ''
        }
    },

    methods: {
        closePopup(value){
            if (!value) this.popupVerificacionEjecutora = true;
        },

        checkLogin(){
            if(this.$store.state.auth.isUserLoggedIn()){
                this.$vs.notify({
                    title: 'Inicio de sesión',
                    text: 'Ya tiene iniciada la sesión!',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
                return false;
            }
            return true;
        },

        initSession(){
            if(!this.checkLogin()) return;
            this.$vs.loading();
            const payload = {
                username: this.usuario,
                password: this.password
            };
            this.$store.dispatch("auth/login", payload)
            .then(response => {
                this.dataAuth = response.data;
                this.getRole();
            })
            .catch(err => {
                this.$vs.loading.close();
                this.$vs.dialog({
                    type: 'alert',
                    color: 'warning',
                    title: `Aviso`,
                    text: err.message,
                    acceptText: 'Aceptar',
                });
            });
        },

        getRole(){
            this.$store.dispatch("auth/fetchRole")
            .then(response => {
                this.itemsUnidadEjectora = [];
                const data = response.data;

                if(data.unidadEjecutorias.length === 0) {
                    this.setEjecValues();
                    this.$vs.loading.close();
                } else if(data.unidadEjecutorias.length === 1){
                    this.selectedUnidadEjecutora = { 
                        value: data.unidadEjecutorias[0].codigo, 
                        label: data.unidadEjecutorias[0].codigo + ' - ' + data.unidadEjecutorias[0].descripcion 
                    };
                    this.validateEjec();
                    this.setEjecValues();
                    this.$vs.loading.close();
                } else {
                    this.selectedUnidadEjecutora = { 
                        value: data.unidadEjecutorias[0].codigo, 
                        label: data.unidadEjecutorias[0].codigo + ' - ' + data.unidadEjecutorias[0].descripcion 
                    };
                    data.unidadEjecutorias.forEach(element => {
                        const item = {
                            value: element.codigo,
                            label: element.codigo + ' - ' + element.descripcion
                        }
                        this.itemsUnidadEjectora.push(item);
                    });
                    this.$vs.loading.close();
                    this.popupVerificacionEjecutora = true;
                }
            })
            .catch(err => {
                this.$vs.loading.close();
                this.$vs.dialog({
                    type: 'alert',
                    color: 'warning',
                    title: `Aviso`,
                    text: err.message,
                    acceptText: 'Aceptar',
                });
            });
        },

        aceptar() {
            this.validateEjec();
            this.popupVerificacionEjecutora = false;
            this.$vs.loading();
            setTimeout(() => {
                this.$vs.loading.close();
                this.setEjecValues();
            }, 1000);
        },

        cancelar(){
            this.$store.dispatch("auth/cancel");
            this.popupVerificacionEjecutora = false;
        },

        setEjecValues(){
            const payload = {
                dataAuth: this.dataAuth, 
                dataEjec: this.selectedUnidadEjecutora
            };
            this.$store.dispatch("auth/setTokenAndEjecStorage", payload);
        },

        validateEjec(){
            if(this.selectedUnidadEjecutora === null || this.selectedUnidadEjecutora === '' || this.selectedUnidadEjecutora === undefined){
                this.$vs.notify({
                    title: 'Aviso',
                    text: `Seleccione la Unidad Ejecutora o Entidad`,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
                return;
            }
        }

    }

}
</script>

<style lang="scss">
#page-login {
    .social-login-buttons {
        .bg-facebook { background-color: #1551b1 }
        .bg-twitter { background-color: #00aaff }
        .bg-google { background-color: #4285F4 }
        .bg-github { background-color: #333 }
    }
}
</style>
