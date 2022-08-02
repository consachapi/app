import state from "./state";

const getters = {
  windowBreakPoint: state => {
    if (state.windowWidth >= 1200) return "xl"
    else if (state.windowWidth >= 992) return "lg"
    else if (state.windowWidth >= 768) return "md"
    else if (state.windowWidth >= 576) return "sm"
    else return "xs"
  },

  scrollbarTag: state => {
    return state.is_touch_device ? 'div' : 'VuePerfectScrollbar';
  },

  activeNotify: state => state.notify,

  isLoggedIn: state => !!state.token,
  authStatus: state => state.success,
  userRole: state => state.role,
  userNombre: state => state.nombre,
  userCargo: state => state.cargo,
  userIpress: state => state.ipress,
  userIpressName: state => state.ipressName,
  userServicio: state => state.servicio
};

export default getters;
