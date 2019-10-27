<template>
  <v-app v-if="$auth.ready()">
    <!--    <v-navigation-drawer app>
      &lt;!&ndash; &ndash;&gt;
    </v-navigation-drawer>-->
    <Navbar />
    <!-- Sizes your content based upon application components -->
    <v-content id="content">
      <router-view />
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
	import Navbar from "./components/nav/Navbar";

	export default {
  name: "App",
  components: {
    Navbar
  },
  data: () => ({
    //
  })
};
</script>
