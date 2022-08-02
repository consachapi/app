import axios from 'axios';
import { apiUrl } from '@/constants/config';

export default {
    fetchPersonas(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${apiUrl}/persona/listar?page=${ payload.currentx - 1 }&size=${ payload.sizePage }`,
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

    buscarPersona(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/buscar/${ payload.numero }?page=${ payload.currentx - 1 }&size=${ payload.sizePage }`,
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

    crearPersona(context, dataParams){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/crear`,
				method: 'POST',
                data: dataParams
			})
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    editarPersona(context, payload){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/editar/${ payload.ndocumento}`,
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

    eliminarPersona(context, ndocumento){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/eliminar/${ ndocumento }`,
				method: 'DELETE',
			})
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    mostrarPersona(context, ndocumento){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/mostrar/${ ndocumento }`,
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

    consultarPersona(context, ndocumento){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${ apiUrl }/persona/consultar/${ ndocumento }`,
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

    fetchCargo(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${apiUrl}/cargo/seleccionar`,
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

    fetchPerfil(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
				url: `${apiUrl}/perfil/seleccionar`,
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