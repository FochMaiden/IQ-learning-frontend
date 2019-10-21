import Vue from "vue";
import Router from "vue-router";
import axios from "axios";
import VueAxios from "vue-axios";
import Home from "./components/Home";
import Login from "./components/Login";

//compbell
axios.defaults.baseURL = 'http://localhost:8080/';

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
  refreshData: { enabled: true },
  fetchData: { enabled: true }
});

export default router;
