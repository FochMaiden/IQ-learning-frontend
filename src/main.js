import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Auth from './util/auth';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.mixin(Auth);

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
