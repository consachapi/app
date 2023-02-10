import axios from 'axios';
import { apiUrl } from '@/environment/env.js';

export default {
    fetchDocumentosRemediacionByActividadRemediacion(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/remediacion/listar/actividad/${ id }`,
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

    showDocumentoRemediacion(context, archivo){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/remediacion/mostrar/${ archivo }`,
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

    deleteDocumentoRemediacion(context, idDocumento){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/remediacion/eliminar/${ idDocumento }`,
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
 
}