import axios from 'axios';
import authConfig from '../../../auth_config.json';

axios.defaults.headers.common['Authorization'] = `Bearer ${ localStorage.getItem('accessToken') }`;
export default {
    init(){
        console.log('Iniciando...');
    },

    login(username, password){
        const obj = {
            username,
            password,
            grant_type: authConfig.grantType,
            client_id: authConfig.clientId
        };

        const data = Object.keys(obj)
            .map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&');

        axios.defaults.baseURL = 'http://127.0.0.1:8080/auth/realms/simecr';/////DEVELOPER MODE
        return axios.post('/protocol/openid-connect/token', data, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });
    },

    role(){
        axios.defaults.baseURL = 'http://127.0.0.1:7012/v1';/////DEVELOPER MODE
        return axios.get('/usuario/roles');
    },

    logout () {
        axios.defaults.baseURL = 'http://127.0.0.1:7012/v1';/////DEVELOPER MODE
        return axios.delete(`/usuario/logout/${ localStorage.getItem('sessionState') }`);
    },

}