import state from './moduleControlState';
import mutations from './moduleControlMutatios.js';
import actions from './moduleControlActions.js';
import getters from './moduleControlGetters.js';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}