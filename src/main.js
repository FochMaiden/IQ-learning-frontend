import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store/store';
import Auth from './util/auth';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.mixin(Auth);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app');
