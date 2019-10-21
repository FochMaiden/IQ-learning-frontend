<template>
  <nav>
    <v-app-bar absolute app>
      <v-app-bar-nav-icon class="grey--text" v-on:click="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-toolbar-title>Title</v-toolbar-title>
	    <v-spacer></v-spacer>
	    <v-toolbar-items >
		    <v-btn text :to="link.link" v-for="link in links">{{link.title}}</v-btn>
	    </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer  v-model="drawer" app>
      <p>aaa</p>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
	return {
	  drawer: false,
	  links: [
		{ title: "Login",  link: "/login" },
		{ title: "Register",  link: "/register" },
	  ]
	}
  },
};
</script>

<style scoped></style>
