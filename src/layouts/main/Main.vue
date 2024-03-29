<template>
  <div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">

    <v-nav-menu
      :navMenuItems = "navMenuItems"
      title         = "SIMECR"
      parent        = ".layout--main" />

    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay" />

    <!-- Navbar -->
    <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
      <the-navbar-horizontal
        :navbarType= "navbarType"
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />

      <div style="height: 62px" v-if="navbarType === 'static'"></div>

      <h-nav-menu
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"
        :navMenuItems="navMenuItems" />
    </template>

    <template v-else>
      <the-navbar-vertical
        :navbarColor="navbarColor"
        :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />
    </template>
    <!-- /Navbar -->

      <div class="content-wrapper">

        <div class="router-view">
          <div class="router-content">

            <transition :name="routerTransition">

              <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="router-header flex flex-wrap items-center mb-6">
                <div
                  class="content-area__heading"
                  :class="{'pr-4 border-0 md:border-r border-solid border-grey-light' : $route.meta.breadcrumb}">
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route" :isRTL="$vs.rtl" />

                <!-- DROPDOWN -->
                <vs-dropdown vs-trigger-click class="ml-auto md:block hidden cursor-pointer">
                  <vs-button radius icon="icon-settings" icon-pack="feather" />

                  <vs-dropdown-menu class="w-32">
                    <vs-dropdown-item>
                      <div @click="$router.push('/pages/profile').catch(() => {})" class="flex items-center">
                        <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                      <div @click="$router.push('/apps/todo').catch(() => {})" class="flex items-center">
                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Tareas</span>
                      </div>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                      <div @click="$router.push('/apps/email').catch(() => {})" class="flex items-center">
                        <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Inbox</span>
                      </div>
                    </vs-dropdown-item>
                  </vs-dropdown-menu>

                </vs-dropdown>

              </div>
            </transition>

            <div class="content-area__content">

              <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500" v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
              </back-to-top>

              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
              </transition>
            </div>
          </div>
        </div>
      </div>
      <the-footer />
    </div>

    <vs-popup title="Aviso" :active.sync="popupNotificacion" :background-color-popup="colorx">
      <strong class="text-primary">Sistema de Medidas de Control y Remediación</strong>
      <vs-alert active="true" class="mt-2" icon-pack="feather" icon="icon-info">
        El sistema se encuentra en modo de PRUEBA
      </vs-alert>

      <p class="mt-4 text-sm text-danger opacity-100">Nota</p>
      <p class="mb-4 text-sm opacity-75">* Los datos registrados seran guardados en una base de datos temporal</p>

      <vs-chip color="success" class="mb-4">
        <span class="font-medium truncate"> Versión 1.0.0</span>
      </vs-chip>

      <vs-divider border-style="dotted" color="primary" />

      <div class="flex flex-wrap-reverse items-center flex-grow justify-end mt-5">
          <vs-button @click="notify" icon-pack="feather" icon="icon-check" color="primary">Aceptar</vs-button>
      </div>
    </vs-popup>

  </div>
</template>

<script>
import BackToTop           from 'vue-backtotop'
import HNavMenu            from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue"

import navMenuSuper        from "@/layouts/components/vertical-nav-menu/navMenuSuper.js"
import navMenuAdmin        from "@/layouts/components/vertical-nav-menu/navMenuAdmin.js"
import navMenuUser         from "@/layouts/components/vertical-nav-menu/navMenuUser.js"

import TheNavbarHorizontal from '@/layouts/components/navbar/TheNavbarHorizontal.vue'
import TheNavbarVertical   from '@/layouts/components/navbar/TheNavbarVertical.vue'
import TheFooter           from '@/layouts/components/TheFooter.vue'
import themeConfig         from '@/../themeConfig.js'
import VNavMenu            from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue'

