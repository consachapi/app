import axios from 'axios';

export default {
    SET_BEARER (state, accessToken) {
        //axios.defaults.headers.common['Content-Type'] = `application/json`;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    },

    UPDATE_USER_INFO(state, payload) {
        let userInfo = JSON.parse(localStorage.getItem("userInfo")) || state.appActiveUser()
        for (const property of Object.keys(payload)) {
            if (payload[property] != null) {
                state.appActiveUser[property] = payload[property]
                userInfo[property] = payload[property]
            }
        }
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },

    UPDATE_EJEC_INFO(state, payload){
        if(payload === null || payload === undefined || payload === ''){
            let ejecInfo = {
                value: '',
                label: 'Gobierno Regional de Cusco'
            };
            localStorage.setItem("ejecInfo", JSON.stringify(ejecInfo))
        } else {
            let ejecInfo = {};
            for (const property of Object.keys(payload)) {
                if (payload[property] != null) {
                    state.appUnidadEjec[property] = payload[property]
                    ejecInfo[property] = payload[property]
                }
            }
            localStorage.setItem("ejecInfo", JSON.stringify(ejecInfo))
        }
    }

}