<template>
  <nav style="height: auto">
    <v-app-bar color="rgb(255, 255, 255, 0)" fixed app flat>
      <!-- <v-app-bar-nav-icon v-on:click="drawer = !drawer"> </v-app-bar-nav-icon>-->
      <v-toolbar-title v-if="!isUserRoute">IQ Learning</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items >
        <v-btn
          to="/user"
          text
          color="primary"
          v-if="this.$auth.check() && !isUserRoute"
          >{{ $auth.user().username }}
        </v-btn>
        <v-btn
          text
          color="primary"
          v-if="this.$auth.check() && !isUserRoute"
          v-on:click="logout"
        >
          <v-icon small color="primary">fas fa-sign-out-alt</v-icon>
        </v-btn>
        <v-btn
          v-else
          color="primary"
          text
          :to="link.link"
          :key="link.title"
          v-for="link in links"
        >
          {{ link.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <!--    <v-navigation-drawer v-model="drawer" app>
      <p>aaa</p>
    </v-navigation-drawer>-->
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      links: [
        { title: 'Login', link: '/login' },
        { title: 'Register', link: '/register' },
      ],
    };
  },
  methods: {
    logout() {
      this.$auth.logout({
        makeRequest: true,
        url: '/user/logout',
        method: 'POST',
        data: {
          token: localStorage.getItem('default_auth_token'),
        },
        //redirect: { name: "home" }
        success: async function(response) {
          console.log('Logout successful');
        },
        error: function(err) {
          console.log('Error during logout');
        },
        redirect: { name: 'login' },
      });
    },
  },
  computed: {
    isUserRoute() {
      const path = this.$route.path;
      return path.split('/')[1] === 'user';
    },
  },
};
</script>

<style scoped></style>
