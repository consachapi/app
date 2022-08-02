<template>
    <vx-card class="mb-base" no-shadow card-border>
        <div class="flex items-end">
            <feather-icon svgClasses="w-5 h-5" icon="FileIcon" class="mr-2" />
            <span class="font-medium leading-none">Administración de Usuarios</span>
        </div>

        <vs-divider />

        <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">
            <vs-tab icon-pack="feather" icon="icon-user" :label="!isSmallerScreen ? 'Crear Usuario' : ''">
                <div class="tab-change-pwd md:ml-4 md:mt-4 mt-4 ml-0">
                    <nuevo-usuario />
                </div>
            </vs-tab>
            <vs-tab icon-pack="feather" icon="icon-lock" :label="!isSmallerScreen ? 'Resetear Contraseña' : ''">
                <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
                    <reset-password />
                </div>
            </vs-tab>
        </vs-tabs>
        
    </vx-card>
</template>
<script>
import NuevoUsuario from './NuevoUsuario.vue';
import ResetPassword from './ResetPassword.vue';
export default {
    components: {
        NuevoUsuario,
        ResetPassword
    },

    computed: {
        isSmallerScreen () {
            return this.$store.state.windowWidth < 768;
        }
    }
}
</script>