export default {
  components: {
    BackToTop,
    HNavMenu,
    TheFooter,
    TheNavbarHorizontal,
    TheNavbarVertical,
    VNavMenu
  },

  data() {
    return {
      footerType        : themeConfig.footerType  || 'static',
      hideScrollToTop   : themeConfig.hideScrollToTop,
      isNavbarDark      : false,
      navbarColor       : themeConfig.navbarColor || '#fff',
      navbarType        : themeConfig.navbarType  || 'floating',
      navMenuItems      : [],
      routerTransition  : themeConfig.routerTransition || 'none',
      routeTitle        : this.$route.meta.pageTitle,

      colorx:"#e8f2ff",
      popupNotificacion: false
    }
  },

  watch: {
    "$route"() {
      this.routeTitle = this.$route.meta.pageTitle
    },

    isThemeDark(val) {
      const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff"
      this.updateNavbarColor(color)
    },

    "$store.state.mainLayoutType"(val) {
      this.setNavMenuVisibility(val)
    }
  },

  computed: {
    bodyOverlay() { return this.$store.state.bodyOverlay },

    contentAreaClass() {
      if(this.mainLayoutType === "vertical") {
        if      (this.verticalNavMenuWidth == "default") return "content-area-reduced"
        else if (this.verticalNavMenuWidth == "reduced") return "content-area-lg"
        else return "content-area-full"
      }
      // else if(this.mainLayoutType === "boxed") return "content-area-reduced"
      else return "content-area-full"
    },

    footerClasses() {
      return {
        'footer-hidden': this.footerType == 'hidden',
        'footer-sticky': this.footerType == 'sticky',
        'footer-static': this.footerType == 'static',
      }
    },

    isAppPage() {
      return this.$route.meta.no_scroll
    },

    isThemeDark()     { return this.$store.state.theme == 'dark' },
    layoutTypeClass() { return `main-${this.mainLayoutType}` },
    mainLayoutType()  { return this.$store.state.mainLayoutType  },
    navbarClasses()   {
      return {
          'navbar-hidden'   : this.navbarType == 'hidden',
          'navbar-sticky'   : this.navbarType == 'sticky',
          'navbar-static'   : this.navbarType == 'static',
          'navbar-floating' : this.navbarType == 'floating',
      }
    },
    verticalNavMenuWidth() { return this.$store.state.verticalNavMenuWidth },
    windowWidth()          { return this.$store.state.windowWidth }
  },

  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title
    },

    updateNavbarColor(val) {
      this.navbarColor = val
      if (val == "#fff") this.isNavbarDark = false
      else this.isNavbarDark = true
    },

    setNavMenuVisibility(layoutType) {
      if((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
        this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
        this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
      }
      else {
        this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
      }
    },

    createMenu(){
      const role = this.$store.state.auth.appActiveUser().role;
      if(role === 'SUPER'){
        this.navMenuItems = navMenuSuper;
      } else if(role === 'ADMIN'){
        this.navMenuItems = navMenuAdmin;
      } else if(role === 'RESP'){
        this.navMenuItems = navMenuAdmin;
      } else {
        this.navMenuItems = navMenuUser;
      }
    },

    activeNotify(){
      this.$store.dispatch("notify", false);
    },

    notify(){
      this.$store.dispatch("notify", false);
      this.popupNotificacion = false;
    }

  },

  created() {
    const color = this.navbarColor == "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor
    this.updateNavbarColor(color)
    this.setNavMenuVisibility(this.$store.state.mainLayoutType)

    this.createMenu();
    //this.activeNotify();
  },

  mounted(){
    /*
    if(this.$store.getters.activeNotify){
      this.popupNotificacion = true;
      /*
      this.$vs.notify({
        time:8000,
        title:'Módulos Actualizados',
        text:`
        - Usuarios y Accesos.<br>
        - Administración de Balones de Oxígeno.<br>
        - Manten. de Pacientes/Asegurados.`,
        position:'top-center',
        color:'primary',
        iconPack: 'feather',
        icon: 'icon-bell',
        click: () => {
          this.$store.dispatch("notify", false);
        },
      });
    }*/
  }
}

</script>

