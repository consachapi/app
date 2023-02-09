import EventEmitter from 'events';

const localStorageKey = 'loggedIn';
const tokenExpireKey = 'expiresIn';

class AuthService extends EventEmitter {
    idToken = null;
    profile = null;

    isAuthenticated(){
        const expire = localStorage.getItem(tokenExpireKey);
        return (   
            //new Date(Date.now()) < new Date(parseInt(expire)) && localStorage.getItem(localStorageKey) === 'true'
            localStorage.getItem(localStorageKey) === 'true'
        );
    }

    activeUserInfo(){
        const userInfoLocalStorage = JSON.parse(localStorage.getItem('userInfo')) || {};
        const userInfo = {}
        Object.keys(userInfoLocalStorage).forEach((key) => {
            if (userInfo[key] === undefined && userInfoLocalStorage[key] !== null) userInfo[key] = userInfoLocalStorage[key]
        })
        return userInfo;
    }

}

export default new AuthService();