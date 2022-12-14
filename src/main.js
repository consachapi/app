import Vue from 'vue';
import App from './App.vue';

import Vuesax from 'vuesax';
import 'material-icons/iconfont/material-icons.css';
import 'vuesax/dist/vuesax.css';
Vue.use(Vuesax);

// axios
import axios from "./axios.js"
Vue.prototype.$http = axios

import '../themeConfig.js';
import './globalComponents.js';
import './assets/scss/main.scss';
import '@/assets/css/main.css';
import router from './router';
import store from './store/store';
import { VueHammer } from 'vue2-hammer';
Vue.use(VueHammer);
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import es from 'vee-validate/dist/locale/es';
import VeeValidate, { Validator } from 'vee-validate';
Vue.use(VeeValidate);
Validator.localize("es", es);

require('./assets/css/iconfont.css');

router.beforeEach((to, from, next) => {
    let auth = to.matched.some(record => record.meta.requiresAuth);
    let visit = to.matched.some(record => record.meta.requiresVisitor);
    if(auth){
        if (!store.getters.isLoggedIn) {
            next('/login');
        } else {
            if(to.meta.authorize === undefined){
                next();
            } else {
                const findRole =  to.meta.authorize.find(item => item === store.getters.userRole);
                if(findRole === undefined){
                    next('/');
                } else {
                    next();
                }
            }
        }
    } else if(visit) {
        if (store.getters.isLoggedIn) {
			next('/');
		} else {
			next();
		}
    } else {
        next();
    }
});

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
