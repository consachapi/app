import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Bearer ${ localStorage.getItem('accessToken') }`;
axios.defaults.baseURL = 'http://127.0.0.1:7012/v1';/////DEVELOPER MODE
export default {

    fecthAll() {
        return axios.get(`/uejecutora/listar`);
    },

    create(params) {
        return axios.post(`/uejecutora/crear`, params);
    },

    findById(id){
        return axios.get(`/uejecutora/buscar/${ id }`);
    },

    update(payload) {
        return axios.put(`/uejecutora/editar/${ payload.id }`, payload.data);
    },

    disabled(id) {
        return axios.delete(`/uejecutora/bloquear/${ id }`);
    },

    enabled(id) {
        return axios.delete(`/uejecutora/habilitar/${ id }`);
    },


}