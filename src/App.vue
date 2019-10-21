<template>
  <v-app v-if="$auth.ready()">
    <Login v-if="!$auth.check()" />
    <Home v-else></Home>
  </v-app>
</template>

<script>
import Login from "./components/Login";

export default {
  name: "App",
  components: {
    Login
  },
  data: () => ({
    //
  })
};
</script>
