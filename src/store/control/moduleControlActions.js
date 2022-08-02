import axios from 'axios';
import { apiUrl } from '@/constants/config';

export default {
    fetchProductos(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/listar`,
                method: 'GET',
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    fetchSeleccionarProductos(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/seleccionar`,
                method: 'GET',
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    saveProducto(context, params){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/crear`,
                method: 'POST',
                data: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    deleteProducto(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/eliminar/${id}`,
                method: 'DELETE'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    showProducto(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/mostrar/${id}`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    editProducto(context, params){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/producto/editar/${params.id}`,
                method: 'PUT',
                data: params.data
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    
    fetchRiesgos(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/listar`,
                method: 'GET',
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    fetchRiesgosByProducto(context, producto){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/buscar/producto/${ producto }`,
                method: 'GET',
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    saveRiesgo(context, params){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/crear`,
                method: 'POST',
                data: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    updateRiesgo(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/editar/${ payload.id }`,
                method: 'PUT',
                data: payload.data
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    showRiesgo(context, riesgo){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/mostrar/${ riesgo }`,
                method: 'GET',
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    deleteRiesgo(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/riesgo/eliminar/${id}`,
                method: 'DELETE'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    saveMedidaControl(context, params){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/medidas/control/crear`,
                method: 'POST',
                data: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    updateMedidaControl(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/medidas/control/editar/${ payload.id }`,
                method: 'PUT',
                data: payload.data
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    fecthMedidaControl(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/medidas/control/listar`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    deleteMedidaControl(context, medida){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/medidas/control/eliminar/${ medida }`,
                method: 'DELETE'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    findMedidaControlById(context, medida){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/medidas/control/mostrar/${ medida }`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    fecthAllMedioVerificacion(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/listar`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    fecthMedioVerificacionByMedidaControl(context, medidaControl){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/buscar/mcontrol/${ medidaControl }`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    saveMedioVerificacion(context, paramsData){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/crear`,
                method: 'POST',
                data: paramsData
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    findMedioVerificacionById(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/mostrar/${ id }`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    saveOficinasMedioVerificacion(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/asignar/responsable/${ payload.id }`,
                method: 'POST',
                data: payload.oficinas
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    saveActividadMedioVerificacion(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/actividad/control/crear/${ payload.id }`,
                method: 'POST',
                data: payload.data
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    fetchActividadMedioVerificacion(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/actividad/control/listar/cverificacion/${ id }`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    deleteActividadControl(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/actividad/control/eliminar/${ id }`,
                method: 'DELETE'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    finalizeActividadControl(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/actividad/control/finalizar/${ id }`,
                method: 'PUT'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

    fecthMedioVerficacionByUsuario(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/control/verificacion/listar/usuario`,
                method: 'GET'
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        }); 
    },

}
