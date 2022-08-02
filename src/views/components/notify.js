export const myNotify = {
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
//https://jasonwatmore.com/post/2019/03/08/vuejs-role-based-authorization-tutorial-with-example
    showMessageSuccess(message){
        console.log(this);
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
        if(status === 400){
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
            this.popupVerificacionCama = false,
            this.popupPersona = false,
            this.popupBalon = false,
            this.$store.dispatch("logout").then(() => {
                this.$router.push('/login').catch(() => {})
            });
        }
        if(status === 403){
            this.$vs.notify({
                title: 'ALERTA',
                text: 'No tiene permisos para esta proceso.',
                position:'top-center',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
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
    },
}

export const grantType = 'password';