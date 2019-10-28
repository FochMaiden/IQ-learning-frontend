<template>
  <v-app v-if="$auth.ready()">
    <!--    <v-navigation-drawer app>
      &lt;!&ndash; &ndash;&gt;
    </v-navigation-drawer>-->
    <Navbar />
    <!-- Sizes your content based upon application pages -->
    <v-content id="content">
      <router-view />
    </v-content>

    <!--    <v-footer app>
      &lt;!&ndash; &ndash;&gt;
    </v-footer>-->
  </v-app>
</template>

<script>
import Navbar from './pages/nav/Navbar';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data: () => ({
    //
  }),
};
</script>
