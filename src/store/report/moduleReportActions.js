import axios from 'axios';
import { apiUrl } from '@/constants/config';

export default {
    fetchStockAlmacen(context){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios.defaults.headers.common['X-IPRESS'] = localStorage.getItem('ipress');
            axios({
				url: `${ apiUrl }/almacen/kardex/stock`,
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

    fetchStockTanques(){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios.defaults.headers.common['X-IPRESS'] = localStorage.getItem('ipress');
            axios({
				url: `${ apiUrl }/abastecimiento/tanque/stock`,
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

    fetchCamasOxigeno(){
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            axios.defaults.headers.common['X-IPRESS'] = localStorage.getItem('ipress');
            axios({
				url: `${ apiUrl }/reporte/camas/oxigeno`,
				method: 'GET',
			})
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

}