import router from '@/router';
import auth from '../../http/auth/service.js';

export default {
    login({ commit }, payload){
        return new Promise(( resolve, reject) => {
            auth.login(payload.username, payload.password)
            .then( response => {
                if(response.status === 200){
                    commit('SET_BEARER', response.data.access_token);
                    resolve(response);
                }
            })
            .catch( error => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('sessionState');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
                localStorage.removeItem("ejecInfo");
                if(error.response.data.error_description === 'Account disabled'){
                    reject({message: 'El usuario bloqueado'})
                }
                reject({message: 'El usuario o contraseña es incorrecta'})
            });
        });
    },

    fetchRole({ commit }){
        return new Promise((resolve, reject) => {
            auth.role()
            .then( response => {
                if(response.status === 200){
                    commit('UPDATE_USER_INFO', response.data);
                    resolve(response);
                } else {
                    reject({message: 'Ocurrio un error al actualizar el usuario.'});
                }
            })
            .catch( error => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('sessionState');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
                localStorage.removeItem("ejecInfo");
                reject({message: 'Ocurrio un error al extraer la información del usuario.'});
            });
        });
    },

    setTokenAndEjecStorage({commit}, payload){
        localStorage.setItem('accessToken', payload.dataAuth.access_token);
        localStorage.setItem('expiresIn', new Date().getTime() + payload.dataAuth.expires_in * 1000);
        localStorage.setItem('sessionState', payload.dataAuth.session_state);
        localStorage.setItem('loggedIn', 'true');
        commit('UPDATE_EJEC_INFO', payload.dataEjec);
        router.push(router.currentRoute.query.to || '/');
    },

    logout({commit}){
        return new Promise((resolve, reject) => {
            auth.logout()
            .then( response => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('sessionState');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
                localStorage.removeItem("ejecInfo");
                resolve({message: 'Sesión cerrado de formado correcta'});
                router.push('/login');
            })
            .catch( error => {
                if(error.message === 'Network Error'){
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('expiresIn');
                    localStorage.removeItem('sessionState');
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem("ejecInfo");
                    resolve({ message: 'Sesión cerrado de formado correcta' });
                    router.push('/login');
                }
                const status = error.response.status;
                let message = "Ups!!!. Ocurrio un error al cerrar la sesión.";
                if(status === 401){
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('expiresIn');
                    localStorage.removeItem('sessionState');
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem("ejecInfo");
                    resolve({ message: 'Sesión cerrado de formado correcta' });
                    router.push('/login');
                }
                reject({ message });
            });
        });
    },

    cancel(context){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('sessionState');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userInfo');
        localStorage.removeItem("ejecInfo");
    }
    
}