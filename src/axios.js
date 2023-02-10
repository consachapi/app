// axios
import axios from 'axios';
import store from '@/store/store.js';

import { apiUrl, apiAuth } from '@/environment/env.js';

export default axios.create({
    baseURL: store.state.auth.isUserLoggedIn() ? apiUrl : apiAuth,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
});

/*
const apiCliente =  axios.create({
    baseURL: apiUrl,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
    }
});

export default {
    seleccionarOficina(){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/parametro/oficina/seleccionar`);
    },

    seleccionarEje(){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/parametro/eje/seleccionar`);
    },

    seleccionarComponentePorEje(eje){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/parametro/componente/seleccionar/eje/${ eje }`);
    },

    dashboardMedidaControl(){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/dashboard/medidas/control`);
    },

    dashboardMedidaRemediacion(){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/dashboard/medidas/remediacion`);
    },

    dashboardRiesgoDeficienciaTotal(){
        apiCliente.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/dashboard/riesgo/deficiencia/total`);
    },
    
}
*/