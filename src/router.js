import Vue from "vue";
import Router from "vue-router";
import axios from "axios";
import VueAxios from "vue-axios";
import Home from "./pages/Home";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";

//compbell
axios.defaults.baseURL = "http://localhost:8080";

Vue.use(Router);
Vue.use(VueAxios, axios);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

Vue.router = router;

Vue.use(require("@websanova/vue-auth"), {
  auth: require("@websanova/vue-auth/drivers/auth/bearer.js"),
  http: require("@websanova/vue-auth/drivers/http/axios.1.x.js"),
  router: require("@websanova/vue-auth/drivers/router/vue-router.2.x.js"),
  refreshData: {
    /*    url: "/user/refresh",
    method: "GET",*/
    enabled: false
  },
  loginData: {
    url: "/user/token",
    method: "POST",
    fetchUser: false,
    redirect: "/"
  },
  registerData: { url: "auth/register", method: "POST", redirect: "/" },
  fetchData: {
    url: "/user/refresh",
    method: "GET",
    enabled: true,
    success: function(d) {
      if (Vue.auth.check()) {
        Vue.auth.user(d.data);
      }
    }
  }
});

export default router;
