import axios from 'axios';
import { apiUrl, apiAuth } from '@/constants/config';

const actions = {
  updateVerticalNavMenuWidth({ commit }, width) {
    commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
  },
  updateStarredPage({ commit }, payload) {
    commit('UPDATE_STARRED_PAGE', payload)
  },
  arrangeStarredPagesLimited({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_LIMITED', list)
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_MORE', list)
  },
  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY')
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val)
  },
  updateUserInfo({ commit }, payload) {
    commit('UPDATE_USER_INFO', payload)
  },

  role({ commit }) {
    return new Promise((resolve, reject) => {
      axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
      axios({
        url: `${ apiUrl }/usuario/roles`,
        method: 'GET'
      })
      .then(response => {
        if(response.status === 200){
          const encodedRole = window.btoa(response.data.role);
          localStorage.setItem('role', encodedRole);
          commit('role_user', response.data);
        }
        resolve(response);
      })
      .catch(error => {
        commit('role_error');
        if (error.response) {
          reject(error.response);
        } else {
          reject(new Error('ERROR_NETWORK'));
        }
      })
    })
  },

  ejecutora({commit}, data){
    const encodedEjecutora = window.btoa(data.codigo);
    const encodedEjecutoraName = window.btoa(data.ejecutora);
    const encodedAnioEjecucion = window.btoa(data.anio);

    localStorage.setItem('codigo', encodedEjecutora);
    localStorage.setItem('ejecutora', encodedEjecutoraName);
    localStorage.setItem('anio', encodedAnioEjecucion);
    commit('user_ejecutora', data);
  },

  login({ commit }, params) {
    return new Promise((resolve, reject) => {
      delete axios.defaults.headers.common['Access-Control-Allow-Origin'];
      axios({
        url: `${ apiAuth }/protocol/openid-connect/token`,
        data: params,
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .then(response => {
        if(response.status === 200){
          const token = response.data.access_token;
          localStorage.setItem('token', token);
          commit('auth_success', response.data);
        }
        resolve(response);
      })
      .catch(err => {
        commit('auth_error');
        localStorage.removeItem('token');
        localStorage.removeItem('codigo');
        localStorage.removeItem('ejecutora');
        localStorage.removeItem('anio');
        localStorage.removeItem('role');
        reject(err.response);
      })
    })
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('logout')
      localStorage.removeItem('token');
      localStorage.removeItem('codigo');
      localStorage.removeItem('ejecutora');
      localStorage.removeItem('anio');
      localStorage.removeItem('role');
      resolve()
    })
  },

  notify({ commit }, enabled){
    if(enabled){
      localStorage.setItem('msg', '1');
    } else {
      localStorage.removeItem('msg');
    }
    commit('notify_active', enabled);
  }
}

export default actions
