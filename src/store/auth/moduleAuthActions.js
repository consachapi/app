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
                    /*
                    auth.role()
                    .then( resp => {
                        if(resp.status === 200){
                            commit('UPDATE_USER_INFO', resp.data);
                            localStorage.setItem('accessToken', response.data.access_token);
                            localStorage.setItem('expiresIn', new Date().getTime() + response.data.expires_in * 1000);
                            localStorage.setItem('sessionState', response.data.session_state);
                            localStorage.setItem('loggedIn', 'true');
                            router.push(router.currentRoute.query.to || '/');
                        }
                    })
                    .catch( error => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('expiresIn');
                        localStorage.removeItem('sessionState');
                        localStorage.removeItem('loggedIn');
                        localStorage.removeItem('userInfo');
                        reject({message: 'Ocurrio un error al extraer la información del usuario.'});
                    });
                    */
                }
            })
            .catch( error => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('sessionState');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
                if(error.response.data.error_description === 'Account disabled'){
                    reject({message: 'El usuario bloqueado'})
                }
                reject({message: 'El usuario o contraseña es incorrecta'})
            });
        });
    },

    setValuesLocalStorage(context, dataAuth){
        localStorage.setItem('accessToken', dataAuth.access_token);
        localStorage.setItem('expiresIn', new Date().getTime() + dataAuth.expires_in * 1000);
        localStorage.setItem('sessionState', dataAuth.session_state);
        localStorage.setItem('loggedIn', 'true');
        //router.push(router.currentRoute.query.to || '/');
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
                console.log(error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('sessionState');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
                reject({message: 'Ocurrio un error al extraer la información del usuario.'});
            });
        });
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
                resolve({message: 'Sesión cerrado de formado correcta'});
                router.push('/login');
            })
            .catch( error => {
                const status = error.response.status;
                let message = "Ups!!!. Ocurrio un error al cerrar la sesión.";
                if(status === 401){
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('expiresIn');
                    localStorage.removeItem('sessionState');
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('userInfo');
                    resolve({ message: 'Sesión cerrado de formado correcta' });
                    router.push('/login');
                }
                reject({ message });
            });
        });
    },
}