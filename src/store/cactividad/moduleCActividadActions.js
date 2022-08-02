import axios from 'axios';
import { apiUrl } from '@/constants/config';

export default {
    fetchDocumentosControlByActividadControl(context, id){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/control/listar/actividad/${ id }`,
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

    showDocumentoControl(context, archivo){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/control/mostrar/${ archivo }`,
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

    deleteDocumentoControl(context, idDocumento){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios({
                url: `${ apiUrl }/documento/control/eliminar/${ idDocumento }`,
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