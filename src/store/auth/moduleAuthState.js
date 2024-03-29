import auth from '@/auth/auth-service.js';

export default {

    isUserLoggedIn: () => {
        let isAuthenticated = false;
        if (auth.isAuthenticated()) isAuthenticated = true
        else isAuthenticated = false
        return localStorage.getItem('userInfo') !== null && isAuthenticated;
    },

    appActiveUser: () => {
        const userInfoLocalStorage = JSON.parse(localStorage.getItem('userInfo')) || {}
        const userInfo = {}
        Object.keys(userInfoLocalStorage).forEach((key) => {
            if (userInfo[key] === undefined && userInfoLocalStorage[key] !== null) userInfo[key] = userInfoLocalStorage[key]
        })
        return userInfo;
    },

    appUnidadEjec: () => {
        const ejecInfoLocalStorage = JSON.parse(localStorage.getItem('ejecInfo')) || {}
        const ejecInfo = {}
        Object.keys(ejecInfoLocalStorage).forEach((key) => {
            if (ejecInfo[key] === undefined && ejecInfoLocalStorage[key] !== null) ejecInfo[key] = ejecInfoLocalStorage[key]
        })
        return ejecInfo
    }

}