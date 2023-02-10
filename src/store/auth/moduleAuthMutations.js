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

}