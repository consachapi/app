<template>
    <vx-card no-shadow card-border id="div-reset-user-with-loading" class="mt-4 vs-con-loading__container">
        <div class="flex flex-wrap items-center">
            <div class="vx-row mb-4">
                <div class="vx-col w-full md:w-1/2">
                    <vs-input 
					class="w-full mt-4" 
					placeholder="Usuario" 
					v-model="username" 
					v-on:keyup.enter="buscar" 
					v-validate="'required|min:4|max:8|numeric'" 
					name="Usuario" 
					icon="icon-search" 
					icon-pack="feather" >
					</vs-input>
                    <span class="text-danger text-sm">{{ errors.first('Usuario') }}</span>
                </div>
                <div class="vx-col w-full md:w-1/2">
                    <vs-button @click="buscar" icon-pack="feather" icon="icon-search" id="button-reset-with-loading" class="mr-4 mt-4 vs-con-loading__container">Buscar</vs-button>
                </div>
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2">
                <label class="text-sm opacity-75">ID</label>
                <vs-input class="w-full mb-4" placeholder="Id" disabled v-model="id" v-validate="'required'" name="Id"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('Id') }}</span>
            </div>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2">
                <label class="text-sm opacity-75">Nombres</label>
                <vs-input class="w-full mb-4" placeholder="Nombres" v-model="firstname" v-validate="'required'" name="Nombres"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('Nombres') }}</span>

                <label class="text-sm opacity-75">Email</label>
                <vs-input class="w-full mb-4" placeholder="Email" v-model="email" v-validate="'required|email'" name="Email"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('Email') }}</span>
            </div>
            <div class="vx-col w-full md:w-1/2">
                <label class="text-sm opacity-75">Apellidos</label>
                <vs-input class="w-full mb-4" placeholder="Apellidos" v-model="lastname" v-validate="'required'" name="Apellidos"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('Apellidos') }}</span>

                <label class="text-sm opacity-75">Estado</label>
                <vs-input class="w-full mb-4" placeholder="Estado" v-model="estado" v-validate="'required'" name="Estado"></vs-input>
                <span class="text-danger text-sm">{{ errors.first('Estado') }}</span>
            </div>
        </div>

        <label class="text-sm opacity-75">Nueva contraseña</label>
        <vs-input class="w-full mb-4" type="password" placeholder="Contraseña" v-model="password" v-validate="'required|min:4|max:20'" name="Password"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Password') }}</span>

        <div class="flex flex-wrap items-center justify-end">
            <vs-button @click="guardar" :disabled="!validateForm" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
            <vs-button @click="resetAll" class="ml-4 mt-2" icon-pack="feather" icon="icon-x-circle" type="border" color="danger">Resetear</vs-button>
        </div>
    </vx-card>
</template>
<script>
export default {
    data(){
        return {
            id:'',
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            estado: '',

            backgroundLoading: 'primary',
            colorLoading: '#fff',
        }
    },

    computed: {
        validateForm () {
            return !this.errors.any() && this.username !== '' && this.firstname !== '' && this.lastname !== '' && this.email !== '' && this.password !== '';
        }
    },

    methods: {
        buscar(){
            if(this.username.length === 0){
                this.showMessageAlert('Ingrese número de documento');
                return;
            }
            this.reset();
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-reset-with-loading",
                scale: 0.45
            })
            this.$store.dispatch('acceso/searchUser', this.username)
            .then(response => {
                this.$vs.loading.close("#button-reset-with-loading > .con-vs-loading");
                if(response.status === 200){
                    const data = response.data[0];
                    this.id = data.id;
					this.lastname= data.lastName;
					this.firstname= data.firstName;
					this.email= data.email;
                    this.estado = data.enabled ? 'ACTIVO' : 'BLOQUEADO'	
                }
            })
            .catch(error => {
                this.$vs.loading.close("#button-reset-with-loading > .con-vs-loading");
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        guardar(){
            if(this.estado === 'BLOQUEADO'){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'warning',
                    title: `Aviso`,
                    text: 'Usuario ' + this.id + ' está bloqueado. Habilite para resetear.',
                    acceptText: 'Aceptar',
                });
                return;
            }

            const payload = {
                id: this.id,
                params: {
                    password: this.password.trim()
                }
            }

            this.$vs.loading({
                container: '#div-reset-user-with-loading',
                scale: 0.7
            });
            this.$store.dispatch('acceso/resetPasswordUser', payload)
            .then(response => {
                this.$vs.loading.close('#div-reset-user-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.showMessageSuccess('Contraseña reseteado de forma correcta.');
                    this.resetAll();
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-reset-user-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });

        },

        reset(){
            this.id = '';
			this.lastname= '';
			this.firstname= '';
			this.email= '';
            this.estado = '';
            this.password = '';
        },

        resetAll(){
            this.username = '';
            this.id = '';
			this.lastname= '';
			this.firstname= '';
			this.email= '';
            this.estado = '';
            this.password = '';
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
    }
}
</script>