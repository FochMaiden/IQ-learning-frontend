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
      name: 'Home',
      component: () => import('./pages/Home'),
    },
    {
      path: '/login',
      name: 'Login',
      meta: { auth: false },
      component: () => import('./pages/forms/Login'),
    },
    {
      path: '/register',
      name: 'Register',
      meta: { auth: false },
      component: () => import('./pages/forms/Register'),
    },
    {
      path: '/user',
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('./pages/user/Dashboard'),
        },
      ],
      redirect: { name: 'Dashboard' },
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
    enabled: false,
  },
  loginData: {
    url: '/user/token',
    method: 'POST',
    headers: {
      Authorization: 'bearer null',
    },
    fetchUser: false,
    redirect: {name: 'Home'}
  },
  registerData: {
    url: '/user/register',
    method: 'POST',
    headers: {
      authorization: 'bearer null',
    },
    redirect: { name: 'Home' },
  },
  logoutData: {
    makeRequest: true,
    url: '/user/logout',
    method: 'DELETE',
    success: function(d) {
      console.log('logout: ');
    },
    error: function(d) {
      console.log('logout: ', d);
    },
    redirect: { name: 'Home' },
  },
  fetchData: {
    url: '/user/fetch',
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
