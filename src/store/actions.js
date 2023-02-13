//import axios from 'axios';
//import { apiUrl, apiAuth } from '@/constants/config';

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
/*
  notify({ commit }, enabled){
    if(enabled){
      localStorage.setItem('msg', '1');
    } else {
      localStorage.removeItem('msg');
    }
    commit('notify_active', enabled);
  }*/
}

export default actions
