import state from './moduleAccesoState.js';
import mutations from './moduleAccesoMutations.js';
import actions from './moduleAccesoActions.js';
import getters from './moduleAccesoGetters.js';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}