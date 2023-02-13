<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.nombres">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.nombres }}</p>
      <small>{{ activeUserInfo.cargo }}</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img v-if="photoURL" key="onlineImg" :src="photoURL" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Perfil</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Salir</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      photoURL: require("../../../../assets/images/portrait/small/user.png"),
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.auth.appActiveUser();
    },
  },

  methods: {
    logout() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmar',
        text: `¿Está seguro de cerrar la sesion?`,
        accept: this.accept,
        acceptText: 'Aceptar',
        cancelText: 'Cancelar'
      });
    },

    accept(){
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
      })
      .catch(error => {
        this.$vs.notify({
            title: 'Aviso',
            text: error.message,
            position:'top-center',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'warning'
        });
      });
    }
  }
}
</script>
