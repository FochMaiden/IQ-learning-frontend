import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';

//compbell
axios.defaults.baseURL = 'http://localhost:8080';

Vue.use(Router);
Vue.use(VueAxios, axios);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /*    {
      path: '/admin',
      meta: {
        auth: {
          roles: 'admin',
          redirect: {name: 'admin'},
          //forbiddenRedirect: '/admin/403'
        }
      },
      //component: require('./admin')
    },*/
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/Home'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { auth: false },
      component: () => import('./pages/forms/Login'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { auth: false },
      component: () => import('./pages/forms/Register'),
    },
    {
      path: '/user',
      children: [
        {
          path: '',
          component: () => import('./pages/user/Dashboard'),
        },
      ],
      meta: { auth: true },
      component: () => import('./pages/user/User'),
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

Vue.router = router;

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  refreshData: {
    /*    url: "/user/refresh",
    method: "GET",*/
    enabled: false,
  },
  loginData: {
    url: '/user/token',
    method: 'POST',
    fetchUser: false,
    redirect: '/',
  },
  registerData: { url: 'auth/register', method: 'POST', redirect: '/' },
  fetchData: {
    url: '/user/refresh',
    method: 'GET',
    enabled: true,
    success: function(d) {
      if (Vue.auth.check()) {
        Vue.auth.user(d.data);
      }
    },
  },
});

export default router;
