<template>
  <nav style="height: auto">
    <v-app-bar fixed app>
      <!-- <v-app-bar-nav-icon v-on:click="drawer = !drawer"> </v-app-bar-nav-icon>-->
      <v-toolbar-title>IQ Learning</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" v-if="this.$auth.check()"
          >{{ this.$auth.user().username }}
        </v-btn>
        <v-btn
          text
          color="primary"
          v-if="this.$auth.check()"
          v-on:click="logout"
        >
          <v-icon small color="primary">fas fa-sign-out-alt</v-icon>
        </v-btn>
        <v-btn
          v-else
          color="primary"
          text
          :to="link.link"
          v-for="link in links"
          >{{ link.title }}</v-btn
        >
      </v-toolbar-items>
    </v-app-bar>
    <!--    <v-navigation-drawer v-model="drawer" app>
      <p>aaa</p>
    </v-navigation-drawer>-->
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      drawer: false,
      links: [
        { title: "Login", link: "/login" },
        { title: "Register", link: "/register" }
      ]
    };
  },
  methods: {
    logout() {
      this.$auth.logout({
        redirect: { name: "home" }
      });
    }
  }
};
</script>

<style scoped></style>
