<template>
  <v-container>
    <v-btn v-on:click="clickF">BLA</v-btn>
  </v-container>
</template>

<script>
export default {
  methods: {
    clickF() {
      this.$auth.login({
        url: "/user/register",
        method: "POST",
        headers: {
          authorization: "bearer null"
        },
        data: {
          username: "Archangel",
          password: "calibrate"
        },
        fetchUser: false,
        rememberMe: true,
        success: function(response) {
          console.log(response.data)
          this.$auth.token(null, response.data.sessionID);
          console.log("Im nice");
        },
        error: function(err) {},
        redirect: {name: 'home'},
      });
    }
  }
};
</script>
