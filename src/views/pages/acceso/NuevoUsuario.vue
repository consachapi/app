<template>
    <vx-card no-shadow card-border id="div-crear-user-with-loading" class="mt-4 vs-con-loading__container">
        <div class="flex flex-wrap items-center">
            <vs-avatar :src="activeUserInfo.photoURL" size="70px" class="mr-4 mb-4" />
            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2 mb-2">
                    <vs-input 
					class="w-full mb-4 mr-4 sm:mb-2" 
					placeholder="Número de doc." 
					v-model="username" 
					v-on:keyup.enter="buscar" 
					v-validate="'required|min:4|max:8|numeric'" 
					name="Nro documento" 
					icon="icon-search" 
					icon-pack="feather" >
					</vs-input>
                    <span class="text-danger text-sm">{{ errors.first('Nro documento') }}</span>
                </div>
                <div class="vx-col w-full md:w-1/2">
                    <vs-button @click="buscar" icon-pack="feather" icon="icon-search" id="button-with-loading" class="mr-4 sm:mb-0 mb-2 vs-con-loading__container">Buscar</vs-button>
                </div>
            </div>
        </div>

        <label class="text-sm opacity-75">Nombres</label>
        <vs-input readonly class="w-full mb-4" placeholder="Nombres del usuario" v-model="firstname" v-validate="'required'" name="Nombres"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Nombres') }}</span>

        <label class="text-sm opacity-75">Apellidos</label>
        <vs-input readonly class="w-full mb-4" placeholder="Apellidos del usuario" v-model="lastname" v-validate="'required'" name="Apellidos"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Apellidos') }}</span>

        <label class="text-sm opacity-75">Email</label>
        <vs-input readonly class="w-full mb-4" placeholder="Correo electrónico" v-model="email" v-validate="'required|email'" name="Email"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Email') }}</span>

        <label class="text-sm opacity-75">Perfil</label>
        <vs-input readonly class="w-full mb-4" placeholder="Perfil del usuario" v-model="perfil" v-validate="'required'" name="perfil"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('perfil') }}</span>

        <label class="text-sm opacity-75">Contraseña</label>
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
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            perfil: '',
            password: '',
            ipress: '',

            backgroundLoading: 'primary',
            colorLoading: '#fff',
        }
    },

    computed: {
        activeUserInfo () {
            return this.$store.state.AppActiveUser
        },
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

            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            })
            this.$store.dispatch('acceso/mostrarPersona', this.username)
            .then(response => {
                this.$vs.loading.close("#button-with-loading > .con-vs-loading");
                if(response.status === 200){
                    const data = response.data;
                    this.username = data.ndocumento;
                    this.firstname = data.nombres;
                    this.lastname = data.apellidos;
                    this.email = data.email;
                    this.perfil = data.perfil.descripcion;
                    this.ipress = data.ipress === null ? '000' : data.ipress.id
                }
            })
            .catch(error => {
                console.log(error);
                this.$vs.loading.close("#button-with-loading > .con-vs-loading");
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        guardar(){

			const paramsData = {
				username: this.username,
				firstname: this.firstname.toUpperCase(),
				lastname: this.lastname.toUpperCase(),
				email: this.email,
                perfil : this.perfil,
				password: this.password.trim(),
                ipress: this.ipress
			};

            this.$vs.loading({
                container: '#div-crear-user-with-loading',
                scale: 0.7
            });
            this.$store.dispatch('acceso/createUser', paramsData)
            .then(response => {
                this.$vs.loading.close('#div-crear-user-with-loading > .con-vs-loading');
                if(response.status === 201){
                    this.showMessageSuccess('Usuario creado de forma correcta.');
                    this.resetAll();
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-crear-user-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });


        },

        resetAll(){
            this.username = '';
            this.firstname = '';
            this.lastname = '';
            this.email = '';
            this.perfil = '';
            this.password = '';
            this.ipress = '';
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