import Vue from 'vue'
import Vuex from 'vuex'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

Vue.use(Vuex)

import moduleAuth from './auth/moduleAuth.js';
//import moduleAcceso from './acceso/moduleAcceso.js';
import moduleControl from './control/moduleControl.js';
import moduleRemediacion from './remediacion/moduleRemediacion.js';
import moduleCActividad from './cactividad/moduleCActividad.js';
import moduleRActividad from './ractividad/moduleRActividad.js';

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
        auth: moduleAuth,
        control: moduleControl,
        remediacion: moduleRemediacion,
        //acceso: moduleAcceso,
        cactividad: moduleCActividad,
        ractividad: moduleRActividad
    },
    strict: process.env.NODE_ENV !== 'production'
})
